import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { CookieOptions } from '@supabase/ssr';

/**
 * Especially important if using Fluid compute: Don't put this client in a
 * global variable. Always create a new client within each function when using
 * it.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
          try {
            const rootDomain = process.env.NEXT_PUBLIC_COOKIE_DOMAIN || '.velonova.ai';
            
            cookiesToSet.forEach(({ name, value, options }) => {
              const cookieOptions = {
                ...options,
                // Only set domain for production, not localhost
                ...(process.env.NODE_ENV === 'production' && { domain: rootDomain }),
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax' as const,
                path: '/',
              };
              
              cookieStore.set(name, value, cookieOptions);
            });
          } catch (error) {
            console.error('❌ Bruxelles server cookie set error:', error);
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    },
  );
}
