/**
 * Psychiatrist / Clinical Evaluator Schema - Step 4 Medical Providers
 * OrbiPax Community Mental Health System
 *
 * Validation schema for Psychiatrist/Clinical Evaluator section
 * Includes conditional validation for different evaluator scenario
 */

import { z } from 'zod'
import { validateName, normalizeName, NAME_LENGTHS } from '@/shared/utils/name'

// =================================================================
// PSYCHIATRIST SCHEMA
// =================================================================

/**
 * Psychiatrist/Clinical Evaluator data schema with conditional validation
 * If hasBeenEvaluated = 'Yes', psychiatristName and evaluationDate are required
 */
export const psychiatristSchema = z.object({
  hasBeenEvaluated: z.enum(['Yes', 'No']).describe('Please indicate if evaluated by a psychiatrist'),

  psychiatristName: z.string()
    .max(NAME_LENGTHS.PROVIDER_NAME, 'Psychiatrist name must not exceed 120 characters')
    .transform(normalizeName)
    .refine(validateName, 'Invalid characters in psychiatrist name')
    .optional(),

  evaluationDate: z.date()
    .optional(),

  clinicName: z.string()
    .max(NAME_LENGTHS.ORGANIZATION_NAME, 'Clinic name must not exceed 120 characters')
    .transform(normalizeName)
    .refine(validateName, 'Invalid characters in clinic name')
    .optional(),

  notes: z.string()
    .max(300, 'Notes must not exceed 300 characters')
    .optional(),

  differentEvaluator: z.boolean()
    .optional(),

  evaluatorName: z.string()
    .max(NAME_LENGTHS.PROVIDER_NAME, 'Evaluator name must not exceed 120 characters')
    .transform(normalizeName)
    .refine(validateName, 'Invalid characters in evaluator name')
    .optional(),

  evaluatorClinic: z.string()
    .max(120, 'Evaluator clinic must not exceed 120 characters')
    .optional()
}).refine(
  (data) => {
    // If hasBeenEvaluated is 'Yes', psychiatristName and evaluationDate are required
    if (data.hasBeenEvaluated === 'Yes') {
      return !!(
        data.psychiatristName &&
        data.psychiatristName.trim().length > 0 &&
        data.evaluationDate
      )
    }
    return true
  },
  {
    message: 'Psychiatrist name and evaluation date are required when evaluated',
    path: ['psychiatristName'] // Shows error on first required field
  }
)

// =================================================================
// TYPE EXPORTS
// =================================================================

/**
 * Inferred TypeScript type from Zod schema
 */
export type PsychiatristSchema = z.infer<typeof psychiatristSchema>

/**
 * Partial type for UI state (allows incomplete data during editing)
 */
export type PartialPsychiatrist = Partial<PsychiatristSchema>

/**
 * Evaluation status type
 */
export type EvaluationStatus = 'Yes' | 'No'

// =================================================================
// VALIDATION UTILITIES
// =================================================================

/**
 * Validates psychiatrist data using safeParse
 * Returns success/error with detailed validation messages
 */
export function validatePsychiatrist(data: unknown) {
  return psychiatristSchema.safeParse(data)
}

/**
 * Type guard to check if psychiatrist info is complete
 */
export function isPsychiatristInfoComplete(data: PartialPsychiatrist): boolean {
  const result = psychiatristSchema.safeParse(data)
  return result.success
}

/**
 * Checks if different evaluator fields should be shown
 */
export function shouldShowDifferentEvaluator(data: PartialPsychiatrist): boolean {
  return data.hasBeenEvaluated === 'Yes' && data.differentEvaluator === true
}

/**
 * Validates character limit for text fields
 */
export function validateTextLength(
  text: string,
  maxLength: number,
  fieldName: string
): { valid: boolean; message?: string } {
  if (!text) {
    return { valid: true } // Optional fields
  }

  if (text.length > maxLength) {
    return {
      valid: false,
      message: `${fieldName} must not exceed ${maxLength} characters`
    }
  }

  return { valid: true }
}

// =================================================================
// DEFAULT VALUES
// =================================================================

/**
 * Default initial values for psychiatrist form
 */
export const defaultPsychiatristValues: PartialPsychiatrist = {
  hasBeenEvaluated: undefined,
  psychiatristName: '',
  evaluationDate: undefined,
  clinicName: '',
  notes: '',
  differentEvaluator: false,
  evaluatorName: '',
  evaluatorClinic: ''
}