"use client"

import type React from "react"
import { useState } from "react"
import {
  UserCircleIcon,
  KeyIcon,
  DocumentTextIcon,
  ChatBubbleBottomCenterTextIcon,
  AdjustmentsHorizontalIcon,
  PlusIcon,
} from "@heroicons/react/24/outline"
import { XMarkIcon } from "@heroicons/react/16/solid"
import { createAssistant } from "./actions"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ModelName, ModelProvider, ModelType } from "@/lib/db/schema"

export default function CreateAssistantForm() {
  const [userPrompts, setUserPrompts] = useState<string[]>([])
  const [currentPrompt, setCurrentPrompt] = useState("")

  const addPrompt = () => {
    if (currentPrompt.trim()) {
      setUserPrompts([...userPrompts, currentPrompt.trim()])
      setCurrentPrompt("")
    }
  }

  const removePrompt = (index: number) => {
    setUserPrompts(userPrompts.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      addPrompt()
    }
  }

  const handleSubmit = async (formData: FormData) => {
    // Convert temperature and maxTokens to numbers
    const temperature = Number.parseFloat(formData.get("temperature") as string)
    const maxTokens = Number.parseInt(formData.get("maxTokens") as string, 10)

    // Create a new FormData object with the correct types
    const newFormData = new FormData()
    newFormData.append("name", formData.get("name") as string)
    newFormData.append("description", (formData.get("description") as string) || "") // Provide a default empty string
    newFormData.append("provider", formData.get("provider") as string)
    newFormData.append("modelName", formData.get("modelName") as string)
    newFormData.append("type", formData.get("type") as string)
    newFormData.append("systemPrompt", formData.get("systemPrompt") as string)
    newFormData.append("temperature", temperature.toString())
    newFormData.append("maxTokens", maxTokens.toString())
    newFormData.append("suggestions", JSON.stringify(userPrompts))
    newFormData.append("apiKey", formData.get("apiKey") as string)

    await createAssistant(newFormData)
  }

  return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center text-lg text-muted-foreground mb-6">
          <span className="text-foreground">Create a Personal Assistant</span>
        </div>

        <form action={handleSubmit}>
          <div className="rounded-md bg-gray-50 p-4 md:p-6 space-y-6">
            {/* Assistant Name */}
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Assistant Name
              </label>
              <div className="relative">
                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    placeholder="My Personal Assistant"
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
                <input
                    id="description"
                    name="description"
                    type="text"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    placeholder="Assistant description (optional)"
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
                <input
                    id="apiKey"
                    name="apiKey"
                    type="password"
                    required
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    placeholder="Enter your API key"
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
                <select
                    id="provider"
                    name="provider"
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    defaultValue=""
                    required
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
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Model Name */}
            <div>
              <label htmlFor="modelName" className="mb-2 block text-sm font-medium">
                Model Name
              </label>
              <div className="relative">
                <select
                    id="modelName"
                    name="modelName"
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    defaultValue=""
                    required
                >
                  <option value="" disabled>
                    Select a model
                  </option>
                  {Object.entries(ModelName).map(([key, value]) => (
                      <option key={key} value={value}>
                        {key}
                      </option>
                  ))}
                </select>
                <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Model Type */}
            <div>
              <label htmlFor="type" className="mb-2 block text-sm font-medium">
                Model Type
              </label>
              <div className="relative">
                <select
                    id="type"
                    name="type"
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    defaultValue=""
                    required
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
                <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* System Prompt */}
            <div>
              <label htmlFor="systemPrompt" className="mb-2 block text-sm font-medium">
                System Prompt
              </label>
              <div className="relative">
              <textarea
                  id="systemPrompt"
                  name="systemPrompt"
                  rows={4}
                  className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                  placeholder="Enter the system prompt for your assistant"
              />
                <ChatBubbleBottomCenterTextIcon className="pointer-events-none absolute left-3 top-4 size-[18px] text-gray-500" />
              </div>
            </div>

            {/* User Prompt */}
            <div>
              <label htmlFor="userPrompts" className="block text-sm font-medium mb-2">
                User Prompts
              </label>
              <div className="relative">
                <Textarea
                    id="userPrompts"
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
                {userPrompts.map((prompt, index) => (
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
                <input
                    id="temperature"
                    name="temperature"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    defaultValue="0.7"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
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
                <input
                    id="maxTokens"
                    name="maxTokens"
                    type="number"
                    min="1"
                    defaultValue="2048"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
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
              Create Assistant
            </button>
          </div>
        </form>
      </div>
  )
}

