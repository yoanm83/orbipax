"use client";

type Props = {
  state?: "empty" | "loading" | "error" | "ready";
  items?: Array<{ id: string; name: string; dob?: string }>;
};

export default function PatientsList({ state = "empty", items = [] }: Props) {
  if (state === "loading") {
    return (
      <div role="status" aria-live="polite" className="p-4">
        Loading patients…
      </div>
    );
  }

  if (state === "error") {
    return (
      <div role="alert" className="p-4 text-[var(--destructive-fg)] bg-[var(--destructive)]/10 rounded">
        Could not load patients.
      </div>
    );
  }

  if (state === "empty" || !items.length) {
    return (
      <div className="p-8 border border-[var(--border)] rounded text-center space-y-2">
        <p className="opacity-80">No patients yet.</p>
        <a
          className="underline focus:outline-none focus-visible:ring-2 ring-[var(--focus)] rounded"
          href="/(app)/patients/new"
        >
          New Patient
        </a>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm" role="table">
        <thead>
          <tr role="row" className="text-left border-b border-[var(--border)]">
            <th scope="col" className="py-2 pr-2">Name</th>
            <th scope="col" className="py-2 pr-2">DOB</th>
            <th scope="col" className="py-2 pr-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} role="row" className="border-b border-[var(--border)]/60">
              <td className="py-2 pr-2">{p.name}</td>
              <td className="py-2 pr-2">{p.dob ?? "—"}</td>
              <td className="py-2">
                <a
                  className="underline focus:outline-none focus-visible:ring-2 ring-[var(--focus)] rounded"
                  href={`/(app)/patients/${p.id}/edit`}
                >
                  Edit
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}