/**
 * Insurance & Eligibility Repository Implementation - Infrastructure Layer
 * OrbiPax Community Mental Health System
 *
 * Real Supabase implementation using RPC and snapshot views
 * - WRITE: upsert_insurance_with_primary_swap RPC function
 * - READ: v_patient_insurance_eligibility_snapshot view
 *
 * SoC: Persistence adapter only - NO validation, NO business logic
 */

import "server-only"
import type { Json } from '@/shared/db'

import type {
  InsuranceEligibilityRepository,
  RepositoryResponse,
  InsuranceEligibilityInputDTO,
  InsuranceEligibilityOutputDTO,
  InsuranceCoverageDTO
} from '@/modules/intake/application/step2'

import type { ViewRowOf } from '../wrappers/supabase.orbipax-core'
import { fromView, maybeSingle, createTypedClient } from '../wrappers/supabase.orbipax-core'

/**
 * Error codes for repository operations
 */
const REPO_ERROR_CODES = {
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  UNIQUE_VIOLATION_PRIMARY: 'UNIQUE_VIOLATION_PRIMARY',
  CHECK_VIOLATION: 'CHECK_VIOLATION',
  UNAUTHORIZED: 'UNAUTHORIZED',
  UNKNOWN: 'UNKNOWN'
} as const

/**
 * Maps InsuranceCoverageDTO to JSONB payload for RPC function
 * Converts camelCase DTO fields to snake_case DB columns
 *
 * @param dto - Application layer DTO
 * @returns JSONB record for Postgres RPC
 */
function mapCoverageDTOToJSONB(dto: InsuranceCoverageDTO): Json {
  return {
    // Identity
    member_id: dto.policyNumber,
    subscriber_name: dto.subscriberName ?? null,
    subscriber_ssn: dto.subscriberSSN ?? null,
    subscriber_dob: dto.subscriberDateOfBirth ?? null,

    // Plan Details
    plan_kind: dto.planKind ?? null,
    plan_name: dto.planName ?? null,

    // Carrier (maps to payer in DB)
    payer_name: dto.carrierName ?? null,
    payer_id: null, // Not in DTO, DB field only
    group_number: dto.groupNumber ?? null,

    // Coverage
    is_primary: dto.isPrimary ?? false,
    effective_date: dto.effectiveDate ?? null,
    termination_date: dto.expirationDate ?? null,

    // Copay/Coinsurance (maps to mentalHealth fields in DTO)
    copay_amount: dto.mentalHealthCopay ?? null,
    coinsurance_percentage: null, // Not in DTO, DB field only
    deductible_amount: dto.mentalHealthDeductible ?? null,
    out_of_pocket_max: dto.annualMentalHealthLimit ?? null
  }
}

/**
 * Maps Postgres error to generic RepositoryResponse
 * SECURITY: Never expose PII (SSN, DOB, names) or internal DB details
 *
 * @param error - Postgres error object
 * @returns Generic error response
 */
function mapPostgresError(error: unknown): RepositoryResponse<never> {
  const pgError = error as { code?: string }
  // Unique violation (is_primary constraint)
  if (pgError.code === '23505') {
    return {
      ok: false,
      error: {
        code: REPO_ERROR_CODES.UNIQUE_VIOLATION_PRIMARY,
        message: 'Another primary insurance exists for this patient'
      }
    }
  }

  // Check constraint violation (e.g., copay_amount >= 0)
  if (pgError.code === '23514') {
    return {
      ok: false,
      error: {
        code: REPO_ERROR_CODES.CHECK_VIOLATION,
        message: 'Invalid amount: values must be non-negative'
      }
    }
  }

  // RLS policy violation
  if (pgError.code === '42501') {
    return {
      ok: false,
      error: {
        code: REPO_ERROR_CODES.UNAUTHORIZED,
        message: 'Access denied'
      }
    }
  }

  // Generic error (do not expose internal details)
  return {
    ok: false,
    error: {
      code: REPO_ERROR_CODES.UNKNOWN,
      message: 'Could not save insurance record'
    }
  }
}

