import { NextResponse } from "next/server"
import { auth } from "@/app/(auth)/auth"
import { db } from "@/app/dashboard/db"
import { subscriptions } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
    const session = await auth()
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const userSubscription = await db.select().from(subscriptions).where(eq(subscriptions.userId, userId)).limit(1)

    if (!userSubscription || userSubscription.length === 0) {
        return NextResponse.json({ quantity: 0 })
    }

    return NextResponse.json({ quantity: userSubscription[0].quantity })
}

