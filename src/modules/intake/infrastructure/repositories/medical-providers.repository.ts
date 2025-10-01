/**
 * Medical Providers Repository Implementation - Infrastructure Layer
 * OrbiPax Community Mental Health System
 *
 * Real Supabase implementation using views and normalized tables
 * - READ: v_patient_providers_by_session view (session-scoped with RLS)
 * - WRITE: patient_providers table via intake_session_map resolution
 *
 * SoC: Persistence adapter only - NO validation, NO business logic
 */

import "server-only"

import type {
  Step4InputDTO,
  Step4OutputDTO,
  ProvidersDTO,
  PsychiatristDTO
} from '@/modules/intake/application/step4/dtos'
import type {
  MedicalProvidersRepository,
  RepositoryResponse
} from '@/modules/intake/application/step4/ports'

import type { RowOf, ViewRowOf, InsertOf } from '../wrappers/supabase.orbipax-core'
import { fromTable, fromView, exec, singleOrNull } from '../wrappers/supabase.orbipax-core'

/**
 * Error codes for repository operations
 */
const REPO_ERROR_CODES = {
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  UNKNOWN: 'UNKNOWN'
} as const

/**
 * Database row from v_patient_providers_by_session view
 * Uses regenerated DB types for type safety
 */
type ProviderViewRow = ViewRowOf<'v_patient_providers_by_session'>

/**
 * Maps view rows to Step4OutputDTO
 * Aggregates providers by type into structured DTO sections
 *
 * @param rows - Rows from v_patient_providers_by_session
 * @param sessionId - Session identifier
 * @param organizationId - Organization identifier
 * @returns Step4OutputDTO with providers and psychiatrist sections
 */
function mapViewRowsToOutputDTO(
  rows: ProviderViewRow[],
  sessionId: string,
  organizationId: string
): Step4OutputDTO {
  // Find PCP provider (provider_type = 'pcp')
  const pcpRow = rows.find(r => r.provider_type === 'pcp')

  // Find psychiatrist/evaluator (provider_type IN ('psychiatrist', 'evaluator'))
  const psychiatristRow = rows.find(r => r.provider_type === 'psychiatrist')
  const evaluatorRow = rows.find(r => r.provider_type === 'evaluator')

  // Map PCP section
  const providers: ProvidersDTO = {
    hasPCP: pcpRow ? 'Yes' : 'Unknown',
    ...(pcpRow?.name !== null && pcpRow?.name !== undefined && { pcpName: pcpRow.name }),
    ...(pcpRow?.phone !== null && pcpRow?.phone !== undefined && { pcpPhone: pcpRow.phone }),
    ...(pcpRow?.practice !== null && pcpRow?.practice !== undefined && { pcpPractice: pcpRow.practice }),
    ...(pcpRow?.address !== null && pcpRow?.address !== undefined && { pcpAddress: pcpRow.address }),
    ...(pcpRow?.authorized_to_share !== null && pcpRow?.authorized_to_share !== undefined && { authorizedToShare: pcpRow.authorized_to_share })
  }

  // Map Psychiatrist section
  const psychiatrist: PsychiatristDTO = {
    hasBeenEvaluated: (psychiatristRow ?? evaluatorRow) ? 'Yes' : 'No',
    ...(psychiatristRow?.name !== null && psychiatristRow?.name !== undefined && { psychiatristName: psychiatristRow.name }),
    ...((psychiatristRow?.evaluation_date ?? evaluatorRow?.evaluation_date) !== null && (psychiatristRow?.evaluation_date ?? evaluatorRow?.evaluation_date) !== undefined && { evaluationDate: (psychiatristRow?.evaluation_date ?? evaluatorRow?.evaluation_date) as string }),
    ...(psychiatristRow?.practice !== null && psychiatristRow?.practice !== undefined && { clinicName: psychiatristRow.practice }),
    ...(psychiatristRow?.notes !== null && psychiatristRow?.notes !== undefined && { notes: psychiatristRow.notes }),
    differentEvaluator: !!evaluatorRow,
    ...(evaluatorRow?.name !== null && evaluatorRow?.name !== undefined && { evaluatorName: evaluatorRow.name }),
    ...(evaluatorRow?.practice !== null && evaluatorRow?.practice !== undefined && { evaluatorClinic: evaluatorRow.practice })
  }

  // Find latest modification timestamp
  const latestTimestamp = rows.reduce((latest, row) => {
    const timestamp = row.updated_at ?? row.created_at ?? ''
    return timestamp > latest ? timestamp : latest
  }, rows[0]?.created_at ?? new Date().toISOString())

  return {
    sessionId,
    organizationId,
    data: {
      providers,
      psychiatrist
    },
    lastModified: latestTimestamp
  }
}

