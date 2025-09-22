import { revalidatePath } from "next/cache";
import { listAccessibleOrganizations, switchOrganization } from "@/modules/organizations/application/organizations.actions";
import { resolveUserAndOrg } from "@/shared/lib/current-user.server";

export async function OrgSwitcher() {
  // Get current user's organization and accessible organizations
  const [{ organizationId: currentOrgId }, organizations] = await Promise.all([
    resolveUserAndOrg(),
    listAccessibleOrganizations()
  ]);

  // Find current organization name
  const currentOrg = organizations.find(org => org.id === currentOrgId);

  async function handleOrgSwitch(formData: FormData) {
    "use server";

    const organizationId = formData.get("organizationId") as string;

    if (!organizationId || organizationId.trim().length === 0) {
      console.error("Organization ID is required");
      return;
    }

    // Don't switch if already on the selected organization
    if (organizationId === currentOrgId) {
      return;
    }

    const result = await switchOrganization({
      organizationId: organizationId.trim()
    });

    if (!result.ok) {
      console.error("Failed to switch organization:", result.error);

      // For membership errors, we could implement a toast system here
      // For now, just log the error as the user should only see orgs they're members of
      if (result.error === 'not_member') {
        console.error("User attempted to switch to non-member organization");
      }
      return;
    }

    // Force refresh of the entire page to update RLS context
    revalidatePath("/", "layout");
  }

  if (organizations.length <= 1) {
    // If user only has access to one organization or none, don't show switcher
    return (
      <div className="text-sm text-gray-600">
        {currentOrg ? currentOrg.name : 'No Organization'}
      </div>
    );
  }

  return (
    <form action={handleOrgSwitch} className="flex items-center">
      <select
        name="organizationId"
        defaultValue={currentOrgId}
        className="text-sm border border-[var(--border)] rounded px-2 py-1 bg-white focus:outline-none focus-visible:ring-2 ring-[var(--focus)] min-w-[140px]"
        onChange="this.form.requestSubmit()"
      >
        {organizations.map((org) => (
          <option key={org.id} value={org.id}>
            {org.name}
          </option>
        ))}
      </select>
    </form>
  );
}