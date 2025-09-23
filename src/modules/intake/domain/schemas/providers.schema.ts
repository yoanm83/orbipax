/**
 * Medical Providers Schema - Intake Domain
 * OrbiPax Community Mental Health (CMH) System
 *
 * Zod validation schemas for current and previous healthcare providers
 * Primary care, specialists, mental health providers, and referrals
 */

import { z } from 'zod'
import {
  ProviderType,
  BooleanResponse,
  type OrganizationId,
  type PatientId,
  type ProviderId
} from '../types/common'

// =================================================================
// PROVIDER CONTACT SCHEMA
// =================================================================

export const providerContactSchema = z.object({
  // Basic Provider Information
  firstName: z.string().min(1, 'Provider first name is required').max(50),
  lastName: z.string().min(1, 'Provider last name is required').max(50),
  title: z.string().max(20).optional(), // Dr., Mr., Ms., etc.
  credentials: z.string().max(50).optional(), // MD, PhD, LCSW, etc.

  // Professional Identifiers
  npi: z.string()
    .regex(/^\d{10}$/, 'NPI must be 10 digits')
    .optional(),
  licenseNumber: z.string().max(50).optional(),
  licenseState: z.string().max(2).optional(),

  // Provider Type and Specialty
  providerType: z.nativeEnum(ProviderType),
  specialty: z.string().max(100).optional(),
  subspecialty: z.string().max(100).optional(),

  // Practice Information
  practiceName: z.string().max(100).optional(),
  hospitalAffiliation: z.string().max(100).optional(),

  // Contact Information
  phoneNumber: z.string()
    .regex(/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/, 'Invalid phone number format'),
  faxNumber: z.string()
    .regex(/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/, 'Invalid fax number format')
    .optional(),
  email: z.string().email('Invalid email format').max(100).optional(),

  // Address
  address: z.object({
    street1: z.string().min(1, 'Street address is required').max(100),
    street2: z.string().max(100).optional(),
    city: z.string().min(1, 'City is required').max(50),
    state: z.string().min(2, 'State is required').max(2),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
    country: z.string().max(2).default('US')
  }),

  // Practice Details
  acceptsInsurance: z.boolean().default(true),
  acceptedInsurances: z.array(z.string()).default([]),
  languagesSpoken: z.array(z.string()).default(['English']),

  // Accessibility
  isWheelchairAccessible: z.boolean().optional(),
  hasInterpreterServices: z.boolean().optional(),
  hasTelehealth: z.boolean().default(false),

  // Office Hours
  officeHours: z.object({
    monday: z.string().max(50).optional(),
    tuesday: z.string().max(50).optional(),
    wednesday: z.string().max(50).optional(),
    thursday: z.string().max(50).optional(),
    friday: z.string().max(50).optional(),
    saturday: z.string().max(50).optional(),
    sunday: z.string().max(50).optional()
  }).optional()
})

// =================================================================
// PROVIDER RELATIONSHIP SCHEMA
// =================================================================

