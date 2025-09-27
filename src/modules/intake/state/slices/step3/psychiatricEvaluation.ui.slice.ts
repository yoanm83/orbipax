'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
// Types defined locally to avoid module resolution issues
// These match the schema definitions in psychiatricEvaluation.schema.ts

/**
 * Psychiatric Evaluation UI Slice - UI-Only Presentation State
 *
 * IMPORTANT: NO PHI (Protected Health Information) persisted.
 * This slice manages UI state and form data temporarily during user interaction.
 * Data is not persisted and should be transferred to secure storage on form submission.
 */

// =================================================================
// STATE INTERFACE
// =================================================================

interface PsychiatricEvaluationUIState {
  // Form fields from PartialPsychiatricEvaluation
  hasEvaluation?: 'Yes' | 'No'
  evaluationDate?: Date
  clinicianName?: string
  evaluationSummary?: string

  // UI-only state
  isExpanded: boolean
  validationErrors: Record<string, string>
  isDirty: boolean
  isValidating: boolean
}

// =================================================================
// ACTIONS INTERFACE
// =================================================================

interface PsychiatricEvaluationUIActions {
  // Field setters
  setHasEvaluation: (value: 'Yes' | 'No') => void
  setField: (field: keyof Pick<PsychiatricEvaluationUIState, 'evaluationDate' | 'clinicianName' | 'evaluationSummary'>, value: string | Date | undefined) => void

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

const initialState: PsychiatricEvaluationUIState = {
  // Form fields
  hasEvaluation: undefined,
  evaluationDate: undefined,
  clinicianName: '',
  evaluationSummary: '',

  // UI state
  isExpanded: false,
  validationErrors: {},
  isDirty: false,
  isValidating: false
}

// =================================================================
// STORE CREATION
// =================================================================

export const usePsychiatricEvaluationUIStore = create<
  PsychiatricEvaluationUIState & PsychiatricEvaluationUIActions
>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Field setters
      setHasEvaluation: (value) =>
        set(
          (state) => {
            const updates: Partial<PsychiatricEvaluationUIState> = {
              hasEvaluation: value,
              isDirty: true
            }

            // Clear conditional fields when switching to 'No'
            if (value === 'No') {
              updates.evaluationDate = undefined
              updates.clinicianName = ''
              updates.evaluationSummary = ''
              updates.validationErrors = {}
            }

            return updates
          },
          false,
          'psychiatricEvaluation/setHasEvaluation'
        ),

      setField: (field, value) =>
        set(
          { [field]: value, isDirty: true },
          false,
          `psychiatricEvaluation/setField:${String(field)}`
        ),

      // UI controls
      toggleExpanded: () =>
        set(
          (state) => ({ isExpanded: !state.isExpanded }),
          false,
          'psychiatricEvaluation/toggleExpanded'
        ),

      setExpanded: (expanded) =>
        set(
          { isExpanded: expanded },
          false,
          'psychiatricEvaluation/setExpanded'
        ),

      // Validation
      setValidationErrors: (errors) =>
        set(
          { validationErrors: errors },
          false,
          'psychiatricEvaluation/setValidationErrors'
        ),

      clearValidationError: (field) =>
        set(
          (state) => {
            const errors = { ...state.validationErrors }
            delete errors[field]
            return { validationErrors: errors }
          },
          false,
          'psychiatricEvaluation/clearValidationError'
        ),

      setIsValidating: (validating) =>
        set(
          { isValidating: validating },
          false,
          'psychiatricEvaluation/setIsValidating'
        ),

      // Reset
      resetSection: () =>
        set(
          initialState,
          false,
          'psychiatricEvaluation/resetSection'
        ),

      resetConditionalFields: () =>
        set(
          {
            evaluationDate: undefined,
            clinicianName: '',
            evaluationSummary: '',
            validationErrors: {}
          },
          false,
          'psychiatricEvaluation/resetConditionalFields'
        )
    }),
    {
      name: 'psychiatric-evaluation-ui-store'
    }
  )
)

// =================================================================
// SELECTORS
// =================================================================

export const psychiatricEvaluationSelectors = {
  hasEvaluation: (state: PsychiatricEvaluationUIState) => state.hasEvaluation,
  isExpanded: (state: PsychiatricEvaluationUIState) => state.isExpanded,
  validationErrors: (state: PsychiatricEvaluationUIState) => state.validationErrors,
  isDirty: (state: PsychiatricEvaluationUIState) => state.isDirty,
  isValidating: (state: PsychiatricEvaluationUIState) => state.isValidating,

  // Computed selectors
  hasErrors: (state: PsychiatricEvaluationUIState) =>
    Object.keys(state.validationErrors).length > 0,

  isComplete: (state: PsychiatricEvaluationUIState) => {
    if (!state.hasEvaluation) return false
    if (state.hasEvaluation === 'No') return true
    return !!(state.evaluationDate && state.clinicianName?.trim())
  }
}