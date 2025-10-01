/**
 * Diagnoses Repository Port for Step 3
 * OrbiPax Intake Module - Application Layer
 *
 * Defines the contract for clinical assessment data persistence.
 * Implementation will be provided by Infrastructure layer.
 *
 * SoC: Port definition only - NO implementation
 * Pattern: Dependency Injection via Ports & Adapters
 */

import {
  type Step3InputDTO,
  type Step3OutputDTO,
  type RepositoryResponse
} from './dtos'

// =================================================================
// REPOSITORY PORT
// =================================================================

/**
 * Diagnoses Repository Port
 * Contract for clinical assessment data operations
 * Implementation provided by Infrastructure layer via DI
 */
export interface DiagnosesRepository {
  /**
   * Find clinical assessment data by session and organization
   * Multi-tenant: scoped to organization via RLS
   */
  findBySession(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<Step3OutputDTO>>

  /**
   * Save clinical assessment data for a session
   * Multi-tenant: scoped to organization via RLS
   */
  save(
    sessionId: string,
    organizationId: string,
    input: Step3InputDTO
  ): Promise<RepositoryResponse<{ sessionId: string }>>

  /**
   * Check if clinical assessment data exists for a session
   * Multi-tenant: scoped to organization via RLS
   */
  exists(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<{ exists: boolean }>>

  /**
   * Delete clinical assessment data for a session
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
export class MockDiagnosesRepository implements DiagnosesRepository {
  private store = new Map<string, Step3OutputDTO>()

  async findBySession(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<Step3OutputDTO>> {
    const key = `${organizationId}:${sessionId}`
    const data = this.store.get(key)

    if (!data) {
      return {
        ok: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Clinical assessment data not found'
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
    input: Step3InputDTO
  ): Promise<RepositoryResponse<{ sessionId: string }>> {
    const key = `${organizationId}:${sessionId}`

    const outputData: Step3OutputDTO = {
      sessionId,
      organizationId,
      data: {
        diagnoses: input.diagnoses ?? {
          secondaryDiagnoses: [],
          diagnosisRecords: []
        },
        psychiatricEvaluation: input.psychiatricEvaluation ?? {
          currentSymptoms: [],
          hasPsychEval: false
        },
        functionalAssessment: input.functionalAssessment ?? {
          affectedDomains: [],
          adlsIndependence: 'unknown',
          iadlsIndependence: 'unknown',
          cognitiveFunctioning: 'unknown',
          hasSafetyConcerns: false,
          dailyLivingActivities: []
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