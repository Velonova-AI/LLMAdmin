import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Configure client with 'bruxelles' schema as default
  // This is useful for direct Supabase queries outside of ra-supabase-core
  // Note: ra-supabase-core still requires schema-qualified resource names in Resource components
  const client = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

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