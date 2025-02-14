import { NextResponse } from "next/server"
import { headers } from "next/headers"
import stripe from "@/lib/stripe"

export async function POST(request: Request) {
  const body = await request.text()
  const signature = headers().get("stripe-signature") as string

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }

  let subscription
  let status

  switch (event.type) {
    case "customer.subscription.trial_will_end":
    case "customer.subscription.deleted":
    case "customer.subscription.created":
    case "customer.subscription.updated":
      subscription = event.data.object
      status = subscription.status
      console.log(`Subscription status is ${status}.`)
      // Here you would typically update your database or perform other actions
      break
    default:
      console.log(`Unhandled event type ${event.type}.`)
  }

  return NextResponse.json({ received: true })
}

export const config = {
  api: {
    bodyParser: false,
  },
}

