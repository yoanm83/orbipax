/**
 * Treatment Goals Schema - Intake Domain
 * OrbiPax Community Mental Health (CMH) System
 *
 * Zod validation schemas for treatment goals and focus areas
 * SMART goals, recovery objectives, and treatment preferences
 */

import { z } from 'zod'
import { validateName, normalizeName, NAME_LENGTHS } from '@/shared/utils/name'
import {
  PriorityLevel,
  BooleanResponse,
  type OrganizationId,
  type PatientId
} from '../types/common'

// =================================================================
// TREATMENT GOAL SCHEMA
// =================================================================

export const treatmentGoalSchema = z.object({
  // Goal Identification
  goalId: z.string().optional(), // System-generated if needed
  goalStatement: z.string()
    .min(10, 'Goal statement must be at least 10 characters')
    .max(500, 'Goal statement too long'),

  // SMART Goal Components
  isSpecific: z.boolean(),
  isMeasurable: z.boolean(),
  isAchievable: z.boolean(),
  isRelevant: z.boolean(),
  isTimeBound: z.boolean(),

  // Goal Category
  category: z.enum([
    'symptom-reduction',
    'functional-improvement',
    'relationship-improvement',
    'work-school-performance',
    'self-care-management',
    'substance-use-reduction',
    'trauma-recovery',
    'medication-compliance',
    'crisis-prevention',
    'social-skills',
    'coping-skills',
    'life-skills',
    'housing-stability',
    'financial-management',
    'other'
  ]),

  // Priority and Timeline
  priority: z.nativeEnum(PriorityLevel),
  targetDate: z.date().optional(),
  estimatedTimeframe: z.enum([
    '1-month',
    '3-months',
    '6-months',
    '1-year',
    'ongoing',
    'unknown'
  ]),

  // Measurable Outcomes
  successCriteria: z.array(z.string().max(200)).min(1, 'At least one success criterion required'),
  measurementMethod: z.enum([
    'self-report',
    'clinical-assessment',
    'behavioral-observation',
    'standardized-scale',
    'functional-assessment',
    'other'
  ]),

  // Goal Status
  status: z.enum(['active', 'achieved', 'modified', 'discontinued']).default('active'),
  progressNotes: z.string().max(1000).optional(),

  // Support Needed
  supportNeeded: z.array(z.enum([
    'individual-therapy',
    'group-therapy',
    'family-therapy',
    'medication-management',
    'case-management',
    'peer-support',
    'crisis-services',
    'vocational-services',
    'housing-assistance',
    'financial-assistance',
    'transportation',
    'childcare',
    'other'
  ])).default([]),

  // Barriers and Challenges
  potentialBarriers: z.array(z.string().max(200)).default([]),
  strategiesForBarriers: z.array(z.string().max(200)).default([])
})

// =================================================================
// TREATMENT PREFERENCES SCHEMA
// =================================================================

