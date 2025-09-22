import { redirect } from "next/navigation";
import { createOrganization } from "@/modules/organizations/application/organizations.actions";

export default function NewOrgPage() {
  async function handleCreateOrganization(formData: FormData) {
    "use server";

    const name = formData.get("name") as string;

    if (!name || name.trim().length === 0) {
      throw new Error("Organization name is required");
    }

    try {
      const result = await createOrganization({ name: name.trim() });

      // Log successful creation
      console.log("Organization created successfully:", {
        id: result.id,
        slug: result.slug,
        name: name.trim()
      });

    } catch (error) {
      console.error("Failed to create organization:", error);
      throw error;
    }

    // Redirect to dashboard after successful creation
    redirect("/(app)/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Create Organization</h1>
          <p className="mt-2 text-sm text-gray-600">
            Set up your organization to get started with OrbiPax
          </p>
        </div>

        <form action={handleCreateOrganization} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Organization Name
            </label>
            <div className="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                required
                minLength={2}
                maxLength={64}
                placeholder="Enter your organization name"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              2-64 characters. This will be used to generate your organization's unique URL.
            </p>
          </div>

          <div>
            <button
              type="submit"
              className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              Create Organization
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-xs text-gray-500">
            By creating an organization, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}