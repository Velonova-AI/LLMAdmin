import { supabaseAuthProvider } from 'ra-supabase';
import { supabase } from './dataProvider';

// Dashboard URL - use environment variable for local testing, fallback to production
const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'https://dashboard.velonova.ai';

// Create base auth provider
const baseAuthProvider = supabaseAuthProvider(supabase, {
  getIdentity: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Fetch profile from profiles table
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Handle case where profile doesn't exist yet
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error fetching profile:', profileError);
    }

    // Use founder_name, fallback to "Founder" if null
    const fullName = profile?.founder_name || 'Founder';

    // Get avatar URL from profile, then fallback to OAuth metadata
    const avatar = profile?.profile_photo_url 
      || user.user_metadata?.avatar_url 
      || user.user_metadata?.picture
      || null;

    return {
      id: user.id,
      email: user.email,
      fullName,
      avatar,
    };
  },
});

// Extend auth provider to redirect to dashboard for login/logout
export const authProvider = {
  ...baseAuthProvider,
  checkAuth: async () => {
    // Redirect immediately on client-side before async check to prevent login page flash
    if (typeof window !== 'undefined') {
      // Quick synchronous check: if we're on login route, redirect immediately
      if (window.location.hash === '#/login' || window.location.pathname === '/login') {
        // Don't redirect if we're already on the dashboard URL (to prevent loops)
        // When DASHBOARD_URL is localhost, allow local login to work
        try {
          const dashboardOrigin = new URL(DASHBOARD_URL).origin;
          if (window.location.origin === dashboardOrigin) {
            // We're already on the dashboard/localhost, let the login page render locally
            // Don't redirect - let the base auth provider handle it
            return;
          }
        } catch (e) {
          // If DASHBOARD_URL is invalid, continue with redirect
        }
        const currentUrl = window.location.href;
        const returnUrl = encodeURIComponent(currentUrl);
        const loginUrl = `${DASHBOARD_URL}/#/login?redirect=${returnUrl}`;
        window.location.replace(loginUrl);
        // Return a promise that never resolves to prevent further execution
        return new Promise<void>(() => {});
      }
    }

    console.log('🔍 Bruxelles: Checking auth from cookies...');
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (user) {
      console.log('✅ Bruxelles: User found in cookies, auto-login:', {
        userId: user.id,
        email: user.email,
      });
      // User is authenticated, no need to throw
      return;
    } else {
      console.log('❌ Bruxelles: No user in cookies, redirecting to dashboard login', error);
      // Redirect to dashboard login with return URL
      const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
      
      if (typeof window !== 'undefined') {
        // Check if we're already on the dashboard/localhost - if so, don't redirect
        try {
          const dashboardOrigin = new URL(DASHBOARD_URL).origin;
          if (window.location.origin === dashboardOrigin) {
            // We're on localhost and DASHBOARD_URL is also localhost
            // Let the base auth provider handle the login (throw error to show login page)
            throw new Error('Not authenticated');
          }
        } catch (e) {
          // If URL parsing fails or origins don't match, continue with redirect logic
        }
      }
      
      const returnUrl = encodeURIComponent(currentUrl);
      const loginUrl = `${DASHBOARD_URL}/#/login?redirect=${returnUrl}`;
      
      if (typeof window !== 'undefined') {
        // Use replace instead of href for immediate redirect without history entry
        window.location.replace(loginUrl);
      }
      throw new Error('Not authenticated');
    }
  },
  login: async (params: any) => {
    // If DASHBOARD_URL is localhost, use local login instead of redirecting
    if (typeof window !== 'undefined') {
      try {
        const dashboardOrigin = new URL(DASHBOARD_URL).origin;
        if (window.location.origin === dashboardOrigin) {
          // We're on localhost and DASHBOARD_URL is also localhost
          // Use the base auth provider's login method for local authentication
          return baseAuthProvider.login(params);
        }
      } catch (e) {
        // If URL parsing fails, continue with redirect
      }
    }
    
    // Redirect to dashboard for login
    const returnUrl = typeof window !== 'undefined' ? window.location.href : '';
    const loginUrl = `${DASHBOARD_URL}/#/login?redirect=${encodeURIComponent(returnUrl)}`;
    
    if (typeof window !== 'undefined') {
      window.location.replace(loginUrl);
    }
    // This won't resolve, but that's okay since we're redirecting
    return Promise.resolve();
  },
  logout: async () => {
    // Sign out from Supabase first
    await supabase.auth.signOut();
    
    // Redirect to dashboard
    return DASHBOARD_URL;
  },
};

