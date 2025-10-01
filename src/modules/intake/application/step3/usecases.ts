/**
 * Clinical Assessment Use Cases for Step 3
 * OrbiPax Intake Module - Application Layer
 *
 * Orchestrates clinical assessment operations using domain validation and repository port.
 * No direct I/O, uses dependency injection for persistence.
 *
 * SoC: Application orchestration - coordinates domain and ports
 * Pattern: Use cases with dependency injection
 */

import { ZodError } from 'zod'

import { step3DataPartialSchema } from '@/modules/intake/domain/schemas/diagnoses-clinical'

import {
  type Step3InputDTO,
  type LoadStep3Response,
  type SaveStep3Response,
  DiagnosesErrorCodes
} from './dtos'
import { toPartialDomain, createEmptyOutput } from './mappers'
import { type DiagnosesRepository } from './ports'

// =================================================================
// LOAD STEP 3 USE CASE
// =================================================================

/**
 * Load clinical assessment data for a session
 * Multi-tenant: scoped by organizationId via repository
 */
export async function loadStep3(
  repository: DiagnosesRepository,
  sessionId: string,
  organizationId: string
): Promise<LoadStep3Response> {
  // Validate input parameters
  if (!sessionId || !organizationId) {
    return {
      ok: false,
      error: {
        code: DiagnosesErrorCodes.VALIDATION_FAILED,
        message: 'Session ID and Organization ID are required'
      }
    }
  }

  try {
    // Attempt to load from repository
    const result = await repository.findBySession(sessionId, organizationId)

    if (result.ok && result.data) {
      // Data found, return as-is
      return {
        ok: true,
        data: result.data
      }
    }

    // No data found, return empty structure
    if (result.error?.code === DiagnosesErrorCodes.NOT_FOUND) {
      return {
        ok: true,
        data: createEmptyOutput(sessionId, organizationId)
      }
    }

    // Other error occurred
    return {
      ok: false,
      error: result.error ?? {
        code: DiagnosesErrorCodes.UNKNOWN,
        message: 'Failed to load clinical assessment data'
      }
    }
  } catch {
    // Unexpected error
    return {
      ok: false,
      error: {
        code: DiagnosesErrorCodes.UNKNOWN,
        message: 'An unexpected error occurred while loading clinical assessment data'
      }
    }
  }
}

// =================================================================
// UPSERT DIAGNOSES USE CASE
// =================================================================

/**
 * Save clinical assessment data for a session
 * Multi-tenant: scoped by organizationId via repository
 */
export async function upsertDiagnoses(
  repository: DiagnosesRepository,
  input: Step3InputDTO,
  sessionId: string,
  organizationId: string
): Promise<SaveStep3Response> {
  // Validate input parameters
  if (!sessionId || !organizationId) {
    return {
      ok: false,
      error: {
        code: DiagnosesErrorCodes.VALIDATION_FAILED,
        message: 'Session ID and Organization ID are required'
      }
    }
  }

  try {
    // Convert DTO to domain model
    const domainData = toPartialDomain(input)

    // Validate with Zod schema
    const validationResult = step3DataPartialSchema.safeParse(domainData)

    if (!validationResult.success) {
      // Validation failed
      return {
        ok: false,
        error: {
          code: DiagnosesErrorCodes.VALIDATION_FAILED,
          message: 'Clinical assessment data validation failed'
        }
      }
    }

    // Persist to repository
    const result = await repository.save(sessionId, organizationId, input)

    if (!result.ok || !result.data) {
      // Save failed or no data returned
      return {
        ok: false,
        error: result.error ?? {
          code: DiagnosesErrorCodes.UNKNOWN,
          message: 'An unexpected error occurred while saving clinical assessment data'
        }
      }
    }

    // Success - data is guaranteed to be defined
    return {
      ok: true,
      data: result.data
    }
  } catch (error) {
    if (error instanceof ZodError) {
      // Zod validation error
      return {
        ok: false,
        error: {
          code: DiagnosesErrorCodes.VALIDATION_FAILED,
          message: 'Clinical assessment data validation failed'
        }
      }
    }

    // Unexpected error
    return {
      ok: false,
      error: {
        code: DiagnosesErrorCodes.UNKNOWN,
        message: 'An unexpected error occurred while saving clinical assessment data'
      }
    }
  }
}

// =================================================================
// SAVE INSURANCE USE CASE (ALIAS)
// =================================================================

/**
 * Save clinical assessment data for a session (alias for consistency with step2 pattern)
 * Multi-tenant: scoped by organizationId via repository
 */
export async function saveStep3(
  repository: DiagnosesRepository,
  input: Step3InputDTO,
  sessionId: string,
  organizationId: string
): Promise<SaveStep3Response> {
  return upsertDiagnoses(repository, input, sessionId, organizationId)
}