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




export default function Home() {
    const { assistant , setAssistant  } = useAssistantStore()

console.log(assistant.name);






    return (
        <div className="w-full">
            {/*<div className="flex w-full items-center justify-between">*/}
            {/*    <h1 className={`${lusitana.className} text-2xl`}>Personal Assistants</h1>*/}
            {/*</div>*/}
            {/*<div className="mt-4 flex items-center justify-between gap-2 md:mt-8">*/}
            {/*    <Search placeholder="Search assistants..." />*/}
            {/*    <CreateAssistant />*/}
            {/*</div>*/}
            <Suspense fallback={<div>Loading...</div>}>
                <AssistantsTable  />
            </Suspense>
            <div className="mt-5 flex w-full justify-center">
                {/*<Pagination totalPages={totalPages} />*/}
            </div>
        </div>
    );
}