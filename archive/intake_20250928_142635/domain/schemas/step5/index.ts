/**
 * Step 5 Medications - Schema Exports
 * OrbiPax Community Mental Health System
 *
 * Aggregates and exports all Step 5 validation schemas
 */

import { z } from 'zod'

// =================================================================
// SCHEMA IMPORTS
// =================================================================

export * from './currentMedications.schema'

import { currentMedicationsSchema } from './currentMedications.schema'

// =================================================================
// COMPOSITE SCHEMA
// =================================================================

/**
 * Complete Step 5 Medications schema
 * Combines all section schemas into a single validation schema
 */
export const step5MedicationsSchema = z.object({
  currentMedications: currentMedicationsSchema,
  // TODO: Add pharmacy section schema when implemented

  // Step metadata
  stepId: z.literal('step5-medications').default('step5-medications'),
  isComplete: z.boolean().default(false),
  completedAt: z.date().optional(),
  lastModified: z.date().optional()
})

/**
 * Inferred TypeScript type for complete Step 5 data
 */
export type Step5MedicationsSchema = z.infer<typeof step5MedicationsSchema>

/**
 * Partial type for work-in-progress Step 5 data
 */
export type PartialStep5Medications = {
  currentMedications?: Partial<z.infer<typeof currentMedicationsSchema>>
  stepId?: string
  isComplete?: boolean
  completedAt?: Date
  lastModified?: Date
}

// =================================================================
// VALIDATION UTILITIES
// =================================================================

/**
 * Validates complete Step 5 data
 * Returns detailed validation errors for each section
 */
export function validateStep5(data: unknown) {
  return step5MedicationsSchema.safeParse(data)
}

/**
 * Validates individual sections
 */
export const sectionValidators = {
  currentMedications: (data: unknown) => currentMedicationsSchema.safeParse(data)
}

/**
 * Check if a specific section is complete
 */
export function isSectionComplete(
  sectionName: keyof typeof sectionValidators,
  data: unknown
): boolean {
  const result = sectionValidators[sectionName](data)
  return result.success
}

/**
 * Check if entire Step 5 is complete
 */
export function isStep5Complete(data: PartialStep5Medications): boolean {
  if (!data.currentMedications) {
    return false
  }

  return isSectionComplete('currentMedications', data.currentMedications)
}

// =================================================================
// DEFAULT VALUES
// =================================================================

/**
 * Default values for entire Step 5
 */
export const defaultStep5Values: PartialStep5Medications = {
  currentMedications: {
    hasMedications: undefined
  },
  stepId: 'step5-medications',
  isComplete: false
}