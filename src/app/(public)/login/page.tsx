'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setAuthCookie } from '@/shared/auth/auth-placeholder';

/**
 * Login Page (Demo Implementation)
 *
 * Handles user authentication with placeholder cookie system.
 * Supports next parameter for post-login redirect preservation.
 *
 * SoC Compliance: UI layer only - no business logic, uses shared auth utilities.
 */
export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const nextPath = searchParams.get('next') || '/(app)';

  const handleLogin = async () => {
    setIsLoading(true);

    // Demo: Simulate login process
    await new Promise(resolve => setTimeout(resolve, 500));

    // Set auth cookie and redirect
    setAuthCookie();
    router.push(decodeURIComponent(nextPath));
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold">Sign In</h1>
          <p className="opacity-75">
            Access your OrbiPax dashboard
          </p>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="demo@orbipax.com"
              className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--input)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              defaultValue="demo@orbipax.com"
              disabled
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-[var(--border)] rounded-md bg-[var(--input)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
              defaultValue="demo123"
              disabled
            />
          </div>

          <div className="pt-2">
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="w-full bg-[var(--primary)] text-[var(--primary-fg)] py-2 px-4 rounded-md font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In (Demo)'}
            </button>
          </div>

          <div className="text-center text-sm opacity-75">
            <p>This is a demo login. Click "Sign In" to continue.</p>
          </div>
        </div>

        <div className="text-center">
          <a
            href="/(public)"
            className="text-sm text-[var(--primary)] hover:underline"
          >
            ← Back to homepage
          </a>
        </div>
      </div>
    </div>
  );
}