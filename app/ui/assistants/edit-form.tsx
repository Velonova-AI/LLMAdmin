"use client"

import { useState } from "react"
import {
  UserCircleIcon,
  KeyIcon,
  DocumentTextIcon,
  ChatBubbleBottomCenterTextIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
} from "@heroicons/react/24/outline"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateAssistant } from "./actions"
import { Button } from "@/components/ui/button"
import { XMarkIcon } from "@heroicons/react/16/solid"
import { ModelName, ModelProvider, ModelType } from "@/lib/db/schema"

interface AssistantForm {
  id: string
  name: string
  description?: string
  apiKey?: string
  provider: ModelProvider
  modelName: ModelName
  type: ModelType
  systemPrompt?: string
  suggestions: string[]
  temperature: number | undefined
  maxTokens: number | undefined
}

export default function EditAssistantForm({
                                            assistant,
                                          }: {
  assistant: AssistantForm
}) {
  const [formData, setFormData] = useState<AssistantForm>(assistant)
  const [currentPrompt, setCurrentPrompt] = useState("")

  const addPrompt = () => {
    if (currentPrompt.trim() !== "") {
      setFormData((prev) => ({
        ...prev,
        suggestions: [...prev.suggestions, currentPrompt.trim()],
      }))
      setCurrentPrompt("")
    }
  }

  const removePrompt = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      suggestions: prev.suggestions.filter((_, i) => i !== index),
    }))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      addPrompt()
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    data.append("suggestions", JSON.stringify(formData.suggestions))
    await updateAssistant(data)
  }

  return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center text-lg text-muted-foreground mb-6">
          <span className="text-foreground">Edit Personal Assistant</span>
        </div>

        <form onSubmit={handleSubmit}>
          <input type="hidden" name="id" value={formData.id} />
          <div className="rounded-md bg-gray-50 p-4 md:p-6 space-y-6">
            {/* Assistant Name */}
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Assistant Name
              </label>
              <div className="relative">
                <Input
                    id="name"
                    name="name"
                    defaultValue={formData.name}
                    placeholder="My AI Assistant"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    required
                />
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="mb-2 block text-sm font-medium">
                Description
              </label>
              <div className="relative">
                <Input
                    id="description"
                    name="description"
                    defaultValue={formData.description}
                    placeholder="Assistant description (optional)"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                />
                <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* API Key */}
            <div>
              <label htmlFor="apiKey" className="mb-2 block text-sm font-medium">
                API Key
              </label>
              <div className="relative">
                <Input
                    id="apiKey"
                    name="apiKey"
                    type="password"
                    defaultValue={formData.apiKey}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    placeholder="Enter your API key"
                    required
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Model Provider */}
            <div>
              <label htmlFor="provider" className="mb-2 block text-sm font-medium">
                Model Provider
              </label>
              <div className="relative">
                <Select name="provider" defaultValue={formData.provider}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ModelProvider).map((provider) => (
                        <SelectItem key={provider} value={provider}>
                          {provider}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Model Name */}
            <div>
              <label htmlFor="modelName" className="mb-2 block text-sm font-medium">
                Model Name
              </label>
              <div className="relative">
                <Select name="modelName" defaultValue={formData.modelName}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a model" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ModelName).map(([key, value]) => (
                        <SelectItem key={key} value={value}>
                          {key}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Model Type */}
            <div>
              <label htmlFor="type" className="mb-2 block text-sm font-medium">
                Model Type
              </label>
              <div className="relative">
                <Select name="type" defaultValue={formData.type}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ModelType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* System Prompt */}
            <div>
              <label htmlFor="systemPrompt" className="mb-2 block text-sm font-medium">
                System Prompt
              </label>
              <div className="relative">
                <Textarea
                    id="systemPrompt"
                    name="systemPrompt"
                    defaultValue={formData.systemPrompt}
                    rows={4}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    placeholder="Enter the system prompt for your assistant"
                />
                <ChatBubbleBottomCenterTextIcon className="pointer-events-none absolute left-3 top-4 size-[18px] text-gray-500" />
              </div>
            </div>

            {/* User Prompts */}
            <div>
              <label htmlFor="suggestions" className="block text-sm font-medium mb-2">
                User Prompts
              </label>
              <div className="relative">
                <Textarea
                    id="suggestions"
                    value={currentPrompt}
                    onChange={(e) => setCurrentPrompt(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="pl-10 min-h-[80px]"
                    placeholder="Enter suggestions for the users (press Enter to add)"
                />
                <ChatBubbleBottomCenterTextIcon className="pointer-events-none absolute left-3 top-3 size-[18px] text-gray-500" />
              </div>
              <Button type="button" onClick={addPrompt} className="mt-2 w-full" variant="outline">
                <PlusIcon className="size-4 mr-2" />
                Add Prompt
              </Button>
              <ul className="mt-2 space-y-2">
                {formData.suggestions.map((prompt, index) => (
                    <li
                        key={index}
                        className="flex items-center justify-between bg-white rounded-md p-2 border border-gray-200"
                    >
                      <span className="text-sm">{prompt}</span>
                      <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePrompt(index)}
                          aria-label={`Remove prompt: ${prompt}`}
                      >
                        <XMarkIcon className="size-4" />
                      </Button>
                    </li>
                ))}
              </ul>
            </div>

            {/* Temperature */}
            <div>
              <label htmlFor="temperature" className="mb-2 block text-sm font-medium">
                Temperature
              </label>
              <div className="relative">
                <Input
                    id="temperature"
                    name="temperature"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    defaultValue={formData.temperature}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    required
                />
                <AdjustmentsHorizontalIcon className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-500" />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Controls randomness in responses (0 = deterministic, 1 = creative)
              </p>
            </div>

            {/* Max Tokens */}
            <div>
              <label htmlFor="maxTokens" className="mb-2 block text-sm font-medium">
                Max Tokens
              </label>
              <div className="relative">
                <Input
                    id="maxTokens"
                    name="maxTokens"
                    type="number"
                    min="1"
                    defaultValue={formData.maxTokens}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    required
                />
                <AdjustmentsHorizontalIcon className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-4">
            <button
                type="submit"
                className="flex h-10 items-center rounded-lg bg-blue-500 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-600"
            >
              Update Assistant
            </button>
          </div>
        </form>
      </div>
  )
}

