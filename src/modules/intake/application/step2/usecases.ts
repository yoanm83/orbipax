/**
 * Insurance & Eligibility Use Cases - Application Layer
 * OrbiPax Community Mental Health System
 *
 * Orchestrates business logic for insurance & eligibility operations
 * Coordinates between Domain validation and Infrastructure persistence
 *
 * SoC: Business orchestration - delegates validation to Domain, persistence to Ports
 * NO Zod in Application layer - validation via Domain function
 */

import { validateInsuranceEligibility } from '@/modules/intake/domain/schemas/insurance-eligibility'

import type {
  InsuranceEligibilityInputDTO,
  InsuranceEligibilityOutputDTO
} from './dtos'

import type {
  InsuranceEligibilityRepository,
  RepositoryResponse
} from './ports'

import {
  toInsuranceEligibilityDomain,
  toInsuranceEligibilityDTO,
  extractInsuranceEligibilityData
} from './mappers'

/**
 * Error codes for use case responses
 */
const ERROR_CODES = {
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  NOT_FOUND: 'NOT_FOUND',
  REPOSITORY_ERROR: 'REPOSITORY_ERROR',
  UNKNOWN: 'UNKNOWN'
} as const

/**
 * Use case response type
 */
type UseCaseResponse<T = void> = {
  ok: boolean
  data?: T
  error?: {
    code: string
    message: string // Generic messages only, no PHI
  }
}

/**
 * Load Insurance & Eligibility Use Case
 *
 * Retrieves insurance & eligibility data for a session
 * Handles repository interaction and data mapping
 *
 * @param repository - Insurance repository implementation
 * @param sessionId - Intake session identifier
 * @param organizationId - Organization context for multi-tenant isolation
 * @returns Use case response with insurance data or error
 */
export async function loadInsuranceEligibility(
  repository: InsuranceEligibilityRepository,
  sessionId: string,
  organizationId: string
): Promise<UseCaseResponse<InsuranceEligibilityOutputDTO>> {
  try {
    // Query repository for existing data
    const result = await repository.findBySession(sessionId, organizationId)

    if (!result.ok) {
      // Map repository error to generic use case error
      return {
        ok: false,
        error: {
          code: result.error?.code === 'NOT_FOUND'
            ? ERROR_CODES.NOT_FOUND
            : ERROR_CODES.REPOSITORY_ERROR,
          message: result.error?.code === 'NOT_FOUND'
            ? 'Insurance & eligibility information not found'
            : 'Could not load insurance & eligibility information'
        }
      }
    }

    // Return successful result with data
    return {
      ok: true,
      data: result.data
    }
  } catch (error) {
    // Handle unexpected errors
    return {
      ok: false,
      error: {
        code: ERROR_CODES.UNKNOWN,
        message: 'An error occurred while loading insurance & eligibility information'
      }
    }
  }
}

/**
 * Save Insurance & Eligibility Use Case
 *
 * Validates and persists insurance & eligibility data
 * Enforces domain validation before persistence
 *
 * @param repository - Insurance repository implementation
 * @param input - Insurance & eligibility data to save
 * @param sessionId - Intake session identifier
 * @param organizationId - Organization context for multi-tenant isolation
 * @returns Use case response with session ID or error
 */
export async function saveInsuranceEligibility(
  repository: InsuranceEligibilityRepository,
  input: InsuranceEligibilityInputDTO,
  sessionId: string,
  organizationId: string
): Promise<UseCaseResponse<{ sessionId: string }>> {
  try {
    // Step 1: Map DTO to domain object
    const domainData = toInsuranceEligibilityDomain(input)

    // Step 2: Validate with domain schema (NO Zod here)
    const validationResult = validateInsuranceEligibility(domainData)

    if (!validationResult.ok) {
      // Return generic validation error (no details exposed)
      return {
        ok: false,
        error: {
          code: ERROR_CODES.VALIDATION_FAILED,
          message: 'Insurance & eligibility validation failed'
        }
      }
    }

    // Step 3: Map validated domain data back to DTO for persistence
    const validatedDTO = toInsuranceEligibilityDTO(validationResult.data)

    // Step 4: Persist to repository
    const saveResult = await repository.save(sessionId, organizationId, validatedDTO)

    if (!saveResult.ok) {
      // Map repository error to generic use case error
      return {
        ok: false,
        error: {
          code: ERROR_CODES.REPOSITORY_ERROR,
          message: 'Could not save insurance & eligibility information'
        }
      }
    }

    // Return successful result
    return {
      ok: true,
      data: { sessionId }
    }
  } catch (error) {
    // Handle unexpected errors
    return {
      ok: false,
      error: {
        code: ERROR_CODES.UNKNOWN,
        message: 'An error occurred while saving insurance & eligibility information'
      }
    }
  }
}

