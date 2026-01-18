"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router";
import { User, CreditCard } from "lucide-react";

export const Overview = () => {
  return (
    <div className="p-6">
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
                    <span className="font-medium">75%</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  <CardTitle className="text-lg">Billing</CardTitle>
                </div>
                <CardDescription>Manage your subscription and billing</CardDescription>
              </CardHeader>
              <CardContent>
              </CardContent>
            </Card>
          </div>
          <div className="flex flex-row gap-4 mt-4">
            <Button asChild variant="default" className="flex-1">
              <Link to="/my-profile">Edit Profile</Link>
            </Button>
            <Button asChild variant="default" className="flex-1">
              <Link to="/billing">View Billing</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
