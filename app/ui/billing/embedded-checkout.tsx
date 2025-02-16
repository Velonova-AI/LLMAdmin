"use client"

import { useCallback } from "react"
import { loadStripe } from "@stripe/stripe-js"
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface EmbeddedCheckoutProps {
  priceId: string
  quantity: number | null
}

export default function EmbeddedCheckoutComponent({ priceId , quantity }: EmbeddedCheckoutProps) {

  const fetchClientSecret = useCallback(() => {
    return fetch("/dashboard/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, quantity}),
    })
      .then((res) => res.json())
      .then((data) => data.clientSecret)
  }, [priceId])

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={{ fetchClientSecret }}>
      <EmbeddedCheckout className="w-full max-w-md mx-auto" />
    </EmbeddedCheckoutProvider>
  )
}

