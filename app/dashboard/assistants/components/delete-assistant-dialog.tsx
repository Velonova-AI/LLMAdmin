"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Trash2 } from "lucide-react"

import { useRouter } from "next/navigation"
import {deleteAssistant} from "@/app/dashboard/assistants/lib/actions";

interface DeleteAssistantDialogProps {
    assistantId: string
    assistantName: string
}

export function DeleteAssistantDialog({ assistantId, assistantName }: DeleteAssistantDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()


    const handleDelete = async () => {
        try {
            setIsDeleting(true)
            setError(null)

            // The server action will handle the redirect
            await deleteAssistant(assistantId)

            // This code will only run if the redirect fails
            setIsOpen(false)
        } catch (err) {
            setError("An unexpected error occurred")
            console.error(err)
            setIsDeleting(false)
        }
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                    <Trash2 className="size-4" />
                    <span className="sr-only">Delete assistant</span>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Assistant</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete <span className="font-medium">{assistantName}</span>? This action cannot be
                        undone.
                    </DialogDescription>
                </DialogHeader>

                {error && <div className="p-3 rounded-md bg-destructive/15 text-destructive">{error}</div>}

                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

