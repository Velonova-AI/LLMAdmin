import { createClient } from './client';

// Type definitions for profile operations
export type ProfileUpdate = {
  email?: string;
  first_name?: string;
  surname?: string;
  startup_name?: string;
  founder_name?: string;
  industry?: string;
  stage?: string;
  bio?: string;
  website?: string | null;
  musical_level?: string;
  profile_photo_url?: string;
  instruments?: string[];
  musical_styles?: string[];
  [key: string]: any; // Allow other fields
};

export type Profile = {
  id: string;
  email: string;
  first_name?: string;
  surname?: string;
  startup_name?: string;
  founder_name?: string;
  industry?: string;
  stage?: string;
  bio?: string;
  website?: string;
  [key: string]: any;
};

export type ProfileFormData = {
  firstName?: string;
  surname?: string;
  email?: string;
  musicalLevel?: string;
  profilePhotoUrl?: string;
  instruments?: string[];
  musicalStyles?: string[];
  bio?: string;
  website?: string;
};

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

  const insertData = { id: userId, ...profileData };
  
  console.log('Creating profile with data:', {
    userId,
    profileData,
    insertData,
  });

  const { data, error } = await supabase
    .from('profiles')
    .insert(insertData)
    .select()
    .single();

  if (error) {
    console.error('Error creating profile - Full error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
      error: error,
      insertData,
    });
    throw error;
  }

  console.log('Profile created successfully:', data);
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

// Helper function to transform signup form data to profile format
export function transformSignupDataToProfile(signupData: {
  email: string;
  startupName: string;
  founderName: string;
  industry: string;
  stage: string;
  bio: string;
  website?: string;
}): ProfileUpdate {
  // Ensure all required fields have values (database has defaults but we should provide them)
  const profileData: ProfileUpdate = {
    email: signupData.email.trim(),
    startup_name: signupData.startupName.trim() || 'other',
    founder_name: signupData.founderName.trim() || 'other',
    industry: signupData.industry.trim() || 'other',
    stage: signupData.stage.trim() || 'other',
    bio: signupData.bio.trim() || 'other',
    website: signupData.website?.trim() || null,
  } as ProfileUpdate;
  
  console.log('Transformed profile data:', profileData);
  return profileData;
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
