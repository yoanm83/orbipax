"use client";

import { useWizardProgressStore } from "../slices/wizardProgress.slice";
import type { WizardStep } from "../types";
import { INTAKE_STEP_ORDER, getStepIndex, getNextStep, getPreviousStep, getStepProgress, isLastStep, isFirstStep } from "../constants";

/**
 * Wizard Selectors - Pure UI State Selectors
 *
 * IMPORTANT: NO PHI (Protected Health Information).
 * Only UI state derivations and navigation logic.
 */

/** Get current step */
export const useCurrentStep = () =>
  useWizardProgressStore((state) => state.currentStep);

/** Get transition state */
export const useTransitionState = () =>
  useWizardProgressStore((state) => state.transitionState);

/** Check if wizard is transitioning */
export const useIsTransitioning = () =>
  useWizardProgressStore((state) => state.isTransitioning);

/** Get visited steps */
export const useVisitedSteps = () =>
  useWizardProgressStore((state) => state.visitedSteps);

/** Get completed steps */
export const useCompletedSteps = () =>
  useWizardProgressStore((state) => state.completedSteps);

/** Check if a specific step is completed */
export const useIsStepCompleted = (step: WizardStep) =>
  useWizardProgressStore((state) => state.completedSteps.includes(step));

/** Check if a specific step is visited */
export const useIsStepVisited = (step: WizardStep) =>
  useWizardProgressStore((state) => state.visitedSteps.includes(step));

/** Get wizard flags */
export const useWizardFlags = () =>
  useWizardProgressStore((state) => ({
    isCurrentStepValid: state.isCurrentStepValid,
    allowSkipAhead: state.allowSkipAhead,
    showProgress: state.showProgress,
    isTransitioning: state.isTransitioning,
  }));

/** Get UI preferences */
export const useWizardPreferences = () =>
  useWizardProgressStore((state) => ({
    showStepDescriptions: state.showStepDescriptions,
    compactMode: state.compactMode,
  }));

/** Derived: Can advance to next step */
export const useCanAdvance = () =>
  useWizardProgressStore((state) => {
    const isLast = isLastStep(state.currentStep);
    return !isLast && (state.isCurrentStepValid || state.allowSkipAhead);
  });

/** Derived: Can go back */
export const useCanGoBack = () =>
  useWizardProgressStore((state) => {
    return !isFirstStep(state.currentStep);
  });

/** Derived: Progress percentage */
export const useProgressPercentage = () =>
  useWizardProgressStore((state) => {
    return getStepProgress(state.currentStep);
  });

/** Derived: Next step */
export const useNextStep = () =>
  useWizardProgressStore((state) => {
    return getNextStep(state.currentStep);
  });

/** Derived: Previous step */
export const usePrevStep = () =>
  useWizardProgressStore((state) => {
    return getPreviousStep(state.currentStep);
  });