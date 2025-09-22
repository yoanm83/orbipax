"use client";

import { NavLink } from "./NavLink";

export function AppNavbar() {
  // NOTE: Keep routes minimal; modules will extend later.
  return (
    <nav aria-label="Primary" className="flex gap-1 items-center">
      <NavLink href="/(app)">Dashboard</NavLink>
      <NavLink href="/(app)/patients">Patients</NavLink>
      <NavLink href="/(app)/scheduling">Scheduling</NavLink>
      <NavLink href="/(app)/notes">Notes</NavLink>
      <NavLink href="/(app)/billing">Billing</NavLink>
    </nav>
  );
}