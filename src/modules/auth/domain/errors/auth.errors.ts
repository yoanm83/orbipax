export type AuthErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'EMAIL_NOT_VERIFIED'
  | 'RATE_LIMIT'
  | 'UNKNOWN';

export const AUTH_ERROR_MESSAGE = 'Invalid email or password';

export type AuthError = {
  code: AuthErrorCode;
  message: string;
  internalMessage?: string; // For logging/audit only, never exposed to UI
};