export const treatmentPreferencesSchema = z.object({
  // Therapy Preferences
  therapyPreferences: z.object({
    preferredTherapyTypes: z.array(z.enum([
      'individual-therapy',
      'group-therapy',
      'family-therapy',
      'couples-therapy',
      'art-therapy',
      'music-therapy',
      'play-therapy',
      'cognitive-behavioral',
      'dialectical-behavioral',
      'trauma-focused',
      'mindfulness-based',
      'psychodynamic',
      'solution-focused',
      'other'
    ])).default([]),

    therapyFrequency: z.enum([
      'weekly',
      'bi-weekly',
      'monthly',
      'as-needed',
      'intensive-daily',
      'no-preference'
    ]).optional(),

    sessionLength: z.enum([
      '30-minutes',
      '45-minutes',
      '60-minutes',
      '90-minutes',
      'no-preference'
    ]).optional(),

    groupTherapyComfort: z.nativeEnum(BooleanResponse),
    familyInvolvement: z.nativeEnum(BooleanResponse)
  }),

  // Provider Preferences
  providerPreferences: z.object({
    genderPreference: z.enum(['male', 'female', 'non-binary', 'no-preference']),
    agePreference: z.enum(['younger', 'similar-age', 'older', 'no-preference']),
    languagePreference: z.array(z.string()).default(['English']),
    culturalConsiderations: z.string().max(300).optional(),
    religiousConsiderations: z.string().max(300).optional(),

    importantQualities: z.array(z.enum([
      'empathetic',
      'direct',
      'patient',
      'experienced',
      'specialized-expertise',
      'flexible-scheduling',
      'culturally-competent',
      'trauma-informed',
      'lgbtq-affirming',
      'other'
    ])).default([])
  }),

  // Medication Preferences
  medicationPreferences: z.object({
    openToMedication: z.nativeEnum(BooleanResponse),
    medicationConcerns: z.array(z.enum([
      'side-effects',
      'addiction-potential',
      'cost',
      'stigma',
      'effectiveness-doubts',
      'religious-beliefs',
      'pregnancy-concerns',
      'drug-interactions',
      'other'
    ])).default([]),

    preferredMedicationTypes: z.array(z.enum([
      'natural-supplements',
      'minimal-side-effects',
      'short-term-use',
      'proven-effectiveness',
      'newer-medications',
      'generic-medications',
      'no-preference'
    ])).default([]),

    willingToTryMedication: z.boolean().optional()
  }),

  // Service Delivery Preferences
  serviceDeliveryPreferences: z.object({
    preferredLocation: z.array(z.enum([
      'clinic-office',
      'community-location',
      'home-based',
      'telehealth',
      'mobile-crisis',
      'hospital-setting'
    ])).default([]),

    schedulingPreferences: z.object({
      preferredDays: z.array(z.enum([
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
      ])).default([]),

      preferredTimes: z.array(z.enum([
        'early-morning',
        'morning',
        'afternoon',
        'evening',
        'night'
      ])).default([]),

      flexibilityNeeded: z.boolean(),
      transportationNeeds: z.boolean(),
      childcareNeeds: z.boolean()
    }),

    communicationPreferences: z.array(z.enum([
      'phone-calls',
      'text-messages',
      'email',
      'patient-portal',
      'in-person-only',
      'mail'
    ])).default([])
  })
})

// =================================================================
// RECOVERY OBJECTIVES SCHEMA
// =================================================================

export const recoveryObjectivesSchema = z.object({
  // Personal Recovery Vision
  recoveryVision: z.string()
    .max(1000, 'Recovery vision too long')
    .optional(),

  // Life Domains to Focus On
  focusAreas: z.array(z.enum([
    'mental-health-symptoms',
    'physical-health',
    'relationships-family',
    'relationships-romantic',
    'relationships-friends',
    'work-employment',
    'education-training',
    'housing-living-situation',
    'financial-stability',
    'legal-issues',
    'substance-use',
    'parenting-children',
    'spirituality-religion',
    'recreation-hobbies',
    'community-involvement',
    'self-care-wellness'
  ])).min(1, 'At least one focus area required'),

  // Strengths and Resources
  personalStrengths: z.array(z.string().max(100)).default([]),
  supportSystems: z.array(z.string().max(100)).default([]),
  copingStrategies: z.array(z.string().max(100)).default([]),

  // Motivation and Readiness
  motivationLevel: z.enum(['very-motivated', 'motivated', 'somewhat-motivated', 'not-motivated']),
  readinessForChange: z.enum(['ready', 'somewhat-ready', 'unsure', 'not-ready']),

  changeImportance: z.number().min(1).max(10), // Scale 1-10
  changeConfidence: z.number().min(1).max(10), // Scale 1-10

  // Past Successes
  pastSuccesses: z.array(z.object({
    successDescription: z.string().max(200),
    strategiesUsed: z.string().max(200),
    lessonsLearned: z.string().max(200)
  })).default([]),

  // Hopes and Fears
  hopesForTreatment: z.array(z.string().max(200)).default([]),
  fearsAboutTreatment: z.array(z.string().max(200)).default([]),

  // Quality of Life Goals
  qualityOfLifeGoals: z.object({
    immediateGoals: z.array(z.string().max(200)).default([]), // 1-3 months
    shortTermGoals: z.array(z.string().max(200)).default([]), // 6 months
    longTermGoals: z.array(z.string().max(200)).default([])   // 1+ years
  })
})

// =================================================================
// MAIN GOALS SCHEMA
// =================================================================

