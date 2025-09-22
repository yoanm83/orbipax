import { listAppointments, cancelAppointment, listPatientsForDropdown, listCliniciansForDropdown } from "@/modules/appointments/application/appointments.actions";
import { revalidatePath } from "next/cache";

interface AppointmentsPageProps {
  searchParams: {
    patientId?: string;
    clinicianId?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: string;
  };
}

export default async function AppointmentsPage({ searchParams }: AppointmentsPageProps) {
  const patientId = searchParams.patientId || "";
  const clinicianId = searchParams.clinicianId || "";
  const dateFrom = searchParams.dateFrom || "";
  const dateTo = searchParams.dateTo || "";
  const page = parseInt(searchParams.page || "1", 10);
  const pageSize = 20;

  // Load data via Application layer
  const [{ items: appointments, total }, patients, clinicians] = await Promise.all([
    listAppointments({
      patientId: patientId || undefined,
      clinicianId: clinicianId || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      page,
      pageSize
    }),
    listPatientsForDropdown(),
    listCliniciansForDropdown()
  ]);

  const totalPages = Math.ceil(total / pageSize);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  // Server action for canceling appointments
  async function handleCancelAppointment(formData: FormData) {
    "use server";

    const appointmentId = formData.get("appointmentId") as string;

    if (!appointmentId) {
      console.error("Appointment ID is required");
      return;
    }

    const result = await cancelAppointment({ id: appointmentId });

    if (result.error) {
      console.error("Failed to cancel appointment:", result.error);
      // In a real app, you'd show a toast or error message
      return;
    }

    // Refresh the page to show updated status
    revalidatePath("/(app)/appointments");
  }

  function buildFilterUrl(filters: Record<string, string>) {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      }
    });

    return `/(app)/appointments${params.toString() ? `?${params.toString()}` : ''}`;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Appointments</h1>
          <p className="text-gray-600 mt-1">{total} appointment{total !== 1 ? 's' : ''} total</p>
        </div>
        <a
          href="/(app)/appointments/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          New Appointment
        </a>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Filters</h2>
        <form method="GET" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Patient Filter */}
          <div>
            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-1">
              Patient
            </label>
            <select
              id="patientId"
              name="patientId"
              defaultValue={patientId}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Patients</option>
              {patients.map((patient) => (
                <option key={patient.id} value={patient.id}>
                  {patient.name}
                </option>
              ))}
            </select>
          </div>

          {/* Clinician Filter */}
          <div>
            <label htmlFor="clinicianId" className="block text-sm font-medium text-gray-700 mb-1">
              Clinician
            </label>
            <select
              id="clinicianId"
              name="clinicianId"
              defaultValue={clinicianId}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Clinicians</option>
              {clinicians.map((clinician) => (
                <option key={clinician.id} value={clinician.id}>
                  {clinician.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date From */}
          <div>
            <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              id="dateFrom"
              name="dateFrom"
              defaultValue={dateFrom}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Date To */}
          <div>
            <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              id="dateTo"
              name="dateTo"
              defaultValue={dateTo}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Filter Actions */}
          <div className="md:col-span-2 lg:col-span-4 flex gap-2">
            <button
              type="submit"
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Apply Filters
            </button>
            {(patientId || clinicianId || dateFrom || dateTo) && (
              <a
                href="/(app)/appointments"
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Clear Filters
              </a>
            )}
          </div>
        </form>
      </div>

      {/* Appointments Table */}
      {appointments.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {(patientId || clinicianId || dateFrom || dateTo) ? "No appointments found matching filters" : "No appointments yet"}
          </p>
          {!(patientId || clinicianId || dateFrom || dateTo) && (
            <a
              href="/(app)/appointments/new"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
              Create your first appointment
            </a>
          )}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clinician
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reason
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.map((appointment) => {
                const startTime = new Date(appointment.starts_at);
                const endTime = new Date(appointment.ends_at);
                const isPast = startTime < new Date();
                const canCancel = appointment.status === "scheduled" && !isPast;

                return (
                  <tr key={appointment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {startTime.toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.patient_name || appointment.patient_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.clinician_name || appointment.clinician_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        appointment.status === "scheduled"
                          ? "bg-green-100 text-green-800"
                          : appointment.status === "canceled"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {appointment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {appointment.location || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="max-w-xs truncate" title={appointment.reason || ""}>
                        {appointment.reason || "-"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {canCancel ? (
                        <form action={handleCancelAppointment} className="inline">
                          <input type="hidden" name="appointmentId" value={appointment.id} />
                          <button
                            type="submit"
                            className="text-red-600 hover:text-red-900"
                            onClick={(e) => {
                              if (!confirm("Are you sure you want to cancel this appointment?")) {
                                e.preventDefault();
                              }
                            }}
                          >
                            Cancel
                          </button>
                        </form>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing page {page} of {totalPages} ({total} total appointments)
          </div>
          <div className="flex gap-2">
            {hasPrevPage && (
              <a
                href={buildFilterUrl({
                  patientId,
                  clinicianId,
                  dateFrom,
                  dateTo,
                  page: (page - 1).toString()
                })}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Previous
              </a>
            )}
            {hasNextPage && (
              <a
                href={buildFilterUrl({
                  patientId,
                  clinicianId,
                  dateFrom,
                  dateTo,
                  page: (page + 1).toString()
                })}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Next
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}