"use server"

import { cookies } from "next/headers"
import { assistantsTable } from "@/lib/db/schema"
import { drizzle } from "drizzle-orm/node-postgres"
import { auth } from "@/app/(auth)/auth"
import { sql } from "drizzle-orm"

// Create a Drizzle ORM instance
const db = drizzle(process.env.POSTGRES_URL!)

// Cookie name for the selected assistant
const SELECTED_ASSISTANT_COOKIE = "selected-assistant-id"

/**
 * Save the selected assistant ID to a cookie
 */
export async function saveSelectedAssistantId(assistantId: string) {
    // Get the cookies instance
    const cookieStore = await cookies()

    // Set the cookie
    cookieStore.set(SELECTED_ASSISTANT_COOKIE, assistantId, {
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        // Set an expiration date (e.g., 30 days)
        maxAge: 60 * 60 * 24 * 30,
    })

    return { success: true }
}

/**
 * Get the selected assistant from the database using the ID stored in cookies
 */
export async function getSelectedAssistant() {
    try {
        // Get the user session
        const session = await auth()
        if (!session || !session.user || !session.user.id) {
            return null
        }

        const userId = session.user.id

        // Get the cookie store
        const cookieStore = await cookies()

        // Get the assistant ID from the cookie
        const assistantId = cookieStore.get(SELECTED_ASSISTANT_COOKIE)?.value

        if (!assistantId) {
            return null
        }

        // Fetch the assistant from the database
        const assistants = await db.select().from(assistantsTable).where(sql`id = ${assistantId} AND "userId" = ${userId}`)

        return assistants.length > 0 ? assistants[0] : null
    } catch (error) {
        console.error("Error getting selected assistant:", error)
        return null
    }
}

