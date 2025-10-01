/**
 * Demographics Schema - Intake Domain
 * OrbiPax Community Mental Health (CMH) System
 *
 * Zod validation schemas for demographics step of intake wizard
 * Following USCDI v4 standards with multitenant compliance
 */

import { z } from 'zod'
import { validatePhoneNumber } from '@/shared/utils/phone'
import { validateName, normalizeName, NAME_LENGTHS } from '@/shared/utils/name'
import {
  GenderIdentity,
  Race,
  Ethnicity,
  MaritalStatus,
  Language,
  CommunicationMethod,
  VeteranStatus,
  HousingStatus,
  type OrganizationId,
  type PatientId
} from '../../types/common'

// =================================================================
// ADDRESS SCHEMA
// =================================================================

export const addressSchema = z.object({
  street1: z.string().min(1, 'Street address is required').max(100),
  street2: z.string().max(100).optional(),
  city: z.string().min(1, 'City is required').max(50),
  state: z.string().min(2, 'State is required').max(2, 'Use 2-letter state code'),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
  country: z.string().max(2).default('US')
})

// =================================================================
// PHONE NUMBER SCHEMA
// =================================================================

export const phoneNumberSchema = z.object({
  number: z.string()
    .refine(validatePhoneNumber, 'Invalid phone number')
    .transform(val => val.replace(/\D/g, '')),
  type: z.enum(['home', 'mobile', 'work', 'other']),
  isPrimary: z.boolean()
})

// =================================================================
// EMERGENCY CONTACT SCHEMA
// =================================================================

export const emergencyContactSchema = z.object({
  name: z.string()
    .min(1, 'Emergency contact name is required')
    .max(NAME_LENGTHS.FULL_NAME)
    .transform(normalizeName)
    .refine(validateName, 'Invalid characters in contact name'),
  relationship: z.string().min(1, 'Relationship is required').max(50),
  phoneNumber: z.string()
    .refine(validatePhoneNumber, 'Invalid phone number'),
  alternatePhone: z.string()
    .refine(validatePhoneNumber, 'Invalid phone number')
    .optional(),
  address: addressSchema.optional()
})

// =================================================================
// DEMOGRAPHIC DATA SCHEMA
// =================================================================

export const demographicsDataSchema = z.object({
  // Basic Identity
  firstName: z.string()
    .min(1, 'First name is required')
    .max(NAME_LENGTHS.FIRST_NAME, 'First name too long')
    .transform(normalizeName)
    .refine(validateName, 'Invalid characters in first name'),

  middleName: z.string()
    .max(NAME_LENGTHS.MIDDLE_NAME, 'Middle name too long')
    .transform(normalizeName)
    .refine(validateName, 'Invalid characters in middle name')
    .optional(),

  lastName: z.string()
    .min(1, 'Last name is required')
    .max(NAME_LENGTHS.LAST_NAME, 'Last name too long')
    .transform(normalizeName)
    .refine(validateName, 'Invalid characters in last name'),

  preferredName: z.string()
    .max(NAME_LENGTHS.PREFERRED_NAME, 'Preferred name too long')
    .transform(normalizeName)
    .optional(),

  // Date of Birth with healthcare validation
  dateOfBirth: z.date()
    .refine(date => {
      const age = new Date().getFullYear() - date.getFullYear()
      return age >= 0 && age <= 150
    }, 'Invalid date of birth')
    .refine(date => date <= new Date(), 'Date of birth cannot be in the future'),

  // Gender
  gender: z.enum(['male', 'female']),
  genderIdentity: z.nativeEnum(GenderIdentity),
  pronouns: z.string().max(20).optional(),

  // Race and Ethnicity (USCDI v4 compliant)
  race: z.array(z.nativeEnum(Race)).min(1, 'At least one race selection required'),
  ethnicity: z.nativeEnum(Ethnicity),

  // Social Demographics
  maritalStatus: z.nativeEnum(MaritalStatus),
  veteranStatus: z.nativeEnum(VeteranStatus),

  // Language and Communication
  primaryLanguage: z.nativeEnum(Language),
  needsInterpreter: z.boolean(),
  preferredCommunicationMethod: z.array(z.nativeEnum(CommunicationMethod))
    .min(1, 'At least one communication method required'),

  // Contact Information
  email: z.string()
    .email('Invalid email format')
    .max(100, 'Email too long')
    .optional(),

  phoneNumbers: z.array(phoneNumberSchema)
    .min(1, 'At least one phone number required')
    .max(3, 'Maximum 3 phone numbers allowed')
    .refine(phones => phones.filter(p => p.isPrimary).length === 1,
      'Exactly one primary phone number required'),

  // Address Information
  address: addressSchema,
  sameAsMailingAddress: z.boolean(),
  mailingAddress: addressSchema.optional(),
  housingStatus: z.nativeEnum(HousingStatus),

  // Emergency Contact
  emergencyContact: emergencyContactSchema,

  // CMH Specific Fields
  socialSecurityNumber: z.string()
    .regex(/^\d{3}-?\d{2}-?\d{4}$/, 'Invalid SSN format')
    .transform(val => val.replace(/\D/g, ''))
    .optional(),

  driverLicenseNumber: z.string().max(20).optional(),
  driverLicenseState: z.string().max(2).optional(),

  // Legal Guardian (for minors)
  hasLegalGuardian: z.boolean(),
  legalGuardianInfo: z.object({
    name: z.string()
      .min(1, 'Guardian name is required')
      .max(NAME_LENGTHS.FULL_NAME)
      .transform(normalizeName)
      .refine(validateName, 'Invalid characters in guardian name'),
    relationship: z.enum(['parent', 'legal_guardian', 'grandparent', 'other'])
      .describe('Guardian relationship to patient'),
    phoneNumber: z.string().refine(validatePhoneNumber, 'Invalid phone number'),
    email: z.string()
      .email('Invalid email format')
      .max(100, 'Email too long')
      .optional(),
    address: addressSchema.optional()
  }).optional(),

  // Power of Attorney
  hasPowerOfAttorney: z.boolean().default(false),
  powerOfAttorneyInfo: z.object({
    name: z.string()
      .min(1, 'POA name is required')
      .max(NAME_LENGTHS.FULL_NAME)
      .transform(normalizeName)
      .refine(validateName, 'Invalid characters in POA name'),
    phoneNumber: z.string().refine(validatePhoneNumber, 'Invalid phone number')
  }).optional()
}).refine(
  (data) => {
    // If hasPowerOfAttorney is true, powerOfAttorneyInfo must be provided
    if (data.hasPowerOfAttorney && !data.powerOfAttorneyInfo) {
      return false
    }
    // If hasLegalGuardian is true, legalGuardianInfo must be provided
    if (data.hasLegalGuardian && !data.legalGuardianInfo) {
      return false
    }
    return true
  },
  {
    message: 'Guardian or POA information is required when enabled',
    path: ['legalGuardianInfo']
  }
)

