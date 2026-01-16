import { supabaseAuthProvider } from 'ra-supabase';
import { supabase } from './dataProvider';

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

// Export auth provider using base Supabase auth provider
export const authProvider = baseAuthProvider;

