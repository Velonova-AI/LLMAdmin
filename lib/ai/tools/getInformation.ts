import { tool } from 'ai';
import { z } from 'zod';
import { findRelevantContent } from "@/app/dashboard/assistants/lib/embeddings";

export const getInformation = tool({
    description: 'Get relevant information from the knowledge base to answer questions',
    parameters: z.object({
        question: z.string().describe('the user\'s question'),
    }),
    execute: async ({ question }) => {
        try {
            // Get the raw results from your embeddings function
            const rawResults = await findRelevantContent(question);

            if (!rawResults || rawResults.length === 0) {
                return "No relevant information found in the knowledge base.";
            }

            // Extract descriptions from the results
            let descriptions = [];

            for (const item of rawResults) {
                const { name } = item;

                if (typeof name !== 'string') continue;

                // Improved regex pattern to extract description
                // This pattern looks for "description:" followed by text up until the next field
                const descMatch = name.match(/description:\s*([^,]+(?:,[^,]+)*?)(?:,\s*requirements:|,\s*compliance_notes:|,\s*step:|$)/i);

                if (descMatch && descMatch[1]) {
                    const description = descMatch[1].trim();
                    descriptions.push(description);
                }
            }

            // If no descriptions were found, return a message
            if (descriptions.length === 0) {
                return "Found content but couldn't extract descriptions from the knowledge base.";
            }

            // Join all descriptions into a single text
            return descriptions.join("\n\n");

        } catch (error) {
            console.error("Error in getInformation tool:", error);
            return "Error retrieving information from the knowledge base.";
        }
    },
});