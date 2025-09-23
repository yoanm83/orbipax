/**
 * Legal Forms & Consents Schema - Intake Domain
 * OrbiPax Community Mental Health (CMH) System
 *
 * Zod validation schemas for legal consents and authorizations
 * HIPAA, treatment consents, and releases of information
 */

import { z } from 'zod'
import {
  ConsentType,
  BooleanResponse,
  type OrganizationId,
  type PatientId
} from '../types/common'

// =================================================================
// CONSENT SIGNATURE SCHEMA
// =================================================================

export const consentSignatureSchema = z.object({
  // Signature Information
  signerName: z.string().min(1, 'Signer name is required').max(100),
  signerRole: z.enum([
    'patient',
    'parent',
    'legal-guardian',
    'power-of-attorney',
    'witness',
    'notary',
    'staff-member'
  ]),

  // Signature Details
  signatureType: z.enum(['electronic', 'physical', 'verbal', 'digital']),
  signatureDate: z.date(),
  signatureLocation: z.string().max(100).optional(),

  // Verification
  identityVerified: z.boolean().default(false),
  verificationMethod: z.enum([
    'photo-id',
    'verbal-confirmation',
    'witness-verification',
    'notarization',
    'digital-certificate',
    'other'
  ]).optional(),

  // For electronic signatures
  ipAddress: z.string().ip().optional(),
  deviceInfo: z.string().max(200).optional(),

  // Legal Authority
  legalAuthorityBasis: z.enum([
    'self',
    'parental-rights',
    'court-appointed-guardian',
    'power-of-attorney',
    'healthcare-proxy',
    'other'
  ]).optional(),

  legalDocumentReference: z.string().max(100).optional()
})

// =================================================================
// INDIVIDUAL CONSENT SCHEMA
// =================================================================

export const individualConsentSchema = z.object({
  // Consent Identification
  consentId: z.string().optional(), // System-generated
  consentType: z.nativeEnum(ConsentType),
  consentTitle: z.string().min(1, 'Consent title is required').max(200),

  // Consent Content
  consentDescription: z.string().min(1, 'Consent description is required').max(2000),
  consentVersion: z.string().max(20).default('1.0'),
  effectiveDate: z.date(),
  expirationDate: z.date().optional(),

  // Status
  isRequired: z.boolean(),
  isObtained: z.boolean(),
  consentGiven: z.nativeEnum(BooleanResponse),

  // Signature Information
  signatures: z.array(consentSignatureSchema).min(0).max(5),

  // Withdrawal Information
  canBeWithdrawn: z.boolean().default(true),
  withdrawalDate: z.date().optional(),
  withdrawalReason: z.string().max(300).optional(),
  withdrawnBy: z.string().max(100).optional(),

  // Scope and Limitations
  scopeOfConsent: z.array(z.string()).default([]),
  limitations: z.array(z.string()).default([]),

  // Additional Information
  languageProvided: z.string().max(20).default('English'),
  interpreterUsed: z.boolean().default(false),
  interpreterName: z.string().max(100).optional(),

  notes: z.string().max(500).optional()
})

// =================================================================
// HIPAA AUTHORIZATION SCHEMA
// =================================================================

