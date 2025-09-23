export type SignInInput = {
  email: string;
  password: string;
  remember?: boolean | undefined;
};

import type { AuthErrorCode } from '../errors/auth.errors';

export type SignInResult =
  | { ok: true; userId: string }
  | { ok: false; code: AuthErrorCode; message: string };