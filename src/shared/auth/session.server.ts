import 'server-only';

import { redirect } from 'next/navigation';

import { createServerClient } from '@/shared/lib/supabase.client';

export async function getSession() {
  const supabase = await createServerClient();
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect('/(public)/login');
  }
  return { userId: session.user.id };
}

export async function redirectIfAuthenticated() {
  const session = await getSession();
  if (session) {
    redirect('/');
  }
}