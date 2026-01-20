"use client";

import * as React from 'react';
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// TypeScript declaration for Stripe pricing table web component
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'stripe-pricing-table': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          'pricing-table-id'?: string;
          'publishable-key'?: string;
          'customer-email'?: string;
        },
        HTMLElement
      >;
    }
  }
}

function PricingContent() {
  const searchParams = useSearchParams();
  const urlEmail = searchParams.get("email");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user?.email) {
          setUserEmail(user.email);
        }
      } catch (error) {
        console.error('Error fetching user email:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserEmail();
  }, []);

  // Use authenticated user's email if available, otherwise fall back to URL param
  const email = userEmail || urlEmail || undefined;

  // Stripe pricing table configuration
  const pricingTableId = "prctbl_1SSnRkGSulVn0dhgjaQ03dPe";
  const publishableKey = "pk_test_51SSgmRGSulVn0dhgXs19OR71AZFjAWdyMMMM8POg7eq8iKaxoaEF9yrhDJdqClRI6ibXAs4roNuO8SaeJVJwMj9w008zQFu1pU";

  return (
    <>
      <Script
        src="https://js.stripe.com/v3/pricing-table.js"
        strategy="afterInteractive"
      />
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-4xl">
          {!loading && React.createElement(
            'stripe-pricing-table',
            {
              'pricing-table-id': pricingTableId,
              'publishable-key': publishableKey,
              'customer-email': email,
            } as React.HTMLAttributes<HTMLElement>
          )}
        </div>
      </div>
    </>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-4xl">Loading...</div>
      </div>
    }>
      <PricingContent />
    </Suspense>
  );
}
