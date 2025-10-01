/**
 * Intake State Constants
 * OrbiPax Community Mental Health System
 *
 * Centralized constants for the intake state module
 * IMPORTANT: No PHI allowed - only navigation and UI constants
 */

import type { WizardStep } from './types';

/**
 * Canonical order of wizard steps
 * Single source of truth for navigation sequence
 */
export const INTAKE_STEP_ORDER: readonly WizardStep[] = [
  'welcome',
  'demographics',
  'insurance',
  'diagnoses',
  'medical-providers',
  'medications',
  'referrals',
  'legal-forms',
  'goals',
  'review'
] as const;

/**
 * Get step index in the order
 */
export const getStepIndex = (step: WizardStep): number => {
  return INTAKE_STEP_ORDER.indexOf(step);
};

/**
 * Get next step in sequence
 */
export const getNextStep = (currentStep: WizardStep): WizardStep | null => {
  const currentIndex = getStepIndex(currentStep);
  return currentIndex < INTAKE_STEP_ORDER.length - 1
    ? INTAKE_STEP_ORDER[currentIndex + 1] as WizardStep
    : null;
};

/**
 * Get previous step in sequence
 */
export const getPreviousStep = (currentStep: WizardStep): WizardStep | null => {
  const currentIndex = getStepIndex(currentStep);
  return currentIndex > 0
    ? INTAKE_STEP_ORDER[currentIndex - 1] as WizardStep
    : null;
};

/**
 * Check if step is first in sequence
 */
export const isFirstStep = (step: WizardStep): boolean => {
  return getStepIndex(step) === 0;
};

/**
 * Check if step is last in sequence
 */
export const isLastStep = (step: WizardStep): boolean => {
  return getStepIndex(step) === INTAKE_STEP_ORDER.length - 1;
};

/**
 * Get progress percentage for a step
 */
export const getStepProgress = (step: WizardStep): number => {
  const index = getStepIndex(step);
  return Math.round(((index + 1) / INTAKE_STEP_ORDER.length) * 100);
};