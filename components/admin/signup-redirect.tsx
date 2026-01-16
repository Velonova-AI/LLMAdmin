import { useEffect } from "react";
import { useGetIdentity } from "ra-core";

const DASHBOARD_URL = 'https://dashboard.velonova.ai';

export const SignupRedirect = () => {
  const { data: identity, isLoading } = useGetIdentity();
  
  useEffect(() => {
    // Wait for identity check to complete
    if (isLoading) return;
    
    // If user is authenticated, redirect to home instead of signup
    if (identity) {
      window.location.replace(window.location.origin);
      return;
    }
    
    // Only redirect unauthenticated users to dashboard signup
    const currentUrl = window.location.href;
    const returnUrl = encodeURIComponent(currentUrl);
    const signupUrl = `${DASHBOARD_URL}/#/signup?redirect=${returnUrl}`;
    window.location.replace(signupUrl);
  }, [identity, isLoading]);
  
  return (
    <div className="flex h-screen items-center justify-center">
      <p>Redirecting to signup...</p>
    </div>
  );
};