/**
 * Maps snapshot view row to InsuranceEligibilityOutputDTO
 * Converts JSON aggregates and snake_case fields to camelCase DTO
 *
 * @param viewRow - Row from v_patient_insurance_eligibility_snapshot
 * @param patientId - Patient UUID for session reference
 * @returns Mapped DTO with insurance coverages array
 */
function mapSnapshotViewToDTO(
  viewRow: ViewRowOf<'v_patient_insurance_eligibility_snapshot'>,
  patientId: string
): InsuranceEligibilityOutputDTO {
  // Extract JSON aggregates from view (use bracket notation for index signatures)
  const insuranceJson = viewRow['insurance'] as unknown[] | null
  const eligibilityCriteriaJson = viewRow['eligibility_criteria'] as Record<string, unknown> | null
  const financialsJson = viewRow['financials'] as Record<string, unknown> | null
  const determinationJson = viewRow['determination'] as Record<string, unknown> | null

  // Map insurance array from JSON to InsuranceCoverageDTO[]
  const insuranceCoverages: InsuranceCoverageDTO[] = Array.isArray(insuranceJson)
    ? insuranceJson.map(record => mapInsuranceRecordToDTO(record as Record<string, unknown>))
    : []

  // Map eligibility criteria from JSON (if exists)
  const eligibilityCriteria = eligibilityCriteriaJson
    ? mapEligibilityCriteriaFromJSON(eligibilityCriteriaJson)
    : getDefaultEligibilityCriteria()

  // Map financial information from JSON (if exists)
  const financialInformation = financialsJson
    ? mapFinancialInformationFromJSON(financialsJson)
    : getDefaultFinancialInformation()

  // Build the input DTO structure
  const inputDTO: InsuranceEligibilityInputDTO = {
    insuranceCoverages,
    isUninsured: insuranceCoverages.length === 0,
    uninsuredReason: insuranceCoverages.length === 0 ? ((determinationJson?.['uninsured_reason'] as string) ?? null) : null,
    eligibilityCriteria,
    financialInformation,
    eligibilityStatus: (determinationJson?.['eligibility_status'] as string) ?? null,
    eligibilityDeterminedBy: (determinationJson?.['eligibility_determined_by'] as string) ?? null,
    eligibilityDeterminationDate: (determinationJson?.['eligibility_determination_date'] as string) ?? null,
    eligibilityNotes: (determinationJson?.['eligibility_notes'] as string) ?? null
  }

  // Return the output DTO with metadata
  return {
    sessionId: patientId, // Use patientId as session reference
    organizationId: viewRow['organization_id'] as string,
    data: inputDTO,
    completionStatus: insuranceCoverages.length > 0 ? 'partial' : 'incomplete',
    verificationStatus: insuranceCoverages.some((c: InsuranceCoverageDTO) => c.isVerified)
      ? 'verified'
      : 'unverified'
  }
}

/**
 * Maps single insurance record from JSON to InsuranceCoverageDTO
 * Converts snake_case DB fields to camelCase DTO fields
 *
 * @param record - Insurance record from JSON aggregate
 * @returns InsuranceCoverageDTO with dates as ISO strings
 */
