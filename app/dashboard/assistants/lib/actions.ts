"use server"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import { assistantsTable } from "@/lib/db/schema"
import { drizzle } from "drizzle-orm/node-postgres"
import { auth } from "@/app/(auth)/auth"
import { sql } from "drizzle-orm"

// Create a Drizzle ORM instance
const db = drizzle(process.env.POSTGRES_URL!)

// Constants for pagination
const ITEMS_PER_PAGE = 6

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
    apiKey: z.string().min(1, "API key is required"),
})

export async function createAssistant(formData: FormData) {
    try {
        // Get the user session
        const session = await auth()
        if (!session || !session.user || !session.user.id) {
            return {
                success: false,
                message: "Authentication required",
                redirect: "/login",
            }
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
        const apiKey = formData.get("apiKey") as string

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
            apiKey: "********", // Mask the API key in logs
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
            apiKey,
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
            apiKey: validatedData.apiKey, // Store the API key
        })

        // Return success with redirect URL
        return {
            success: true,
            message: "Assistant successfully created",
            redirect: `/dashboard/assistants?message=${encodeURIComponent(`Assistant was successfully created`)}`,
        }
    } catch (error) {
        console.error("Error creating assistant:", error)

        // Check for unique constraint violation (PostgreSQL error code 23505)
        if (error && typeof error === "object" && "code" in error && error.code === "23505") {
            // Simplified error message for all constraint violations
            return {
                success: false,
                message: "An assistant with this name already exists. Please choose a different name.",
                redirect: undefined,
            }
        }

        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: "Validation failed. Please check your input and try again.",
                redirect: undefined,
            }
        }

        return {
            success: false,
            message: "Failed to create assistant. Please try again.",
            redirect: undefined,
        }
    }
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
        return {
            success: false,
            message: "Authentication required",
            redirect: "/login",
        }
    }

    const userId = session.user.id

    try {
        // Verify the assistant belongs to the user before deleting
        const assistant = await db.select().from(assistantsTable).where(sql`id = ${id} AND "userId" = ${userId}`)

        if (assistant.length === 0) {
            return {
                success: false,
                message: "Assistant not found or unauthorized",
                redirect: undefined,
            }
        }

        await db.delete(assistantsTable).where(sql`id = ${id} AND "userId" = ${userId}`)

        // Return success with redirect URL
        return {
            success: true,
            message: "Assistant deleted successfully",
            redirect: `/dashboard/assistants?message=${encodeURIComponent(`Assistant ${name} was successfully deleted`)}`,
        }
    } catch (error) {
        console.error("Database Error:", error)
        return {
            success: false,
            message: "Failed to delete assistant. Please try again.",
            redirect: undefined,
        }
    }
}

