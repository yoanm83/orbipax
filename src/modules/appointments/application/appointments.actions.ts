"use server";

import { z } from "zod";
import { getServiceClient } from "@/shared/lib/supabase.server";
import { resolveUserAndOrg } from "@/shared/lib/current-user.server";

const createAppointmentSchema = z.object({
  patientId: z.string().uuid("Patient ID must be a valid UUID"),
  clinicianId: z.string().uuid("Clinician ID must be a valid UUID"),
  startsAt: z.string().datetime("Start time must be a valid ISO datetime"),
  endsAt: z.string().datetime("End time must be a valid ISO datetime"),
  location: z.string().optional(),
  reason: z.string().optional(),
});

const cancelAppointmentSchema = z.object({
  id: z.string().uuid("Appointment ID must be a valid UUID"),
});

const rescheduleAppointmentSchema = z.object({
  id: z.string().uuid("Appointment ID must be a valid UUID"),
  startsAt: z.string().datetime("Start time must be a valid ISO datetime"),
  endsAt: z.string().datetime("End time must be a valid ISO datetime"),
});

export type ApptRow = {
  id: string;
  patient_id: string;
  clinician_id: string;
  starts_at: string;
  ends_at: string;
  status: string;
  location: string | null;
  reason: string | null;
  created_at: string;
  // Joined data for display
  patient_name?: string;
  clinician_name?: string;
};

export type ListAppointmentsInput = {
  patientId?: string;
  clinicianId?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
};

