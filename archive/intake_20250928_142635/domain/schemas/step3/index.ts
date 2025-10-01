/**
 * Step 3 Diagnoses/Clinical - Schema Exports
 * OrbiPax Community Mental Health System
 *
 * Aggregates and exports all Step 3 validation schemas
 */

import { z } from 'zod'

// =================================================================
// SCHEMA IMPORTS
// =================================================================

export * from './diagnoses.schema'
export * from './psychiatricEvaluation.schema'
export * from './functionalAssessment.schema'

import { diagnosesSchema } from './diagnoses.schema'
import { psychiatricEvaluationSchema } from './psychiatricEvaluation.schema'
import { functionalAssessmentSchema } from './functionalAssessment.schema'

// =================================================================
// COMPOSITE SCHEMA
// =================================================================

/**
 * Complete Step 3 Diagnoses/Clinical schema
 * Combines all section schemas into a single validation schema
 */
export const step3DiagnosesClinicalSchema = z.object({
  diagnoses: diagnosesSchema,
  psychiatricEvaluation: psychiatricEvaluationSchema,
  functionalAssessment: functionalAssessmentSchema,

  // Step metadata
  stepId: z.literal('step3-diagnoses-clinical').default('step3-diagnoses-clinical'),
  isComplete: z.boolean().default(false),
  completedAt: z.date().optional(),
  lastModified: z.date().optional()
})

/**
 * Inferred TypeScript type for complete Step 3 data
 */
export type Step3DiagnosesClinicalSchema = z.infer<typeof step3DiagnosesClinicalSchema>

/**
 * Partial type for work-in-progress Step 3 data
 */
export type PartialStep3DiagnosesClinical = {
  diagnoses?: Partial<z.infer<typeof diagnosesSchema>>
  psychiatricEvaluation?: Partial<z.infer<typeof psychiatricEvaluationSchema>>
  functionalAssessment?: Partial<z.infer<typeof functionalAssessmentSchema>>
  stepId?: string
  isComplete?: boolean
  completedAt?: Date
  lastModified?: Date
}

// =================================================================
// VALIDATION UTILITIES
// =================================================================

/**
 * Validates complete Step 3 data
 * Returns detailed validation errors for each section
 */
export function validateStep3(data: unknown) {
  return step3DiagnosesClinicalSchema.safeParse(data)
}

/**
 * Validates individual sections
 */
export const sectionValidators = {
  diagnoses: (data: unknown) => diagnosesSchema.safeParse(data),
  psychiatricEvaluation: (data: unknown) => psychiatricEvaluationSchema.safeParse(data),
  functionalAssessment: (data: unknown) => functionalAssessmentSchema.safeParse(data)
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
 * Check if entire Step 3 is complete
 */
export function isStep3Complete(data: PartialStep3DiagnosesClinical): boolean {
  if (!data.diagnoses || !data.psychiatricEvaluation || !data.functionalAssessment) {
    return false
  }

  return (
    isSectionComplete('diagnoses', data.diagnoses) &&
    isSectionComplete('psychiatricEvaluation', data.psychiatricEvaluation) &&
    isSectionComplete('functionalAssessment', data.functionalAssessment)
  )
}

// =================================================================
// DEFAULT VALUES
// =================================================================

/**
 * Default values for entire Step 3
 */
export const defaultStep3Values: PartialStep3DiagnosesClinical = {
  diagnoses: {
    primaryDiagnosis: '',
    secondaryDiagnoses: [],
    substanceUseDisorder: '',
    mentalHealthHistory: ''
  },
  psychiatricEvaluation: {
    hasEvaluation: undefined,
    evaluationDate: undefined,
    clinicianName: '',
    evaluationSummary: ''
  },
  functionalAssessment: {
    affectedDomains: [],
    adlsIndependence: undefined,
    iadlsIndependence: undefined,
    cognitiveFunctioning: undefined,
    safetyConcerns: false,
    additionalNotes: ''
  },
  stepId: 'step3-diagnoses-clinical',
  isComplete: false
}