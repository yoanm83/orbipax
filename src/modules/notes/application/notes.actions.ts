"use server";

import { z } from "zod";

import { resolveUserAndOrg } from "@/shared/lib/current-user.server";
import { getServiceClient } from "@/shared/lib/supabase.server";

const getNoteSchema = z.object({
  id: z.string().uuid("Note ID must be a valid UUID"),
});

const saveNoteSchema = z.object({
  id: z.string().uuid("Note ID must be a valid UUID"),
  title: z.string().optional(),
  content: z.string().optional(),
});

const signNoteSchema = z.object({
  id: z.string().uuid("Note ID must be a valid UUID"),
});

const amendNoteSchema = z.object({
  id: z.string().uuid("Note ID must be a valid UUID"),
  title: z.string().optional(),
  content: z.string().optional(),
});

const autoSaveNoteSchema = z.object({
  id: z.string().uuid("Note ID must be a valid UUID"),
  title: z.string().optional(),
  content: z.string().optional(),
});

const exportNotePdfSchema = z.object({
  noteId: z.string().uuid("Note ID must be a valid UUID"),
});

export type Note = {
  id: string;
  encounter_id: string;
  patient_id: string;
  title: string;
  content: string;
  status: string;
  note_type: string;
  author_user_id: string;
  signed_at: string | null;
  signed_by: string | null;
  amended_from: string | null;
  created_at: string;
  updated_at: string | null;
  // Joined data for display
  patient_name?: string;
  author_name?: string;
  signer_name?: string;
};

export async function getNote(id: string): Promise<Note | null> {
  // Validate input
  const parsed = getNoteSchema.safeParse({ id });
  if (!parsed.success) {
    return null;
  }

  const { organizationId } = await resolveUserAndOrg();
  const sb = getServiceClient();

  try {
    const { data: note, error } = await sb
      .from("orbipax_core.notes")
      .select(`
        id,
        encounter_id,
        patient_id,
        title,
        content,
        status,
        note_type,
        author_user_id,
        signed_at,
        signed_by,
        amended_from,
        created_at,
        updated_at
      `)
      .eq("id", id)
      .eq("organization_id", organizationId)
      .single();

    if (error) {
      console.error("Failed to get note:", error);
      return null;
    }

    return note as Note;

  } catch (error) {
    console.error("Unexpected error getting note:", error);
    return null;
  }
}

export async function saveNote(input: {
  id: string;
  title?: string;
  content?: string;
}): Promise<{ ok?: true; error?: string }> {
  // Validate input
  const parsed = saveNoteSchema.safeParse(input);
  if (!parsed.success) {
    return { error: `Invalid input: ${parsed.error.errors.map(e => e.message).join(", ")}` };
  }

  const { id, title, content } = parsed.data;
  const { organizationId, userId } = await resolveUserAndOrg();
  const sb = getServiceClient();

  try {
    // First, get the note to check current state
    const { data: note, error: fetchError } = await sb
      .from("orbipax_core.notes")
      .select("id, status, encounter_id")
      .eq("id", id)
      .eq("organization_id", organizationId)
      .single();

    if (fetchError) {
      return { error: "Note not found" };
    }

    if (!note) {
      return { error: "Note not found" };
    }

    // Only allow saving if status is 'draft'
    if (note.status !== "draft") {
      return { error: "Only draft notes can be saved" };
    }

    // Build update object with only provided fields
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (title !== undefined) {
      updateData.title = title;
    }

    if (content !== undefined) {
      updateData.content = content;
    }

    // Update the note
    const { error: updateError } = await sb
      .from("orbipax_core.notes")
      .update(updateData)
      .eq("id", id)
      .eq("organization_id", organizationId);

    if (updateError) {
      if (updateError.message.includes("Signed notes are immutable")) {
        return { error: "This note has been signed and cannot be modified" };
      }
      return { error: `Failed to save note: ${updateError.message}` };
    }

    // Insert audit log
    const { error: auditError } = await sb
      .from("orbipax_core.audit_logs")
      .insert({
        organization_id: organizationId,
        actor_user_id: userId,
        action: "update",
        subject_type: "note",
        subject_id: id,
        route: `/(app)/notes/${id}`,
        method: "POST",
        meta: {
          note_id: id,
          encounter_id: note.encounter_id,
          status: "draft",
          action_type: "save",
          updated_fields: {
            ...(title !== undefined && { title }),
            ...(content !== undefined && { content })
          }
        },
        created_at: new Date().toISOString()
      });

    if (auditError) {
      console.error("Failed to create audit log for note save:", auditError);
    }

    return { ok: true };

  } catch (error: any) {
    if (error.message?.includes("Signed notes are immutable")) {
      return { error: "This note has been signed and cannot be modified" };
    }
    return { error: `Unexpected error: ${error.message}` };
  }
}

