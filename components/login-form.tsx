"use client";

import * as React from "react";
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Bike } from "lucide-react"
import { useLogin, useNotify } from "ra-core"
import { useNavigate } from "react-router"
import { createClient } from "@/lib/supabase/client"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string>("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [checkingAuth, setCheckingAuth] = React.useState(true);
  
  // Use react-admin's login hook - this integrates with the authProvider
  const login = useLogin();
  const notify = useNotify();
  const navigate = useNavigate();

  // Fast auth check using getSession (checks local storage/cookies first)
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('✅ LoginForm: User already authenticated, redirecting to home');
          navigate('/');
        } else {
          setCheckingAuth(false);
        }
      } catch (err) {
        console.error('Error checking auth:', err);
        setCheckingAuth(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  // Show loading state while checking authentication
  if (checkingAuth) {
    return (
      <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div className="flex w-full max-w-sm flex-col gap-6">
          <div className="text-center">Checking authentication...</div>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Use react-admin's login function which calls the authProvider
      // This ensures proper integration with the Admin component
      await login(
        { email: email.trim(), password },
        '/' // redirect to home after successful login
      );
      // The login function handles the redirect automatically
    } catch (err: any) {
      console.error('Login error - Full details:', {
        error: err,
        message: err?.message,
        stack: err?.stack,
        name: err?.name,
      });
      
      // Handle specific error messages
      let errorMessage = "Failed to sign in. Please try again.";
      if (typeof err === "string") {
        errorMessage = err;
      } else if (err?.message) {
        if (err.message.includes('Invalid login credentials') || err.message.includes('Invalid')) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (err.message.includes('Email not confirmed')) {
          errorMessage = "Please verify your email address before signing in.";
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
      notify(errorMessage, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Bike className="size-4" />
          </div>
          Velonova AI
        </a>
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Login Form</CardTitle>
              <CardDescription>
                Login with your Startup professional email
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
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      required
                      className={cn(error && "border-destructive")}
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">Password</FieldLabel>
                      <a
                        href="#/forgot-password"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (error) setError("");
                        }}
                        required
                        className={cn(error && "border-destructive", "pr-10")}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {error && (
                      <FieldDescription className="text-destructive text-sm mt-1">
                        {error}
                      </FieldDescription>
                    )}
                  </Field>
                  <Field>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Signing in..." : "Login"}
                    </Button>
                    <FieldDescription className="text-center">
                      Don&apos;t have an account? <a href="#/signup" className="underline underline-offset-4 hover:text-primary">Sign up</a>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
          <FieldDescription className="px-6 text-center">
            By clicking continue, you agree to our <a href="https://www.velonova.ai/en/terms" target="_blank" rel="noopener">Terms of Service</a>{" "}
            and <a href="https://www.velonova.ai/en/privacy" target="_blank" rel="noopener">Privacy Policy</a>.
          </FieldDescription>
        </div>
      </div>
    </div>
  )
}
