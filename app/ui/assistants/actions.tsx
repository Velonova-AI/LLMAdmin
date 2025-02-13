"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { eq } from "drizzle-orm"
import { auth } from "@/app/(auth)/auth"
import {assistants, ModelName, ModelProvider, ModelType, user} from "@/lib/db/schema"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"


const client = postgres(process.env.POSTGRES_URL!, { ssl: 'require' })
const db = drizzle(client)

const assistantSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().nonempty(),
    description: z.string().optional(),
    provider: z.nativeEnum(ModelProvider),
    modelName: z.nativeEnum(ModelName),
    type: z.nativeEnum(ModelType),
    systemPrompt: z.string().optional(),
    temperature: z.number().min(0).max(1).default(0.7),
    maxTokens: z.number().int().positive().default(2048),
    suggestions: z.array(z.string()).optional(),
    apiKey: z.string().optional(),
})

export type AssistantForm = z.infer<typeof assistantSchema>

export async function deleteAssistant(id: string) {
    await db.delete(assistants).where(eq(assistants.id, id))
    revalidatePath('/dashboard/assistants')
}

const CreateAssistant = z.object({
    name: z.string().nonempty(),
    description: z.string().optional(),
    provider: z.nativeEnum(ModelProvider),
    modelName: z.nativeEnum(ModelName),
    type: z.nativeEnum(ModelType),
    systemPrompt: z.string().optional(),
    temperature: z.number().min(0).max(1),
    maxTokens: z.number().int().positive(),
    suggestions: z.array(z.string()),
    apiKey: z.string().nonempty(),
})

export async function createAssistant(formData: FormData) {
    const { name, description, provider, modelName, type, systemPrompt, temperature, maxTokens, suggestions, apiKey } =
        CreateAssistant.parse({
            name: formData.get("name"),
            description: formData.get("description") || undefined,
            provider: formData.get("provider"),
            modelName: formData.get("modelName"),
            type: formData.get("type"),
            systemPrompt: formData.get("systemPrompt") || undefined,
            temperature: Number.parseFloat(formData.get("temperature") as string),
            maxTokens: Number.parseInt(formData.get("maxTokens") as string, 10),
            suggestions: JSON.parse(formData.get("suggestions") as string),
            apiKey: formData.get("apiKey"),
        })

    const session = await auth()
    if (!session || !session.user || !session.user.id) {
        return redirect("/login")
    }

    const assistantData: typeof assistants.$inferInsert = {
        name,
        description,
        provider,
        modelName,
        type,
        systemPrompt,
        temperature,
        maxTokens,
        suggestions: JSON.stringify(suggestions),
        apiKey,
        userId: session.user.id,
    }

    await db.insert(assistants).values(assistantData)

    revalidatePath("/dashboard/assistants")
    redirect("/dashboard/assistants")
}




const UpdateAssistant = assistantSchema.partial().extend({
    id: z.string().uuid(),
})

export async function updateAssistant(formData: FormData) {
    const { id, name, description, provider, modelName, type, systemPrompt, temperature, maxTokens, suggestions, apiKey } =
        UpdateAssistant.parse({
            id: formData.get("id"),
            name: formData.get("name"),
            description: formData.get("description"),
            provider: formData.get("provider"),
            modelName: formData.get("modelName"),
            type: formData.get("type"),
            systemPrompt: formData.get("systemPrompt"),
            temperature: formData.get("temperature"),
            maxTokens: formData.get("maxTokens"),
            suggestions: formData.get("suggestions") ? JSON.parse(formData.get("suggestions") as string) : undefined,
            apiKey: formData.get("apiKey"),
        })

    const assistantData: Partial<typeof assistants.$inferInsert> = {
        ...(name && { name }),
        ...(description && { description }),
        ...(provider && { provider }),
        ...(modelName && { modelName }),
        ...(type && { type }),
        ...(systemPrompt && { systemPrompt }),
        ...(temperature !== undefined && { temperature }),
        ...(maxTokens !== undefined && { maxTokens }),
        ...(suggestions && { suggestions: JSON.stringify(suggestions) }),
        ...(apiKey && { apiKey }),
    }

    await db.update(assistants).set(assistantData).where(eq(assistants.id, id))

    revalidatePath("/dashboard/assistant")
    redirect("/dashboard/assistant")
}