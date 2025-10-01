/**
 * Insurance & Eligibility Mappers - Application Layer
 * OrbiPax Community Mental Health System
 *
 * Pure functions for mapping between Domain and DTO types
 * Handles data transformation without validation or business logic
 *
 * SoC: Pure mapping functions - NO validation, NO side effects, NO Zod
 */

import type {
  InsuranceEligibilityInputDTO,
  InsuranceEligibilityOutputDTO,
  InsuranceCoverageDTO,
  EligibilityCriteriaDTO,
  FinancialInformationDTO
} from './dtos'

/**
 * Helper: Convert date to ISO string
 */
function dateToISO(date: Date | undefined | null): string | undefined {
  if (!date) return undefined
  try {
    return date instanceof Date ? date.toISOString() : new Date(date).toISOString()
  } catch {
    return undefined
  }
}

/**
 * Helper: Parse ISO string to Date
 */
function parseISO(dateStr: string | undefined | null): Date | undefined {
  if (!dateStr) return undefined
  try {
    const date = new Date(dateStr)
    return isNaN(date.getTime()) ? undefined : date
  } catch {
    return undefined
  }
}

/**
 * Map Insurance Coverage DTO to Domain object
 */
function mapInsuranceCoverageToDomain(dto: InsuranceCoverageDTO): any {
  return {
    type: dto.type,
    carrierName: dto.carrierName,
    policyNumber: dto.policyNumber,
    groupNumber: dto.groupNumber,
    planKind: dto.planKind,
    planName: dto.planName,
    subscriberName: dto.subscriberName,
    subscriberDateOfBirth: parseISO(dto.subscriberDateOfBirth),
    subscriberRelationship: dto.subscriberRelationship,
    subscriberSSN: dto.subscriberSSN,
    effectiveDate: parseISO(dto.effectiveDate),
    expirationDate: parseISO(dto.expirationDate),
    isPrimary: dto.isPrimary,
    isVerified: dto.isVerified,
    verificationDate: parseISO(dto.verificationDate),
    verificationNotes: dto.verificationNotes,
    hasMentalHealthCoverage: dto.hasMentalHealthCoverage,
    mentalHealthCopay: dto.mentalHealthCopay,
    mentalHealthDeductible: dto.mentalHealthDeductible,
    annualMentalHealthLimit: dto.annualMentalHealthLimit,
    requiresPreAuth: dto.requiresPreAuth,
    preAuthNumber: dto.preAuthNumber,
    preAuthExpiration: parseISO(dto.preAuthExpiration)
  }
}

/**
 * Map Insurance Coverage Domain to DTO
 */
function mapInsuranceCoverageToDTO(domain: any): InsuranceCoverageDTO {
  return {
    type: domain.type || '',
    carrierName: domain.carrierName || '',
    policyNumber: domain.policyNumber || '',
    groupNumber: domain.groupNumber,
    planKind: domain.planKind,
    planName: domain.planName ?? null,
    subscriberName: domain.subscriberName || '',
    subscriberDateOfBirth: dateToISO(domain.subscriberDateOfBirth) || new Date().toISOString(),
    subscriberRelationship: domain.subscriberRelationship || 'self',
    subscriberSSN: domain.subscriberSSN,
    effectiveDate: dateToISO(domain.effectiveDate) || new Date().toISOString(),
    expirationDate: dateToISO(domain.expirationDate),
    isPrimary: Boolean(domain.isPrimary),
    isVerified: Boolean(domain.isVerified),
    verificationDate: dateToISO(domain.verificationDate),
    verificationNotes: domain.verificationNotes,
    hasMentalHealthCoverage: domain.hasMentalHealthCoverage || 'unknown',
    mentalHealthCopay: domain.mentalHealthCopay,
    mentalHealthDeductible: domain.mentalHealthDeductible,
    annualMentalHealthLimit: domain.annualMentalHealthLimit,
    requiresPreAuth: domain.requiresPreAuth || 'unknown',
    preAuthNumber: domain.preAuthNumber,
    preAuthExpiration: dateToISO(domain.preAuthExpiration)
  }
}

/**
 * Map Eligibility Criteria DTO to Domain object
 */
