import { redirect } from "next/navigation";
import { startEncounterFromAppointment } from "@/modules/encounters/application/encounters.actions";
import { listAppointments } from "@/modules/appointments/application/appointments.actions";

interface StartEncounterPageProps {
  params: {
    id: string;
  };
}

export default async function StartEncounterPage({ params }: StartEncounterPageProps) {
  const appointmentId = params.id;

  // Get the appointment details to validate access and show info
  const { items: appointments } = await listAppointments({ page: 1, pageSize: 1000 });
  const appointment = appointments.find(appt => appt.id === appointmentId);

  if (!appointment) {
    redirect("/(app)/appointments");
    return null;
  }

  // Check if appointment can have encounter started
  const startTime = new Date(appointment.starts_at);
  const now = new Date();
  const cutoff = new Date(startTime.getTime() + 24 * 60 * 60 * 1000);
  const isTooOld = now > cutoff;
  const isCanceled = appointment.status === "canceled";

  if (isTooOld || isCanceled) {
    redirect("/(app)/appointments");
    return null;
  }

  async function handleStartEncounter(formData: FormData) {
    "use server";

    try {
      const result = await startEncounterFromAppointment({
        appointmentId: appointmentId,
      });

      if (result.error) {
        console.error("Failed to start encounter:", result.error);
        throw new Error(result.error);
      }

      if (!result.noteId) {
        throw new Error("Note ID not returned from encounter creation");
      }

      console.log("Encounter started successfully:", {
        encounterId: result.encounterId,
        noteId: result.noteId
      });

      // Redirect to the created note
      redirect(`/(app)/notes/${result.noteId}`);

    } catch (error) {
      console.error("Failed to start encounter:", error);
      throw error;
    }
  }

  // Format appointment time for display
  const appointmentStart = new Date(appointment.starts_at);
  const appointmentEnd = new Date(appointment.ends_at);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <a
            href="/(app)/appointments"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to Appointments
          </a>
        </div>
        <h1 className="text-3xl font-bold">Start Encounter</h1>
        <p className="text-gray-600 mt-2">Begin a clinical encounter from this appointment</p>
      </div>

      {/* Appointment Details */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-blue-900 mb-4">Appointment Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p><strong>Date:</strong> {appointmentStart.toLocaleDateString()}</p>
            <p><strong>Time:</strong> {appointmentStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {appointmentEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            <p><strong>Status:</strong> {appointment.status}</p>
          </div>
          <div>
            {appointment.patient_name && <p><strong>Patient:</strong> {appointment.patient_name}</p>}
            {appointment.clinician_name && <p><strong>Clinician:</strong> {appointment.clinician_name}</p>}
            {appointment.location && <p><strong>Location:</strong> {appointment.location}</p>}
          </div>
        </div>
        {appointment.reason && (
          <div className="mt-4 text-sm text-blue-800">
            <p><strong>Reason:</strong> {appointment.reason}</p>
          </div>
        )}
      </div>

      {/* Encounter Start Form */}
      <form action={handleStartEncounter} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Start Clinical Encounter</h2>

          <div className="text-sm text-gray-600 mb-6">
            <p>Starting an encounter will:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Create a new clinical encounter record</li>
              <li>Generate a draft progress note for documentation</li>
              <li>Link the encounter to this appointment</li>
              <li>Open the progress note for editing</li>
            </ul>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">What will be created:</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Encounter:</strong> Clinical session record</p>
              <p><strong>Note:</strong> "Session Note" (draft status)</p>
              <p><strong>Patient:</strong> {appointment.patient_name || appointment.patient_id}</p>
              <p><strong>Clinician:</strong> {appointment.clinician_name || appointment.clinician_id}</p>
              <p><strong>Date/Time:</strong> {appointmentStart.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Start Encounter & Create Note
          </button>
          <a
            href="/(app)/appointments"
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </a>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Important Notes
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <ul className="list-disc list-inside space-y-1">
                  <li>This action will create permanent clinical records</li>
                  <li>The encounter will be marked as "in progress"</li>
                  <li>You'll be redirected to the progress note for documentation</li>
                  <li>All actions are logged for audit purposes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}