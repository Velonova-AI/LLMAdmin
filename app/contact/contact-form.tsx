"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Send , CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {submitContactForm} from "@/app/contact/actions";

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address" }),
    department: z.string({
        required_error: "Please select a department",
    }),
    message: z.string().min(10, {
        message: "Message must be at least 10 characters",
    }),
})

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formStatus, setFormStatus] = useState<{
        type: "success" | "error" | null
        message: string | null
    }>({ type: null, message: null })
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            message: "",
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true)
        setFormStatus({ type: null, message: null })

        try {
            const result = await submitContactForm(values)

            if (result.success) {
                form.reset()
                setFormStatus({
                    type: "success",
                    message: "Your message has been sent successfully. We'll get back to you soon.",
                })
                // Refresh the page to ensure server components re-render
                router.refresh()
            } else {
                setFormStatus({
                    type: "error",
                    message: result.error || "Something went wrong. Please try again.",
                })
            }
        } catch (error) {
            setFormStatus({
                type: "error",
                message: "An unexpected error occurred. Please try again later.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            {formStatus.type && (
                <Alert
                    variant={formStatus.type === "success" ? "default" : "destructive"}
                    className="mb-6 animate-in fade-in-50 duration-300"
                >
                    {formStatus.type === "success" ? <CheckCircle className="size-4" /> : <AlertCircle className="size-4" />}
                    <AlertTitle className={formStatus.type === "success" ? "text-emerald-800 dark:text-emerald-200" : ""}>
                        {formStatus.type === "success" ? "Success" : "Error"}
                    </AlertTitle>
                    <AlertDescription className={formStatus.type === "success" ? "text-emerald-700 dark:text-emerald-300" : ""}>
                        {formStatus.message}
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Contact Form</CardTitle>
                    <CardDescription>Send us a message and we'll respond as soon as possible.</CardDescription>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Email <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder="your@email.com" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="department"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Department <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a department" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="sales">Sales</SelectItem>
                                                <SelectItem value="support">Support</SelectItem>
                                                <SelectItem value="feedback">Feedback</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="message"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Message <span className="text-destructive">*</span>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="How can we help you?" className="min-h-[120px]" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" disabled={isSubmitting} className="w-full">
                                {isSubmitting ? (
                                    "Sending..."
                                ) : (
                                    <>
                                        <Send className="mr-2 size-4" /> Submit
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </>
    )
}