function mapEligibilityCriteriaToDomain(dto: EligibilityCriteriaDTO): any {
  return {
    residesInServiceArea: dto.residesInServiceArea,
    serviceAreaCounty: dto.serviceAreaCounty,
    ageGroup: dto.ageGroup,
    isEligibleByAge: dto.isEligibleByAge,
    hasDiagnosedMentalHealth: dto.hasDiagnosedMentalHealth,
    diagnosisVerified: dto.diagnosisVerified,
    functionalImpairmentLevel: dto.functionalImpairmentLevel,
    impactsDaily: dto.impactsDaily,
    impactsWork: dto.impactsWork,
    impactsRelationships: dto.impactsRelationships,
    suicidalIdeation: dto.suicidalIdeation,
    substanceUse: dto.substanceUse,
    domesticViolence: dto.domesticViolence,
    homelessness: dto.homelessness,
    isVeteran: dto.isVeteran,
    isPregnantPostpartum: dto.isPregnantPostpartum,
    isFirstResponder: dto.isFirstResponder,
    hasDisability: dto.hasDisability,
    hasMinorChildren: dto.hasMinorChildren,
    involvedWithDCF: dto.involvedWithDCF,
    courtOrdered: dto.courtOrdered,
    orderType: dto.orderType,
    referralSource: dto.referralSource,
    referralAgency: dto.referralAgency,
    referralContact: dto.referralContact,
    referralDate: parseISO(dto.referralDate)
  }
}

/**
 * Map Eligibility Criteria Domain to DTO
 */
function mapEligibilityCriteriaToDTO(domain: any): EligibilityCriteriaDTO {
  return {
    residesInServiceArea: domain.residesInServiceArea || 'unknown',
    serviceAreaCounty: domain.serviceAreaCounty,
    ageGroup: domain.ageGroup || 'adult',
    isEligibleByAge: Boolean(domain.isEligibleByAge),
    hasDiagnosedMentalHealth: domain.hasDiagnosedMentalHealth || 'unknown',
    diagnosisVerified: Boolean(domain.diagnosisVerified),
    functionalImpairmentLevel: domain.functionalImpairmentLevel,
    impactsDaily: domain.impactsDaily || 'unknown',
    impactsWork: domain.impactsWork || 'unknown',
    impactsRelationships: domain.impactsRelationships || 'unknown',
    suicidalIdeation: domain.suicidalIdeation || 'unknown',
    substanceUse: domain.substanceUse || 'unknown',
    domesticViolence: domain.domesticViolence || 'unknown',
    homelessness: domain.homelessness || 'unknown',
    isVeteran: Boolean(domain.isVeteran),
    isPregnantPostpartum: Boolean(domain.isPregnantPostpartum),
    isFirstResponder: Boolean(domain.isFirstResponder),
    hasDisability: Boolean(domain.hasDisability),
    hasMinorChildren: Boolean(domain.hasMinorChildren),
    involvedWithDCF: Boolean(domain.involvedWithDCF),
    courtOrdered: Boolean(domain.courtOrdered),
    orderType: domain.orderType,
    referralSource: domain.referralSource,
    referralAgency: domain.referralAgency,
    referralContact: domain.referralContact,
    referralDate: dateToISO(domain.referralDate)
  }
}

/**
 * Map Financial Information DTO to Domain object
 */
function mapFinancialInformationToDomain(dto: FinancialInformationDTO): any {
  return {
    householdIncome: dto.householdIncome,
    householdSize: dto.householdSize,
    federalPovertyLevel: dto.federalPovertyLevel,
    fplPercentage: dto.fplPercentage,
    incomeVerified: dto.incomeVerified,
    incomeVerificationDate: parseISO(dto.incomeVerificationDate),
    medicaidEligible: dto.medicaidEligible,
    medicaidApplicationStatus: dto.medicaidApplicationStatus,
    medicaidApplicationDate: parseISO(dto.medicaidApplicationDate),
    medicareEligible: dto.medicareEligible,
    medicarePart: dto.medicarePart,
    slidingFeeEligible: dto.slidingFeeEligible,
    slidingFeeScale: dto.slidingFeeScale,
    financialHardship: dto.financialHardship,
    hardshipDocumented: dto.hardshipDocumented,
    assistanceRequested: dto.assistanceRequested,
    assistanceApproved: dto.assistanceApproved,
    assistanceAmount: dto.assistanceAmount,
    billingPreference: dto.billingPreference,
    paymentPlanRequested: dto.paymentPlanRequested,
    paymentPlanApproved: dto.paymentPlanApproved,
    monthlyPaymentAmount: dto.monthlyPaymentAmount,
    documentsProvided: dto.documentsProvided || [],
    documentsNeeded: dto.documentsNeeded || []
  }
}

