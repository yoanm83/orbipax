import PatientForm from "@/modules/patients/ui/PatientForm";

interface EditPatientPageProps {
  params: { patientId: string };
}

export default function EditPatientPage({ params }: EditPatientPageProps) {
  const { patientId } = params;

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
        <h1 className="text-2xl font-semibold">Edit Patient</h1>
        <p className="opacity-75 mt-1">
          Patient ID: <code className="bg-[var(--muted)] px-1 rounded">{patientId}</code>
        </p>
      </div>

      <PatientForm mode="edit" id={patientId} />
    </div>
  );
}