export const providerRelationshipSchema = z.object({
  // Provider Information
  provider: providerContactSchema,

  // Relationship Details
  relationshipType: z.enum([
    'current-primary-care',
    'current-specialist',
    'current-mental-health',
    'previous-provider',
    'referring-provider',
    'consulting-provider',
    'emergency-contact'
  ]),

  // Current Status
  isCurrentProvider: z.boolean(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  reasonForEnding: z.string().max(200).optional(),

  // Care Details
  servicesProvided: z.array(z.enum([
    'primary-care',
    'routine-checkups',
    'chronic-disease-management',
    'medication-management',
    'individual-therapy',
    'group-therapy',
    'family-therapy',
    'psychiatric-evaluation',
    'psychological-testing',
    'crisis-intervention',
    'case-management',
    'substance-abuse-treatment',
    'specialized-therapy',
    'medical-specialty',
    'other'
  ])).default([]),

  frequencyOfVisits: z.enum([
    'weekly',
    'bi-weekly',
    'monthly',
    'quarterly',
    'bi-annually',
    'annually',
    'as-needed',
    'unknown'
  ]).optional(),

  lastVisitDate: z.date().optional(),
  nextAppointmentDate: z.date().optional(),

  // Communication Preferences
  okayToContact: z.boolean().default(true),
  releaseOfInformationSigned: z.boolean().default(false),
  releaseOfInfoDate: z.date().optional(),
  releaseExpirationDate: z.date().optional(),

  // Quality of Care
  satisfactionLevel: z.enum([
    'very-satisfied',
    'satisfied',
    'neutral',
    'dissatisfied',
    'very-dissatisfied',
    'unknown'
  ]).optional(),

  // Notes
  notes: z.string().max(500).optional()
})

// =================================================================
// REFERRAL SCHEMA
// =================================================================

export const referralSchema = z.object({
  // Referral Information
  referralId: z.string().optional(), // System-generated
  referralDate: z.date(),
  urgency: z.enum(['routine', 'urgent', 'emergent']),

  // Referring Provider
  referringProvider: providerContactSchema.optional(),
  referralSource: z.enum([
    'primary-care-physician',
    'specialist',
    'mental-health-provider',
    'emergency-department',
    'self-referral',
    'family-friend',
    'insurance-company',
    'school-employer',
    'court-system',
    'social-services',
    'other'
  ]),

  // Referral Target
  referredTo: z.enum([
    'psychiatrist',
    'psychologist',
    'therapist',
    'social-worker',
    'substance-abuse-counselor',
    'case-manager',
    'peer-support',
    'intensive-outpatient',
    'inpatient-psychiatric',
    'crisis-services',
    'medical-specialist',
    'other'
  ]),

  // Clinical Information
  reasonForReferral: z.string().min(1, 'Reason for referral is required').max(500),
  clinicalSummary: z.string().max(1000).optional(),
  diagnosesAtReferral: z.array(z.string()).default([]),
  medicationsAtReferral: z.array(z.string()).default([]),

  // Referral Status
  status: z.enum([
    'pending',
    'scheduled',
    'completed',
    'cancelled',
    'declined',
    'no-show'
  ]).default('pending'),

  appointmentScheduled: z.boolean().default(false),
  appointmentDate: z.date().optional(),
  appointmentTime: z.string().max(20).optional(),

  // Follow-up
  followUpRequired: z.boolean().default(true),
  followUpWith: z.string().max(100).optional(),
  referralNotes: z.string().max(500).optional()
})

// =================================================================
// HEALTHCARE TEAM SCHEMA
// =================================================================

export const healthcareTeamSchema = z.object({
  // Team Composition
  hasPrimaryCare: z.nativeEnum(BooleanResponse),
  hasSpecialists: z.nativeEnum(BooleanResponse),
  hasMentalHealthProviders: z.nativeEnum(BooleanResponse),

  // Care Coordination
  careCoordinator: z.object({
    hasCoordinator: z.boolean(),
    coordinatorName: z.string().max(100).optional(),
    coordinatorRole: z.string().max(50).optional(),
    coordinatorContact: z.string().max(100).optional()
  }),

  // Communication Between Providers
  providersComm: z.object({
    providersShareInfo: z.nativeEnum(BooleanResponse),
    communicationMethod: z.array(z.enum([
      'electronic-health-record',
      'secure-messaging',
      'phone-calls',
      'fax',
      'mail',
      'patient-reports',
      'none'
    ])).default([]),

    communicationFrequency: z.enum([
      'real-time',
      'weekly',
      'monthly',
      'as-needed',
      'rarely',
      'never'
    ]).optional()
  }),

  // Patient Experience
  teamSatisfaction: z.enum([
    'very-satisfied',
    'satisfied',
    'neutral',
    'dissatisfied',
    'very-dissatisfied'
  ]).optional(),

  teamCommunicationIssues: z.string().max(300).optional(),
  improvementSuggestions: z.string().max(300).optional()
})

// =================================================================
// MAIN PROVIDERS SCHEMA
// =================================================================

export const providersDataSchema = z.object({
  // Current Providers
  currentProviders: z.array(providerRelationshipSchema).default([]),

  // Previous Providers (last 5 years)
  previousProviders: z.array(providerRelationshipSchema).default([]),

  // Primary Care Provider
  hasPrimaryCareProvider: z.nativeEnum(BooleanResponse),
  primaryCareProvider: providerRelationshipSchema.optional(),

  // Mental Health Providers
  currentMentalHealthProviders: z.array(providerRelationshipSchema).default([]),

  // Specialists
  currentSpecialists: z.array(providerRelationshipSchema).default([]),

  // Referrals
  recentReferrals: z.array(referralSchema).default([]),
  pendingReferrals: z.array(referralSchema).default([]),

  // Healthcare Team
  healthcareTeam: healthcareTeamSchema,

  // Provider Preferences for Future Care
  providerPreferences: z.object({
    preferredGender: z.enum(['male', 'female', 'non-binary', 'no-preference']),
    preferredAge: z.enum(['younger', 'similar-age', 'older', 'no-preference']),
    languagePreference: z.array(z.string()).default(['English']),

    culturalConsiderations: z.string().max(300).optional(),
    religiousConsiderations: z.string().max(300).optional(),

    preferredLocation: z.enum([
      'close-to-home',
      'close-to-work',
      'specific-neighborhood',
      'telehealth-only',
      'no-preference'
    ]).optional(),

    transportationNeeds: z.boolean(),
    schedulingNeeds: z.array(z.enum([
      'early-morning',
      'daytime',
      'evening',
      'weekend',
      'flexible'
    ])).default([]),

    importantQualities: z.array(z.enum([
      'experienced',
      'specializes-in-condition',
      'good-communicator',
      'patient-listener',
      'culturally-competent',
      'lgbtq-affirming',
      'trauma-informed',
      'collaborative-approach',
      'evidence-based-practice',
      'holistic-approach'
    ])).default([])
  }),

  // Emergency Contacts
  emergencyContacts: z.array(z.object({
    contactType: z.enum(['provider', 'family', 'friend', 'other']),
    name: z.string().min(1).max(100),
    relationship: z.string().max(50),
    phoneNumber: z.string().regex(/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/),
    alternatePhone: z.string().regex(/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/).optional(),
    canMakeDecisions: z.boolean().default(false),
    notes: z.string().max(200).optional()
  })).default([]),

  // Additional Information
  providersNotes: z.string().max(1000).optional()
})

// =================================================================
// MULTITENANT SUBMISSION SCHEMA
// =================================================================

export const providersSubmissionSchema = z.object({
  organizationId: z.string().min(1, 'Organization ID is required'),
  patientId: z.string().optional(),
  stepData: providersDataSchema,
  metadata: z.object({
    completedAt: z.date().default(() => new Date()),
    version: z.string().default('1.0'),
    source: z.enum(['wizard', 'import', 'manual']).default('wizard'),
    verificationRequired: z.boolean().default(false),
    releaseFormsNeeded: z.boolean().default(true)
  })
})

// =================================================================
// VALIDATION HELPERS
// =================================================================

export const validateProvidersStep = (data: unknown) => {
  return providersDataSchema.safeParse(data)
}

export const validateProvidersSubmission = (data: unknown) => {
  return providersSubmissionSchema.safeParse(data)
}

// Validate NPI number format and checksum
export const validateNPI = (npi: string): boolean => {
  if (!/^\d{10}$/.test(npi)) return false

  // Luhn algorithm for NPI validation
  let sum = 0
  let alternate = false

  for (let i = npi.length - 1; i >= 0; i--) {
    let digit = parseInt(npi.charAt(i))
    if (alternate) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    alternate = !alternate
  }

  return sum % 10 === 0
}

// Check for provider accessibility features
export const assessProviderAccessibility = (provider: any): string[] => {
  const accessibilityFeatures = []

  if (provider.isWheelchairAccessible) accessibilityFeatures.push('wheelchair-accessible')
  if (provider.hasInterpreterServices) accessibilityFeatures.push('interpreter-services')
  if (provider.hasTelehealth) accessibilityFeatures.push('telehealth-available')
  if (provider.languagesSpoken.length > 1) accessibilityFeatures.push('multilingual')

  return accessibilityFeatures
}

// =================================================================
// TYPE EXPORTS
// =================================================================

export type ProviderContact = z.infer<typeof providerContactSchema>
export type ProviderRelationship = z.infer<typeof providerRelationshipSchema>
export type Referral = z.infer<typeof referralSchema>
export type HealthcareTeam = z.infer<typeof healthcareTeamSchema>
export type ProvidersData = z.infer<typeof providersDataSchema>
export type ProvidersSubmission = z.infer<typeof providersSubmissionSchema>