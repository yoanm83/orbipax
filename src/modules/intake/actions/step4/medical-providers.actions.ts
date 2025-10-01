/**
 * Medical Providers Server Actions for Step 4
 * OrbiPax Intake Module
 *
 * Server actions that orchestrate auth, multi-tenant isolation,
 * compose dependencies (DI), and delegate to Application layer for business logic
 *
 * SoC: Auth/session + dependency composition - NO validation, NO business logic
 * Pattern: Guards → DI → Use Cases → Generic Response
 * Security: All responses are PHI-safe with generic error messages
 */

'use server'

import { resolveUserAndOrg } from '@/shared/lib/current-user.server'

import type { ActionResponse } from '@/modules/intake/actions/types'
import {
  loadStep4,
  saveStep4,
  type Step4InputDTO,
  type Step4OutputDTO,
  MedicalProvidersErrorCodes
} from '@/modules/intake/application/step4'
import { createMedicalProvidersRepository } from '@/modules/intake/infrastructure/factories/medical-providers.factory'

/**
 * Load Medical Providers Action (Step 4)
 *
 * Retrieves medical providers data for the current intake session
 * Enforces authentication and multi-tenant isolation
 *
 * Flow:
 * 1. Resolve user + organization from auth context
 * 2. Validate session and org context
 * 3. Create repository via factory (DI)
 * 4. Delegate to Application layer use case
 * 5. Return PHI-safe response
 *
 * @param sessionId - Intake session identifier
 * @returns Medical providers data or generic error
 */
export async function loadMedicalProvidersAction(
  sessionId: string
): Promise<ActionResponse<Step4OutputDTO>> {
  try {
    // ============================================================
    // AUTH GUARD: Resolve user and organization
    // ============================================================
    let organizationId: string

    try {
      const auth = await resolveUserAndOrg()
      organizationId = auth.organizationId
    } catch {
      // Auth/session failed
      return {
        ok: false,
        error: {
          code: MedicalProvidersErrorCodes.UNAUTHORIZED,
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

    // Validate session ID parameter
    if (!sessionId) {
      return {
        ok: false,
        error: {
          code: MedicalProvidersErrorCodes.VALIDATION_FAILED,
          message: 'Session ID is required'
        }
      }
    }

    // ============================================================
    // DEPENDENCY INJECTION: Create repository via factory
    // ============================================================
    const repository = createMedicalProvidersRepository()

    // ============================================================
    // DELEGATION: Invoke Application layer use case
    // ============================================================
    const result = await loadStep4(repository, sessionId, organizationId)

    // ============================================================
    // RESPONSE MAPPING: Convert to Action response
    // ============================================================
    if (!result.ok) {
      return {
        ok: false,
        error: {
          code: result.error?.code ?? MedicalProvidersErrorCodes.UNKNOWN,
          // Generic message - never expose PHI or internal details
          message: 'Failed to load medical providers data'
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
        code: MedicalProvidersErrorCodes.UNKNOWN,
        message: 'An unexpected error occurred'
      }
    }
  }
}

/**
 * Save Medical Providers Action (Step 4)
 *
 * Saves or updates medical providers data for the current intake session
 * Enforces authentication and multi-tenant isolation
 *
 * Flow:
 * 1. Resolve user + organization from auth context
 * 2. Validate session, org context, and input shape
 * 3. Create repository via factory (DI)
 * 4. Delegate to Application layer use case (includes Domain validation)
 * 5. Return PHI-safe response
 *
 * @param sessionId - Intake session identifier
 * @param input - Medical providers data to save
 * @returns Success response with sessionId or generic error
 */
export async function saveMedicalProvidersAction(
  sessionId: string,
  input: Step4InputDTO
): Promise<ActionResponse<{ sessionId: string }>> {
  try {
    // ============================================================
    // AUTH GUARD: Resolve user and organization
    // ============================================================
    let organizationId: string

    try {
      const auth = await resolveUserAndOrg()
      organizationId = auth.organizationId
    } catch {
      // Auth/session failed
      return {
        ok: false,
        error: {
          code: MedicalProvidersErrorCodes.UNAUTHORIZED,
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

    // Validate session ID parameter
    if (!sessionId) {
      return {
        ok: false,
        error: {
          code: MedicalProvidersErrorCodes.VALIDATION_FAILED,
          message: 'Session ID is required'
        }
      }
    }

    // Basic shape validation (not clinical validation - that's in Domain)
    if (!input || typeof input !== 'object') {
      return {
        ok: false,
        error: {
          code: MedicalProvidersErrorCodes.VALIDATION_FAILED,
          message: 'Invalid input data'
        }
      }
    }

    // ============================================================
    // DEPENDENCY INJECTION: Create repository via factory
    // ============================================================
    const repository = createMedicalProvidersRepository()

    // ============================================================
    // DELEGATION: Invoke Application layer use case
    // ============================================================
    // Note: Domain validation happens inside saveStep4 → usecases → mappers
    const result = await saveStep4(repository, input, sessionId, organizationId)

    // ============================================================
    // RESPONSE MAPPING: Convert to Action response
    // ============================================================
    if (!result.ok) {
      return {
        ok: false,
        error: {
          code: result.error?.code ?? MedicalProvidersErrorCodes.UNKNOWN,
          // Generic message - never expose PHI or validation details
          message: 'Failed to save medical providers data'
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
        code: MedicalProvidersErrorCodes.UNKNOWN,
        message: 'An unexpected error occurred'
      }
    }
  }
}