export async function listAppointments(input: ListAppointmentsInput = {}): Promise<{ items: ApptRow[]; total: number }> {
  const { patientId, clinicianId, dateFrom, dateTo, page = 1, pageSize = 20 } = input;
  const { organizationId } = await resolveUserAndOrg();
  const sb = getServiceClient();

  // Calculate offset for pagination
  const offset = (page - 1) * pageSize;

  // Build base query with RLS (organization_id filter handled by RLS)
  let query = sb
    .from("orbipax_core.appointments")
    .select(`
      id,
      patient_id,
      clinician_id,
      starts_at,
      ends_at,
      status,
      location,
      reason,
      created_at
    `, { count: "exact" })
    .eq("organization_id", organizationId)
    .order("starts_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  // Apply filters
  if (patientId) {
    query = query.eq("patient_id", patientId);
  }

  if (clinicianId) {
    query = query.eq("clinician_id", clinicianId);
  }

  if (dateFrom) {
    query = query.gte("starts_at", dateFrom);
  }

  if (dateTo) {
    // Add one day to dateTo to make it inclusive of the entire day
    const dateToInclusive = new Date(dateTo);
    dateToInclusive.setDate(dateToInclusive.getDate() + 1);
    query = query.lt("starts_at", dateToInclusive.toISOString());
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Failed to list appointments: ${error.message}`);
  }

  return {
    items: (data as ApptRow[]) || [],
    total: count || 0
  };
}

export async function createAppointment(input: {
  patientId: string;
  clinicianId: string;
  startsAt: string;
  endsAt: string;
  location?: string;
  reason?: string;
}): Promise<{ id?: string; error?: string }> {
  // Validate input
  const parsed = createAppointmentSchema.safeParse(input);
  if (!parsed.success) {
    return { error: `Invalid input: ${parsed.error.errors.map(e => e.message).join(", ")}` };
  }

  const { patientId, clinicianId, startsAt, endsAt, location, reason } = parsed.data;

  // Validate that end time is after start time
  if (new Date(endsAt) <= new Date(startsAt)) {
    return { error: "End time must be after start time" };
  }

  const { organizationId, userId } = await resolveUserAndOrg();
  const sb = getServiceClient();

  try {
    // Insert appointment
    const { data: appointmentData, error: appointmentError } = await sb
      .from("orbipax_core.appointments")
      .insert({
        organization_id: organizationId,
        patient_id: patientId,
        clinician_id: clinicianId,
        starts_at: startsAt,
        ends_at: endsAt,
        status: "scheduled",
        location: location || null,
        reason: reason || null,
        created_by: userId,
        created_at: new Date().toISOString()
      })
      .select("id")
      .single();

    if (appointmentError) {
      // Check for overlap constraint violation
      if (appointmentError.code === "23P01" || appointmentError.message.includes("exclude") || appointmentError.message.includes("overlap")) {
        return { error: "overlap" };
      }
      return { error: `Failed to create appointment: ${appointmentError.message}` };
    }

    if (!appointmentData?.id) {
      return { error: "Appointment creation failed - no ID returned" };
    }

    // Insert audit log
    const { error: auditError } = await sb
      .from("orbipax_core.audit_logs")
      .insert({
        organization_id: organizationId,
        actor_user_id: userId,
        action: "create",
        subject_type: "appointment",
        subject_id: appointmentData.id,
        route: "/(app)/appointments/new",
        method: "POST",
        meta: {
          patient_id: patientId,
          clinician_id: clinicianId,
          starts_at: startsAt,
          ends_at: endsAt,
          location: location || null,
          reason: reason || null
        },
        created_at: new Date().toISOString()
      });

    if (auditError) {
      // Log audit error but don't fail the operation
      console.error("Failed to create audit log for appointment creation:", auditError);
    }

    return { id: appointmentData.id };

  } catch (error: any) {
    // Handle unexpected errors
    if (error.code === "23P01" || error.message?.includes("exclude") || error.message?.includes("overlap")) {
      return { error: "overlap" };
    }
    return { error: `Unexpected error: ${error.message}` };
  }
}

export async function cancelAppointment(input: { id: string }): Promise<{ ok?: true; error?: string }> {
  // Validate input
  const parsed = cancelAppointmentSchema.safeParse(input);
  if (!parsed.success) {
    return { error: `Invalid input: ${parsed.error.errors.map(e => e.message).join(", ")}` };
  }

  const { id } = parsed.data;
  const { organizationId, userId } = await resolveUserAndOrg();
  const sb = getServiceClient();

  // First, get the appointment to check if it's in the past
  const { data: appointment, error: fetchError } = await sb
    .from("orbipax_core.appointments")
    .select("id, starts_at, status")
    .eq("id", id)
    .eq("organization_id", organizationId)
    .single();

  if (fetchError) {
    return { error: `Failed to find appointment: ${fetchError.message}` };
  }

  if (!appointment) {
    return { error: "Appointment not found" };
  }

  // Check if appointment is in the past
  if (new Date(appointment.starts_at) < new Date()) {
    return { error: "past_appointment" };
  }

  // Check if already cancelled
  if (appointment.status === "canceled") {
    return { error: "Appointment is already canceled" };
  }

  // Update appointment status to canceled
  const { error: updateError } = await sb
    .from("orbipax_core.appointments")
    .update({
      status: "canceled",
      updated_at: new Date().toISOString()
    })
    .eq("id", id)
    .eq("organization_id", organizationId);

  if (updateError) {
    return { error: `Failed to cancel appointment: ${updateError.message}` };
  }

  // Insert audit log
  const { error: auditError } = await sb
    .from("orbipax_core.audit_logs")
    .insert({
      organization_id: organizationId,
      actor_user_id: userId,
      action: "cancel",
      subject_type: "appointment",
      subject_id: id,
      route: "/(app)/appointments",
      method: "POST",
      meta: {
        previous_status: appointment.status,
        canceled_at: new Date().toISOString()
      },
      created_at: new Date().toISOString()
    });

  if (auditError) {
    // Log audit error but don't fail the operation
    console.error("Failed to create audit log for appointment cancellation:", auditError);
  }

  return { ok: true };
}

export async function rescheduleAppointment(input: {
  id: string;
  startsAt: string;
  endsAt: string;
}): Promise<{ ok?: true; error?: 'overlap' | 'past_appointment' | 'not_found' | 'invalid_range' }> {
  // Validate input
  const parsed = rescheduleAppointmentSchema.safeParse(input);
  if (!parsed.success) {
    return { error: 'invalid_range' };
  }

  const { id, startsAt, endsAt } = parsed.data;

  // Validate that end time is after start time
  if (new Date(endsAt) <= new Date(startsAt)) {
    return { error: 'invalid_range' };
  }

  const { organizationId, userId } = await resolveUserAndOrg();
  const sb = getServiceClient();

  // First, get the appointment to check current state
  const { data: appointment, error: fetchError } = await sb
    .from("orbipax_core.appointments")
    .select("id, starts_at, ends_at, status, patient_id, clinician_id")
    .eq("id", id)
    .eq("organization_id", organizationId)
    .single();

  if (fetchError) {
    return { error: 'not_found' };
  }

  if (!appointment) {
    return { error: 'not_found' };
  }

  // Check if appointment has already started (past_appointment)
  if (new Date(appointment.starts_at) < new Date()) {
    return { error: 'past_appointment' };
  }

  // Check if appointment is canceled
  if (appointment.status === "canceled") {
    return { error: 'not_found' };
  }

  try {
    // Update appointment with new times
    const { error: updateError } = await sb
      .from("orbipax_core.appointments")
      .update({
        starts_at: startsAt,
        ends_at: endsAt,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .eq("organization_id", organizationId);

    if (updateError) {
      // Check for overlap constraint violation
      if (updateError.code === "23P01" || updateError.message.includes("exclude") || updateError.message.includes("overlap")) {
        return { error: "overlap" };
      }
      return { error: 'not_found' };
    }

    // Insert audit log
    const { error: auditError } = await sb
      .from("orbipax_core.audit_logs")
      .insert({
        organization_id: organizationId,
        actor_user_id: userId,
        action: "update",
        subject_type: "appointment",
        subject_id: id,
        route: `/(app)/appointments/${id}/reschedule`,
        method: "POST",
        meta: {
          old_starts_at: appointment.starts_at,
          old_ends_at: appointment.ends_at,
          new_starts_at: startsAt,
          new_ends_at: endsAt,
          rescheduled_at: new Date().toISOString()
        },
        created_at: new Date().toISOString()
      });

    if (auditError) {
      // Log audit error but don't fail the operation
      console.error("Failed to create audit log for appointment reschedule:", auditError);
    }

    return { ok: true };

  } catch (error: any) {
    // Handle unexpected errors
    if (error.code === "23P01" || error.message?.includes("exclude") || error.message?.includes("overlap")) {
      return { error: "overlap" };
    }
    return { error: 'not_found' };
  }
}

// Helper function to get patients for dropdowns
export async function listPatientsForDropdown(): Promise<Array<{ id: string; name: string }>> {
  const { organizationId } = await resolveUserAndOrg();
  const sb = getServiceClient();

  const { data: patients, error } = await sb
    .from("orbipax_core.patients")
    .select("id, first_name, last_name")
    .eq("organization_id", organizationId)
    .order("last_name", { ascending: true });

  if (error) {
    throw new Error(`Failed to list patients: ${error.message}`);
  }

  return (patients || []).map(p => ({
    id: p.id,
    name: `${p.last_name}, ${p.first_name}`
  }));
}

// Helper function to get clinicians for dropdowns
export async function listCliniciansForDropdown(): Promise<Array<{ id: string; name: string }>> {
  const { organizationId } = await resolveUserAndOrg();
  const sb = getServiceClient();

  // For now, return users from the same organization
  // In a real implementation, this would query a clinicians table
  const { data: users, error } = await sb
    .from("orbipax_core.user_profiles")
    .select("user_id, full_name")
    .eq("organization_id", organizationId)
    .not("full_name", "is", null)
    .order("full_name", { ascending: true });

  if (error) {
    throw new Error(`Failed to list clinicians: ${error.message}`);
  }

  return (users || []).map(u => ({
    id: u.user_id,
    name: u.full_name || "Unknown"
  }));
}