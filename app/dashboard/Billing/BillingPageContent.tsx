"use client"

import { useState } from "react"
import { Button } from "@/app/ui/assistants/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import EmbeddedCheckoutComponent from "@/app/ui/billing/embedded-checkout"

const products = {
  monthly: [
    {
      name: "Free",
      description: "Assist",
      price: "0",
      priceId: "price_1QsANBJ9QMGTomlSwmucY30X",
      period: "month",
      assistants: 1,
      perUnit: true,
    },
    {
      name: "Professional",
      description: "assist 2",
      price: "25",
      priceId: "price_1QsAShJ9QMGTomlSCz65HjfR",
      period: "month",
      assistants: 3,
      perUnit: true,

    },
  ],
  yearly: [
    {
      name: "Free",
      description: "Assist",
      price: "0",
      priceId: "price_1QsANBJ9QMGTomlSwmucY30X",
      period: "year",
      assistants: 1,
      perUnit: true,
    },
    {
      name: "Professional",
      description: "assist 2",
      price: "250",
      priceId: "price_1QsAUMJ9QMGTomlS5hxS9mih",
      period: "year",
      assistants: 3,
      perUnit: true,

    },
  ],
}

export default function BillingPageContent() {
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(null)
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly")
  const [selectedAssistants, setSelectedAssistants] = useState<number | null>(null)

  if (selectedPriceId) {
    return <EmbeddedCheckoutComponent priceId={selectedPriceId}
                                      quantity={selectedAssistants} />
  }

  return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-full bg-[#F3F4F6] p-1">
            <button
                onClick={() => setBillingInterval("monthly")}
                className={`rounded-full px-8 py-2 text-sm font-medium transition-colors ${
                    billingInterval === "monthly" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-200"
                }`}
            >
              Monthly
            </button>
            <button
                onClick={() => setBillingInterval("yearly")}
                className={`rounded-full px-8 py-2 text-sm font-medium transition-colors ${
                    billingInterval === "yearly" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-200"
                }`}
            >
              Yearly
            </button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:gap-8 max-w-5xl mx-auto">
          {products[billingInterval].map((product) => (
              <Card key={product.priceId} className="relative border border-gray-200 bg-white">
                <CardHeader className="space-y-1 pb-4 pt-6">
                  <h3 className="text-2xl font-bold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.description}</p>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex items-baseline text-3xl font-bold text-gray-900">
                    <span className="text-xl">€</span>
                    {product.price}
                    <span className="ml-1 text-base font-normal text-gray-500">
                  /{billingInterval === "monthly" ? "month" : "year"}
                </span>
                  </div>
                  <div className="mt-1 text-sm text-gray-500">
                    {product.assistants} {product.assistants === 1 ? "assistant" : "assistants"} included
                  </div>

                </CardContent>
                <CardFooter className="pb-6">
                  <Button className="w-full"  onClick={() => {setSelectedPriceId(product.priceId)
                    setSelectedAssistants(product.assistants)
                  }}>
                    Subscribe
                  </Button>
                </CardFooter>
              </Card>
          ))}
        </div>
      </div>
  )
}

