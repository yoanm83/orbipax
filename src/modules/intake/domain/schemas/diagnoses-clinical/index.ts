/**
 * Diagnoses & Clinical Assessment Schema Exports
 * OrbiPax Community Mental Health (CMH) System
 *
 * Centralized exports for diagnoses, psychiatric evaluation, and functional assessment validation schemas
 */

export {
  // Schema exports
  diagnosisRecordSchema,
  diagnosesSchema,
  psychiatricEvaluationSchema,
  psychiatricEvaluationRefinedSchema,
  functionalAssessmentSchema,
  step3DataSchema,
  step3DataPartialSchema,

  // Type exports
  type DiagnosisRecord,
  type Diagnoses,
  type PsychiatricEvaluation,
  type FunctionalAssessment,
  type Step3Data,
  type Step3DataPartial,

  // Validation helper functions
  validateStep3,
  validateStep3Partial,
  createEmptyStep3Data,

  // Constant exports
  DIAGNOSIS_TYPES,
  SEVERITY_LEVELS,
  COMPLIANCE_LEVELS,
  INDEPENDENCE_LEVELS,
  COGNITIVE_LEVELS
} from './diagnoses-clinical.schema'