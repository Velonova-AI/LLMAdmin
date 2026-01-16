import { auth } from "@/app/(auth)/auth";
import { ChatSDKError } from "@/lib/errors";
import { getActiveAssistantsByUserId } from "@/lib/db/queries";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }

    const assistants = await getActiveAssistantsByUserId({
      userId: session.user.id,
    });

    return Response.json(assistants, { status: 200 });
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    console.error("Unhandled error in assistants API:", error);
    return new ChatSDKError("offline:chat").toResponse();
  }
}

