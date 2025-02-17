import { NextResponse } from "next/server"
import stripe from "@/lib/stripe"
import {auth} from "@/app/(auth)/auth";


export async function POST(request: Request) {
  const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
  const { priceId, quantity } = await request.json()

  const userId = session.user.id;

  if (!userId){
    return console.error("no user id found in count");
  }

  if (!priceId || !quantity) {
    return NextResponse.json({ error: "Price ID is required" }, { status: 400 })
  }

  // if (typeof priceId !== 'string' || typeof quantity !== 'number') {
  //   return NextResponse.json({ error: "Invalid data types for priceId or quantity" }, { status: 400 });
  // }

  try {
    const stripeSession = await stripe.checkout.sessions.create({

      line_items: [
        {
          price: priceId,
          quantity: quantity,
        },
      ],
      mode: "subscription",
      ui_mode: "embedded",
      return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/billing/done?session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
         userId: userId,
        quantity: quantity.toString(),

      },
    })

    return NextResponse.json({ sessionId: stripeSession.id })  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json({ error: "Error creating checkout session" }, { status: 500 })
  }
}

