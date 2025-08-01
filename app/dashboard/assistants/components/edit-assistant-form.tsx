"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Trash2, Plus, AlertCircle, Eye, EyeOff } from "lucide-react"
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
import { updateAssistant, fetchAssistantById } from "@/app/dashboard/assistants/lib/actions"
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

// Maximum file size in bytes (3MB)
const MAX_FILE_SIZE = 3 * 1024 * 1024
// Maximum total size of all files combined
const MAX_TOTAL_SIZE = 3.5 * 1024 * 1024

interface EditFormProps {
    assistantId: string
}

export function EditForm({ assistantId }: EditFormProps) {
    const router = useRouter()
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [newSuggestion, setNewSuggestion] = useState("")
    const [files, setFiles] = useState<File[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [selectedPreset, setSelectedPreset] = useState<string>("custom")
    const [fileError, setFileError] = useState<string | null>(null)
    const [showApiKey, setShowApiKey] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
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

    // Load assistant data on component mount
    useEffect(() => {
        async function loadAssistant() {
            try {
                const assistant = await fetchAssistantById(assistantId)
                
                // Set form values
                form.setValue("name", assistant.name)
                form.setValue("provider", assistant.provider)
                form.setValue("modelName", assistant.modelName)
                form.setValue("systemPrompt", assistant.systemPrompt)
                form.setValue("temperature", assistant.temperature)
                form.setValue("maxTokens", assistant.maxTokens)
                form.setValue("ragEnabled", assistant.ragEnabled ? "yes" : "no")
                form.setValue("apiKey", assistant.apiKey)
                
                // Set suggestions
                setSuggestions(assistant.suggestions || [])
                
                setIsLoading(false)
            } catch (error) {
                console.error("Failed to load assistant:", error)
                setErrorMessage("Failed to load assistant data")
                setIsLoading(false)
            }
        }
        
        loadAssistant()
    }, [assistantId, form])

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

    // Calculate total size of all files
    const calculateTotalFileSize = (fileList: File[]): number => {
        return fileList.reduce((total, file) => total + file.size, 0)
    }

    async function onSubmit(values: FormValues) {
        if (!formRef.current) return

        // Check total file size before submission
        if (ragEnabled && files.length > 0) {
            const totalSize = calculateTotalFileSize(files)
            if (totalSize > MAX_TOTAL_SIZE) {
                setFileError(
                    `Total file size (${(totalSize / (1024 * 1024)).toFixed(2)}MB) exceeds the limit of ${(MAX_TOTAL_SIZE / (1024 * 1024)).toFixed(2)}MB.`,
                )
                return
            }
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

            // Add files if RAG is enabled
            if (ragEnabled && files.length > 0) {
                files.forEach((file) => {
                    formData.append("files", file)
                })
            }

            // Call the update assistant action
            const result = await updateAssistant(assistantId, formData)

            if (result.success) {
                router.push(result.redirect || "/dashboard/assistants")
            } else {
                setErrorMessage(result.message || "Failed to update assistant")
            }
        } catch (error) {
            console.error("Error updating assistant:", error)
            setErrorMessage("An unexpected error occurred. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    function addSuggestion() {
        if (newSuggestion.trim()) {
            setSuggestions([...suggestions, newSuggestion.trim()])
            setNewSuggestion("")
        }
    }

    function removeSuggestion(indexToRemove: number) {
        setSuggestions(suggestions.filter((_, index) => index !== indexToRemove))
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedFiles = Array.from(e.target.files || [])
        setFileError(null)

        // Validate individual file sizes
        for (const file of selectedFiles) {
            if (file.size > MAX_FILE_SIZE) {
                setFileError(
                    `File ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB) exceeds the individual file size limit of ${(MAX_FILE_SIZE / (1024 * 1024)).toFixed(2)}MB.`,
                )
                return
            }
        }

        // Check total size
        const totalSize = calculateTotalFileSize([...files, ...selectedFiles])
        if (totalSize > MAX_TOTAL_SIZE) {
            setFileError(
                `Total file size (${(totalSize / (1024 * 1024)).toFixed(2)}MB) exceeds the limit of ${(MAX_TOTAL_SIZE / (1024 * 1024)).toFixed(2)}MB.`,
            )
            return
        }

        setFiles([...files, ...selectedFiles])
    }

    function removeFile(indexToRemove: number) {
        setFiles(files.filter((_, index) => index !== indexToRemove))
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p>Loading assistant data...</p>
                </div>
            </div>
        )
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a provider" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="openai">OpenAI</SelectItem>
                                        <SelectItem value="anthropic">Anthropic</SelectItem>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a model" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                                        <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                                        <SelectItem value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</SelectItem>
                                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>The specific model to use.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="systemPrompt"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>System Prompt</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="You are a helpful AI assistant..."
                                    className="min-h-[120px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Define the behavior and capabilities of your assistant.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="temperature"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Temperature: {field.value}</FormLabel>
                                <FormControl>
                                    <Slider
                                        value={[field.value]}
                                        onValueChange={(value) => field.onChange(value[0])}
                                        max={2}
                                        min={0}
                                        step={0.1}
                                        className="w-full"
                                    />
                                </FormControl>
                                <FormDescription>
                                    Controls randomness. Lower values are more deterministic.
                                </FormDescription>
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
                                        value={[field.value]}
                                        onValueChange={(value) => field.onChange(value[0])}
                                        max={32000}
                                        min={1}
                                        step={1}
                                        className="w-full"
                                    />
                                </FormControl>
                                <FormDescription>
                                    Maximum number of tokens in the response.
                                </FormDescription>
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
                            <FormLabel>RAG (Retrieval-Augmented Generation)</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex flex-col space-y-1"
                                >
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="yes" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Enable RAG</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-3 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="no" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Disable RAG</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormDescription>
                                Enable to allow your assistant to use uploaded documents for context.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {ragEnabled && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div>
                                    <FormLabel>Upload Documents (CSV files only)</FormLabel>
                                    <FormDescription>
                                        Upload CSV files to provide context for your assistant. Maximum 3MB per file, 3.5MB total.
                                    </FormDescription>
                                </div>

                                <div className="space-y-2">
                                    <Input
                                        type="file"
                                        accept=".csv"
                                        multiple
                                        onChange={handleFileChange}
                                        className="cursor-pointer"
                                    />
                                    {fileError && (
                                        <p className="text-sm text-destructive">{fileError}</p>
                                    )}
                                </div>

                                {files.length > 0 && (
                                    <div className="space-y-2">
                                        <FormLabel>Uploaded Files:</FormLabel>
                                        <div className="space-y-2">
                                            {files.map((file, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-2 border rounded"
                                                >
                                                    <span className="text-sm">{file.name}</span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeFile(index)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="space-y-4">
                    <div>
                        <FormLabel>Suggested Actions</FormLabel>
                        <FormDescription>
                            Add example prompts that users can click to start conversations.
                        </FormDescription>
                    </div>

                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add a suggestion..."
                                value={newSuggestion}
                                onChange={(e) => setNewSuggestion(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault()
                                        addSuggestion()
                                    }
                                }}
                            />
                            <Button type="button" onClick={addSuggestion} size="sm">
                                <Plus className="h-4 w-4" />
                            </Button>
                        </div>

                        {suggestions.length > 0 && (
                            <div className="space-y-2">
                                {suggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-2 border rounded"
                                    >
                                        <span className="text-sm">{suggestion}</span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSuggestion(index)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>API Key</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type={showApiKey ? "text" : "password"}
                                        placeholder="Enter your API key"
                                        {...field}
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                                        onClick={() => setShowApiKey(!showApiKey)}
                                    >
                                        {showApiKey ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </FormControl>
                            <FormDescription>
                                Your API key for the selected provider.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex gap-4">
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Updating..." : "Update Assistant"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.push("/dashboard/assistants")}
                    >
                        Cancel
                    </Button>
                </div>
            </form>
        </Form>
    )
}

