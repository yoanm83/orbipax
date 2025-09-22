'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { isAuthenticated } from './auth-placeholder';

interface AuthGateProps {
  children: React.ReactNode;
}

/**
 * AuthGate Client Component
 *
 * Protects authenticated routes by redirecting unauthenticated users to login.
 * Preserves current path as 'next' parameter for post-login redirect.
 *
 * SoC Compliance: UI layer only - uses shared auth utilities, no business logic.
 */
export function AuthGate({ children }: AuthGateProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const authed = isAuthenticated();
      setIsAuthed(authed);
      setIsChecking(false);

      if (!authed) {
        // Preserve current path for post-login redirect
        const nextParam = encodeURIComponent(pathname);
        router.push(`/(public)/login?next=${nextParam}`);
      }
    };

    checkAuth();
  }, [pathname, router]);

  // Show loading state while checking authentication
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-dvh">
        <div className="text-center space-y-2">
          <div className="animate-spin w-6 h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full mx-auto"></div>
          <p className="text-sm opacity-75">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Only render children if authenticated
  return isAuthed ? <>{children}</> : null;
}