import PatientForm from "@/modules/patients/ui/PatientForm";

export default function NewPatientPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <a
          href="/(app)/patients"
          className="text-sm underline focus:outline-none focus-visible:ring-2 ring-[var(--focus)] rounded"
        >
          ← Back to Patients
        </a>
      </div>

      <div>
        <h1 className="text-2xl font-semibold">New Patient</h1>
        <p className="opacity-75 mt-1">Add a new patient to the system</p>
      </div>

      <PatientForm mode="create" />
    </div>
  );
}