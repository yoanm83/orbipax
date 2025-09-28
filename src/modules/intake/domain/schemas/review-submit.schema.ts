/**
 * Review & Submit Schema - Intake Domain
 * OrbiPax Community Mental Health (CMH) System
 *
 * Zod validation schemas for final review and submission step
 * Complete intake validation, submission, and status tracking
 */

import { z } from 'zod'
import {
  IntakeStatus,
  StepStatus,
  IntakeStep,
  BooleanResponse,
  type OrganizationId,
  type PatientId,
  type IntakeId
} from '../types/common'

// Import all step schemas for validation
import { demographicsSubmissionSchema } from './demographics/demographics.schema'
import { insuranceSubmissionSchema } from './insurance.schema'
import { clinicalHistorySubmissionSchema } from './clinical-history.schema'
import { medicationsSubmissionSchema } from './medications.schema'
import { goalsSubmissionSchema } from './goals.schema'
import { providersSubmissionSchema } from './providers.schema'
import { consentsSubmissionSchema } from './consents.schema'

// =================================================================
// STEP COMPLETION TRACKING SCHEMA
// =================================================================

export const stepCompletionSchema = z.object({
  step: z.nativeEnum(IntakeStep),
  status: z.nativeEnum(StepStatus),
  completedAt: z.date().optional(),
  completedBy: z.string().max(100).optional(),
  lastModified: z.date(),
  validationErrors: z.array(z.string()).default([]),
  notes: z.string().max(500).optional()
})

// =================================================================
// INTAKE VALIDATION SUMMARY SCHEMA
// =================================================================

export const validationSummarySchema = z.object({
  // Overall Validation Status
  isValid: z.boolean(),
  validationDate: z.date(),
  validatedBy: z.string().max(100).optional(),

  // Step-by-Step Validation
  stepValidations: z.array(z.object({
    step: z.nativeEnum(IntakeStep),
    isValid: z.boolean(),
    errorCount: z.number().min(0),
    warningCount: z.number().min(0),
    errors: z.array(z.object({
      field: z.string().max(100),
      message: z.string().max(300),
      severity: z.enum(['error', 'warning', 'info'])
    })).default([])
  })),

  // Critical Issues
  criticalIssues: z.array(z.object({
    step: z.nativeEnum(IntakeStep),
    issue: z.string().max(300),
    resolution: z.string().max(300).optional(),
    blocking: z.boolean()
  })).default([]),

  // Required Items Checklist
  requiredItemsCheck: z.object({
    demographics: z.boolean(),
    insurance: z.boolean(),
    clinicalHistory: z.boolean(),
    medications: z.boolean(),
    goals: z.boolean(),
    providers: z.boolean(),
    consents: z.boolean(),
    allRequired: z.boolean()
  }),

  // Data Quality Assessment
  dataQuality: z.object({
    completenessScore: z.number().min(0).max(100),
    accuracyScore: z.number().min(0).max(100),
    consistencyScore: z.number().min(0).max(100),
    overallScore: z.number().min(0).max(100)
  }),

  // Recommendations
  recommendations: z.array(z.string().max(500)).default([])
})

// =================================================================
// CLINICAL REVIEW SCHEMA
// =================================================================

export const clinicalReviewSchema = z.object({
  // Review Information
  reviewDate: z.date(),
  reviewedBy: z.string().min(1, 'Reviewer name is required').max(100),
  reviewerRole: z.enum([
    'intake-coordinator',
    'clinical-supervisor',
    'psychiatrist',
    'psychologist',
    'clinical-director',
    'case-manager',
    'other'
  ]),
  reviewerCredentials: z.string().max(50).optional(),

  // Clinical Assessment
  clinicalImpression: z.string().max(2000).optional(),
  diagnosticImpression: z.array(z.string()).default([]),
  riskAssessment: z.object({
    suicideRisk: z.enum(['low', 'moderate', 'high', 'imminent']),
    homicideRisk: z.enum(['low', 'moderate', 'high', 'imminent']),
    substanceUseRisk: z.enum(['low', 'moderate', 'high']),
    safetyConcerns: z.array(z.string()).default([]),
    protectiveFactors: z.array(z.string()).default([])
  }),

  // Eligibility Determination
  eligibilityDecision: z.enum(['eligible', 'ineligible', 'pending', 'conditional']),
  eligibilityReason: z.string().max(500).optional(),
  conditionsForEligibility: z.array(z.string()).default([]),

  // Service Recommendations
  recommendedServices: z.array(z.enum([
    'individual-therapy',
    'group-therapy',
    'family-therapy',
    'medication-management',
    'case-management',
    'crisis-services',
    'intensive-outpatient',
    'partial-hospitalization',
    'inpatient-referral',
    'peer-support',
    'substance-abuse-treatment',
    'vocational-services',
    'housing-assistance',
    'other'
  ])).default([]),

  recommendedFrequency: z.enum([
    'weekly',
    'bi-weekly',
    'monthly',
    'as-needed',
    'intensive-daily',
    'to-be-determined'
  ]).optional(),

  urgency: z.enum(['routine', 'urgent', 'emergent']),

  // Provider Assignment
  assignedProvider: z.string().max(100).optional(),
  providerType: z.enum([
    'psychiatrist',
    'psychologist',
    'clinical-social-worker',
    'licensed-counselor',
    'case-manager',
    'peer-specialist',
    'to-be-determined'
  ]).optional(),

  // Follow-up Requirements
  followUpRequired: z.boolean(),
  followUpTimeframe: z.string().max(100).optional(),
  followUpWith: z.string().max(100).optional(),

  // Review Status
  reviewStatus: z.enum(['approved', 'approved-with-conditions', 'pending-information', 'denied']),
  additionalInformationNeeded: z.array(z.string()).default([]),

  // Notes
  reviewNotes: z.string().max(2000).optional()
})

