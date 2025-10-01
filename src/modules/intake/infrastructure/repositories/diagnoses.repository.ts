/**
 * Diagnoses Repository Implementation - Infrastructure Layer
 * OrbiPax Community Mental Health System
 *
 * Concrete implementation using Supabase for diagnoses persistence
 * Enforces RLS and multi-tenant isolation via organization_id
 *
 * SoC: Persistence adapter only - NO validation, NO business logic
 */

import type { Json } from '@/shared/db'

import type {
  DiagnosesRepository,
  RepositoryResponse,
  Step3InputDTO,
  Step3OutputDTO,
  DiagnosesDTO,
  PsychiatricEvaluationDTO,
  FunctionalAssessmentDTO
} from '@/modules/intake/application/step3'

import type { RowOf, InsertOf } from '../wrappers/supabase.orbipax-core'
import { fromTable, maybeSingle } from '../wrappers/supabase.orbipax-core'

/**
 * Error codes for repository operations
 */
const REPO_ERROR_CODES = {
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
  UNKNOWN: 'UNKNOWN'
} as const

/**
 * Diagnoses Repository Supabase Adapter
 * Implements the DiagnosesRepository port with Supabase persistence
 * Uses RLS for multi-tenant data isolation
 */
export class DiagnosesRepositoryImpl implements DiagnosesRepository {

  /**
   * Find clinical assessment data by session
   * Scoped by organization_id for multi-tenant isolation
   */
  async findBySession(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<Step3OutputDTO>> {
    try {
      const query = fromTable('diagnoses_clinical')
        .select('*')
        .eq('session_id', sessionId)
        .eq('organization_id', organizationId)
        .maybeSingle()

      const { data, error } = await maybeSingle<RowOf<'diagnoses_clinical'>>(query)

      if (error) {
        return {
          ok: false,
          error: {
            code: REPO_ERROR_CODES.UNKNOWN,
            message: 'Failed to retrieve clinical assessment data'
          }
        }
      }

      if (!data) {
        return {
          ok: false,
          error: {
            code: REPO_ERROR_CODES.NOT_FOUND,
            message: 'Clinical assessment data not found'
          }
        }
      }

      // Map DB row to Step3OutputDTO with exactOptionalPropertyTypes pattern
      const output: Step3OutputDTO = {
        sessionId: data.session_id,
        organizationId: data.organization_id,
        data: {
          diagnoses: data.diagnoses as unknown as DiagnosesDTO,
          psychiatricEvaluation: data.psychiatric_evaluation as unknown as PsychiatricEvaluationDTO,
          functionalAssessment: data.functional_assessment as unknown as FunctionalAssessmentDTO
        },
        ...(data.last_modified && { lastModified: data.last_modified }),
        ...(data.completed_at && { completedAt: data.completed_at })
      }

      return {
        ok: true,
        data: output
      }
    } catch {
      return {
        ok: false,
        error: {
          code: REPO_ERROR_CODES.UNKNOWN,
          message: 'An unexpected error occurred'
        }
      }
    }
  }

  /**
   * Save clinical assessment data
   * Creates or updates diagnoses for a session
   * Multi-tenant: scoped to organization via RLS
   */
  async save(
    sessionId: string,
    organizationId: string,
    input: Step3InputDTO
  ): Promise<RepositoryResponse<{ sessionId: string }>> {
    try {
      // Prepare upsert payload with snake_case columns
      const payload: InsertOf<'diagnoses_clinical'> = {
        session_id: sessionId,
        organization_id: organizationId,
        diagnoses: input.diagnoses as unknown as Json,
        psychiatric_evaluation: input.psychiatricEvaluation as unknown as Json,
        functional_assessment: input.functionalAssessment as unknown as Json,
        last_modified: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      const query = fromTable('diagnoses_clinical')
        .upsert(payload, {
          onConflict: 'session_id,organization_id'
        })

      const { error } = await query

      if (error) {
        // Check for conflict errors
        const pgError = error as { code?: string }
        if (pgError.code === '23505') {
          return {
            ok: false,
            error: {
              code: REPO_ERROR_CODES.CONFLICT,
              message: 'Clinical assessment data conflict detected'
            }
          }
        }

        return {
          ok: false,
          error: {
            code: REPO_ERROR_CODES.UNKNOWN,
            message: 'Failed to save clinical assessment data'
          }
        }
      }

      return {
        ok: true,
        data: { sessionId }
      }
    } catch {
      return {
        ok: false,
        error: {
          code: REPO_ERROR_CODES.UNKNOWN,
          message: 'An unexpected error occurred'
        }
      }
    }
  }

  /**
   * Check if clinical assessment data exists
   * Scoped by organization_id for multi-tenant isolation
   */
  async exists(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<{ exists: boolean }>> {
    try {
      const query = fromTable('diagnoses_clinical')
        .select('*', { count: 'exact', head: true })
        .eq('session_id', sessionId)
        .eq('organization_id', organizationId)

      const { count, error } = await query

      if (error) {
        return {
          ok: false,
          error: {
            code: REPO_ERROR_CODES.UNKNOWN,
            message: 'Failed to check clinical assessment data existence'
          }
        }
      }

      return {
        ok: true,
        data: { exists: (count ?? 0) > 0 }
      }
    } catch {
      return {
        ok: false,
        error: {
          code: REPO_ERROR_CODES.UNKNOWN,
          message: 'An unexpected error occurred'
        }
      }
    }
  }

  /**
   * Delete clinical assessment data
   * Scoped by organization_id for multi-tenant isolation
   * Optional method - may not be supported in all environments
   */
  async delete(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<{ deleted: boolean }>> {
    try {
      const query = fromTable('diagnoses_clinical')
        .delete()
        .eq('session_id', sessionId)
        .eq('organization_id', organizationId)

      const { error } = await query

      if (error) {
        return {
          ok: false,
          error: {
            code: REPO_ERROR_CODES.UNKNOWN,
            message: 'Failed to delete clinical assessment data'
          }
        }
      }

      return {
        ok: true,
        data: { deleted: true }
      }
    } catch {
      return {
        ok: false,
        error: {
          code: REPO_ERROR_CODES.UNKNOWN,
          message: 'An unexpected error occurred'
        }
      }
    }
  }
}