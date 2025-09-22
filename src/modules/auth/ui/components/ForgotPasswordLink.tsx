'use client';

import Link from 'next/link';

export function ForgotPasswordLink() {
  return (
    <div className="flex justify-end">
      <Link
        href="/auth/forgot-password"
        className="text-sm font-medium text-on-muted/70 hover:text-on-muted transition-colors no-underline"
      >
        Forgot password?
      </Link>
    </div>
  );
}