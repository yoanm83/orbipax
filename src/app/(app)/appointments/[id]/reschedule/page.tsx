import { redirect } from "next/navigation";
import { rescheduleAppointment, listAppointments } from "@/modules/appointments/application/appointments.actions";

interface RescheduleAppointmentPageProps {
  params: {
    id: string;
  };
}

export default async function RescheduleAppointmentPage({ params }: RescheduleAppointmentPageProps) {
  const appointmentId = params.id;

  // Get the appointment details to pre-populate the form
  const { items: appointments } = await listAppointments({ page: 1, pageSize: 1000 });
  const appointment = appointments.find(appt => appt.id === appointmentId);

  if (!appointment) {
    redirect("/(app)/appointments");
    return null;
  }

  // Check if appointment can be rescheduled
  const startTime = new Date(appointment.starts_at);
  const isPast = startTime < new Date();
  const isCanceled = appointment.status === "canceled";

  if (isPast || isCanceled) {
    redirect("/(app)/appointments");
    return null;
  }

  async function handleRescheduleAppointment(formData: FormData) {
    "use server";

    const date = formData.get("date") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;

    // Validate required fields
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
      const result = await rescheduleAppointment({
        id: appointmentId,
        startsAt,
        endsAt,
      });

      if (result.error) {
        if (result.error === "overlap") {
          throw new Error("This time slot conflicts with an existing appointment. Please choose a different time.");
        } else if (result.error === "past_appointment") {
          throw new Error("Cannot reschedule appointments that have already started.");
        } else if (result.error === "invalid_range") {
          throw new Error("End time must be after start time.");
        } else if (result.error === "not_found") {
          throw new Error("Appointment not found or cannot be rescheduled.");
        }
        throw new Error(result.error);
      }

      console.log("Appointment rescheduled successfully:", result);

    } catch (error) {
      console.error("Failed to reschedule appointment:", error);
      throw error;
    }

    // Redirect to appointments list after successful reschedule
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

  // Extract current date and times for pre-population
  const currentStart = new Date(appointment.starts_at);
  const currentEnd = new Date(appointment.ends_at);
  const currentDate = currentStart.toISOString().split('T')[0];
  const currentStartTime = currentStart.toTimeString().slice(0, 5);
  const currentEndTime = currentEnd.toTimeString().slice(0, 5);

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
        <h1 className="text-3xl font-bold">Reschedule Appointment</h1>
        <p className="text-gray-600 mt-2">Change the date and time for this appointment</p>
      </div>

      {/* Current Appointment Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-medium text-blue-900 mb-2">Current Appointment</h2>
        <div className="text-sm text-blue-800">
          <p><strong>Date:</strong> {currentStart.toLocaleDateString()}</p>
          <p><strong>Time:</strong> {currentStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {currentEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          {appointment.patient_name && <p><strong>Patient:</strong> {appointment.patient_name}</p>}
          {appointment.clinician_name && <p><strong>Clinician:</strong> {appointment.clinician_name}</p>}
          {appointment.location && <p><strong>Location:</strong> {appointment.location}</p>}
        </div>
      </div>

      <form action={handleRescheduleAppointment} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">New Date & Time</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                defaultValue={currentDate}
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
                defaultValue={currentStartTime}
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
                defaultValue={currentEndTime}
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
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Reschedule Appointment
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