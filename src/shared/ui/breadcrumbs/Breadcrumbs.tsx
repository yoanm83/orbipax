"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function segTitle(seg: string) {
  return seg.replace(/[-_]/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export function Breadcrumbs() {
  const pathname = usePathname() || "/";
  // Remove route group markers like /(app)
  const cleaned = pathname.replace(/^\/\((app|public)\)/, "");
  const parts = cleaned.split("/").filter(Boolean);

  const items = [{ href: "/(app)", label: "Home" }, ...parts.map((_, i, arr) => {
    const href = "/(app)" + "/" + arr.slice(0, i + 1).join("/");
    const label = segTitle(arr[i] || "");
    return { href, label };
  })];

  return (
    <nav aria-label="Breadcrumb" className="text-sm" role="navigation">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, idx) => {
          const last = idx === items.length - 1;
          return (
            <li key={it.href} className="flex items-center gap-1">
              {idx > 0 && <span aria-hidden="true" className="opacity-60">/</span>}
              {last ? (
                <span aria-current="page" className="font-medium">
                  {it.label}
                </span>
              ) : (
                <Link
                  href={it.href}
                  className="underline focus:outline-none focus-visible:ring-2 ring-[var(--focus)] rounded"
                >
                  {it.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}