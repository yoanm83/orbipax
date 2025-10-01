/**
 * Demographics DTOs - Application Layer
 * OrbiPax Community Mental Health System
 *
 * JSON-serializable Data Transfer Objects for Demographics
 * These DTOs define the contract between UI and Application layers
 *
 * SoC: Pure data contracts - NO validation logic, NO business rules
 */

import type {
  GenderIdentity,
  Race,
  Ethnicity,
  MaritalStatus,
  Language,
  CommunicationMethod,
  VeteranStatus,
  HousingStatus
} from '@/modules/intake/domain/types/common'

/**
 * Serializable Address DTO
 */
export interface AddressDTO {
  street1: string
  street2?: string
  city: string
  state: string
  zipCode: string
  country?: string
}

/**
 * Serializable Phone Number DTO
 */
export interface PhoneNumberDTO {
  number: string
  type: 'home' | 'mobile' | 'work' | 'other'
  isPrimary: boolean
}

/**
 * Serializable Emergency Contact DTO
 */
export interface EmergencyContactDTO {
  name: string
  relationship: string
  phoneNumber: string
  alternatePhone?: string
  address?: AddressDTO
}

/**
 * Serializable Legal Guardian DTO
 */
export interface LegalGuardianDTO {
  name: string
  relationship: string
  phoneNumber: string
  address?: AddressDTO
}

/**
 * Serializable Power of Attorney DTO
 */
export interface PowerOfAttorneyDTO {
  name: string
  phoneNumber: string
  documentDate?: string // ISO date string
}

/**
 * Demographics Input DTO
 * Received from UI forms
 */
export interface DemographicsInputDTO {
  // Basic Identity
  firstName?: string
  middleName?: string
  lastName?: string
  preferredName?: string

  // Date of Birth (ISO string from UI)
  dateOfBirth?: string

  // Gender
  gender?: 'male' | 'female'
  genderIdentity?: GenderIdentity
  pronouns?: string

  // Race and Ethnicity
  race?: Race[]
  ethnicity?: Ethnicity

  // Social Demographics
  maritalStatus?: MaritalStatus
  veteranStatus?: VeteranStatus

  // Language and Communication
  primaryLanguage?: Language
  needsInterpreter?: boolean
  preferredCommunicationMethod?: CommunicationMethod[]

  // Contact Information
  email?: string
  phoneNumbers?: PhoneNumberDTO[]

  // Address Information
  address?: AddressDTO
  sameAsMailingAddress?: boolean
  mailingAddress?: AddressDTO
  housingStatus?: HousingStatus

  // Emergency Contact
  emergencyContact?: EmergencyContactDTO

  // Sensitive Information
  socialSecurityNumber?: string

  // Legal Information
  hasLegalGuardian?: boolean
  legalGuardianInfo?: LegalGuardianDTO
  hasPowerOfAttorney?: boolean
  powerOfAttorneyInfo?: PowerOfAttorneyDTO
}

/**
 * Demographics Output DTO
 * Returned to UI after processing
 */
export interface DemographicsOutputDTO {
  // Metadata
  id?: string
  sessionId: string
  organizationId: string
  lastModified?: string // ISO timestamp
  completionStatus?: 'incomplete' | 'partial' | 'complete'

  // Demographics Data
  data: DemographicsInputDTO

  // Validation State
  validationErrors?: Record<string, string>
  requiredFieldsMissing?: string[]
}

/**
 * Standard Application Response Contract
 */
export interface ApplicationResponse<T = void> {
  ok: boolean
  data?: T
  error?: {
    code: string
    message?: string // Generic message only, no PII
  }
}

/**
 * Load Demographics Response
 */
export type LoadDemographicsResponse = ApplicationResponse<DemographicsOutputDTO>

/**
 * Save Demographics Response
 */
export type SaveDemographicsResponse = ApplicationResponse<{ sessionId: string }>