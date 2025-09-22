"use client";

import { useState } from "react";

async function actionCreate(data: FormData) {
  "use server";
  const { createPatient } = await import("@/modules/patients/application/actions");
  return createPatient({
    firstName: String(data.get("firstName") || ""),
    lastName: String(data.get("lastName") || ""),
    dob: String(data.get("dob") || ""),
    phone: String(data.get("phone") || ""),
    email: String(data.get("email") || ""),
  });
}

async function actionUpdate(id: string, data: FormData) {
  "use server";
  const { updatePatient } = await import("@/modules/patients/application/actions");
  return updatePatient(id, {
    firstName: String(data.get("firstName") || ""),
    lastName: String(data.get("lastName") || ""),
    dob: String(data.get("dob") || ""),
    phone: String(data.get("phone") || ""),
    email: String(data.get("email") || ""),
  });
}

export default function PatientForm({ mode, id }: { mode: "create" | "edit"; id?: string }) {
  const [msg, setMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const res = mode === "create" ? await actionCreate(fd) : await actionUpdate(id!, fd);
    setMsg(res.ok ? "Saved" : "Failed");
    if (res.ok && mode === "create") {window.location.href = "/(app)/patients";}
  }

  return (
    <form onSubmit={onSubmit} className="max-w-xl space-y-4">
      <div>
        <label htmlFor="firstName" className="block text-sm font-medium">
          First name
        </label>
        <input
          id="firstName"
          name="firstName"
          required
          className="mt-1 w-full rounded border border-[var(--border)] p-2"
        />
      </div>

      <div>
        <label htmlFor="lastName" className="block text-sm font-medium">
          Last name
        </label>
        <input
          id="lastName"
          name="lastName"
          required
          className="mt-1 w-full rounded border border-[var(--border)] p-2"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label htmlFor="dob" className="block text-sm font-medium">
            Date of birth
          </label>
          <input
            id="dob"
            name="dob"
            placeholder="YYYY-MM-DD"
            className="mt-1 w-full rounded border border-[var(--border)] p-2"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            className="mt-1 w-full rounded border border-[var(--border)] p-2"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="mt-1 w-full rounded border border-[var(--border)] p-2"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 rounded border border-[var(--border)] focus:outline-none focus-visible:ring-2 ring-[var(--focus)]"
        >
          {mode === "create" ? "Create Patient" : "Save Changes"}
        </button>
        <a
          href="/(app)/patients"
          className="px-4 py-2 rounded focus:outline-none focus-visible:ring-2 ring-[var(--focus)] underline"
        >
          Cancel
        </a>
      </div>
      {msg && <p className="text-sm opacity-80">{msg}</p>}
    </form>
  );
}