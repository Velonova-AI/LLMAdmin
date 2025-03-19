"use client"

import { useEffect } from "react"

import type { Assistant } from "@/lib/db/schema"
import {useAssistantStore} from "@/app/dashboard/assistants/store";

export function AssistantStoreInitializer({ assistant }: { assistant: Assistant | null }) {
    const setAssistant = useAssistantStore((state) => state.setAssistant)
    const currentAssistant = useAssistantStore((state) => state.assistant)

    useEffect(() => {
        // Only initialize if we have an assistant from the server and no assistant in the store
        if (assistant && !currentAssistant) {
            setAssistant(assistant)
        }
    }, [assistant, currentAssistant, setAssistant])

    return null
}