function mapInsuranceRecordToDTO(record: Record<string, unknown>): InsuranceCoverageDTO {
  return {
    type: (record['insurance_type'] as string) ?? 'other',
    carrierName: (record['carrier_name'] as string) ?? '',
    policyNumber: (record['member_id'] as string) ?? '',
    groupNumber: (record['group_number'] as string) ?? null,
    planKind: (record['plan_kind'] as string) ?? null,
    planName: (record['plan_name'] as string) ?? null,
    subscriberName: (record['subscriber_name'] as string) ?? '',
    subscriberDateOfBirth: (record['subscriber_dob'] as string) ?? '',
    subscriberRelationship: (record['subscriber_relationship'] as string) ?? 'self',
    subscriberSSN: (record['subscriber_ssn'] as string) ?? null,
    effectiveDate: (record['effective_date'] as string) ?? '',
    expirationDate: (record['termination_date'] as string) ?? null,
    isPrimary: (record['is_primary'] as boolean) ?? false,
    isVerified: (record['is_verified'] as boolean) ?? false,
    verificationDate: (record['verification_date'] as string) ?? null,
    verificationNotes: (record['verification_notes'] as string) ?? null,
    hasMentalHealthCoverage: (record['mh_coverage'] as string) ?? 'unknown',
    mentalHealthCopay: (record['mh_copay'] as number) ?? null,
    mentalHealthDeductible: (record['mh_deductible'] as number) ?? null,
    annualMentalHealthLimit: (record['mh_annual_limit'] as number) ?? null,
    requiresPreAuth: (record['requires_preauth'] as string) ?? 'unknown',
    preAuthNumber: (record['preauth_number'] as string) ?? null,
    preAuthExpiration: (record['preauth_expiration'] as string) ?? null
  }
}

/**
 * Maps eligibility criteria from JSON to EligibilityCriteriaDTO
 *
 * @param json - Eligibility criteria JSON from view
 * @returns EligibilityCriteriaDTO
 */
function mapEligibilityCriteriaFromJSON(json: Record<string, unknown>): InsuranceEligibilityInputDTO['eligibilityCriteria'] {
  return {
    residesInServiceArea: (json['resides_in_service_area'] as string) ?? 'unknown',
    serviceAreaCounty: (json['service_area_county'] as string) ?? null,
    ageGroup: (json['age_group'] as string) ?? 'adult',
    isEligibleByAge: (json['is_eligible_by_age'] as boolean) ?? false,
    hasDiagnosedMentalHealth: (json['has_diagnosed_mental_health'] as string) ?? 'unknown',
    diagnosisVerified: (json['diagnosis_verified'] as boolean) ?? false,
    functionalImpairmentLevel: (json['functional_impairment_level'] as string) ?? null,
    impactsDaily: (json['impacts_daily'] as string) ?? 'unknown',
    impactsWork: (json['impacts_work'] as string) ?? 'unknown',
    impactsRelationships: (json['impacts_relationships'] as string) ?? 'unknown',
    suicidalIdeation: (json['suicidal_ideation'] as string) ?? 'unknown',
    substanceUse: (json['substance_use'] as string) ?? 'unknown',
    domesticViolence: (json['domestic_violence'] as string) ?? 'unknown',
    homelessness: (json['homelessness'] as string) ?? 'unknown',
    isVeteran: (json['is_veteran'] as boolean) ?? false,
    isPregnantPostpartum: (json['is_pregnant_postpartum'] as boolean) ?? false,
    isFirstResponder: (json['is_first_responder'] as boolean) ?? false,
    hasDisability: (json['has_disability'] as boolean) ?? false,
    hasMinorChildren: (json['has_minor_children'] as boolean) ?? false,
    involvedWithDCF: (json['involved_with_dcf'] as boolean) ?? false,
    courtOrdered: (json['court_ordered'] as boolean) ?? false,
    orderType: (json['order_type'] as string) ?? null,
    referralSource: (json['referral_source'] as string) ?? null,
    referralAgency: (json['referral_agency'] as string) ?? null,
    referralContact: (json['referral_contact'] as string) ?? null,
    referralDate: (json['referral_date'] as string) ?? null
  }
}

/**
 * Maps financial information from JSON to FinancialInformationDTO
 *
 * @param json - Financial information JSON from view
 * @returns FinancialInformationDTO
 */
