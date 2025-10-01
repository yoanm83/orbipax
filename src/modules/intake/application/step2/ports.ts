/**
 * Insurance & Eligibility Repository Port - Application Layer
 * OrbiPax Community Mental Health System
 *
 * Defines the contract for insurance & eligibility persistence
 * This is a port in the hexagonal architecture - implementations live in Infrastructure
 *
 * SoC: Contract definition only - NO implementation details
 */

import type {
  InsuranceEligibilityInputDTO,
  InsuranceEligibilityOutputDTO
} from './dtos'

/**
 * Repository response type - standardized for all operations
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
 * Insurance & Eligibility Repository Port
 *
 * Defines the contract that Infrastructure adapters must implement
 * Application layer depends on this abstraction, not concrete implementations
 */
export interface InsuranceEligibilityRepository {
  /**
   * Find insurance & eligibility data by session
   * Must be scoped by organization_id for multi-tenant isolation
   *
   * @param sessionId - Intake session identifier
   * @param organizationId - Organization context for multi-tenant isolation
   * @returns Repository response with insurance data or error
   */
  findBySession(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<InsuranceEligibilityOutputDTO>>

  /**
   * Save insurance & eligibility data for a session
   * Must enforce organization_id scoping for multi-tenant safety
   *
   * @param sessionId - Intake session identifier
   * @param organizationId - Organization context for multi-tenant isolation
   * @param input - Insurance & eligibility data to save
   * @returns Repository response with session ID or error
   */
  save(
    sessionId: string,
    organizationId: string,
    input: InsuranceEligibilityInputDTO
  ): Promise<RepositoryResponse<{ sessionId: string }>>
}

