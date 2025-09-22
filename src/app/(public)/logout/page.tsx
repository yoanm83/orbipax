'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuthCookie } from '@/shared/auth/auth-placeholder';

/**
 * Logout Page (Demo Implementation)
 *
 * Handles user logout by clearing authentication cookie and redirecting.
 *
 * SoC Compliance: UI layer only - uses shared auth utilities, no business logic.
 */
export default function LogoutPage() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(true);

  useEffect(() => {
    const performLogout = async () => {
      // Demo: Brief delay for UX
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Clear auth cookie
      clearAuthCookie();

      // Redirect to homepage
      router.push('/(public)');
    };

    performLogout();
  }, [router]);

  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full mx-auto"></div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">Signing out...</h1>
          <p className="opacity-75">
            You will be redirected shortly.
          </p>
        </div>
      </div>
    </div>
  );
}