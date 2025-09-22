"use server";

import { z } from "zod";
import { getServiceClient } from "@/shared/lib/supabase.server";
import { resolveUserAndOrg } from "@/shared/lib/current-user.server";

const startEncounterFromAppointmentSchema = z.object({
  appointmentId: z.string().uuid("Appointment ID must be a valid UUID"),
});

export async function startEncounterFromAppointment(input: {
  appointmentId: string;
}): Promise<{ encounterId?: string; noteId?: string; error?: string }> {
  // Validate input
  const parsed = startEncounterFromAppointmentSchema.safeParse(input);
  if (!parsed.success) {
    return { error: `Invalid input: ${parsed.error.errors.map(e => e.message).join(", ")}` };
  }

  const { appointmentId } = parsed.data;
  const { organizationId, userId } = await resolveUserAndOrg();
  const sb = getServiceClient();

  // Get the appointment to validate and extract details
  const { data: appointment, error: fetchError } = await sb
    .from("orbipax_core.appointments")
    .select("id, patient_id, clinician_id, starts_at, status")
    .eq("id", appointmentId)
    .eq("organization_id", organizationId)
    .single();

  if (fetchError) {
    return { error: `Failed to find appointment: ${fetchError.message}` };
  }

  if (!appointment) {
    return { error: "Appointment not found" };
  }

  // Check if appointment is canceled
  if (appointment.status === "canceled") {
    return { error: "Cannot start encounter for canceled appointment" };
  }

  // Check if appointment is in the past (allow starting if it's current or future)
  const appointmentStart = new Date(appointment.starts_at);
  const now = new Date();
  // Allow starting encounters up to 24 hours after appointment time
  const cutoff = new Date(appointmentStart.getTime() + 24 * 60 * 60 * 1000);

  if (now > cutoff) {
    return { error: "Appointment is too far in the past to start an encounter" };
  }

  try {
    // Create encounter
    const { data: encounterData, error: encounterError } = await sb
      .from("orbipax_core.encounters")
      .insert({
        organization_id: organizationId,
        patient_id: appointment.patient_id,
        clinician_id: appointment.clinician_id,
        appointment_id: appointmentId,
        occurred_at: appointment.starts_at,
        status: "in_progress",
        created_by: userId,
        created_at: new Date().toISOString()
      })
      .select("id")
      .single();

    if (encounterError) {
      return { error: `Failed to create encounter: ${encounterError.message}` };
    }

    if (!encounterData?.id) {
      return { error: "Encounter creation failed - no ID returned" };
    }

    // Create progress note
    const { data: noteData, error: noteError } = await sb
      .from("orbipax_core.notes")
      .insert({
        organization_id: organizationId,
        encounter_id: encounterData.id,
        patient_id: appointment.patient_id,
        title: "Session Note",
        content: "",
        status: "draft",
        note_type: "progress",
        author_user_id: userId,
        created_by: userId,
        created_at: new Date().toISOString()
      })
      .select("id")
      .single();

    if (noteError) {
      // If note creation fails, we should clean up the encounter
      await sb
        .from("orbipax_core.encounters")
        .delete()
        .eq("id", encounterData.id)
        .eq("organization_id", organizationId);

      return { error: `Failed to create note: ${noteError.message}` };
    }

    if (!noteData?.id) {
      // Clean up encounter if note creation failed
      await sb
        .from("orbipax_core.encounters")
        .delete()
        .eq("id", encounterData.id)
        .eq("organization_id", organizationId);

      return { error: "Note creation failed - no ID returned" };
    }

    // Insert audit logs for encounter creation
    const { error: encounterAuditError } = await sb
      .from("orbipax_core.audit_logs")
      .insert({
        organization_id: organizationId,
        actor_user_id: userId,
        action: "create",
        subject_type: "encounter",
        subject_id: encounterData.id,
        route: `/(app)/appointments/${appointmentId}/start`,
        method: "POST",
        meta: {
          appointment_id: appointmentId,
          patient_id: appointment.patient_id,
          clinician_id: appointment.clinician_id,
          occurred_at: appointment.starts_at,
          note_id: noteData.id
        },
        created_at: new Date().toISOString()
      });

    if (encounterAuditError) {
      console.error("Failed to create audit log for encounter creation:", encounterAuditError);
    }

    // Insert audit logs for note creation
    const { error: noteAuditError } = await sb
      .from("orbipax_core.audit_logs")
      .insert({
        organization_id: organizationId,
        actor_user_id: userId,
        action: "create",
        subject_type: "note",
        subject_id: noteData.id,
        route: `/(app)/appointments/${appointmentId}/start`,
        method: "POST",
        meta: {
          appointment_id: appointmentId,
          encounter_id: encounterData.id,
          patient_id: appointment.patient_id,
          title: "Session Note",
          note_type: "progress",
          status: "draft"
        },
        created_at: new Date().toISOString()
      });

    if (noteAuditError) {
      console.error("Failed to create audit log for note creation:", noteAuditError);
    }

    return {
      encounterId: encounterData.id,
      noteId: noteData.id
    };

  } catch (error: any) {
    return { error: `Unexpected error: ${error.message}` };
  }
}