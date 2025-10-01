/**
 * Clinical History Schema - Intake Domain
 * OrbiPax Community Mental Health (CMH) System
 *
 * Zod validation schemas for clinical history and assessment step
 * Mental health diagnosis, symptoms, and clinical evaluation
 */

import { z } from 'zod'
import {
  DiagnosisCategory,
  SeverityLevel,
  BooleanResponse,
  type OrganizationId,
  type PatientId,
  type ProviderId
} from '../types/common'

// =================================================================
// DIAGNOSIS SCHEMA
// =================================================================

export const diagnosisSchema = z.object({
  // Primary Diagnosis Information
  diagnosisCode: z.string().regex(/^[A-Z]\d{2}(\.\d{1,2})?$/, 'Invalid ICD-10 code format'),
  diagnosisDescription: z.string().min(1, 'Diagnosis description is required').max(200),
  category: z.nativeEnum(DiagnosisCategory),

  // Clinical Details
  isPrimary: z.boolean(),
  severity: z.nativeEnum(SeverityLevel).optional(),
  onsetDate: z.date().optional(),
  diagnosedBy: z.string().max(100).optional(),
  diagnosisDate: z.date().optional(),

  // Status
  isActive: z.boolean().default(true),
  inRemission: z.boolean().default(false),
  notes: z.string().max(500).optional()
})

// =================================================================
// SYMPTOM ASSESSMENT SCHEMA
// =================================================================

export const symptomAssessmentSchema = z.object({
  // Current Symptoms Checklist
  currentSymptoms: z.array(z.enum([
    'depressed-mood',
    'anxiety',
    'panic-attacks',
    'irritability',
    'mood-swings',
    'hopelessness',
    'guilt-worthlessness',
    'sleep-disturbance',
    'appetite-changes',
    'fatigue',
    'concentration-problems',
    'social-withdrawal',
    'hallucinations',
    'delusions',
    'paranoia',
    'disorganized-thinking',
    'substance-use',
    'self-harm-thoughts',
    'suicidal-thoughts',
    'homicidal-thoughts',
    'memory-problems',
    'attention-problems',
    'hyperactivity',
    'impulsivity',
    'obsessions',
    'compulsions',
    'flashbacks',
    'nightmares',
    'avoidance-behaviors',
    'eating-disorder-behaviors'
  ])).default([]),

  // Symptom Severity and Impact
  overallSeverity: z.nativeEnum(SeverityLevel),
  functionalImpairment: z.object({
    work: z.nativeEnum(SeverityLevel),
    relationships: z.nativeEnum(SeverityLevel),
    selfCare: z.nativeEnum(SeverityLevel),
    social: z.nativeEnum(SeverityLevel)
  }),

  // Symptom Duration
  symptomDuration: z.enum(['less-than-month', '1-3-months', '3-6-months', '6-12-months', 'over-year']),
  symptomOnset: z.enum(['gradual', 'sudden', 'episodic', 'unknown']),

  // Precipitating Factors
  precipitatingFactors: z.array(z.enum([
    'life-stress',
    'relationship-problems',
    'work-stress',
    'financial-problems',
    'health-problems',
    'family-problems',
    'trauma',
    'substance-use',
    'medication-changes',
    'unknown',
    'other'
  ])).default([]),

  precipitatingFactorsOther: z.string().max(200).optional()
})

// =================================================================
// MENTAL HEALTH HISTORY SCHEMA
// =================================================================

