import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

export default function PromptEngineeringPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/learn">Learn</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Prompt Engineering</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-4xl font-bold tracking-tight mb-6">Prompt Engineering</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground mb-8">
          Master the art of crafting effective prompts for AI interactions. Good prompt engineering
          is the difference between getting useful, accurate responses and generic, unhelpful
          outputs. Learn the principles and techniques that will make your AI interactions more
          productive.
        </p>

        <Separator className="my-8" />

        <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-4">What is Prompt Engineering?</h2>
        <p className="mb-4">
          Prompt engineering is the practice of designing and refining inputs (prompts) to AI
          systems to achieve desired outputs. It involves understanding how AI models interpret
          instructions and structuring your requests to maximize accuracy and relevance.
        </p>

        <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-4">Core Principles</h2>

        <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">1. Be Specific and Clear</h3>
        <p className="mb-4">
          Vague prompts lead to vague results. Clearly define what you want:
        </p>
        <div className="space-y-4 mb-4">
          <div>
            <p className="text-sm font-medium mb-2 text-muted-foreground">❌ Vague:</p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{"Write code for a button"}</code>
            </pre>
          </div>
          <div>
            <p className="text-sm font-medium mb-2 text-muted-foreground">✅ Specific:</p>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>{`Create a React button component using TypeScript that:
- Accepts onClick, children, and variant props
- Has three variants: primary, secondary, and outline
- Uses Tailwind CSS for styling
- Is accessible with proper ARIA attributes`}</code>
            </pre>
          </div>
        </div>

        <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">2. Provide Context</h3>
        <p className="mb-4">
          Give the AI enough context to understand your requirements:
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
          <code>{`You are a senior React developer helping with a Next.js 14 project.
The project uses TypeScript, Tailwind CSS, and shadcn/ui components.
Create a user profile page component that displays:
- User avatar and name
- Bio section
- List of recent activities
- Edit button (only visible to the profile owner)`}</code>
        </pre>

        <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">3. Use Examples</h3>
        <p className="mb-4">
          Show, don't just tell. Provide examples of the desired output:
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
          <code>{`Generate a function that formats dates. Examples:
Input: "2024-01-15" → Output: "January 15, 2024"
Input: "2024-12-25" → Output: "December 25, 2024"
Input: "2024-03-07" → Output: "March 7, 2024"`}</code>
        </pre>

        <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">4. Break Down Complex Tasks</h3>
        <p className="mb-4">
          For complex requests, break them into smaller, manageable steps:
        </p>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>First, analyze the requirements</li>
          <li>Then, design the data structure</li>
          <li>Next, implement the core logic</li>
          <li>Finally, add error handling and edge cases</li>
        </ol>

        <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-4">Advanced Techniques</h2>

        <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">Chain of Thought</h3>
        <p className="mb-4">
          Encourage the AI to show its reasoning process:
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
          <code>{`Solve this step by step:
1. First, identify what the problem is asking
2. Then, outline your approach
3. Next, work through the solution
4. Finally, verify your answer`}</code>
        </pre>

        <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">Role Playing</h3>
        <p className="mb-4">
          Assign a role to the AI to get more targeted responses:
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
          <code>{`You are an expert code reviewer specializing in React and TypeScript.
Review this component and provide:
- Performance optimizations
- Type safety improvements
- Accessibility concerns
- Best practice recommendations`}</code>
        </pre>

        <Alert className="my-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Pro Tip</AlertTitle>
          <AlertDescription>
            Iterate on your prompts. If the first response isn't what you need, refine your prompt
            based on what worked and what didn't. Prompt engineering is an iterative process.
          </AlertDescription>
        </Alert>

        <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-4">Common Patterns</h2>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            <strong>Template-based:</strong> Use structured templates for consistent outputs
          </li>
          <li>
            <strong>Conditional logic:</strong> Include if/then scenarios for different cases
          </li>
          <li>
            <strong>Output formatting:</strong> Specify the desired format (JSON, markdown, code,
            etc.)
          </li>
          <li>
            <strong>Constraints:</strong> Set boundaries and limitations explicitly
          </li>
        </ul>

        <Separator className="my-8" />

        <div className="mt-12 flex justify-start">
          <Button asChild variant="outline">
            <Link href="/learn">← Back to Getting Started</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

