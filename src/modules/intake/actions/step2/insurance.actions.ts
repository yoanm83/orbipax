/**
 * Insurance & Eligibility Server Actions for Step 2
 * OrbiPax Community Mental Health System
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
  loadInsuranceEligibility,
  saveInsuranceEligibility,
  type InsuranceEligibilityInputDTO,
  type InsuranceEligibilityOutputDTO,
  type InsuranceCoverageDTO
} from '@/modules/intake/application/step2'

// Import factory from Infrastructure layer for dependency injection
import { createInsuranceEligibilityRepository } from '@/modules/intake/infrastructure/factories/insurance-eligibility.factory'

/**
 * Action Response type - standardized for all actions
 * JSON-serializable contract for UI
 */
type ActionResponse<T = void> = {
  ok: boolean
  data?: T
  error?: {
    code: string
    message?: string // Generic messages only, no PII
  }
}

/**
 * Load Insurance & Eligibility Action
 *
 * Retrieves insurance & eligibility data for the current session
 * Enforces auth and multi-tenant isolation
 *
 * @returns Insurance & eligibility data or error response
 */
export async function loadInsuranceEligibilityAction(): Promise<ActionResponse<InsuranceEligibilityOutputDTO>> {
  try {
    // Auth guard - get user and organization
    let userId: string
    let organizationId: string

    try {
      const auth = await resolveUserAndOrg()
      userId = auth.userId
      organizationId = auth.organizationId
    } catch {
      // Auth/session failed - return generic error
      return {
        ok: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Request failed'
        }
      }
    }

    // Validate organization context
    if (!organizationId) {
      return {
        ok: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Request failed'
        }
      }
    }

    // TODO: Get actual session ID from context/params
    // For now using a deterministic session ID based on user
    const sessionId = `session_${userId}_intake`

    // Create repository instance using factory (skeleton for now)
    const repository = createInsuranceEligibilityRepository()

    // Compose dependencies and delegate to Application layer
    const result = await loadInsuranceEligibility(repository, sessionId, organizationId)

    // Map Application response to Action response
    if (!result.ok) {
      // Always return generic error messages
      return {
        ok: false,
        error: {
          code: result.error?.code ?? 'UNKNOWN',
          message: 'Request failed'
        }
      }
    }

    return {
      ok: true,
      data: result.data
    }
  } catch {
    // Unexpected error - return generic error
    return {
      ok: false,
      error: {
        code: 'UNKNOWN',
        message: 'Request failed'
      }
    }
  }
}

/**
 * Upsert Insurance & Eligibility Action
 *
 * Creates or updates insurance & eligibility data for the current session
 * Enforces auth and multi-tenant isolation
 * Uses generic parameter type for safety
 *
 * @param input - Insurance & eligibility data to save (unknown type for safety)
 * @returns Success response or error
 */
export async function upsertInsuranceEligibilityAction(
  input: unknown
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
      // Auth/session failed - return generic error
      return {
        ok: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Request failed'
        }
      }
    }

    // Validate organization context
    if (!organizationId) {
      return {
        ok: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Request failed'
        }
      }
    }

    // TODO: Get actual session ID from context/params
    // For now using a deterministic session ID based on user
    const sessionId = `session_${userId}_intake`

    // Cast input to expected DTO type (validation happens in Application layer)
    const typedInput = input as InsuranceEligibilityInputDTO

    // Create repository instance using factory (skeleton for now)
    const repository = createInsuranceEligibilityRepository()

    // Compose dependencies and delegate to Application layer
    // Using saveInsuranceEligibility which handles both create and update
    const result = await saveInsuranceEligibility(repository, typedInput, sessionId, organizationId)

    // Map Application response to Action response
    if (!result.ok) {
      // Always return generic error messages
      return {
        ok: false,
        error: {
          code: result.error?.code ?? 'UNKNOWN',
          message: 'Request failed'
        }
      }
    }

    return {
      ok: true,
      data: result.data
    }
  } catch {
    // Unexpected error - return generic error
    return {
      ok: false,
      error: {
        code: 'UNKNOWN',
        message: 'Request failed'
      }
    }
  }
}

/**
 * Save Insurance Coverage Action
 *
 * Saves a single insurance coverage record using RPC upsert_insurance_with_primary_swap
 * Enforces auth and delegates to Infrastructure.saveCoverage
 *
 * @param input - { patientId: string, coverage: InsuranceCoverageDTO }
 * @returns Success response with record ID or error
 */
