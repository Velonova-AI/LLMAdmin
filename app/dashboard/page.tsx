// import Search from '@/components/ui/assistants/search';
// import { CreateAssistant } from '@/components/ui/assistants/buttons';
// import { lusitana } from '@/components/ui/assistants/fonts';
// import { InvoicesTableSkeleton } from '@/components/ui/assistants/skeletons';
'use client';

import {Suspense, useEffect, useState, use } from 'react';
import {auth} from "@/app/(auth)/auth";
import AssistantsTable from "@/app/dashboard/assistant/table";
import {useAssistantStore} from "@/app/dashboard/store";
import {Assistant} from "@/lib/db/schema";
import Search from "@/app/ui/search";
import {CreateAssistant} from "@/app/ui/assistants/buttons";
import {useAssistantQuantityStore} from "@/app/dashboard/assistantQuantityStore";

type SearchParams = {
    query?: string;
    page?: string;
};

export default function Home({
                                 searchParams,
                             }: {
    searchParams: Promise<SearchParams>;
} ) {
    const { assistant  } = useAssistantStore()
    const { setTotalAllowed, setCurrentCount } = useAssistantQuantityStore()
    const [isLoading, setIsLoading] = useState(true)

    const resolvedSearchParams = use(searchParams);

    useEffect(() => {
        async function fetchData() {
            try {
                const [subscriptionResponse, assistantsCountResponse] = await Promise.all([
                    fetch("/dashboard/api/billing/subscriptions"),
                    fetch("/dashboard/api/assistants/count"),
                ])

                if (!subscriptionResponse.ok || !assistantsCountResponse.ok) {
                    throw new Error("Failed to fetch data")
                }

                const subscriptionData = await subscriptionResponse.json()
                const assistantsCountData = await assistantsCountResponse.json()


                setTotalAllowed(subscriptionData.quantity)
                setCurrentCount(assistantsCountData.count)
            } catch (error) {
                console.error("Error fetching data:", error)
                // Handle error (e.g., show error message to user)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [setTotalAllowed, setCurrentCount])

    // if (!assistant) {
    //     return <div>No assistant found</div>
    // }

    if (isLoading) {
        return <div>Loading...</div>
    }
//

    const query = resolvedSearchParams.query || '';
    const currentPage = Number(resolvedSearchParams.page) || 1;






    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                {/*<h1 className={`${lusitana.className} text-2xl`}>Personal Assistants</h1>*/}
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                {/*<Search placeholder="Search assistants..." />*/}
                <CreateAssistant />
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <AssistantsTable  query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                {/*<Pagination totalPages={totalPages} />*/}
            </div>
        </div>
    );
}