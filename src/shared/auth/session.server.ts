import 'server-only';

import { redirect } from 'next/navigation';

import { createServerClient } from '@/shared/lib/supabase.client';

export async function getSession() {
  const supabase = await createServerClient();
  // Use getUser() for secure server-side validation instead of getSession()
  const { data: { user }, error } = await supabase.auth.getUser();

  // Return null if no authenticated user
  if (error || !user) {
    return null;
  }

  // Return user data in session-like format for backward compatibility
  return { user };
}

export async function requireSession() {
  const session = await getSession();
  if (!session || !session.user) {
    redirect('/(public)/login');
  }
  return { userId: session.user.id };
}

export async function redirectIfAuthenticated() {
  const session = await getSession();
  if (session && session.user) {
    redirect('/');
  }
}