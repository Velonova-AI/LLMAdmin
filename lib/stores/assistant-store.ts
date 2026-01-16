"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AssistantStore {
  selectedAssistantId: string | null;
  selectedModelName: string | null;
  setSelectedAssistant: (assistantId: string | null, modelName?: string | null) => void;
  clearSelectedAssistant: () => void;
}

export const useAssistantStore = create<AssistantStore>()(
  persist(
    (set) => ({
      selectedAssistantId: null,
      selectedModelName: null,
      setSelectedAssistant: (assistantId: string | null, modelName?: string | null) =>
        set({ 
          selectedAssistantId: assistantId,
          selectedModelName: modelName ?? null,
        }),
      clearSelectedAssistant: () => set({ 
        selectedAssistantId: null,
        selectedModelName: null,
      }),
    }),
    {
      name: "assistant-storage",
    }
  )
);

