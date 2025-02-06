import { openai } from '@ai-sdk/openai';
import { anthropic } from "@ai-sdk/anthropic";
import { fireworks } from '@ai-sdk/fireworks';
import {
    customProvider,
    extractReasoningMiddleware,
    wrapLanguageModel,
} from 'ai';
import { getAssistant } from "@/lib/db/queries";
import { ModelName } from '@/lib/db/schema'; // Make sure to import this

export default async function getLanguageModel(selectedChatModel: string) {
    const assistants = await getAssistant(selectedChatModel);
    const assistant = assistants[0]
    if (!assistant) {
        throw new Error('Selected chat model not found');
    }



    // Map the assistant's provider to the corresponding language model
    const model = (() => {
        switch (assistant.provider) {
            case 'OpenAI':
                return openai(assistant.modelName as ModelName);
            case 'Anthropic':
                return anthropic(assistant.modelName as ModelName);
            // case 'Fireworks':
            //     return wrapLanguageModel({
            //         model: fireworks(assistant.modelName as ModelName),
            //         middleware: extractReasoningMiddleware({ tagName: 'think' }),
            //     });
            default:
                throw new Error(`Unsupported provider: ${assistant.provider}`);
        }
    })();

    return {
        model,
        systemPrompt: assistant.systemPrompt,
        temperature: assistant.temperature,
        maxTokens: assistant.maxTokens,
        provider: assistant.provider,
    };
}