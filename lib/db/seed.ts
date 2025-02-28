// lib/db/seed.ts

import {ModelProvider, ModelType, ModelName, assistantsTable} from './schema';
import { v4 as uuidv4 } from 'uuid';
import postgres from "postgres";
import {drizzle} from "drizzle-orm/postgres-js";
import {config} from "dotenv";


config({
    path: '.env.local',
});

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);


async function seed() {
    const userId = 'user_' + uuidv4();

    const seedData = [
        {

            name: 'GPT-4 Assistant',
            description: 'A powerful language model for general tasks',
            provider: ModelProvider.OpenAI,
            modelName: ModelName.GPT4,
            type: ModelType.Text,
            systemPrompt: 'You are a helpful AI assistant.',
            temperature: 0.7,
            maxTokens: 2048,
            suggestions: JSON.stringify(['Write an essay', 'Explain a concept', 'Solve a problem']),
            apiKey: 'sk-openai-key-encrypted',
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: 'c66b20a7-0c73-4bfd-b4b8-2e169f0f43eb',
        },
        {

            name: 'Claude Assistant',
            description: 'An AI assistant specialized in analysis and reasoning',
            provider: ModelProvider.Anthropic,
            modelName: ModelName.Claude,
            type: ModelType.Text,
            systemPrompt: 'You are Claude, an AI assistant created by Vercel to be helpful, harmless, and honest.',
            temperature: 0.5,
            maxTokens: 4096,
            suggestions: JSON.stringify(['Analyze a document', 'Provide a summary', 'Answer questions']),
            apiKey: 'sk-anthropic-key-encrypted',
            createdAt: new Date(),
            updatedAt: new Date(),
            userId: 'c66b20a7-0c73-4bfd-b4b8-2e169f0f43eb',
        },

    ];

    try {
        for (const assistant of seedData) {
            await db.insert(assistantsTable).values(assistant);
        }
        console.log('Seed data inserted successfully');
    } catch (error) {
        console.error('Error inserting seed data:', error);
    }
}

seed();