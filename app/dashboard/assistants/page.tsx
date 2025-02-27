import { Suspense } from "react"
import type { Metadata } from "next"


// import { CreateUser } from "@/app/assistants/ui/buttons"


import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import Search from "./components/search";
import { CreateAssistant } from "./components/button";
import {AssistantsTableSkeleton} from "@/app/dashboard/assistants/components/skeleton";
import Table from "@/app/dashboard/assistants/components/table";
import Pagination from "@/app/dashboard/assistants/components/pagination";
import {fetchAssistantsPages} from "@/app/dashboard/assistants/lib/actions";

export const metadata: Metadata = {
    title: "Assistant",
    description: "Manage Assistants and their information",
}

export default async function Page(props: {
    searchParams?: Promise<{
        query?: string;
        page?: string;
        message?: string;

    }>;
}) {
    const searchParams = await props.searchParams;
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const totalPages = await fetchAssistantsPages(query);
    const message = searchParams?.message;

    return (

        <section className="py-4">
            <div className="container px-0 md:px-8">

                <h1 className="mb-10 px-4 text-3xl font-semibold md:mb-14 md:text-4xl">
                    Assistants
                </h1>
                <div className="flex flex-col">

            <div className="mt-4 flex   gap-2 md:mt-8">
                <Search placeholder="Search Assistants..." />
                <CreateAssistant />
            </div>
            <Suspense key={query + currentPage} fallback={<AssistantsTableSkeleton />}>
                <Table query={query} currentPage={currentPage} />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages} />
            </div>
            {message && (
                <Alert className="mt-4 bg-green-50">
                    <CheckCircle2 className="size-4 text-green-600" />
                    <AlertDescription className="text-green-600">{message}</AlertDescription>
                </Alert>
            )}
  </div>
            </div>
            </section>
    )
}

