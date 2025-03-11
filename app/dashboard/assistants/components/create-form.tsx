"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Trash2, Plus } from "lucide-react"


import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import {createAssistant} from "@/app/dashboard/assistants/lib/actions";

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
})

type FormValues = z.infer<typeof formSchema>

export function CreateForm() {
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [newSuggestion, setNewSuggestion] = useState("")
    const [files, setFiles] = useState<File[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
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
        },
    })

    const ragEnabled = form.watch("ragEnabled") === "yes"

    async function onSubmit(values: FormValues) {
        if (!formRef.current) return

        setIsSubmitting(true)

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

            // Add the suggestions as JSON
            formData.append("suggestions", JSON.stringify(suggestions))

            // Add files if RAG is enabled
            if (ragEnabled && files.length > 0) {
                files.forEach((file) => {
                    formData.append("files", file)
                })
            }

            console.log("Submitting form with values:", values)
            console.log("Suggestions:", suggestions)
            console.log(
                "Files:",
                files.map((f) => f.name),
            )

            // Submit the form using the server action
            const result = await createAssistant(formData)

            // Handle the result
            if (result.success) {
                alert("Assistant created successfully!")
                // Reset the form
                form.reset()
                setSuggestions([])
                setFiles([])
            } else {
                console.error("Server validation error:", result.errors || result.message)
                alert(`Error: ${result.message}`)
            }
        } catch (error) {
            console.error("Error submitting form:", error)

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
        if (e.target.files) {
            // Add new files to existing files
            setFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files || [])])
        }
        // Reset the input value so the same file can be selected again if needed
        e.target.value = ""
    }

    function removeFile(indexToRemove: number) {
        setFiles(files.filter((_, index) => index !== indexToRemove))
    }

    return (
        <Form {...form}>
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
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select model" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                                        <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                                        <SelectItem value="mistral-large">Mistral Large</SelectItem>
                                        <SelectItem value="command-r">Command R</SelectItem>
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
                                    onValueChange={field.onChange}
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
                            <FormDescription>Allow the assistant to retrieve information from uploaded files.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {ragEnabled && (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Upload Files
                                </div>
                                <p className="text-sm text-muted-foreground">Upload documents for your assistant to reference.</p>
                                <Input id="file-upload" type="file" multiple onChange={handleFileChange} />
                                {files.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium mb-2">Selected files:</p>
                                        <ul className="space-y-2">
                                            {files.map((file, index) => (
                                                <li key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                          <span className="text-sm text-muted-foreground truncate max-w-[250px]">
                            {file.name} ({(file.size / 1024).toFixed(1)} KB)
                          </span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeFile(index)}
                                                        className="size-8 p-0"
                                                    >
                                                        <Trash2 className="size-4 text-destructive" />
                                                        <span className="sr-only">Remove file</span>
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Assistant"}
                </Button>
            </form>
        </Form>
    )
}

