"use client";

import * as React from "react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Link } from "react-router"
import { Bike } from "lucide-react"
import { supabase } from "@/app/admin/dataProvider"

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [loading, setLoading] = React.useState(false);
  const [emailSent, setEmailSent] = React.useState(false);
  const [error, setError] = React.useState<string>("");
  const [email, setEmail] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const redirectTo = typeof window !== "undefined" 
        ? `${window.location.origin}/reset-password`
        : "/reset-password";
      const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });

      if (supabaseError) {
        setError(supabaseError.message || "Failed to send reset email");
      } else {
        setEmailSent(true);
      }
    } catch (err: any) {
      setError(
        typeof err === "string"
          ? err
          : err?.message || "Failed to send reset email"
      );
    } finally {
      setLoading(false);
    }
  };

  const layoutWrapper = (content: React.ReactNode) => (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Bike className="size-4" />
          </div>
          Velonova AI
        </a>
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          {content}
        </div>
      </div>
    </div>
  );

  if (emailSent) {
    return layoutWrapper(
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Check your email</CardTitle>
          <CardDescription>
            Password reset instructions sent
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <FieldDescription className="text-center">
              We've sent password reset instructions to your email address.
              Please check your inbox and follow the link to reset your password.
            </FieldDescription>
            <Field>
              <Link to="/login">
                <Button className="w-full">Back to Login</Button>
              </Link>
            </Field>
          </FieldGroup>
        </CardContent>
      </Card>
    );
  }

  return layoutWrapper(
    <>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your email address and we'll send you instructions to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              {error && (
                <FieldDescription className="text-destructive text-sm">
                  {error}
                </FieldDescription>
              )}
              <Field>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </Field>
              <FieldDescription className="text-center">
                Remember your password? <Link to="/login" className="underline underline-offset-4 hover:text-primary">Sign in</Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="https://www.velonova.ai/en/terms" target="_blank" rel="noopener">Terms of Service</a>{" "}
        and <a href="https://www.velonova.ai/en/privacy" target="_blank" rel="noopener">Privacy Policy</a>.
      </FieldDescription>
    </>
  )
}

