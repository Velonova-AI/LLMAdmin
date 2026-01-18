import { auth } from "@/app/(auth)/auth";
import { ChatSDKError } from "@/lib/errors";
import { getAllActiveAssistants, getAllAssistants } from "@/lib/db/customqueries";
import { getProfile } from "@/lib/supabase/profiles";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }

    // Check if user is admin
    const profile = await getProfile(session.user.id);
    const isAdmin = profile?.role === 'admin';

    // Return appropriate assistants based on role
    const assistants = isAdmin 
      ? await getAllAssistants()  // All assistants (active + inactive)
      : await getAllActiveAssistants();  // All active assistants

    return Response.json(assistants, { status: 200 });
  } catch (error) {
    if (error instanceof ChatSDKError) {
      return error.toResponse();
    }

    console.error("Unhandled error in assistants API:", error);
    return new ChatSDKError("offline:chat").toResponse();
  }
}

