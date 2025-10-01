/**
 * Demographics Server Actions
 * OrbiPax Community Mental Health System
 *
 * Server actions for Step 1 Demographics that orchestrate auth, multi-tenant isolation,
 * compose dependencies (DI), and delegate to Application layer for business logic
 *
 * SoC: Auth/session + dependency composition - NO validation, NO business logic
 */

'use server'

import { resolveUserAndOrg } from '@/shared/lib/current-user.server'
import {
  loadDemographics,
  saveDemographics,
  type DemographicsInputDTO,
  type DemographicsOutputDTO,
  type LoadDemographicsResponse,
  type SaveDemographicsResponse,
  ERROR_CODES
} from '@/modules/intake/application/step1'
// Import factory from Infrastructure
import { createDemographicsRepository } from '@/modules/intake/infrastructure/factories/demographics.factory'

/**
 * Action Response type - standardized for all actions
 */
type ActionResponse<T = void> = {
  ok: boolean
  data?: T
  error?: {
    code: string
    message?: string
  }
}

/**
 * Load Demographics Action
 *
 * Retrieves demographics data for the current session
 * Enforces auth and multi-tenant isolation
 *
 * @returns Demographics data or error response
 */
export async function loadDemographicsAction(): Promise<ActionResponse<DemographicsOutputDTO>> {
  try {
    // Auth guard - get user and organization
    let userId: string
    let organizationId: string

    try {
      const auth = await resolveUserAndOrg()
      userId = auth.userId
      organizationId = auth.organizationId
    } catch (error) {
      // Auth/session failed
      return {
        ok: false,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Authentication required'
        }
      }
    }

    // Validate organization context
    if (!organizationId) {
      return {
        ok: false,
        error: {
          code: ERROR_CODES.ORGANIZATION_MISMATCH,
          message: 'Invalid organization context'
        }
      }
    }

    // TODO: Get actual session ID from context/params
    // For now using a deterministic session ID based on user
    const sessionId = `session_${userId}_intake`

    // Create repository instance using factory
    const repository = createDemographicsRepository()

    // Compose dependencies and delegate to Application layer
    const result = await loadDemographics(repository, sessionId, organizationId)

    // Map Application response to Action response
    if (!result.ok) {
      return {
        ok: false,
        error: {
          code: result.error?.code || ERROR_CODES.INTERNAL_ERROR,
          // Never expose detailed error messages that might contain PII
          message: 'Failed to load demographics'
        }
      }
    }

    return {
      ok: true,
      data: result.data!
    }

  } catch (error) {
    // Unexpected errors - no details exposed
    return {
      ok: false,
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'An unexpected error occurred'
      }
    }
  }
}

/**
 * Save Demographics Action
 *
 * Saves demographics data for the current session
 * Validates auth and enforces multi-tenant isolation
 *
 * @param input - Demographics data from UI
 * @returns Success response or error
 */
export async function saveDemographicsAction(
  input: DemographicsInputDTO
): Promise<ActionResponse<{ sessionId: string }>> {
  try {
    // Auth guard - get user and organization
    let userId: string
    let organizationId: string

    try {
      const auth = await resolveUserAndOrg()
      userId = auth.userId
      organizationId = auth.organizationId
    } catch (error) {
      // Auth/session failed
      return {
        ok: false,
        error: {
          code: ERROR_CODES.UNAUTHORIZED,
          message: 'Authentication required'
        }
      }
    }

    // Validate organization context
    if (!organizationId) {
      return {
        ok: false,
        error: {
          code: ERROR_CODES.ORGANIZATION_MISMATCH,
          message: 'Invalid organization context'
        }
      }
    }

    // TODO: Get actual session ID from context/params
    // For now using a deterministic session ID based on user
    const sessionId = `session_${userId}_intake`

    // Create repository instance using factory
    const repository = createDemographicsRepository()

    // Compose dependencies and delegate to Application layer for validation and processing
    const result = await saveDemographics(repository, input, sessionId, organizationId)

    // Map Application response to Action response
    if (!result.ok) {
      return {
        ok: false,
        error: {
          code: result.error?.code || ERROR_CODES.VALIDATION_FAILED,
          // Generic message - no field-specific details to avoid PII
          message: 'Failed to save demographics'
        }
      }
    }

    return {
      ok: true,
      data: result.data!
    }

  } catch (error) {
    // Unexpected errors - no details exposed
    return {
      ok: false,
      error: {
        code: ERROR_CODES.INTERNAL_ERROR,
        message: 'An unexpected error occurred'
      }
    }
  }
}