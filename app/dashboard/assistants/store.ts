import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { Assistant } from "@/lib/db/schema"
import {saveSelectedAssistantId} from "@/app/dashboard/assistants/lib/actions2";


interface AssistantStore {
    assistant: Assistant | null
    setAssistant: (assistant: Assistant) => void
}

export const useAssistantStore = create<AssistantStore>()(
    persist(
        (set) => ({
            assistant: null,
            setAssistant: (assistant) => {
                // Update the local store
                set({ assistant })

                // Sync with the server via the server action
                if (assistant?.id) {
                    saveSelectedAssistantId(assistant.id)
                }
            },
        }),
        {
            name: "assistant-storage", // unique name for localStorage key
            storage: createJSONStorage(() => localStorage),
        },
    ),

)

