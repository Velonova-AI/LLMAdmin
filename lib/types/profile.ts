export type Profile = {
  id: string;
  email?: string | null;
  first_name?: string | null;
  surname?: string | null;
  musical_level?: string | null;
  profile_photo_url?: string | null;
  instruments?: string[] | null;
  musical_styles?: string[] | null;
  bio?: string | null;
  website?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type ProfileUpdate = Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;

export type ProfileFormData = {
  firstName: string;
  surname: string;
  email: string;
  musicalLevel: string;
  profilePhotoUrl?: string;
  instruments?: string[];
  musicalStyles?: string[];
  bio?: string;
  website?: string;
};


