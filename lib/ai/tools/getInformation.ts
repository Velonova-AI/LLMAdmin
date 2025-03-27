import { tool } from 'ai';
import { z } from 'zod';
import {findRelevantContent} from "@/app/dashboard/assistants/lib/embeddings";

export const getInformation =  tool({
    description: `get information from your knowledge base to answer questions.`,
    parameters: z.object({
        question: z.string().describe('the users question'),
    }),
    execute: async ({ question }) => findRelevantContent(question),
});