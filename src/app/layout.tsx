import { Toaster } from "@/shared/ui/primitives/Toast";

export const metadata = { title: "OrbiPax", description: "Clinical Mental Health App" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-dvh bg-[var(--bg)] text-[var(--fg)] antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}