/**
 * Insurance & Eligibility Schema - Intake Domain
 * OrbiPax Community Mental Health (CMH) System
 *
 * Zod validation schemas for insurance and eligibility step
 * CMH eligibility requirements and insurance verification
 */

import { z } from 'zod'
import {
  InsuranceType,
  BooleanResponse,
  type OrganizationId,
  type PatientId
} from '../types/common'

// =================================================================
// INSURANCE COVERAGE SCHEMA
// =================================================================

export const insuranceCoverageSchema = z.object({
  type: z.nativeEnum(InsuranceType),

  // Primary Insurance Information
  carrierName: z.string().min(1, 'Insurance carrier name is required').max(100),
  policyNumber: z.string().min(1, 'Policy number is required').max(50),
  groupNumber: z.string().max(50).optional(),

  // Subscriber Information
  subscriberName: z.string().min(1, 'Subscriber name is required').max(100),
  subscriberDateOfBirth: z.date(),
  subscriberRelationship: z.enum(['self', 'spouse', 'parent', 'child', 'other']),
  subscriberSSN: z.string()
    .regex(/^\d{3}-?\d{2}-?\d{4}$/, 'Invalid SSN format')
    .transform(val => val.replace(/\D/g, ''))
    .optional(),

  // Coverage Details
  effectiveDate: z.date(),
  expirationDate: z.date().optional(),
  isPrimary: z.boolean(),

  // Verification Status
  isVerified: z.boolean().default(false),
  verificationDate: z.date().optional(),
  verificationNotes: z.string().max(500).optional(),

  // Mental Health Coverage
  hasMentalHealthCoverage: z.nativeEnum(BooleanResponse),
  mentalHealthCopay: z.number().min(0).max(10000).optional(),
  mentalHealthDeductible: z.number().min(0).max(100000).optional(),
  annualMentalHealthLimit: z.number().min(0).optional(),

  // Authorization Requirements
  requiresPreAuth: z.nativeEnum(BooleanResponse),
  preAuthNumber: z.string().max(50).optional(),
  preAuthExpiration: z.date().optional()
})

// =================================================================
// CMH ELIGIBILITY CRITERIA SCHEMA
// =================================================================

export const eligibilityCriteriaSchema = z.object({
  // Geographic Eligibility
  residesInServiceArea: z.nativeEnum(BooleanResponse),
  serviceAreaCounty: z.string().max(50).optional(),

  // Age-based Eligibility
  ageGroup: z.enum(['child', 'adolescent', 'adult', 'senior']),
  isEligibleByAge: z.boolean(),

  // Clinical Eligibility
  hasDiagnosedMentalHealth: z.nativeEnum(BooleanResponse),
  diagnosisVerified: z.boolean().default(false),

  // Functional Impairment Assessment
  functionalImpairmentLevel: z.enum(['mild', 'moderate', 'severe', 'very-severe']).optional(),
  impactsDaily: z.nativeEnum(BooleanResponse),
  impactsWork: z.nativeEnum(BooleanResponse),
  impactsRelationships: z.nativeEnum(BooleanResponse),

  // Risk Factors
  suicidalIdeation: z.nativeEnum(BooleanResponse),
  substanceUse: z.nativeEnum(BooleanResponse),
  domesticViolence: z.nativeEnum(BooleanResponse),
  homelessness: z.nativeEnum(BooleanResponse),

  // Priority Populations
  isVeteran: z.boolean(),
  isPregnantPostpartum: z.boolean(),
  hasChildWelfare: z.boolean(),
  hasLegalInvolvement: z.boolean(),

  // Previous Services
  previousMentalHealthTreatment: z.nativeEnum(BooleanResponse),
  currentlyInTreatment: z.nativeEnum(BooleanResponse),
  lastTreatmentDate: z.date().optional(),
  reasonForLeaving: z.string().max(200).optional()
})

// =================================================================
// FINANCIAL INFORMATION SCHEMA
// =================================================================

