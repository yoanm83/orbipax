/**
 * Intake State Types - UI-Only
 *
 * IMPORTANT: No PHI (Protected Health Information) allowed.
 * Only UI state, navigation flags, and non-sensitive selections.
 */

/** Wizard step identifiers matching enhanced-wizard-tabs */
export type WizardStep =
  | 'welcome'
  | 'demographics'
  | 'insurance'
  | 'diagnoses'
  | 'medical-providers'
  | 'medications'
  | 'referrals'
  | 'legal-forms'
  | 'goals'
  | 'review';

/** UI transition states */
export type TransitionState = 'idle' | 'navigating' | 'validating';

/** Wizard navigation flags */
export interface WizardFlags {
  /** Current step validation status (UI-only) */
  isCurrentStepValid: boolean;
  /** Allow user to skip ahead */
  allowSkipAhead: boolean;
  /** Show progress indicator */
  showProgress: boolean;
  /** Wizard is in transition state */
  isTransitioning: boolean;
}

/** Step completion tracking (UI-only) */
export interface StepCompletion {
  /** Steps that have been visited */
  visitedSteps: WizardStep[];
  /** Steps that are considered complete */
  completedSteps: WizardStep[];
}

/** Wizard UI preferences */
export interface WizardPreferences {
  /** Collapsed/expanded step descriptions */
  showStepDescriptions: boolean;
  /** Compact mode for mobile */
  compactMode: boolean;
}