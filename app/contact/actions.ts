"use server"

import { z } from "zod"

import { contacts } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import postgres from "postgres";
import {drizzle} from "drizzle-orm/postgres-js";

const formSchema = z.object({
    email: z.string().email(),
    department: z.string(),
    message: z.string().min(10),
})


const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function submitContactForm(formData: z.infer<typeof formSchema>) {
    try {
        // Validate the form data
        const validatedFields = formSchema.safeParse(formData)

        if (!validatedFields.success) {
            return {
                success: false,
                error: "Invalid form data. Please check your inputs.",
            }
        }

        // Insert data into the database
        await db.insert(contacts).values({
            email: validatedFields.data.email,
            department: validatedFields.data.department,
            message: validatedFields.data.message,
            createdAt: new Date(),
        })

        // Revalidate the page to show the latest data
        revalidatePath("/")

        return { success: true }
    } catch (error) {
        console.error("Error submitting contact form:", error)
        return {
            success: false,
            error: "Failed to submit your message. Please try again later.",
        }
    }
}

