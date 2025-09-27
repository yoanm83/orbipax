/**
 * Psychiatric Evaluation Schema - Step 4 Medical Providers
 * OrbiPax Community Mental Health System
 *
 * Validation schema for psychiatric evaluation section
 * Part of Step 4 Medical Providers migration to Zod + Store slices
 */

import { z } from 'zod'
import { validateName, normalizeName, NAME_LENGTHS } from '@/shared/utils/name'

// =================================================================
// PSYCHIATRIC EVALUATION SCHEMA
// =================================================================

/**
 * Psychiatric evaluation data schema with conditional validation
 * If hasEvaluation = 'Yes', evaluationDate and clinicianName are required
 */
export const psychiatricEvaluationSchema = z.object({
  hasEvaluation: z.enum(['Yes', 'No']).describe('Please indicate if psychiatric evaluation was completed'),

  evaluationDate: z.date().optional(),

  clinicianName: z.string()
    .max(NAME_LENGTHS.PROVIDER_NAME, 'Clinician name must not exceed 120 characters')
    .transform(normalizeName)
    .refine(validateName, 'Invalid characters in clinician name')
    .optional(),

  evaluationSummary: z.string()
    .max(300, 'Summary must not exceed 300 characters')
    .optional()
}).refine(
  (data) => {
    // If hasEvaluation is 'Yes', evaluationDate and clinicianName are required
    if (data.hasEvaluation === 'Yes') {
      return !!(data.evaluationDate && data.clinicianName && data.clinicianName.trim().length > 0)
    }
    return true
  },
  {
    message: 'Evaluation date and clinician name are required when evaluation was completed',
    path: ['evaluationDate'] // Shows error on first required field
  }
)

// =================================================================
// TYPE EXPORTS
// =================================================================

/**
 * Inferred TypeScript type from Zod schema
 */
export type PsychiatricEvaluationSchema = z.infer<typeof psychiatricEvaluationSchema>

/**
 * Partial type for UI state (allows incomplete data during editing)
 */
export type PartialPsychiatricEvaluation = Partial<PsychiatricEvaluationSchema>

// =================================================================
// VALIDATION UTILITIES
// =================================================================

/**
 * Validates psychiatric evaluation data using safeParse
 * Returns success/error with detailed validation messages
 */
export function validatePsychiatricEvaluation(data: unknown) {
  return psychiatricEvaluationSchema.safeParse(data)
}

/**
 * Type guard to check if evaluation is complete
 */
export function isEvaluationComplete(data: PartialPsychiatricEvaluation): boolean {
  const result = psychiatricEvaluationSchema.safeParse(data)
  return result.success
}

// =================================================================
// DEFAULT VALUES
// =================================================================

/**
 * Default initial values for psychiatric evaluation form
 */
export const defaultPsychiatricEvaluationValues: PartialPsychiatricEvaluation = {
  hasEvaluation: undefined,
  evaluationDate: undefined,
  clinicianName: '',
  evaluationSummary: ''
}