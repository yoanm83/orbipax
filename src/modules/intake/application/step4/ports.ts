/**
 * Medical Providers Repository Port for Step 4
 * OrbiPax Intake Module - Application Layer
 *
 * Defines the contract for medical providers data persistence.
 * Implementation will be provided by Infrastructure layer.
 *
 * SoC: Port definition only - NO implementation
 * Pattern: Dependency Injection via Ports & Adapters
 */

import type {
  Step4InputDTO,
  Step4OutputDTO,
  RepositoryResponse
} from './dtos'

// Re-export RepositoryResponse for use by infrastructure layer
export type { RepositoryResponse }

// =================================================================
// REPOSITORY PORT
// =================================================================

/**
 * Medical Providers Repository Port
 * Contract for medical providers data operations
 * Implementation provided by Infrastructure layer via DI
 */
export interface MedicalProvidersRepository {
  /**
   * Find medical providers data by session and organization
   * Multi-tenant: scoped to organization via RLS
   */
  findBySession(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<Step4OutputDTO>>

  /**
   * Save medical providers data for a session
   * Multi-tenant: scoped to organization via RLS
   */
  save(
    sessionId: string,
    organizationId: string,
    input: Step4InputDTO
  ): Promise<RepositoryResponse<{ sessionId: string }>>

  /**
   * Check if medical providers data exists for a session
   * Multi-tenant: scoped to organization via RLS
   */
  exists(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<{ exists: boolean }>>

  /**
   * Delete medical providers data for a session
   * Multi-tenant: scoped to organization via RLS
   * Optional: may not be implemented in all adapters
   */
  delete?(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<{ deleted: boolean }>>
}

// =================================================================
// MOCK REPOSITORY (FOR TESTING ONLY)
// =================================================================

/**
 * Mock implementation for testing
 * Will be replaced by real implementation in Infrastructure
 */
export class MockMedicalProvidersRepository implements MedicalProvidersRepository {
  private store = new Map<string, Step4OutputDTO>()

  async findBySession(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<Step4OutputDTO>> {
    const key = `${organizationId}:${sessionId}`
    const data = this.store.get(key)

    if (!data) {
      return {
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Medical providers data not found'
        }
      }
    }

    return {
      ok: true,
      data
    }
  }

  async save(
    sessionId: string,
    organizationId: string,
    input: Step4InputDTO
  ): Promise<RepositoryResponse<{ sessionId: string }>> {
    const key = `${organizationId}:${sessionId}`

    const outputData: Step4OutputDTO = {
      sessionId,
      organizationId,
      data: {
        providers: input.providers ?? {
          hasPCP: 'Unknown'
        },
        psychiatrist: input.psychiatrist ?? {
          hasBeenEvaluated: 'No'
        }
      },
      lastModified: new Date().toISOString()
    }

    this.store.set(key, outputData)

    return {
      ok: true,
      data: { sessionId }
    }
  }

  async exists(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<{ exists: boolean }>> {
    const key = `${organizationId}:${sessionId}`
    return {
      ok: true,
      data: { exists: this.store.has(key) }
    }
  }

  async delete(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<{ deleted: boolean }>> {
    const key = `${organizationId}:${sessionId}`
    const deleted = this.store.delete(key)

    return {
      ok: true,
      data: { deleted }
    }
  }

  // Test helper methods
  clear() {
    this.store.clear()
  }

  size() {
    return this.store.size
  }
}
