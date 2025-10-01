/**
 * Medical Providers Use Cases for Step 4
 * OrbiPax Intake Module - Application Layer
 *
 * Orchestrates medical providers operations using repository port.
 * No direct I/O, uses dependency injection for persistence.
 *
 * SoC: Application orchestration - coordinates repository operations
 * Pattern: Use cases with dependency injection
 */

import { ZodError } from 'zod'

import { medicalProvidersDataPartialSchema } from '@/modules/intake/domain/schemas/medical-providers'

import {
  type Step4InputDTO,
  type LoadStep4Response,
  type SaveStep4Response,
  MedicalProvidersErrorCodes
} from './dtos'
import { toPartialDomain, createEmptyOutput } from './mappers'
import { type MedicalProvidersRepository } from './ports'

// =================================================================
// LOAD STEP 4 USE CASE
// =================================================================

/**
 * Load medical providers data for a session
 * Multi-tenant: scoped by organizationId via repository
 *
 * @param repository - Medical providers repository implementation
 * @param sessionId - Session identifier
 * @param organizationId - Organization identifier for multi-tenant isolation
 * @returns Medical providers data or error response
 */
export async function loadStep4(
  repository: MedicalProvidersRepository,
  sessionId: string,
  organizationId: string
): Promise<LoadStep4Response> {
  // Validate input parameters
  if (!sessionId || !organizationId) {
    return {
      ok: false,
      error: {
        code: MedicalProvidersErrorCodes.VALIDATION_FAILED,
        message: 'Session ID and Organization ID are required'
      }
    }
  }

  try {
    // Attempt to load from repository
    const result = await repository.findBySession(sessionId, organizationId)

    if (result.ok) {
      // Data found, return as-is
      return {
        ok: true,
        data: result.data
      }
    } else {
      // Error occurred (not ok)
      const errorResult = result as { ok: false; error?: { code: string; message?: string } }

      // Return empty structure for NOT_FOUND (allows UI to render empty form)
      if (errorResult.error?.code === MedicalProvidersErrorCodes.NOT_FOUND) {
        return {
          ok: true,
          data: createEmptyOutput(sessionId, organizationId)
        }
      }

      return {
        ok: false,
        error: errorResult.error ?? {
          code: MedicalProvidersErrorCodes.UNKNOWN,
          message: 'Failed to load medical providers data'
        }
      }
    }
  } catch {
    // Unexpected error
    return {
      ok: false,
      error: {
        code: MedicalProvidersErrorCodes.UNKNOWN,
        message: 'An unexpected error occurred while loading medical providers data'
      }
    }
  }
}

// =================================================================
// UPSERT MEDICAL PROVIDERS USE CASE
// =================================================================

/**
 * Save medical providers data for a session
 * Multi-tenant: scoped by organizationId via repository
 *
 * @param repository - Medical providers repository implementation
 * @param input - Medical providers data to save
 * @param sessionId - Session identifier
 * @param organizationId - Organization identifier for multi-tenant isolation
 * @returns Success response with sessionId or error
 */
export async function upsertMedicalProviders(
  repository: MedicalProvidersRepository,
  input: Step4InputDTO,
  sessionId: string,
  organizationId: string
): Promise<SaveStep4Response> {
  // Validate input parameters
  if (!sessionId || !organizationId) {
    return {
      ok: false,
      error: {
        code: MedicalProvidersErrorCodes.VALIDATION_FAILED,
        message: 'Session ID and Organization ID are required'
      }
    }
  }

  try {
    // Convert DTO to Domain and validate with Zod
    const domainData = toPartialDomain(input)
    const validationResult = medicalProvidersDataPartialSchema.safeParse(domainData)

    if (!validationResult.success) {
      return {
        ok: false,
        error: {
          code: MedicalProvidersErrorCodes.VALIDATION_FAILED,
          message: 'Medical providers data validation failed'
        }
      }
    }

    // Persist to repository
    const result = await repository.save(sessionId, organizationId, input)

    if (result.ok) {
      // Success - data is guaranteed to be defined
      return {
        ok: true,
        data: result.data
      }
    } else {
      // Save failed
      const errorResult = result as { ok: false; error?: { code: string; message?: string } }
      return {
        ok: false,
        error: errorResult.error ?? {
          code: MedicalProvidersErrorCodes.UNKNOWN,
          message: 'An unexpected error occurred while saving medical providers data'
        }
      }
    }
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof ZodError) {
      return {
        ok: false,
        error: {
          code: MedicalProvidersErrorCodes.VALIDATION_FAILED,
          message: 'Medical providers data validation failed'
        }
      }
    }

    // Unexpected error
    return {
      ok: false,
      error: {
        code: MedicalProvidersErrorCodes.UNKNOWN,
        message: 'An unexpected error occurred while saving medical providers data'
      }
    }
  }
}

// =================================================================
// SAVE MEDICAL PROVIDERS USE CASE (ALIAS)
// =================================================================

/**
 * Save medical providers data for a session (alias for consistency with other steps)
 * Multi-tenant: scoped by organizationId via repository
 *
 * @param repository - Medical providers repository implementation
 * @param input - Medical providers data to save
 * @param sessionId - Session identifier
 * @param organizationId - Organization identifier for multi-tenant isolation
 * @returns Success response with sessionId or error
 */
export async function saveStep4(
  repository: MedicalProvidersRepository,
  input: Step4InputDTO,
  sessionId: string,
  organizationId: string
): Promise<SaveStep4Response> {
  return upsertMedicalProviders(repository, input, sessionId, organizationId)
}
