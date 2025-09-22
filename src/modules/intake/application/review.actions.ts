"use server";

import { getServiceClient } from "@/shared/lib/supabase.server";

export async function getIntakeSnapshot(patientId: string) {
  if (!patientId || typeof patientId !== "string" || patientId.trim() === "") {
    throw new Error("Patient ID is required");
  }

  const sb = getServiceClient();

  const { data, error } = await sb.rpc("orbipax_core.get_intake_latest_snapshot", {
    p_patient_id: patientId.trim()
  });

  if (error) {
    throw error;
  }

  return data || null;
}