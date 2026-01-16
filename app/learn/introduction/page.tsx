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

export default function IntroductionPage() {
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
            <BreadcrumbPage>Introduction</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-4xl font-bold tracking-tight mb-6">Introduction</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg text-muted-foreground mb-8">
          Welcome to our platform! This introduction will help you understand the core concepts,
          architecture, and philosophy that guide our development approach. Whether you're a
          beginner or an experienced developer, this guide will set you on the right path.
        </p>

        <Separator className="my-8" />

        <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-4">What is This Platform?</h2>
        <p className="mb-4">
          Our platform is designed to help you build modern, scalable applications using the latest
          technologies and best practices. We combine powerful tools with intuitive interfaces to
          make development faster and more enjoyable.
        </p>

        <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-4">Core Principles</h2>
        <p className="mb-4">Our approach is built on several key principles:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>
            <strong>Simplicity:</strong> We believe in keeping things simple and avoiding unnecessary
            complexity.
          </li>
          <li>
            <strong>Developer Experience:</strong> Your productivity and happiness matter. We
            prioritize tools and workflows that make development enjoyable.
          </li>
          <li>
            <strong>Performance:</strong> Fast, responsive applications are essential for modern
            user experiences.
          </li>
          <li>
            <strong>Flexibility:</strong> Our platform adapts to your needs, not the other way
            around.
          </li>
        </ul>

        <h2 className="text-2xl font-semibold tracking-tight mt-8 mb-4">Getting Started</h2>
        <p className="mb-4">
          To begin working with our platform, you'll need to understand a few fundamental concepts:
        </p>

        <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">Prerequisites</h3>
        <p className="mb-4">Before diving in, make sure you have:</p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Basic knowledge of web development (HTML, CSS, JavaScript)</li>
          <li>Familiarity with React or similar component-based frameworks</li>
          <li>Understanding of modern development tools (Node.js, package managers)</li>
          <li>A code editor (VS Code recommended)</li>
        </ul>

        <Alert className="my-6">
          <Info className="h-4 w-4" />
          <AlertTitle>Good to know</AlertTitle>
          <AlertDescription>
            If you're new to these technologies, we recommend starting with our MVP guide, which
            provides a step-by-step approach to building your first application.
          </AlertDescription>
        </Alert>

        <h3 className="text-xl font-semibold tracking-tight mt-6 mb-3">Next Steps</h3>
        <p className="mb-4">
          Once you've familiarized yourself with the basics, you can explore:
        </p>
        <ol className="list-decimal pl-6 mb-4 space-y-2">
          <li>Building your first MVP to understand the workflow</li>
          <li>Learning prompt engineering for AI-powered features</li>
          <li>Exploring vibe coding principles for a more intuitive development experience</li>
        </ol>

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

