/**
 * Diagnoses Server Actions for Step 3
 * OrbiPax Intake Module
 *
 * Server actions that orchestrate auth, multi-tenant isolation,
 * compose dependencies (DI), and delegate to Application layer for business logic
 *
 * SoC: Auth/session + dependency composition - NO validation, NO business logic
 * Pattern: Guards → DI → Use Cases → Generic Response
 */

'use server'

import { resolveUserAndOrg } from '@/shared/lib/current-user.server'

import {
  loadStep3,
  upsertDiagnoses,
  type Step3InputDTO,
  type Step3OutputDTO,
  DiagnosesErrorCodes
} from '@/modules/intake/application/step3'
import { createDiagnosesRepository } from '@/modules/intake/infrastructure/factories/diagnoses.factory'

/**
 * Action Response type - standardized for all actions
 * JSON-serializable contract for UI
 */
type ActionResponse<T = void> = {
  ok: boolean
  data?: T
  error?: {
    code: string
    message?: string // Generic messages only, no PHI
  }
}

/**
 * Load Step 3 Action
 *
 * Retrieves clinical assessment data for the current session
 * Enforces auth and multi-tenant isolation
 *
 * @returns Clinical assessment data or error response
 */
export async function loadStep3Action(): Promise<ActionResponse<Step3OutputDTO>> {
  try {
    // Auth guard - get user and organization
    let userId: string
    let organizationId: string

    try {
      const auth = await resolveUserAndOrg()
      userId = auth.userId
      organizationId = auth.organizationId
    } catch {
      // Auth/session failed
      return {
        ok: false,
        error: {
          code: DiagnosesErrorCodes.UNAUTHORIZED,
          message: 'Authentication required'
        }
      }
    }

    // Validate organization context
    if (!organizationId) {
      return {
        ok: false,
        error: {
          code: 'ORGANIZATION_MISMATCH',
          message: 'Invalid organization context'
        }
      }
    }

    // TODO: Get actual session ID from context/params
    // For now using a deterministic session ID based on user
    const sessionId = `session_${userId}_intake`

    // Create repository instance using factory
    const repository = createDiagnosesRepository()

    // Compose dependencies and delegate to Application layer
    const result = await loadStep3(repository, sessionId, organizationId)

    // Map Application response to Action response
    if (!result.ok) {
      return {
        ok: false,
        error: {
          code: result.error?.code ?? DiagnosesErrorCodes.UNKNOWN,
          // Never expose detailed error messages that might contain PHI
          message: 'Failed to load clinical assessment data'
        }
      }
    }

    return {
      ok: true,
      data: result.data
    }
  } catch {
    // Unexpected error - log internally but return generic error to UI
    return {
      ok: false,
      error: {
        code: DiagnosesErrorCodes.UNKNOWN,
        message: 'An unexpected error occurred'
      }
    }
  }
}

/**
 * Upsert Diagnoses Action
 *
 * Saves or updates clinical assessment data for the current session
 * Enforces auth and multi-tenant isolation
 *
 * @param input - Clinical assessment data to save
 * @returns Success response or error
 */
export async function upsertDiagnosesAction(
  input: Step3InputDTO
): Promise<ActionResponse<{ sessionId: string }>> {
  try {
    // Auth guard - get user and organization
    let userId: string
    let organizationId: string

    try {
      const auth = await resolveUserAndOrg()
      userId = auth.userId
      organizationId = auth.organizationId
    } catch {
      // Auth/session failed
      return {
        ok: false,
        error: {
          code: DiagnosesErrorCodes.UNAUTHORIZED,
          message: 'Authentication required'
        }
      }
    }

    // Validate organization context
    if (!organizationId) {
      return {
        ok: false,
        error: {
          code: 'ORGANIZATION_MISMATCH',
          message: 'Invalid organization context'
        }
      }
    }

    // TODO: Get actual session ID from context/params
    // For now using a deterministic session ID based on user
    const sessionId = `session_${userId}_intake`

    // Create repository instance using factory
    const repository = createDiagnosesRepository()

    // Compose dependencies and delegate to Application layer
    const result = await upsertDiagnoses(repository, input, sessionId, organizationId)

    // Map Application response to Action response
    if (!result.ok) {
      // Map specific error codes
      const errorCode = result.error?.code ?? DiagnosesErrorCodes.UNKNOWN
      let errorMessage = 'Failed to save clinical assessment data'

      // Provide slightly more specific messages for certain errors
      if (errorCode === DiagnosesErrorCodes.VALIDATION_FAILED) {
        errorMessage = 'Invalid clinical assessment data provided'
      } else if (errorCode === DiagnosesErrorCodes.SAVE_FAILED) {
        errorMessage = 'Unable to save clinical assessment data'
      }

      return {
        ok: false,
        error: {
          code: errorCode,
          message: errorMessage
        }
      }
    }

    return {
      ok: true,
      data: result.data
    }
  } catch {
    // Unexpected error - log internally but return generic error to UI
    return {
      ok: false,
      error: {
        code: DiagnosesErrorCodes.UNKNOWN,
        message: 'An unexpected error occurred'
      }
    }
  }
}