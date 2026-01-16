import { geolocation } from "@vercel/functions";
import {
  convertToModelMessages,
  createUIMessageStream,
  JsonToSseTransformStream,
  smoothStream,
  stepCountIs,
  streamText,
} from "ai";
import { after } from "next/server";
import {
  createResumableStreamContext,
  type ResumableStreamContext,
} from "resumable-stream";
import { auth, type UserType } from "@/app/(auth)/auth";
import type { VisibilityType } from "@/components/visibility-selector";
import { entitlementsByUserType } from "@/lib/ai/entitlements";
import type { ChatModel } from "@/lib/ai/models";
import { type RequestHints, systemPrompt } from "@/lib/ai/prompts";
import { getLanguageModel } from "@/lib/ai/providers";
import { createDocument } from "@/lib/ai/tools/create-document";
import { getWeather } from "@/lib/ai/tools/get-weather";
import { requestSuggestions } from "@/lib/ai/tools/request-suggestions";
import { updateDocument } from "@/lib/ai/tools/update-document";
import { isProductionEnvironment } from "@/lib/constants";
import {
  createStreamId,
  deleteChatById,
  getAssistantById,
  getChatById,
  getMessageCountByUserId,
  getMessagesByChatId,
  saveChat,
  saveMessages,
  updateChatTitleById,
} from "@/lib/db/queries";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { getMessageLimitByUserId } from "@/lib/db/customqueries";
import { profiles } from "@/lib/db/schema/schema";
import type { DBMessage } from "@/lib/db/schema";
import { ChatSDKError } from "@/lib/errors";
import type { ChatMessage } from "@/lib/types";
import type { MessageUsage } from "@/lib/types/message-usage";
import { convertToUIMessages, generateUUID } from "@/lib/utils";
import { generateTitleFromUserMessage } from "../../actions";
import { type PostRequestBody, postRequestBodySchema } from "./schema";

export const maxDuration = 60;

let globalStreamContext: ResumableStreamContext | null = null;

export function getStreamContext() {
  if (!globalStreamContext) {
    try {
      globalStreamContext = createResumableStreamContext({
        waitUntil: after,
      });
    } catch (error: any) {
      if (error.message.includes("REDIS_URL")) {
        console.log(
          " > Resumable streams are disabled due to missing REDIS_URL"
        );
      } else {
        console.error(error);
      }
    }
  }

  return globalStreamContext;
}

