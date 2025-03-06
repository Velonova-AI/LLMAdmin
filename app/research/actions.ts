"use server"

import { revalidatePath } from "next/cache"
import { formSchema } from "./schema"
import type { z } from "zod"
import {surveyResponses} from "@/lib/db/schema";
import postgres from "postgres";
import {drizzle} from "drizzle-orm/postgres-js";


const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function submitForm(formData: z.infer<typeof formSchema>) {
  try {
    // Validate the form data
    const validatedFields = formSchema.safeParse(formData)

    if (!validatedFields.success) {
      return {
        success: false,
        message: "Invalid form data. Please check your inputs.",
      }
    }

    const data = validatedFields.data

    // Insert data into the database
    await db.insert(surveyResponses).values({
      // General Information
      name: data.generalInfo.name,
      email: data.generalInfo.email,
      country: data.generalInfo.country,
      startupName: data.generalInfo.startupName,

      // Content Generation Challenges
      challenges: data.contentGenerationChallenges.challenges,
      otherChallenge: data.contentGenerationChallenges.otherChallenge,

      // Generative AI
      hasUsedAi: data.generativeAI.used,
      currentSolutionName: data.generativeAI.currentSolutionName,
      solutions: data.generativeAI.solutions,
      otherSolution: data.generativeAI.otherSolution,

      // Satisfaction Gaps
      unsatisfactorySolutions: data.satisfactionGaps.unsatisfactorySolutions,
      otherUnsatisfactorySolution: data.satisfactionGaps.otherUnsatisfactorySolution,

      // Feature Expectations
      featureExpectations: data.featureExpectations,

      // Willingness to Pay
      likelihoodToPay: data.willingnessToPay.likelihood,
      priceRange: data.willingnessToPay.priceRange,
      otherPriceRange: data.willingnessToPay.otherPriceRange,

      // Additional Insights
      additionalInsights: data.additionalInsights,

      // Contact Information
      followUpInterview: data.contactInfo.followUpInterview || false,

      // Metadata
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Revalidate the path to show the latest data
    revalidatePath("/research")

    return {
      success: true,
      message: "Thank you for completing the survey! Your feedback is valuable to us.",
    }
  } catch (error) {
    console.error("Error submitting survey form:", error)
    return {
      success: false,
      message: "There was an error submitting your survey. Please try again.",
    }
  }
}