export const financialInformationSchema = z.object({
  // Income Information
  householdSize: z.number().min(1).max(20),
  monthlyHouseholdIncome: z.number().min(0).max(1000000),
  incomeSource: z.array(z.enum([
    'employment',
    'unemployment',
    'disability',
    'social-security',
    'pension',
    'public-assistance',
    'other'
  ])).min(1, 'At least one income source required'),

  // Federal Poverty Level Calculation
  federalPovertyLevel: z.number().min(0).max(1000),
  qualifiesForSliding: z.boolean(),

  // Assets
  hasAssets: z.nativeEnum(BooleanResponse),
  totalAssets: z.number().min(0).optional(),

  // Benefits
  receivesMedicaid: z.boolean(),
  receivesMedicare: z.boolean(),
  receivesSSI: z.boolean(),
  receivesSSDI: z.boolean(),
  receivesTANF: z.boolean(),
  receivesSNAP: z.boolean(),

  // Payment Arrangements
  preferredPaymentMethod: z.enum(['insurance', 'sliding-scale', 'self-pay', 'grant-funded']),
  agreedToPayment: z.boolean(),
  paymentArrangementNotes: z.string().max(500).optional()
})

// =================================================================
// MAIN INSURANCE & ELIGIBILITY SCHEMA
// =================================================================

export const insuranceEligibilityDataSchema = z.object({
  // Insurance Coverage (can have multiple)
  insuranceCoverages: z.array(insuranceCoverageSchema)
    .max(3, 'Maximum 3 insurance coverages allowed')
    .refine(coverages => {
      const primaryCount = coverages.filter(c => c.isPrimary).length
      return primaryCount <= 1
    }, 'Only one primary insurance allowed'),

  // Uninsured status
  isUninsured: z.boolean(),
  uninsuredReason: z.string().max(200).optional(),

  // CMH Eligibility Assessment
  eligibilityCriteria: eligibilityCriteriaSchema,

  // Financial Information
  financialInformation: financialInformationSchema,

  // Eligibility Determination
  eligibilityStatus: z.enum(['eligible', 'pending', 'ineligible', 'conditional']).optional(),
  eligibilityDeterminedBy: z.string().max(100).optional(),
  eligibilityDeterminedDate: z.date().optional(),
  eligibilityNotes: z.string().max(1000).optional(),

  // Special Programs Eligibility
  specialProgramsEligible: z.array(z.enum([
    'crisis-services',
    'intensive-outpatient',
    'assertive-community-treatment',
    'peer-support',
    'family-services',
    'substance-abuse-treatment',
    'housing-support',
    'vocational-rehabilitation'
  ])).default([]),

  // Required Documentation
  documentsProvided: z.array(z.enum([
    'photo-id',
    'insurance-card',
    'income-verification',
    'benefit-award-letter',
    'medical-records',
    'court-order',
    'custody-documents'
  ])).default([]),

  documentsNeeded: z.array(z.enum([
    'photo-id',
    'insurance-card',
    'income-verification',
    'benefit-award-letter',
    'medical-records',
    'court-order',
    'custody-documents'
  ])).default([])
})

// =================================================================
// MULTITENANT SUBMISSION SCHEMA
// =================================================================

export const insuranceSubmissionSchema = z.object({
  organizationId: z.string().min(1, 'Organization ID is required'),
  patientId: z.string().optional(),
  stepData: insuranceEligibilityDataSchema,
  metadata: z.object({
    completedAt: z.date().default(() => new Date()),
    version: z.string().default('1.0'),
    source: z.enum(['wizard', 'import', 'manual']).default('wizard'),
    verificationRequired: z.boolean().default(true)
  })
})

// =================================================================
// VALIDATION HELPERS
// =================================================================

export const validateInsuranceStep = (data: unknown) => {
  return insuranceEligibilityDataSchema.safeParse(data)
}

export const validateInsuranceSubmission = (data: unknown) => {
  return insuranceSubmissionSchema.safeParse(data)
}

// Calculate Federal Poverty Level percentage
export const calculateFPLPercentage = (
  householdIncome: number,
  householdSize: number,
  fplGuidelines: Record<number, number>
): number => {
  const applicableFPL = fplGuidelines[householdSize] || fplGuidelines[8] // Max size typically 8+
  return Math.round((householdIncome / applicableFPL) * 100)
}

// Determine sliding scale eligibility
export const determineSlideScale = (fplPercentage: number): boolean => {
  return fplPercentage <= 300 // Common CMH threshold: 300% of FPL
}

// =================================================================
// TYPE EXPORTS
// =================================================================

export type InsuranceCoverage = z.infer<typeof insuranceCoverageSchema>
export type EligibilityCriteria = z.infer<typeof eligibilityCriteriaSchema>
export type FinancialInformation = z.infer<typeof financialInformationSchema>
export type InsuranceEligibilityData = z.infer<typeof insuranceEligibilityDataSchema>
export type InsuranceSubmission = z.infer<typeof insuranceSubmissionSchema>