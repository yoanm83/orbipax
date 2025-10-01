/**
 * Medical Providers Schema - Step 4 Intake Module
 * OrbiPax Community Mental Health System
 *
 * Canonical domain schema for Medical Providers data (PCP + Psychiatrist/Evaluator)
 * Consolidates legacy schemas from step4/ into domain-focused structure
 *
 * Pattern: Matches Step 3 canonical pattern with { ok, data|issues } validation contract
 * Migration: Phase 1 - Create canonical schema with legacy aliases for backward compatibility
 */

import { z } from 'zod'

import { normalizeName, validateName, NAME_LENGTHS } from '@/shared/utils/name'
import { normalizePhoneNumber, validatePhoneNumber } from '@/shared/utils/phone'

// ============================================================================
// SECTION 1: Primary Care Provider (PCP) Schema
// ============================================================================

/**
 * Primary Care Provider data schema with conditional validation
 * If hasPCP = 'Yes', pcpName and pcpPhone are required
 */
export const providersSchema = z.object({
  hasPCP: z.enum(['Yes', 'No', 'Unknown']).describe('Please indicate if you have a Primary Care Provider'),

  pcpName: z.string()
    .max(NAME_LENGTHS.PROVIDER_NAME, 'Provider name must not exceed 120 characters')
    .transform(normalizeName)
    .refine(validateName, 'Invalid characters in provider name')
    .optional(),

  pcpPhone: z.string()
    .transform(normalizePhoneNumber)
    .refine(validatePhoneNumber, 'Invalid phone number')
    .optional(),

  pcpPractice: z.string()
    .max(120, 'Practice name must not exceed 120 characters')
    .optional(),

  pcpAddress: z.string()
    .max(200, 'Address must not exceed 200 characters')
    .optional(),

  authorizedToShare: z.boolean()
    .optional()
}).refine(
  (data) => {
    // If hasPCP is 'Yes', pcpName and pcpPhone are required
    if (data.hasPCP === 'Yes') {
      // Check name is not empty (name is already transformed to string)
      if (!data.pcpName || (typeof data.pcpName === 'string' && data.pcpName.trim().length === 0)) {
        return false
      }

      // Check phone is valid (phone is already transformed to string)
      if (!data.pcpPhone || (typeof data.pcpPhone === 'string' && !validatePhoneNumber(data.pcpPhone))) {
        return false
      }

      return true
    }
    return true
  },
  {
    message: 'Provider name and valid phone number are required when you have a PCP',
    path: ['pcpName'] // Shows error on first required field
  }
)

// ============================================================================
// SECTION 2: Psychiatrist/Clinical Evaluator Schema
// ============================================================================

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
      // Check psychiatrist name is present and non-empty (already transformed to string)
      const hasValidName = data.psychiatristName &&
        typeof data.psychiatristName === 'string' &&
        data.psychiatristName.trim().length > 0

      return !!(hasValidName && data.evaluationDate)
    }
    return true
  },
  {
    message: 'Psychiatrist name and evaluation date are required when evaluated',
    path: ['psychiatristName'] // Shows error on first required field
  }
)

// ============================================================================
// SECTION 3: Main Composite Schema (Canonical)
// ============================================================================

/**
 * Complete Medical Providers data schema
 * Combines PCP and Psychiatrist sections into a single validation schema
 */
export const medicalProvidersDataSchema = z.object({
  providers: providersSchema,
  psychiatrist: psychiatristSchema,

  // Step metadata
  stepId: z.literal('step4-medical-providers').default('step4-medical-providers'),
  isComplete: z.boolean().default(false),
  completedAt: z.date().optional(),
  lastModified: z.date().optional()
})

/**
 * Partial schema for draft/autosave scenarios
 * All fields are optional to support work-in-progress data
 */
export const medicalProvidersDataPartialSchema = medicalProvidersDataSchema.partial()

// ============================================================================
// SECTION 4: TypeScript Types (Canonical)
// ============================================================================

/**
 * Inferred TypeScript type for complete Medical Providers data
 */
export type MedicalProvidersData = z.infer<typeof medicalProvidersDataSchema>

/**
 * Inferred TypeScript type for partial Medical Providers data (drafts)
 */
export type MedicalProvidersDataPartial = z.infer<typeof medicalProvidersDataPartialSchema>

/**
 * Inferred type for PCP section
 */
export type ProvidersSchema = z.infer<typeof providersSchema>

/**
 * Inferred type for Psychiatrist section
 */
export type PsychiatristSchema = z.infer<typeof psychiatristSchema>

/**
 * Partial type for PCP section
 */
export type PartialProviders = Partial<ProvidersSchema>

/**
 * Partial type for Psychiatrist section
 */
export type PartialPsychiatrist = Partial<PsychiatristSchema>

/**
 * PCP status enum type
 */
export type PCPStatus = 'Yes' | 'No' | 'Unknown'

/**
 * Evaluation status enum type
 */
