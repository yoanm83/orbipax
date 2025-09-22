import { AuthGate } from "@/shared/auth/auth-gate.client";
import { Breadcrumbs } from "@/shared/ui/breadcrumbs/Breadcrumbs";
import { AppNavbar } from "@/shared/ui/nav/AppNavbar";

import { OrgSwitcher } from "@/modules/organizations/ui/OrgSwitcher";

import GlobalsBridge from "../globals-bridge";

export default function AppShellLayout({ children }: { children: React.ReactNode }) {
  return (
    <GlobalsBridge>
      <AuthGate>
        <div className="min-h-dvh grid grid-rows-[auto_auto_1fr_auto]">
          <header className="border-b border-[var(--border)] p-3">
            <div className="container mx-auto flex items-center justify-between">
              <strong className="text-base">OrbiPax</strong>
              <div className="flex items-center gap-6">
                <AppNavbar />
                <div className="flex items-center gap-4">
                  <OrgSwitcher />
                  <nav aria-label="Secondary" className="flex gap-2">
                    <a className="text-sm underline focus:outline-none focus-visible:ring-2 ring-[var(--focus)] rounded" href="/(public)">Public</a>
                    <a className="text-sm underline focus:outline-none focus-visible:ring-2 ring-[var(--focus)] rounded" href="/(public)/logout">Logout</a>
                  </nav>
                </div>
              </div>
            </div>
          </header>

          <div className="border-b border-[var(--border)]">
            <div className="container mx-auto p-3">
              <Breadcrumbs />
            </div>
          </div>

          <main className="container mx-auto p-4 container-safe">{children}</main>

          <footer className="border-t border-[var(--border)] p-3 text-sm opacity-80">
            <div className="container mx-auto">© {new Date().getFullYear()} OrbiPax</div>
          </footer>
        </div>
      </AuthGate>
    </GlobalsBridge>
  );
}