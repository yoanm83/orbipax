"use client";

import type { FormEvent } from "react";
import { useState } from "react";

async function actionCreateAppointment(form: FormData) {
  "use server";
  const { createAppointment } = await import("@/modules/patients/application/actions");
  return createAppointment({
    patientId: String(form.get("patientId") || ""),
    clinicianId: String(form.get("clinicianId") || ""),
    startsAt: String(form.get("startsAt") || ""),
    endsAt: String(form.get("endsAt") || ""),
    reason: String(form.get("reason") || ""),
    location: String(form.get("location") || ""),
  });
}

export default function NewAppointmentPage() {
  const [result, setResult] = useState<string>("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const resp = await actionCreateAppointment(fd);
    setResult(resp.ok ? `Created: ${resp.id ?? "ok"}` : "Failed (overlap/RLS?)");
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-3">
      <h1 className="text-2xl font-semibold">New Appointment (demo)</h1>
      <input name="patientId" placeholder="patient uuid" className="w-full rounded border border-[var(--border)] p-2" />
      <input name="clinicianId" placeholder="clinician uuid" className="w-full rounded border border-[var(--border)] p-2" />
      <input name="startsAt" placeholder="2025-09-21T10:00:00Z" className="w-full rounded border border-[var(--border)] p-2" />
      <input name="endsAt" placeholder="2025-09-21T10:50:00Z" className="w-full rounded border border-[var(--border)] p-2" />
      <input name="location" placeholder="Room 1" className="w-full rounded border border-[var(--border)] p-2" />
      <input name="reason" placeholder="Intake" className="w-full rounded border border-[var(--border)] p-2" />
      <button type="submit" className="px-4 py-2 rounded border border-[var(--border)] focus:outline-none focus-visible:ring-2 ring-[var(--focus)]">
        Create
      </button>
      {result && <p className="text-sm opacity-80">{result}</p>}
    </form>
  );
}