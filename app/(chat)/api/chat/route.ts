import {
  type Message,
  createDataStreamResponse,
  smoothStream,
  streamText,
} from 'ai';

import { auth } from '@/app/(auth)/auth';

import {
  deleteChatById,
  getChatById,
  saveChat,
  saveMessages,
} from '@/lib/db/queries';
import {
  generateUUID,
  getMostRecentUserMessage,
  sanitizeResponseMessages,
} from '@/lib/utils';

import { generateTitleFromUserMessage } from '../../actions';
import { createDocument } from '@/lib/ai/tools/create-document';
import { updateDocument } from '@/lib/ai/tools/update-document';
import { requestSuggestions } from '@/lib/ai/tools/request-suggestions';
import { getWeather } from '@/lib/ai/tools/get-weather';
import {Assistant} from "@/lib/db/schema";
import {configureModel} from "@/app/dashboard/model-config";
import {getInformation} from "@/lib/ai/tools/getInformation";

export const maxDuration = 60;



// Define the valid tool names as a type
type ToolName = "getWeather" | "createDocument" | "updateDocument" | "requestSuggestions" | "getInformation"

export async function POST(request: Request) {
  try {
    const { id, messages, selectedChatModel }: { id: string; messages: Array<Message>; selectedChatModel: Assistant } =
        await request.json()

    const session = await auth()

    if (!session || !session.user || !session.user.id) {
      return new Response("Unauthorized", { status: 401 })
    }

    const userMessage = getMostRecentUserMessage(messages)

    if (!userMessage) {
      return new Response("No user message found", { status: 400 })
    }

    const chat = await getChatById({ id })

    if (!chat) {
      const title = await generateTitleFromUserMessage({ message: userMessage })
      await saveChat({ id, userId: session.user.id, title })
    }

    await saveMessages({
      messages: [{ ...userMessage, createdAt: new Date(), chatId: id }],
    })

    const assistant = selectedChatModel
    const model = configureModel(assistant.provider, assistant.apiKey, assistant.modelName)

    // Define the base tools that are always available with proper typing
    const baseTools: ToolName[] = ["getWeather", "createDocument", "updateDocument", "requestSuggestions"]

    // Add getInformation tool only if RAG is enabled
    const activeTools: ToolName[] = assistant.ragEnabled ? [...baseTools, "getInformation"] : baseTools


    // Create a conditional system prompt based on whether RAG is enabled
    let systemPrompt = assistant.systemPrompt || ""

    if (assistant.ragEnabled) {
      // Add instructions to use getInformation tool first when RAG is enabled
      systemPrompt = `${systemPrompt}

IMPORTANT: You have access to a knowledge base through the getInformation tool. When answering questions:

1. FIRST use the getInformation tool to search the knowledge base for relevant information.
2. The tool will return technical data
3. Process this technical data just like you would process weather data or other API responses.
4. Convert the technical information into natural, conversational responses.
5. Never include the raw technical data in your response to the user.
6. If the information from the knowledge base is sufficient, use it to provide your answer.
7. If the information from the knowledge base is incomplete or not available, then use your general knowledge or other tools.
8. Always prioritize information from the knowledge base over your general knowledge when there are conflicts.
9. When using information from the knowledge base, you can mention that the information comes from the user's documents.

This ensures that your responses are accurate and tailored to the user's specific context.

`
    }



    return createDataStreamResponse({
      execute: (dataStream) => {

        const toolsObject: Record<string, any> = {
          getWeather,
          createDocument: createDocument({ session, dataStream }),
          updateDocument: updateDocument({ session, dataStream }),
          requestSuggestions: requestSuggestions({
            session,
            dataStream,
          }),
        }

        // Add getInformation to tools object only if RAG is enabled
        if (assistant.ragEnabled) {
          toolsObject.getInformation = getInformation
        }
        const result = streamText({
          model: model,
          system: systemPrompt ,
          messages,
          maxSteps: 5,
          experimental_activeTools: activeTools,
          experimental_transform: smoothStream({ chunking: "word" }),
          experimental_generateMessageId: generateUUID,
          tools: toolsObject,
          onFinish: async ({ response, reasoning }) => {
            if (session.user?.id) {
              try {
                const sanitizedResponseMessages = sanitizeResponseMessages({
                  messages: response.messages,
                  reasoning,
                })

                await saveMessages({
                  messages: sanitizedResponseMessages.map((message) => {
                    return {
                      id: message.id,
                      chatId: id,
                      role: message.role,
                      content: message.content,
                      createdAt: new Date(),
                    }
                  }),
                })
              } catch (error) {
                console.error("Failed to save chat")
              }
            }
          },
          experimental_telemetry: {
            isEnabled: true,
            functionId: "stream-text",
          },
          temperature: assistant.temperature || undefined,
          maxTokens: assistant.maxTokens || undefined,
        })

        result.mergeIntoDataStream(dataStream, {
          sendReasoning: true,
        })
      },
      onError: (error) => {
        console.error("Error in data stream:", error)
        return "Oops, an error occurred!"
      },
    })
  } catch (error) {
    console.error("Error in POST function:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}


export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Not Found', { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const chat = await getChatById({ id });

    if (chat.userId !== session.user.id) {
      return new Response('Unauthorized', { status: 401 });
    }

    await deleteChatById({ id });

    return new Response('Chat deleted', { status: 200 });
  } catch (error) {
    return new Response('An error occurred while processing your request', {
      status: 500,
    });
  }
}
