"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

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
  "Other",
];

const startupStages = [
  "Pre-Seed stage",
  "Seed stage",
  "Early stage",
  "Growth stage",
  "Expansion stage",
  "Exit stage",
];

export function Signup03() {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    startupName: "",
    founderName: "",
    email: "",
    industry: "",
    stage: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    // Basic validation
    if (
      !formData.startupName ||
      !formData.founderName ||
      !formData.email ||
      !formData.industry ||
      !formData.stage ||
      !formData.password
    ) {
      setLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setLoading(false);
      return;
    }

    // Password validation (minimum 8 characters)
    if (formData.password.length < 8) {
      setLoading(false);
      return;
    }

    // TODO: Handle form submission (no Supabase integration for now)
    console.log("Form data:", formData);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setLoading(false);
  };

  return (
    <div 
      className="w-full min-h-screen relative bg-cover bg-center bg-no-repeat flex items-center justify-center py-12 px-4"
      style={{
        backgroundImage: "url('/bruxelles.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 w-full max-w-[450px]">
        <div className="grid gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold text-white">Velonova AI</h1>
            <p className="text-balance text-white/90">

            Sign Up
            
            </p>
          </div>
          <Card className="bg-background/95 backdrop-blur-sm">
            <CardHeader>
              {/* <CardTitle>Sign up</CardTitle>
              <CardDescription>
                Enter your details to create your startup account
              </CardDescription> */}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="startupName">Startup Name</Label>
                  <Input
                    id="startupName"
                    name="startupName"
                    type="text"
                    placeholder="Enter your startup name"
                    value={formData.startupName}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="founderName">Startup Founder Name</Label>
                  <Input
                    id="founderName"
                    name="founderName"
                    type="text"
                    placeholder="Enter founder name"
                    value={formData.founderName}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Professional Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => handleSelectChange("industry", value)}
                    required
                  >
                    <SelectTrigger id="industry" className="w-full">
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
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="stage">Startup Stage</Label>
                    <Link
                      href="https://baselarea.swiss/knowledge-hub/6-startup-stages/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                    >
                      Learn more
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                  <Select
                    value={formData.stage}
                    onValueChange={(value) => handleSelectChange("stage", value)}
                    required
                  >
                    <SelectTrigger id="stage" className="w-full">
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
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter password (min. 8 characters)"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    minLength={8}
                    className="w-full"
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Creating account..." : "Create account"}
                </Button>
              </form>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