export const hipaaAuthorizationSchema = z.object({
  // Basic Authorization Information
  authorizationDate: z.date(),
  patientName: z.string().min(1).max(100),
  dateOfBirth: z.date(),

  // Information to be Disclosed
  informationTypes: z.array(z.enum([
    'complete-medical-record',
    'mental-health-records',
    'substance-abuse-records',
    'psychotherapy-notes',
    'psychiatric-evaluations',
    'psychological-testing',
    'treatment-plans',
    'medication-records',
    'laboratory-results',
    'diagnostic-images',
    'billing-information',
    'insurance-information',
    'specific-dates-only',
    'other'
  ])).min(1, 'At least one information type required'),

  specificInformation: z.string().max(500).optional(),
  dateRange: z.object({
    from: z.date().optional(),
    to: z.date().optional(),
    allRecords: z.boolean().default(false)
  }),

  // Parties Involved
  disclosingParty: z.object({
    name: z.string().min(1).max(100),
    address: z.string().max(300),
    phoneNumber: z.string().regex(/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/),
    relationship: z.string().max(50)
  }),

  receivingParties: z.array(z.object({
    name: z.string().min(1).max(100),
    organization: z.string().max(100).optional(),
    address: z.string().max(300),
    phoneNumber: z.string().regex(/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/),
    relationship: z.string().max(50),
    purposeOfDisclosure: z.string().max(200)
  })).min(1, 'At least one receiving party required'),

  // Purpose of Disclosure
  purposeOfDisclosure: z.array(z.enum([
    'continuing-care',
    'insurance-claims',
    'legal-proceedings',
    'family-notification',
    'coordination-of-care',
    'emergency-treatment',
    'research',
    'patient-request',
    'other'
  ])).min(1, 'At least one purpose required'),

  purposeOther: z.string().max(200).optional(),

  // Authorization Details
  authorizationExpiration: z.object({
    expiresOn: z.date().optional(),
    expiresAfterEvent: z.string().max(200).optional(),
    noExpiration: z.boolean().default(false)
  }),

  // Patient Rights
  rightsUnderstood: z.object({
    rightToRevoke: z.boolean(),
    revokeInstructions: z.boolean(),
    treatmentNotConditioned: z.boolean(),
    potentialRedisclosure: z.boolean(),
    rightToCopy: z.boolean()
  }),

  // Special Considerations
  includesSensitiveInfo: z.boolean(),
  sensitiveInfoTypes: z.array(z.enum([
    'hiv-aids',
    'substance-abuse',
    'mental-health',
    'genetic-information',
    'reproductive-health',
    'domestic-violence'
  ])).default([]),

  // Signatures
  patientSignature: consentSignatureSchema,
  parentGuardianSignature: consentSignatureSchema.optional(),
  witnessSignature: consentSignatureSchema.optional()
})

// =================================================================
// TREATMENT CONSENT SCHEMA
// =================================================================

export const treatmentConsentSchema = z.object({
  // Treatment Information
  treatmentTypes: z.array(z.enum([
    'individual-therapy',
    'group-therapy',
    'family-therapy',
    'medication-management',
    'psychiatric-evaluation',
    'psychological-testing',
    'crisis-intervention',
    'case-management',
    'intensive-outpatient',
    'partial-hospitalization',
    'inpatient-treatment',
    'electroconvulsive-therapy',
    'transcranial-magnetic-stimulation',
    'other'
  ])).min(1, 'At least one treatment type required'),

  specificTreatments: z.string().max(500).optional(),

  // Provider Information
  treatingProviders: z.array(z.object({
    name: z.string().min(1).max(100),
    credentials: z.string().max(50),
    role: z.string().max(50),
    license: z.string().max(50).optional()
  })).min(1, 'At least one provider required'),

  supervisingProvider: z.object({
    name: z.string().min(1).max(100),
    credentials: z.string().max(50),
    license: z.string().max(50)
  }).optional(),

  // Informed Consent Elements
  informedConsentElements: z.object({
    natureOfTreatment: z.boolean(),
    risksAndBenefits: z.boolean(),
    alternativeTreatments: z.boolean(),
    noTreatmentConsequences: z.boolean(),
    confidentialityLimits: z.boolean(),
    emergencyProcedures: z.boolean(),
    costAndInsurance: z.boolean(),
    rightToWithdraw: z.boolean()
  }),

  // Special Considerations for Minors
  minorConsiderations: z.object({
    isMinor: z.boolean(),
    parentalInvolvement: z.enum(['full', 'limited', 'none', 'as-appropriate']).optional(),
    mandatedReporting: z.boolean().optional(),
    emergencyContact: z.boolean().optional()
  }).optional(),

  // Treatment Goals Acknowledgment
  treatmentGoalsDiscussed: z.boolean(),
  patientGoalsAcknowledged: z.boolean(),

  // Consent Given
  consentGiven: z.boolean(),
  consentLimitations: z.string().max(500).optional(),

  // Signatures
  patientSignature: consentSignatureSchema,
  parentGuardianSignature: consentSignatureSchema.optional(),
  providerSignature: consentSignatureSchema
})

