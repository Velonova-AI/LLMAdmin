import { NextResponse } from "next/server"
import stripe from "@/lib/stripe"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const session_id = searchParams.get("session_id")

  if (!session_id) {
    return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id)
    return NextResponse.json({ status: session.status })
  } catch (error) {
    console.error("Error retrieving session status:", error)
    return NextResponse.json({ error: "Error retrieving session status" }, { status: 500 })
  }
}

