/**
 * Medications & Pharmacy Schema - Intake Domain
 * OrbiPax Community Mental Health (CMH) System
 *
 * Zod validation schemas for medications and pharmacy information
 * Psychiatric medications, allergies, and pharmacy preferences
 */

import { z } from 'zod'
import {
  BooleanResponse,
  SeverityLevel,
  type OrganizationId,
  type PatientId,
  type ProviderId
} from '../types/common'

// =================================================================
// MEDICATION SCHEMA
// =================================================================

export const medicationSchema = z.object({
  // Medication Identification
  medicationName: z.string().min(1, 'Medication name is required').max(100),
  genericName: z.string().max(100).optional(),
  brandName: z.string().max(100).optional(),
  ndcNumber: z.string().regex(/^\d{5}-\d{4}-\d{2}$/, 'Invalid NDC format').optional(),

  // Dosage Information
  strength: z.string().min(1, 'Medication strength is required').max(50),
  dosageForm: z.enum([
    'tablet',
    'capsule',
    'liquid',
    'injection',
    'patch',
    'cream',
    'ointment',
    'inhaler',
    'suppository',
    'other'
  ]),
  route: z.enum([
    'oral',
    'sublingual',
    'intramuscular',
    'intravenous',
    'subcutaneous',
    'topical',
    'inhalation',
    'rectal',
    'other'
  ]),

  // Prescription Details
  dosage: z.string().min(1, 'Dosage is required').max(100),
  frequency: z.string().min(1, 'Frequency is required').max(50),
  instructions: z.string().max(500).optional(),

  // Prescriber Information
  prescribedBy: z.string().max(100),
  prescribedDate: z.date(),
  daysSupply: z.number().min(1).max(365).optional(),

  // Current Status
  isCurrentlyTaking: z.boolean(),
  startDate: z.date(),
  endDate: z.date().optional(),
  reasonForStopping: z.string().max(200).optional(),

  // Clinical Information
  indication: z.string().max(200), // What condition it's treating
  effectiveness: z.enum(['very-effective', 'effective', 'somewhat-effective', 'not-effective', 'unknown']).optional(),
  sideEffects: z.array(z.string()).default([]),
  adherence: z.enum(['excellent', 'good', 'fair', 'poor', 'unknown']).optional(),

  // Pharmacy Information
  pharmacyName: z.string().max(100).optional(),
  pharmacyPhone: z.string().regex(/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/).optional(),

  // Additional Notes
  notes: z.string().max(500).optional()
})

// =================================================================
// ALLERGY SCHEMA
// =================================================================

export const allergySchema = z.object({
  // Allergen Information
  allergen: z.string().min(1, 'Allergen name is required').max(100),
  allergenType: z.enum([
    'medication',
    'food',
    'environmental',
    'latex',
    'contrast-dye',
    'other'
  ]),

  // Reaction Details
  reaction: z.array(z.enum([
    'rash',
    'hives',
    'itching',
    'swelling',
    'difficulty-breathing',
    'wheezing',
    'nausea',
    'vomiting',
    'diarrhea',
    'dizziness',
    'fainting',
    'anaphylaxis',
    'other'
  ])).min(1, 'At least one reaction required'),

  severity: z.nativeEnum(SeverityLevel),
  onsetDate: z.date().optional(),
  verified: z.boolean().default(false),
  notes: z.string().max(300).optional()
})

// =================================================================
// PHARMACY INFORMATION SCHEMA
// =================================================================

export const pharmacySchema = z.object({
  // Pharmacy Details
  pharmacyName: z.string().min(1, 'Pharmacy name is required').max(100),
  pharmacyChain: z.string().max(100).optional(),
  npi: z.string().regex(/^\d{10}$/, 'Invalid NPI format').optional(),

  // Contact Information
  phoneNumber: z.string()
    .regex(/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/, 'Invalid phone number format'),
  faxNumber: z.string()
    .regex(/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/, 'Invalid fax number format')
    .optional(),

  // Address
  address: z.object({
    street1: z.string().min(1).max(100),
    street2: z.string().max(100).optional(),
    city: z.string().min(1).max(50),
    state: z.string().min(2).max(2),
    zipCode: z.string().regex(/^\d{5}(-\d{4})?$/),
    country: z.string().max(2).default('US')
  }),

  // Pharmacy Type
  pharmacyType: z.enum([
    'retail',
    'hospital',
    'mail-order',
    'specialty',
    'long-term-care',
    'other'
  ]),

  // Preferences
  isPrimary: z.boolean(),
  deliveryAvailable: z.boolean().default(false),
  acceptsInsurance: z.boolean().default(true),

  // Hours (optional for enhanced service)
  hours: z.object({
    monday: z.string().optional(),
    tuesday: z.string().optional(),
    wednesday: z.string().optional(),
    thursday: z.string().optional(),
    friday: z.string().optional(),
    saturday: z.string().optional(),
    sunday: z.string().optional()
  }).optional()
})

// =================================================================
// MEDICATION HISTORY SCHEMA
// =================================================================

