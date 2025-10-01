/**
 * Diagnoses UI Store Slice
 * OrbiPax Community Mental Health System
 *
 * UI-only state management for Diagnoses section
 * IMPORTANT: No PHI is persisted in browser storage
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// =========================================================================
// STORE INTERFACE
// =========================================================================

interface DiagnosesUIStore {
  // Form Fields
  primaryDiagnosis: string
  secondaryDiagnoses: string[]
  substanceUseDisorder: string
  mentalHealthHistory: string

  // UI State
  isExpanded: boolean
  isDirty: boolean
  validationErrors: Record<string, string>

  // Actions - Field Updates
  setPrimaryDiagnosis: (value: string) => void
  setSecondaryDiagnoses: (value: string[]) => void
  setSubstanceUseDisorder: (value: string) => void
  setMentalHealthHistory: (value: string) => void

  // Actions - UI State
  setExpanded: (expanded: boolean) => void
  setDirty: (dirty: boolean) => void
  setValidationErrors: (errors: Record<string, string>) => void
  clearValidationError: (field: string) => void

  // Actions - Bulk Operations
  resetSection: () => void
  loadFromPayload: (data: Partial<DiagnosesUIStore>) => void
}

// =========================================================================
// INITIAL STATE
// =========================================================================

const initialState = {
  // Form Fields
  primaryDiagnosis: '',
  secondaryDiagnoses: [],
  substanceUseDisorder: '',
  mentalHealthHistory: '',

  // UI State
  isExpanded: true,
  isDirty: false,
  validationErrors: {}
}

// =========================================================================
// STORE IMPLEMENTATION
// =========================================================================

export const useDiagnosesUIStore = create<DiagnosesUIStore>()(
  devtools(
    (set) => ({
      ...initialState,

      // Field Updates
      setPrimaryDiagnosis: (value) =>
        set((state) => ({
          primaryDiagnosis: value,
          isDirty: true,
          validationErrors: {
            ...state.validationErrors,
            primaryDiagnosis: undefined as unknown as string
          }
        }), false, 'setPrimaryDiagnosis'),

      setSecondaryDiagnoses: (value) =>
        set((state) => ({
          secondaryDiagnoses: value,
          isDirty: true,
          validationErrors: {
            ...state.validationErrors,
            secondaryDiagnoses: undefined as unknown as string
          }
        }), false, 'setSecondaryDiagnoses'),

      setSubstanceUseDisorder: (value) =>
        set((state) => ({
          substanceUseDisorder: value,
          isDirty: true,
          validationErrors: {
            ...state.validationErrors,
            substanceUseDisorder: undefined as unknown as string
          }
        }), false, 'setSubstanceUseDisorder'),

      setMentalHealthHistory: (value) =>
        set((state) => ({
          mentalHealthHistory: value,
          isDirty: true,
          validationErrors: {
            ...state.validationErrors,
            mentalHealthHistory: undefined as unknown as string
          }
        }), false, 'setMentalHealthHistory'),

      // UI State
      setExpanded: (expanded) =>
        set({ isExpanded: expanded }, false, 'setExpanded'),

      setDirty: (dirty) =>
        set({ isDirty: dirty }, false, 'setDirty'),

      setValidationErrors: (errors) =>
        set({ validationErrors: errors }, false, 'setValidationErrors'),

      clearValidationError: (field) =>
        set((state) => ({
          validationErrors: {
            ...state.validationErrors,
            [field]: undefined as unknown as string
          }
        }), false, 'clearValidationError'),

      // Bulk Operations
      resetSection: () =>
        set(initialState, false, 'resetSection'),

      loadFromPayload: (data) =>
        set((state) => ({
          ...state,
          ...data,
          isDirty: false
        }), false, 'loadFromPayload')
    }),
    {
      name: 'diagnoses-ui-store'
    }
  )
)

// =========================================================================
// SELECTORS
// =========================================================================

export const diagnosesSelectors = {
  isComplete: (state: DiagnosesUIStore): boolean => {
    return !!(
      state.primaryDiagnosis &&
      Object.keys(state.validationErrors).length === 0
    )
  },

  hasErrors: (state: DiagnosesUIStore): boolean => {
    return Object.keys(state.validationErrors).length > 0
  },

  getPayload: (state: DiagnosesUIStore) => ({
    primaryDiagnosis: state.primaryDiagnosis,
    secondaryDiagnoses: state.secondaryDiagnoses,
    substanceUseDisorder: state.substanceUseDisorder,
    mentalHealthHistory: state.mentalHealthHistory
  })
}

// =========================================================================
// TYPE EXPORTS
// =========================================================================

export type { DiagnosesUIStore }
export default DiagnosesUIStore