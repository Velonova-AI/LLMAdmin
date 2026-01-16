import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Configure client with 'bruxelles' schema as default
  // This is useful for direct Supabase queries outside of ra-supabase-core
  // Note: ra-supabase-core still requires schema-qualified resource names in Resource components
  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
  
  // Add console logs for cookie operations
  if (typeof window !== 'undefined') {
    client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          console.log('✅ Bruxelles client cookie set successfully - User authenticated', {
            event,
            userId: session.user?.id,
            expiresAt: session.expires_at,
          });
        } else {
          console.error('❌ Bruxelles client cookie set error - No session data', { event });
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('🗑️ Bruxelles client cookie cleared - User signed out', { event });
      } else if (event === 'USER_UPDATED') {
        console.log('👤 Bruxelles client user updated', {
          userId: session?.user?.id,
        });
      }
    });
  }
  
  // Type assertion needed because ra-supabase-core expects 'public' schema type
  // Runtime behavior works correctly with custom schemas
  return client as any;
}

// // Test function to query and log assistants
// // You can call this from browser console: testQuery()
// export async function testQuery() {
//   try {
//     const { data: assistants, error } = await createClient()
//       .from('assistants')
//       .select('*');
    
//     if (error) {
//       console.error('Error fetching assistants:', error);
//       return;
//     }
    
//     console.log('Assistants:', assistants);
//     return assistants;
//   } catch (err) {
//     console.error('Exception:', err);
//   }
// }