function mapFinancialInformationFromJSON(json: Record<string, unknown>): InsuranceEligibilityInputDTO['financialInformation'] {
  return {
    householdIncome: (json['household_income'] as number) ?? null,
    householdSize: (json['household_size'] as number) ?? null,
    federalPovertyLevel: (json['federal_poverty_level'] as number) ?? null,
    fplPercentage: (json['fpl_percentage'] as number) ?? null,
    incomeVerified: (json['income_verified'] as boolean) ?? false,
    incomeVerificationDate: (json['income_verification_date'] as string) ?? null,
    medicaidEligible: (json['medicaid_eligible'] as boolean) ?? false,
    medicaidApplicationStatus: (json['medicaid_application_status'] as string) ?? null,
    medicaidApplicationDate: (json['medicaid_application_date'] as string) ?? null,
    medicareEligible: (json['medicare_eligible'] as boolean) ?? false,
    medicarePart: (json['medicare_part'] as string) ?? null,
    slidingFeeEligible: (json['sliding_fee_eligible'] as boolean) ?? false,
    slidingFeeScale: (json['sliding_fee_scale'] as number) ?? null,
    financialHardship: (json['financial_hardship'] as boolean) ?? false,
    hardshipDocumented: (json['hardship_documented'] as boolean) ?? false,
    assistanceRequested: (json['assistance_requested'] as boolean) ?? false,
    assistanceApproved: (json['assistance_approved'] as boolean) ?? false,
    assistanceAmount: (json['assistance_amount'] as number) ?? null,
    billingPreference: (json['billing_preference'] as string) ?? 'insurance',
    paymentPlanRequested: (json['payment_plan_requested'] as boolean) ?? false,
    paymentPlanApproved: (json['payment_plan_approved'] as boolean) ?? false,
    monthlyPaymentAmount: (json['monthly_payment_amount'] as number) ?? null,
    documentsProvided: (json['documents_provided'] as string[]) ?? [],
    documentsNeeded: (json['documents_needed'] as string[]) ?? []
  }
}

/**
 * Returns default eligibility criteria structure
 *
 * @returns Default EligibilityCriteriaDTO
 */
function getDefaultEligibilityCriteria(): InsuranceEligibilityInputDTO['eligibilityCriteria'] {
  return {
    residesInServiceArea: 'unknown',
    ageGroup: 'adult',
    isEligibleByAge: false,
    hasDiagnosedMentalHealth: 'unknown',
    diagnosisVerified: false,
    impactsDaily: 'unknown',
    impactsWork: 'unknown',
    impactsRelationships: 'unknown',
    suicidalIdeation: 'unknown',
    substanceUse: 'unknown',
    domesticViolence: 'unknown',
    homelessness: 'unknown',
    isVeteran: false,
    isPregnantPostpartum: false,
    isFirstResponder: false,
    hasDisability: false,
    hasMinorChildren: false,
    involvedWithDCF: false,
    courtOrdered: false
  }
}

/**
 * Returns default financial information structure
 *
 * @returns Default FinancialInformationDTO
 */
function getDefaultFinancialInformation(): InsuranceEligibilityInputDTO['financialInformation'] {
  return {
    incomeVerified: false,
    medicaidEligible: false,
    medicareEligible: false,
    slidingFeeEligible: false,
    financialHardship: false,
    hardshipDocumented: false,
    assistanceRequested: false,
    assistanceApproved: false,
    billingPreference: 'insurance',
    paymentPlanRequested: false,
    paymentPlanApproved: false,
    documentsProvided: [],
    documentsNeeded: []
  }
}

/**
 * Insurance & Eligibility Repository Implementation
 *
 * Implements the InsuranceEligibilityRepository port with real Supabase persistence
 * Uses RLS for multi-tenant data isolation - all queries filtered by organization_id
 */
export class InsuranceEligibilityRepositoryImpl implements InsuranceEligibilityRepository {

