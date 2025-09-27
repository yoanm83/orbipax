'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
// Types defined locally to avoid module resolution issues
// These match the schema definitions in functionalAssessment.schema.ts

type FunctionalDomain = 'cognition' | 'mobility' | 'selfCare' | 'gettingAlong' | 'lifeActivities' | 'participation'

type IndependenceLevel = 'Independent' | 'Needs Minimal Assistance' | 'Needs Moderate Assistance' | 'Needs Maximum Assistance' | 'Dependent'

type CognitiveFunctioningLevel = 'No Impairment' | 'Mild Impairment' | 'Moderate Impairment' | 'Severe Impairment'

/**
 * Functional Assessment UI Slice - UI-Only Presentation State
 *
 * IMPORTANT: NO PHI (Protected Health Information) persisted.
 * This slice manages UI state and form data temporarily during user interaction.
 * Data is not persisted and should be transferred to secure storage on form submission.
 */

// =================================================================
// STATE INTERFACE
// =================================================================

interface FunctionalAssessmentUIState {
  // Form fields from PartialFunctionalAssessment
  affectedDomains?: FunctionalDomain[]
  adlsIndependence?: IndependenceLevel
  iadlsIndependence?: IndependenceLevel
  cognitiveFunctioning?: CognitiveFunctioningLevel
  safetyConcerns?: boolean
  additionalNotes?: string

  // UI-only state
  isExpanded: boolean
  validationErrors: Record<string, string>
  isDirty: boolean
  isValidating: boolean
}

// =================================================================
// ACTIONS INTERFACE
// =================================================================

interface FunctionalAssessmentUIActions {
  // Domain management
  toggleDomain: (domain: FunctionalDomain) => void
  setDomains: (domains: FunctionalDomain[]) => void
  clearDomains: () => void

  // Independence level setters
  setIndependenceLevel: (
    type: 'adls' | 'iadls',
    level: IndependenceLevel
  ) => void

  // Cognitive functioning
  setCognitiveFunctioning: (level: CognitiveFunctioningLevel) => void

  // Safety concerns
  setSafetyConcerns: (hasConcerns: boolean) => void

  // Notes
  setNotes: (notes: string) => void

  // UI controls
  toggleExpanded: () => void
  setExpanded: (expanded: boolean) => void

  // Validation
  setValidationErrors: (errors: Record<string, string>) => void
  clearValidationError: (field: string) => void
  setIsValidating: (validating: boolean) => void

  // Reset
  resetSection: () => void
}

// =================================================================
// INITIAL STATE
// =================================================================

const initialState: FunctionalAssessmentUIState = {
  // Form fields
  affectedDomains: [],
  adlsIndependence: undefined,
  iadlsIndependence: undefined,
  cognitiveFunctioning: undefined,
  safetyConcerns: false,
  additionalNotes: '',

  // UI state
  isExpanded: false,
  validationErrors: {},
  isDirty: false,
  isValidating: false
}

// =================================================================
// STORE CREATION
// =================================================================

export const useFunctionalAssessmentUIStore = create<
  FunctionalAssessmentUIState & FunctionalAssessmentUIActions
>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Domain management
      toggleDomain: (domain) =>
        set(
          (state) => {
            const domains = state.affectedDomains || []
            const updated = domains.includes(domain)
              ? domains.filter(d => d !== domain)
              : [...domains, domain]

            return {
              affectedDomains: updated,
              isDirty: true,
              validationErrors: updated.length > 0
                ? { ...state.validationErrors, affectedDomains: undefined }
                : state.validationErrors
            }
          },
          false,
          'functionalAssessment/toggleDomain'
        ),

      setDomains: (domains) =>
        set(
          {
            affectedDomains: domains,
            isDirty: true,
            validationErrors: domains.length > 0
              ? {}
              : { affectedDomains: 'At least one domain must be selected' }
          },
          false,
          'functionalAssessment/setDomains'
        ),

      clearDomains: () =>
        set(
          { affectedDomains: [], isDirty: true },
          false,
          'functionalAssessment/clearDomains'
        ),

      // Independence level setters
      setIndependenceLevel: (type, level) =>
        set(
          (state) => ({
            [`${type}Independence`]: level,
            isDirty: true,
            validationErrors: {
              ...state.validationErrors,
              [`${type}Independence`]: undefined
            }
          }),
          false,
          `functionalAssessment/setIndependenceLevel:${type}`
        ),

      // Cognitive functioning
      setCognitiveFunctioning: (level) =>
        set(
          (state) => ({
            cognitiveFunctioning: level,
            isDirty: true,
            validationErrors: {
              ...state.validationErrors,
              cognitiveFunctioning: undefined
            }
          }),
          false,
          'functionalAssessment/setCognitiveFunctioning'
        ),

      // Safety concerns
      setSafetyConcerns: (hasConcerns) =>
        set(
          { safetyConcerns: hasConcerns, isDirty: true },
          false,
          'functionalAssessment/setSafetyConcerns'
        ),

      // Notes
      setNotes: (notes) =>
        set(
          (state) => {
            const trimmed = notes.slice(0, 300)
            return {
              additionalNotes: trimmed,
              isDirty: true,
              validationErrors: trimmed.length <= 300
                ? { ...state.validationErrors, additionalNotes: undefined }
                : { ...state.validationErrors, additionalNotes: 'Maximum 300 characters' }
            }
          },
          false,
          'functionalAssessment/setNotes'
        ),

      // UI controls
      toggleExpanded: () =>
        set(
          (state) => ({ isExpanded: !state.isExpanded }),
          false,
          'functionalAssessment/toggleExpanded'
        ),

      setExpanded: (expanded) =>
        set(
          { isExpanded: expanded },
          false,
          'functionalAssessment/setExpanded'
        ),

      // Validation
      setValidationErrors: (errors) =>
        set(
          { validationErrors: errors },
          false,
          'functionalAssessment/setValidationErrors'
        ),

      clearValidationError: (field) =>
        set(
          (state) => {
            const errors = { ...state.validationErrors }
            delete errors[field]
            return { validationErrors: errors }
          },
          false,
          'functionalAssessment/clearValidationError'
        ),

      setIsValidating: (validating) =>
        set(
          { isValidating: validating },
          false,
          'functionalAssessment/setIsValidating'
        ),

      // Reset
      resetSection: () =>
        set(
          initialState,
          false,
          'functionalAssessment/resetSection'
        )
    }),
    {
      name: 'functional-assessment-ui-store'
    }
  )
)

// =================================================================
// SELECTORS
// =================================================================

export const functionalAssessmentSelectors = {
  affectedDomains: (state: FunctionalAssessmentUIState) => state.affectedDomains || [],
  isExpanded: (state: FunctionalAssessmentUIState) => state.isExpanded,
  validationErrors: (state: FunctionalAssessmentUIState) => state.validationErrors,
  isDirty: (state: FunctionalAssessmentUIState) => state.isDirty,
  isValidating: (state: FunctionalAssessmentUIState) => state.isValidating,

  // Computed selectors
  hasErrors: (state: FunctionalAssessmentUIState) =>
    Object.keys(state.validationErrors).length > 0,

  isComplete: (state: FunctionalAssessmentUIState) => {
    const domains = state.affectedDomains || []
    return !!(
      domains.length > 0 &&
      state.adlsIndependence &&
      state.iadlsIndependence &&
      state.cognitiveFunctioning &&
      state.safetyConcerns !== undefined
    )
  },

  domainCount: (state: FunctionalAssessmentUIState) =>
    (state.affectedDomains || []).length
}