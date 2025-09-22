"use client";

import * as React from "react";

export function AppProviders({ children }: { children: React.ReactNode }) {
  // Theme toggling, focus-visible polyfills, etc. can be wired here later.
  React.useEffect(() => {
    // Respect prefers-reduced-motion & any future a11y bootstraps
  }, []);
  return <>{children}</>;
}