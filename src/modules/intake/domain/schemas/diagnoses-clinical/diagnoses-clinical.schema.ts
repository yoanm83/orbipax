/**
 * Step 3 Clinical Domain Schema
 * OrbiPax Intake Module - Domain Layer
 *
 * Clinical assessment schemas for diagnoses, psychiatric evaluation, and functional assessment
 * Provides validation and type inference for Step 3: Diagnoses & Clinical Evaluation
 *
 * SoC: Pure domain logic - no infrastructure dependencies, JSON-serializable
 * HIPAA: No PHI logging, generic validation messages only
 */

import { z } from 'zod'

import {
  DiagnosisType,
  SeverityLevel,
  MedicationCompliance,
  CognitiveFunctioning,
  IndependenceLevel,
  SocialFunctioning,
  OccupationalFunctioning,
  CognitiveStatus,
  WHODASDomain
} from '../../types/common'

// =================================================================
// DIAGNOSIS RECORD SCHEMA
// =================================================================

/**
 * Individual diagnosis record schema
 * Based on DSM-5 and ICD-10 standards
 */
export const diagnosisRecordSchema = z.object({
  // Required fields
  code: z.string().min(1, 'Diagnosis code is required'),
  description: z.string().min(1, 'Diagnosis description is required'),
  diagnosisType: z.nativeEnum(DiagnosisType),
  severity: z.enum(['mild', 'moderate', 'severe', 'unspecified']), // Note: 'unspecified' not in SeverityLevel enum
  diagnosisDate: z.string().min(1, 'Diagnosis date is required'), // ISO date string

  // Optional fields
  onsetDate: z.string().optional(), // ISO date string
  verifiedBy: z.string().optional(), // Clinician name
  isBillable: z.boolean().default(false),
  notes: z.string().max(500).optional()
})

/**
 * Diagnoses section schema
 * Contains primary diagnosis, secondary diagnoses, and mental health history
 */
export const diagnosesSchema = z.object({
  primaryDiagnosis: z.string().optional(),
  secondaryDiagnoses: z.array(z.string()).default([]),
  substanceUseDisorder: z.enum(['yes', 'no', 'unknown']).optional(),
  mentalHealthHistory: z.string().max(1000).optional(),
  diagnosisRecords: z.array(diagnosisRecordSchema).default([])
})

// =================================================================
// PSYCHIATRIC EVALUATION SCHEMA
// =================================================================

/**
 * Psychiatric evaluation schema
 * Clinical assessment including symptoms, ideation, and treatment compliance
 */
export const psychiatricEvaluationSchema = z.object({
  // Symptoms and severity
  currentSymptoms: z.array(z.string()).default([]),
  severityLevel: z.nativeEnum(SeverityLevel).optional(),

  // Risk assessment flags
  suicidalIdeation: z.boolean().optional(),
  homicidalIdeation: z.boolean().optional(),
  psychoticSymptoms: z.boolean().optional(),

  // Treatment compliance
  medicationCompliance: z.nativeEnum(MedicationCompliance).optional(),
  treatmentHistory: z.string().max(1000).optional(),

  // Evaluation details (conditional fields)
  hasPsychEval: z.boolean().default(false),
  evaluationDate: z.string().optional(), // ISO date string, required if hasPsychEval
  evaluatedBy: z.string().optional(), // Required if hasPsychEval
  evaluationSummary: z.string().max(2000).optional()
})

// Refine to ensure conditional fields are present when hasPsychEval is true
export const psychiatricEvaluationRefinedSchema = psychiatricEvaluationSchema.refine(
  (data) => {
    if (data.hasPsychEval) {
      return data.evaluationDate && data.evaluatedBy
    }
    return true
  },
  {
    message: 'Evaluation date and evaluator are required when psychiatric evaluation is present',
    path: ['evaluationDate']
  }
)

// =================================================================
// FUNCTIONAL ASSESSMENT SCHEMA
// =================================================================

/**
 * Functional assessment schema
 * Based on WHODAS 2.0 domains and GAF scoring
 */
export const functionalAssessmentSchema = z.object({
  // WHODAS domains (required)
  affectedDomains: z.array(z.nativeEnum(WHODASDomain)).min(1, 'At least one affected domain must be selected'),

  // Independence levels (required)
  adlsIndependence: z.nativeEnum(IndependenceLevel),
  iadlsIndependence: z.nativeEnum(IndependenceLevel),

  // Cognitive functioning (required)
  cognitiveFunctioning: z.nativeEnum(CognitiveFunctioning),

  // Safety assessment
  hasSafetyConcerns: z.boolean().default(false),

  // Optional assessments
  globalFunctioning: z.number().min(0).max(100).optional(), // GAF score
  dailyLivingActivities: z.array(z.string()).default([]),
  socialFunctioning: z.nativeEnum(SocialFunctioning).optional(),
  occupationalFunctioning: z.nativeEnum(OccupationalFunctioning).optional(),
  cognitiveStatus: z.nativeEnum(CognitiveStatus).optional(),
  adaptiveBehavior: z.string().max(500).optional(),
  additionalNotes: z.string().max(1000).optional()
})