// =================================================================
// MULTITENANT DEMOGRAPHICS SCHEMA
// =================================================================

export const demographicsSubmissionSchema = z.object({
  organizationId: z.string().min(1, 'Organization ID is required'),
  patientId: z.string().optional(), // Optional for new patient creation
  stepData: demographicsDataSchema,
  metadata: z.object({
    completedAt: z.date().default(() => new Date()),
    version: z.string().default('1.0'),
    source: z.enum(['wizard', 'import', 'manual']).default('wizard')
  })
})

// =================================================================
// VALIDATION HELPERS
// =================================================================

export const validateDemographicsStep = (data: unknown) => {
  return demographicsDataSchema.safeParse(data)
}

export const validateDemographicsSubmission = (data: unknown) => {
  return demographicsSubmissionSchema.safeParse(data)
}

// Age calculation helper for clinical use
export const calculateAge = (dateOfBirth: Date): number => {
  const today = new Date()
  const age = today.getFullYear() - dateOfBirth.getFullYear()
  const monthDiff = today.getMonth() - dateOfBirth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    return age - 1
  }
  return age
}

// Validation for minor status (important for CMH consent requirements)
export const isMinor = (dateOfBirth: Date): boolean => {
  return calculateAge(dateOfBirth) < 18
}

// =================================================================
// TYPE EXPORTS
// =================================================================

/**
 * Main demographics type for UI and Application layers
 */
export type DemographicsData = z.infer<typeof demographicsDataSchema>

/**
 * Full submission type with multitenant metadata
 */
export type DemographicsSubmission = z.infer<typeof demographicsSubmissionSchema>

/**
 * Address type (reusable)
 */
export type Address = z.infer<typeof addressSchema>

/**
 * Phone number type (reusable)
 */
export type PhoneNumber = z.infer<typeof phoneNumberSchema>

/**
 * Emergency contact type (reusable)
 */
export type EmergencyContact = z.infer<typeof emergencyContactSchema>

// =================================================================
// CANONICAL EXPORTS (For Domain consistency)
// =================================================================

/**
 * Canonical schema export - single source of truth for demographics validation
 */
export const demographicsSchema = demographicsDataSchema

/**
 * Canonical type export - primary demographics type
 */
export type Demographics = DemographicsData

/**
 * Canonical validation function - returns JSON-safe result
 * @param data - Unknown data to validate
 * @returns Validation result with ok/data/error
 */
export const validateDemographics = (data: unknown) => {
  const result = demographicsDataSchema.safeParse(data)
  if (result.success) {
    return { ok: true, data: result.data, error: null }
  }
  return {
    ok: false,
    data: null,
    error: result.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
  }
}