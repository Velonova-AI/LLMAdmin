import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { profiles } from "@/lib/db/schema/schema";
import { eq } from "drizzle-orm";

// Route segment config
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-12-15.clover",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Create database connection
const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

export async function POST(request: NextRequest) {
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  // Get the raw body as text for signature verification
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "No signature provided" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const error = err as Error;
    console.error("Webhook signature verification failed:", error.message);
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // Fetch full session with line items to get product/plan details
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items", "subscription"],
    });

    // Extract subscription details if it exists
    let subscriptionId: string | null = null;
    let planName: string | null = null;
    let productName: string | null = null;
    let billingCycle: string | null = null;
    let subscription: Stripe.Subscription | null = null;
    let productMetadata: Record<string, string> = {};

    if (fullSession.subscription) {
      subscription =
        typeof fullSession.subscription === "string"
          ? await stripe.subscriptions.retrieve(fullSession.subscription)
          : fullSession.subscription;

      subscriptionId = subscription.id;

      // Get plan/product details from subscription
      if (subscription.items.data.length > 0) {
        const subscriptionItem = subscription.items.data[0];
        const price = subscriptionItem.price;
        const product =
          typeof price.product === "string"
            ? await stripe.products.retrieve(price.product)
            : price.product;

        // Check if product is deleted
        if (product && "name" in product) {
          productName = product.name;
          planName = price.nickname || product.name;
          // Capture product metadata
          if (product.metadata && Object.keys(product.metadata).length > 0) {
            productMetadata = { ...productMetadata, ...product.metadata };
          }
        } else if (price.nickname) {
          planName = price.nickname;
        }

        // Determine billing cycle
        if (price.recurring) {
          billingCycle = price.recurring.interval; // 'month', 'year', etc.
        }
      }
    } else if (
      fullSession.line_items &&
      fullSession.line_items.data &&
      fullSession.line_items.data.length > 0
    ) {
      // For one-time payments, get details from line items
      const lineItem = fullSession.line_items.data[0];
      const price = lineItem.price;
      if (price) {
        const product =
          typeof price.product === "string"
            ? await stripe.products.retrieve(price.product)
            : price.product;

        // Check if product is deleted
        if (product && "name" in product) {
          productName = product.name;
          planName = price.nickname || product.name;
          // Capture product metadata
          if (product.metadata && Object.keys(product.metadata).length > 0) {
            productMetadata = { ...productMetadata, ...product.metadata };
          }
        } else if (price.nickname) {
          planName = price.nickname;
        }

        if (price.recurring) {
          billingCycle = price.recurring.interval;
        }
      }
    }

    // Get metadata from the full session (which may have more complete data)
    let metadata = fullSession.metadata || session.metadata || {};

    // Also check subscription metadata if it exists (custom fields often end up here)
    if (subscription && subscription.metadata && Object.keys(subscription.metadata).length > 0) {
      metadata = { ...metadata, ...subscription.metadata };
    }

    // Merge product metadata (this is where custom fields like "messages" are stored)
    if (Object.keys(productMetadata).length > 0) {
      metadata = { ...metadata, ...productMetadata };
    }

    // Process the successful checkout
    // Update user subscription status in database
    const customerEmail = session.customer_details?.email;
    console.log("customerEmail", customerEmail);
    const stripeCustomerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer?.id || null;

    // Update profile with subscription data
    if (customerEmail || stripeCustomerId) {
      try {
        const updateData = {
          stripeCustomerId: stripeCustomerId,
          stripeSubscriptionId: subscriptionId,
          subscriptionStatus: subscription?.status || "active",
          planName: planName,
          billingCycle: billingCycle,
          amountTotal: session.amount_total,
          currency: session.currency || null,
          subscriptionMetadata: metadata,
          updatedAt: new Date(),
        };

        // Update by email if available (email is unique and required)
        if (customerEmail) {
          const result = await db
            .update(profiles)
            .set(updateData)
            .where(eq(profiles.email, customerEmail))
            .returning();

          if (result.length === 0) {
            console.warn(
              `Profile not found for email: ${customerEmail}. Subscription data not saved.`
            );
          } else {
            console.log(
              `Profile updated successfully for email: ${customerEmail}`
            );
          }
        } else if (stripeCustomerId) {
          // Fallback to Stripe customer ID if email is not available
          const result = await db
            .update(profiles)
            .set(updateData)
            .where(eq(profiles.stripeCustomerId, stripeCustomerId))
            .returning();

          if (result.length === 0) {
            console.warn(
              `Profile not found for Stripe customer ID: ${stripeCustomerId}. Subscription data not saved.`
            );
          } else {
            console.log(
              `Profile updated successfully for Stripe customer ID: ${stripeCustomerId}`
            );
          }
        }
      } catch (dbError) {
        // Log error but don't fail the webhook (Stripe expects 200 response)
        console.error("Error updating profile in database:", dbError);
      }
    } else {
      console.warn(
        "No customer email or Stripe customer ID found. Cannot update profile."
      );
    }

    console.log("Checkout session completed:", {
      sessionId: session.id,
      customerId: session.customer,
      customerEmail: customerEmail,
      amountTotal: session.amount_total,
      currency: session.currency,
      subscriptionId,
      planName,
      productName,
      billingCycle,
      metadata,
    });

    // Return 200 quickly - database update is already done
  } else if (event.type === "customer.subscription.updated") {
    const subscription = event.data.object as Stripe.Subscription;

    // Extract subscription details
    const subscriptionId = subscription.id;
    const stripeCustomerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer?.id || null;

    // Get customer email
    let customerEmail: string | null = null;
    if (stripeCustomerId) {
      try {
        const customer =
          typeof subscription.customer === "string"
            ? await stripe.customers.retrieve(subscription.customer)
            : subscription.customer;

        // Check if customer is deleted (DeletedCustomer doesn't have email)
        if (customer && "email" in customer) {
          customerEmail = customer.email || null;
        }
      } catch (err) {
        console.warn("Could not retrieve customer email:", err);
      }
    }

    // Extract plan/product details from subscription
    let planName: string | null = null;
    let productName: string | null = null;
    let billingCycle: string | null = null;
    let amountTotal: number | null = null;
    let currency: string | null = subscription.currency || null;
    let productMetadata: Record<string, string> = {};

    if (subscription.items.data.length > 0) {
      const subscriptionItem = subscription.items.data[0];
      const price = subscriptionItem.price;

      // Get amount from price
      if (price.unit_amount !== null) {
        amountTotal = price.unit_amount;
      }

      // Get product details
      const product =
        typeof price.product === "string"
          ? await stripe.products.retrieve(price.product)
          : price.product;

      // Check if product is deleted
      if (product && "name" in product) {
        productName = product.name;
        planName = price.nickname || product.name;
        // Capture product metadata
        if (product.metadata && Object.keys(product.metadata).length > 0) {
          productMetadata = { ...productMetadata, ...product.metadata };
        }
      } else if (price.nickname) {
        planName = price.nickname;
      }

      // Determine billing cycle
      if (price.recurring) {
        billingCycle = price.recurring.interval; // 'month', 'year', etc.
      }
    }

    // Get metadata from subscription and product
    let metadata: Record<string, any> = subscription.metadata || {};

    // Merge product metadata (this is where custom fields like "messages" are stored)
    if (Object.keys(productMetadata).length > 0) {
      metadata = { ...metadata, ...productMetadata };
    }

    // Check for cancellation at period end
    const cancelAtPeriodEnd = subscription.cancel_at_period_end;
    // Also check if cancel_at is set (subscription scheduled to cancel at a specific time)
    const hasScheduledCancellation = cancelAtPeriodEnd || (subscription.cancel_at && subscription.status === "active");
    let subscriptionStatus: string = subscription.status;
    
    // If subscription is set to cancel at period end or has a cancel_at timestamp, update status and store cancellation details
    if (hasScheduledCancellation) {
      subscriptionStatus = "cancel_at_period_end";
      
      // Store cancellation details in metadata
      const currentPeriodEnd = (subscription as any).current_period_end;
      metadata = {
        ...metadata,
        cancel_at_period_end: true,
        cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
        current_period_end: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null,
      };
    } else {
      // Clear cancellation flags if subscription is no longer set to cancel
      metadata = {
        ...metadata,
        cancel_at_period_end: false,
      };
    }

    // Update profile with subscription data
    if (customerEmail || stripeCustomerId) {
      try {
        const updateData = {
          stripeCustomerId: stripeCustomerId,
          stripeSubscriptionId: subscriptionId,
          subscriptionStatus: subscriptionStatus,
          planName: planName,
          billingCycle: billingCycle,
          amountTotal: amountTotal,
          currency: currency,
          subscriptionMetadata: metadata,
          updatedAt: new Date(),
        };

        // Update by email if available (email is unique and required)
        if (customerEmail) {
          const result = await db
            .update(profiles)
            .set(updateData)
            .where(eq(profiles.email, customerEmail))
            .returning();

          if (result.length === 0) {
            console.warn(
              `Profile not found for email: ${customerEmail}. Subscription update not saved.`
            );
          } else {
            console.log(
              `Profile updated successfully for subscription update - email: ${customerEmail}`
            );
          }
        } else if (stripeCustomerId) {
          // Fallback to Stripe customer ID if email is not available
          const result = await db
            .update(profiles)
            .set(updateData)
            .where(eq(profiles.stripeCustomerId, stripeCustomerId))
            .returning();

          if (result.length === 0) {
            console.warn(
              `Profile not found for Stripe customer ID: ${stripeCustomerId}. Subscription update not saved.`
            );
          } else {
            console.log(
              `Profile updated successfully for subscription update - Stripe customer ID: ${stripeCustomerId}`
            );
          }
        }
      } catch (dbError) {
        // Log error but don't fail the webhook (Stripe expects 200 response)
        console.error("Error updating profile in database:", dbError);
      }
    } else {
      console.warn(
        "No customer email or Stripe customer ID found. Cannot update profile for subscription update."
      );
    }

    const currentPeriodEnd = (subscription as any).current_period_end;
    console.log("Subscription updated:", {
      subscriptionId: subscription.id,
      customerId: stripeCustomerId,
      customerEmail: customerEmail,
      amountTotal: amountTotal,
      currency: currency,
      planName,
      productName,
      billingCycle,
      status: subscription.status,
      subscriptionStatus: subscriptionStatus,
      cancelAtPeriodEnd: cancelAtPeriodEnd,
      hasScheduledCancellation: hasScheduledCancellation,
      cancelAt: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
      currentPeriodEnd: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null,
      metadata,
    });
  } else if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;

    // Extract subscription details
    const subscriptionId = subscription.id;
    const stripeCustomerId =
      typeof subscription.customer === "string"
        ? subscription.customer
        : subscription.customer?.id || null;

    // Get customer email
    let customerEmail: string | null = null;
    if (stripeCustomerId) {
      try {
        const customer =
          typeof subscription.customer === "string"
            ? await stripe.customers.retrieve(subscription.customer)
            : subscription.customer;

        // Check if customer is deleted (DeletedCustomer doesn't have email)
        if (customer && "email" in customer) {
          customerEmail = customer.email || null;
        }
      } catch (err) {
        console.warn("Could not retrieve customer email:", err);
      }
    }

    // Get existing metadata to preserve it
    let metadata: Record<string, any> = subscription.metadata || {};
    
    // Add deletion timestamp to metadata
    metadata = {
      ...metadata,
      deleted_at: new Date().toISOString(),
      canceled_at: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
      cancel_at_period_end: false,
    };

    // Update profile with subscription deletion
    if (customerEmail || stripeCustomerId) {
      try {
        const updateData = {
          subscriptionStatus: "canceled",
          subscriptionMetadata: metadata,
          updatedAt: new Date(),
        };

        // Update by email if available (email is unique and required)
        if (customerEmail) {
          const result = await db
            .update(profiles)
            .set(updateData)
            .where(eq(profiles.email, customerEmail))
            .returning();

          if (result.length === 0) {
            console.warn(
              `Profile not found for email: ${customerEmail}. Subscription deletion not saved.`
            );
          } else {
            console.log(
              `Profile updated successfully for subscription deletion - email: ${customerEmail}`
            );
          }
        } else if (stripeCustomerId) {
          // Fallback to Stripe customer ID if email is not available
          const result = await db
            .update(profiles)
            .set(updateData)
            .where(eq(profiles.stripeCustomerId, stripeCustomerId))
            .returning();

          if (result.length === 0) {
            console.warn(
              `Profile not found for Stripe customer ID: ${stripeCustomerId}. Subscription deletion not saved.`
            );
          } else {
            console.log(
              `Profile updated successfully for subscription deletion - Stripe customer ID: ${stripeCustomerId}`
            );
          }
        }
      } catch (dbError) {
        // Log error but don't fail the webhook (Stripe expects 200 response)
        console.error("Error updating profile in database:", dbError);
      }
    } else {
      console.warn(
        "No customer email or Stripe customer ID found. Cannot update profile for subscription deletion."
      );
    }

    const deletedCurrentPeriodEnd = (subscription as any).current_period_end;
    console.log("Subscription deleted:", {
      subscriptionId: subscription.id,
      customerId: stripeCustomerId,
      customerEmail: customerEmail,
      canceledAt: subscription.canceled_at ? new Date(subscription.canceled_at * 1000).toISOString() : null,
      currentPeriodEnd: deletedCurrentPeriodEnd ? new Date(deletedCurrentPeriodEnd * 1000).toISOString() : null,
      deletedAt: new Date().toISOString(),
      metadata,
    });
  } else {
    console.log(`Unhandled event type: ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  return NextResponse.json({ received: true });
}



