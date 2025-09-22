'use client';

import Link from 'next/link';

export function LoginFooter() {
  return (
    <footer className="mt-6 sm:mt-8 text-center text-xs text-on-muted space-y-3 sm:space-y-4">
      <p>This platform maintains strict adherence to HIPAA regulations. Access is restricted to authorized users only.</p>
      <p>© 2025 OrbiPax Medical Platform. All rights reserved.</p>
      <div className="space-x-4">
        <Link href="/terms" className="text-primary hover:text-primary/80">Terms</Link>
        <Link href="/privacy" className="text-primary hover:text-primary/80">Privacy</Link>
        <Link href="/help" className="text-primary hover:text-primary/80">Help</Link>
      </div>
    </footer>
  );
}