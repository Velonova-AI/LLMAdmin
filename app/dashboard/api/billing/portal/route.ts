import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import stripe from "@/lib/stripe"

export async function POST() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("sessionId")?.value

  if (!sessionId) {
    return NextResponse.json({ error: "Session ID not found" }, { status: 400 })
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId)
    const customerId = checkoutSession.customer as string

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_URL}/dashboard/billing`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error) {
    console.error("Error creating portal session:", error)
    return NextResponse.json({ error: "Error creating portal session" }, { status: 500 })
  }
}

