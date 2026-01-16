import { createClient } from './client';

export async function uploadProfilePhoto(file: File, userId: string): Promise<string> {
  const supabase = createClient();
  
  // Generate a unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/profile-photo.${fileExt}`;
  
  // Upload the file
  const { error } = await supabase.storage
    .from('Files')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true // Replace existing file
    });

  if (error) {
    console.error('Error uploading profile photo:', error);
    throw error;
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from('Files')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

export async function uploadFile(file: File, userId: string): Promise<string> {
  const supabase = createClient();
  
  // Generate a unique filename
  const timestamp = Date.now();
  const fileName = `${userId}/${timestamp}-${file.name}`;
  
  // Upload the file
  const { error } = await supabase.storage
    .from('Files')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading file:', error);
    throw error;
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from('Files')
    .getPublicUrl(fileName);

  return urlData.publicUrl;
}

export async function deleteFile(filePath: string): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase.storage
    .from('Files')
    .remove([filePath]);

  if (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
}

export async function deleteProfilePhoto(userId: string): Promise<void> {
  const supabase = createClient();
  
  // List files in user's folder
  const { data: files, error: listError } = await supabase.storage
    .from('profile-photos')
    .list(userId);

  if (listError) {
    console.error('Error listing profile photos:', listError);
    throw listError;
  }

  // Delete all profile photos for the user
  if (files && files.length > 0) {
    const fileNames = files.map((file: { name: string }) => `${userId}/${file.name}`);
    
    const { error: deleteError } = await supabase.storage
      .from('profile-photos')
      .remove(fileNames);

    if (deleteError) {
      console.error('Error deleting profile photos:', deleteError);
      throw deleteError;
    }
  }
}

export function getFileUrl(filePath: string): string {
  const supabase = createClient();
  
  const { data } = supabase.storage
    .from('Files')
    .getPublicUrl(filePath);
  return data.publicUrl;
}

export function getProfilePhotoUrl(userId: string, fileName?: string): string {
  const supabase = createClient();
  
  if (fileName) {
    const { data } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(`${userId}/${fileName}`);
    return data.publicUrl;
  }
  
  // Try to get the default profile photo filename
  const { data } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(`${userId}/profile-photo.jpg`);
  return data.publicUrl;
}

// Helper function to validate file
export function validateFile(file: File): { valid: boolean; error?: string } {
  const maxSize = 32 * 1024 * 1024; // 32MB
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif',
    'application/pdf',
   
  ];  
  
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 32MB' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'File type not supported. Allowed: JPEG, PNG,  PDF' };
  }
  
  return { valid: true };
}

