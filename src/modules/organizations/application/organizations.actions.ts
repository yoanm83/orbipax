"use server";

import { z } from "zod";

import { resolveUserAndOrg } from "@/shared/lib/current-user.server";
import { createServerClient } from "@/shared/lib/supabase.client";

const createOrganizationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(64, "Name must be at most 64 characters").trim(),
});

const switchOrganizationSchema = z.object({
  organizationId: z.string().uuid("Organization ID must be a valid UUID"),
});

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

export async function createOrganization(input: { name: string }): Promise<{ id: string; slug: string }> {
  // Validate input
  const parsed = createOrganizationSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Invalid input: ${parsed.error.errors.map(e => e.message).join(", ")}`);
  }

  const { name } = parsed.data;
  const sb = await createServerClient();

  // Get current user
  const { userId } = await resolveUserAndOrg();

  // Generate base slug
  const baseSlug = generateSlug(name);

  // Execute transaction using a stored procedure approach
  const { data: result, error: transactionError } = await sb.rpc('create_organization_transaction', {
    p_name: name,
    p_base_slug: baseSlug,
    p_created_by: userId
  });

  if (transactionError) {
    // Fallback to manual transaction if RPC doesn't exist
    return await createOrganizationManual(sb, name, baseSlug, userId);
  }

  if (!result?.organization_id || !result.slug) {
    throw new Error("Organization creation failed - invalid response from transaction");
  }

  return {
    id: result.organization_id,
    slug: result.slug
  };
}

// Manual transaction implementation as fallback
async function createOrganizationManual(sb: any, name: string, baseSlug: string, userId: string): Promise<{ id: string; slug: string }> {
  // Find unique slug
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const { data: existing } = await sb
      .schema('orbipax_core').from('organizations')
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (!existing) {
      break;
    }

    slug = `${baseSlug}-${counter}`;
    counter++;

    // Prevent infinite loops
    if (counter > 100) {
      throw new Error("Unable to generate unique slug after 100 attempts");
    }
  }

  // Execute transaction using pg_exec RPC for atomicity
  const transactionSQL = `
    BEGIN;

    -- Insert organization
    INSERT INTO orbipax_core.organizations (name, slug, created_by, created_at)
    VALUES ('${name.replace(/'/g, "''")}', '${slug}', '${userId}', NOW())
    RETURNING id;

    -- Get the organization ID
    WITH new_org AS (
      SELECT id FROM orbipax_core.organizations WHERE slug = '${slug}' AND created_by = '${userId}'
      ORDER BY created_at DESC LIMIT 1
    )
    -- Upsert user profile
    INSERT INTO orbipax_core.user_profiles (user_id, organization_id, role, updated_at)
    SELECT '${userId}', new_org.id, 'admin', NOW()
    FROM new_org
    ON CONFLICT (user_id)
    DO UPDATE SET
      organization_id = EXCLUDED.organization_id,
      role = 'admin',
      updated_at = NOW();

    -- Insert audit log
    WITH new_org AS (
      SELECT id FROM orbipax_core.organizations WHERE slug = '${slug}' AND created_by = '${userId}'
      ORDER BY created_at DESC LIMIT 1
    )
    INSERT INTO orbipax_core.audit_logs (organization_id, actor_user_id, action, subject_type, subject_id, route, method, meta, created_at)
    SELECT new_org.id, '${userId}', 'create', 'organization', new_org.id, '/onboarding/new-org', 'POST', '{"name": "${name.replace(/'/g, "''")}", "slug": "${slug}"}', NOW()
    FROM new_org;

    COMMIT;

    -- Return result
    SELECT id, slug FROM orbipax_core.organizations WHERE slug = '${slug}' AND created_by = '${userId}' ORDER BY created_at DESC LIMIT 1;
  `;

  try {
    const { data: execResult, error: execError } = await sb.rpc('pg_exec', {
      sql: transactionSQL
    });

    if (execError) {
      throw new Error(`Transaction failed: ${execError.message}`);
    }

    // Extract organization ID and slug from result
    if (execResult && execResult.length > 0) {
      const orgData = execResult[execResult.length - 1]; // Last result should be the SELECT
      return {
        id: orgData.id,
        slug: orgData.slug
      };
    }

    throw new Error("No organization data returned from transaction");

  } catch (error) {
    // If pg_exec doesn't exist, fall back to sequential operations
    return await createOrganizationSequential(sb, name, slug, userId);
  }
}

// Sequential operations fallback (less atomic but functional)
async function createOrganizationSequential(sb: any, name: string, slug: string, userId: string): Promise<{ id: string; slug: string }> {
  // 1. Insert organization
  const { data: orgData, error: orgError } = await sb
    .schema('orbipax_core').from('organizations')
    .insert({
      name,
      slug,
      created_by: userId,
      created_at: new Date().toISOString()
    })
    .select("id")
    .single();

  if (orgError) {
    throw new Error(`Failed to create organization: ${orgError.message}`);
  }

  try {
    // 2. Upsert user profile
    const { error: profileError } = await sb
      .schema('orbipax_core').from('user_profiles')
      .upsert({
        user_id: userId,
        organization_id: orgData.id,
        role: 'admin',
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    if (profileError) {
      throw new Error(`Failed to update user profile: ${profileError.message}`);
    }

    // 3. Insert audit log
    const { error: auditError } = await sb
      .schema('orbipax_core').from('audit_logs')
      .insert({
        organization_id: orgData.id,
        actor_user_id: userId,
        action: 'create',
        subject_type: 'organization',
        subject_id: orgData.id,
        route: '/onboarding/new-org',
        method: 'POST',
        meta: { name, slug },
        created_at: new Date().toISOString()
      });

    if (auditError) {
      // Log but don't fail - audit is important but not critical
      console.error('Failed to create audit log:', auditError);
    }

    return {
      id: orgData.id,
      slug: slug
    };

  } catch (error) {
    // Attempt to cleanup the organization if subsequent operations failed
    try {
      await sb
        .schema('orbipax_core').from('organizations')
        .delete()
        .eq("id", orgData.id);
    } catch (cleanupError) {
      console.error('Failed to cleanup organization after error:', cleanupError);
    }

    throw error;
  }
}

export async function switchOrganization(input: { organizationId: string }): Promise<{ ok: boolean; id?: string; error?: string }> {
  // Validate input
  const parsed = switchOrganizationSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: `Invalid input: ${parsed.error.errors.map(e => e.message).join(", ")}` };
  }

  const { organizationId } = parsed.data;
  const sb = await createServerClient();

  // Get current user
  const { userId } = await resolveUserAndOrg();

  // 1. Verify target organization exists
  const { data: orgData, error: orgError } = await sb
    .schema('orbipax_core').from('organizations')
    .select("id")
    .eq("id", organizationId)
    .maybeSingle();

  if (orgError) {
    return { ok: false, error: `Failed to verify organization: ${orgError.message}` };
  }

  if (!orgData) {
    return { ok: false, error: "Organization not found" };
  }

  // 2. Check membership using DB helper
  const { data: membershipResult, error: membershipError } = await sb.rpc('orbipax_core.is_member', {
    p_org: organizationId
  });

  if (membershipError) {
    return { ok: false, error: `Failed to verify membership: ${membershipError.message}` };
  }

  if (!membershipResult) {
    return { ok: false, error: 'not_member' };
  }

  // 3. Update user profile with new organization_id (preserve full_name and role)
  const { error: profileError } = await sb
    .schema('orbipax_core').from('user_profiles')
    .upsert({
      user_id: userId,
      organization_id: organizationId,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'user_id',
      ignoreDuplicates: false
    });

  if (profileError) {
    return { ok: false, error: `Failed to switch organization: ${profileError.message}` };
  }

  // 4. Insert audit log
  const { error: auditError } = await sb
    .schema('orbipax_core').from('audit_logs')
    .insert({
      organization_id: organizationId,
      actor_user_id: userId,
      action: 'update',
      subject_type: 'organization',
      subject_id: organizationId,
      route: '/onboarding/switch-org',
      method: 'POST',
      meta: { switched_to: organizationId },
      created_at: new Date().toISOString()
    });

  if (auditError) {
    // Log audit error but don't fail the operation
    console.error('Failed to create audit log for organization switch:', auditError);
  }

  return {
    ok: true,
    id: organizationId
  };
}

export async function listAccessibleOrganizations(): Promise<Array<{ id: string; name: string; slug: string }>> {
  const sb = await createServerClient();

  // Use v_my_organizations view to get only organizations where user is a member
  const { data: organizations, error } = await sb
    .schema('orbipax_core').from('v_my_organizations')
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to list organizations: ${error.message}`);
  }

  return organizations || [];
}