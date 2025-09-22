"use client";

interface ToolbarProps {
  title: string;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  primaryAction?: {
    text: string;
    href: string;
  };
}

export default function Toolbar({
  title,
  searchPlaceholder = "Search...",
  onSearch,
  primaryAction,
}: ToolbarProps) {
  return (
    <div className="flex items-center justify-between gap-4 pb-4">
      <h1 className="text-2xl font-semibold">{title}</h1>

      <div className="flex items-center gap-3">
        {onSearch && (
          <input
            type="search"
            placeholder={searchPlaceholder}
            className="px-3 py-2 border border-[var(--border)] rounded focus:outline-none focus-visible:ring-2 ring-[var(--focus)]"
            onChange={(e) => onSearch(e.target.value)}
            aria-label={searchPlaceholder}
          />
        )}

        {primaryAction && (
          <a
            href={primaryAction.href}
            className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-fg)] rounded hover:opacity-90 focus:outline-none focus-visible:ring-2 ring-[var(--focus)]"
          >
            {primaryAction.text}
          </a>
        )}
      </div>
    </div>
  );
}