"use client"

import { useState, useEffect } from "react"
import { Check, Users, LayoutTemplate } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {createSubscription, fetchActiveSubscription} from "@/app/dashboard/billing/actions";
import {auth} from "@/app/(auth)/auth";
import {redirect} from "next/navigation";


type ActivePlanState = {
    name: string
    billingCycle: "monthly" | "yearly"
} | null

type PlanPrice = {
    monthly: number
    yearly: number
}

type BasePlan = {
    name: string
    description: string
    price: PlanPrice
    numberOfAssistants: number
    numberOfTemplates: number
    features: string[]
    cta: string
    popular: boolean
}

type Plan = BasePlan & {
    active: boolean
}

type SelectedPlan = Plan & {
    billingCycle: "monthly" | "yearly"
    currentPrice: number
}

export default function PricingComponent() {
    const [isYearly, setIsYearly] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null)
    const [showSuccess, setShowSuccess] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [] = useState<string | null>(null)
    const [activePlanState, setActivePlanState] = useState<ActivePlanState>(null)


    useEffect(() => {
        const loadActiveSubscription = async () => {
            try {

                // const session = await auth();
                // if (!session || !session.user || !session.user.id) {
                //     return redirect("/login")
                // }
                const userId = 'session.user.id' // In real app, get from auth
                const activePlan = await fetchActiveSubscription(userId)

                if (activePlan) {
                    setActivePlanState({
                        name: activePlan.planName,
                        billingCycle: activePlan.billingCycle,
                    })
                    // Set the billing cycle toggle based on active subscription
                    setIsYearly(activePlan.billingCycle === "yearly")


                }
            } catch (error) {
                console.error("Error loading active subscription:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadActiveSubscription()
    }, [])

    const basePlans: BasePlan[] = [
        {
            name: "Free",
            description: "Essential features for individuals and small teams",
            price: {
                monthly: 0,
                yearly: 0,
            },
            numberOfAssistants: 1,
            numberOfTemplates: 3,
            features: ["24-hour support response time", "Community access"],
            cta: "Get Started",
            popular: false,
        },
        {
            name: "Professional",
            description: "Advanced features for professionals and growing teams",
            price: {
                monthly: 15,
                yearly: 144,
            },
            numberOfAssistants: 5,
            numberOfTemplates: 25,
            features: ["1-hour support response time", "Community access", "Custom integrations", "API access"],
            cta: "Start Free Trial",
            popular: true,
        },
    ]



    const plans: Plan[] = basePlans.map((plan) => ({
        ...plan,
        active:
            activePlanState !== null &&
            plan.name === activePlanState.name &&
            activePlanState.billingCycle === (isYearly ? "yearly" : "monthly"),
    }))

    const handleSelectPlan = async (selectedPlan: BasePlan) => {
        const billingCycle = isYearly ? "yearly" : "monthly"
        const planData: SelectedPlan = {
            ...selectedPlan,
            active: selectedPlan.name === activePlanState?.name && billingCycle === activePlanState?.billingCycle,
            billingCycle,
            currentPrice: isYearly ? selectedPlan.price.yearly : selectedPlan.price.monthly,
        }

        try {
            // const session = await auth();
            // if (!session || !session.user || !session.user.id) {
            //     return redirect("/login")
            // }
            const userId = 'session.user.id' // Example user ID
            const priceInCents = planData.currentPrice * 100


            await createSubscription({
              userId,
              plan: {
                name: selectedPlan.name,
                description: selectedPlan.description,
                numberOfAssistants: selectedPlan.numberOfAssistants,
                numberOfTemplates: selectedPlan.numberOfTemplates,
                features: selectedPlan.features,
              },
              billingCycle: planData.billingCycle,
              currentPrice: priceInCents,
            })


            console.log("Selected Plan:", planData)
            setSelectedPlan(planData)
            setActivePlanState({
                name: selectedPlan.name,
                billingCycle,
            })
            setShowSuccess(true)
        } catch (error) {
            console.error("Error creating subscription:", error)
        }
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-16 max-w-6xl">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Loading plans...</h2>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-16 max-w-6xl">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Simple, transparent pricing</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Choose the perfect plan for your needs. Always know what you&apos;ll pay.
                </p>
            </div>

            <div className="flex items-center justify-center mb-8">
                <div className="flex items-center space-x-2">
                    <span className={`text-sm ${!isYearly ? "font-medium" : "text-muted-foreground"}`}>Monthly</span>
                    <Switch checked={isYearly} onCheckedChange={setIsYearly} id="billing-toggle" />
                    <span className={`text-sm ${isYearly ? "font-medium" : "text-muted-foreground"}`}>
            Yearly <span className="text-xs text-emerald-600 font-medium">(Save 20%)</span>
          </span>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {plans.map((plan) => (
                    <Card
                        key={plan.name}
                        className={`flex flex-col relative transition-all duration-200 ${
                            plan.active
                                ? "border-primary shadow-lg scale-[1.02] bg-primary/5"
                                : plan.popular
                                    ? "border-primary shadow-lg"
                                    : "hover:border-primary/50"
                        }`}
                    >
                        {(plan.popular || plan.active) && (
                            <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full absolute -top-3 right-4">
                                {plan.active ? "Current Plan" : "Popular"}
                            </div>
                        )}
                        <CardHeader className="relative">
                            <CardTitle>{plan.name}</CardTitle>
                            <CardDescription>{plan.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="grow">
                            <div className="mb-6">
                                <span className="text-4xl font-bold">€{isYearly ? plan.price.yearly : plan.price.monthly}</span>
                                <span className="text-muted-foreground ml-2">
                  {plan.price.monthly === 0 ? "forever" : isYearly ? "/year" : "/month"}
                </span>
                                {isYearly && plan.price.monthly > 0 && (
                                    <p className="text-sm text-muted-foreground mt-1">€12/mo when billed yearly</p>
                                )}
                            </div>

                            {/* Resources Section */}
                            <div className="mb-6 space-y-4 border rounded-lg p-4 bg-muted/30">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Users className="size-5 text-primary" />
                                        <span className="text-sm font-medium">Assistants</span>
                                    </div>
                                    <span className="font-bold text-primary">{plan.numberOfAssistants}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <LayoutTemplate className="size-5 text-primary" />
                                        <span className="text-sm font-medium">Templates</span>
                                    </div>
                                    <span className="font-bold text-primary">{plan.numberOfTemplates}</span>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-sm font-semibold mb-3">Features included:</h4>
                                <ul className="space-y-3">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="flex items-center">
                                            <Check className="size-4 text-primary mr-2 shrink-0" />
                                            <span className="text-sm">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className={`w-full ${plan.active ? "bg-primary/20 hover:bg-primary/30 text-primary" : ""}`}
                                variant={plan.active ? "outline" : "default"}
                                onClick={() => handleSelectPlan(plan)}
                            >
                                {plan.active ? "Current Plan" : plan.cta}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
            {showSuccess && (
                <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                    <h3 className="text-xl font-semibold text-green-800 mb-2">
                        Thank you for choosing our {selectedPlan?.name} plan!
                    </h3>
                    <p className="text-green-700 mb-4">
                        You&apos;ve selected the {selectedPlan?.name} plan with {selectedPlan?.numberOfAssistants} assistants and{" "}
                        {selectedPlan?.numberOfTemplates} templates on {isYearly ? "yearly" : "monthly"} billing.
                    </p>
                    <Button
                        variant="outline"
                        className="bg-white text-green-700 border-green-300 hover:bg-green-50"
                        onClick={() => setShowSuccess(false)}
                    >
                        Close
                    </Button>
                </div>
            )}
        </div>
    )
}

