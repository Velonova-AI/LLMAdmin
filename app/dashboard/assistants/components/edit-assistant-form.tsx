"use client"
import { z } from "zod"
import type React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { type FormState, updateAssistant } from "@/app/dashboard/assistants/lib/actions"
import type { Assistant } from "@/lib/db/schema"

// Define the form schema with Zod
const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    assistantType: z.string({
        required_error: "Please select an assistant type",
    }),
    provider: z.string({
        required_error: "Please select a provider",
    }),
    apiKey: z.string().min(1, "API key is required"),
    modelName: z.string().min(1, "Model name is required"),
    systemPrompt: z.string().min(10, "System prompt should be at least 10 characters"),
    suggestions: z.string().default("[]"),
    temperature: z.number().min(0).max(1),
    maxTokens: z.number().int().positive(),
})

type FormValues = z.infer<typeof formSchema>

// Preset configurations for each assistant type
const assistantPresets = {
    grant: {
        name: "Grant & Business Plan Generator",
        provider: "openai",
        modelName: "gpt-4o",
        systemPrompt:
            "You are an expert in creating grant proposals and business plans. Help users craft compelling, well-structured documents that clearly articulate their vision, goals, and implementation strategies.",
        suggestions: [
            "Help me write a grant proposal for a community garden",
            "Create a business plan for a tech startup",
            "Outline a funding request for an educational program",
        ],
        temperature: 0.7,
        maxTokens: 2000,
    },
    legal: {
        name: "Legal Policy Generator",
        provider: "anthropic",
        modelName: "claude-3-opus",
        systemPrompt:
            "You are a legal document specialist. Generate clear, comprehensive legal policies such as terms of service, privacy policies, and user agreements that protect businesses while remaining accessible to users.",
        suggestions: [
            "Create a privacy policy for my e-commerce website",
            "Draft terms and conditions for a SaaS platform",
            "Generate a GDPR-compliant data processing agreement",
        ],
        temperature: 0.3,
        maxTokens: 4000,
    },
    marketing: {
        name: "Marketing Content Generator",
        provider: "openai",
        modelName: "gpt-4o",
        systemPrompt:
            "You are a creative marketing expert. Generate engaging, persuasive content for various marketing channels that captures attention, communicates value propositions, and drives conversions.",
        suggestions: [
            "Write social media posts for a product launch",
            "Create email newsletter content for a seasonal promotion",
            "Draft a compelling product description for my new service",
        ],
        temperature: 0.8,
        maxTokens: 1500,
    },
    custom: {
        name: "Custom Assistant",
        provider: "",
        modelName: "",
        systemPrompt: "",
        suggestions: [],
        temperature: 0.7,
        maxTokens: 2000,
    },
}

// Initial form state that matches FormState type exactly
const initialState: FormState = {
    errors: {},
    message: "",
    success: false,
}

interface EditAssistantFormProps {
    assistant: Assistant
}

