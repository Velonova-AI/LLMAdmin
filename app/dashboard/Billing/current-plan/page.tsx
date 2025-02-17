
import { redirect } from "next/navigation"

import { eq } from "drizzle-orm"
import { subscriptions } from "@/lib/db/schema"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {auth} from "@/app/(auth)/auth";
import {db} from "@/app/dashboard/db";

export default async function CurrentPlanPage() {
    const session =  await auth();
    if (!session || !session.user) {
        redirect("/login")
    }

    const userId = session.user.id

    if (!userId){
        return console.error("no user id found in count");
    }
    const userSubscription = await await db.select().from(subscriptions).
    where(eq(subscriptions.userId, userId)).limit(1);

    if (!userSubscription) {
        redirect("/dashboard/billing")
    }

    const handleManageSubscription = async () => {
        const response = await fetch("/dashboard/api/create-portal-session", {
            method: "POST",
        })
        const { url } = await response.json()
        window.location.href = url
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <h2 className="text-2xl font-bold">Your Current Plan</h2>
                </CardHeader>
                {/*<CardContent>*/}
                {/*    <p>*/}
                {/*        <strong>Status:</strong> {userSubscription.status}*/}
                {/*    </p>*/}
                {/*    <p>*/}
                {/*        <strong>Plan:</strong> {userSubscription.stripePriceId}*/}
                {/*    </p>*/}
                {/*    <p>*/}
                {/*        <strong>Current Period Ends:</strong> {new Date(userSubscription.currentPeriodEnd).toLocaleDateString()}*/}
                {/*    </p>*/}
                {/*</CardContent>*/}
                <CardFooter>
                    <Button onClick={handleManageSubscription}>Manage Subscription</Button>
                </CardFooter>
            </Card>
        </div>
    )
}

