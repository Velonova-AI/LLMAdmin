import { createClient } from './client';
import type { Profile, ProfileUpdate, ProfileFormData } from '@/lib/types/profile';

export async function getProfile(userId?: string) {
  const supabase = createClient();
  
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    userId = user.id;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    throw error;
  }

  return data as Profile;
}

export async function updateProfile(updates: ProfileUpdate, userId?: string) {
  const supabase = createClient();
  
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    userId = user.id;
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw error;
  }

  return data as Profile;
}

export async function createProfile(profileData: ProfileUpdate, userId?: string) {
  const supabase = createClient();
  
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    userId = user.id;
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert({ id: userId, ...profileData })
    .select()
    .single();

  if (error) {
    console.error('Error creating profile:', error);
    throw error;
  }

  return data as Profile;
}

export async function upsertProfile(profileData: ProfileUpdate, userId?: string) {
  const supabase = createClient();
  
  if (!userId) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');
    userId = user.id;
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert({ id: userId, ...profileData })
    .select()
    .single();

  if (error) {
    console.error('Error upserting profile:', error);
    throw error;
  }

  return data as Profile;
}

// Helper function to transform form data to database format
export function transformFormDataToProfile(formData: ProfileFormData): ProfileUpdate {
  return {
    first_name: formData.firstName,
    surname: formData.surname,
    email: formData.email,
    musical_level: formData.musicalLevel,
    profile_photo_url: formData.profilePhotoUrl,
    instruments: formData.instruments,
    musical_styles: formData.musicalStyles,
    bio: formData.bio,
    website: formData.website,
  };
}

// Helper function to transform database data to form format
export function transformProfileToFormData(profile: Profile): ProfileFormData {
  return {
    firstName: profile.first_name || '',
    surname: profile.surname || '',
    email: profile.email || '',
    musicalLevel: profile.musical_level || 'beginner',
    profilePhotoUrl: profile.profile_photo_url || undefined,
    instruments: profile.instruments || [],
    musicalStyles: profile.musical_styles || [],
    bio: profile.bio || '',
    website: profile.website || undefined,
  };
}
