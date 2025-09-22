"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const active = pathname === href || pathname?.startsWith(href + "/");
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={clsx(
        "px-3 py-2 rounded-md text-sm",
        "focus:outline-none focus-visible:ring-2 ring-[var(--focus)]",
        active
          ? "bg-[var(--accent)] text-[var(--accent-fg)]"
          : "hover:bg-[var(--muted)] hover:text-[var(--fg)]"
      )}
    >
      {children}
    </Link>
  );
}