// =================================================================
// SUBMISSION TRACKING SCHEMA
// =================================================================

export const submissionTrackingSchema = z.object({
  // Submission Information
  submissionId: z.string().optional(), // System-generated
  submissionDate: z.date(),
  submittedBy: z.string().min(1, 'Submitter name is required').max(100),
  submitterRole: z.enum(['patient', 'family-member', 'staff', 'other']),

  // Submission Method
  submissionMethod: z.enum(['online-portal', 'paper-form', 'phone-intake', 'in-person', 'mobile-app']),
  submissionLocation: z.string().max(100).optional(),

  // Processing Information
  processingStatus: z.enum(['submitted', 'received', 'under-review', 'approved', 'denied', 'pending-info']),
  processingStartDate: z.date().optional(),
  estimatedCompletionDate: z.date().optional(),
  actualCompletionDate: z.date().optional(),

  // Assignment Information
  assignedTo: z.string().max(100).optional(),
  assignmentDate: z.date().optional(),
  department: z.string().max(100).optional(),

  // Communication Log
  communicationLog: z.array(z.object({
    date: z.date(),
    type: z.enum(['phone', 'email', 'letter', 'in-person', 'text', 'portal-message']),
    direction: z.enum(['incoming', 'outgoing']),
    summary: z.string().max(500),
    handledBy: z.string().max(100),
    outcome: z.string().max(300).optional()
  })).default([]),

  // Document Tracking
  documentsReceived: z.array(z.object({
    documentType: z.string().max(100),
    receivedDate: z.date(),
    receivedBy: z.string().max(100),
    status: z.enum(['complete', 'incomplete', 'pending-verification'])
  })).default([]),

  // Next Steps
  nextSteps: z.array(z.string().max(200)).default([]),
  actionItems: z.array(z.object({
    item: z.string().max(200),
    assignedTo: z.string().max(100),
    dueDate: z.date().optional(),
    status: z.enum(['pending', 'in-progress', 'completed', 'overdue'])
  })).default([])
})

// =================================================================
// COMPLETE INTAKE PACKAGE SCHEMA
// =================================================================

export const completeIntakePackageSchema = z.object({
  // Package Identification
  intakeId: z.string().min(1, 'Intake ID is required'),
  organizationId: z.string().min(1, 'Organization ID is required'),
  patientId: z.string().optional(), // May be generated during processing

  // All Step Data (validated against individual schemas)
  demographics: demographicsSubmissionSchema.shape.stepData,
  insurance: insuranceSubmissionSchema.shape.stepData,
  clinicalHistory: clinicalHistorySubmissionSchema.shape.stepData,
  medications: medicationsSubmissionSchema.shape.stepData,
  goals: goalsSubmissionSchema.shape.stepData,
  providers: providersSubmissionSchema.shape.stepData,
  consents: consentsSubmissionSchema.shape.stepData,

  // Step Completion Tracking
  stepCompletions: z.array(stepCompletionSchema),

  // Package Metadata
  packageMetadata: z.object({
    version: z.string().default('1.0'),
    createdAt: z.date(),
    lastModified: z.date(),
    totalSteps: z.number().default(8),
    completedSteps: z.number().min(0).max(8),
    estimatedCompletionTime: z.number().optional(), // in minutes
    actualCompletionTime: z.number().optional(), // in minutes
    source: z.enum(['wizard', 'import', 'manual', 'api']).default('wizard')
  })
})

// =================================================================
// MAIN REVIEW & SUBMIT SCHEMA
// =================================================================

