"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DonePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get("session_id")
  const [status, setStatus] = useState<string>("loading")

  useEffect(() => {
    if (sessionId) {
      fetch(`/dashboard/api/billing/session-status?session_id=${sessionId}`)
          .then((res) => res.json())
          .then((data) => setStatus(data.status))
    }
  }, [sessionId])

  const handleManageBilling = async () => {
    try {
      const response = await fetch("/dashboard/api/billing/portal", {
        method: "POST",
      })
      const data = await response.json()
      if (data.url) {
        router.push(data.url)
      }
    } catch (error) {
      console.error("Error creating portal session:", error)
    }
  }

  if (status === "loading") {
    return (
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  return (
      <div className="container mx-auto max-w-md px-4 py-8">
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          <h1 className="text-2xl font-bold mb-4">Checkout {status === "complete" ? "Successful" : "Failed"}</h1>
          <p className="mb-6">
            {status === "complete"
                ? "Thank you for your subscription!"
                : "There was a problem processing your payment. Please try again."}
          </p>
          <div className="space-y-4">
            {status === "complete" && (
                <Button onClick={handleManageBilling} className="w-full">
                  Manage billing information
                </Button>
            )}
            <Link href="/dashboard/billing" className="block">
              <Button variant="outline" className="w-full">
                Return to Billing
              </Button>
            </Link>
          </div>
        </div>
      </div>
  )
}

