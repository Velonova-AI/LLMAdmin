import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

interface AssistantQuantityStore {
    totalAllowed: number
    currentCount: number
    setTotalAllowed: (quantity: number) => void
    setCurrentCount: (count: number) => void
    initializeStore: (total: number, current: number) => void
}

export const useAssistantQuantityStore = create<AssistantQuantityStore>()(
    persist(
        (set) => ({
            totalAllowed: 0,
            currentCount: 0,
            setTotalAllowed: (quantity) => set({ totalAllowed: quantity }),
            setCurrentCount: (count) => set({ currentCount: count }),
            initializeStore: (total, current) => set({ totalAllowed: total, currentCount: current }),
        }),
        {
            name: "assistant-quantity-storage",
            storage: createJSONStorage(() => localStorage),
        },
    ),
)