// =================================================================
// FINANCIAL RESPONSIBILITY SCHEMA
// =================================================================

export const financialResponsibilitySchema = z.object({
  // Financial Responsibility Acknowledgment
  understandsCharges: z.boolean(),
  responsibleParty: z.object({
    name: z.string().min(1).max(100),
    relationship: z.enum(['self', 'parent', 'guardian', 'spouse', 'other']),
    relationshipOther: z.string().max(50).optional(),
    contactInfo: z.string().max(200)
  }),

  // Insurance Information
  insuranceVerified: z.boolean(),
  insuranceCovers: z.nativeEnum(BooleanResponse),
  estimatedCopay: z.number().min(0).optional(),
  estimatedDeductible: z.number().min(0).optional(),

  // Payment Arrangements
  paymentMethod: z.enum([
    'insurance-primary',
    'cash-payment',
    'credit-card',
    'sliding-scale',
    'payment-plan',
    'third-party-payer',
    'grant-funding',
    'other'
  ]),

  slidingScaleApplied: z.boolean().default(false),
  paymentPlanArranged: z.boolean().default(false),
  paymentPlanTerms: z.string().max(300).optional(),

  // Financial Policies Acknowledged
  policiesAcknowledged: z.object({
    cancelationPolicy: z.boolean(),
    noShowPolicy: z.boolean(),
    latePaymentPolicy: z.boolean(),
    collectionPolicy: z.boolean(),
    refundPolicy: z.boolean()
  }),

  // Special Circumstances
  financialHardship: z.boolean().default(false),
  hardshipDocumentation: z.string().max(300).optional(),

  // Signatures
  responsiblePartySignature: consentSignatureSchema
})

// =================================================================
// MAIN CONSENTS SCHEMA
// =================================================================

export const consentsDataSchema = z.object({
  // Required Consents
  treatmentConsent: treatmentConsentSchema,
  hipaaAuthorization: hipaaAuthorizationSchema,
  financialResponsibility: financialResponsibilitySchema,

  // Additional Consents
  additionalConsents: z.array(individualConsentSchema).default([]),

  // Standard Consents Checklist
  standardConsents: z.object({
    privacyNotice: z.object({
      received: z.boolean(),
      acknowledged: z.boolean(),
      date: z.date().optional()
    }),

    patientRights: z.object({
      received: z.boolean(),
      acknowledged: z.boolean(),
      date: z.date().optional()
    }),

    grievanceProcedure: z.object({
      received: z.boolean(),
      acknowledged: z.boolean(),
      date: z.date().optional()
    }),

    emergencyProcedures: z.object({
      received: z.boolean(),
      acknowledged: z.boolean(),
      date: z.date().optional()
    })
  }),

  // Photography and Recording Consents
  mediaConsents: z.object({
    photographyConsent: z.object({
      consentGiven: z.nativeEnum(BooleanResponse),
      purposes: z.array(z.enum([
        'identification',
        'medical-documentation',
        'before-after-treatment',
        'education-training',
        'research',
        'none'
      ])).default([]),
      signature: consentSignatureSchema.optional()
    }),

    videoRecordingConsent: z.object({
      consentGiven: z.nativeEnum(BooleanResponse),
      purposes: z.array(z.enum([
        'clinical-supervision',
        'education-training',
        'research',
        'telehealth-sessions',
        'none'
      ])).default([]),
      signature: consentSignatureSchema.optional()
    })
  }),

  // Research and Quality Improvement
  researchConsents: z.object({
    qualityImprovement: z.object({
      consentGiven: z.nativeEnum(BooleanResponse),
      signature: consentSignatureSchema.optional()
    }),

    researchParticipation: z.object({
      interestedInResearch: z.nativeEnum(BooleanResponse),
      contactForOpportunities: z.boolean().default(false),
      signature: consentSignatureSchema.optional()
    })
  }),

  // Emergency Contacts Authorization
  emergencyContactAuth: z.object({
    authorizeContact: z.boolean(),
    contactsAuthorized: z.array(z.object({
      name: z.string().min(1).max(100),
      relationship: z.string().max(50),
      phoneNumber: z.string().regex(/^\+?1?[2-9]\d{2}[2-9]\d{2}\d{4}$/),
      canReceiveInfo: z.boolean(),
      infoTypes: z.array(z.enum([
        'appointment-reminders',
        'general-health-status',
        'emergency-notifications',
        'billing-information',
        'limited-clinical-info',
        'full-medical-info'
      ])).default([])
    })).default([])
  }),

  // Completion Status
  allRequiredObtained: z.boolean(),
  completionDate: z.date().optional(),
  completedBy: z.string().max(100).optional(),

  // Additional Notes
  consentNotes: z.string().max(1000).optional()
})

