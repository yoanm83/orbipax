import "server-only";
import { cookies } from "next/headers";

import { getServiceClient } from "./supabase.server";

export async function resolveUserAndOrg(): Promise<{ userId: string; organizationId: string }> {
  // DEV bridge: try header cookie "opx_uid" if no auth context (local only)
  const jar = await cookies();
  const devUid = jar.get("opx_uid")?.value;
  const userId = devUid ?? ""; // empty means: we will fallback to single-org logic

  const sb = getServiceClient();

  if (userId) {
    const { data, error } = await sb
      .from("orbipax.user_profiles")
      .select("organization_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) {throw error;}
    if (!data?.organization_id) {throw new Error("No organization for given user.");}
    return { userId, organizationId: data.organization_id as string };
  }

  // Fallback: single-tenant dev mode (first org) — for local preview only
  const { data: org } = await sb.from("orbipax.organizations").select("id").limit(1).maybeSingle();
  if (!org?.id) {throw new Error("No organizations found.");}
  return { userId: "DEV-NOAUTH", organizationId: org.id as string };
}