export type EvaluationStatus = 'Yes' | 'No'

// ============================================================================
// SECTION 5: Validation Functions (Canonical Contract)
// ============================================================================

/**
 * Validates full medical providers data (complete form submission)
 *
 * @param input - Unknown input to validate
 * @returns Canonical contract: { ok: true, data } | { ok: false, issues }
 *
 * @example
 * const result = validateMedicalProviders(formData)
 * if (!result.ok) {
 *   result.issues.forEach(issue => {
 *     console.error(`${issue.path}: ${issue.message}`)
 *   })
 * } else {
 *   // Use result.data (type: MedicalProvidersData)
 * }
 */
export function validateMedicalProviders(input: unknown):
  | { ok: true; data: MedicalProvidersData }
  | { ok: false; issues: z.ZodIssue[] } {

  const result = medicalProvidersDataSchema.safeParse(input)

  if (result.success) {
    return {
      ok: true,
      data: result.data
    }
  }

  return {
    ok: false,
    issues: result.error.issues
  }
}

/**
 * Validates partial medical providers data (draft/autosave)
 *
 * @param input - Unknown input to validate
 * @returns Canonical contract: { ok: true, data } | { ok: false, issues }
 *
 * @example
 * const result = validateMedicalProvidersPartial(draftData)
 * if (result.ok) {
 *   await saveDraft(result.data)
 * }
 */
export function validateMedicalProvidersPartial(input: unknown):
  | { ok: true; data: MedicalProvidersDataPartial }
  | { ok: false; issues: z.ZodIssue[] } {

  const result = medicalProvidersDataPartialSchema.safeParse(input)

  if (result.success) {
    return {
      ok: true,
      data: result.data
    }
  }

  return {
    ok: false,
    issues: result.error.issues
  }
}

// ============================================================================
// SECTION 7: Section Validators (Canonical Contract)
// ============================================================================

/**
 * Validates PCP section data
 *
 * @param input - Unknown input to validate
 * @returns Canonical contract: { ok: true, data } | { ok: false, issues }
 */
export function validateProviders(input: unknown):
  | { ok: true; data: ProvidersSchema }
  | { ok: false; issues: z.ZodIssue[] } {

  const result = providersSchema.safeParse(input)

  if (result.success) {
    return {
      ok: true,
      data: result.data
    }
  }

  return {
    ok: false,
    issues: result.error.issues
  }
}

/**
 * Validates Psychiatrist section data
 *
 * @param input - Unknown input to validate
 * @returns Canonical contract: { ok: true, data } | { ok: false, issues }
 */
export function validatePsychiatrist(input: unknown):
  | { ok: true; data: PsychiatristSchema }
  | { ok: false; issues: z.ZodIssue[] } {

  const result = psychiatristSchema.safeParse(input)

  if (result.success) {
    return {
      ok: true,
      data: result.data
    }
  }

  return {
    ok: false,
    issues: result.error.issues
  }
}

// ============================================================================
// SECTION 7: Utility Functions
// ============================================================================

/**
 * Type guard to check if provider info is complete
 */
export function isProviderInfoComplete(data: PartialProviders): boolean {
  const result = providersSchema.safeParse(data)
  return result.success
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

/**
 * Check if a specific section is complete
 */
export function isSectionComplete(
  sectionName: 'providers' | 'psychiatrist',
  data: unknown
): boolean {
  if (sectionName === 'providers') {
    const result = providersSchema.safeParse(data)
    return result.success
  } else {
    const result = psychiatristSchema.safeParse(data)
    return result.success
  }
}

/**
 * Check if entire Medical Providers data is complete
 */
export function isMedicalProvidersComplete(data: MedicalProvidersDataPartial): boolean {
  if (!data.providers || !data.psychiatrist) {
    return false
  }

  return (
    isSectionComplete('providers', data.providers) &&
    isSectionComplete('psychiatrist', data.psychiatrist)
  )
}

// ============================================================================
// SECTION 8: Default Values
// ============================================================================

/**
 * Default initial values for providers form
 */
export const defaultProvidersValues = {
  hasPCP: undefined as PCPStatus | undefined,
  pcpName: '',
  pcpPhone: '',
  pcpPractice: '',
  pcpAddress: '',
  authorizedToShare: false
} satisfies PartialProviders

/**
 * Default initial values for psychiatrist form
 */
export const defaultPsychiatristValues = {
  hasBeenEvaluated: undefined as EvaluationStatus | undefined,
  psychiatristName: '',
  evaluationDate: undefined,
  clinicName: '',
  notes: '',
  differentEvaluator: false,
  evaluatorName: '',
  evaluatorClinic: ''
} satisfies PartialPsychiatrist

/**
 * Default values for entire Medical Providers step
 */
export const defaultMedicalProvidersValues = {
  providers: defaultProvidersValues,
  psychiatrist: defaultPsychiatristValues,
  stepId: 'step4-medical-providers' as const,
  isComplete: false
} satisfies MedicalProvidersDataPartial