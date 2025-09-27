/**
 * Functional Assessment Schema - Step 4 Medical Providers
 * OrbiPax Community Mental Health System
 *
 * Validation schema for functional assessment section
 * Based on WHODAS 2.0 domains and ADL/IADL assessments
 */

import { z } from 'zod'

// =================================================================
// ENUMS AND CONSTANTS
// =================================================================

/**
 * WHODAS 2.0 functional domains
 */
export const FUNCTIONAL_DOMAINS = [
  'cognition',
  'mobility',
  'selfCare',
  'gettingAlong',
  'lifeActivities',
  'participation'
] as const

/**
 * Independence levels for ADL/IADL assessment
 */
export const INDEPENDENCE_LEVELS = [
  'Independent',
  'Needs Minimal Assistance',
  'Needs Moderate Assistance',
  'Needs Maximum Assistance',
  'Dependent'
] as const

/**
 * Cognitive functioning levels
 */
export const COGNITIVE_FUNCTIONING_LEVELS = [
  'No Impairment',
  'Mild Impairment',
  'Moderate Impairment',
  'Severe Impairment'
] as const

// =================================================================
// FUNCTIONAL ASSESSMENT SCHEMA
// =================================================================

/**
 * Functional assessment data schema
 * Requires at least one affected domain to be selected
 */
export const functionalAssessmentSchema = z.object({
  affectedDomains: z.array(z.enum(FUNCTIONAL_DOMAINS))
    .min(1, 'At least one functional domain must be selected'),

  adlsIndependence: z.enum(INDEPENDENCE_LEVELS).describe('ADLs independence level is required'),

  iadlsIndependence: z.enum(INDEPENDENCE_LEVELS).describe('IADLs independence level is required'),

  cognitiveFunctioning: z.enum(COGNITIVE_FUNCTIONING_LEVELS).describe('Cognitive functioning level is required'),

  safetyConcerns: z.boolean().describe('Safety concerns must be indicated'),

  additionalNotes: z.string()
    .max(300, 'Additional notes must not exceed 300 characters')
    .optional()
})

// =================================================================
// TYPE EXPORTS
// =================================================================

/**
 * Inferred TypeScript type from Zod schema
 */
export type FunctionalAssessmentSchema = z.infer<typeof functionalAssessmentSchema>

/**
 * Partial type for UI state (allows incomplete data during editing)
 */
export type PartialFunctionalAssessment = Partial<FunctionalAssessmentSchema>

/**
 * Type for functional domain
 */
export type FunctionalDomain = typeof FUNCTIONAL_DOMAINS[number]

/**
 * Type for independence level
 */
export type IndependenceLevel = typeof INDEPENDENCE_LEVELS[number]

/**
 * Type for cognitive functioning level
 */
export type CognitiveFunctioningLevel = typeof COGNITIVE_FUNCTIONING_LEVELS[number]

// =================================================================
// VALIDATION UTILITIES
// =================================================================

/**
 * Validates functional assessment data using safeParse
 * Returns success/error with detailed validation messages
 */
export function validateFunctionalAssessment(data: unknown) {
  return functionalAssessmentSchema.safeParse(data)
}

/**
 * Type guard to check if assessment is complete
 */
export function isAssessmentComplete(data: PartialFunctionalAssessment): boolean {
  const result = functionalAssessmentSchema.safeParse(data)
  return result.success
}

/**
 * Helper to get readable domain labels
 */
export function getDomainLabel(domain: FunctionalDomain): string {
  const labels: Record<FunctionalDomain, string> = {
    cognition: 'Cognition (Understanding & Communication)',
    mobility: 'Mobility (Moving & Getting Around)',
    selfCare: 'Self-Care (Hygiene, Dressing, Eating)',
    gettingAlong: 'Getting Along (Interacting with People)',
    lifeActivities: 'Life Activities (Domestic & Work/School)',
    participation: 'Participation (Community & Social)'
  }
  return labels[domain]
}

// =================================================================
// DEFAULT VALUES
// =================================================================

/**
 * Default initial values for functional assessment form
 */
export const defaultFunctionalAssessmentValues: PartialFunctionalAssessment = {
  affectedDomains: [],
  adlsIndependence: undefined,
  iadlsIndependence: undefined,
  cognitiveFunctioning: undefined,
  safetyConcerns: false,
  additionalNotes: ''
}