  /**
   * Save single insurance coverage record using RPC
   * Uses upsert_insurance_with_primary_swap for atomic is_primary handling
   *
   * @param patientId - Patient UUID
   * @param dto - Insurance coverage DTO
   * @returns Repository response with record ID or error
   */
  async saveCoverage(
    patientId: string,
    dto: InsuranceCoverageDTO
  ): Promise<RepositoryResponse<{ id: string }>> {
    try {
      const supabase = createTypedClient()
      const jsonbPayload = mapCoverageDTOToJSONB(dto)

      const { data, error } = await supabase.rpc('upsert_insurance_with_primary_swap', {
        p_patient_id: patientId,
        p_record: jsonbPayload
      })

      if (error) {
        return mapPostgresError(error)
      }

      if (!data) {
        return {
          ok: false,
          error: {
            code: REPO_ERROR_CODES.UNKNOWN,
            message: 'RPC returned no data'
          }
        }
      }

      return {
        ok: true,
        data: { id: data }
      }
    } catch (error) {
      return mapPostgresError(error)
    }
  }

  /**
   * Get insurance & eligibility snapshot by patient ID
   * Reads from v_patient_insurance_eligibility_snapshot view (RLS enforced)
   *
   * @param patientId - Patient UUID
   * @returns Repository response with snapshot or error
   */
  async getSnapshot(
    patientId: string
  ): Promise<RepositoryResponse<InsuranceEligibilityOutputDTO>> {
    try {
      const query = fromView('v_patient_insurance_eligibility_snapshot')
        .select('*')
        .eq('patient_id', patientId)
        .single()

      const { data, error } = await maybeSingle<ViewRowOf<'v_patient_insurance_eligibility_snapshot'>>(query)

      if (error) {
        if ((error as { code?: string }).code === 'PGRST116') {
          return {
            ok: false,
            error: {
              code: REPO_ERROR_CODES.NOT_FOUND,
              message: 'Snapshot not available'
            }
          }
        }
        return mapPostgresError(error)
      }

      if (!data) {
        return {
          ok: false,
          error: {
            code: REPO_ERROR_CODES.NOT_FOUND,
            message: 'Snapshot data not found'
          }
        }
      }

      // Map view columns to InsuranceEligibilityOutputDTO
      const snapshot = mapSnapshotViewToDTO(data, patientId)

      return {
        ok: true,
        data: snapshot
      }
    } catch (error) {
      return {
        ok: false,
        error: {
          code: REPO_ERROR_CODES.UNKNOWN,
          message: 'Could not retrieve insurance snapshot'
        }
      }
    }
  }

  /**
   * Find insurance & eligibility data by session
   * Delegates to getSnapshot using patient_id from session
   *
   * @param sessionId - Intake session identifier
   * @param organizationId - Organization context for multi-tenant isolation
   * @returns Repository response with snapshot or error
   */
  async findBySession(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<InsuranceEligibilityOutputDTO>> {
    // TODO: Query intake_sessions table to get patient_id from session_id
    // Then call getSnapshot(patientId)
    return {
      ok: false,
      error: {
        code: REPO_ERROR_CODES.NOT_IMPLEMENTED,
        message: 'Session lookup not yet implemented'
      }
    }
  }

  /**
   * Save insurance & eligibility data for a session
   * Delegates to saveCoverage for each insurance record
   *
   * @param sessionId - Intake session identifier
   * @param organizationId - Organization context for multi-tenant isolation
   * @param input - Insurance & eligibility data to save
   * @returns Repository response with session ID or error
   */
  async save(
    sessionId: string,
    organizationId: string,
    input: InsuranceEligibilityInputDTO
  ): Promise<RepositoryResponse<{ sessionId: string }>> {
    // TODO: Get patient_id from session, then call saveCoverage for each coverage
    // Must handle transactional rollback if any coverage fails
    return {
      ok: false,
      error: {
        code: REPO_ERROR_CODES.NOT_IMPLEMENTED,
        message: 'Batch save not yet implemented'
      }
    }
  }
}

/**
 * Export singleton instance
 * This will be replaced with proper instantiation via factory
 */
export const insuranceEligibilityRepository = new InsuranceEligibilityRepositoryImpl()