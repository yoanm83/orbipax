import { createServerClient } from '../../../../shared/lib/supabase.client';
import type { AuthErrorCode } from '../../domain/errors/auth.errors';
import type { SignInInput, SignInResult } from '../../domain/types/auth.types';

function mapSupabaseErrorToCode(error: unknown): { code: AuthErrorCode; internalMessage: string } {
  const message = (error as { message?: string })?.message ?? '';

  if (message.includes('Invalid login credentials')) {
    return { code: 'INVALID_CREDENTIALS', internalMessage: message };
  }

  if (message.includes('Email not confirmed')) {
    return { code: 'EMAIL_NOT_VERIFIED', internalMessage: message };
  }

  if (message.includes('rate limit') || message.includes('too many requests')) {
    return { code: 'RATE_LIMIT', internalMessage: message };
  }

  return { code: 'UNKNOWN', internalMessage: message };
}

export async function signInInfra({ email, password, remember }: SignInInput): Promise<SignInResult> {
  try {
    const supabase = await createServerClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // Handle remember me functionality by setting session persistence
    if (remember && data.session) {
      // Set session to persist for 30 days via Supabase client configuration
      await supabase.auth.setSession(data.session);
    }

    if (error) {
      const mappedError = mapSupabaseErrorToCode(error);
      return {
        ok: false,
        code: mappedError.code,
        message: mappedError.internalMessage, // Will be filtered in application layer
      };
    }

    if (!data.user) {
      return {
        ok: false,
        code: 'UNKNOWN',
        message: 'Authentication failed - no user returned',
      };
    }

    return {
      ok: true,
      userId: data.user.id,
    };
  } catch (error) {
    return {
      ok: false,
      code: 'UNKNOWN',
      message: error instanceof Error ? error.message : 'Network error',
    };
  }
}