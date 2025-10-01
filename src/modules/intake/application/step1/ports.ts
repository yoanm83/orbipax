/**
 * Demographics Repository Port - Application Layer
 * OrbiPax Community Mental Health System
 *
 * Defines the contract for demographics persistence
 * This is a port in the hexagonal architecture - implementations live in Infrastructure
 *
 * SoC: Contract definition only - NO implementation details
 */

import type {
  DemographicsInputDTO,
  DemographicsOutputDTO
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
 * Demographics Repository Port
 *
 * Defines the contract that Infrastructure adapters must implement
 * Application layer depends on this abstraction, not concrete implementations
 */
export interface DemographicsRepository {
  /**
   * Find demographics data by session
   * Must be scoped by organization_id for multi-tenant isolation
   *
   * @param sessionId - Intake session identifier
   * @param organizationId - Organization context for multi-tenant isolation
   * @returns Repository response with demographics data or error
   */
  findBySession(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<DemographicsOutputDTO>>

  /**
   * Save demographics data for a session
   * Must enforce organization_id scoping for multi-tenant safety
   *
   * @param sessionId - Intake session identifier
   * @param organizationId - Organization context for multi-tenant isolation
   * @param input - Demographics data to save
   * @returns Repository response with session ID or error
   */
  save(
    sessionId: string,
    organizationId: string,
    input: DemographicsInputDTO
  ): Promise<RepositoryResponse<{ sessionId: string }>>
}