/**
 * Intake Domain Public API
 * OrbiPax Community Mental Health (CMH) System
 *
 * Central export point for all intake domain contracts, schemas, and types
 * Provides clean public API for Application and UI layers
 */

// =================================================================
// COMMON TYPES AND ENUMS
// =================================================================

export {
  // Brand Types for Clinical Identifiers
  type OrganizationId,
  type PatientId,
  type ProviderId,
  type MemberId,
  type IntakeId,

  // Helper functions for branded IDs
  createOrganizationId,
  createPatientId,
  createProviderId,
  createMemberId,
  createIntakeId,

  // Demographic Enums (USCDI v4 Aligned)
  GenderIdentity,
  SexAssignedAtBirth,
  Race,
  Ethnicity,
  MaritalStatus,
  Language,
  CommunicationMethod,
  VeteranStatus,

  // Clinical Enums
  DiagnosisCategory,
  SeverityLevel,
  PriorityLevel,
  ProviderType,
  InsuranceType,
  ConsentType,
  BooleanResponse,

  // Step Management Enums
  IntakeStep,
  StepStatus,
  IntakeStatus,

  // Common Interfaces
  type IntakeEntityMetadata,
  type Address,
  type PhoneNumber,
  type EmergencyContact,
  type ProviderReference
} from './types/common'

// =================================================================
// DEMOGRAPHICS SCHEMA EXPORTS
// =================================================================

export {
  // Schemas
  addressSchema,
  phoneNumberSchema,
  emergencyContactSchema,
  demographicsDataSchema,
  demographicsSubmissionSchema,

  // Validation Functions
  validateDemographicsStep,
  validateDemographicsSubmission,

  // Helper Functions
  calculateAge,
  isMinor,

  // Types
  type DemographicsData,
  type DemographicsSubmission,
  type Address as DemographicsAddress,
  type PhoneNumber as DemographicsPhoneNumber,
  type EmergencyContact as DemographicsEmergencyContact
} from './schemas/demographics.schema'

// =================================================================
// INSURANCE & ELIGIBILITY SCHEMA EXPORTS
// =================================================================

export {
  // Schemas
  insuranceCoverageSchema,
  eligibilityCriteriaSchema,
  financialInformationSchema,
  insuranceEligibilityDataSchema,
  insuranceSubmissionSchema,

  // Validation Functions
  validateInsuranceStep,
  validateInsuranceSubmission,

  // Helper Functions
  calculateFPLPercentage,
  determineSlideScale,

  // Types
  type InsuranceCoverage,
  type EligibilityCriteria,
  type FinancialInformation,
  type InsuranceEligibilityData,
  type InsuranceSubmission
} from './schemas/insurance.schema'

// =================================================================
// CLINICAL HISTORY SCHEMA EXPORTS
// =================================================================

export {
  // Schemas
  diagnosisSchema,
  symptomAssessmentSchema,
  mentalHealthHistorySchema,
  substanceUseHistorySchema,
  traumaHistorySchema,
  clinicalHistoryDataSchema,
  clinicalHistorySubmissionSchema,

  // Validation Functions
  validateClinicalHistoryStep,
  validateClinicalHistorySubmission,

  // Helper Functions
  calculateRiskLevel,

  // Types
  type Diagnosis,
  type SymptomAssessment,
  type MentalHealthHistory,
  type SubstanceUseHistory,
  type TraumaHistory,
  type ClinicalHistoryData,
  type ClinicalHistorySubmission
} from './schemas/clinical-history.schema'

// =================================================================
// MEDICATIONS SCHEMA EXPORTS
// =================================================================

export {
  // Schemas
  medicationSchema,
  allergySchema,
  pharmacySchema,
  medicationHistorySchema,
  medicationsDataSchema,
  medicationsSubmissionSchema,

  // Validation Functions
  validateMedicationsStep,
  validateMedicationsSubmission,

  // Helper Functions
  checkForInteractions,
  calculateAdherenceScore,

  // Types
  type Medication,
  type Allergy,
  type Pharmacy,
  type MedicationHistory,
  type MedicationsData,
  type MedicationsSubmission
} from './schemas/medications.schema'

// =================================================================
// TREATMENT GOALS SCHEMA EXPORTS
// =================================================================

export {
  // Schemas
  treatmentGoalSchema,
  treatmentPreferencesSchema,
  recoveryObjectivesSchema,
  goalsDataSchema,
  goalsSubmissionSchema,

  // Validation Functions
  validateGoalsStep,
  validateGoalsSubmission,

  // Helper Functions
  validateSmartGoal,
  calculateMotivationScore,

  // Types
  type TreatmentGoal,
  type TreatmentPreferences,
  type RecoveryObjectives,
  type GoalsData,
  type GoalsSubmission
} from './schemas/goals.schema'

// =================================================================
// PROVIDERS SCHEMA EXPORTS
// =================================================================

export {
  // Schemas
  providerContactSchema,
  providerRelationshipSchema,
  referralSchema,
  healthcareTeamSchema,
  providersDataSchema,
  providersSubmissionSchema,

  // Validation Functions
  validateProvidersStep,
  validateProvidersSubmission,

  // Helper Functions
  validateNPI,
  assessProviderAccessibility,

  // Types
  type ProviderContact,
  type ProviderRelationship,
  type Referral,
  type HealthcareTeam,
  type ProvidersData,
  type ProvidersSubmission
} from './schemas/providers.schema'

// =================================================================
// CONSENTS SCHEMA EXPORTS
// =================================================================