export const mentalHealthHistorySchema = z.object({
  // Previous Mental Health Treatment
  hasPreviousTreatment: z.nativeEnum(BooleanResponse),

  previousTreatments: z.array(z.object({
    type: z.enum(['outpatient-therapy', 'inpatient-psychiatric', 'intensive-outpatient', 'partial-hospitalization', 'medication-management', 'peer-support', 'other']),
    provider: z.string().max(100),
    startDate: z.date(),
    endDate: z.date().optional(),
    reasonForEnding: z.string().max(200).optional(),
    wasHelpful: z.nativeEnum(BooleanResponse),
    notes: z.string().max(300).optional()
  })).default([]),

  // Hospitalizations
  hasPsychiatricHospitalizations: z.nativeEnum(BooleanResponse),

  psychiatricHospitalizations: z.array(z.object({
    facilityName: z.string().max(100),
    admissionDate: z.date(),
    dischargeDate: z.date(),
    reasonForAdmission: z.string().max(200),
    lengthOfStay: z.number().min(1).max(365),
    wasVoluntary: z.boolean()
  })).default([]),

  // Suicide Risk Assessment
  suicideRiskHistory: z.object({
    hasSuicidalThoughts: z.nativeEnum(BooleanResponse),
    currentSuicidalThoughts: z.nativeEnum(BooleanResponse),
    hasSuicideAttempts: z.nativeEnum(BooleanResponse),

    suicideAttempts: z.array(z.object({
      attemptDate: z.date(),
      method: z.string().max(100),
      requiredMedicalTreatment: z.boolean(),
      circumstances: z.string().max(300).optional()
    })).default([]),

    protectiveFactors: z.array(z.enum([
      'family-support',
      'religious-beliefs',
      'future-goals',
      'responsibility-others',
      'fear-of-death',
      'no-access-means',
      'other'
    ])).default([]),

    riskFactors: z.array(z.enum([
      'social-isolation',
      'substance-use',
      'chronic-pain',
      'financial-stress',
      'relationship-problems',
      'legal-problems',
      'access-to-means',
      'impulsivity',
      'other'
    ])).default([])
  }),

  // Self-harm History
  selfHarmHistory: z.object({
    hasSelfHarm: z.nativeEnum(BooleanResponse),
    currentSelfHarm: z.nativeEnum(BooleanResponse),
    selfHarmMethods: z.array(z.enum([
      'cutting',
      'burning',
      'hitting',
      'hair-pulling',
      'skin-picking',
      'substance-abuse',
      'other'
    ])).default([]),
    selfHarmFrequency: z.enum(['daily', 'weekly', 'monthly', 'occasionally', 'rarely']).optional()
  })
})

// =================================================================
// SUBSTANCE USE HISTORY SCHEMA
// =================================================================

export const substanceUseHistorySchema = z.object({
  // Current Substance Use
  currentSubstanceUse: z.nativeEnum(BooleanResponse),

  substancesUsed: z.array(z.object({
    substance: z.enum([
      'alcohol',
      'marijuana',
      'cocaine',
      'heroin',
      'prescription-opioids',
      'methamphetamine',
      'prescription-stimulants',
      'prescription-benzodiazepines',
      'hallucinogens',
      'inhalants',
      'tobacco',
      'nicotine-vaping',
      'other'
    ]),
    frequency: z.enum(['daily', 'weekly', 'monthly', 'occasionally', 'rarely']),
    amount: z.string().max(50).optional(),
    routeOfUse: z.enum(['oral', 'smoking', 'injection', 'snorting', 'other']).optional(),
    lastUse: z.date().optional(),
    problemsFromUse: z.nativeEnum(BooleanResponse)
  })).default([]),

  // Substance Use Treatment History
  hasSubstanceTreatment: z.nativeEnum(BooleanResponse),

  substanceTreatments: z.array(z.object({
    type: z.enum(['inpatient-detox', 'outpatient-treatment', 'aa-na', 'medication-assisted-treatment', 'other']),
    provider: z.string().max(100),
    startDate: z.date(),
    endDate: z.date().optional(),
    completedProgram: z.boolean(),
    longestSobriety: z.string().max(50).optional()
  })).default([]),

  // Family Substance Use History
  familySubstanceHistory: z.nativeEnum(BooleanResponse),
  familySubstanceDetails: z.string().max(300).optional()
})

// =================================================================
// TRAUMA HISTORY SCHEMA
// =================================================================

