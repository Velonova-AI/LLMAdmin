import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function GettingStartedPage() {
  const pages = [
    {
      title: "Introduction",
      href: "/learn/introduction",
      description: "Get started with the fundamentals and learn the basics of our platform.",
    },
    {
      title: "MVP",
      href: "/learn/mvp",
      description: "Learn how to build a Minimum Viable Product quickly and effectively.",
    },
    {
      title: "Prompt Engineering",
      href: "/learn/prompt-engineering",
      description: "Master the art of crafting effective prompts for AI interactions.",
    },
    {
      title: "Vibe Coding",
      href: "/learn/vibe-coding",
      description: "Discover the philosophy and approach behind vibe-driven development.",
    },
  ];

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Getting Started</h1>
        <p className="text-lg text-muted-foreground">
          Welcome to our learning resources. Choose a topic below to begin your journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pages.map((page) => (
          <Link key={page.href} href={page.href} className="group">
            <Card className="h-full transition-all hover:shadow-lg hover:border-primary/50">
              <CardHeader>
                <CardTitle className="group-hover:text-primary transition-colors">
                  {page.title}
                </CardTitle>
                <CardDescription>{page.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-primary font-medium group-hover:underline">
                  Learn more →
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

