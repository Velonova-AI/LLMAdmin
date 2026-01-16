import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export type UserType = 'guest' | 'regular';
export type Session = { user?: { id: string; email?: string | null; type: UserType } };

export async function auth(): Promise<Session> {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (data.user) {
    return { user: { id: data.user.id, email: data.user.email, type: 'regular' } };
  }
  return {};
}

export async function signOut({ redirectTo }: { redirectTo?: string }) {
  'use server';
  const supabase = await createClient();
  await supabase.auth.signOut();
  if (redirectTo) redirect(redirectTo);
}

