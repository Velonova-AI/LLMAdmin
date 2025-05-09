"use client"

import type React from "react"
import { useState, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Trash2, Plus, AlertCircle, Eye, EyeOff, FileSpreadsheet } from 'lucide-react'
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { createAssistant } from "@/app/dashboard/assistants/lib/actions"
import { useForm } from "react-hook-form"

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
        apiKey: "",
    },
    legal: {
        name: "Legal Policy Generator",
        provider: "anthropic",
        modelName: "claude-3-7-sonnet-latest",
        systemPrompt:
            "You are a legal document specialist. Generate clear, comprehensive legal policies such as terms of service, privacy policies, and user agreements that protect businesses while remaining accessible to users.",
        suggestions: [
            "Create a privacy policy for my e-commerce website",
            "Draft terms and conditions for a SaaS platform",
            "Generate a GDPR-compliant data processing agreement",
        ],
        temperature: 0.3,
        maxTokens: 4000,
        apiKey: "",
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
        apiKey: "",
    },
    custom: {
        name: "Custom Assistant",
        provider: "",
        modelName: "",
        systemPrompt: "",
        suggestions: [],
        temperature: 0.7,
        maxTokens: 2000,
        apiKey: "",
    },
}

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    provider: z.string({
        required_error: "Please select a provider.",
    }),
    modelName: z.string({
        required_error: "Please select a model.",
    }),
    systemPrompt: z.string().min(10, {
        message: "System prompt must be at least 10 characters.",
    }),
    temperature: z.number().min(0).max(2),
    maxTokens: z.number().min(1).max(32000),
    ragEnabled: z.enum(["yes", "no"]),
    apiKey: z.string().min(1, {
        message: "API key is required.",
    }),
})

type FormValues = z.infer<typeof formSchema>

// Maximum file size in bytes (10MB)
const MAX_FILE_SIZE = 10 * 1024 * 1024

