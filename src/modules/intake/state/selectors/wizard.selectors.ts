"use client";

import { useWizardProgressStore } from "../slices/wizardProgress.slice";
import type { WizardStep } from "../types";

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
    const stepOrder: WizardStep[] = [
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
    ];

    const currentIndex = stepOrder.indexOf(state.currentStep);
    const isLastStep = currentIndex === stepOrder.length - 1;

    return !isLastStep && (state.isCurrentStepValid || state.allowSkipAhead);
  });

/** Derived: Can go back */
export const useCanGoBack = () =>
  useWizardProgressStore((state) => {
    const stepOrder: WizardStep[] = [
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
    ];

    const currentIndex = stepOrder.indexOf(state.currentStep);
    return currentIndex > 0;
  });

/** Derived: Progress percentage */
export const useProgressPercentage = () =>
  useWizardProgressStore((state) => {
    const stepOrder: WizardStep[] = [
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
    ];

    const currentIndex = stepOrder.indexOf(state.currentStep);
    return Math.round(((currentIndex + 1) / stepOrder.length) * 100);
  });

/** Derived: Next step */
export const useNextStep = () =>
  useWizardProgressStore((state) => {
    const stepOrder: WizardStep[] = [
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
    ];

    const currentIndex = stepOrder.indexOf(state.currentStep);
    return currentIndex < stepOrder.length - 1 ? stepOrder[currentIndex + 1] : null;
  });

/** Derived: Previous step */
export const usePrevStep = () =>
  useWizardProgressStore((state) => {
    const stepOrder: WizardStep[] = [
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
    ];

    const currentIndex = stepOrder.indexOf(state.currentStep);
    return currentIndex > 0 ? stepOrder[currentIndex - 1] : null;
  });