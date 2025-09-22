import { redirect } from "next/navigation";
import { switchOrganization, listAccessibleOrganizations } from "@/modules/organizations/application/organizations.actions";

export default async function SwitchOrgPage() {
  // Get list of accessible organizations via Application layer
  const organizations = await listAccessibleOrganizations();

  async function handleSwitchOrganization(formData: FormData) {
    "use server";

    const organizationId = formData.get("organizationId") as string;

    if (!organizationId || organizationId.trim().length === 0) {
      throw new Error("Organization ID is required");
    }

    const result = await switchOrganization({
      organizationId: organizationId.trim()
    });

    if (!result.ok) {
      // Handle membership and other validation errors
      if (result.error === 'not_member') {
        throw new Error("You are not a member of the selected organization");
      }
      throw new Error(result.error || "Failed to switch organization");
    }

    // Log successful switch
    console.log("Organization switched successfully:", {
      id: result.id,
      organizationId: organizationId.trim()
    });

    // Redirect to dashboard after successful switch
    redirect("/(app)/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Switch Organization</h1>
          <p className="mt-2 text-sm text-gray-600">
            Select an organization to switch to
          </p>
        </div>

        {organizations.length === 0 ? (
          <div className="text-center">
            <p className="text-sm text-gray-500">No organizations available</p>
            <a
              href="/onboarding/new-org"
              className="mt-4 inline-block rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Create New Organization
            </a>
          </div>
        ) : (
          <form action={handleSwitchOrganization} className="space-y-6">
            <div>
              <label htmlFor="organizationId" className="block text-sm font-medium text-gray-700">
                Available Organizations
              </label>
              <div className="mt-1">
                <select
                  id="organizationId"
                  name="organizationId"
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select an organization</option>
                  {organizations.map((org) => (
                    <option key={org.id} value={org.id}>
                      {org.name} ({org.slug})
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Choose the organization you want to switch to
              </p>
            </div>

            <div>
              <button
                type="submit"
                className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Switch Organization
              </button>
            </div>
          </form>
        )}

        <div className="text-center">
          <a
            href="/(app)/dashboard"
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}