export const medicationHistorySchema = z.object({
  // Previous Psychiatric Medications
  hasPreviousPsychMeds: z.nativeEnum(BooleanResponse),

  previousPsychMedications: z.array(z.object({
    medicationName: z.string().max(100),
    indication: z.string().max(200),
    startDate: z.date(),
    endDate: z.date(),
    reasonForStopping: z.enum([
      'ineffective',
      'side-effects',
      'allergic-reaction',
      'cost',
      'doctor-recommendation',
      'patient-preference',
      'other'
    ]),
    reasonForStoppingOther: z.string().max(200).optional(),
    wasHelpful: z.nativeEnum(BooleanResponse),
    notes: z.string().max(300).optional()
  })).default([]),

  // Failed Medications (important for treatment planning)
  failedMedications: z.array(z.object({
    medicationName: z.string().max(100),
    reasonForFailure: z.enum([
      'no-response',
      'partial-response',
      'intolerable-side-effects',
      'allergic-reaction',
      'contraindication',
      'other'
    ]),
    trialLength: z.string().max(50), // e.g., "6 weeks", "3 months"
    maxDose: z.string().max(50).optional(),
    notes: z.string().max(300).optional()
  })).default([]),

  // Medication Response Patterns
  responsePatterns: z.object({
    respondsWellTo: z.array(z.enum([
      'ssri',
      'snri',
      'tricyclic',
      'antipsychotic',
      'mood-stabilizer',
      'benzodiazepine',
      'stimulant',
      'other'
    ])).default([]),

    problematicClasses: z.array(z.enum([
      'ssri',
      'snri',
      'tricyclic',
      'antipsychotic',
      'mood-stabilizer',
      'benzodiazepine',
      'stimulant',
      'other'
    ])).default([]),

    commonSideEffects: z.array(z.enum([
      'weight-gain',
      'weight-loss',
      'sedation',
      'insomnia',
      'sexual-dysfunction',
      'nausea',
      'headache',
      'dizziness',
      'dry-mouth',
      'constipation',
      'tremor',
      'other'
    ])).default([])
  })
})

// =================================================================
// MAIN MEDICATIONS SCHEMA
// =================================================================

export const medicationsDataSchema = z.object({
  // Current Medications
  currentMedications: z.array(medicationSchema).default([]),

  // Current Non-Psychiatric Medications
  otherMedications: z.array(medicationSchema).default([]),

  // Over-the-Counter Medications
  otcMedications: z.array(z.object({
    medicationName: z.string().max(100),
    purpose: z.string().max(200),
    frequency: z.string().max(50),
    isRegular: z.boolean()
  })).default([]),

  // Supplements and Vitamins
  supplements: z.array(z.object({
    supplementName: z.string().max(100),
    dosage: z.string().max(50),
    frequency: z.string().max(50),
    purpose: z.string().max(200).optional()
  })).default([]),

  // Allergies and Adverse Reactions
  hasAllergies: z.nativeEnum(BooleanResponse),
  allergies: z.array(allergySchema).default([]),

  // Medication History
  medicationHistory: medicationHistorySchema,

  // Pharmacy Information
  preferredPharmacies: z.array(pharmacySchema)
    .max(3, 'Maximum 3 pharmacies allowed')
    .refine(pharmacies => {
      const primaryCount = pharmacies.filter(p => p.isPrimary).length
      return primaryCount <= 1
    }, 'Only one primary pharmacy allowed'),

  // Medication Management
  medicationManagement: z.object({
    needsHelp: z.nativeEnum(BooleanResponse),
    usesReminderSystem: z.boolean(),
    reminderType: z.array(z.enum([
      'pill-organizer',
      'phone-alarm',
      'family-reminder',
      'medication-app',
      'other'
    ])).default([]),

    hasTransportationIssues: z.boolean(),
    hasFinancialConcerns: z.boolean(),
    missedDosesFrequency: z.enum([
      'never',
      'rarely',
      'sometimes',
      'often',
      'very-often'
    ]).optional()
  }),

  // Special Considerations
  specialConsiderations: z.object({
    hasSwallowingDifficulty: z.boolean(),
    prefersLiquidForms: z.boolean(),
    religiousRestrictions: z.string().max(200).optional(),
    culturalPreferences: z.string().max(200).optional(),
    languageBarriers: z.boolean(),
    literacyIssues: z.boolean()
  }),

  // Additional Notes
  medicationNotes: z.string().max(1000).optional()
})

// =================================================================
// MULTITENANT SUBMISSION SCHEMA
// =================================================================

export const medicationsSubmissionSchema = z.object({
  organizationId: z.string().min(1, 'Organization ID is required'),
  patientId: z.string().optional(),
  stepData: medicationsDataSchema,
  metadata: z.object({
    completedAt: z.date().default(() => new Date()),
    version: z.string().default('1.0'),
    source: z.enum(['wizard', 'import', 'manual']).default('wizard'),
    reviewedBy: z.string().max(100).optional(),
    pharmacyVerified: z.boolean().default(false)
  })
})

// =================================================================
// VALIDATION HELPERS
// =================================================================

export const validateMedicationsStep = (data: unknown) => {
  return medicationsDataSchema.safeParse(data)
}

export const validateMedicationsSubmission = (data: unknown) => {
  return medicationsSubmissionSchema.safeParse(data)
}

// Check for dangerous drug interactions (basic helper)
export const checkForInteractions = (medications: string[]): string[] => {
  // This would integrate with a drug interaction database
  // For now, return empty array - implement with clinical API
  return []
}

// Calculate medication adherence score
export const calculateAdherenceScore = (
  missedDosesFrequency: string,
  usesReminderSystem: boolean,
  hasSupport: boolean
): number => {
  let score = 100

  switch (missedDosesFrequency) {
    case 'rarely': score -= 10; break
    case 'sometimes': score -= 25; break
    case 'often': score -= 50; break
    case 'very-often': score -= 75; break
  }

  if (!usesReminderSystem) score -= 15
  if (!hasSupport) score -= 10

  return Math.max(0, score)
}

// =================================================================
// TYPE EXPORTS
// =================================================================

export type Medication = z.infer<typeof medicationSchema>
export type Allergy = z.infer<typeof allergySchema>
export type Pharmacy = z.infer<typeof pharmacySchema>
export type MedicationHistory = z.infer<typeof medicationHistorySchema>
export type MedicationsData = z.infer<typeof medicationsDataSchema>
export type MedicationsSubmission = z.infer<typeof medicationsSubmissionSchema>