export const reviewSubmitDataSchema = z.object({
  // Complete Intake Package
  intakePackage: completeIntakePackageSchema,

  // Validation Summary
  validationSummary: validationSummarySchema,

  // Step Completions Review
  stepCompletions: z.array(stepCompletionSchema),

  // Patient/Family Review
  patientReview: z.object({
    reviewedByPatient: z.boolean(),
    patientSignature: z.string().max(100).optional(),
    reviewDate: z.date().optional(),
    patientComments: z.string().max(1000).optional(),
    changesRequested: z.boolean().default(false),
    requestedChanges: z.array(z.object({
      step: z.nativeEnum(IntakeStep),
      field: z.string().max(100),
      currentValue: z.string().max(200),
      requestedValue: z.string().max(200),
      reason: z.string().max(300)
    })).default([])
  }),

  // Clinical Review (if required)
  clinicalReview: clinicalReviewSchema.optional(),

  // Submission Information
  submissionTracking: submissionTrackingSchema,

  // Final Status
  finalStatus: z.nativeEnum(IntakeStatus),
  statusReason: z.string().max(500).optional(),
  statusDate: z.date(),

  // Quality Assurance
  qualityAssurance: z.object({
    qaRequired: z.boolean(),
    qaCompleted: z.boolean().default(false),
    qaDate: z.date().optional(),
    qaBy: z.string().max(100).optional(),
    qaFindings: z.array(z.string()).default([]),
    qaRecommendations: z.array(z.string()).default([])
  }),

  // Integration Status
  integrationStatus: z.object({
    ehrIntegrated: z.boolean().default(false),
    billingIntegrated: z.boolean().default(false),
    schedulingIntegrated: z.boolean().default(false),
    integrationErrors: z.array(z.string()).default([]),
    integrationDate: z.date().optional()
  }),

  // Additional Notes
  reviewNotes: z.string().max(2000).optional()
})

// =================================================================
// MULTITENANT SUBMISSION SCHEMA
// =================================================================

export const reviewSubmitSubmissionSchema = z.object({
  organizationId: z.string().min(1, 'Organization ID is required'),
  intakeId: z.string().min(1, 'Intake ID is required'),
  patientId: z.string().optional(),
  stepData: reviewSubmitDataSchema,
  metadata: z.object({
    submittedAt: z.date().default(() => new Date()),
    version: z.string().default('1.0'),
    source: z.enum(['wizard', 'import', 'manual']).default('wizard'),
    finalSubmission: z.boolean().default(true),
    requiresApproval: z.boolean().default(true),
    priorityLevel: z.enum(['routine', 'urgent', 'emergent']).default('routine')
  })
})

// =================================================================
// VALIDATION HELPERS
// =================================================================

export const validateReviewSubmitStep = (data: unknown) => {
  return reviewSubmitDataSchema.safeParse(data)
}

export const validateReviewSubmitSubmission = (data: unknown) => {
  return reviewSubmitSubmissionSchema.safeParse(data)
}

// Validate complete intake package
export const validateCompleteIntake = (intakePackage: unknown) => {
  return completeIntakePackageSchema.safeParse(intakePackage)
}

// Calculate completion percentage
export const calculateCompletionPercentage = (stepCompletions: any[]): number => {
  const totalSteps = Object.values(IntakeStep).length
  const completedSteps = stepCompletions.filter(step =>
    step.status === StepStatus.COMPLETED
  ).length

  return Math.round((completedSteps / totalSteps) * 100)
}

// Generate submission summary
export const generateSubmissionSummary = (reviewData: any): string => {
  const completion = calculateCompletionPercentage(reviewData.stepCompletions)
  const status = reviewData.finalStatus
  const criticalIssues = reviewData.validationSummary.criticalIssues.filter(
    (issue: any) => issue.blocking
  ).length

  return `Intake ${completion}% complete, Status: ${status}, Critical Issues: ${criticalIssues}`
}

// Check if intake is ready for submission
export const isReadyForSubmission = (reviewData: any): boolean => {
  return reviewData.validationSummary.isValid &&
         reviewData.validationSummary.requiredItemsCheck.allRequired &&
         reviewData.patientReview.reviewedByPatient &&
         reviewData.validationSummary.criticalIssues.filter((issue: any) => issue.blocking).length === 0
}

// =================================================================
// TYPE EXPORTS
// =================================================================

export type StepCompletion = z.infer<typeof stepCompletionSchema>
export type ValidationSummary = z.infer<typeof validationSummarySchema>
export type ClinicalReview = z.infer<typeof clinicalReviewSchema>
export type SubmissionTracking = z.infer<typeof submissionTrackingSchema>
export type CompleteIntakePackage = z.infer<typeof completeIntakePackageSchema>
export type ReviewSubmitData = z.infer<typeof reviewSubmitDataSchema>
export type ReviewSubmitSubmission = z.infer<typeof reviewSubmitSubmissionSchema>