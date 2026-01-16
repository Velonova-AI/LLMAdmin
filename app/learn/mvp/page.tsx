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

export default function MVPPage() {
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
            <BreadcrumbPage>MVP</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-4xl font-bold tracking-tight mb-6">MVP</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground mb-8">
          Learn how to build a Minimum Viable Product (MVP) quickly and effectively. An MVP helps
          you validate your ideas, gather user feedback, and iterate rapidly without over-engineering
          your solution.
        </p>

        <Separator className="my-8" />

        <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-4">What is an MVP?</h2>
        <p className="mb-4">
          A Minimum Viable Product is the simplest version of your product that delivers core value
          to users. It includes only the essential features needed to solve a specific problem and
          validate your hypothesis.
        </p>

        <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-4">Why Build an MVP?</h2>
        <p className="mb-4">Building an MVP offers several key benefits:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            <strong>Faster Time to Market:</strong> Get your product in users' hands quickly to
            start gathering feedback.
          </li>
          <li>
            <strong>Reduced Risk:</strong> Validate your idea before investing significant time and
            resources.
          </li>
          <li>
            <strong>Focus on Core Value:</strong> Concentrate on solving the primary problem without
            feature bloat.
          </li>
          <li>
            <strong>Iterative Improvement:</strong> Use real user feedback to guide your development
            priorities.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-4">Building Your MVP</h2>

        <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">Step 1: Define Your Core Value</h3>
        <p className="mb-4">
          Start by identifying the single most important problem your product solves. Ask yourself:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>What problem am I solving?</li>
          <li>Who is my target user?</li>
          <li>What is the minimum feature set needed to solve this problem?</li>
        </ul>

        <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">Step 2: Choose Your Stack</h3>
        <p className="mb-4">
          Select technologies that allow for rapid development and iteration:
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
          <code>{`// Example: Modern web stack
- Framework: Next.js (React)
- Styling: Tailwind CSS
- Database: PostgreSQL or SQLite
- Authentication: NextAuth.js
- Deployment: Vercel`}</code>
        </pre>

        <Alert className="my-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Tip</AlertTitle>
          <AlertDescription>
            Don't overthink your initial stack. Choose tools you're familiar with or that have
            excellent documentation. You can always refactor later.
          </AlertDescription>
        </Alert>

        <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">Step 3: Build the Core Features</h3>
        <p className="mb-4">Focus on implementing only the essential features:</p>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>User authentication (if needed)</li>
          <li>The primary feature that solves your core problem</li>
          <li>Basic data persistence</li>
          <li>Simple, clean UI</li>
        </ol>

        <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">Step 4: Launch and Gather Feedback</h3>
        <p className="mb-4">
          Once your MVP is functional, launch it to a small group of users and actively seek
          feedback. Use this feedback to prioritize your next features.
        </p>

        <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-4">Common MVP Mistakes</h2>
        <p className="mb-4">Avoid these common pitfalls:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            <strong>Feature Creep:</strong> Adding too many features before validating the core
            concept.
          </li>
          <li>
            <strong>Perfectionism:</strong> Waiting for everything to be perfect before launching.
          </li>
          <li>
            <strong>Ignoring Users:</strong> Building in isolation without user input.
          </li>
          <li>
            <strong>Over-engineering:</strong> Using complex solutions when simple ones would work.
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

