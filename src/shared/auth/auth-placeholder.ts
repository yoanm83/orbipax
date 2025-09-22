/**
 * Auth Placeholder Utilities
 *
 * DEMO ONLY: Uses simple cookie-based authentication for UI prototyping.
 * Production: Replace with proper Application layer auth service integration.
 *
 * SoC Compliance: UI layer only - no business logic, secrets, or external calls.
 */

/**
 * Check if user is authenticated (client-side only)
 * Uses placeholder cookie "opx_auth=1" for demo purposes
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') {return false;}

  const cookies = document.cookie.split(';');
  return cookies.some(cookie =>
    cookie.trim().startsWith('opx_auth=1')
  );
}

/**
 * Set authentication cookie (demo purposes)
 * Production: This would be handled by secure HttpOnly cookies from server
 */
export function setAuthCookie(): void {
  if (typeof window === 'undefined') {return;}

  // Demo: 1 hour expiry
  const expires = new Date();
  expires.setHours(expires.getHours() + 1);

  document.cookie = `opx_auth=1; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
}

/**
 * Clear authentication cookie
 */
export function clearAuthCookie(): void {
  if (typeof window === 'undefined') {return;}

  document.cookie = 'opx_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict';
}