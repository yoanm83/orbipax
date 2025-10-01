/**
 * Wizard Navigation State
 * Temporary navigation state for steps 1-3
 * OrbiPax Community Mental Health System
 */

import { create } from 'zustand'
import { VISIBLE_STEP_IDS } from '../../ui/enhanced-wizard-tabs/steps.config'

interface WizardNavigationState {
  currentStep: string
  visitedSteps: Set<string>
}

interface WizardNavigationActions {
  goToStep: (stepId: string) => void
  nextStep: () => void
  prevStep: () => void
  markStepVisited: (stepId: string) => void
  reset: () => void
}

export type WizardNavigationStore = WizardNavigationState & WizardNavigationActions

const initialState: WizardNavigationState = {
  currentStep: 'demographics', // Start at step 1
  visitedSteps: new Set(['demographics'])
}

export const useWizardNavigationStore = create<WizardNavigationStore>((set, get) => ({
  ...initialState,

  goToStep: (stepId: string) => {
    // Only allow navigation to visible steps
    if (!VISIBLE_STEP_IDS.includes(stepId)) {
      console.warn(`Cannot navigate to hidden step: ${stepId}`)
      return
    }

    set(state => ({
      currentStep: stepId,
      visitedSteps: new Set([...state.visitedSteps, stepId])
    }))
  },

  nextStep: () => {
    const { currentStep } = get()
    const currentIndex = VISIBLE_STEP_IDS.indexOf(currentStep)

    if (currentIndex === -1 || currentIndex >= VISIBLE_STEP_IDS.length - 1) {
      return
    }

    const nextStepId = VISIBLE_STEP_IDS[currentIndex + 1]
    get().goToStep(nextStepId)
  },

  prevStep: () => {
    const { currentStep } = get()
    const currentIndex = VISIBLE_STEP_IDS.indexOf(currentStep)

    if (currentIndex <= 0) {
      return
    }

    const prevStepId = VISIBLE_STEP_IDS[currentIndex - 1]
    get().goToStep(prevStepId)
  },

  markStepVisited: (stepId: string) => {
    set(state => ({
      visitedSteps: new Set([...state.visitedSteps, stepId])
    }))
  },

  reset: () => {
    set(initialState)
  }
}))

// Selector hooks for common queries
export const useCurrentStep = () => useWizardNavigationStore(state => state.currentStep)
export const useIsStepVisited = (stepId: string) => useWizardNavigationStore(state => state.visitedSteps.has(stepId))
export const useWizardProgress = () => {
  const currentStep = useWizardNavigationStore(state => state.currentStep)
  const visitedSteps = useWizardNavigationStore(state => state.visitedSteps)
  const currentIndex = VISIBLE_STEP_IDS.indexOf(currentStep)
  const totalSteps = VISIBLE_STEP_IDS.length

  return {
    current: currentIndex + 1,
    total: totalSteps,
    percentage: ((currentIndex + 1) / totalSteps) * 100,
    visitedCount: visitedSteps.size
  }
}