"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router";
import { User, CreditCard, Sparkles } from "lucide-react";
import { useDataProvider } from "ra-core";
import { calculateProfileCompletion } from "@/lib/utils/profile-completion";

export const Overview = () => {
  const dataProvider = useDataProvider();
  const [completion, setCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await dataProvider.getUserProfile();
        const percentage = calculateProfileCompletion(result.data);
        setCompletion(percentage);
        
        // Check subscription status
        // Supabase returns snake_case column names, not camelCase
        const status = result.data?.subscription_status || result.data?.subscriptionStatus;
        const subscriptionId = result.data?.stripe_subscription_id || result.data?.stripeSubscriptionId;
        const planName = result.data?.plan_name || result.data?.planName;
        const stripeCustomerId = result.data?.stripe_customer_id || result.data?.stripeCustomerId;
        
        console.log("📊 Subscription Debug Info:", {
          subscriptionStatus: status,
          stripeSubscriptionId: subscriptionId,
          planName: planName,
          stripeCustomerId: stripeCustomerId,
          rawData: result.data,
          allKeys: Object.keys(result.data || {}),
        });
        
        setSubscriptionStatus(status || null);
        
        // Consider subscription active if status is 'active' or 'trialing'
        // Also check if subscriptionId exists (even if status is null, subscription exists)
        const isActiveStatus = status === 'active' || status === 'trialing' || status === 'cancel_at_period_end';
        const hasSubscriptionId = !!subscriptionId;
        const finalHasActive = isActiveStatus || hasSubscriptionId;
        
        console.log("🔍 Subscription Detection:", {
          status,
          subscriptionId,
          isActiveStatus,
          hasSubscriptionId,
          finalHasActive,
          statusCheck: {
            isActiveStatus: status === 'active',
            isTrialingStatus: status === 'trialing',
            isCancelAtPeriodEnd: status === 'cancel_at_period_end',
            statusType: typeof status,
            statusValue: status,
          },
        });
        
        console.log("✅ User has active subscription:", finalHasActive);
        
        setHasActiveSubscription(finalHasActive);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setCompletion(0);
        setHasActiveSubscription(false);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [dataProvider]);
  return (
    <div className="p-6">
      {/* Show subscription prompt if no active subscription */}
      {!loading && !hasActiveSubscription && (
        <Card className="mb-6 border-primary/50 bg-primary/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>Get Started with a Subscription</CardTitle>
            </div>
            <CardDescription>
              Choose a plan to unlock all features and start using Velonova AI.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg" className="w-full">
              <a href="#/pricing">View Pricing Plans</a>
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Welcome to Velonova AI Admin</CardTitle>
          <CardDescription>
            Manage your assistants, chat history, and more from this overview.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  <CardTitle className="text-lg">Profile</CardTitle>
                </div>
                <CardDescription>Manage your profile information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Profile Completion</span>
                    <span className="font-medium">
                      {loading ? "..." : `${Math.round(completion)}%`}
                    </span>
                  </div>
                  <Progress value={loading ? 0 : completion} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  <CardTitle className="text-lg">Billing</CardTitle>
                </div>
                <CardDescription>
                  {hasActiveSubscription 
                    ? `Status: ${subscriptionStatus || 'Active'}`
                    : "Manage your subscription and billing"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {hasActiveSubscription ? (
                  <p className="text-sm text-muted-foreground">
                    Your subscription is active. Manage it from the billing page.
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No active subscription. Choose a plan to get started.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-row gap-4 mt-4">
            <Button asChild variant="default" className="flex-1">
              <Link to="/my-profile">Edit Profile</Link>
            </Button>
            <Button asChild variant={hasActiveSubscription ? "default" : "outline"} className="flex-1">
              <a href="#/billing">View Billing</a>
            </Button>
            {!hasActiveSubscription && (
              <Button asChild variant="default" className="flex-1">
                <a href="#/pricing">View Pricing</a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
