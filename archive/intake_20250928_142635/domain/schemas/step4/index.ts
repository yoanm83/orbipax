/**
 * Step 4 Medical Providers - Schema Exports
 * OrbiPax Community Mental Health System
 *
 * Aggregates and exports all Step 4 validation schemas
 */

import { z } from 'zod'

// =================================================================
// SCHEMA IMPORTS
// =================================================================

export * from './providers.schema'
export * from './psychiatrist.schema'

import { providersSchema } from './providers.schema'
import { psychiatristSchema } from './psychiatrist.schema'

// =================================================================
// COMPOSITE SCHEMA
// =================================================================

/**
 * Complete Step 4 Medical Providers schema
 * Combines all section schemas into a single validation schema
 */
export const step4MedicalProvidersSchema = z.object({
  providers: providersSchema,
  psychiatrist: psychiatristSchema,

  // Step metadata
  stepId: z.literal('step4-medical-providers').default('step4-medical-providers'),
  isComplete: z.boolean().default(false),
  completedAt: z.date().optional(),
  lastModified: z.date().optional()
})

/**
 * Inferred TypeScript type for complete Step 4 data
 */
export type Step4MedicalProvidersSchema = z.infer<typeof step4MedicalProvidersSchema>

/**
 * Partial type for work-in-progress Step 4 data
 */
export type PartialStep4MedicalProviders = {
  providers?: Partial<z.infer<typeof providersSchema>>
  psychiatrist?: Partial<z.infer<typeof psychiatristSchema>>
  stepId?: string
  isComplete?: boolean
  completedAt?: Date
  lastModified?: Date
}

// =================================================================
// VALIDATION UTILITIES
// =================================================================

/**
 * Validates complete Step 4 data
 * Returns detailed validation errors for each section
 */
export function validateStep4(data: unknown) {
  return step4MedicalProvidersSchema.safeParse(data)
}

/**
 * Validates individual sections
 */
export const sectionValidators = {
  providers: (data: unknown) => providersSchema.safeParse(data),
  psychiatrist: (data: unknown) => psychiatristSchema.safeParse(data)
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
 * Check if entire Step 4 is complete
 */
export function isStep4Complete(data: PartialStep4MedicalProviders): boolean {
  if (!data.providers || !data.psychiatrist) {
    return false
  }

  return (
    isSectionComplete('providers', data.providers) &&
    isSectionComplete('psychiatrist', data.psychiatrist)
  )
}

// =================================================================
// DEFAULT VALUES
// =================================================================

/**
 * Default values for entire Step 4
 */
export const defaultStep4Values: PartialStep4MedicalProviders = {
  providers: {
    hasPCP: undefined,
    pcpName: '',
    pcpPhone: '',
    pcpPractice: '',
    pcpAddress: '',
    authorizedToShare: false
  },
  psychiatrist: {
    hasBeenEvaluated: undefined,
    psychiatristName: '',
    evaluationDate: undefined,
    clinicName: '',
    notes: '',
    differentEvaluator: false,
    evaluatorName: '',
    evaluatorClinic: ''
  },
  stepId: 'step4-medical-providers',
  isComplete: false
}