/**
 * Map Financial Information Domain to DTO
 */
function mapFinancialInformationToDTO(domain: any): FinancialInformationDTO {
  return {
    householdIncome: domain.householdIncome,
    householdSize: domain.householdSize,
    federalPovertyLevel: domain.federalPovertyLevel,
    fplPercentage: domain.fplPercentage,
    incomeVerified: Boolean(domain.incomeVerified),
    incomeVerificationDate: dateToISO(domain.incomeVerificationDate),
    medicaidEligible: Boolean(domain.medicaidEligible),
    medicaidApplicationStatus: domain.medicaidApplicationStatus,
    medicaidApplicationDate: dateToISO(domain.medicaidApplicationDate),
    medicareEligible: Boolean(domain.medicareEligible),
    medicarePart: domain.medicarePart,
    slidingFeeEligible: Boolean(domain.slidingFeeEligible),
    slidingFeeScale: domain.slidingFeeScale,
    financialHardship: Boolean(domain.financialHardship),
    hardshipDocumented: Boolean(domain.hardshipDocumented),
    assistanceRequested: Boolean(domain.assistanceRequested),
    assistanceApproved: Boolean(domain.assistanceApproved),
    assistanceAmount: domain.assistanceAmount,
    billingPreference: domain.billingPreference || 'insurance',
    paymentPlanRequested: Boolean(domain.paymentPlanRequested),
    paymentPlanApproved: Boolean(domain.paymentPlanApproved),
    monthlyPaymentAmount: domain.monthlyPaymentAmount,
    documentsProvided: domain.documentsProvided || [],
    documentsNeeded: domain.documentsNeeded || []
  }
}

/**
 * Map Insurance & Eligibility Input DTO to Domain
 * Used when receiving data from UI/API for validation
 * NO Zod - returns plain object for domain validation
 */
export function toInsuranceEligibilityDomain(dto: InsuranceEligibilityInputDTO): any {
  return {
    insuranceCoverages: dto.insuranceCoverages.map(mapInsuranceCoverageToDomain),
    isUninsured: dto.isUninsured,
    uninsuredReason: dto.uninsuredReason,
    eligibilityCriteria: mapEligibilityCriteriaToDomain(dto.eligibilityCriteria),
    financialInformation: mapFinancialInformationToDomain(dto.financialInformation),
    eligibilityStatus: dto.eligibilityStatus,
    eligibilityDeterminedBy: dto.eligibilityDeterminedBy,
    eligibilityDeterminationDate: parseISO(dto.eligibilityDeterminationDate),
    eligibilityNotes: dto.eligibilityNotes
  }
}

/**
 * Map Insurance & Eligibility Domain to DTO
 * Used when sending validated data to persistence or UI
 */
export function toInsuranceEligibilityDTO(domain: any): InsuranceEligibilityInputDTO {
  return {
    insuranceCoverages: (domain.insuranceCoverages || []).map(mapInsuranceCoverageToDTO),
    isUninsured: Boolean(domain.isUninsured),
    uninsuredReason: domain.uninsuredReason,
    eligibilityCriteria: mapEligibilityCriteriaToDTO(domain.eligibilityCriteria || {}),
    financialInformation: mapFinancialInformationToDTO(domain.financialInformation || {}),
    eligibilityStatus: domain.eligibilityStatus,
    eligibilityDeterminedBy: domain.eligibilityDeterminedBy,
    eligibilityDeterminationDate: dateToISO(domain.eligibilityDeterminationDate),
    eligibilityNotes: domain.eligibilityNotes
  }
}

/**
 * Extract data from Output DTO
 * Unwraps the metadata to get just the data payload
 */
export function extractInsuranceEligibilityData(output: InsuranceEligibilityOutputDTO): InsuranceEligibilityInputDTO {
  return output.data
}