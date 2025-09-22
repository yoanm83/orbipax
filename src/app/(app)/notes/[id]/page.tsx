"use client";

import { redirect } from "next/navigation";
import { getNote, saveNote, signNote, amendNote, autoSaveNote, exportNotePdf } from "@/modules/notes/application/notes.actions";
import { useEffect, useState, useRef, useCallback } from "react";

interface NotePageProps {
  params: {
    id: string;
  };
}

export default function NotePage({ params }: NotePageProps) {
  const noteId = params.id;
  const [note, setNote] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load note data
  useEffect(() => {
    async function loadNote() {
      try {
        const noteData = await getNote(noteId);
        if (!noteData) {
          window.location.href = "/(app)/appointments";
          return;
        }
        setNote(noteData);
      } catch (error) {
        console.error("Failed to load note:", error);
        window.location.href = "/(app)/appointments";
      } finally {
        setLoading(false);
      }
    }
    loadNote();
  }, [noteId]);

  // Determine note state
  const isDraft = note?.status === "draft";
  const isSigned = note?.status === "signed";
  const isAmended = note?.status === "amended";
  const isReadOnly = isSigned;

  // Debounced auto-save function
  const debouncedAutoSave = useCallback(async (title: string, content: string) => {
    if (!isDraft || !note) return;

    setSaveStatus('saving');

    try {
      const result = await autoSaveNote({
        id: noteId,
        title: title || undefined,
        content: content || undefined,
      });

      if (result.ok) {
        setSaveStatus('saved');
        setLastSaved(new Date());

        // Reset to idle after 3 seconds
        setTimeout(() => {
          setSaveStatus('idle');
        }, 3000);
      }
    } catch (error) {
      console.error("Auto-save failed:", error);
      setSaveStatus('idle');
    }
  }, [noteId, isDraft, note]);

  // Handle input changes with debouncing
  const handleInputChange = useCallback(() => {
    if (!isDraft) return;

    // Clear existing timeout
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }

    // Set new timeout for auto-save
    autoSaveTimeoutRef.current = setTimeout(() => {
      const title = titleRef.current?.value || '';
      const content = contentRef.current?.value || '';
      debouncedAutoSave(title, content);
    }, 2500); // 2.5 second debounce
  }, [isDraft, debouncedAutoSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="bg-gray-200 rounded-lg h-96"></div>
        </div>
      </div>
    );
  }

  if (!note) {
    return null;
  }

  const handleSaveNote = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    try {
      const result = await saveNote({
        id: noteId,
        title: title?.trim() || undefined,
        content: content?.trim() || undefined,
      });

      if (result.error) {
        console.error("Failed to save note:", result.error);
        throw new Error(result.error);
      }

      console.log("Note saved successfully");
      window.location.href = `/(app)/notes/${noteId}`;

    } catch (error) {
      console.error("Failed to save note:", error);
      throw error;
    }
  };

  const handleSignNote = async () => {
    try {
      const result = await signNote(noteId);

      if (result.error) {
        if (result.error === "forbidden") {
          throw new Error("You do not have permission to sign notes. Only supervisors can sign notes.");
        } else if (result.error === "already_signed") {
          throw new Error("This note has already been signed.");
        } else if (result.error === "not_found") {
          throw new Error("Note not found.");
        }
        throw new Error(result.error);
      }

      console.log("Note signed successfully");
      window.location.href = `/(app)/notes/${noteId}`;

    } catch (error) {
      console.error("Failed to sign note:", error);
      throw error;
    }
  };

  const handleAmendNote = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    try {
      const result = await amendNote({
        id: noteId,
        title: title?.trim() || undefined,
        content: content?.trim() || undefined,
      });

      if (result.error) {
        console.error("Failed to amend note:", result.error);
        throw new Error(result.error);
      }

      if (!result.amendedNoteId) {
        throw new Error("Amendment created but no ID returned");
      }

      console.log("Note amended successfully:", result.amendedNoteId);
      window.location.href = `/(app)/notes/${result.amendedNoteId}`;

    } catch (error) {
      console.error("Failed to amend note:", error);
      throw error;
    }
  };

  const handleExportPdf = async () => {
    try {
      const result = await exportNotePdf({ noteId });

      if (result.error) {
        console.error("Failed to export PDF:", result.error);
        alert(`Failed to export PDF: ${result.error}`);
        return;
      }

      if (result.documentId) {
        console.log("PDF exported successfully:", result.documentId);
        alert("PDF exported successfully and archived!");
      }

    } catch (error) {
      console.error("Failed to export PDF:", error);
      alert("Failed to export PDF. Please try again.");
    }
  };

  // Format dates for display
  const createdDate = new Date(note.created_at);
  const signedDate = note.signed_at ? new Date(note.signed_at) : null;
  const updatedDate = note.updated_at ? new Date(note.updated_at) : null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <a
            href="/(app)/appointments"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            ← Back to Appointments
          </a>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Progress Note</h1>
            <p className="text-gray-600 mt-1">Clinical documentation</p>
          </div>
          <div className="text-right flex items-center gap-4">
            {/* Auto-save status indicator */}
            {isDraft && (
              <div className="text-sm text-gray-600">
                {saveStatus === 'saving' && (
                  <span className="text-blue-600">Saving...</span>
                )}
                {saveStatus === 'saved' && lastSaved && (
                  <span className="text-green-600">
                    Saved • {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                )}
              </div>
            )}
            <div className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
              isDraft
                ? "bg-yellow-100 text-yellow-800"
                : isSigned
                ? "bg-green-100 text-green-800"
                : isAmended
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}>
              {note.status.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Note Metadata */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Note Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <p><strong>Type:</strong> {note.note_type}</p>
            <p><strong>Created:</strong> {createdDate.toLocaleString()}</p>
            {updatedDate && <p><strong>Last Updated:</strong> {updatedDate.toLocaleString()}</p>}
            {note.amended_from && <p><strong>Amendment of:</strong> {note.amended_from}</p>}
          </div>
          <div>
            <p><strong>Author:</strong> {note.author_name || note.author_user_id}</p>
            {signedDate && <p><strong>Signed:</strong> {signedDate.toLocaleString()}</p>}
            {note.signed_by && <p><strong>Signed by:</strong> {note.signer_name || note.signed_by}</p>}
            <p><strong>Patient:</strong> {note.patient_name || note.patient_id}</p>
          </div>
        </div>
      </div>

      {/* Note Editor */}
      <form action={isDraft ? handleSaveNote : handleAmendNote} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">
            {isDraft ? "Edit Note" : isAmended ? "Amendment" : "View Note"}
          </h2>

          {/* Title Field */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              ref={titleRef}
              defaultValue={note.title}
              disabled={isReadOnly}
              onChange={handleInputChange}
              className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isReadOnly ? "bg-gray-100 text-gray-500" : ""
              }`}
              placeholder="Note title"
            />
          </div>

          {/* Content Field */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              id="content"
              name="content"
              ref={contentRef}
              rows={12}
              defaultValue={note.content}
              disabled={isReadOnly}
              onChange={handleInputChange}
              className={`w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                isReadOnly ? "bg-gray-100 text-gray-500" : ""
              }`}
              placeholder="Enter note content..."
            />
          </div>

          {/* Read-only notice */}
          {isReadOnly && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Read Only
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      This note has been signed and is now read-only. To make changes, create an amendment using the "Amend Note" button below.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {isDraft && (
            <>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={() => {
                  if (confirm("Are you sure you want to sign this note? Once signed, it cannot be edited directly.")) {
                    handleSignNote();
                  }
                }}
                className="bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Sign Note
              </button>
            </>
          )}

          {isSigned && (
            <>
              <button
                type="submit"
                className="bg-orange-600 text-white px-6 py-3 rounded-md font-medium hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                onClick={(e) => {
                  if (!confirm("Are you sure you want to create an amendment to this note? This will create a new version.")) {
                    e.preventDefault();
                  }
                }}
              >
                Amend Note
              </button>
              <button
                type="button"
                onClick={handleExportPdf}
                className="bg-purple-600 text-white px-6 py-3 rounded-md font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                Export PDF
              </button>
            </>
          )}

          <a
            href="/(app)/appointments"
            className="bg-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Back to Appointments
          </a>
        </div>

        {/* Status-specific notices */}
        {isDraft && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Draft Note
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>This note is in draft status and can be edited</li>
                    <li>Changes are automatically saved after 2-3 seconds of inactivity</li>
                    <li>You can also save manually using the "Save Draft" button</li>
                    <li>Once signed, the note becomes read-only</li>
                    <li>Only supervisors can sign notes</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {isSigned && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Signed Note
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>This note has been digitally signed and is legally binding</li>
                    <li>The content cannot be modified directly</li>
                    <li>To make changes, create an amendment</li>
                    <li>You can export this note as a PDF for archival and sharing</li>
                    <li>All amendments are tracked and audited</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {isAmended && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Amendment Note
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc list-inside space-y-1">
                    <li>This is an amendment to a previously signed note</li>
                    <li>The original note remains unchanged and accessible</li>
                    <li>This amendment can be edited until signed</li>
                    <li>All amendments maintain a complete audit trail</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}