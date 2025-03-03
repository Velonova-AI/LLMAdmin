import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
    title: "Safe AI Assistants for Grant Applciations, Legal terms and Marketing",
    description: "Safe AI Assistants for Grant Applciations, Legal terms and Marketing",
}

export default function Home() {
    return (
        <main className="mx-auto max-w-3xl">
            <div className="mb-12">
                <h1 className="mb-4 text-4xl font-bold">Safe AI Assistants in Minutes</h1>
                <p className="text-xl text-muted-foreground space-y-4">
          <span className="block">
            Using this tool you can quickly build your own personalised AI assistant in minutes.
          </span>

                    <span className="block">
            Using our AI prompts crafted by experts you can generate a Grant Proposal, a Business plan, Legal Terms and
            conditions, SEO content for Shopify or LinkedIn, edit it to your needs and then download it ready to ship.
          </span>

                    <span className="block">
            No need to share your data with anyone, prompts can be edited and personalised as much as you want.
          </span>
                </p>
                <div className="mt-6">
                    <Button asChild>
                        <Link href="/dashboard/documentation/getting-started" className="inline-flex items-center">
                            Get Started <ArrowRight className="ml-2 size-4" />
                        </Link>
                    </Button>
                </div>
            </div>

            <h2 className="mb-4 mt-10 text-2xl font-semibold">Pre Requisites</h2>
            <ul className="mb-8 list-inside list-disc space-y-2">
                <li>
                    <strong>API keys (Required):</strong> This your Model provider such as OpenAI or Anthropic or Mistral will
                    provide you.
                </li>
                <li>
                    <strong>Model name (optional):</strong> This is also provider by your provider but will be selected by us
                    based on your template for best output eg: gpt-mini, claude-35, claude-haiku.
                </li>
                <li>
                    <strong>API settings (optional):</strong> eg: Temperature, Max tokens. These will be preselected for you.
                </li>
            </ul>

            <h2 className="mb-4 mt-10 text-2xl font-semibold">Supported Providers</h2>
            <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-lg border p-4">
                    <h3 className="font-medium">OpenAI</h3>
                    <p className="text-sm text-muted-foreground">GPT-3.5, GPT-4, GPT-4o</p>
                </div>
                <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Anthropic</h3>
                    <p className="text-sm text-muted-foreground">Claude 3 Opus, Sonnet, Haiku</p>
                </div>
                <div className="rounded-lg border p-4">
                    <h3 className="font-medium">Mistral</h3>
                    <p className="text-sm text-muted-foreground">Mistral Large, Medium, Small</p>
                </div>
                <div className="rounded-lg border p-4">
                    <h3 className="font-medium">More Coming Soon</h3>
                    <p className="text-sm text-muted-foreground">Additional providers in development</p>
                </div>
            </div>

            <div className="rounded-lg border bg-muted p-6">
                <h2 className="mb-2 text-xl font-semibold">Get Help</h2>
                <p className="mb-4">Need assistance? Click on Contact us on the right.</p>
            </div>
        </main>
    )
}

