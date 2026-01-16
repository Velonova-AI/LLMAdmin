"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

export const Dashboard = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to Velonova AI Admin</CardTitle>
          <CardDescription>
            Manage your assistants, chat history, and more from this dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Access the Velo platform to explore additional features and resources.
            </p>
            <Button
              asChild
              variant="default"
              className="w-fit"
            >
              <a
                href="https://velo.velonova.ai"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit Velo Platform
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};


