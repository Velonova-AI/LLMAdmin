
import { redirect } from "next/navigation"

import { eq } from "drizzle-orm"
import { subscriptions } from "@/lib/db/schema"
import BillingPageContent from "./BillingPageContent"
import {auth} from "@/app/(auth)/auth";
import {db} from "@/app/dashboard/db";


export default async function BillingPage() {
    const session = await auth();

    if (!session || !session.user) {
        redirect("/login")
        return;
    }

    const userId = session.user.id

    if (!userId) {
        // Handle the case where userId is undefined
        redirect("/login");
        return;
    }
        console.log(userId);
    const userSubscription = await db.select().from(subscriptions).
    where(eq(subscriptions.userId, userId)).limit(1);

    console.log("sub");
    console.log(userSubscription);




    if (userSubscription && userSubscription.length > 0) {

        redirect("/dashboard/billing/done")
    }

    return <BillingPageContent />
}

