'use server';

import { AUTH_ERROR_MESSAGE } from '../domain/errors/auth.errors';
import type { SignInInput, SignInResult } from '../domain/types/auth.types';
import { signInSchema } from '../domain/validation/auth.schema';
import { signInInfra } from '../infrastructure/supabase/auth.adapter';

// Security wrapper functions (placeholder implementations)
async function withIdempotency<T>(fn: () => Promise<T>): Promise<T> {
  // TODO: Implement idempotency for mutations
  return await fn();
}

async function withAudit<T>(fn: () => Promise<T>): Promise<T> {
  // TODO: Implement proper audit logging
  return await fn();
}

async function withRateLimit<T>(fn: () => Promise<T>): Promise<T> {
  // TODO: Implement rate limiting logic
  return await fn();
}

async function withSecurity<T>(fn: () => Promise<T>): Promise<T> {
  // TODO: Implement security checks
  return await fn();
}

export async function signIn(input: SignInInput): Promise<SignInResult> {
  return await withSecurity(async () =>
    await withRateLimit(async () =>
      await withAudit(async () =>
        await withIdempotency(async () => {
          // Validate input with Zod schema
          const validation = signInSchema.safeParse(input);

          if (!validation.success) {
            return { ok: false, code: 'INVALID_CREDENTIALS', message: AUTH_ERROR_MESSAGE };
          }

          // Call infrastructure layer
          const result = await signInInfra(validation.data);

          // Filter internal error details for UI - always return generic message
          if (!result.ok) {
            // TODO: Log the actual error code for audit purposes

            return {
              ok: false,
              code: result.code,
              message: AUTH_ERROR_MESSAGE
            };
          }

          return result;
        })
      )
    )
  );
}