export async function POST(request: Request) {
  let requestBody: PostRequestBody;

  try {
    const json = await request.json();
    requestBody = postRequestBodySchema.parse(json);
  } catch (_) {
    return new ChatSDKError("bad_request:api").toResponse();
  }

  try {
    const {
      id,
      message,
      selectedChatModel,
      selectedVisibilityType,
      selectedAssistantId,
    }: {
      id: string;
      message: ChatMessage;
      selectedChatModel: ChatModel["id"];
      selectedVisibilityType: VisibilityType;
      selectedAssistantId?: string;
    } = requestBody;

    const session = await auth();

    if (!session?.user) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }

    const userType: UserType = session.user.type;

    const messageCount = await getMessageCountByUserId({
      id: session.user.id,
      differenceInHours: 24,
    });

    if (messageCount > entitlementsByUserType[userType].maxMessagesPerDay) {
      return new ChatSDKError("rate_limit:chat").toResponse();
    }

    const chat = await getChatById({ id });
    let messagesFromDb: DBMessage[] = [];
    let titlePromise: Promise<string> | null = null;

    if (chat) {
      if (chat.userId !== session.user.id) {
        return new ChatSDKError("forbidden:chat").toResponse();
      }
      // Only fetch messages if chat already exists
      messagesFromDb = await getMessagesByChatId({ id });
    } else {
      // Save chat immediately with placeholder title
      await saveChat({
        id,
        userId: session.user.id,
        title: "New chat",
        visibility: selectedVisibilityType,
      });

      // Start title generation in parallel (don't await)
      titlePromise = generateTitleFromUserMessage({ message });
    }

    const uiMessages = [...convertToUIMessages(messagesFromDb), message];

    const { longitude, latitude, city, country } = geolocation(request);

    const requestHints: RequestHints = {
      longitude,
      latitude,
      city,
      country,
    };

    // Fetch assistant if selected
    let assistant = null;
    let modelId = selectedChatModel;
    let systemPromptText: string;
    let provider: string | null = null;

    if (selectedAssistantId) {
      assistant = await getAssistantById({ id: selectedAssistantId });
      if (assistant) {
        // Verify the assistant belongs to the user
        if (assistant.userId !== session.user.id) {
          return new ChatSDKError("forbidden:chat").toResponse();
        }
        // Use provider from assistant table, construct modelId as provider/modelName
        provider = assistant.provider;
        modelId = `${provider}/${assistant.modelName}`;
        systemPromptText = assistant.systemPrompt;
      }
    } else {
      // Extract provider from selectedChatModel if no assistant
      provider = selectedChatModel.split("/")[0] || null;
    }

    // Use assistant system prompt if available, otherwise generate one
    if (!assistant) {
      systemPromptText = systemPrompt({ selectedChatModel, requestHints });
    }

    await saveMessages({
      messages: [
        {
          chatId: id,
          id: message.id,
          role: "user",
          parts: message.parts,
          attachments: [],
          createdAt: new Date(),
        },
      ],
    });

    const streamId = generateUUID();
    await createStreamId({ streamId, chatId: id });

    // Get profile to access role for message usage
    const profileClient = postgres(process.env.POSTGRES_URL!);
    const profileDb = drizzle(profileClient);
    
    const profileResult = await profileDb
      .select({
        role: profiles.role,
      })
      .from(profiles)
      .where(eq(profiles.id, session.user.id))
      .limit(1);
    
    const profileRole: UserType = profileResult.length > 0 && profileResult[0].role
      ? (profileResult[0].role === "guest" || profileResult[0].role === "regular"
          ? profileResult[0].role
          : "regular")
      : userType;

    // Capture user ID for use in closure
    const userId = session.user.id;

    // Variable to hold the function that sends message usage
    let sendMessageUsageFn: (() => Promise<void>) | null = null;

    const stream = createUIMessageStream({
      execute: ({ writer: dataStream }) => {
        // Handle title generation in parallel
        if (titlePromise) {
          titlePromise.then((title) => {
            updateChatTitleById({ chatId: id, title });
            dataStream.write({ type: "data-chat-title", data: title });
          });
        }

        const isReasoningModel =
          modelId.includes("reasoning") || modelId.includes("thinking");

        // Debug logging: Check which model is selected
        console.log("=== Model Selection Debug ===");
        console.log("Selected Assistant ID:", selectedAssistantId || "None");
        console.log("Assistant Name:", assistant?.name || "None");
        console.log("Provider (from assistant table):", provider || "None");
        console.log("Model Name (from assistant table):", assistant?.modelName || "None");
        console.log("Model ID (constructed):", modelId);
        console.log("Is Reasoning Model:", isReasoningModel);
        console.log("System Prompt Length:", systemPromptText?.length || 0);
        console.log("System Prompt Preview:", systemPromptText?.substring(0, 100) || "None");
        console.log("=============================");

        const result = streamText({
          model: getLanguageModel(modelId),
          system: systemPromptText,
          messages: convertToModelMessages(uiMessages),
          stopWhen: stepCountIs(5),
          experimental_activeTools: isReasoningModel
            ? []
            : [
              
              ],
          experimental_transform: isReasoningModel
            ? undefined
            : smoothStream({ chunking: "word" }),
          providerOptions: isReasoningModel
            ? {
                anthropic: {
                  thinking: { type: "enabled", budgetTokens: 10_000 },
                },
              }
            : undefined,
          tools: {
          
          },
          experimental_telemetry: {
            isEnabled: isProductionEnvironment,
            functionId: "stream-text",
          },
        });

        result.consumeStream();

        // Create a function to send message usage that can be called after messages are saved
        sendMessageUsageFn = async () => {
          try {
            const updatedMessageCount = await getMessageCountByUserId({
              id: userId,
              differenceInHours: 24,
            });
            const limit = await getMessageLimitByUserId(userId);
            
            const messageUsage: MessageUsage = {
              used: updatedMessageCount,
              limit,
              userType: profileRole,
            };

            // Send message usage through the stream
            dataStream.write({
              type: "data-message-usage",
              data: messageUsage,
            });
          } catch (err) {
            console.error("[POST /api/chat] Error sending message usage:", err);
          }
        };

        dataStream.merge(
          result.toUIMessageStream({
            sendReasoning: true,
          })
        );
      },
      generateId: generateUUID,
      onFinish: async ({ messages }) => {
        await saveMessages({
          messages: messages.map((currentMessage) => ({
            id: currentMessage.id,
            role: currentMessage.role,
            parts: currentMessage.parts,
            createdAt: new Date(),
            attachments: [],
            chatId: id,
          })),
        });

        // Add a small delay to ensure database transaction is committed
        // before counting messages
        await new Promise(resolve => setTimeout(resolve, 100));

        // Send updated message usage after messages are saved
        if (sendMessageUsageFn) {
          await sendMessageUsageFn();
        }
      },
      onError: () => {
        return "Oops, an error occurred!";
      },
    });

    // const streamContext = getStreamContext();

    // if (streamContext) {
    //   return new Response(
    //     await streamContext.resumableStream(streamId, () =>
    //       stream.pipeThrough(new JsonToSseTransformStream())
    //     )
    //   );
    // }

    return new Response(stream.pipeThrough(new JsonToSseTransformStream()));
  } catch (error) {
    const vercelId = request.headers.get("x-vercel-id");

    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    // Check for Vercel AI Gateway credit card error
    if (
      error instanceof Error &&
      error.message?.includes(
        "AI Gateway requires a valid credit card on file to service requests"
      )
    ) {
      return new ChatSDKError("bad_request:activate_gateway").toResponse();
    }

    console.error("Unhandled error in chat API:", error, { vercelId });
    return new ChatSDKError("offline:chat").toResponse();
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new ChatSDKError("bad_request:api").toResponse();
  }

  const session = await auth();

  if (!session?.user) {
    return new ChatSDKError("unauthorized:chat").toResponse();
  }

  const chat = await getChatById({ id });

  if (chat?.userId !== session.user.id) {
    return new ChatSDKError("forbidden:chat").toResponse();
  }

  const deletedChat = await deleteChatById({ id });

  return Response.json(deletedChat, { status: 200 });
}
