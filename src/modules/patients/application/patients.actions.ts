"use server";

import { z } from "zod";

import { resolveUserAndOrg } from "@/shared/lib/current-user.server";
import { getServiceClient } from "@/shared/lib/supabase.server";

const createPatientSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters").max(64, "First name must be at most 64 characters").trim(),
  lastName: z.string().min(2, "Last name must be at least 2 characters").max(64, "Last name must be at most 64 characters").trim(),
  dob: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
});

export type PatientRow = {
  id: string;
  first_name: string;
  last_name: string;
  dob: string | null;
  phone: string | null;
  email: string | null;
  created_at: string;
};

export type ListPatientsInput = {
  q?: string;
  page?: number;
  pageSize?: number;
};

export async function listPatients(input: ListPatientsInput = {}): Promise<{ items: PatientRow[]; total: number }> {
  const { q = "", page = 1, pageSize = 20 } = input;
  const { organizationId } = await resolveUserAndOrg();
  const sb = getServiceClient();

  // Calculate offset for pagination
  const offset = (page - 1) * pageSize;

  // Build base query with RLS (organization_id filter handled by RLS)
  let query = sb
    .from("orbipax_core.patients")
    .select("id, first_name, last_name, dob, phone, email, created_at", { count: "exact" })
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  // Add search filter if provided
  if (q && q.trim()) {
    const searchTerm = `%${q.trim()}%`;
    query = query.or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm}`);
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to list patients: ${error.message}`);
  }

  return {
    items: (data as PatientRow[]) || [],
    total: count || 0
  };
}

export async function createPatient(input: {
  firstName: string;
  lastName: string;
  dob?: string;
  phone?: string;
  email?: string;
}): Promise<{ id: string }> {
  // Validate input
  const parsed = createPatientSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(`Invalid input: ${parsed.error.errors.map(e => e.message).join(", ")}`);
  }

  const { firstName, lastName, dob, phone, email } = parsed.data;
  const { organizationId, userId } = await resolveUserAndOrg();
  const sb = getServiceClient();

  // Insert patient
  const { data: patientData, error: patientError } = await sb
    .from("orbipax_core.patients")
    .insert({
      organization_id: organizationId,
      first_name: firstName,
      last_name: lastName,
      dob: dob || null,
      phone: phone || null,
      email: email || null,
      created_by: userId,
      created_at: new Date().toISOString()
    })
    .select("id")
    .single();

  if (patientError) {
    throw new Error(`Failed to create patient: ${patientError.message}`);
  }

  if (!patientData?.id) {
    throw new Error("Patient creation failed - no ID returned");
  }

  // Insert audit log
  const { error: auditError } = await sb
    .from("orbipax_core.audit_logs")
    .insert({
      organization_id: organizationId,
      actor_user_id: userId,
      action: "create",
      subject_type: "patient",
      subject_id: patientData.id,
      route: "/(app)/patients/new",
      method: "POST",
      meta: {
        first_name: firstName,
        last_name: lastName,
        dob: dob || null,
        phone: phone || null,
        email: email || null
      },
      created_at: new Date().toISOString()
    });

  if (auditError) {
    // Log audit error but don't fail the operation
    console.error("Failed to create audit log for patient creation:", auditError);
  }

  return {
    id: patientData.id
  };
}