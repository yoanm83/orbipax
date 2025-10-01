/**
 * Demographics Use Cases - Application Layer
 * OrbiPax Community Mental Health System
 *
 * Orchestrates the flow between UI, Domain validation, and Infrastructure persistence
 * Uses dependency injection for repository - no direct Infrastructure imports
 *
 * SoC: Orchestration only - delegates validation to Domain, persistence to ports
 */

import { validateDemographics } from '@/modules/intake/domain/schemas/demographics/demographics.schema'
import type { Demographics } from '@/modules/intake/domain/schemas/demographics/demographics.schema'
import type {
  DemographicsInputDTO,
  LoadDemographicsResponse,
  SaveDemographicsResponse
} from './dtos'
import type { DemographicsRepository } from './ports'
import { toDomain, toOutput } from './mappers'

/**
 * Error codes for Demographics operations
 * Generic codes without PII
 */
export const ERROR_CODES = {
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  ORGANIZATION_MISMATCH: 'ORGANIZATION_MISMATCH',
  INTERNAL_ERROR: 'INTERNAL_ERROR'
} as const

/**
 * Required fields for demographics completion
 * Application layer concern - defines business rules for completion
 */
const REQUIRED_DEMOGRAPHICS_FIELDS = [
  'firstName',
  'lastName',
  'dateOfBirth',
  'genderIdentity',
  'race',
  'ethnicity',
  'primaryLanguage',
  'phoneNumbers',
  'address',
  'emergencyContact'
] as const

/**
 * Load Demographics Use Case
 *
 * Retrieves demographics data for a given session and organization
 * Repository is injected via dependency injection
 *
 * @param repository - Demographics repository port implementation
 * @param sessionId - Intake session identifier
 * @param organizationId - Organization context for multitenant isolation
 * @returns LoadDemographicsResponse with serializable DTO
 */
export async function loadDemographics(
  repository: DemographicsRepository,
  sessionId: string,
  organizationId: string
): Promise<LoadDemographicsResponse> {
  try {
    // Input validation
    if (!sessionId || !organizationId) {
      return {
        ok: false,
        error: {
          code: ERROR_CODES.VALIDATION_FAILED,
          message: 'Session and organization required'
        }
      }
    }

    // Call repository through port interface
    const result = await repository.findBySession(sessionId, organizationId)

    if (!result.ok) {
      // Map repository error codes to application error codes
      const errorCode = result.error?.code === 'NOT_FOUND'
        ? ERROR_CODES.NOT_FOUND
        : result.error?.code === 'UNAUTHORIZED'
        ? ERROR_CODES.UNAUTHORIZED
        : ERROR_CODES.INTERNAL_ERROR

      return {
        ok: false,
        error: {
          code: errorCode,
          message: 'Failed to load demographics'
        }
      }
    }

    // Return the data from repository
    return {
      ok: true,
      data: result.data!
    }
  } catch (error) {
    // Generic error handling - no PII in errors
    return {
      ok: false,
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'Failed to load demographics'
      }
    }
  }
}

/**
 * Save Demographics Use Case
 *
 * Validates and saves demographics data for a given session and organization
 * Repository is injected via dependency injection
 *
 * @param repository - Demographics repository port implementation
 * @param inputDTO - Demographics data from UI
 * @param sessionId - Intake session identifier
 * @param organizationId - Organization context for multitenant isolation
 * @returns SaveDemographicsResponse with validation result
 */
export async function saveDemographics(
  repository: DemographicsRepository,
  inputDTO: DemographicsInputDTO,
  sessionId: string,
  organizationId: string
): Promise<SaveDemographicsResponse> {
  try {
    // Input validation
    if (!sessionId || !organizationId) {
      return {
        ok: false,
        error: {
          code: ERROR_CODES.VALIDATION_FAILED,
          message: 'Session and organization required'
        }
      }
    }

    // Convert DTO to Domain model
    const domainData = toDomain(inputDTO)

    // Validate using Domain validation function (not Zod directly)
    const validationResult = validateDemographics(domainData)

    if (!validationResult.ok) {
      // Return generic error message (no field details to avoid PII)
      return {
        ok: false,
        error: {
          code: ERROR_CODES.VALIDATION_FAILED,
          message: 'Demographics validation failed'
        }
      }
    }

    // Call repository through port interface
    const saveResult = await repository.save(
      sessionId,
      organizationId,
      inputDTO
    )

    if (!saveResult.ok) {
      // Map repository error codes to application error codes
      const errorCode = saveResult.error?.code === 'CONFLICT'
        ? ERROR_CODES.VALIDATION_FAILED
        : saveResult.error?.code === 'UNAUTHORIZED'
        ? ERROR_CODES.UNAUTHORIZED
        : ERROR_CODES.INTERNAL_ERROR

      return {
        ok: false,
        error: {
          code: errorCode,
          message: 'Failed to save demographics'
        }
      }
    }

    return {
      ok: true,
      data: {
        sessionId
      }
    }
  } catch (error) {
    // Generic error handling - no PII in errors
    return {
      ok: false,
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'Failed to save demographics'
      }
    }
  }
}

/**
 * Check Demographics Completion Status
 *
 * Helper function to determine if demographics step is complete
 * Can be used by UI to show progress indicators
 *
 * @param inputDTO - Demographics data to check
 * @returns Object with completion status and missing fields
 */
export function checkDemographicsCompletion(inputDTO: DemographicsInputDTO): {
  isComplete: boolean
  completionStatus: 'incomplete' | 'partial' | 'complete'
  requiredFieldsMissing: string[]
  percentComplete: number
} {
  const domainData = toDomain(inputDTO)

  const missingFields = REQUIRED_DEMOGRAPHICS_FIELDS.filter(field => {
    const value = domainData[field as keyof typeof domainData]
    return value === undefined || value === null ||
           (Array.isArray(value) && value.length === 0) ||
           (typeof value === 'string' && value.trim() === '')
  })

  const percentComplete = Math.round(
    ((REQUIRED_DEMOGRAPHICS_FIELDS.length - missingFields.length) /
     REQUIRED_DEMOGRAPHICS_FIELDS.length) * 100
  )

  const completionStatus = missingFields.length === 0 ? 'complete' :
                         percentComplete < 30 ? 'incomplete' : 'partial'

  return {
    isComplete: missingFields.length === 0,
    completionStatus,
    requiredFieldsMissing: missingFields as string[],
    percentComplete
  }
}