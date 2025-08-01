"use server"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { z } from "zod"
import { v4 as uuidv4 } from "uuid"
import { assistantsTable } from "@/lib/db/schema"
import { drizzle } from "drizzle-orm/node-postgres"
import { auth } from "@/app/(auth)/auth"
import { sql } from "drizzle-orm"
import { insertEmbedding} from "@/app/dashboard/assistants/lib/embeddings";
import {put} from "@vercel/blob";
import { parse as csvParse } from "csv-parse/sync"


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






// CSV validation function
function validateCsvStructure(csvContent: string): { isValid: boolean; message?: string } {
    try {
        // Try to parse the CSV
        const records = csvParse(csvContent, {
            columns: true,
            skip_empty_lines: true
        })

        // Check if we have any records
        if (records.length === 0) {
            return { isValid: false, message: "CSV file is empty or has no data rows" }
        }

        // Check if we have at least one column
        if (Object.keys(records[0]).length === 0) {
            return { isValid: false, message: "CSV file has no columns" }
        }

        return { isValid: true }
    } catch (error) {
        return {
            isValid: false,
            message: `Invalid CSV format: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
    }
}

// Format a CSV row as text for embedding
function formatRowAsText(row: Record<string, any>): string {
    return Object.entries(row)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
}

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

        let fileName = ""
        let csvContent = ""

        if (validatedData.ragEnabled === "yes") {
            // Get the single file from FormData
            const file = formData.get("file") as File

            if (!file || !(file instanceof File) || file.size === 0) {
                return {
                    success: false,
                    message: "No CSV file provided or file is empty",
                    redirect: undefined,
                }
            }

            // Validate file type
            if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
                return {
                    success: false,
                    message: "Only CSV files are supported",
                    redirect: undefined,
                }
            }

            // Generate a unique filename (for reference only, not storing the file)
            fileName = `${uuidv4()}-${file.name}`

            // Convert file to ArrayBuffer and then to Buffer
            const arrayBuffer = await file.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            // Get CSV content as string
            csvContent = buffer.toString('utf-8')

            // Validate CSV structure
            const validation = validateCsvStructure(csvContent)
            if (!validation.isValid) {
                return {
                    success: false,
                    message: validation.message || "Invalid CSV format",
                    redirect: undefined,
                }
            }
        }

        // Insert data into the database with userId and RETURN the inserted record
        const [assistant] = await db.insert(assistantsTable).values({
            name: validatedData.name,
            provider: validatedData.provider,
            modelName: validatedData.modelName,
            systemPrompt: validatedData.systemPrompt,
            suggestions: validatedData.suggestions,
            temperature: validatedData.temperature,
            maxTokens: validatedData.maxTokens,
            ragEnabled: validatedData.ragEnabled === "yes",
            files: [], // No files stored, just using the content for embeddings
            userId: userId,
            apiKey: validatedData.apiKey,
        }).returning();

        console.log("Created assistant with ID:", assistant.id);

        // Process CSV content and create embeddings row by row
        if (csvContent && assistant.id) {
            try {
                // Parse the CSV
                const records = csvParse(csvContent, {
                    columns: true,
                    skip_empty_lines: true
                });

                // Process each row individually for embeddings
                for (const record of records) {
                    // Format the row as text
                    const rowText = formatRowAsText(record);

                    // Create embedding for this individual row
                    await insertEmbedding(assistant.id, rowText);
                }

                console.log(`Processed ${records.length} rows from CSV for embeddings`);
            } catch (error) {
                console.error("Error processing CSV for embeddings:", error);
                // Continue with the function even if embedding fails
                // We've already created the assistant
            }
        }

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
// Helper function to chunk text into smaller pieces


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

export async function updateAssistant(id: string, formData: FormData) {
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

        // Verify the assistant belongs to the user before updating
        const existingAssistant = await db.select().from(assistantsTable).where(sql`id = ${id} AND "userId" = ${userId}`)

        if (existingAssistant.length === 0) {
            return {
                success: false,
                message: "Assistant not found or unauthorized",
                redirect: undefined,
            }
        }

        // Update the assistant in the database
        await db.update(assistantsTable)
            .set({
                name: validatedData.name,
                provider: validatedData.provider,
                modelName: validatedData.modelName,
                systemPrompt: validatedData.systemPrompt,
                suggestions: validatedData.suggestions,
                temperature: validatedData.temperature,
                maxTokens: validatedData.maxTokens,
                ragEnabled: validatedData.ragEnabled === "yes",
                apiKey: validatedData.apiKey,
            })
            .where(sql`id = ${id} AND "userId" = ${userId}`)

        // Return success with redirect URL
        return {
            success: true,
            message: "Assistant updated successfully",
            redirect: `/dashboard/assistants?message=${encodeURIComponent(`Assistant ${validatedData.name} was successfully updated`)}`,
        }
    } catch (error) {
        console.error("Database Error:", error)
        return {
            success: false,
            message: "Failed to update assistant. Please try again.",
            redirect: undefined,
        }
    }
}

