import { auth } from "@/app/(auth)/auth";
import { getMessageCountByUserId } from "@/lib/db/queries";
import { getMessageLimitByUserId } from "@/lib/db/customqueries";
import type { MessageUsage } from "@/lib/types/message-usage";
import { ChatSDKError } from "@/lib/errors";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { profiles } from "@/lib/db/schema/schema";
import type { UserType } from "@/app/(auth)/auth";

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return new ChatSDKError("unauthorized:chat").toResponse();
    }



    // Get profile to access role
    const profileClient = postgres(process.env.DATABASE_URL!);
    const profileDb = drizzle(profileClient);
    
    const profileResult = await profileDb
      .select({
        role: profiles.role,
      })
      .from(profiles)
      .where(eq(profiles.id, session.user.id))
      .limit(1);
    
    const userType: UserType = profileResult.length > 0 && profileResult[0].role
      ? (profileResult[0].role === "guest" || profileResult[0].role === "regular"
          ? profileResult[0].role
          : "regular")
      : session.user.type;

    const messageCount = await getMessageCountByUserId({
      id: session.user.id,
      differenceInHours: 24,
    });

    const limit = await getMessageLimitByUserId(session.user.id);

    const messageUsage: MessageUsage = {
      used: messageCount,
      limit,
      userType,
    };

    console.log("[GET /api/usage/messages] Response:", messageUsage);

    return Response.json(messageUsage);
  } catch (error) {
    console.error("[GET /api/usage/messages] Error:", error);
    return new ChatSDKError("bad_request:api").toResponse();
  }
}
