import { NextResponse } from "next/server"
import stripe from "@/lib/stripe"
import {auth} from "@/app/(auth)/auth";


export async function POST(request: Request) {
  const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  const { priceId } = await request.json()

  if (!priceId) {
    return NextResponse.json({ error: "Price ID is required" }, { status: 400 })
  }

  try {
    const stripeSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      ui_mode: "embedded",
      return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/billing/done?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        userId: session.user.id,
      },
    })

    return NextResponse.json({ clientSecret: stripeSession.client_secret })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 })
  }
}

