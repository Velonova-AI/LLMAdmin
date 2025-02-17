import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import stripe from "@/lib/stripe"
import {auth} from "@/app/(auth)/auth";
import {db} from "@/app/dashboard/db";
import {assistants, subscriptions} from "@/lib/db/schema";
import {eq} from "drizzle-orm";


export async function POST() {
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const userId = session.user.id;
  if (!userId){
    return console.error("no user id found in count");
  }
  const userSubscription =  await db.select().from(subscriptions).
           where(eq(subscriptions.userId, userId)).limit(1);



  if (!userSubscription) {
    return NextResponse.json({ error: "No active subscription" }, { status: 400 })
  }

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: userSubscription[0].stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/billing/`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error("Error creating portal session:", error)
    return NextResponse.json({ error: "Error creating portal session" }, { status: 500 })
  }
}

