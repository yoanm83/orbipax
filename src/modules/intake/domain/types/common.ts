/**
 * Common Types and Enums for Intake Domain
 * OrbiPax Community Mental Health (CMH) System
 *
 * Following USCDI v4 and HEDIS standards where applicable
 * Multitenant design with organization-based RLS
 */

// =================================================================
// BRAND TYPES FOR CLINICAL IDENTIFIERS
// =================================================================

/**
 * Strongly typed UUID brand types for clinical entities
 * Prevents accidental ID mixing in multitenant environment
 */
export type OrganizationId = string & { readonly __brand: 'OrganizationId' }
export type PatientId = string & { readonly __brand: 'PatientId' }
export type ProviderId = string & { readonly __brand: 'ProviderId' }
export type MemberId = string & { readonly __brand: 'MemberId' }
export type IntakeId = string & { readonly __brand: 'IntakeId' }

/**
 * Helper functions to create branded IDs
 */
export const createOrganizationId = (id: string): OrganizationId => id as OrganizationId
export const createPatientId = (id: string): PatientId => id as PatientId
export const createProviderId = (id: string): ProviderId => id as ProviderId
export const createMemberId = (id: string): MemberId => id as MemberId
export const createIntakeId = (id: string): IntakeId => id as IntakeId

// =================================================================
// DEMOGRAPHIC ENUMS (USCDI v4 Aligned)
// =================================================================

/**
 * Gender Identity options aligned with USCDI v4
 */
export enum GenderIdentity {
  MALE = 'male',
  FEMALE = 'female',
  NON_BINARY = 'non-binary',
  TRANSGENDER_MALE = 'transgender-male',
  TRANSGENDER_FEMALE = 'transgender-female',
  OTHER = 'other',
  PREFER_NOT_TO_ANSWER = 'prefer-not-to-answer'
}

/**
 * Sex Assigned at Birth (biological sex)
 */
export enum SexAssignedAtBirth {
  MALE = 'male',
  FEMALE = 'female',
  INTERSEX = 'intersex',
  UNKNOWN = 'unknown'
}

/**
 * Race categories per US Census/USCDI
 */
export enum Race {
  AMERICAN_INDIAN_ALASKA_NATIVE = 'american-indian-alaska-native',
  ASIAN = 'asian',
  BLACK_AFRICAN_AMERICAN = 'black-african-american',
  NATIVE_HAWAIIAN_PACIFIC_ISLANDER = 'native-hawaiian-pacific-islander',
  WHITE = 'white',
  OTHER = 'other',
  UNKNOWN = 'unknown'
}

/**
 * Ethnicity per US Census
 */
export enum Ethnicity {
  HISPANIC_LATINO = 'hispanic-latino',
  NOT_HISPANIC_LATINO = 'not-hispanic-latino',
  UNKNOWN = 'unknown'
}

/**
 * Marital Status options
 */
export enum MaritalStatus {
  SINGLE = 'single',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
  SEPARATED = 'separated',
  DOMESTIC_PARTNER = 'domestic-partner',
  OTHER = 'other'
}

/**
 * Language codes (ISO 639-1 subset for CMH common languages)
 */
export enum Language {
  ENGLISH = 'en',
  SPANISH = 'es',
  FRENCH = 'fr',
  PORTUGUESE = 'pt',
  MANDARIN = 'zh',
  ARABIC = 'ar',
  VIETNAMESE = 'vi',
  TAGALOG = 'tl',
  KOREAN = 'ko',
  RUSSIAN = 'ru',
  OTHER = 'other'
}

/**
 * Communication preference methods
 */
export enum CommunicationMethod {
  PHONE = 'phone',
  EMAIL = 'email',
  TEXT_SMS = 'text-sms',
  MAIL = 'mail',
  SECURE_PORTAL = 'secure-portal',
  IN_PERSON = 'in-person'
}

/**
 * Veteran status for CMH eligibility
 */
export enum VeteranStatus {
  VETERAN = 'veteran',
  NOT_VETERAN = 'not-veteran',
  ACTIVE_DUTY = 'active-duty',
  UNKNOWN = 'unknown'
}

/**
 * Housing status for CMH services
 */
export enum HousingStatus {
  HOMELESS = 'homeless',
  SUPPORTED = 'supported',
  INDEPENDENT = 'independent',
  FAMILY = 'family',
  GROUP = 'group',
  OTHER = 'other'
}

// =================================================================
// CLINICAL ENUMS
// =================================================================

/**
 * Mental health diagnosis categories (DSM-5 aligned)
 */
