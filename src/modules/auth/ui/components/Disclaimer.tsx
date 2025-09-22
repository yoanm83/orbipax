'use client';

import Link from 'next/link';

export function Disclaimer() {
  return (
    <p className="text-center text-xs text-on-muted">
      By clicking Sign In, you agree to our{" "}
      <Link href="/terms" className="text-on-muted hover:text-fg transition-colors font-semibold no-underline">Terms of Service</Link>
      {" "}and have read our{" "}
      <Link href="/privacy" className="text-on-muted hover:text-fg transition-colors font-semibold no-underline">Privacy Policy</Link>.
    </p>
  );
}