export const traumaHistorySchema = z.object({
  // Trauma Exposure
  hasTraumaHistory: z.nativeEnum(BooleanResponse),

  traumaTypes: z.array(z.enum([
    'physical-abuse-child',
    'sexual-abuse-child',
    'emotional-abuse-child',
    'neglect-child',
    'domestic-violence-adult',
    'sexual-assault-adult',
    'physical-assault-adult',
    'combat-exposure',
    'serious-accident',
    'natural-disaster',
    'sudden-death-loved-one',
    'life-threatening-illness',
    'witnessing-violence',
    'other'
  ])).default([]),

  // Trauma Impact
  traumaImpactCurrent: z.nativeEnum(BooleanResponse),
  ptsdSymptoms: z.nativeEnum(BooleanResponse),

  traumaSymptoms: z.array(z.enum([
    'flashbacks',
    'nightmares',
    'intrusive-thoughts',
    'avoidance-triggers',
    'emotional-numbing',
    'hypervigilance',
    'startle-response',
    'sleep-problems',
    'concentration-problems',
    'irritability',
    'guilt-shame'
  ])).default([]),

  // Trauma Treatment
  hasTraumaTreatment: z.nativeEnum(BooleanResponse),
  traumaTreatmentTypes: z.array(z.enum([
    'trauma-focused-therapy',
    'emdr',
    'cbt-trauma',
    'exposure-therapy',
    'medication',
    'other'
  ])).default([])
})

// =================================================================
// MAIN CLINICAL HISTORY SCHEMA
// =================================================================

export const clinicalHistoryDataSchema = z.object({
  // Current Diagnoses
  currentDiagnoses: z.array(diagnosisSchema).default([]),

  // Symptom Assessment
  symptomAssessment: symptomAssessmentSchema,

  // Mental Health History
  mentalHealthHistory: mentalHealthHistorySchema,

  // Substance Use History
  substanceUseHistory: substanceUseHistorySchema,

  // Trauma History
  traumaHistory: traumaHistorySchema,

  // Family Mental Health History
  familyMentalHealthHistory: z.object({
    hasFamilyHistory: z.nativeEnum(BooleanResponse),
    familyConditions: z.array(z.enum([
      'depression',
      'anxiety',
      'bipolar-disorder',
      'schizophrenia',
      'substance-use',
      'suicide',
      'other'
    ])).default([]),
    familyHistoryDetails: z.string().max(500).optional()
  }),

  // Current Risk Assessment
  currentRiskLevel: z.enum(['low', 'moderate', 'high', 'imminent']),
  riskFactors: z.array(z.string()).default([]),
  protectiveFactors: z.array(z.string()).default([]),

  // Clinical Notes
  clinicalNotes: z.string().max(2000).optional(),
  assessmentSummary: z.string().max(1000).optional()
})

// =================================================================
// MULTITENANT SUBMISSION SCHEMA
// =================================================================

export const clinicalHistorySubmissionSchema = z.object({
  organizationId: z.string().min(1, 'Organization ID is required'),
  patientId: z.string().optional(),
  stepData: clinicalHistoryDataSchema,
  metadata: z.object({
    completedAt: z.date().default(() => new Date()),
    version: z.string().default('1.0'),
    source: z.enum(['wizard', 'import', 'manual']).default('wizard'),
    assessedBy: z.string().max(100).optional(),
    reviewRequired: z.boolean().default(true)
  })
})

// =================================================================
// VALIDATION HELPERS
// =================================================================

export const validateClinicalHistoryStep = (data: unknown) => {
  return clinicalHistoryDataSchema.safeParse(data)
}

export const validateClinicalHistorySubmission = (data: unknown) => {
  return clinicalHistorySubmissionSchema.safeParse(data)
}

// Risk assessment helper
export const calculateRiskLevel = (
  suicidalThoughts: boolean,
  substanceUse: boolean,
  traumaHistory: boolean,
  socialSupport: boolean
): string => {
  let riskScore = 0

  if (suicidalThoughts) riskScore += 3
  if (substanceUse) riskScore += 2
  if (traumaHistory) riskScore += 1
  if (!socialSupport) riskScore += 1

  if (riskScore >= 4) return 'high'
  if (riskScore >= 2) return 'moderate'
  return 'low'
}

// =================================================================
// TYPE EXPORTS
// =================================================================

export type Diagnosis = z.infer<typeof diagnosisSchema>
export type SymptomAssessment = z.infer<typeof symptomAssessmentSchema>
export type MentalHealthHistory = z.infer<typeof mentalHealthHistorySchema>
export type SubstanceUseHistory = z.infer<typeof substanceUseHistorySchema>
export type TraumaHistory = z.infer<typeof traumaHistorySchema>
export type ClinicalHistoryData = z.infer<typeof clinicalHistoryDataSchema>
export type ClinicalHistorySubmission = z.infer<typeof clinicalHistorySubmissionSchema>