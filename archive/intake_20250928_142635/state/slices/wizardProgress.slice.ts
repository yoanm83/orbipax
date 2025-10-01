"use client";

import { create } from "zustand";
import type { WizardStep, TransitionState, WizardFlags, StepCompletion, WizardPreferences } from "../types";
import { INTAKE_STEP_ORDER, getNextStep, getPreviousStep } from "../constants";

/**
 * Wizard Progress Slice - UI-Only Navigation State
 *
 * IMPORTANT: NO PHI (Protected Health Information) allowed.
 * Only manages navigation state and UI flags for the intake wizard.
 */

interface WizardProgressState extends WizardFlags, StepCompletion, WizardPreferences {
  /** Current active step */
  currentStep: WizardStep;
  /** Transition state for UI feedback */
  transitionState: TransitionState;
}

interface WizardProgressActions {
  /** Navigate to specific step */
  goToStep: (step: WizardStep) => void;
  /** Navigate to next step */
  nextStep: () => void;
  /** Navigate to previous step */
  prevStep: () => void;
  /** Mark step as visited */
  markStepVisited: (step: WizardStep) => void;
  /** Mark step as completed */
  markStepCompleted: (step: WizardStep) => void;
  /** Set wizard flags */
  setWizardFlags: (flags: Partial<WizardFlags>) => void;
  /** Set UI preferences */
  setPreferences: (prefs: Partial<WizardPreferences>) => void;
  /** Reset wizard to initial state */
  resetWizard: () => void;
}

type WizardProgressStore = WizardProgressState & WizardProgressActions;

/** Step order for navigation logic - using centralized constant */
const STEP_ORDER = INTAKE_STEP_ORDER;

/** Initial state - UI-only defaults */
const initialState: WizardProgressState = {
  // Navigation
  currentStep: 'demographics',
  transitionState: 'idle',

  // Flags
  isCurrentStepValid: false,
  allowSkipAhead: true,  // Free navigation enabled
  showProgress: true,
  isTransitioning: false,

  // Completion tracking
  visitedSteps: ['demographics'],
  completedSteps: [],

  // Preferences
  showStepDescriptions: true,
  compactMode: false,
};

export const useWizardProgressStore = create<WizardProgressStore>((set, get) => ({
  ...initialState,

  goToStep: (step: WizardStep) => {
    // Free navigation: always allow navigating to any step
    // No restrictions for UI-only navigation

    set((state) => ({
      currentStep: step,
      transitionState: 'navigating',
      visitedSteps: state.visitedSteps.includes(step)
        ? state.visitedSteps
        : [...state.visitedSteps, step],
      isTransitioning: true,
    }));

    // Reset transition state after animation
    setTimeout(() => {
      set({ transitionState: 'idle', isTransitioning: false });
    }, 200);
  },

  nextStep: () => {
    const nextStep = getNextStep(get().currentStep);
    if (nextStep) {
      get().goToStep(nextStep);
    }
  },

  prevStep: () => {
    const prevStep = getPreviousStep(get().currentStep);
    if (prevStep) {
      get().goToStep(prevStep);
    }
  },

  markStepVisited: (step: WizardStep) => {
    set((state) => ({
      visitedSteps: state.visitedSteps.includes(step)
        ? state.visitedSteps
        : [...state.visitedSteps, step],
    }));
  },

  markStepCompleted: (step: WizardStep) => {
    set((state) => ({
      completedSteps: state.completedSteps.includes(step)
        ? state.completedSteps
        : [...state.completedSteps, step],
      visitedSteps: state.visitedSteps.includes(step)
        ? state.visitedSteps
        : [...state.visitedSteps, step],
    }));
  },

  setWizardFlags: (flags: Partial<WizardFlags>) => {
    set((state) => ({ ...state, ...flags }));
  },

  setPreferences: (prefs: Partial<WizardPreferences>) => {
    set((state) => ({ ...state, ...prefs }));
  },

  resetWizard: () => {
    set({ ...initialState });
  },
}));