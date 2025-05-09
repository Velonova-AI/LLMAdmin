"use server"
import {embed, embedMany, generateText} from 'ai';
import { openai } from '@ai-sdk/openai';

import { cosineDistance, desc, gt, sql } from 'drizzle-orm';

import {db} from "@/app/dashboard/assistants/lib/index";
import {embeddings} from "@/lib/db/schema";
import {getSelectedAssistant} from "@/app/dashboard/assistants/lib/actions2";
import {anthropic} from "@ai-sdk/anthropic";












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