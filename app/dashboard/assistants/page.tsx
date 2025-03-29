import { Suspense } from "react"
import { fetchAssistantsPages, fetchFilteredAssistants } from "./lib/actions"
import Search from "./components/search"
import Pagination from "./components/pagination"

import { Button } from "@/components/ui/button"
import { PlusIcon, CheckCircleIcon } from "@heroicons/react/24/outline"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import AssistantsTable from "@/app/dashboard/assistants/components/assistants-list"

// Remove the custom PageProps interface and use the correct type annotation directly
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
    const message = searchParams?.message


    const assistants = await fetchFilteredAssistants(query, currentPage)
    const totalPages = await fetchAssistantsPages(query)

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className="text-2xl font-bold">AI Assistants</h1>
            </div>

            {message && (
                <Alert className="mt-4 bg-green-50 text-green-800 border-green-200">
                    <CheckCircleIcon className="size-5 text-green-600" />
                    <AlertDescription>{message}</AlertDescription>
                </Alert>
            )}

            <div className="mt-4 flex items-center justify-between gap-2">
                <Search placeholder="Search assistants..." />
            </div>

            <Suspense fallback={<div>Loading...</div>}>
                {assistants.length > 0 ? (
                    <>
                        <AssistantsTable assistants={assistants} />
                        <Pagination totalPages={totalPages} />
                    </>
                ) : (
                    <div className="mt-6 flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                        <h2 className="text-lg font-semibold">No assistants found</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {query ? `No assistants match "${query}"` : "Get started by creating a new assistant."}
                        </p>
                        {!query && (
                            <Link href="/dashboard/assistants/create" className="mt-4">
                                <Button>
                                    <PlusIcon className="size-5 mr-2" />
                                    Create Assistant
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </Suspense>
        </div>
    )
}

