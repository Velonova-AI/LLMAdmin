"use client"

import type React from "react"
import Image from "next/image"
import { loadStripe } from "@stripe/stripe-js"

interface ProductProps {
  name: string
  priceId: string
  price: string
  period?: string
  image: string
}

const Product: React.FC<ProductProps> = ({ name, price, priceId, period, image }) => {
  const handleCheckout = async () => {
    const response = await fetch("/dashboard/api/billing/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ priceId }),
    })

    const { sessionId } = await response.json()
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
    await stripe?.redirectToCheckout({ sessionId })
  }

  return (
    <div className="rounded-lg border p-6 shadow-sm">
      <div className="flex items-center space-x-4">
        <Image src={image || "/placeholder.svg"} alt={name} width={64} height={64} className="rounded-md" />
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{name}</h3>
          <p className="text-sm text-gray-500">
            {price} {period && `/ ${period}`}
          </p>
        </div>
        <button
          onClick={handleCheckout}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
        >
          Subscribe
        </button>
      </div>
    </div>
  )
}

export default Product

