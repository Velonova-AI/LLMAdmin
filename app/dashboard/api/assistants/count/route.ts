import { NextResponse } from "next/server"
import { auth } from "@/app/(auth)/auth"
import { db } from "@/app/dashboard/db"
import { assistants } from "@/lib/db/schema"
import {eq, and, count} from "drizzle-orm"

export async function GET() {
    const session = await auth()
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const assistantsCount = await db
        .select({ count: count() })
        .from(assistants)
        .where(and(eq(assistants.userId, userId)))



    return NextResponse.json({ count: Number(assistantsCount[0].count) || 0 })
}