/**
 * Medical Providers Repository Supabase Adapter
 * Implements the MedicalProvidersRepository port with real persistence
 * Uses RLS for multi-tenant data isolation - all queries filtered by organization_id
 */
export class MedicalProvidersRepositoryImpl implements MedicalProvidersRepository {

  /**
   * Find medical providers data by session
   * Uses v_patient_providers_by_session view (RLS enforced)
   *
   * RLS: View filters by organization_id automatically
   * Patient ID resolution: View handles session_id → patient_id mapping
   *
   * @param sessionId - Intake session identifier
   * @param organizationId - Organization context for multi-tenant isolation
   * @returns Repository response with Step4OutputDTO or error
   */
  async findBySession(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<Step4OutputDTO>> {
    try {
      // Query view with session_id + organization_id filter
      const query = fromView('v_patient_providers_by_session')
          .select(`
            session_id,
            organization_id,
            patient_id,
            provider_type,
            name,
            phone,
            email,
            practice,
            address,
            authorized_to_share,
            notes,
            evaluation_date,
            created_at,
            updated_at
          `)
          .eq('session_id', sessionId)
          .eq('organization_id', organizationId)

      const { data: rows, error } = await exec<ViewRowOf<'v_patient_providers_by_session'>>(query as any)

      if (error) {
        // PostgREST returns PGRST116 for empty result
        if ((error as { code?: string }).code === 'PGRST116') {
          return {
            ok: false,
            error: {
              code: REPO_ERROR_CODES.NOT_FOUND,
              message: 'No provider data found for session'
            }
          }
        }

        // Generic error (no PHI)
        return {
          ok: false,
          error: {
            code: REPO_ERROR_CODES.UNKNOWN,
            message: 'Could not retrieve provider data'
          }
        }
      }

      // Empty result (no providers for this session)
      if (!rows || rows.length === 0) {
        return {
          ok: false,
          error: {
            code: REPO_ERROR_CODES.NOT_FOUND,
            message: 'No provider data found for session'
          }
        }
      }

      // Map view rows to DTO
      const outputDTO = mapViewRowsToOutputDTO(
        rows,
        sessionId,
        organizationId
      )

      return {
        ok: true,
        data: outputDTO
      }

    } catch {
      return {
        ok: false,
        error: {
          code: REPO_ERROR_CODES.UNKNOWN,
          message: 'Operation failed'
        }
      }
    }
  }

  /**
   * Save medical providers data for a session
   * Transactional upsert to patient_providers table with RLS
   *
   * Resolution: Uses intake_session_map to get patient_id from session_id
   * Upsert strategy:
   * - PCP (provider_type='pcp'): one record per patient
   * - Psychiatrist (provider_type='psychiatrist'): one record per patient
   * - Evaluator (provider_type='evaluator'): one record per patient (if different)
   *
   * RLS: All inserts/updates filtered by organization_id automatically
   *
   * @param sessionId - Intake session identifier
   * @param organizationId - Organization context for multi-tenant isolation
   * @param input - Medical providers data to save
   * @returns Repository response with sessionId or error
   */
  async save(
    sessionId: string,
    organizationId: string,
    input: Step4InputDTO
  ): Promise<RepositoryResponse<{ sessionId: string }>> {
    try {
      // 1. Resolve patient_id from session_id via intake_session_map
      const { data: sessionMap, error: sessionError } = await singleOrNull<RowOf<'intake_session_map'>>(
        fromTable('intake_session_map')
          .select('patient_id')
          .eq('session_id', sessionId)
          .eq('organization_id', organizationId)
          .single()
      )

      if (sessionError || !sessionMap) {
        return {
          ok: false,
          error: {
            code: REPO_ERROR_CODES.NOT_FOUND,
            message: 'Session not found'
          }
        }
      }

      const patientId = sessionMap.patient_id

      // 2. Process PCP provider (if provided)
      if (input.providers) {
        const { hasPCP, pcpName, pcpPhone, pcpPractice, pcpAddress, authorizedToShare } = input.providers

        // Only save if PCP data is provided
        if (hasPCP === 'Yes' && pcpName) {
          const { error: pcpError } = await exec<RowOf<'patient_providers'>>(
            fromTable('patient_providers')
              .upsert({
                patient_id: patientId,
                organization_id: organizationId,
                provider_type: 'pcp',
                name: pcpName,
                phone: pcpPhone ?? null,
                practice: pcpPractice ?? null,
                address: pcpAddress ?? null,
                shares_records: authorizedToShare ?? null,
                notes: null,
                updated_at: new Date().toISOString()
              } as InsertOf<'patient_providers'>, {
                onConflict: 'patient_id,organization_id,provider_type',
                ignoreDuplicates: false
              })
          )

          if (pcpError) {
            return {
              ok: false,
              error: {
                code: REPO_ERROR_CODES.UNKNOWN,
                message: 'Could not save PCP provider'
              }
            }
          }
        } else if (hasPCP === 'No') {
          // Delete PCP if user explicitly says no
          await exec<RowOf<'patient_providers'>>(
            fromTable('patient_providers')
              .delete()
              .eq('patient_id', patientId)
              .eq('organization_id', organizationId)
              .eq('provider_type', 'pcp')
          )
        }
      }

      // 3. Process Psychiatrist/Evaluator (if provided)
      if (input.psychiatrist) {
        const {
          hasBeenEvaluated,
          psychiatristName,
          evaluationDate,
          clinicName,
          notes,
          differentEvaluator,
          evaluatorName,
          evaluatorClinic
        } = input.psychiatrist

        if (hasBeenEvaluated === 'Yes') {
          // Save psychiatrist record
          if (psychiatristName) {
            const { error: psychError } = await exec<RowOf<'patient_providers'>>(
              fromTable('patient_providers')
                .upsert({
                  patient_id: patientId,
                  organization_id: organizationId,
                  provider_type: 'psychiatrist',
                  name: psychiatristName,
                  practice: clinicName ?? null,
                  notes: notes ?? null,
                  evaluation_date: evaluationDate ?? null,
                  phone: null,
                  email: null,
                  address: null,
                  shares_records: null,
                  updated_at: new Date().toISOString()
                } as InsertOf<'patient_providers'>, {
                  onConflict: 'patient_id,organization_id,provider_type',
                  ignoreDuplicates: false
                })
            )

            if (psychError) {
              return {
                ok: false,
                error: {
                  code: REPO_ERROR_CODES.UNKNOWN,
                  message: 'Could not save psychiatrist provider'
                }
              }
            }
          }

          // Save separate evaluator record if different
          if (differentEvaluator && evaluatorName) {
            const { error: evalError } = await exec<RowOf<'patient_providers'>>(
              fromTable('patient_providers')
                .upsert({
                  patient_id: patientId,
                  organization_id: organizationId,
                  provider_type: 'evaluator',
                  name: evaluatorName,
                  practice: evaluatorClinic ?? null,
                  evaluation_date: evaluationDate ?? null,
                  notes: null,
                  phone: null,
                  email: null,
                  address: null,
                  shares_records: null,
                  updated_at: new Date().toISOString()
                } as InsertOf<'patient_providers'>, {
                  onConflict: 'patient_id,organization_id,provider_type',
                  ignoreDuplicates: false
                })
            )

            if (evalError) {
              return {
                ok: false,
                error: {
                  code: REPO_ERROR_CODES.UNKNOWN,
                  message: 'Could not save evaluator provider'
                }
              }
            }
          } else {
            // Delete evaluator if no longer different
            await exec<RowOf<'patient_providers'>>(
              fromTable('patient_providers')
                .delete()
                .eq('patient_id', patientId)
                .eq('organization_id', organizationId)
                .eq('provider_type', 'evaluator')
            )
          }
        } else {
          // Delete both if not evaluated
          await exec<RowOf<'patient_providers'>>(
            fromTable('patient_providers')
              .delete()
              .eq('patient_id', patientId)
              .eq('organization_id', organizationId)
              .in('provider_type', ['psychiatrist', 'evaluator'])
          )
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
          message: 'Operation failed'
        }
      }
    }
  }

  /**
   * Check if medical providers data exists for a session
   * Uses patient_providers table via session → patient_id resolution
   *
   * @param sessionId - Intake session identifier
   * @param organizationId - Organization context for multi-tenant isolation
   * @returns Repository response with exists flag
   */
  async exists(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<{ exists: boolean }>> {
    try {
      // 1. Resolve patient_id from session_id
      const { data: sessionMap, error: sessionError } = await singleOrNull<RowOf<'intake_session_map'>>(
        fromTable('intake_session_map')
          .select('patient_id')
          .eq('session_id', sessionId)
          .eq('organization_id', organizationId)
          .single()
      )

      if (sessionError || !sessionMap) {
        return {
          ok: true,
          data: { exists: false }
        }
      }

      // 2. Check if any providers exist for patient
      const { data, error } = await singleOrNull<RowOf<'patient_providers'>>(
        fromTable('patient_providers')
          .select('id')
          .eq('patient_id', sessionMap.patient_id)
          .eq('organization_id', organizationId)
          .limit(1)
          .single()
      )

      if (error) {
        // PGRST116 means no rows found
        if ((error as { code?: string }).code === 'PGRST116') {
          return {
            ok: true,
            data: { exists: false }
          }
        }

        return {
          ok: false,
          error: {
            code: REPO_ERROR_CODES.UNKNOWN,
            message: 'Could not check existence'
          }
        }
      }

      return {
        ok: true,
        data: { exists: !!data }
      }

    } catch {
      return {
        ok: false,
        error: {
          code: REPO_ERROR_CODES.UNKNOWN,
          message: 'Operation failed'
        }
      }
    }
  }

  /**
   * Delete medical providers data for a session
   * Deletes all provider records for patient resolved via session_id
   *
   * @param sessionId - Intake session identifier
   * @param organizationId - Organization context for multi-tenant isolation
   * @returns Repository response with deleted flag
   */
  async delete(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<{ deleted: boolean }>> {
    try {
      // 1. Resolve patient_id from session_id
      const { data: sessionMap, error: sessionError } = await singleOrNull<RowOf<'intake_session_map'>>(
        fromTable('intake_session_map')
          .select('patient_id')
          .eq('session_id', sessionId)
          .eq('organization_id', organizationId)
          .single()
      )

      if (sessionError || !sessionMap) {
        return {
          ok: true,
          data: { deleted: false }
        }
      }

      // 2. Delete all provider records for patient
      const { error: deleteError } = await exec<RowOf<'patient_providers'>>(
        fromTable('patient_providers')
          .delete()
          .eq('patient_id', sessionMap.patient_id)
          .eq('organization_id', organizationId)
      )

      if (deleteError) {
        return {
          ok: false,
          error: {
            code: REPO_ERROR_CODES.UNKNOWN,
            message: 'Could not delete provider data'
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
          message: 'Operation failed'
        }
      }
    }
  }
}

/**
 * Export singleton instance
 * This will be replaced with proper instantiation via factory
 */
export const medicalProvidersRepository = new MedicalProvidersRepositoryImpl()