export default function EditAssistantForm({ assistant }: EditAssistantFormProps) {
    // Parse suggestions from string to array
    const initialSuggestions = (() => {
        if (Array.isArray(assistant.suggestions)) {
            return assistant.suggestions
        }

        if (typeof assistant.suggestions === "string") {
            try {
                // Try to parse it as JSON
                return JSON.parse(assistant.suggestions)
            } catch (e) {
                // If it fails, it might be a newline-separated string
                return assistant.suggestions.split("\n").filter(Boolean)
            }
        }


        return assistant.suggestions || []
    })()

    console.log(initialSuggestions)

    // State for suggestions
    const [suggestions, setSuggestions] = useState<string[]>(initialSuggestions)
    const [suggestionInput, setSuggestionInput] = useState("")
    const [formState, setFormState] = useState<FormState>(initialState)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Initialize the form with assistant data
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: assistant.name,
            assistantType: assistant.assistantType,
            provider: assistant.provider,
            apiKey: assistant.apiKey,
            modelName: assistant.modelName,
            systemPrompt: assistant.systemPrompt,
            suggestions: JSON.stringify(initialSuggestions), // Use the parsed initialSuggestions
            temperature: assistant.temperature,
            maxTokens: assistant.maxTokens,
        },
    })

    // Watch for changes to the assistant type
    const assistantType = form.watch("assistantType")

    // Update form values when assistant type changes
    useEffect(() => {
        if (!assistantType) return

        let preset
        switch (assistantType) {
            case "grant":
                preset = assistantPresets.grant
                break
            case "legal":
                preset = assistantPresets.legal
                break
            case "marketing":
                preset = assistantPresets.marketing
                break
            case "custom":
                preset = assistantPresets.custom
                break
            default:
                return
        }

        // Update form values with preset configuration
        form.setValue("name", preset.name || "")
        form.setValue("provider", preset.provider || "")
        form.setValue("modelName", preset.modelName || "")
        form.setValue("systemPrompt", preset.systemPrompt || "")
        form.setValue("temperature", preset.temperature)
        form.setValue("maxTokens", preset.maxTokens)

        // Update suggestions state
        setSuggestions(preset.suggestions || [])
        // Also update the form value as a JSON string
        form.setValue("suggestions", JSON.stringify(preset.suggestions || []))
    }, [assistantType, form])

    // Handle adding a new suggestion
    const handleAddSuggestion = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && suggestionInput.trim()) {
            e.preventDefault()
            const newSuggestions = [...suggestions, suggestionInput.trim()]
            setSuggestions(newSuggestions)
            setSuggestionInput("")

            // Update the form value
            form.setValue("suggestions", newSuggestions.join("\n"))
        }
    }

    // Handle removing a suggestion
    const handleRemoveSuggestion = (index: number) => {
        const newSuggestions = suggestions.filter((_, i) => i !== index)
        setSuggestions(newSuggestions)

        // Update the form value
        form.setValue("suggestions", newSuggestions.join("\n"))
    }

    // Form submission handler
    const onSubmit = async (data: FormValues) => {
        try {
            setIsSubmitting(true)

            // Convert form data to FormData for server action
            const formData = new FormData()
            Object.entries(data).forEach(([key, value]) => {
                if (key === "suggestions") {
                    // Convert suggestions array to JSON string
                    formData.append(key, JSON.stringify(suggestions))
                } else {
                    formData.append(key, value?.toString() || "")
                }
            })

            // Call the server action directly
            const result = await updateAssistant(assistant.id, initialState, formData)

            // Update state with the result
            setFormState(result)

            if (result.success) {
                // Scroll to top to show success message
                window.scrollTo({ top: 0, behavior: "smooth" })
            }
        } catch (error) {
            console.error("Form submission error:", error)
            setFormState({
                errors: { _form: ["An unexpected error occurred. Please try again."] },
                message: "Failed to update assistant",
                success: false,
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Edit AI Assistant</CardTitle>
                <CardDescription>Update your AI assistant configuration</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Display form-level errors */}
                        {formState.errors && formState.errors._form && (
                            <div className="p-3 rounded-md bg-destructive/15 text-destructive">
                                {formState.errors._form.map((error: string) => (
                                    <p key={error}>{error}</p>
                                ))}
                            </div>
                        )}

                        {/* Display success message */}
                        {formState.success && <div className="p-3 rounded-md bg-green-100 text-green-800">{formState.message}</div>}

                        {/* Assistant Type - This should come first as it affects other fields */}
                        <FormField
                            control={form.control}
                            name="assistantType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Assistant Type</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value || ""}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select assistant type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="grant">Grant & Business Plan Generator</SelectItem>
                                            <SelectItem value="legal">Legal Policy Generator</SelectItem>
                                            <SelectItem value="marketing">Marketing Content Generator</SelectItem>
                                            <SelectItem value="custom">Custom Assistant</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>Select a pre-configured assistant type or create a custom one.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter assistant name" {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormDescription>A descriptive name for your AI assistant.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Provider */}
                            <FormField
                                control={form.control}
                                name="provider"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Provider</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value || ""}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select provider" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="openai">OpenAI</SelectItem>
                                                <SelectItem value="anthropic">Anthropic</SelectItem>
                                                <SelectItem value="google">Google</SelectItem>
                                                <SelectItem value="mistral">Mistral</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>The AI provider to use.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* API Key */}
                            <FormField
                                control={form.control}
                                name="apiKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>API Key</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Enter your API key" {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormDescription>Your API key for the selected provider.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Model Name */}
                            <FormField
                                control={form.control}
                                name="modelName"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Model Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., gpt-4o, claude-3-opus" {...field} value={field.value || ""} />
                                        </FormControl>
                                        <FormDescription>The specific model to use.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Temperature */}
                            <FormField
                                control={form.control}
                                name="temperature"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Temperature: {field.value}</FormLabel>
                                        <FormControl>
                                            <Slider
                                                min={0}
                                                max={1}
                                                step={0.1}
                                                value={[field.value]}
                                                onValueChange={(value) => field.onChange(value[0])}
                                            />
                                        </FormControl>
                                        <FormDescription>Controls randomness (0 = deterministic, 1 = creative).</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Max Tokens */}
                            <FormField
                                control={form.control}
                                name="maxTokens"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Max Tokens</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={1}
                                                {...field}
                                                value={field.value}
                                                onChange={(e) => field.onChange(Number(e.target.value) || 2000)}
                                            />
                                        </FormControl>
                                        <FormDescription>Maximum number of tokens in the response.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* System Prompt */}
                        <FormField
                            control={form.control}
                            name="systemPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>System Prompt</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Enter system instructions for the AI"
                                            className="min-h-[100px]"
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                            onBlur={field.onBlur}
                                            name={field.name}
                                            ref={field.ref}
                                        />
                                    </FormControl>
                                    <FormDescription>Instructions that define how the AI assistant should behave.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Suggestions */}
                        <FormField
                            control={form.control}
                            name="suggestions"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Suggestions</FormLabel>
                                    <FormControl>
                                        <div className="space-y-4">
                                            <Input
                                                type="text"
                                                placeholder="Type a suggestion and press Enter"
                                                value={suggestionInput}
                                                onChange={(e) => setSuggestionInput(e.target.value)}
                                                onKeyDown={handleAddSuggestion}
                                            />
                                            <div className="flex flex-wrap gap-2">
                                                {suggestions.map((suggestion, index) => (
                                                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                        {suggestion}
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            className="size-4 p-0 hover:bg-transparent"
                                                            onClick={() => handleRemoveSuggestion(index)}
                                                        >
                                                            <X className="size-3" />
                                                            <span className="sr-only">Remove suggestion</span>
                                                        </Button>
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </FormControl>
                                    <FormDescription>Add example queries or prompts for users (optional)</FormDescription>
                                    <FormMessage />
                                    <input type="hidden" name="suggestions" value={field.value || ""} />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end space-x-4">
                            <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Saving..." : "Update Assistant"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

