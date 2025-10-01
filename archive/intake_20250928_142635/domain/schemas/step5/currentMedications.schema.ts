/**
 * Current Medications Schema - Step 5
 * OrbiPax Community Mental Health System
 *
 * Validation schema for current medications and allergies section
 * Handles Yes/No/Unknown status with conditional validation
 */

import { z } from 'zod'
import { validateName, normalizeName, NAME_LENGTHS } from '@/shared/utils/name'
import { SeverityLevel } from '@/modules/intake/domain/types/common'

// =========================================================================
// SHARED TYPES
// =========================================================================

/**
 * Reusable Yes/No/Unknown status type
 * Following the same pattern as PCPStatus from providers.schema.ts
 */
export type MedicationStatus = 'Yes' | 'No' | 'Unknown'

/**
 * Route of administration enum
 * // sentinel:allow-local-schema - Will be moved to shared location
 * TODO: Move to @/shared/domain/enums/medication.enums.ts
 */
export type MedicationRoute = 'oral' | 'injection' | 'topical' | 'sublingual' | 'other'

/**
 * Individual medication item schema
 */
export const medicationItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Medication name is required').max(200),
  dosage: z.string().min(1, 'Dosage is required').max(100),
  frequency: z.string().min(1, 'Frequency is required').max(100),
  route: z.enum(['oral', 'injection', 'topical', 'sublingual', 'other']).optional(),
  startDate: z.date().optional(),
  prescribedBy: z.string()
    .max(NAME_LENGTHS.PROVIDER_NAME)
    .transform(normalizeName)
    .refine(validateName, 'Invalid characters in prescriber name')
    .optional(),
  notes: z.string().max(500).optional()
})

/**
 * Individual allergy item schema
 */
export const allergyItemSchema = z.object({
  id: z.string(),
  allergen: z.string().min(1, 'Allergen is required').max(200),
  reaction: z.string().min(1, 'Reaction is required').max(200),
  severity: z.nativeEnum(SeverityLevel).optional(),
  onsetDate: z.date().optional(),
  notes: z.string().max(500).optional()
})

// =========================================================================
// SCHEMA DEFINITION
// =========================================================================

/**
 * Current Medications validation schema
 * Handles medication status with conditional fields for "Yes" selection
 */
export const currentMedicationsSchema = z.object({
  // Has current medications (required)
  hasMedications: z.enum(['Yes', 'No', 'Unknown'])
    .describe('Please indicate if you are currently taking any medications'),

  // Medications list - only validated when hasMedications === 'Yes'
  medications: z.array(medicationItemSchema).default([]),

  // Allergies list - only shown when hasMedications === 'Yes'
  allergies: z.array(allergyItemSchema).default([])
})

// =========================================================================
// TYPE EXPORTS
// =========================================================================

export type CurrentMedicationsSchema = z.infer<typeof currentMedicationsSchema>
export type MedicationItem = z.infer<typeof medicationItemSchema>
export type AllergyItem = z.infer<typeof allergyItemSchema>

// =========================================================================
// VALIDATION HELPERS
// =========================================================================

/**
 * Validates current medications data
 */
export function validateCurrentMedications(data: unknown) {
  return currentMedicationsSchema.safeParse(data)
}

/**
 * Checks if current medications section is complete
 */
export function isCurrentMedicationsComplete(data: unknown): boolean {
  const result = validateCurrentMedications(data)
  return result.success
}

// =========================================================================
// DEFAULT VALUES
// =========================================================================

export const defaultCurrentMedicationsValues: Partial<CurrentMedicationsSchema> = {
  hasMedications: undefined
}