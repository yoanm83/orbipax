'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
// Types defined locally to avoid module resolution issues
// These match the schema definitions in psychiatrist.schema.ts

type EvaluationStatus = 'Yes' | 'No'

/**
 * Psychiatrist UI Slice - UI-Only Presentation State
 *
 * IMPORTANT: NO PHI (Protected Health Information) persisted.
 * This slice manages UI state and form data temporarily during user interaction.
 * Data is not persisted and should be transferred to secure storage on form submission.
 */

// =================================================================
// STATE INTERFACE
// =================================================================

interface PsychiatristUIState {
  // Form fields from PartialPsychiatrist
  hasBeenEvaluated?: EvaluationStatus
  psychiatristName?: string
  evaluationDate?: Date
  clinicName?: string
  notes?: string
  differentEvaluator?: boolean
  evaluatorName?: string
  evaluatorClinic?: string

  // UI-only state
  isExpanded: boolean
  validationErrors: Record<string, string>
  isDirty: boolean
  isValidating: boolean
}

// =================================================================
// ACTIONS INTERFACE
// =================================================================

interface PsychiatristUIActions {
  // Evaluation status
  setHasBeenEvaluated: (status: EvaluationStatus) => void

  // Field setters
  setPsychiatristField: (field: keyof Pick<PsychiatristUIState, 'psychiatristName' | 'evaluationDate' | 'clinicName' | 'notes'>, value: string | Date | undefined) => void

  // Different evaluator
  toggleDifferentEvaluator: () => void
  setDifferentEvaluator: (different: boolean) => void

  // Evaluator fields
  setEvaluatorField: (
    field: 'evaluatorName' | 'evaluatorClinic',
    value: string
  ) => void

  // UI controls
  toggleExpanded: () => void
  setExpanded: (expanded: boolean) => void

  // Validation
  setValidationErrors: (errors: Record<string, string>) => void
  clearValidationError: (field: string) => void
  setIsValidating: (validating: boolean) => void

  // Reset
  resetSection: () => void
  resetConditionalFields: () => void
}

// =================================================================
// INITIAL STATE
// =================================================================

const initialState: PsychiatristUIState = {
  // Form fields
  hasBeenEvaluated: undefined,
  psychiatristName: '',
  evaluationDate: undefined,
  clinicName: '',
  notes: '',
  differentEvaluator: false,
  evaluatorName: '',
  evaluatorClinic: '',

  // UI state
  isExpanded: false,
  validationErrors: {},
  isDirty: false,
  isValidating: false
}

// =================================================================
// STORE CREATION
// =================================================================

export const usePsychiatristUIStore = create<
  PsychiatristUIState & PsychiatristUIActions
