"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface CurrentPlanProps {
    subscription: {
        id: number
        status: string
        productName: string
        priceId: string
        quantity: number
        cancelAtPeriodEnd: boolean
        currentPeriodEnd: string
        amount: number
        currency: string
        stripeCustomerId: string
        email: string
    }
}

export default function CurrentPlan({ subscription }: CurrentPlanProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleManageSubscription = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const response = await fetch("/dashboard/api/billing/portal", {
                method: "POST",
            })
            if (!response.ok) {
                throw new Error("Failed to create portal session")
            }
            const { url } = await response.json()
            window.location.href = url
        } catch (err) {
            setError("Failed to redirect to billing portal. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <h2 className="text-2xl font-bold">Current Plan</h2>
                </CardHeader>
                <CardContent>
                    <p>
                        <strong>Plan:</strong> {subscription.productName}
                    </p>
                    <p>
                        <strong>Status:</strong> {subscription.status}
                    </p>
                    <p>
                        <strong>Quantity:</strong> {subscription.quantity}
                    </p>
                    <p>
                        <strong>Amount:</strong> {(subscription.amount / 100).toFixed(2)} {subscription.currency.toUpperCase()}
                    </p>
                    <p>
                        <strong>Current Period Ends:</strong> {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                    <p>
                        <strong>Customer Email:</strong> {subscription.email}
                    </p>
                    {subscription.cancelAtPeriodEnd && (
                        <p className="text-red-500">Your subscription will be canceled at the end of the current period.</p>
                    )}
                    {error && <p className="text-red-500">{error}</p>}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleManageSubscription} disabled={isLoading}>
                        {isLoading ? "Redirecting..." : "Manage Subscription"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