/**
 * Update Insurance & Eligibility Use Case
 *
 * Updates existing insurance & eligibility data
 * Loads existing data, merges changes, validates, and persists
 *
 * @param repository - Insurance repository implementation
 * @param updates - Partial insurance & eligibility data to update
 * @param sessionId - Intake session identifier
 * @param organizationId - Organization context for multi-tenant isolation
 * @returns Use case response with session ID or error
 */
export async function updateInsuranceEligibility(
  repository: InsuranceEligibilityRepository,
  updates: Partial<InsuranceEligibilityInputDTO>,
  sessionId: string,
  organizationId: string
): Promise<UseCaseResponse<{ sessionId: string }>> {
  try {
    // Step 1: Load existing data
    const loadResult = await repository.findBySession(sessionId, organizationId)

    if (!loadResult.ok) {
      // If no existing data, treat as new save
      if (loadResult.error?.code === 'NOT_FOUND' && updates) {
        // Ensure we have complete data for new save
        const completeData = {
          insuranceCoverages: updates.insuranceCoverages || [],
          isUninsured: updates.isUninsured ?? false,
          uninsuredReason: updates.uninsuredReason,
          eligibilityCriteria: updates.eligibilityCriteria || {
            residesInServiceArea: 'unknown',
            ageGroup: 'adult',
            isEligibleByAge: false,
            hasDiagnosedMentalHealth: 'unknown',
            diagnosisVerified: false,
            impactsDaily: 'unknown',
            impactsWork: 'unknown',
            impactsRelationships: 'unknown',
            suicidalIdeation: 'unknown',
            substanceUse: 'unknown',
            domesticViolence: 'unknown',
            homelessness: 'unknown',
            isVeteran: false,
            isPregnantPostpartum: false,
            isFirstResponder: false,
            hasDisability: false,
            hasMinorChildren: false,
            involvedWithDCF: false,
            courtOrdered: false
          },
          financialInformation: updates.financialInformation || {
            incomeVerified: false,
            medicaidEligible: false,
            medicareEligible: false,
            slidingFeeEligible: false,
            financialHardship: false,
            hardshipDocumented: false,
            assistanceRequested: false,
            assistanceApproved: false,
            billingPreference: 'insurance',
            paymentPlanRequested: false,
            paymentPlanApproved: false,
            documentsProvided: [],
            documentsNeeded: []
          },
          ...updates
        } as InsuranceEligibilityInputDTO

        return saveInsuranceEligibility(repository, completeData, sessionId, organizationId)
      }

      return {
        ok: false,
        error: {
          code: ERROR_CODES.NOT_FOUND,
          message: 'Insurance & eligibility information not found'
        }
      }
    }

    // Step 2: Merge updates with existing data
    const existingData = extractInsuranceEligibilityData(loadResult.data!)
    const mergedData: InsuranceEligibilityInputDTO = {
      ...existingData,
      ...updates,
      // Deep merge for nested objects
      eligibilityCriteria: {
        ...existingData.eligibilityCriteria,
        ...(updates.eligibilityCriteria || {})
      },
      financialInformation: {
        ...existingData.financialInformation,
        ...(updates.financialInformation || {})
      }
    }

    // Step 3: Save merged data (includes validation)
    return saveInsuranceEligibility(repository, mergedData, sessionId, organizationId)
  } catch (error) {
    return {
      ok: false,
      error: {
        code: ERROR_CODES.UNKNOWN,
        message: 'An error occurred while updating insurance & eligibility information'
      }
    }
  }
}

/**
 * Export error codes for external use
 */
export { ERROR_CODES as InsuranceEligibilityErrorCodes }