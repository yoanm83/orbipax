/**
 * Medical Providers DTOs for Step 4
 * OrbiPax Intake Module - Application Layer
 *
 * JSON-serializable data transfer objects for medical providers data.
 * No domain logic, just data contracts for transport.
 *
 * SoC: Application layer contracts - NO domain validation here
 * Pattern: Plain DTOs for API/UI communication
 */

// =================================================================
// PRIMARY CARE PROVIDER (PCP) DTO
// =================================================================

/**
 * Primary Care Provider (PCP) section DTO - JSON-serializable
 * Contains PCP contact information and authorization status
 */
export interface ProvidersDTO {
  hasPCP: 'Yes' | 'No' | 'Unknown'
  pcpName?: string
  pcpPhone?: string
  pcpPractice?: string
  pcpAddress?: string
  authorizedToShare?: boolean
}

// =================================================================
// PSYCHIATRIST/CLINICAL EVALUATOR DTO
// =================================================================

/**
 * Psychiatrist/Clinical Evaluator section DTO - JSON-serializable
 * Contains psychiatric evaluation history and evaluator information
 */
export interface PsychiatristDTO {
  hasBeenEvaluated: 'Yes' | 'No'
  psychiatristName?: string
  evaluationDate?: string // ISO date string
  clinicName?: string
  notes?: string
  differentEvaluator?: boolean
  evaluatorName?: string
  evaluatorClinic?: string
}

// =================================================================
// INPUT/OUTPUT DTOS
// =================================================================

/**
 * Input DTO for saving Step 4 medical providers data
 * Received from UI/API for processing
 */
export interface Step4InputDTO {
  providers?: ProvidersDTO
  psychiatrist?: PsychiatristDTO
}

/**
 * Output DTO for loading Step 4 medical providers data
 * Sent to UI/API after retrieval
 */
export interface Step4OutputDTO {
  sessionId: string
  organizationId: string
  data: {
    providers: ProvidersDTO
    psychiatrist: PsychiatristDTO
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
 * Response for loading Step 4 medical providers data
 */
export type LoadStep4Response = RepositoryResponse<Step4OutputDTO>

/**
 * Response for saving Step 4 medical providers data
 */
export type SaveStep4Response = RepositoryResponse<{ sessionId: string }>

/**
 * Response for validating Step 4 for submission
 */
export type ValidateStep4Response = RepositoryResponse<{
  isValid: boolean
  issues?: string[] // Generic validation messages, no PHI
}>

// =================================================================
// ERROR CODES
// =================================================================

/**
 * Standard error codes for medical providers operations
 * Used across Application, Actions, and Infrastructure layers
 */
export const MedicalProvidersErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  SAVE_FAILED: 'SAVE_FAILED',
  UNKNOWN: 'UNKNOWN'
} as const

/**
 * Type for medical providers error codes
 */
export type MedicalProvidersErrorCode =
  typeof MedicalProvidersErrorCodes[keyof typeof MedicalProvidersErrorCodes]
