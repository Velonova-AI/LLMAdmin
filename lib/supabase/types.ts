export type UserType = 'guest' | 'regular';

// Module augmentation for Supabase types
// @ts-ignore - Module may not be resolved during build but types are available at runtime
declare module '@supabase/supabase-js' {
  interface UserMetadata {
    type?: UserType;
  }
}

export interface ExtendedSession {
  user: {
    id: string;
    email?: string;
    type: UserType;
  };
}
