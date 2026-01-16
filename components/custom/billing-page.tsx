"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, ExternalLink, CheckCircle2 } from "lucide-react";

export function BillingPage() {
  const [loading, setLoading] = React.useState(false);

  const openCustomerPortal = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/customer-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error || "Failed to open customer portal");
        return;
      }

      const data = await response.json();
      // Open in same window to allow return URL to work
      window.location.href = data.url;
    } catch (error) {
      console.error("Error opening customer portal:", error);
      alert("Failed to open customer portal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
        <p className="text-muted-foreground mt-2">
          Manage your subscription and billing information
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Customer Portal
          </CardTitle>
          <CardDescription>
            Access your Stripe customer portal to manage your subscription, update
            payment methods, view invoices, and more.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="space-y-1">
                <p className="font-medium">What you can do in the portal:</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>View and update your subscription plan</li>
                  <li>Manage payment methods</li>
                  <li>Download invoices and receipts</li>
                  <li>Update billing information</li>
                  <li>Cancel or modify your subscription</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={openCustomerPortal}
            size="lg"
            className="w-full sm:w-auto"
            disabled={loading}
          >
            {loading ? (
              "Loading..."
            ) : (
              <>
                Open Customer Portal
                <ExternalLink className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <a href="/pricing">View Plans</a>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

