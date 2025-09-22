import { listPatients } from "@/modules/patients/application/patients.actions";

interface PatientsPageProps {
  searchParams: {
    q?: string;
    page?: string;
  };
}

export default async function PatientsPage({ searchParams }: PatientsPageProps) {
  const q = searchParams.q || "";
  const page = parseInt(searchParams.page || "1", 10);
  const pageSize = 20;

  // Load patients via Application layer
  const { items: patients, total } = await listPatients({
    q,
    page,
    pageSize
  });

  const totalPages = Math.ceil(total / pageSize);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Patients</h1>
          <p className="text-gray-600 mt-1">{total} patient{total !== 1 ? 's' : ''} total</p>
        </div>
        <a
          href="/(app)/patients/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          New Patient
        </a>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <form method="GET" className="flex gap-2">
          <input
            type="text"
            name="q"
            placeholder="Search patients..."
            defaultValue={q}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Search
          </button>
          {q && (
            <a
              href="/(app)/patients"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear
            </a>
          )}
        </form>
      </div>

      {/* Patients Table */}
      {patients.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {q ? `No patients found matching "${q}"` : "No patients yet"}
          </p>
          {!q && (
            <a
              href="/(app)/patients/new"
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
            >
              Create your first patient
            </a>
          )}
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date of Birth
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {patients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {patient.first_name} {patient.last_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {patient.dob ? new Date(patient.dob).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div>
                      {patient.phone && <div>{patient.phone}</div>}
                      {patient.email && <div className="text-gray-600">{patient.email}</div>}
                      {!patient.phone && !patient.email && "-"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(patient.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a
                      href={`/(app)/patients/${patient.id}/review`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing page {page} of {totalPages} ({total} total patients)
          </div>
          <div className="flex gap-2">
            {hasPrevPage && (
              <a
                href={`/(app)/patients?${new URLSearchParams({
                  ...(q && { q }),
                  page: (page - 1).toString()
                }).toString()}`}
                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Previous
              </a>
            )}
            {hasNextPage && (
              <a
                href={`/(app)/patients?${new URLSearchParams({
                  ...(q && { q }),
                  page: (page + 1).toString()
                }).toString()}`}
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