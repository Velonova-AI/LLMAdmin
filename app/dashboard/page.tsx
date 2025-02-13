// import Search from '@/components/ui/assistants/search';
// import { CreateAssistant } from '@/components/ui/assistants/buttons';
// import { lusitana } from '@/components/ui/assistants/fonts';
// import { InvoicesTableSkeleton } from '@/components/ui/assistants/skeletons';
'use client';

import { Suspense } from 'react';
import {auth} from "@/app/(auth)/auth";
import AssistantsTable from "@/app/dashboard/assistant/table";
import {useAssistantStore} from "@/app/dashboard/store";
import {Assistant} from "@/lib/db/schema";
import Search from "@/app/ui/search";
import { use } from 'react';
import {CreateAssistant} from "@/app/ui/assistants/buttons";

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
    const resolvedSearchParams = use(searchParams);

    if (!assistant) {
        return <div>No assistant found</div>
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