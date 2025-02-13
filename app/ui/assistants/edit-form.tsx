"use client"

import { useState } from "react"
import {
  UserCircleIcon,
  KeyIcon,
  DocumentTextIcon,
  ChatBubbleBottomCenterTextIcon,
  AdjustmentsHorizontalIcon,
  CogIcon, PlusIcon,
} from "@heroicons/react/24/outline"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {createAssistant, updateAssistant} from "./actions"
import {Button} from "@/components/ui/button";
import {XMarkIcon} from "@heroicons/react/16/solid";

interface AssistantForm {
  id: string
  name: string
  apiKey: string
  modelProvider: string
  modelName: string
  systemPrompt: string
  userPrompts: string[]
  temperature: string
  maxTokens: number
}

export default function EditAssistantForm({
                                            assistant,
                                          }: {
  assistant: AssistantForm
}) {


  const [formData, setFormData] = useState<AssistantForm>(assistant)

  const [userPrompts, setUserPrompts] = useState<string[]>(() => {
    if (Array.isArray(assistant.userPrompts)) {
      return assistant.userPrompts
    } else if (typeof assistant.userPrompts === "string") {
      try {
        const parsed = JSON.parse(assistant.userPrompts)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return assistant.userPrompts ? [assistant.userPrompts] : []
      }
    }
    return []
  })
    const [currentPrompt, setCurrentPrompt] = useState("")

  console.log(userPrompts);

  const addPrompt = () => {
    if (currentPrompt.trim() !== "") {
      setUserPrompts([...userPrompts, currentPrompt.trim()])
      setCurrentPrompt("")
    }
  }

  const removePrompt = (index: number) => {
    setUserPrompts(userPrompts.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey === false) {
      e.preventDefault()
      addPrompt()
    }
  }

  const handleSubmit = async (formData: FormData) => {
    formData.append("userPrompts", JSON.stringify(Array.isArray(userPrompts) ? userPrompts : []))
    await updateAssistant(formData)
  }



  return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex items-center text-lg text-muted-foreground mb-6">
          <span className="text-foreground">Edit Personal Assistant</span>
        </div>

        <form action={ handleSubmit}>
          <input type="hidden" name="id" value={formData.id} />
          <div className="rounded-md bg-gray-50 p-4 md:p-6 space-y-6">
            {/* Assistant Name */}
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium">
                Assistant Name
              </label>
              <div className="relative">
                <Input
                    id="assistant-name"
                    name="assistant-name"
                    defaultValue={formData.name}

                    placeholder="My AI Assistant"
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    required
                />
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* API Key */}
            <div>
              <label htmlFor="apiKey" className="mb-2 block text-sm font-medium">
                API Key
              </label>
              <div className="relative">
                <Input
                    id="api-key"
                    name="api-key"
                    type="password"
                    defaultValue={formData.apiKey}

                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    placeholder="Enter your API key"
                    required
                />
                <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Model Provider */}
            {/* Model Provider */}
            <div>
              <label htmlFor="model-provider" className="mb-2 block text-sm font-medium">
                Model Provider
              </label>
              <div className="relative">
                <select
                    id="model-provider"
                    name="model-provider"
                    className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    defaultValue={formData.modelProvider}
                    required
                >

                  <option value="openai">OpenAI</option>
                  <option value="anthropic">Anthropic</option>
                  <option value="google">Google</option>
                </select>
                <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* Model Name */}
            <div>
              <label htmlFor="modelName" className="mb-2 block text-sm font-medium">
                Model Name
              </label>
              <div className="relative">
                <Input
                    id="model-name"
                    name="model-name"
                    defaultValue={formData.modelName}

                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    placeholder="gpt-4"
                    required
                />
                <DocumentTextIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
              </div>
            </div>

            {/* System Prompt */}
            <div>
              <label htmlFor="systemPrompt" className="mb-2 block text-sm font-medium">
                System Prompt
              </label>
              <div className="relative">
                <Textarea
                    id="system-prompt"
                    name="system-prompt"
                    defaultValue={formData.systemPrompt}

                    rows={4}
                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    placeholder="Enter the system prompt for your assistant"
                    required
                />
                <ChatBubbleBottomCenterTextIcon className="pointer-events-none absolute left-3 top-4 h-[18px] w-[18px] text-gray-500" />
              </div>
            </div>

            {/* User Prompts */}
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
                <ChatBubbleBottomCenterTextIcon className="pointer-events-none absolute left-3 top-3 h-[18px] w-[18px] text-gray-500" />
              </div>
              <Button type="button" onClick={addPrompt} className="mt-2 w-full" variant="outline">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Prompt
              </Button>
              <ul className="mt-2 space-y-2">
                {Array.isArray(userPrompts) &&
                    userPrompts.map((prompt, index) => (
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
                            <XMarkIcon className="h-4 w-4" />
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
                <AdjustmentsHorizontalIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
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
                    id="max-tokens"
                    name="max-tokens"
                    type="number"
                    min="1"
                    defaultValue={formData.maxTokens}

                    className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                    required
                />
                <AdjustmentsHorizontalIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
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

