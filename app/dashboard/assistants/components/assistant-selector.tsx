"use client"

import { startTransition, useEffect, useOptimistic, useState } from "react"
import { useAssistantStore } from "@/app/dashboard/assistants/store"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

import type { Assistant } from "@/lib/db/schema"
import {CheckCircleFillIcon, ChevronDownIcon} from "@/components/icons";
import {fetchFilteredAssistants} from "@/app/dashboard/assistants/lib/actions";
import {useRouter} from "next/navigation";

interface AssistantSelectorProps {

    className?: string
}

export function AssistantSelector({  className }: AssistantSelectorProps) {
    const [open, setOpen] = useState(false)
    const { assistant, setAssistant } = useAssistantStore()

    // Use the first assistant as default if none is selected
    //const selectedAssistant = assistant || assistants[0] || null
    const [optimisticAssistant, setOptimisticAssistant] = useOptimistic(assistant)
    const [assistants, setAssistants] = useState<Assistant[]>([])
    const router = useRouter();


    useEffect(() => {
        const loadAssistants = async () => {

            try {
                const data = await fetchFilteredAssistants('', 1)
                setAssistants(data)
            } catch (error) {
                console.error("Error loading assistants:", error)
            } finally {

            }
        }

        loadAssistants()
    }, [])

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger
                asChild
                className={cn("w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground", className)}
            >
                <Button variant="outline" className="md:px-2 md:h-[34px]">
                    {optimisticAssistant?.name || "Select Assistant"}
                    <ChevronDownIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[300px]">
                {assistants.map((assistantItem) => {
                    const { id, name } = assistantItem

                    return (
                        <DropdownMenuItem
                            key={id}
                            onSelect={() => {
                                setOpen(false)

                                startTransition(() => {
                                    setOptimisticAssistant(assistantItem)
                                    setAssistant(assistantItem)
                                    // Store in localStorage is handled by zustand persist middleware
                                })
                                router.push('/');
                                router.refresh();
                            }}
                            className="gap-4 group/item flex flex-row justify-between items-center"
                            data-active={id === optimisticAssistant?.id}
                        >
                            <div className="flex flex-col gap-1 items-start">
                                <div>{name}</div>
                            </div>

                            <div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
                                <CheckCircleFillIcon />
                            </div>
                        </DropdownMenuItem>
                    )
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

