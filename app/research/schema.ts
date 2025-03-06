import { z } from "zod"

export const formSchema = z.object({
  generalInfo: z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    country: z.string().min(1, "Country is required"),
    startupName: z.string().min(1, "Startup name is required"),

  }),
  contentGenerationChallenges: z.object({
    challenges: z.array(z.string()).min(1, "Please select at least one challenge"),
    otherChallenge: z.string().optional(),
  }),
  generativeAI: z.object({
    used: z.boolean(),
    solutions: z.array(z.string()).optional(),
    currentSolutionName: z.string().optional(),
    otherSolution: z.string().optional(),
  }),
  satisfactionGaps: z.object({
    unsatisfactorySolutions: z.array(z.string()).optional(),
    otherUnsatisfactorySolution: z.string().optional(),
  }),
  featureExpectations: z.string().min(1, "Please provide your feature expectations"),
  willingnessToPay: z.object({
    likelihood: z.number().min(1).max(10),
    priceRange: z.string().min(1, "Please select a price range"),
    otherPriceRange: z.string().optional(),
  }),
  additionalInsights: z.string().optional(),
  contactInfo: z.object({
    followUpInterview: z.boolean().optional(),
  }),
})

export type FormData = z.infer<typeof formSchema>

export type SubmissionStatus = {
  type: "success" | "error"
  message: string
} | null

