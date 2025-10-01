/**
 * Diagnoses Schema - Step 3
 * OrbiPax Community Mental Health System
 *
 * Validation schema for DSM-5 diagnoses and clinical history
 */

import { z } from 'zod'

// =========================================================================
// SCHEMA DEFINITION
// =========================================================================

/**
 * Diagnoses validation schema
 * Handles DSM-5 diagnoses and mental health history
 */
export const diagnosesSchema = z.object({
  // Primary DSM-5 diagnosis (required)
  primaryDiagnosis: z.string()
    .min(1, 'Primary diagnosis is required')
    .max(255, 'Primary diagnosis must be less than 255 characters')
    .describe('Primary DSM-5 diagnosis'),

  // Secondary diagnoses (optional array)
  secondaryDiagnoses: z.array(
    z.string().max(255, 'Each diagnosis must be less than 255 characters')
  ).optional()
    .describe('Additional DSM-5 diagnoses'),

  // Substance use disorder status
  substanceUseDisorder: z.string()
    .min(1, 'Substance use disorder status is required')
    .describe('Current or history of substance use disorder'),

  // Mental health treatment history
  mentalHealthHistory: z.string()
    .max(2000, 'Mental health history must be less than 2000 characters')
    .optional()
    .describe('Previous mental health treatment history')
})

// =========================================================================
// TYPE EXPORTS
// =========================================================================

export type DiagnosesSchema = z.infer<typeof diagnosesSchema>

// =========================================================================
// VALIDATION HELPERS
// =========================================================================

/**
 * Validates diagnoses data
 */
export function validateDiagnoses(data: unknown) {
  return diagnosesSchema.safeParse(data)
}

/**
 * Checks if diagnoses section is complete
 */
export function isDiagnosesComplete(data: unknown): boolean {
  const result = validateDiagnoses(data)
  return result.success
}

// =========================================================================
// DEFAULT VALUES
// =========================================================================

export const defaultDiagnosesValues: Partial<DiagnosesSchema> = {
  primaryDiagnosis: '',
  secondaryDiagnoses: [],
  substanceUseDisorder: '',
  mentalHealthHistory: ''
}