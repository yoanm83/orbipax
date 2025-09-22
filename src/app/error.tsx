"use client";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html>
      <body className="p-6">
        <h1 className="text-2xl font-semibold">Something went wrong</h1>
        <p className="mt-2 opacity-90">Please try again. Error ID: {error?.digest ?? "n/a"}</p>
      </body>
    </html>
  );
}