export async function saveInsuranceCoverageAction(
  input: { patientId?: string; coverage: unknown }
): Promise<ActionResponse<{ id: string }>> {
  try {
    // Auth guard - get user and organization
    let userId: string
    let organizationId: string

    try {
      const auth = await resolveUserAndOrg()
      userId = auth.userId
      organizationId = auth.organizationId
    } catch {
      // Auth/session failed - return generic error
      return {
        ok: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Access denied'
        }
      }
    }

    // Validate organization context
    if (!organizationId) {
      return {
        ok: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Access denied'
        }
      }
    }

    // Resolve patientId: Use provided value or generate session-based identifier
    // This follows the same pattern as Step 1 Demographics (see demographics.actions.ts:78-80)
    const resolvedPatientId = input.patientId ?? `session_${userId}_intake`

    // Cast coverage to expected DTO type (validation happens in Application/Domain layer)
    const typedCoverage = input.coverage as InsuranceCoverageDTO

    // Create repository instance using factory
    const repository = createInsuranceEligibilityRepository()

    // Delegate to Infrastructure layer saveCoverage method
    const result = await repository.saveCoverage(resolvedPatientId, typedCoverage)

    // Map Infrastructure response to Action response with generic error messages
    if (!result.ok) {
      // Map specific error codes to generic messages (no PII, no DB details)
      let message = 'Could not save insurance record'

      if (result.error?.code === 'UNIQUE_VIOLATION_PRIMARY') {
        message = 'Another primary insurance exists for this patient'
      } else if (result.error?.code === 'CHECK_VIOLATION') {
        message = 'Invalid amount: values must be non-negative'
      } else if (result.error?.code === 'UNAUTHORIZED') {
        message = 'Access denied'
      }

      return {
        ok: false,
        error: {
          code: result.error?.code ?? 'UNKNOWN',
          message
        }
      }
    }

    return {
      ok: true,
      data: result.data
    }
  } catch {
    // Unexpected error - return generic error (no stack trace, no PII)
    return {
      ok: false,
      error: {
        code: 'UNKNOWN',
        message: 'Unexpected error'
      }
    }
  }
}

/**
 * Get Insurance Snapshot Action
 *
 * Retrieves insurance & eligibility snapshot from v_patient_insurance_eligibility_snapshot view
 * Enforces auth and delegates to Infrastructure.getSnapshot
 *
 * @param input - { patientId: string }
 * @returns Snapshot data or error
 */
export async function getInsuranceSnapshotAction(
  input: { patientId: string }
): Promise<ActionResponse<InsuranceEligibilityOutputDTO>> {
  try {
    // Auth guard - get user and organization
    let organizationId: string

    try {
      const auth = await resolveUserAndOrg()
      organizationId = auth.organizationId
    } catch {
      // Auth/session failed - return generic error
      return {
        ok: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Access denied'
        }
      }
    }

    // Validate organization context
    if (!organizationId) {
      return {
        ok: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Access denied'
        }
      }
    }

    // Validate input
    if (!input.patientId ?? typeof input.patientId !== 'string') {
      return {
        ok: false,
        error: {
          code: 'VALIDATION_FAILED',
          message: 'Invalid patient identifier'
        }
      }
    }

    // Create repository instance using factory
    const repository = createInsuranceEligibilityRepository()

    // Delegate to Infrastructure layer getSnapshot method
    const result = await repository.getSnapshot(input.patientId)

    // Map Infrastructure response to Action response with generic error messages
    if (!result.ok) {
      // Map specific error codes to generic messages
      let message = 'Could not retrieve insurance snapshot'

      if (result.error?.code === 'NOT_FOUND') {
        message = 'No insurance records found'
      } else if (result.error?.code === 'UNAUTHORIZED') {
        message = 'Access denied'
      } else if (result.error?.code === 'NOT_IMPLEMENTED') {
        message = 'Snapshot not available'
      }

      return {
        ok: false,
        error: {
          code: result.error?.code ?? 'UNKNOWN',
          message
        }
      }
    }

    return {
      ok: true,
      data: result.data
    }
  } catch {
    // Unexpected error - return generic error (no stack trace, no PII)
    return {
      ok: false,
      error: {
        code: 'UNKNOWN',
        message: 'Unexpected error'
      }
    }
  }
}
