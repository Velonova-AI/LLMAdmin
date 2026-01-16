"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function CheckoutSuccessHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    const handleCheckoutSuccess = async () => {
      const checkout = searchParams.get("checkout");
      const sessionId = searchParams.get("session_id");

      if (checkout !== "success" || hasProcessed) {
        return;
      }

      setHasProcessed(true);

      try {
        const supabase = createClient();
        
        // Check if user already has a session
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (user && !userError) {
          // User is already logged in (they were logged in during checkout)
          // Wait a moment for webhook to process, then clear query params
          setTimeout(() => {
            router.replace("/");
          }, 2000);
          return;
        }

        // If no session, the user needs to log in
        // The webhook has updated their subscription, so they can now log in
        if (sessionId) {
          // Get user email from checkout session to pre-fill login
          try {
            const response = await fetch(`/api/checkout/verify?session_id=${sessionId}`);
            if (response.ok) {
              const data = await response.json();
              if (data.userEmail) {
                router.replace("/login?checkout=success&email=" + encodeURIComponent(data.userEmail));
                return;
              }
            }
          } catch (error) {
            console.error("Error verifying checkout:", error);
          }
        }

        // Redirect to login
        router.replace("/login?checkout=success");
      } catch (error) {
        console.error("Error handling checkout success:", error);
        router.replace("/login?checkout=success");
      }
    };

    handleCheckoutSuccess();
  }, [searchParams, router, hasProcessed]);

  return null;
}