// =================================================================
// MULTITENANT SUBMISSION SCHEMA
// =================================================================

export const consentsSubmissionSchema = z.object({
  organizationId: z.string().min(1, 'Organization ID is required'),
  patientId: z.string().optional(),
  stepData: consentsDataSchema,
  metadata: z.object({
    completedAt: z.date().default(() => new Date()),
    version: z.string().default('1.0'),
    source: z.enum(['wizard', 'import', 'manual']).default('wizard'),
    legalReviewRequired: z.boolean().default(false),
    documentsGenerated: z.boolean().default(false),
    auditTrail: z.array(z.object({
      action: z.string().max(100),
      timestamp: z.date(),
      userId: z.string().max(100),
      details: z.string().max(300).optional()
    })).default([])
  })
})

// =================================================================
// VALIDATION HELPERS
// =================================================================

export const validateConsentsStep = (data: unknown) => {
  return consentsDataSchema.safeParse(data)
}

export const validateConsentsSubmission = (data: unknown) => {
  return consentsSubmissionSchema.safeParse(data)
}

// Check if all required consents are obtained
export const validateRequiredConsents = (consents: any): boolean => {
  return consents.treatmentConsent.consentGiven &&
         consents.hipaaAuthorization.patientSignature &&
         consents.financialResponsibility.responsiblePartySignature &&
         consents.standardConsents.privacyNotice.acknowledged &&
         consents.standardConsents.patientRights.acknowledged
}

// Generate consent summary for review
export const generateConsentSummary = (consents: any): string[] => {
  const summary = []

  if (consents.treatmentConsent.consentGiven) {
    summary.push('Treatment consent obtained')
  }

  if (consents.hipaaAuthorization.patientSignature) {
    summary.push('HIPAA authorization signed')
  }

  if (consents.financialResponsibility.responsiblePartySignature) {
    summary.push('Financial responsibility acknowledged')
  }

  consents.additionalConsents.forEach((consent: any) => {
    if (consent.isObtained) {
      summary.push(`${consent.consentTitle} obtained`)
    }
  })

  return summary
}

// =================================================================
// TYPE EXPORTS
// =================================================================

export type ConsentSignature = z.infer<typeof consentSignatureSchema>
export type IndividualConsent = z.infer<typeof individualConsentSchema>
export type HipaaAuthorization = z.infer<typeof hipaaAuthorizationSchema>
export type TreatmentConsent = z.infer<typeof treatmentConsentSchema>
export type FinancialResponsibility = z.infer<typeof financialResponsibilitySchema>
export type ConsentsData = z.infer<typeof consentsDataSchema>
export type ConsentsSubmission = z.infer<typeof consentsSubmissionSchema>