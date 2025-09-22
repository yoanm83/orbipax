import { getIntakeSnapshot } from "@/modules/intake/application/review.actions";

interface ReviewPageProps {
  params: { patientId: string };
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { patientId } = params;

  const snapshot = await getIntakeSnapshot(patientId);

  if (!snapshot) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Intake Review</h1>
        <p className="text-sm opacity-75">No intake submission yet</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Intake Review</h1>
      <div className="bg-[var(--muted)] p-4 rounded border">
        <pre className="text-sm overflow-auto whitespace-pre-wrap">
          {JSON.stringify(snapshot, null, 2)}
        </pre>
      </div>
    </div>
  );
}