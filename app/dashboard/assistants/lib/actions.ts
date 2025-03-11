"use server"

import { revalidatePath } from "next/cache"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import { assistantsTable } from "@/lib/db/schema"
import { drizzle } from "drizzle-orm/node-postgres"
import { redirect } from "next/navigation"
import { auth } from "@/app/(auth)/auth"
import { sql } from "drizzle-orm"

// Create a Drizzle ORM instance
const db = drizzle(process.env.POSTGRES_URL!)

// Constants for pagination
const ITEMS_PER_PAGE = 5

// Make sure the user-specific files directory exists
async function ensureUserFilesDirectory(userId: string) {
    try {
        const userDir = path.join(process.cwd(), "public", "files", userId)
        await mkdir(userDir, { recursive: true })
        return userDir
    } catch (error) {
        console.error(`Failed to create files directory for user ${userId}:`, error)
        throw error
    }
}

// Validation schema for the form data
const AssistantFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    provider: z.string().min(1, "Provider is required"),
    modelName: z.string().min(1, "Model name is required"),
    systemPrompt: z.string().min(10, "System prompt must be at least 10 characters"),
    suggestions: z.array(z.string()).default([]),
    temperature: z.coerce.number().min(0).max(2),
    maxTokens: z.coerce.number().min(1).max(32000),
    ragEnabled: z.enum(["yes", "no"]),
})

export async function createAssistant(formData: FormData) {
    try {
        // Get the user session
        const session = await auth()
        if (!session || !session.user || !session.user.id) {
            return redirect("/login")
        }

        const userId = session.user.id

        // Extract form fields
        const name = formData.get("name") as string
        const provider = formData.get("provider") as string
        const modelName = formData.get("modelName") as string
        const systemPrompt = formData.get("systemPrompt") as string
        const temperatureStr = formData.get("temperature") as string
        const maxTokensStr = formData.get("maxTokens") as string
        const ragEnabled = formData.get("ragEnabled") as string

        // Parse suggestions from JSON string
        const suggestionsStr = formData.get("suggestions") as string
        const suggestions = suggestionsStr ? JSON.parse(suggestionsStr) : []

        // Log the received data for debugging
        console.log("Received form data:", {
            userId,
            name,
            provider,
            modelName,
            systemPrompt,
            temperature: temperatureStr,
            maxTokens: maxTokensStr,
            ragEnabled,
            suggestions,
        })

        // Validate the data
        const validatedData = AssistantFormSchema.parse({
            name,
            provider,
            modelName,
            systemPrompt,
            suggestions,
            temperature: temperatureStr,
            maxTokens: maxTokensStr,
            ragEnabled,
        })

        // Handle file uploads if RAG is enabled
        const fileNames: string[] = []

        if (validatedData.ragEnabled === "yes") {
            // Create user-specific directory
            const userDir = await ensureUserFilesDirectory(userId)

            // Get files from the FormData
            const filesInput = formData.getAll("files") as File[]

            for (const file of filesInput) {
                if (file instanceof File && file.size > 0) {
                    // Generate a unique filename
                    const fileName = `${uuidv4()}-${file.name}`
                    const filePath = path.join(userDir, fileName)

                    // Convert file to ArrayBuffer and then to Buffer
                    const arrayBuffer = await file.arrayBuffer()
                    const buffer = Buffer.from(arrayBuffer)

                    // Write the file to disk
                    await writeFile(filePath, buffer)

                    // Store just the filename in our array (we'll prepend the userId when retrieving)
                    fileNames.push(fileName)
                }
            }
        }

        // Insert data into the database with userId
        await db.insert(assistantsTable).values({
            name: validatedData.name,
            provider: validatedData.provider,
            modelName: validatedData.modelName,
            systemPrompt: validatedData.systemPrompt,
            suggestions: validatedData.suggestions,
            temperature: validatedData.temperature,
            maxTokens: validatedData.maxTokens,
            ragEnabled: validatedData.ragEnabled === "yes",
            files: fileNames,
            userId: userId, // Add the userId from the session
        })


    } catch (error) {
        console.error("Error creating assistant:", error)

        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: "Validation failed",
                errors: error.errors,
            }
        }

        return {
            success: false,
            message: "Failed to create assistant",
        }
    }

    // Redirect to the assistants list page with success message
    redirect(`/dashboard/assistants?message=${encodeURIComponent(`Assistant  was successfully created`)}`)


}

// Data fetching functions
export async function fetchFilteredAssistants(query: string, currentPage: number) {
    // Get the user session
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
        return []
    }

    const userId = session.user.id
    const offset = (currentPage - 1) * ITEMS_PER_PAGE

    try {
        const assistantsList = await db
            .select()
            .from(assistantsTable)
            .where(
                sql`"userId" = ${userId} AND (
                    LOWER(name) LIKE LOWER(${`%${query}%`}) OR 
                    LOWER(system_prompt) LIKE LOWER(${`%${query}%`}) OR
                    LOWER(provider) LIKE LOWER(${`%${query}%`}) OR
                    LOWER(model_name) LIKE LOWER(${`%${query}%`})
                )`,
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
    // Get the user session
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
        return 0
    }

    const userId = session.user.id

    try {
        const count = await db
            .select({ count: sql<number>`count(*)` })
            .from(assistantsTable)
            .where(
                sql`"userId" = ${userId} AND (
                    LOWER(name) LIKE LOWER(${`%${query}%`}) OR 
                    LOWER(system_prompt) LIKE LOWER(${`%${query}%`}) OR
                    LOWER(provider) LIKE LOWER(${`%${query}%`}) OR
                    LOWER(model_name) LIKE LOWER(${`%${query}%`})
                )`,
            )

        const totalPages = Math.ceil(Number(count[0].count) / ITEMS_PER_PAGE)
        return totalPages
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Failed to fetch total number of assistants.")
    }
}

export async function fetchAssistantById(id: string) {
    // Get the user session
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
        throw new Error("Unauthorized")
    }

    const userId = session.user.id

    try {
        const result = await db.select().from(assistantsTable).where(sql`id = ${id} AND "userId" = ${userId}`)

        if (result.length === 0) {
            throw new Error("Assistant not found or unauthorized")
        }

        return result[0]
    } catch (error) {
        console.error("Database Error:", error)
        throw new Error("Failed to fetch assistant.")
    }
}

export async function deleteAssistant(id: string, name: string) {
    // Get the user session
    const session = await auth()
    if (!session || !session.user || !session.user.id) {
        redirect("/login")
    }

    const userId = session.user.id

    try {
        // Verify the assistant belongs to the user before deleting
        const assistant = await db.select().from(assistantsTable).where(sql`id = ${id} AND "userId" = ${userId}`)

        if (assistant.length === 0) {
            return {
                message: "Assistant not found or unauthorized",
                errors: {
                    message: ["You don't have permission to delete this assistant"],
                },
            }
        }

        await db.delete(assistantsTable).where(sql`id = ${id} AND "userId" = ${userId}`)
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

