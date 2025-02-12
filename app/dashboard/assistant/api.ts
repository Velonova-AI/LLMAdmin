import {Assistant} from "@/lib/db/schema";


export async function fetchFilteredAssistants(query?: string): Promise<Assistant[]> {
    const url = new URL('/dashboard/api/assistants', window.location.origin)
    if (query) {
        url.searchParams.append('query', query)
    }

    const response = await fetch(url.toString())
    if (!response.ok) {
        throw new Error('Failed to fetch assistants')
    }

    return response.json()
}
