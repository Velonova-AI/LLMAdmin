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

export default function VibeCodingPage() {
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
            <BreadcrumbPage>Vibe Coding</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-4xl font-bold tracking-tight mb-6">Vibe Coding</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground mb-8">
          Discover the philosophy and approach behind vibe-driven development. Vibe coding is about
          creating a flow state where development feels natural, intuitive, and enjoyable. It's about
          trusting your instincts while maintaining code quality.
        </p>

        <Separator className="my-8" />

        <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-4">What is Vibe Coding?</h2>
        <p className="mb-4">
          Vibe coding is a development philosophy that emphasizes flow, intuition, and developer
          happiness. It's about finding the right balance between structure and flexibility, between
          planning and spontaneity. When you're in the "vibe," code flows naturally, solutions
          appear intuitively, and development becomes a creative, enjoyable process.
        </p>

        <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-4">Core Principles</h2>

        <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">1. Trust Your Instincts</h3>
        <p className="mb-4">
          After years of experience, you develop coding instincts. Vibe coding encourages you to
          trust these instincts while staying open to learning and improvement. If something "feels
          right" architecturally, there's often a good reason.
        </p>

        <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">2. Flow Over Perfection</h3>
        <p className="mb-4">
          Don't let perfect be the enemy of good. Sometimes, maintaining momentum and flow is more
          valuable than getting every detail perfect on the first try. You can always refactor
          later.
        </p>

        <Alert className="my-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Remember</AlertTitle>
          <AlertDescription>
            This doesn't mean writing bad code. It means not getting stuck on minor decisions that
            prevent you from making progress. Good enough code that ships is better than perfect
            code that doesn't.
          </AlertDescription>
        </Alert>

        <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">3. Embrace Iteration</h3>
        <p className="mb-4">
          Vibe coding is inherently iterative. Start with a working solution, then refine it. Each
          iteration brings you closer to the ideal, and you learn something new each time.
        </p>

        <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">4. Create Your Environment</h3>
        <p className="mb-4">
          Your development environment significantly impacts your vibe. Consider:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            <strong>Editor Setup:</strong> Customize your editor with themes, extensions, and
            shortcuts that feel natural to you.
          </li>
          <li>
            <strong>Music/Ambience:</strong> Some developers code better with music, others need
            silence. Find what works for you.
          </li>
          <li>
            <strong>Physical Space:</strong> A comfortable, inspiring workspace can enhance your
            coding vibe.
          </li>
          <li>
            <strong>Tools:</strong> Use tools that feel intuitive and don't fight against your
            workflow.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-4">The Vibe Coding Workflow</h2>

        <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">1. Start with Intention</h3>
        <p className="mb-4">
          Before coding, have a clear intention of what you want to achieve. This doesn't mean a
          detailed plan—just a sense of direction.
        </p>

        <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">2. Build in Small Steps</h3>
        <p className="mb-4">
          Break your work into small, achievable steps. Each small win maintains momentum and keeps
          the vibe positive.
        </p>

        <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">3. Follow the Energy</h3>
        <p className="mb-4">
          When you're in flow, follow it. If you're stuck on one problem, switch to something else
          that's moving. You can come back to the difficult problem with fresh eyes.
        </p>

        <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">4. Refactor When It Feels Right</h3>
        <p className="mb-4">
          Don't force refactoring. When you naturally see a better way to structure something,
          that's the time to refactor. The code will guide you.
        </p>

        <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-4">Vibe Coding vs. Traditional Approaches</h2>
        <p className="mb-4">
          Vibe coding doesn't replace good engineering practices—it complements them:
        </p>
        <div className="bg-muted p-4 rounded-lg mb-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">Aspect</th>
                <th className="text-left py-2">Traditional</th>
                <th className="text-left py-2">Vibe Coding</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium">Planning</td>
                <td className="py-2">Detailed upfront planning</td>
                <td className="py-2">Clear intention, flexible execution</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium">Refactoring</td>
                <td className="py-2">Scheduled refactoring sessions</td>
                <td className="py-2">Refactor when it feels natural</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4 font-medium">Problem Solving</td>
                <td className="py-2">Systematic analysis</td>
                <td className="py-2">Intuitive exploration</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium">Code Quality</td>
                <td className="py-2">Strict adherence to standards</td>
                <td className="py-2">Standards as guidelines, not rules</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-4">When to Use Vibe Coding</h2>
        <p className="mb-4">Vibe coding works best when:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>You're prototyping or exploring new ideas</li>
          <li>You have a good understanding of the problem domain</li>
          <li>You're working on features that benefit from creative solutions</li>
          <li>You need to maintain momentum and avoid analysis paralysis</li>
        </ul>

        <p className="mb-4">
          Consider a more structured approach when:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Working on critical, high-risk features</li>
          <li>Collaborating with a large team where consistency is crucial</li>
          <li>Dealing with complex business logic that requires careful analysis</li>
          <li>Working in a regulated industry with strict compliance requirements</li>
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

