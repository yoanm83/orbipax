/**
 * Centralized Wizard Steps Configuration
 * Single source of truth for intake wizard step ordering and metadata
 * OrbiPax Health Philosophy Compliant
 */

export interface WizardStepConfig {
  id: string
  title: string
  shortTitle: string
  isOptional?: boolean
  slug: string // For routing/deep-links
  componentKey: string // For mapping to components
}

/**
 * Master step configuration - defines the canonical order of wizard steps
 * Order: Welcome → Demographics → Insurance → Clinical → Providers (opt) → Meds → Referrals (opt) → Goals → Legal → Review
 */
export const WIZARD_STEPS: WizardStepConfig[] = [
  {
    id: 'welcome',
    title: 'Welcome',
    shortTitle: 'Welcome',
    slug: 'welcome',
    componentKey: 'welcome'
  },
  {
    id: 'demographics',
    title: 'Demographics',
    shortTitle: 'Demographics',
    slug: 'demographics',
    componentKey: 'demographics'
  },
  {
    id: 'insurance',
    title: 'Insurance & Eligibility',
    shortTitle: 'Insurance',
    slug: 'insurance',
    componentKey: 'insurance'
  },
  {
    id: 'diagnoses',
    title: 'Clinical Information',
    shortTitle: 'Clinical',
    slug: 'diagnoses',
    componentKey: 'diagnoses'
  },
  {
    id: 'medical-providers',
    title: 'Medical Providers',
    shortTitle: 'Providers',
    slug: 'medical-providers',
    componentKey: 'medical-providers',
    isOptional: true
  },
  {
    id: 'medications',
    title: 'Medications',
    shortTitle: 'Meds',
    slug: 'medications',
    componentKey: 'medications'
  },
  {
    id: 'referrals',
    title: 'Referrals',
    shortTitle: 'Referrals',
    slug: 'referrals',
    componentKey: 'referrals',
    isOptional: true
  },
  {
    id: 'goals',
    title: 'Treatment Goals',
    shortTitle: 'Goals',
    slug: 'goals',
    componentKey: 'goals'
  },
  {
    id: 'legal-forms',
    title: 'Legal Forms',
    shortTitle: 'Legal',
    slug: 'legal-forms',
    componentKey: 'legal-forms'
  },
  {
    id: 'review',
    title: 'Review & Submit',
    shortTitle: 'Review',
    slug: 'review',
    componentKey: 'review'
  }
]

/**
 * Helper function to get step by ID
 */
export function getStepById(id: string): WizardStepConfig | undefined {
  return WIZARD_STEPS.find(step => step.id === id)
}

/**
 * Helper function to get step index
 */
export function getStepIndex(id: string): number {
  return WIZARD_STEPS.findIndex(step => step.id === id)
}

/**
 * Helper function to get next step
 */
export function getNextStep(currentId: string): WizardStepConfig | undefined {
  const currentIndex = getStepIndex(currentId)
  if (currentIndex === -1 || currentIndex === WIZARD_STEPS.length - 1) {
    return undefined
  }
  return WIZARD_STEPS[currentIndex + 1]
}

/**
 * Helper function to get previous step
 */
export function getPreviousStep(currentId: string): WizardStepConfig | undefined {
  const currentIndex = getStepIndex(currentId)
  if (currentIndex <= 0) {
    return undefined
  }
  return WIZARD_STEPS[currentIndex - 1]
}

/**
 * Helper to check if a step is before another in the flow
 */
export function isStepBefore(stepId: string, targetId: string): boolean {
  const stepIndex = getStepIndex(stepId)
  const targetIndex = getStepIndex(targetId)
  return stepIndex !== -1 && targetIndex !== -1 && stepIndex < targetIndex
}

/**
 * Helper to check if a step is after another in the flow
 */
export function isStepAfter(stepId: string, targetId: string): boolean {
  const stepIndex = getStepIndex(stepId)
  const targetIndex = getStepIndex(targetId)
  return stepIndex !== -1 && targetIndex !== -1 && stepIndex > targetIndex
}