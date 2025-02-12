import { NextResponse } from 'next/server'
import { Assistant } from '@/lib/db/schema'
import {fetchFilteredAssistants} from "@/lib/db/queries";



export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query')

    const assistants = await fetchFilteredAssistants()
    //
    // if (query) {
    //     filteredAssistants = assistants.filter(assistant =>
    //         assistant.name.toLowerCase().includes(query.toLowerCase())
    //     )
    // }

    return NextResponse.json(assistants)
}
