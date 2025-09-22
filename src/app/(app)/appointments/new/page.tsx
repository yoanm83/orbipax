import { redirect } from "next/navigation";
import { createAppointment, listPatientsForDropdown, listCliniciansForDropdown } from "@/modules/appointments/application/appointments.actions";

export default async function NewAppointmentPage() {
  // Load dropdown options via Application layer
  const [patients, clinicians] = await Promise.all([
    listPatientsForDropdown(),
    listCliniciansForDropdown()
  ]);

  async function handleCreateAppointment(formData: FormData) {
    "use server";

    const patientId = formData.get("patientId") as string;
    const clinicianId = formData.get("clinicianId") as string;
    const date = formData.get("date") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const location = formData.get("location") as string;
    const reason = formData.get("reason") as string;

    // Validate required fields
    if (!patientId?.trim()) {
      throw new Error("Patient is required");
    }
    if (!clinicianId?.trim()) {
      throw new Error("Clinician is required");
    }
    if (!date?.trim()) {
      throw new Error("Date is required");
    }
    if (!startTime?.trim()) {
      throw new Error("Start time is required");
    }
    if (!endTime?.trim()) {
      throw new Error("End time is required");
    }

    // Combine date and time into ISO datetime strings
    const startsAt = new Date(`${date}T${startTime}`).toISOString();
    const endsAt = new Date(`${date}T${endTime}`).toISOString();

    try {
      const result = await createAppointment({
        patientId: patientId.trim(),
        clinicianId: clinicianId.trim(),
        startsAt,
        endsAt,
        location: location?.trim() || undefined,
        reason: reason?.trim() || undefined,
      });

      if (result.error) {
        if (result.error === "overlap") {
          throw new Error("This appointment conflicts with an existing appointment. Please choose a different time.");
        }
        throw new Error(result.error);
      }

      console.log("Appointment created successfully:", result);

    } catch (error) {
      console.error("Failed to create appointment:", error);
      throw error;
    }

    // Redirect to appointments list after successful creation
    redirect("/(app)/appointments");
  }

  // Generate time options for dropdowns
  const timeOptions = [];
  for (let hour = 8; hour < 18; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(time);
    }
  }

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
        <h1 className="text-3xl font-bold">New Appointment</h1>
        <p className="text-gray-600 mt-2">Schedule a new appointment</p>
      </div>

      <form action={handleCreateAppointment} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">Appointment Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Patient */}
            <div>
              <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-2">
                Patient *
              </label>
              <select
                id="patientId"
                name="patientId"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a patient</option>
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Clinician */}
            <div>
              <label htmlFor="clinicianId" className="block text-sm font-medium text-gray-700 mb-2">
                Clinician *
              </label>
              <select
                id="clinicianId"
                name="clinicianId"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a clinician</option>
                {clinicians.map((clinician) => (
                  <option key={clinician.id} value={clinician.id}>
                    {clinician.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Start Time */}
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <select
                id="startTime"
                name="startTime"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select start time</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </option>
                ))}
              </select>
            </div>

            {/* End Time */}
            <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <select
                id="endTime"
                name="endTime"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select end time</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {new Date(`2000-01-01T${time}`).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="Room 101, Conference Room A, etc."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Reason */}
            <div className="md:col-span-2">
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Visit
              </label>
              <textarea
                id="reason"
                name="reason"
                rows={3}
                placeholder="Routine checkup, follow-up, consultation, etc."
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Appointment
          </button>
          <a
            href="/(app)/appointments"
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancel
          </a>
        </div>

        <div className="text-sm text-gray-500">
          * Required fields
        </div>

        {/* Conflict Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Scheduling Note
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  The system will automatically check for scheduling conflicts. If there's an overlap with an existing appointment, you'll need to choose a different time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}