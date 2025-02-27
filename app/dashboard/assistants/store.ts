import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { Assistant } from "@/lib/db/schema"


interface AssistantStore {
    assistant: Assistant | null
    setAssistant: (assistant: Assistant) => void
}

export const useAssistantStore = create<AssistantStore>()(
    persist(
        (set) => ({
            assistant: null,
            setAssistant: (assistant) => set({ assistant }),
        }),
        {
            name: "assistant-storage", // unique name for localStorage key
            storage: createJSONStorage(() => localStorage),
        },
    ),

)

