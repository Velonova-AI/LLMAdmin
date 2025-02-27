"use client"

import type React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useActionState } from "react"
import { ModelProvider, ModelType } from "@/lib/db/schema"
import { createAssistant, type State } from "../lib/actions"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    description: z.string().optional(),
    provider: z.enum([ModelProvider.OpenAI, ModelProvider.Anthropic]),
    modelName: z.enum(["gpt-4o-mini", "gpt-4o", "claude-3-5-sonnet-20241022", "gpt-4-turbo", "dall-e-2", "dall-e-3"]),
    type: z.enum([ModelType.Text, ModelType.Image]),
    systemPrompt: z.string().optional(),
    temperature: z.number().min(0).max(1).default(0.7),
    maxTokens: z.number().min(1).max(4096).default(2048),
    suggestions: z.array(z.string()).optional(),
    apiKey: z.string().min(1, "API Key is required"),
})

export function CreateForm() {
    const initialState: State = { message: null, errors: {} }
    const [state, formAction] = useActionState(createAssistant, initialState)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            provider: ModelProvider.OpenAI,
            modelName: "gpt-4o",
            type: ModelType.Text,
            systemPrompt: "",
            temperature: 0.7,
            maxTokens: 2048,
            suggestions: [],
            apiKey: "",
        },
    })

    const watchProvider = form.watch("provider")
    const watchType = form.watch("type")
    const suggestions = form.watch("suggestions") || []

    const getAvailableModels = () => {
        if (watchType === ModelType.Image) {
            return ["dall-e-2", "dall-e-3"]
        }

        if (watchProvider === ModelProvider.OpenAI) {
            return ["gpt-4o-mini", "gpt-4o", "gpt-4-turbo"]
        }

        return ["claude-3-5-sonnet-20241022"]
    }

    const handleAddSuggestion = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault()
            const input = event.currentTarget
            const value = input.value.trim()

            if (value) {
                const currentSuggestions = form.getValues("suggestions") || []
                form.setValue("suggestions", [...currentSuggestions, value])
                input.value = ""
            }
        }
    }

    const handleRemoveSuggestion = (indexToRemove: number) => {
        const currentSuggestions = form.getValues("suggestions") || []
        form.setValue(
            "suggestions",
            currentSuggestions.filter((_, index) => index !== indexToRemove),
        )
    }

    return (
        <Form {...form}>
            <form action={formAction} className="space-y-8">
                {/* Add hidden inputs for form values that aren't naturally serialized */}
                <input type="hidden" name="provider" value={form.getValues("provider")} />
                <input type="hidden" name="modelName" value={form.getValues("modelName")} />
                <input type="hidden" name="type" value={form.getValues("type")} />
                <input type="hidden" name="temperature" value={form.getValues("temperature").toString()} />
                <input type="hidden" name="suggestions" value={JSON.stringify(form.getValues("suggestions") || [])} />
                {/* Previous form fields remain unchanged */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Name <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="My Assistant" {...field} />
                            </FormControl>
                            <FormDescription>A name for your assistant</FormDescription>
                            <FormMessage />
                            <div id="name-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.name &&
                                    state.errors.name.map((error: string) => (
                                        <p className="mt-2 text-sm text-destructive" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="This assistant helps with..." {...field} />
                            </FormControl>
                            <FormDescription>A brief description of what this assistant does</FormDescription>
                            <FormMessage />
                            <div id="description-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.description &&
                                    state.errors.description.map((error: string) => (
                                        <p className="mt-2 text-sm text-destructive" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="provider"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Provider <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                                <select
                                    {...field}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="" disabled>
                                        Select a provider
                                    </option>
                                    {Object.values(ModelProvider).map((provider) => (
                                        <option key={provider} value={provider}>
                                            {provider}
                                        </option>
                                    ))}
                                </select>
                            </FormControl>
                            <FormDescription>The AI model provider</FormDescription>
                            <FormMessage />
                            <div id="provider-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.provider &&
                                    state.errors.provider.map((error: string) => (
                                        <p className="mt-2 text-sm text-destructive" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Type <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                                <select
                                    {...field}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="" disabled>
                                        Select a type
                                    </option>
                                    {Object.values(ModelType).map((type) => (
                                        <option key={type} value={type}>
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </FormControl>
                            <FormDescription>The type of assistant</FormDescription>
                            <FormMessage />
                            <div id="type-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.type &&
                                    state.errors.type.map((error: string) => (
                                        <p className="mt-2 text-sm text-destructive" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="modelName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Model <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                                <select
                                    {...field}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <option value="" disabled>
                                        Select a model
                                    </option>
                                    {getAvailableModels().map((model) => (
                                        <option key={model} value={model}>
                                            {model}
                                        </option>
                                    ))}
                                </select>
                            </FormControl>
                            <FormDescription>The specific model to use</FormDescription>
                            <FormMessage />
                            <div id="modelName-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.modelName &&
                                    state.errors.modelName.map((error: string) => (
                                        <p className="mt-2 text-sm text-destructive" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                        </FormItem>
                    )}
                />

                {watchType === ModelType.Text && (
                    <>
                        <FormField
                            control={form.control}
                            name="systemPrompt"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>System Prompt</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="You are a helpful assistant..." {...field} />
                                    </FormControl>
                                    <FormDescription>Instructions for how the assistant should behave</FormDescription>
                                    <FormMessage />
                                    <div id="systemPrompt-error" aria-live="polite" aria-atomic="true">
                                        {state.errors?.systemPrompt &&
                                            state.errors.systemPrompt.map((error: string) => (
                                                <p className="mt-2 text-sm text-destructive" key={error}>
                                                    {error}
                                                </p>
                                            ))}
                                    </div>
                                </FormItem>
                            )}
                        />

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
                                            onValueChange={([value]) => {
                                                field.onChange(value)
                                                form.setValue("temperature", value)
                                            }}
                                        />
                                    </FormControl>
                                    <FormDescription>Controls randomness in the output (0 = deterministic, 1 = creative)</FormDescription>
                                    <FormMessage />
                                    <div id="temperature-error" aria-live="polite" aria-atomic="true">
                                        {state.errors?.temperature &&
                                            state.errors.temperature.map((error: string) => (
                                                <p className="mt-2 text-sm text-destructive" key={error}>
                                                    {error}
                                                </p>
                                            ))}
                                    </div>
                                </FormItem>
                            )}
                        />

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
                                            max={4096}
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                        />
                                    </FormControl>
                                    <FormDescription>Maximum length of the response</FormDescription>
                                    <FormMessage />
                                    <div id="maxTokens-error" aria-live="polite" aria-atomic="true">
                                        {state.errors?.maxTokens &&
                                            state.errors.maxTokens.map((error: string) => (
                                                <p className="mt-2 text-sm text-destructive" key={error}>
                                                    {error}
                                                </p>
                                            ))}
                                    </div>
                                </FormItem>
                            )}
                        />
                    </>
                )}

                <FormField
                    control={form.control}
                    name="suggestions"
                    render={() => (
                        <FormItem>
                            <FormLabel>Suggestions</FormLabel>
                            <FormControl>
                                <div className="space-y-4">
                                    <Input type="text" placeholder="Type a suggestion and press Enter" onKeyDown={handleAddSuggestion} />
                                    <div className="flex flex-wrap gap-2">
                                        {suggestions.map((suggestion, index) => (
                                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                                                {suggestion}
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-4 w-4 p-0 hover:bg-transparent"
                                                    onClick={() => handleRemoveSuggestion(index)}
                                                >
                                                    <X className="h-3 w-3" />
                                                    <span className="sr-only">Remove suggestion</span>
                                                </Button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </FormControl>
                            <FormDescription>Add example queries or prompts for users (optional)</FormDescription>
                            <FormMessage />
                            <div id="suggestions-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.suggestions &&
                                    state.errors.suggestions.map((error: string) => (
                                        <p className="mt-2 text-sm text-destructive" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="apiKey"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                API Key <span className="text-destructive">*</span>
                            </FormLabel>
                            <FormControl>
                                <Input type="password" placeholder={`Enter your ${watchProvider} API key`} {...field} />
                            </FormControl>
                            <FormDescription>Your API key will be encrypted before storage</FormDescription>
                            <FormMessage />
                            <div id="apiKey-error" aria-live="polite" aria-atomic="true">
                                {state.errors?.apiKey &&
                                    state.errors.apiKey.map((error: string) => (
                                        <p className="mt-2 text-sm text-destructive" key={error}>
                                            {error}
                                        </p>
                                    ))}
                            </div>
                        </FormItem>
                    )}
                />

                {/* General form errors */}
                <div id="form-error" aria-live="polite" aria-atomic="true">
                    {state.errors?.message?.map((error: string) => (
                        <p className="mt-2 text-sm text-destructive" key={error}>
                            {error}
                        </p>
                    ))}
                </div>

                {/* Success message */}
                {state.message && !state.errors && (
                    <div aria-live="polite" aria-atomic="true">
                        <p className="mt-2 text-sm text-green-600">{state.message}</p>
                    </div>
                )}

                <Button type="submit">Create Assistant</Button>
            </form>
        </Form>
    )
}