export function CreateForm() {
    const router = useRouter()
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [newSuggestion, setNewSuggestion] = useState("")
    const [csvFile, setCsvFile] = useState<File | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedPreset, setSelectedPreset] = useState<string>("custom")
    const [fileError, setFileError] = useState<string | null>(null)
    const [showApiKey, setShowApiKey] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const formRef = useRef<HTMLFormElement>(null)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            provider: "",
            modelName: "",
            systemPrompt: "",
            temperature: 0.7,
            maxTokens: 2048,
            ragEnabled: "no",
            apiKey: "",
        },
    })

    const ragEnabled = form.watch("ragEnabled") === "yes"

    // Function to apply preset configuration
    const applyPreset = (presetKey: string) => {
        setSelectedPreset(presetKey)
        const preset = assistantPresets[presetKey as keyof typeof assistantPresets]

        // Update form values
        form.setValue("name", preset.name)
        form.setValue("provider", preset.provider)
        form.setValue("modelName", preset.modelName)
        form.setValue("systemPrompt", preset.systemPrompt)
        form.setValue("temperature", preset.temperature)
        form.setValue("maxTokens", preset.maxTokens)

        // Update suggestions
        setSuggestions([...preset.suggestions])
    }

    // Validate CSV file
    const validateCsvFile = (file: File): boolean => {
        // Check file extension
        if (!file.name.toLowerCase().endsWith('.csv') && file.type !== 'text/csv') {
            setFileError("Only CSV files are supported")
            return false
        }

        // Check file size
        if (file.size > MAX_FILE_SIZE) {
            setFileError(`File size (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds the limit of ${(MAX_FILE_SIZE / (1024 * 1024)).toFixed(2)}MB`)
            return false
        }

        return true
    }

    async function onSubmit(values: FormValues) {
        if (!formRef.current) return

        // Check if RAG is enabled but no CSV file is provided
        if (ragEnabled && !csvFile) {
            setFileError("Please upload a CSV file")
            return
        }

        setIsSubmitting(true)
        setFileError(null)
        setErrorMessage(null) // Clear previous errors

        try {
            // Create a FormData object
            const formData = new FormData()

            // Manually add all form values to ensure they're included
            formData.append("name", values.name)
            formData.append("provider", values.provider)
            formData.append("modelName", values.modelName)
            formData.append("systemPrompt", values.systemPrompt)
            formData.append("temperature", values.temperature.toString())
            formData.append("maxTokens", values.maxTokens.toString())
            formData.append("ragEnabled", values.ragEnabled)
            formData.append("apiKey", values.apiKey)

            // Add the suggestions as JSON
            formData.append("suggestions", JSON.stringify(suggestions))

            // Add CSV file if RAG is enabled
            if (ragEnabled && csvFile) {
                formData.append("file", csvFile)
            }

            // Submit the form using the server action
            const result = await createAssistant(formData)

            // Check if we got an error response
            if (result && !result.success) {
                setErrorMessage(result.message || "An error occurred while creating the assistant.")
                return
            }

            // Handle successful response with redirect
            if (result && result.success && result.redirect) {
                router.push(result.redirect)
                return
            }

            // If we get here, it means no redirect happened and no errors
            // Reset the form
            form.reset()
            setSuggestions([])
            setCsvFile(null)
        } catch (error: any) {
            // If this is a redirect error from Next.js, don't show an alert
            if (error?.digest?.includes("NEXT_REDIRECT")) {
                // This is a redirect, let Next.js handle it
                return
            }

            console.error("Error submitting form:", error)

            // Check if it's a file size error
            if (error.message && error.message.includes("Body exceeded")) {
                setFileError(
                    "File upload failed: The file size exceeds the server limit. Please reduce the file size."
                )
            } else {
                setErrorMessage("An error occurred while creating the assistant. Please try again.")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    function addSuggestion() {
        if (newSuggestion.trim() !== "") {
            setSuggestions([...suggestions, newSuggestion])
            setNewSuggestion("")
        }
    }

    function removeSuggestion(index: number) {
        setSuggestions(suggestions.filter((_, i) => i !== index))
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFileError(null)

        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]

            if (validateCsvFile(file)) {
                setCsvFile(file)
            } else {
                // Clear the file input
                e.target.value = ""
            }
        } else {
            setCsvFile(null)
        }
    }

    function removeFile() {
        setCsvFile(null)
        setFileError(null)

        // Clear the file input if it exists
        const fileInput = document.getElementById('csv-upload') as HTMLInputElement
        if (fileInput) {
            fileInput.value = ""
        }
    }

    return (
        <Form {...form}>
            {errorMessage && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="size-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
            )}

            <div className="mb-6">
                <FormLabel className="text-base">Assistant Type</FormLabel>
                <p className="text-sm text-muted-foreground mb-3">Select a preset or create a custom assistant</p>
                <Select value={selectedPreset} onValueChange={applyPreset}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a preset" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="grant">Grant & Business Plan Generator</SelectItem>
                        <SelectItem value="legal">Legal Policy Generator</SelectItem>
                        <SelectItem value="marketing">Marketing Content Generator</SelectItem>
                        <SelectItem value="custom">Custom Assistant</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="My Assistant" {...field} />
                            </FormControl>
                            <FormDescription>A unique name for your AI assistant.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="provider"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Provider</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select provider" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="openai">OpenAI</SelectItem>
                                        <SelectItem value="anthropic">Anthropic</SelectItem>
                                        <SelectItem value="mistral">Mistral AI</SelectItem>
                                        <SelectItem value="cohere">Cohere</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>The AI provider for your assistant.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="modelName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Model</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select model" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                                        <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                                        <SelectItem value="claude-3-5-haiku-latest">claude-3-5-haiku-latest</SelectItem>
                                        <SelectItem value="claude-3-7-sonnet-latest">claude-3-7-sonnet-latest</SelectItem>
                                        <SelectItem value="mistral-large">Mistral Large</SelectItem>
                                        <SelectItem value="claude-3-5-sonnet-latest">claude-3-5-sonnet-latest</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>The model to use for your assistant.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>API Key</FormLabel>
                            <div className="relative">
                                <FormControl>
                                    <Input type={showApiKey ? "text" : "password"} placeholder="Enter your API key" {...field} />
                                </FormControl>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-2 top-1/2 -translate-y-1/2"
                                    onClick={() => setShowApiKey(!showApiKey)}
                                >
                                    {showApiKey ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </Button>
                            </div>
                            <FormDescription>
                                Your API key for the selected provider. This will be encrypted before storage.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="systemPrompt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>System Prompt</FormLabel>
                            <FormControl>
                                <Textarea placeholder="You are a helpful AI assistant..." className="min-h-32" {...field} />
                            </FormControl>
                            <FormDescription>Instructions that define how your assistant behaves.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="space-y-4">
                    <div>
                        <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Suggestions
                        </div>
                        <p className="text-sm text-muted-foreground">Add example queries users can select.</p>
                    </div>

                    <div className="flex gap-2">
                        <Input
                            id="suggestions"
                            value={newSuggestion}
                            onChange={(e) => setNewSuggestion(e.target.value)}
                            placeholder="Add a suggestion..."
                            className="flex-1"
                        />
                        <Button type="button" onClick={addSuggestion} size="sm">
                            <Plus className="size-4 mr-1" /> Add
                        </Button>
                    </div>

                    {suggestions.length > 0 && (
                        <div className="space-y-2 mt-2">
                            {suggestions.map((suggestion, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-md">
                                    <span className="text-sm">{suggestion}</span>
                                    <Button type="button" variant="ghost" size="sm" onClick={() => removeSuggestion(index)}>
                                        <Trash2 className="size-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="temperature"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Temperature: {field.value}</FormLabel>
                                <FormControl>
                                    <Slider
                                        min={0}
                                        max={2}
                                        step={0.1}
                                        defaultValue={[field.value]}
                                        value={[field.value]}
                                        onValueChange={(value) => field.onChange(value[0])}
                                    />
                                </FormControl>
                                <FormDescription>Controls randomness: lower is more deterministic.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="maxTokens"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Max Tokens: {field.value}</FormLabel>
                                <FormControl>
                                    <Slider
                                        min={1}
                                        max={32000}
                                        step={1}
                                        defaultValue={[field.value]}
                                        value={[field.value]}
                                        onValueChange={(value) => field.onChange(value[0])}
                                    />
                                </FormControl>
                                <FormDescription>Maximum length of the generated response.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="ragEnabled"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Enable RAG (Retrieval Augmented Generation)</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={(value) => {
                                        field.onChange(value)
                                        // Clear file error when disabling RAG
                                        if (value === "no") {
                                            setFileError(null)
                                        }
                                    }}
                                    defaultValue={field.value}
                                    className="flex flex-row space-x-4"
                                >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="yes" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Yes</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="no" />
                                        </FormControl>
                                        <FormLabel className="font-normal">No</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormDescription>Allow the assistant to retrieve information from a CSV file.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {ragEnabled && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Upload CSV File
                                </div>
                                <p className="text-sm text-muted-foreground">Upload a CSV file for your assistant to reference.</p>

                                {fileError && (
                                    <Alert variant="destructive" className="mb-4">
                                        <AlertCircle className="size-4" />
                                        <AlertDescription>{fileError}</AlertDescription>
                                    </Alert>
                                )}

                                <div className="text-sm text-muted-foreground mb-2">
                                    Maximum file size: {(MAX_FILE_SIZE / (1024 * 1024)).toFixed(2)}MB. Only CSV files are supported.
                                </div>

                                <Input
                                    id="csv-upload"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".csv,text/csv"
                                />

                                {csvFile && (
                                    <div className="mt-4 bg-muted p-3 rounded-md">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <FileSpreadsheet className="size-5" />
                                                <div>
                                                    <p className="text-sm font-medium">{csvFile.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {(csvFile.size / 1024).toFixed(1)} KB
                                                    </p>
                                                </div>
                                                <Badge variant="outline" className="ml-2">CSV</Badge>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={removeFile}
                                                className="size-8 p-0"
                                            >
                                                <Trash2 className="size-4 text-destructive" />
                                                <span className="sr-only">Remove file</span>
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting || !!fileError || (ragEnabled && !csvFile)}>
                    {isSubmitting ? "Creating..." : "Create Assistant"}
                </Button>
            </form>
        </Form>
    )
}