/**
 * Single source of truth for Diagnosis Type and Severity enums
 * Used by both Application layer (Zod validation) and UI layer (Selects)
 * Ensures 1:1 consistency between OpenAI responses and UI prefill
 */

// Diagnosis Type options (exact values returned by OpenAI)
export const DIAGNOSIS_TYPE = ['Primary', 'Secondary', 'Rule-out'] as const
export type DiagnosisType = typeof DIAGNOSIS_TYPE[number]

// Severity options (exact values returned by OpenAI)
export const DIAGNOSIS_SEVERITY = ['Mild', 'Moderate', 'Severe'] as const
export type DiagnosisSeverity = typeof DIAGNOSIS_SEVERITY[number]

// UI Select options with labels (for rendering in dropdowns)
export const DIAGNOSIS_TYPE_OPTIONS = DIAGNOSIS_TYPE.map(value => ({
  value,
  label: value
}))

export const DIAGNOSIS_SEVERITY_OPTIONS = DIAGNOSIS_SEVERITY.map(value => ({
  value,
  label: value
}))

// Helper to get display label (currently same as value, but extensible)
export function getDiagnosisTypeLabel(type: DiagnosisType): string {
  return type
}

export function getDiagnosisSeverityLabel(severity: DiagnosisSeverity): string {
  return severity
}