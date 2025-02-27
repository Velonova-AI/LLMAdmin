'use server';
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { createInsertSchema } from "drizzle-zod"
import { drizzle } from "drizzle-orm/node-postgres"
import {assistantsTable, ModelName, ModelProvider, ModelType } from "@/lib/db/schema"
import { sql } from "drizzle-orm"

const db = drizzle(process.env.POSTGRES_URL!)








const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    description: z.string().optional(),
    provider: z.enum([ModelProvider.OpenAI, ModelProvider.Anthropic]),
    modelName: z.enum([
        ModelName.GPT4Mini,
        ModelName.GPT4,
        ModelName.Claude,
        ModelName.GPT4Turbo,
        ModelName.DallE2,
        ModelName.DallE3,
    ]),
    type: z.enum([ModelType.Text, ModelType.Image]),
    systemPrompt: z.string().optional(),
    temperature: z.coerce.number().min(0).max(1).default(0.7),
    maxTokens: z.coerce.number().min(1).max(4096).default(2048),
    suggestions: z.array(z.string()).optional(),
    apiKey: z.string().min(1, "API Key is required"),
})

export type State = {
    message: string | null
    errors?: {
        name?: string[]
        description?: string[]
        provider?: string[]
        modelName?: string[]
        type?: string[]
        systemPrompt?: string[]
        temperature?: string[]
        maxTokens?: string[]
        suggestions?: string[]
        apiKey?: string[]
        message?: string[]
    }
}

// Data fetching functions
 const ITEMS_PER_PAGE = 6

export async function fetchFilteredAssistants(query: string, currentPage: number) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE

    try {
        const assistantsList = await db
            .select()
            .from(assistantsTable)
            .where(
                sql`LOWER(name) LIKE LOWER(${`%${query}%`}) OR 
            LOWER(description) LIKE LOWER(${`%${query}%`}) OR
            LOWER(provider) LIKE LOWER(${`%${query}%`}) OR
            LOWER('modelName') LIKE LOWER(${`%${query}%`})`,
            )
            .limit(ITEMS_PER_PAGE)
            .offset(offset)

        return assistantsList
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Failed to fetch assistants.")
    }
}

export async function fetchAssistantsPages(query: string) {
    try {
        const count = await db
            .select({ count: sql<number>`count(*)` })
            .from(assistantsTable)
            .where(
                sql`LOWER(name) LIKE LOWER(${`%${query}%`}) OR 
            LOWER(description) LIKE LOWER(${`%${query}%`}) OR
            LOWER(provider) LIKE LOWER(${`%${query}%`}) OR
            LOWER('modelName') LIKE LOWER(${`%${query}%`})`,
            )

        const totalPages = Math.ceil(Number(count[0].count) / ITEMS_PER_PAGE)
        return totalPages
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Failed to fetch total number of assistants.")
    }
}

export async function fetchAssistantById(id: string) {
    try {
        const result = await db.select().from(assistantsTable).where(sql`id = ${id}`)
        return result[0]
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Failed to fetch assistant.")
    }
}

// Server Actions
export async function createAssistant(prevState: State, formData: FormData): Promise<State> {


    const validatedFields = formSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        provider: formData.get("provider"),
        modelName: formData.get("modelName"),
        type: formData.get("type"),
        systemPrompt: formData.get("systemPrompt"),
        temperature: formData.get("temperature"),
        maxTokens: formData.get("maxTokens"),
        suggestions: JSON.parse((formData.get("suggestions") as string) || "[]"),
        apiKey: formData.get("apiKey"),
    })

    if (!validatedFields.success) {
        //console.log(validatedFields.data);


        return {
            message: "Invalid form data",
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }



    try {
        const assistantInsertSchema = createInsertSchema(assistantsTable)
        const parsed = assistantInsertSchema.parse({
            ...validatedFields.data,
            userId: "775c8930-d518-446d-be76-1bdd69ddb70c", // TODO: Replace with actual user ID from auth
        })

        await db.insert(assistantsTable).values(parsed)
    } catch (error) {
        console.error("Database Error:", error)
        return {
            message: "Failed to create assistant",
            errors: {
                message: ["An unexpected error occurred"],
            },
        }
    }

    revalidatePath("/dashboard/assistants")
    redirect(
        `/dashboard/assistants?message=${encodeURIComponent(`Assistant ${validatedFields.data.name} was successfully created`)}`,
    )
}

export async function updateAssistant(id: string, prevState: State, formData: FormData): Promise<State> {
    const validatedFields = formSchema.safeParse({
        name: formData.get("name"),
        description: formData.get("description"),
        provider: formData.get("provider"),
        modelName: formData.get("modelName"),
        type: formData.get("type"),
        systemPrompt: formData.get("systemPrompt"),
        temperature: formData.get("temperature"),
        maxTokens: formData.get("maxTokens"),
        suggestions: JSON.parse((formData.get("suggestions") as string) || "[]"),
        apiKey: formData.get("apiKey"),
    })

    if (!validatedFields.success) {
        return {
            message: "Invalid form data",
            errors: validatedFields.error.flatten().fieldErrors,
        }
    }

    try {
        const assistantInsertSchema = createInsertSchema(assistantsTable)
        const parsed = assistantInsertSchema.parse({
            ...validatedFields.data,
            updatedAt: new Date(),
            userId: "775c8930-d518-446d-be76-1bdd69ddb70c",
        })

        await db.update(assistantsTable).set(parsed).where(sql`id = ${id}`)
    } catch (error) {
        console.error("Database Error:", error)
        return {
            message: "Failed to update assistant",
            errors: {
                message: ["An unexpected error occurred"],
            },
        }
    }

    revalidatePath("/dashboard/assistants")
    redirect(
        `/dashboard/assistants?message=${encodeURIComponent(`Assistant ${validatedFields.data.name} was successfully updated`)}`,
    )
}

export async function deleteAssistant(id: string, name: string): Promise<State> {
    try {
        await db.delete(assistantsTable).where(sql`id = ${id}`)
    } catch (error) {
        console.error("Database Error:", error)
        return {
            message: "Failed to delete assistant",
            errors: {
                message: ["An unexpected error occurred"],
            },
        }
    }

    revalidatePath("/dashboard/assistants")
    redirect(`/dashboard/assistants?message=${encodeURIComponent(`Assistant ${name} was successfully deleted`)}`)
}



