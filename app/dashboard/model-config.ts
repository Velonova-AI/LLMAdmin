import { createAnthropic} from "@ai-sdk/anthropic"
import { createOpenAI } from "@ai-sdk/openai"
import {ModelProvider} from "@/lib/db/schema";

// type ModelProvider = "openai" | "anthropic"

export function configureModel(provider: string, apiKey: string, modelName: string) {
    switch (provider.toLowerCase()) {
        case "openai":
            const openai = createOpenAI({
                apiKey: apiKey,
            })
            return openai(modelName)

        case "anthropic":
            const anthropic = createAnthropic({
                apiKey: apiKey,
            })
            return anthropic(modelName)

        default:
            throw new Error(`Unsupported provider: ${provider}. Only 'openai' and 'anthropic' are supported.`)
    }
}

// Usage example:
/*
import { streamText } from 'ai'

// For OpenAI
const openaiModel = configureModel('openai', 'your-openai-key', 'gpt-4-turbo-preview')

// For Anthropic
const anthropicModel = configureModel('anthropic', 'your-anthropic-key', 'claude-3-sonnet')

const result = streamText({
  model: model,
  prompt: 'Hello, how are you?'
})
*/
