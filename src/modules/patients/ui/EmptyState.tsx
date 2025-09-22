"use client";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  actionHref?: string;
}

export default function EmptyState({
  title,
  description,
  actionText,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="p-8 border border-[var(--border)] rounded text-center space-y-3">
      <div className="space-y-1">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="opacity-80">{description}</p>
      </div>
      {actionText && actionHref && (
        <a
          href={actionHref}
          className="inline-block px-4 py-2 rounded border border-[var(--border)] hover:bg-[var(--muted)] focus:outline-none focus-visible:ring-2 ring-[var(--focus)]"
        >
          {actionText}
        </a>
      )}
    </div>
  );
}