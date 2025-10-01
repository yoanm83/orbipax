/**
 * Insurance & Eligibility DTOs - Application Layer
 * OrbiPax Community Mental Health System
 *
 * JSON-serializable Data Transfer Objects for Insurance & Eligibility
 * These DTOs define the contract between UI and Application layers
 *
 * SoC: Pure data contracts - NO validation logic, NO business rules
 */

/**
 * Insurance Coverage DTO
 * Represents a single insurance policy
 */
export interface InsuranceCoverageDTO {
  type: string // 'medicare' | 'medicaid' | 'private' | 'tricare' | 'other'

  // Carrier Information
  carrierName: string
  policyNumber: string
  groupNumber?: string | null

  // Plan Details
  planKind?: string | null // 'hmo' | 'ppo' | 'epo' | 'pos' | 'hdhp' | 'other'
  planName?: string | null

  // Subscriber Information
  subscriberName: string
  subscriberDateOfBirth: string // ISO date string
  subscriberRelationship: string // 'self' | 'spouse' | 'parent' | 'child' | 'other'
  subscriberSSN?: string | null

  // Coverage Details
  effectiveDate: string // ISO date string
  expirationDate?: string | null // ISO date string
  isPrimary: boolean

  // Verification Status
  isVerified: boolean
  verificationDate?: string | null // ISO date string
  verificationNotes?: string | null

  // Mental Health Coverage
  hasMentalHealthCoverage: string // 'yes' | 'no' | 'unknown'
  mentalHealthCopay?: number | null
  mentalHealthDeductible?: number | null
  annualMentalHealthLimit?: number | null

  // Authorization
  requiresPreAuth: string // 'yes' | 'no' | 'unknown'
  preAuthNumber?: string | null
  preAuthExpiration?: string | null // ISO date string
}

/**
 * Eligibility Criteria DTO
 * CMH eligibility assessment information
 */
export interface EligibilityCriteriaDTO {
  // Geographic Eligibility
  residesInServiceArea: string // 'yes' | 'no' | 'unknown'
  serviceAreaCounty?: string | null

  // Age-based Eligibility
  ageGroup: string // 'child' | 'adolescent' | 'adult' | 'senior'
  isEligibleByAge: boolean

  // Clinical Eligibility
  hasDiagnosedMentalHealth: string // 'yes' | 'no' | 'unknown'
  diagnosisVerified: boolean

  // Functional Impairment
  functionalImpairmentLevel?: string | null // 'mild' | 'moderate' | 'severe' | 'very-severe'
  impactsDaily: string // 'yes' | 'no' | 'unknown'
  impactsWork: string // 'yes' | 'no' | 'unknown'
  impactsRelationships: string // 'yes' | 'no' | 'unknown'

  // Risk Factors
  suicidalIdeation: string // 'yes' | 'no' | 'unknown'
  substanceUse: string // 'yes' | 'no' | 'unknown'
  domesticViolence: string // 'yes' | 'no' | 'unknown'
  homelessness: string // 'yes' | 'no' | 'unknown'

  // Priority Populations
  isVeteran: boolean
  isPregnantPostpartum: boolean
  isFirstResponder: boolean
  hasDisability: boolean

  // Family Status
  hasMinorChildren: boolean
  involvedWithDCF: boolean
  courtOrdered: boolean
  orderType?: string | null

  // Referral Source
  referralSource?: string | null
  referralAgency?: string | null
  referralContact?: string | null
  referralDate?: string | null // ISO date string
}

/**
 * Financial Information DTO
 * Financial assessment and billing preferences
 */
export interface FinancialInformationDTO {
  // Income Assessment
  householdIncome?: number | null
  householdSize?: number | null
  federalPovertyLevel?: number | null
  fplPercentage?: number | null
  incomeVerified: boolean
  incomeVerificationDate?: string | null // ISO date string

  // Program Eligibility
  medicaidEligible: boolean
  medicaidApplicationStatus?: string | null // 'not_applied' | 'pending' | 'approved' | 'denied'
  medicaidApplicationDate?: string | null // ISO date string

  medicareEligible: boolean
  medicarePart?: string | null // 'a' | 'b' | 'c' | 'd' | 'a_and_b' | 'all'

  slidingFeeEligible: boolean
  slidingFeeScale?: number | null

  // Financial Assistance
  financialHardship: boolean
  hardshipDocumented: boolean
  assistanceRequested: boolean
  assistanceApproved: boolean
  assistanceAmount?: number | null

  // Billing Preferences
  billingPreference: string // 'insurance' | 'self_pay' | 'sliding_fee' | 'grant' | 'no_charge'
  paymentPlanRequested: boolean
  paymentPlanApproved: boolean
  monthlyPaymentAmount?: number | null

  // Documentation
  documentsProvided: string[] // Array of document types
  documentsNeeded: string[] // Array of document types
}

/**
 * Insurance & Eligibility Input DTO
 * Received from UI forms for saving
 */
export interface InsuranceEligibilityInputDTO {
  // Insurance Coverage
  insuranceCoverages: InsuranceCoverageDTO[]
  isUninsured: boolean
  uninsuredReason?: string | null

  // Eligibility Assessment
  eligibilityCriteria: EligibilityCriteriaDTO

  // Financial Information
  financialInformation: FinancialInformationDTO

  // Determination
  eligibilityStatus?: string | null // 'eligible' | 'pending' | 'ineligible' | 'conditional'
  eligibilityDeterminedBy?: string | null
  eligibilityDeterminationDate?: string | null // ISO date string
  eligibilityNotes?: string | null
}

/**
 * Insurance & Eligibility Output DTO
 * Returned from repository with metadata
 */
export interface InsuranceEligibilityOutputDTO {
  id?: string
  sessionId: string
  organizationId: string
  data: InsuranceEligibilityInputDTO
  lastModified?: string // ISO date string
  completionStatus: 'incomplete' | 'partial' | 'complete'
  verificationStatus?: 'unverified' | 'pending' | 'verified'
}

