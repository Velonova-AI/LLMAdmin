"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

import { Label } from "@/components/ui/label"
import {submitFeedback} from "@/app/ui/assistants/actions";
import {Button} from "@/app/ui/assistants/button";


export function FeedbackForm() {
    const [willBuy, setWillBuy] = useState(false)
    const router = useRouter()

    const handleSubmit = async (formData: FormData) => {
        const result = await submitFeedback(formData)
        if (result.success) {
            router.push("/dashboard/feedback?success=true")
        } else {
            // Handle error
            console.error(result.error)
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4 max-w-md mx-auto">
            <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" required />
            </div>
            <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" name="message" required />
            </div>


            <Button type="submit">Submit Feedback</Button>
        </form>
    )
}