// =================================================================
// COMPOSITE STEP 3 SCHEMA
// =================================================================

/**
 * Complete Step 3 data schema
 * Combines all three clinical assessment sections
 */
export const step3DataSchema = z.object({
  diagnoses: diagnosesSchema,
  psychiatricEvaluation: psychiatricEvaluationRefinedSchema,
  functionalAssessment: functionalAssessmentSchema,
  stepId: z.literal('step3-diagnoses-clinical').optional()
})

/**
 * Partial Step 3 schema for drafts
 * All fields optional to support incremental saving
 */
export const step3DataPartialSchema = z.object({
  diagnoses: diagnosesSchema.partial().optional(),
  psychiatricEvaluation: psychiatricEvaluationSchema.partial().optional(),
  functionalAssessment: functionalAssessmentSchema.partial().optional(),
  stepId: z.literal('step3-diagnoses-clinical').optional()
})

// =================================================================
// TYPE EXPORTS
// =================================================================

// Inferred types from Zod schemas
export type DiagnosisRecord = z.infer<typeof diagnosisRecordSchema>
export type Diagnoses = z.infer<typeof diagnosesSchema>
export type PsychiatricEvaluation = z.infer<typeof psychiatricEvaluationRefinedSchema>
export type FunctionalAssessment = z.infer<typeof functionalAssessmentSchema>
export type Step3Data = z.infer<typeof step3DataSchema>
export type Step3DataPartial = z.infer<typeof step3DataPartialSchema>

// =================================================================
// VALIDATION FUNCTION
// =================================================================

/**
 * Validates Step 3 clinical data
 * Used by UI to validate before submission
 *
 * @param input - Raw input data from UI
 * @returns Result object with ok flag and either data or issues
 */
export function validateStep3(input: unknown):
  | { ok: true; data: Step3Data }
  | { ok: false; issues: z.ZodIssue[] } {

  const result = step3DataSchema.safeParse(input)

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
 * Validates partial Step 3 data for drafts
 * Allows incomplete data for save-as-draft functionality
 *
 * @param input - Partial input data from UI
 * @returns Result object with ok flag and either data or issues
 */
export function validateStep3Partial(input: unknown):
  | { ok: true; data: Step3DataPartial }
  | { ok: false; issues: z.ZodIssue[] } {

  const result = step3DataPartialSchema.safeParse(input)

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

// =================================================================
// CLINICAL ENUMS EXPORT (for UI consistency)
// =================================================================

// @deprecated Use enums from '../types/common' instead
export const DIAGNOSIS_TYPES = Object.values(DiagnosisType)
export const SEVERITY_LEVELS = ['mild', 'moderate', 'severe', 'unspecified'] as const // Keep for 'unspecified' compatibility
export const COMPLIANCE_LEVELS = Object.values(MedicationCompliance)
export const INDEPENDENCE_LEVELS = Object.values(IndependenceLevel)
export const COGNITIVE_LEVELS = Object.values(CognitiveFunctioning)

// =================================================================
// HELPER FUNCTIONS
// =================================================================

/**
 * Creates an empty Step 3 data structure
 * Used for initializing new assessments
 */
export function createEmptyStep3Data(): Step3DataPartial {
  return {
    diagnoses: {
      primaryDiagnosis: undefined,
      secondaryDiagnoses: [],
      substanceUseDisorder: undefined,
      mentalHealthHistory: undefined,
      diagnosisRecords: []
    },
    psychiatricEvaluation: {
      currentSymptoms: [],
      severityLevel: undefined,
      suicidalIdeation: undefined,
      homicidalIdeation: undefined,
      psychoticSymptoms: undefined,
      medicationCompliance: undefined,
      treatmentHistory: undefined,
      hasPsychEval: false,
      evaluationDate: undefined,
      evaluatedBy: undefined,
      evaluationSummary: undefined
    },
    functionalAssessment: {
      affectedDomains: [],
      adlsIndependence: 'unknown',
      iadlsIndependence: 'unknown',
      cognitiveFunctioning: 'unknown',
      hasSafetyConcerns: false,
      globalFunctioning: undefined,
      dailyLivingActivities: [],
      socialFunctioning: undefined,
      occupationalFunctioning: undefined,
      cognitiveStatus: undefined,
      adaptiveBehavior: undefined,
      additionalNotes: undefined
    },
    stepId: 'step3-diagnoses-clinical'
  }
}