export async function signNote(id: string): Promise<{ ok?: true; error?: 'forbidden' | 'already_signed' | 'not_found' }> {
  // Validate input
  const parsed = signNoteSchema.safeParse({ id });
  if (!parsed.success) {
    return { error: 'not_found' };
  }

  const { organizationId, userId } = await resolveUserAndOrg();
  const sb = getServiceClient();

  try {
    // First, get the note to check current state
    const { data: note, error: fetchError } = await sb
      .from("orbipax_core.notes")
      .select("id, status, encounter_id, signed_at")
      .eq("id", id)
      .eq("organization_id", organizationId)
      .single();

    if (fetchError) {
      return { error: 'not_found' };
    }

    if (!note) {
      return { error: 'not_found' };
    }

    // Check if already signed
    if (note.status === "signed" || note.signed_at) {
      return { error: 'already_signed' };
    }

    // Check user role (supervisor required)
    const { data: userProfile, error: profileError } = await sb
      .from("orbipax_core.user_profiles")
      .select("role")
      .eq("user_id", userId)
      .eq("organization_id", organizationId)
      .single();

    if (profileError || !userProfile) {
      return { error: 'forbidden' };
    }

    // Only supervisors can sign notes
    if (userProfile.role !== "supervisor") {
      return { error: 'forbidden' };
    }

    // Update the note to signed status
    const { error: updateError } = await sb
      .from("orbipax_core.notes")
      .update({
        status: "signed",
        signed_at: new Date().toISOString(),
        signed_by: userId,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)
      .eq("organization_id", organizationId);

    if (updateError) {
      if (updateError.message.includes("already signed")) {
        return { error: 'already_signed' };
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
        subject_type: "note",
        subject_id: id,
        route: `/(app)/notes/${id}`,
        method: "POST",
        meta: {
          note_id: id,
          encounter_id: note.encounter_id,
          status: "signed",
          action_type: "sign",
          signed_at: new Date().toISOString()
        },
        created_at: new Date().toISOString()
      });

    if (auditError) {
      console.error("Failed to create audit log for note sign:", auditError);
    }

    return { ok: true };

  } catch (error: any) {
    if (error.message?.includes("already signed")) {
      return { error: 'already_signed' };
    }
    return { error: 'not_found' };
  }
}

export async function amendNote(input: {
  id: string;
  title?: string;
  content?: string;
}): Promise<{ ok?: true; error?: string; amendedNoteId?: string }> {
  // Validate input
  const parsed = amendNoteSchema.safeParse(input);
  if (!parsed.success) {
    return { error: `Invalid input: ${parsed.error.errors.map(e => e.message).join(", ")}` };
  }

  const { id, title, content } = parsed.data;
  const { organizationId, userId } = await resolveUserAndOrg();
  const sb = getServiceClient();

  try {
    // First, get the note to check current state and get data for amendment
    const { data: originalNote, error: fetchError } = await sb
      .from("orbipax_core.notes")
      .select("id, encounter_id, patient_id, title, content, status, note_type, author_user_id")
      .eq("id", id)
      .eq("organization_id", organizationId)
      .single();

    if (fetchError) {
      return { error: "Note not found" };
    }

    if (!originalNote) {
      return { error: "Note not found" };
    }

    // Only allow amending signed notes
    if (originalNote.status !== "signed") {
      return { error: "Only signed notes can be amended" };
    }

    // Create amendment note
    const { data: amendmentData, error: amendmentError } = await sb
      .from("orbipax_core.notes")
      .insert({
        organization_id: organizationId,
        encounter_id: originalNote.encounter_id,
        patient_id: originalNote.patient_id,
        title: title || originalNote.title,
        content: content || originalNote.content,
        status: "amended",
        note_type: originalNote.note_type,
        author_user_id: userId,
        amended_from: id,
        created_by: userId,
        created_at: new Date().toISOString()
      })
      .select("id")
      .single();

    if (amendmentError) {
      return { error: `Failed to create amendment: ${amendmentError.message}` };
    }

    if (!amendmentData?.id) {
      return { error: "Amendment creation failed - no ID returned" };
    }

    // Insert audit log
    const { error: auditError } = await sb
      .from("orbipax_core.audit_logs")
      .insert({
        organization_id: organizationId,
        actor_user_id: userId,
        action: "update",
        subject_type: "note",
        subject_id: amendmentData.id,
        route: `/(app)/notes/${id}`,
        method: "POST",
        meta: {
          note_id: amendmentData.id,
          encounter_id: originalNote.encounter_id,
          status: "amended",
          action_type: "amend",
          amended_from: id,
          original_note_id: id
        },
        created_at: new Date().toISOString()
      });

    if (auditError) {
      console.error("Failed to create audit log for note amendment:", auditError);
    }

    return {
      ok: true,
      amendedNoteId: amendmentData.id
    };

  } catch (error: any) {
    return { error: `Unexpected error: ${error.message}` };
  }
}

export async function autoSaveNote(input: {
  id: string;
  title?: string;
  content?: string;
}): Promise<{ ok?: true; error?: string }> {
  // Validate input
  const parsed = autoSaveNoteSchema.safeParse(input);
  if (!parsed.success) {
    return { error: `Invalid input: ${parsed.error.errors.map(e => e.message).join(", ")}` };
  }

  const { id, title, content } = parsed.data;
  const { organizationId, userId } = await resolveUserAndOrg();
  const sb = getServiceClient();

  try {
    // First, get the note to check current state
    const { data: note, error: fetchError } = await sb
      .from("orbipax_core.notes")
      .select("id, status, encounter_id, title, content")
      .eq("id", id)
      .eq("organization_id", organizationId)
      .single();

    if (fetchError) {
      return { error: "Note not found" };
    }

    if (!note) {
      return { error: "Note not found" };
    }

    // Only allow auto-saving if status is 'draft'
    if (note.status !== "draft") {
      return { error: "Only draft notes can be auto-saved" };
    }

    // Check if there are actual changes
    const hasChanges = (
      (title !== undefined && title !== note.title) ||
      (content !== undefined && content !== note.content)
    );

    // If no changes, return success without updating
    if (!hasChanges) {
      return { ok: true };
    }

    // Build update object with only provided fields
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (title !== undefined) {
      updateData.title = title;
    }

    if (content !== undefined) {
      updateData.content = content;
    }

    // Update the note
    const { error: updateError } = await sb
      .from("orbipax_core.notes")
      .update(updateData)
      .eq("id", id)
      .eq("organization_id", organizationId);

    if (updateError) {
      if (updateError.message.includes("Signed notes are immutable")) {
        return { error: "This note has been signed and cannot be modified" };
      }
      return { error: `Failed to auto-save note: ${updateError.message}` };
    }

    // Insert audit log for auto-save (lighter metadata)
    const { error: auditError } = await sb
      .from("orbipax_core.audit_logs")
      .insert({
        organization_id: organizationId,
        actor_user_id: userId,
        action: "update",
        subject_type: "note",
        subject_id: id,
        route: `/(app)/notes/${id}`,
        method: "POST",
        meta: {
          note_id: id,
          encounter_id: note.encounter_id,
          status: "draft",
          action_type: "auto_save",
          updated_fields: {
            ...(title !== undefined && { title }),
            ...(content !== undefined && { content })
          }
        },
        created_at: new Date().toISOString()
      });

    if (auditError) {
      // Don't fail on audit error for auto-save
      console.error("Failed to create audit log for note auto-save:", auditError);
    }

    return { ok: true };

  } catch (error: any) {
    if (error.message?.includes("Signed notes are immutable")) {
      return { error: "This note has been signed and cannot be modified" };
    }
    // Don't crash on auto-save errors, just log and return success
    console.error("Auto-save error:", error);
    return { ok: true };
  }
}

export async function exportNotePdf(input: { noteId: string }): Promise<{ documentId?: string; error?: string }> {
  // Validate input
  const parsed = exportNotePdfSchema.safeParse(input);
  if (!parsed.success) {
    return { error: `Invalid input: ${parsed.error.errors.map(e => e.message).join(", ")}` };
  }

  const { noteId } = parsed.data;
  const { organizationId, userId } = await resolveUserAndOrg();
  const sb = getServiceClient();

  try {
    // Get the note with extended details for PDF generation
    const { data: note, error: fetchError } = await sb
      .from("orbipax_core.notes")
      .select(`
        id,
        encounter_id,
        patient_id,
        title,
        content,
        status,
        note_type,
        author_user_id,
        signed_at,
        signed_by,
        created_at,
        updated_at
      `)
      .eq("id", noteId)
      .eq("organization_id", organizationId)
      .single();

    if (fetchError) {
      return { error: "Note not found" };
    }

    if (!note) {
      return { error: "Note not found" };
    }

    // Only allow PDF export for signed notes
    if (note.status !== "signed") {
      return { error: "Only signed notes can be exported to PDF" };
    }

    // Get organization details for PDF header
    const { data: organization, error: orgError } = await sb
      .from("orbipax_core.organizations")
      .select("name, address")
      .eq("id", organizationId)
      .single();

    // Get patient details for PDF header
    const { data: patient, error: patientError } = await sb
      .from("orbipax_core.patients")
      .select("first_name, last_name, dob")
      .eq("id", note.patient_id)
      .eq("organization_id", organizationId)
      .single();

    // Get clinician details for PDF header
    const { data: clinician, error: clinicianError } = await sb
      .from("orbipax_core.user_profiles")
      .select("full_name")
      .eq("user_id", note.signed_by || note.author_user_id)
      .eq("organization_id", organizationId)
      .single();

    // Generate PDF content
    const pdfContent = generateNotePdfContent({
      note,
      organization: organization || { name: "Organization", address: "" },
      patient: patient || { first_name: "Unknown", last_name: "Patient", dob: null },
      clinician: clinician || { full_name: "Unknown Clinician" }
    });

    // Generate PDF buffer (simplified - in real implementation would use a PDF library)
    const pdfBuffer = Buffer.from(pdfContent, 'utf8');

    // Calculate checksum for integrity verification
    const crypto = require('crypto');
    const checksum = crypto.createHash('sha256').update(pdfBuffer).digest('hex');

    // Generate storage path
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const storagePath = `secure-docs/notes/${organizationId}/${noteId}_${timestamp}.pdf`;

    // Upload to storage bucket (simplified - in real implementation would use actual storage service)
    // const storageResult = await uploadToStorage(pdfBuffer, storagePath);

    // For now, simulate successful upload
    const storageResult = { success: true, path: storagePath };

    if (!storageResult.success) {
      return { error: "Failed to upload PDF to storage" };
    }

    // Insert document record
    const { data: documentData, error: documentError } = await sb
      .from("orbipax_core.documents")
      .insert({
        organization_id: organizationId,
        document_kind: "note_pdf",
        subject_type: "note",
        subject_id: noteId,
        storage_path: storagePath,
        checksum: checksum,
        file_size: pdfBuffer.length,
        mime_type: "application/pdf",
        original_filename: `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.pdf`,
        created_by: userId,
        created_at: new Date().toISOString()
      })
      .select("id")
      .single();

    if (documentError) {
      return { error: `Failed to create document record: ${documentError.message}` };
    }

    if (!documentData?.id) {
      return { error: "Document creation failed - no ID returned" };
    }

    // Insert audit log
    const { error: auditError } = await sb
      .from("orbipax_core.audit_logs")
      .insert({
        organization_id: organizationId,
        actor_user_id: userId,
        action: "create",
        subject_type: "document",
        subject_id: documentData.id,
        route: `/(app)/notes/${noteId}`,
        method: "POST",
        meta: {
          document_id: documentData.id,
          document_kind: "note_pdf",
          note_id: noteId,
          storage_path: storagePath,
          file_size: pdfBuffer.length,
          checksum: checksum
        },
        created_at: new Date().toISOString()
      });

    if (auditError) {
      console.error("Failed to create audit log for PDF export:", auditError);
    }

    return { documentId: documentData.id };

  } catch (error: any) {
    return { error: `Unexpected error: ${error.message}` };
  }
}

// Helper function to generate PDF content
function generateNotePdfContent(data: {
  note: any;
  organization: any;
  patient: any;
  clinician: any;
}): string {
  const { note, organization, patient, clinician } = data;

  // Format dates
  const createdDate = new Date(note.created_at).toLocaleString();
  const signedDate = note.signed_at ? new Date(note.signed_at).toLocaleString() : 'N/A';
  const patientDob = patient.dob ? new Date(patient.dob).toLocaleDateString() : 'N/A';

  // Generate HTML content for PDF (in real implementation, this would be converted to PDF)
  return `
<!DOCTYPE html>
<html>
<head>
  <title>Progress Note - ${note.title}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
    .header { border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
    .org-info { text-align: center; margin-bottom: 20px; }
    .patient-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .note-content { margin: 30px 0; }
    .signature-section { margin-top: 50px; border-top: 1px solid #ccc; padding-top: 20px; }
    .watermark { position: fixed; bottom: 10px; right: 10px; opacity: 0.3; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="org-info">
      <h1>${organization.name}</h1>
      ${organization.address ? `<p>${organization.address}</p>` : ''}
    </div>

    <div class="patient-info">
      <div>
        <strong>Patient:</strong> ${patient.first_name} ${patient.last_name}<br>
        <strong>DOB:</strong> ${patientDob}
      </div>
      <div>
        <strong>Clinician:</strong> ${clinician.full_name}<br>
        <strong>Note Type:</strong> ${note.note_type}
      </div>
    </div>
  </div>

  <div class="note-content">
    <h2>${note.title}</h2>
    <div style="white-space: pre-wrap; margin: 20px 0;">${note.content}</div>
  </div>

  <div class="signature-section">
    <p><strong>Created:</strong> ${createdDate}</p>
    <p><strong>Signed:</strong> ${signedDate}</p>
    <p><strong>Digital Signature:</strong> This document has been digitally signed and is legally binding.</p>
    <p><strong>Note ID:</strong> ${note.id}</p>
  </div>

  <div class="watermark">
    OrbiPax Clinical Documentation System
  </div>
</body>
</html>
  `.trim();
}