export enum DiagnosisCategory {
  ANXIETY_DISORDERS = 'anxiety-disorders',
  MOOD_DISORDERS = 'mood-disorders',
  PSYCHOTIC_DISORDERS = 'psychotic-disorders',
  SUBSTANCE_USE_DISORDERS = 'substance-use-disorders',
  TRAUMA_STRESSOR_DISORDERS = 'trauma-stressor-disorders',
  PERSONALITY_DISORDERS = 'personality-disorders',
  EATING_DISORDERS = 'eating-disorders',
  SLEEP_DISORDERS = 'sleep-disorders',
  IMPULSE_CONTROL_DISORDERS = 'impulse-control-disorders',
  OTHER = 'other'
}

/**
 * Severity levels for clinical assessments
 */
export enum SeverityLevel {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  VERY_SEVERE = 'very-severe'
}

/**
 * Treatment goals priority levels
 */
export enum PriorityLevel {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

/**
 * Provider types for referrals
 */
export enum ProviderType {
  PSYCHIATRIST = 'psychiatrist',
  PSYCHOLOGIST = 'psychologist',
  LICENSED_CLINICAL_SOCIAL_WORKER = 'lcsw',
  LICENSED_PROFESSIONAL_COUNSELOR = 'lpc',
  MARRIAGE_FAMILY_THERAPIST = 'mft',
  PRIMARY_CARE_PHYSICIAN = 'pcp',
  NURSE_PRACTITIONER = 'np',
  PHYSICIAN_ASSISTANT = 'pa',
  OTHER = 'other'
}

/**
 * Insurance types common in CMH
 */
export enum InsuranceType {
  MEDICAID = 'medicaid',
  MEDICARE = 'medicare',
  PRIVATE = 'private',
  TRICARE = 'tricare',
  UNINSURED = 'uninsured',
  OTHER = 'other'
}

/**
 * Legal form types for consents
 */
export enum ConsentType {
  TREATMENT_CONSENT = 'treatment-consent',
  PRIVACY_AUTHORIZATION = 'privacy-authorization',
  RELEASE_OF_INFORMATION = 'release-of-information',
  PHOTOGRAPHY_CONSENT = 'photography-consent',
  EMERGENCY_CONTACT_AUTHORIZATION = 'emergency-contact-authorization',
  FINANCIAL_RESPONSIBILITY = 'financial-responsibility'
}

/**
 * Yes/No/Unknown enum for clinical questionnaires
 */
export enum BooleanResponse {
  YES = 'yes',
  NO = 'no',
  UNKNOWN = 'unknown'
}

// =================================================================
// COMMON INTERFACES
// =================================================================

/**
 * Base metadata for all intake domain entities
 * Ensures multitenant compliance and audit trail
 */
export interface IntakeEntityMetadata {
  organizationId: OrganizationId
  createdAt?: Date
  updatedAt?: Date
}

/**
 * Address structure following USCDI format
 */
export interface Address {
  street1: string
  street2?: string
  city: string
  state: string
  zipCode: string
  country?: string // Default 'US' for CMH
}

/**
 * Phone number with type classification
 */
export interface PhoneNumber {
  number: string
  type: 'home' | 'mobile' | 'work' | 'other'
  isPrimary: boolean
}

/**
 * Emergency contact information
 */
export interface EmergencyContact {
  name: string
  relationship: string
  phoneNumber: string
  alternatePhone?: string
  address?: Address
}

/**
 * Provider reference for external referrals
 */
export interface ProviderReference {
  name: string
  type: ProviderType
  organization?: string
  phoneNumber?: string
  address?: Address
  npi?: string // National Provider Identifier
}

// =================================================================
// STEP COMPLETION TRACKING
// =================================================================

/**
 * Intake step identifiers
 */
export enum IntakeStep {
  DEMOGRAPHICS = 'demographics',
  INSURANCE = 'insurance',
  CLINICAL_HISTORY = 'clinical-history',
  MEDICATIONS = 'medications',
  GOALS = 'goals',
  PROVIDERS = 'providers',
  CONSENTS = 'consents',
  REVIEW_SUBMIT = 'review-submit'
}

/**
 * Step completion status
 */
export enum StepStatus {
  NOT_STARTED = 'not-started',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  NEEDS_REVIEW = 'needs-review'
}

/**
 * Overall intake submission status
 */
export enum IntakeStatus {
  DRAFT = 'draft',
  IN_PROGRESS = 'in-progress',
  PENDING_REVIEW = 'pending-review',
  APPROVED = 'approved',
  NEEDS_CLARIFICATION = 'needs-clarification',
  REJECTED = 'rejected'
}