export const goalsDataSchema = z.object({
  // Treatment Goals
  treatmentGoals: z.array(treatmentGoalSchema)
    .min(1, 'At least one treatment goal required')
    .max(10, 'Maximum 10 treatment goals allowed'),

  // Treatment Preferences
  treatmentPreferences: treatmentPreferencesSchema,

  // Recovery Objectives
  recoveryObjectives: recoveryObjectivesSchema,

  // Crisis Prevention Plan
  crisisPrevention: z.object({
    hasHistoryOfCrisis: z.nativeEnum(BooleanResponse),
    crisisTriggers: z.array(z.string().max(200)).default([]),
    earlyWarningSigns: z.array(z.string().max(200)).default([]),
    copingStrategies: z.array(z.string().max(200)).default([]),

    supportContacts: z.array(z.object({
      name: z.string()
        .max(NAME_LENGTHS.FULL_NAME)
        .transform(normalizeName)
        .refine(validateName, 'Invalid characters in contact name'),
      relationship: z.string().max(50),
      phoneNumber: z.string().regex(/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/),
      availableWhen: z.string().max(100).optional()
    })).default([]),

    professionalContacts: z.array(z.object({
      name: z.string()
        .max(NAME_LENGTHS.FULL_NAME)
        .transform(normalizeName)
        .refine(validateName, 'Invalid characters in professional name'),
      role: z.string().max(50),
      phoneNumber: z.string().regex(/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/),
      afterHoursContact: z.boolean()
    })).default([]),

    crisisServices: z.object({
      knowsCrisisHotline: z.boolean(),
      willingToUseCrisisServices: z.boolean(),
      preferredCrisisResponse: z.enum([
        'mobile-crisis',
        'emergency-room',
        'crisis-center',
        'police-mental-health',
        'family-support',
        'other'
      ]).optional()
    })
  }),

  // Discharge Planning Goals
  dischargePlanning: z.object({
    estimatedTreatmentLength: z.enum([
      'short-term-3-6-months',
      'medium-term-6-12-months',
      'long-term-1-2-years',
      'ongoing-indefinite',
      'unknown'
    ]).optional(),

    dischargeGoals: z.array(z.string().max(200)).default([]),
    aftercarePlanning: z.object({
      willingToEngageAftercare: z.boolean(),
      preferredAftercare: z.array(z.enum([
        'continued-therapy',
        'medication-management',
        'support-groups',
        'peer-support',
        'case-management',
        'crisis-services-only',
        'no-aftercare'
      ])).default([])
    })
  }),

  // Additional Notes
  goalsNotes: z.string().max(1000).optional()
})

// =================================================================
// MULTITENANT SUBMISSION SCHEMA
// =================================================================

export const goalsSubmissionSchema = z.object({
  organizationId: z.string().min(1, 'Organization ID is required'),
  patientId: z.string().optional(),
  stepData: goalsDataSchema,
  metadata: z.object({
    completedAt: z.date().default(() => new Date()),
    version: z.string().default('1.0'),
    source: z.enum(['wizard', 'import', 'manual']).default('wizard'),
    collaborativelyDeveloped: z.boolean().default(true),
    reviewedWithPatient: z.boolean().default(false)
  })
})

// =================================================================
// VALIDATION HELPERS
// =================================================================

export const validateGoalsStep = (data: unknown) => {
  return goalsDataSchema.safeParse(data)
}

export const validateGoalsSubmission = (data: unknown) => {
  return goalsSubmissionSchema.safeParse(data)
}

// Validate SMART goal criteria
export const validateSmartGoal = (goal: any): boolean => {
  return goal.isSpecific &&
         goal.isMeasurable &&
         goal.isAchievable &&
         goal.isRelevant &&
         goal.isTimeBound
}

// Calculate motivation score
export const calculateMotivationScore = (
  importance: number,
  confidence: number,
  readiness: string
): number => {
  let readinessScore = 0
  switch (readiness) {
    case 'ready': readinessScore = 10; break
    case 'somewhat-ready': readinessScore = 7; break
    case 'unsure': readinessScore = 4; break
    case 'not-ready': readinessScore = 1; break
  }

  return Math.round((importance + confidence + readinessScore) / 3)
}

// =================================================================
// TYPE EXPORTS
// =================================================================

export type TreatmentGoal = z.infer<typeof treatmentGoalSchema>
export type TreatmentPreferences = z.infer<typeof treatmentPreferencesSchema>
export type RecoveryObjectives = z.infer<typeof recoveryObjectivesSchema>
export type GoalsData = z.infer<typeof goalsDataSchema>
export type GoalsSubmission = z.infer<typeof goalsSubmissionSchema>