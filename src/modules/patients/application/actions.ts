"use server";

import { z } from "zod";

import { resolveUserAndOrg } from "@/shared/lib/current-user.server";
import { getServiceClient } from "@/shared/lib/supabase.server";

export type ListPatientsInput = { q?: string; limit?: number; offset?: number };
export type PatientRow = { id: string; first_name: string; last_name: string; dob: string | null };

export async function listPatients(input: ListPatientsInput = {}): Promise<{ items: PatientRow[]; total: number }> {
  const { organizationId } = await resolveUserAndOrg();
  const { q = "", limit = 20, offset = 0 } = input;
  const sb = getServiceClient();

  let query = sb.from("orbipax.patients").select("id,first_name,last_name,dob", { count: "exact" })
    .eq("organization_id", organizationId)
    .order("last_name", { ascending: true })
    .order("first_name", { ascending: true })
    .range(offset, offset + Math.max(0, limit - 1));

  if (q) {
    query = query.ilike("last_name", `%${q}%`);
  }

  const { data, error, count } = await query;
  if (error) {throw error;}
  return { items: (data ?? []) as PatientRow[], total: count ?? 0 };
}

export type CreateAppointmentInput = {
  patientId: string;
  clinicianId: string;
  startsAt: string; // ISO
  endsAt: string;   // ISO
  reason?: string;
  location?: string;
};

export async function createAppointment(input: CreateAppointmentInput): Promise<{ ok: boolean; id?: string }> {
  const { organizationId, userId } = await resolveUserAndOrg();
  const sb = getServiceClient();

  const { data, error } = await sb.from("orbipax.appointments").insert({
    organization_id: organizationId,
    patient_id: input.patientId,
    clinician_id: input.clinicianId,
    starts_at: input.startsAt,
    ends_at: input.endsAt,
    status: "scheduled",
    location: input.location ?? null,
    reason: input.reason ?? null,
    created_by: userId,
  }).select("id").maybeSingle();

  if (error) {
    // Likely overlap constraint or RLS violation
    return { ok: false };
  }
  return { ok: true, id: data?.id as string | undefined };
}

const patientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dob: z.string().optional(),   // ISO date
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

export async function createPatient(input: unknown) {
  const parsed = patientSchema.safeParse(input);
  if (!parsed.success) {return { ok: false, error: "invalid_input" };}
  const { firstName, lastName, dob, phone, email } = parsed.data;

  const { organizationId, userId } = await resolveUserAndOrg();
  const sb = getServiceClient();

  const { data, error } = await sb.from("orbipax.patients").insert({
    organization_id: organizationId,
    created_by: userId,
    first_name: firstName,
    last_name: lastName,
    dob: dob ?? null,
    phone: phone ?? null,
    email: email ?? null,
  }).select("id").maybeSingle();

  if (error || !data?.id) {return { ok: false, error: "create_failed" };}

  // audit
  await sb.from("orbipax.audit_logs").insert({
    organization_id: organizationId,
    actor_user_id: userId,
    action: "create",
    subject_type: "patient",
    subject_id: data.id,
    route: "/(app)/patients/new",
    method: "POST",
    meta: {}
  });

  return { ok: true, id: data.id as string };
}

export async function updatePatient(id: string, input: unknown) {
  if (!id) {return { ok: false, error: "missing_id" };}
  const parsed = patientSchema.partial().safeParse(input);
  if (!parsed.success) {return { ok: false, error: "invalid_input" };}

  const { organizationId, userId } = await resolveUserAndOrg();
  const sb = getServiceClient();

  const patch: Record<string, unknown> = {};
  const map = { firstName: "first_name", lastName: "last_name", dob: "dob", phone: "phone", email: "email" } as const;
  for (const [k, v] of Object.entries(parsed.data)) {
    patch[map[k as keyof typeof map]] = v ?? null;
  }

  const { error } = await sb.from("orbipax.patients")
    .update(patch)
    .eq("organization_id", organizationId)
    .eq("id", id);

  if (error) {return { ok: false, error: "update_failed" };}

  await sb.from("orbipax.audit_logs").insert({
    organization_id: organizationId,
    actor_user_id: userId,
    action: "update",
    subject_type: "patient",
    subject_id: id,
    route: "/(app)/patients/[id]/edit",
    method: "POST",
    meta: {}
  });

  return { ok: true, id };
}