export {
  // Schemas
  consentSignatureSchema,
  individualConsentSchema,
  hipaaAuthorizationSchema,
  treatmentConsentSchema,
  financialResponsibilitySchema,
  consentsDataSchema,
  consentsSubmissionSchema,

  // Validation Functions
  validateConsentsStep,
  validateConsentsSubmission,

  // Helper Functions
  validateRequiredConsents,
  generateConsentSummary,

  // Types
  type ConsentSignature,
  type IndividualConsent,
  type HipaaAuthorization,
  type TreatmentConsent,
  type FinancialResponsibility,
  type ConsentsData,
  type ConsentsSubmission
} from './schemas/consents.schema'

// =================================================================
// REVIEW & SUBMIT SCHEMA EXPORTS
// =================================================================

export {
  // Schemas
  stepCompletionSchema,
  validationSummarySchema,
  clinicalReviewSchema,
  submissionTrackingSchema,
  completeIntakePackageSchema,
  reviewSubmitDataSchema,
  reviewSubmitSubmissionSchema,

  // Validation Functions
  validateReviewSubmitStep,
  validateReviewSubmitSubmission,
  validateCompleteIntake,

  // Helper Functions
  calculateCompletionPercentage,
  generateSubmissionSummary,
  isReadyForSubmission,

  // Types
  type StepCompletion,
  type ValidationSummary,
  type ClinicalReview,
  type SubmissionTracking,
  type CompleteIntakePackage,
  type ReviewSubmitData,
  type ReviewSubmitSubmission
} from './schemas/review-submit.schema'

// =================================================================
// UNIFIED TYPE UNIONS FOR GENERIC HANDLING
// =================================================================

/**
 * Union type for all step data schemas
 * Useful for generic step handling in the application layer
 */
export type IntakeStepData =
  | DemographicsData
  | InsuranceEligibilityData
  | ClinicalHistoryData
  | MedicationsData
  | GoalsData
  | ProvidersData
  | ConsentsData
  | ReviewSubmitData

/**
 * Union type for all step submission schemas
 * Useful for generic submission handling
 */
export type IntakeStepSubmission =
  | DemographicsSubmission
  | InsuranceSubmission
  | ClinicalHistorySubmission
  | MedicationsSubmission
  | GoalsSubmission
  | ProvidersSubmission
  | ConsentsSubmission
  | ReviewSubmitSubmission

/**
 * Map of step names to their validation functions
 * Useful for dynamic validation based on step
 */
export const stepValidators = {
  [IntakeStep.DEMOGRAPHICS]: validateDemographicsStep,
  [IntakeStep.INSURANCE]: validateInsuranceStep,
  [IntakeStep.CLINICAL_HISTORY]: validateClinicalHistoryStep,
  [IntakeStep.MEDICATIONS]: validateMedicationsStep,
  [IntakeStep.GOALS]: validateGoalsStep,
  [IntakeStep.PROVIDERS]: validateProvidersStep,
  [IntakeStep.CONSENTS]: validateConsentsStep,
  [IntakeStep.REVIEW_SUBMIT]: validateReviewSubmitStep
} as const

/**
 * Map of step names to their submission validation functions
 * Useful for dynamic submission validation
 */
export const stepSubmissionValidators = {
  [IntakeStep.DEMOGRAPHICS]: validateDemographicsSubmission,
  [IntakeStep.INSURANCE]: validateInsuranceSubmission,
  [IntakeStep.CLINICAL_HISTORY]: validateClinicalHistorySubmission,
  [IntakeStep.MEDICATIONS]: validateMedicationsSubmission,
  [IntakeStep.GOALS]: validateGoalsSubmission,
  [IntakeStep.PROVIDERS]: validateProvidersSubmission,
  [IntakeStep.CONSENTS]: validateConsentsSubmission,
  [IntakeStep.REVIEW_SUBMIT]: validateReviewSubmitSubmission
} as const

// =================================================================
// DOMAIN CONSTANTS
// =================================================================

/**
 * Standard intake workflow steps in order
 */
export const INTAKE_STEPS_ORDER = [
  IntakeStep.DEMOGRAPHICS,
  IntakeStep.INSURANCE,
  IntakeStep.CLINICAL_HISTORY,
  IntakeStep.MEDICATIONS,
  IntakeStep.GOALS,
  IntakeStep.PROVIDERS,
  IntakeStep.CONSENTS,
  IntakeStep.REVIEW_SUBMIT
] as const

/**
 * Steps that require clinical review
 */
export const CLINICAL_REVIEW_REQUIRED_STEPS = [
  IntakeStep.CLINICAL_HISTORY,
  IntakeStep.MEDICATIONS,
  IntakeStep.GOALS
] as const

/**
 * Steps that require legal/compliance review
 */
export const LEGAL_REVIEW_REQUIRED_STEPS = [
  IntakeStep.CONSENTS
] as const

/**
 * Required steps that must be completed before submission
 */
export const REQUIRED_STEPS = [
  IntakeStep.DEMOGRAPHICS,
  IntakeStep.INSURANCE,
  IntakeStep.CLINICAL_HISTORY,
  IntakeStep.CONSENTS
] as const

// =================================================================
// DOMAIN VERSION
// =================================================================

/**
 * Current domain schema version
 * Used for versioning and migration purposes
 */
export const INTAKE_DOMAIN_VERSION = '1.0.0'

/**
 * Supported schema versions for backward compatibility
 */
export const SUPPORTED_SCHEMA_VERSIONS = ['1.0.0'] as const