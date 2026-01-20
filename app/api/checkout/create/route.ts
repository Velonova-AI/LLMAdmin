import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const body = await request.json();
    const { priceId, planId, email, mode = "subscription" } = body;

    if (!priceId) {
      return NextResponse.json(
        { error: "Price ID is required" },
        { status: 400 }
      );
    }

    let customerId: string | undefined;
    let customerEmail = email;

    // If user is authenticated, get or create Stripe customer
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("stripe_customer_id, email")
        .eq("id", user.id)
        .single();

      if (profile?.stripe_customer_id) {
        customerId = profile.stripe_customer_id;
      } else {
        // Create new Stripe customer
        const customer = await stripe.customers.create({
          email: user.email || profile?.email || undefined,
          metadata: {
            userId: user.id,
          },
        });
        customerId = customer.id;

        // Update profile with Stripe customer ID
        await supabase
          .from("profiles")
          .update({ stripe_customer_id: customerId })
          .eq("id", user.id);
      }
      customerEmail = user.email || profile?.email || email;
    }

    // Create checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      mode: mode as "subscription" | "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/pricing?canceled=true`,
      metadata: {
        planId: planId || "",
        ...(user ? { userId: user.id } : {}),
      },
    };

    // Add customer if authenticated, otherwise use customer_email for guest checkout
    if (customerId) {
      sessionParams.customer = customerId;
    } else if (customerEmail) {
      sessionParams.customer_email = customerEmail;
    }

    // Add subscription metadata if subscription mode
    if (mode === "subscription" && user) {
      sessionParams.subscription_data = {
        metadata: {
          userId: user.id,
          planId: planId || "",
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (error: any) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
