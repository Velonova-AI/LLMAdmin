import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
    title: "Getting Started | AI Assistant Documentation",
    description: "Learn how to create your AI assistant in minutes",
}

export default function GettingStarted() {
    return (
        <main className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">Getting Started</h1>
            <p className="text-xl mb-8 text-muted-foreground">
                Follow these simple steps to create your own AI assistant. The process is straightforward and takes just a few
                minutes to complete.
            </p>

            <div className="space-y-12">
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Step 1: Navigate to Create</h2>
                    <p className="mb-4">
                        Click on the &quot;Create&quot; button in the navigation bar on your left to start creating your AI
                        assistant.
                    </p>
                    <div className="border rounded-lg overflow-hidden mb-4">
                        <Image
                            src="/placeholder.svg?height=200&width=600"
                            alt="Screenshot showing the Create button in the navigation"
                            width={600}
                            height={200}
                            className="w-full"
                        />
                    </div>
                    <div className="bg-muted rounded-lg p-4">
                        <p className="text-sm text-muted-foreground">
                            💡 Tip: The Create button is always visible in the left sidebar for quick access.
                        </p>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Step 2: Configure Your Assistant</h2>
                    <p className="mb-4">Fill in the required settings for your AI assistant. You will need to provide:</p>
                    <ul className="list-disc list-inside mb-4 space-y-2">
                        <li>Your API key from your chosen provider (OpenAI, Anthropic, or Mistral)</li>
                        <li>A name for your assistant</li>
                        <li>A description of what your assistant does</li>
                        <li>Select your preferred model</li>
                    </ul>
                    <div className="border rounded-lg overflow-hidden mb-4">
                        <Image
                            src="/placeholder.svg?height=400&width=600"
                            alt="Screenshot of the assistant configuration form"
                            width={600}
                            height={400}
                            className="w-full"
                        />
                    </div>
                    <div className="bg-muted rounded-lg p-4 space-y-2">
                        <p className="font-medium">Example Configuration:</p>
                        <pre className="text-sm bg-background p-2 rounded">
              {`{
  "name": "Grant Proposal Assistant",
  "description": "Helps create and review grant proposals",
  "model": "gpt-4",
  "provider": "openai",
  "temperature": 0.7
}`}
            </pre>
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Step 3: Access Your Assistant</h2>
                    <p className="mb-4">
                        Once your assistant is created successfully, you will see a confirmation message with a link to access it.
                        Click on the link to start using your AI assistant.
                    </p>
                    <div className="border rounded-lg overflow-hidden mb-4">
                        <Image
                            src="/placeholder.svg?height=300&width=600"
                            alt="Screenshot showing the success message and access link"
                            width={600}
                            height={300}
                            className="w-full"
                        />
                    </div>
                    <div className="bg-muted rounded-lg p-4 space-y-2">
                        <p className="font-medium">Success Response Example:</p>
                        <pre className="text-sm bg-background p-2 rounded">
              {`{
  "status": "success",
  "message": "AI Assistant created successfully",
  "assistantId": "asst_abc123",
  "accessUrl": "/assistants/asst_abc123"
}`}
            </pre>
                    </div>
                </section>

                <div className="bg-muted p-6 rounded-lg border space-y-4">
                    <h2 className="text-xl font-semibold">⚠️ Security Note</h2>
                    <p>
                        Your API keys are encrypted before storage and are never exposed in client-side code. We follow industry
                        best practices for securing your credentials.
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        <li>API keys are encrypted at rest</li>
                        <li>Communications are secured with TLS</li>
                        <li>Keys are never exposed in client-side code</li>
                        <li>Regular security audits are performed</li>
                    </ul>
                </div>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
                    <p className="mb-4">
                        If you have any questions or need assistance, our support team is here to help. Click the &quot;Contact
                        Us&quot; link in the navigation bar, and we&apos;ll get back to you promptly.
                    </p>
                </section>
            </div>
        </main>
    )
}

