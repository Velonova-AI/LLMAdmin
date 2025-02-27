
import { TableClient } from "./table-client";
import {fetchFilteredAssistants} from "@/app/dashboard/assistants/lib/actions";


export default async function Table({
                                             query,
                                             currentPage,
                                         }: {
    query: string
    currentPage: number
}) {
    const assistants = await fetchFilteredAssistants(query, currentPage)




    return (
        <TableClient assistants={assistants} />
    )
}

