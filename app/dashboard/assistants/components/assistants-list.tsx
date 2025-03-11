"use client"

import type { Assistant } from "@/lib/db/schema"
import DeleteButton from "./delete-button"

import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import {useAssistantStore} from "@/app/dashboard/assistants/store";
import {formatDate} from "@/app/dashboard/utils";


export default function AssistantsTable({ assistants }: { assistants: Assistant[] }) {
    const router = useRouter()
    const setAssistant = useAssistantStore((state) => state.setAssistant)

    const handleViewAssistant = (assistant: Assistant) => {
        setAssistant(assistant)
        router.push("/")
    }

    return (
        <div className="mt-6 flow-root">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Provider</TableHead>
                            <TableHead>Model</TableHead>
                            <TableHead>RAG</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {assistants.map((assistant) => (
                            <TableRow key={assistant.id}>
                                <TableCell className="font-medium">{assistant.name}</TableCell>
                                <TableCell>{assistant.provider}</TableCell>
                                <TableCell>{assistant.modelName}</TableCell>
                                <TableCell>
                                    {assistant.ragEnabled ? (
                                        <Badge variant="default">Enabled</Badge>
                                    ) : (
                                        <Badge variant="outline">Disabled</Badge>
                                    )}
                                </TableCell>
                                <TableCell>{formatDate(assistant.createdAt)}</TableCell>
                                <TableCell>
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-primary hover:text-primary/90"
                                            onClick={() => handleViewAssistant(assistant)}
                                        >
                                            <Eye className="size-5" />
                                            <span className="sr-only">View</span>
                                        </Button>
                                        <DeleteButton id={assistant.id} name={assistant.name} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

