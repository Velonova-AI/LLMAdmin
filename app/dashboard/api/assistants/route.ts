import { NextRequest, NextResponse } from 'next/server';
import {fetchFilteredAssistants2} from "@/lib/db/queries";


const ITEMS_PER_PAGE = 6; // Make sure this matches the value in your fetchFilteredAssistants function

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const page = parseInt(searchParams.get('page') || '1', 10);

    try {
        const assistants = await fetchFilteredAssistants2(query, page);

        // Calculate total pages (you'll need to implement getTotalAssistantsCount)
        const totalAssistants = assistants.length;
        const totalPages = Math.ceil(totalAssistants / ITEMS_PER_PAGE);

        return NextResponse.json({
            assistants,
            pagination: {
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching assistants:', error);
        return NextResponse.json({ error: 'Failed to fetch assistants' }, { status: 500 });
    }
}