>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Evaluation status
      setHasBeenEvaluated: (status) =>
        set(
          (state) => {
            const updates: Partial<PsychiatristUIState> = {
              hasBeenEvaluated: status,
              isDirty: true
            }

            // Clear conditional fields when 'No'
            if (status === 'No') {
              updates.psychiatristName = ''
              updates.evaluationDate = undefined
              updates.clinicName = ''
              updates.notes = ''
              updates.differentEvaluator = false
              updates.evaluatorName = ''
              updates.evaluatorClinic = ''
              updates.validationErrors = {}
            }

            return updates
          },
          false,
          'psychiatrist/setHasBeenEvaluated'
        ),

      // Field setters
      setPsychiatristField: (field, value) =>
        set(
          (state) => {
            const updates: Partial<PsychiatristUIState> = {
              [field]: value,
              isDirty: true
            }

            // Handle text field length validation
            if (typeof value === 'string') {
              const maxLengths: Record<string, number> = {
                psychiatristName: 120,
                clinicName: 120,
                notes: 300
              }

              const maxLength = maxLengths[field as string]
              if (maxLength && value.length <= maxLength) {
                updates.validationErrors = {
                  ...state.validationErrors,
                  [field]: undefined
                }
              }
            } else if (field === 'evaluationDate' && value) {
              // Clear date error when date is set
              updates.validationErrors = {
                ...state.validationErrors,
                evaluationDate: undefined
              }
            }

            return updates
          },
          false,
          `psychiatrist/setPsychiatristField:${String(field)}`
        ),

      // Different evaluator
      toggleDifferentEvaluator: () =>
        set(
          (state) => ({
            differentEvaluator: !state.differentEvaluator,
            isDirty: true,
            // Clear evaluator fields when toggling off
            evaluatorName: state.differentEvaluator ? '' : state.evaluatorName,
            evaluatorClinic: state.differentEvaluator ? '' : state.evaluatorClinic
          }),
          false,
          'psychiatrist/toggleDifferentEvaluator'
        ),

      setDifferentEvaluator: (different) =>
        set(
          (state) => ({
            differentEvaluator: different,
            isDirty: true,
            // Clear evaluator fields when setting to false
            evaluatorName: different ? state.evaluatorName : '',
            evaluatorClinic: different ? state.evaluatorClinic : ''
          }),
          false,
          'psychiatrist/setDifferentEvaluator'
        ),

      // Evaluator fields
      setEvaluatorField: (field, value) =>
        set(
          (state) => {
            // Limit to 120 characters
            const trimmed = value.slice(0, 120)
            return {
              [field]: trimmed,
              isDirty: true,
              validationErrors: {
                ...state.validationErrors,
                [field]: trimmed.length <= 120 ? undefined : 'Maximum 120 characters'
              }
            }
          },
          false,
          `psychiatrist/setEvaluatorField:${field}`
        ),

      // UI controls
      toggleExpanded: () =>
        set(
          (state) => ({ isExpanded: !state.isExpanded }),
          false,
          'psychiatrist/toggleExpanded'
        ),

      setExpanded: (expanded) =>
        set(
          { isExpanded: expanded },
          false,
          'psychiatrist/setExpanded'
        ),

      // Validation
      setValidationErrors: (errors) =>
        set(
          { validationErrors: errors },
          false,
          'psychiatrist/setValidationErrors'
        ),

      clearValidationError: (field) =>
        set(
          (state) => {
            const errors = { ...state.validationErrors }
            delete errors[field]
            return { validationErrors: errors }
          },
          false,
          'psychiatrist/clearValidationError'
        ),

      setIsValidating: (validating) =>
        set(
          { isValidating: validating },
          false,
          'psychiatrist/setIsValidating'
        ),

      // Reset
      resetSection: () =>
        set(
          initialState,
          false,
          'psychiatrist/resetSection'
        ),

      resetConditionalFields: () =>
        set(
          {
            psychiatristName: '',
            evaluationDate: undefined,
            clinicName: '',
            notes: '',
            differentEvaluator: false,
            evaluatorName: '',
            evaluatorClinic: '',
            validationErrors: {}
          },
          false,
          'psychiatrist/resetConditionalFields'
        )
    }),
    {
      name: 'psychiatrist-ui-store'
    }
  )
)

// =================================================================
// SELECTORS
// =================================================================

export const psychiatristSelectors = {
  hasBeenEvaluated: (state: PsychiatristUIState) => state.hasBeenEvaluated,
  isExpanded: (state: PsychiatristUIState) => state.isExpanded,
  validationErrors: (state: PsychiatristUIState) => state.validationErrors,
  isDirty: (state: PsychiatristUIState) => state.isDirty,
  isValidating: (state: PsychiatristUIState) => state.isValidating,
  showDifferentEvaluator: (state: PsychiatristUIState) =>
    state.hasBeenEvaluated === 'Yes' && state.differentEvaluator,

  // Computed selectors
  hasErrors: (state: PsychiatristUIState) =>
    Object.keys(state.validationErrors).length > 0,

  isComplete: (state: PsychiatristUIState) => {
    if (!state.hasBeenEvaluated) return false
    if (state.hasBeenEvaluated === 'No') return true

    // For 'Yes', check required fields
    const hasName = !!(state.psychiatristName?.trim())
    const hasDate = !!state.evaluationDate

    return hasName && hasDate
  },

  hasConditionalData: (state: PsychiatristUIState) =>
    !!(state.psychiatristName || state.evaluationDate || state.clinicName || state.notes)
}