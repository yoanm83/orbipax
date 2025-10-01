/**
 * Clinical Assessment DTOs for Step 3
 * OrbiPax Intake Module - Application Layer
 *
 * JSON-serializable data transfer objects for diagnoses and clinical evaluation.
 * No domain logic, just data contracts for transport.
 *
 * SoC: Application layer contracts - NO domain validation here
 * Pattern: Plain DTOs for API/UI communication
 */

// =================================================================
// DIAGNOSIS RECORD DTO
// =================================================================

/**
 * Individual diagnosis record DTO - JSON-serializable
 * Maps to DiagnosisRecord in domain but with string dates
 */
export interface DiagnosisRecordDTO {
  code: string // ICD-10/DSM-5 code
  description: string
  diagnosisType: string // primary | secondary | ruled-out | provisional | differential
  severity: string // mild | moderate | severe | unspecified
  diagnosisDate: string // ISO date string
  onsetDate?: string // ISO date string
  verifiedBy?: string // Clinician name
  isBillable?: boolean
  notes?: string
}

// =================================================================
// DIAGNOSES SECTION DTO
// =================================================================

/**
 * Diagnoses section DTO - JSON-serializable
 * Contains primary diagnosis, secondary diagnoses, and mental health history
 */
export interface DiagnosesDTO {
  primaryDiagnosis?: string
  secondaryDiagnoses: string[]
  substanceUseDisorder?: string // yes | no | unknown
  mentalHealthHistory?: string
  diagnosisRecords: DiagnosisRecordDTO[]
}

// =================================================================
// PSYCHIATRIC EVALUATION DTO
// =================================================================

/**
 * Psychiatric evaluation DTO - JSON-serializable
 * Clinical assessment including symptoms, ideation, and treatment compliance
 */
export interface PsychiatricEvaluationDTO {
  // Symptoms and severity
  currentSymptoms: string[]
  severityLevel?: string // mild | moderate | severe | critical | unknown

  // Risk assessment flags
  suicidalIdeation?: boolean
  homicidalIdeation?: boolean
  psychoticSymptoms?: boolean

  // Treatment compliance
  medicationCompliance?: string // good | fair | poor | non-compliant | not-applicable
  treatmentHistory?: string

  // Evaluation details
  hasPsychEval: boolean
  evaluationDate?: string // ISO date string
  evaluatedBy?: string // Clinician name
  evaluationSummary?: string
}

// =================================================================
// FUNCTIONAL ASSESSMENT DTO
// =================================================================

/**
 * Functional assessment DTO - JSON-serializable
 * Based on WHODAS 2.0 domains and GAF scoring
 */
export interface FunctionalAssessmentDTO {
  // WHODAS domains
  affectedDomains: string[] // mobility | self-care | getting-along | life-activities | participation | cognition

  // Independence levels
  adlsIndependence: string // yes | no | partial | unknown
  iadlsIndependence: string // yes | no | partial | unknown

  // Cognitive functioning
  cognitiveFunctioning: string // intact | mild-impairment | moderate-impairment | severe-impairment | unknown

  // Safety assessment
  hasSafetyConcerns: boolean

  // Optional assessments
  globalFunctioning?: number // GAF score 0-100
  dailyLivingActivities: string[]
  socialFunctioning?: string // good | fair | poor | very-poor | unknown
  occupationalFunctioning?: string // employed | unemployed | disabled | retired | student | other
  cognitiveStatus?: string // oriented | confused | disoriented | comatose
  adaptiveBehavior?: string
  additionalNotes?: string
}

// =================================================================
// INPUT/OUTPUT DTOS
// =================================================================

/**
 * Input DTO for saving Step 3 clinical data
 * Received from UI/API for processing
 */
export interface Step3InputDTO {
  diagnoses?: DiagnosesDTO
  psychiatricEvaluation?: PsychiatricEvaluationDTO
  functionalAssessment?: FunctionalAssessmentDTO
}

/**
 * Output DTO for loading Step 3 clinical data
 * Sent to UI/API after retrieval
 */
export interface Step3OutputDTO {
  sessionId: string
  organizationId: string
  data: {
    diagnoses: DiagnosesDTO
    psychiatricEvaluation: PsychiatricEvaluationDTO
    functionalAssessment: FunctionalAssessmentDTO
  }
  lastModified?: string // ISO date string
  completedAt?: string // ISO date string if step completed
}

// =================================================================
// RESPONSE TYPES
// =================================================================

/**
 * Generic response type for repository operations
 * Discriminated union for type-safe error handling
 */
export type RepositoryResponse<T> =
  | {
      ok: true
      data: T
    }
  | {
      ok: false
      error: {
        code: string
        message?: string // Generic message only, no PHI
      }
    }

/**
 * Response for loading Step 3 clinical data
 */
export type LoadStep3Response = RepositoryResponse<Step3OutputDTO>

/**
 * Response for saving Step 3 clinical data
 */
export type SaveStep3Response = RepositoryResponse<{ sessionId: string }>

/**
 * Response for validating Step 3 for submission
 */
export type ValidateStep3Response = RepositoryResponse<{
  isValid: boolean
  issues?: string[] // Generic validation messages, no PHI
}>

// =================================================================
// ERROR CODES
// =================================================================

/**
 * Standard error codes for diagnoses operations
 */
export const DiagnosesErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  SAVE_FAILED: 'SAVE_FAILED',
  UNKNOWN: 'UNKNOWN'
} as const

export type DiagnosesErrorCode = typeof DiagnosesErrorCodes[keyof typeof DiagnosesErrorCodes]