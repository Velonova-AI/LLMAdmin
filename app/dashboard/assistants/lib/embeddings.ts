"use server"
import {embed, embedMany, generateText} from 'ai';
import { openai } from '@ai-sdk/openai';

import { cosineDistance, desc, gt, sql } from 'drizzle-orm';

import {db} from "@/app/dashboard/assistants/lib/index";
import {embeddings} from "@/lib/db/schema";
import {getSelectedAssistant} from "@/app/dashboard/assistants/lib/actions2";
import {anthropic} from "@ai-sdk/anthropic";








export async function extractPdfText(buffer: Buffer, fileName = "document.pdf"): Promise<string> {
    try {
        if (!buffer || buffer.length === 0) {
            throw new Error("No valid buffer provided")
        }

        // Use AI SDK with Anthropic's Claude model to extract text from the PDF
        const { text } = await generateText({
            model: anthropic("claude-3-5-sonnet-20241022"),
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: "Extract all the text content from this PDF and format it properly. Preserve paragraphs, headings, and lists. Return only the extracted text without any additional commentary.",
                        },
                        {
                            type: "file",
                            data: buffer,
                            mimeType: "application/pdf",
                        },
                    ],
                },
            ],
        })

        return text
    } catch (error) {
        console.error("Error extracting PDF text:", error)
        throw new Error("Failed to extract text from PDF")
    }
}




const embeddingModel = openai.embedding('text-embedding-ada-002');






export async function insertEmbedding(assistantId:string, content:string) {


    try {
        // Generate the embedding
        //const assistant = await getSelectedAssistant()

        console.log(`Generating embedding for: "${content.substring(0, 30)}..."`);
        const embeddingVector = await generateEmbedding(content);
        console.log(`Generated embedding with ${embeddingVector.length} dimensions`);

        // Insert into database using Drizzle
        const result = await db.insert(embeddings).values({
            assistantId:assistantId,
            content,
            embedding: embeddingVector
        }).returning({ id: embeddings.id });

        console.log(`Successfully inserted embedding with ID: ${result[0].id}`);
        return result[0].id;
    } catch (error) {
        console.error('Error inserting embedding:', error);
        throw error;
    }
}

const generateChunks = (input: string): string[] => {
    return input
        .trim()
        .split('.')
        .filter(i => i !== '');
};

export const generateEmbeddings = async (
    value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
    const chunks = generateChunks(value);
    const { embeddings } = await embedMany({
        model: embeddingModel,
        values: chunks,
    });
    return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
    const input = value.replaceAll('\\n', ' ');
    const { embedding } = await embed({
        model: embeddingModel,
        value: input,
    });
    return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
    const userQueryEmbedded = await generateEmbedding(userQuery);
    const similarity = sql<number>`1 - (${cosineDistance(
        embeddings.embedding,
        userQueryEmbedded,
    )})`;
    const similarGuides = await db
        .select({ name: embeddings.content, similarity })
        .from(embeddings)
        .where(gt(similarity, 0.5))
        .orderBy(t => desc(t.similarity))
        .limit(4);
    return similarGuides;
};