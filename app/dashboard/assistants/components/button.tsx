"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusIcon, Trash2 } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {deleteAssistant} from "../lib/actions"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

export function CreateAssistant() {
    return (
        <Button asChild>
            <Link href="/dashboard/assistants/create">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Assistant
            </Link>
        </Button>
    )
}



export function DeleteUser({ id, name }: { id: string; name: string }) {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete {name}  and remove their data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            startTransition(async () => {
                                await deleteAssistant(id, name)
                                router.refresh()
                            })
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        {isPending ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}


