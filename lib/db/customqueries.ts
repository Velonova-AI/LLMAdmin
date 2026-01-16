import "server-only";

import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { profiles } from "./schema/schema";
import { entitlementsByUserType } from "@/lib/ai/entitlements";
import type { UserType } from "@/app/(auth)/auth";

// biome-ignore lint: Forbidden non-null assertion.
const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

/**
 * Get message limit from subscriptionMetadata.messages for a user
 * Falls back to entitlementsByUserType if metadata doesn't exist or doesn't have messages key
 */
export async function getMessageLimitByUserId(userId: string): Promise<number> {
  try {
    const profile = await db
      .select({
        subscriptionMetadata: profiles.subscriptionMetadata,
        role: profiles.role,
      })
      .from(profiles)
      .where(eq(profiles.id, userId))
      .limit(1);

    if (profile.length === 0) {
      // No profile found, return default for regular user
      return entitlementsByUserType.regular.maxMessagesPerDay;
    }

    const { subscriptionMetadata, role } = profile[0];

    // Check if subscriptionMetadata exists and has messages key
    if (
      subscriptionMetadata &&
      typeof subscriptionMetadata === "object" &&
      subscriptionMetadata !== null &&
      "messages" in subscriptionMetadata
    ) {
      const messagesValue = (subscriptionMetadata as Record<string, unknown>).messages;

      // If messages is a number, use it directly
      if (typeof messagesValue === "number") {
        return messagesValue;
      }

      // If messages is a string that represents a number, parse it
      if (typeof messagesValue === "string") {
        const parsed = parseInt(messagesValue, 10);
        if (!isNaN(parsed)) {
          return parsed;
        }
      }
    }

    // Fallback to role-based entitlements
    const userType: UserType = (role === "guest" || role === "regular")
      ? role
      : "regular";

    return entitlementsByUserType[userType].maxMessagesPerDay;
  } catch (error) {
    console.error("[getMessageLimitByUserId] Error:", error);
    // Return default on error
    return entitlementsByUserType.regular.maxMessagesPerDay;
  }
}
