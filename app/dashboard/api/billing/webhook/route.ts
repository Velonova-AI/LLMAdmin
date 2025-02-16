import { NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import stripe from "@/lib/stripe";
import {db} from "@/app/dashboard/db";
import {assistants, subscriptions} from "@/lib/db/schema";
import {eq} from "drizzle-orm";

export async function POST(request: Request) {
  const body = await request.text()
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');
  // const signature = await  headers().get("stripe-signature") as string

    if (!signature) {
        return NextResponse.json(
            { error: 'Missing stripe-signature header' },
            { status: 400 }
        );
    }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err: any) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message)
    return NextResponse.json({ error: err.message }, { status: 400 })
  }


    const session = event.data.object as Stripe.Checkout.Session

   const qid = session.metadata?.quantity;

  console.log("hi :" + qid);


  if (event.type === "checkout.session.completed") {
      const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

      await db.insert(subscriptions).values({
        userId: session.metadata?.userId!,
        stripeCustomerId: session.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeSubscriptionId: subscription.id,
          quantity: Number.parseInt(session.metadata?.quantity || "1", 10),

          status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      })
    }

    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription

      await db
          .update(subscriptions)
          .set({
            status: subscription.status,
            stripePriceId: subscription.items.data[0].price.id,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          })
          .where(eq(subscriptions.stripeSubscriptionId, subscription.id))
    }

    return NextResponse.json({ received: true })
  }





export const config = {
  api: {
    bodyParser: false,
  },
}

