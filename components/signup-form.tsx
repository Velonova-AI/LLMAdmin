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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Link, useNavigate } from "react-router"
import { ExternalLink, Eye, EyeOff, Bike } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { createProfile, transformSignupDataToProfile } from "@/lib/supabase/profiles"

const industries = [
  "AI",
  "Bio + Healthcare",
  "Consumer",
  "Cybersecurity",
  "Fintech",
  "Infrastructure",
  "Robotics + Hardware",
  "SaaS",
  "Supply Chain + Automation",
];

const startupStages = [
  "Pre-Seed stage",
  "Seed stage",
  "Early stage",
  "Growth stage",
  "Expansion stage",
  "Exit stage",
];

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [formData, setFormData] = React.useState({
    startupName: "",
    founderName: "",
    email: "",
    industry: "",
    stage: "",
    bio: "",
    website: "",
    password: "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [checkingAuth, setCheckingAuth] = React.useState(true);
  const navigate = useNavigate();

  // Fast auth check using getSession (checks local storage/cookies first)
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log('✅ SignupForm: User already authenticated, redirecting to home');
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

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one digit";
    }
    
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return "Password must contain at least one symbol";
    }
    
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user selects a value
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.industry) {
      newErrors.industry = "Please select an industry";
    }
    
    if (!formData.stage) {
      newErrors.stage = "Please select a startup stage";
    }
    
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});
    setLoading(true);
    
    try {
      const supabase = createClient();
      
      // Sign up user with Supabase Auth
      // Pass profile data in metadata so database triggers can use it if needed
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            startup_name: formData.startupName.trim() || 'other',
            founder_name: formData.founderName.trim() || 'other',
            industry: formData.industry.trim() || 'other',
            stage: formData.stage.trim() || 'other',
            bio: formData.bio.trim() || 'other',
            website: formData.website?.trim() || null,
          }
        }
      });
      
      if (authError) {
        console.error('Auth signup error - Full details:', {
          error: authError,
          message: authError.message,
          status: authError.status,
          formData: { email: formData.email },
        });
        
        // Handle specific Supabase errors
        if (authError.message.includes('already registered')) {
          setErrors({ email: "This email is already registered. Please sign in instead." });
        } else if (authError.message.includes('Password')) {
          setErrors({ password: authError.message });
        } else {
          setErrors({ email: authError.message || "Failed to create account. Please try again." });
        }
        setLoading(false);
        return;
      }
      
      if (!authData.user) {
        console.error('Auth signup succeeded but no user returned:', authData);
        setErrors({ email: "Failed to create account. Please try again." });
        setLoading(false);
        return;
      }
      
      console.log('Auth signup successful:', {
        userId: authData.user.id,
        email: authData.user.email,
      });
      
      // Create or update profile with signup data
      // Use upsert in case a trigger already created a partial profile
      try {
        console.log('Starting profile creation/update for user:', authData.user.id);
        console.log('Form data:', formData);
        
        const profileData = transformSignupDataToProfile({
          email: formData.email,
          startupName: formData.startupName,
          founderName: formData.founderName,
          industry: formData.industry,
          stage: formData.stage,
          bio: formData.bio,
          website: formData.website,
        });
        
        console.log('Transformed profile data:', profileData);
        
        // Use upsertProfile instead of createProfile in case trigger already created profile
        // Reuse the supabase client from above
        const { data: profileResult, error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            id: authData.user.id,
            ...profileData 
          }, {
            onConflict: 'id'
          })
          .select()
          .single();
        
        if (profileError) {
          console.error('Profile upsert error - Full details:', {
            error: profileError,
            message: profileError.message,
            details: profileError.details,
            hint: profileError.hint,
            code: profileError.code,
            profileData,
          });
          throw profileError;
        }
        
        console.log('Profile created/updated successfully:', profileResult);
      } catch (profileError: any) {
        console.error('Profile creation error - Full details:', {
          error: profileError,
          message: profileError?.message,
          details: profileError?.details,
          hint: profileError?.hint,
          code: profileError?.code,
          stack: profileError?.stack,
          formData,
        });
        
        // Set error to show user
        setErrors({ 
          email: `Account created but profile setup failed: ${profileError?.message || 'Unknown error'}. Please contact support.` 
        });
        setLoading(false);
        return; // Don't redirect if profile creation fails
      }
      
      // Success - redirect to home page (user is logged in)
      navigate('/');
    } catch (error: any) {
      console.error('Signup error - Full details:', {
        error,
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
        formData,
      });
      setErrors({ 
        email: error?.message || "An unexpected error occurred. Please try again." 
      });
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
              <CardTitle className="text-xl">Sign Up Form</CardTitle>
              <CardDescription>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <FieldGroup>
              <Field>
                <FieldLabel htmlFor="startupName" className="text-center">Startup Name</FieldLabel>
                <Input 
                  id="startupName" 
                  name="startupName"
                  type="text"
                  value={formData.startupName}
                  onChange={handleInputChange}
                  required 
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="founderName">Startup Founder Name</FieldLabel>
                <Input
                  id="founderName"
                  name="founderName"
                  type="text"
                  placeholder="Enter founder name"
                  value={formData.founderName}
                  onChange={handleInputChange}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Professional Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={cn(errors.email && "border-destructive")}
                />
                {errors.email && (
                  <FieldDescription className="text-destructive text-sm mt-1">
                    {errors.email}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="industry">Industry</FieldLabel>
                <Select
                  value={formData.industry}
                  onValueChange={(value) => handleSelectChange("industry", value)}
                  required
                >
                  <SelectTrigger id="industry" className={cn("w-full", errors.industry && "border-destructive")}>
                    <SelectValue placeholder="Select an industry" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.industry && (
                  <FieldDescription className="text-destructive text-sm mt-1">
                    {errors.industry}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel htmlFor="stage">Startup Stage</FieldLabel>
                  <a
                    href="https://baselarea.swiss/knowledge-hub/6-startup-stages/"
                    target="_blank"
                    rel="noopener"
                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                  >
                    Learn more
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
                <Select
                  value={formData.stage}
                  onValueChange={(value) => handleSelectChange("stage", value)}
                  required
                >
                  <SelectTrigger id="stage" className={cn("w-full", errors.stage && "border-destructive")}>
                    <SelectValue placeholder="Select startup stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {startupStages.map((stage) => (
                      <SelectItem key={stage} value={stage}>
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.stage && (
                  <FieldDescription className="text-destructive text-sm mt-1">
                    {errors.stage}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="bio">Your Elevator Pitch </FieldLabel>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="My AI startup idea is... "
                  value={formData.bio}
                  required
                  onChange={handleInputChange}
                  rows={4}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="website">Website</FieldLabel>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  placeholder="https://example.com (optional)"
                  value={formData.website}
                  onChange={handleInputChange}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={8}
                    className={cn(errors.password && "border-destructive", "pr-10")}
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
                <FieldDescription>
                  Must be at least 8 characters with digits, lowercase, uppercase letters, and symbols.
                </FieldDescription>
                {errors.password && (
                  <FieldDescription className="text-destructive text-sm mt-1">
                    {errors.password}
                  </FieldDescription>
                )}
              </Field>
              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link to="/login" className="underline underline-offset-4 hover:text-primary">Sign in</Link>
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
