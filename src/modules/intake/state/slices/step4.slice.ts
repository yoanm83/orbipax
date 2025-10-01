/**
 * Step 4 Canonical Store - Medical Providers
 * OrbiPax Intake Module
 *
 * Single source of truth for Step 4 wizard state
 * Consolidates providers + psychiatrist form data and UI state
 * Aligned with DTOs from Application layer
 *
 * Pattern: Form data + UI state in one store (vs Steps 1-3 which use RHF)
 * Security: No organization_id or session_id in client state
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type {
  ProvidersDTO,
  PsychiatristDTO,
  Step4OutputDTO
} from '@/modules/intake/application/step4/dtos'

// ============================================================
// STATE INTERFACE
// ============================================================

interface Step4State {
  // ──────────────────────────────────────────────────────────
  // PROVIDERS FORM DATA
  // ──────────────────────────────────────────────────────────
  providers: {
    hasPCP?: 'Yes' | 'No' | 'Unknown'
    pcpName?: string
    pcpPhone?: string
    pcpPractice?: string
    pcpAddress?: string
    authorizedToShare?: boolean
    phoneDisplayValue?: string // Formatted phone for UI display
  }

  // ──────────────────────────────────────────────────────────
  // PSYCHIATRIST FORM DATA
  // ──────────────────────────────────────────────────────────
  psychiatrist: {
    hasBeenEvaluated?: 'Yes' | 'No'
    psychiatristName?: string
    evaluationDate?: string // ISO date string
    clinicName?: string
    notes?: string
    differentEvaluator?: boolean
    evaluatorName?: string
    evaluatorClinic?: string
  }

  // ──────────────────────────────────────────────────────────
  // UI STATE
  // ──────────────────────────────────────────────────────────
  expandedSections: {
    providers: boolean
    psychiatrist: boolean
  }
  validationErrors: {
    providers: Record<string, string>
    psychiatrist: Record<string, string>
  }
  isSubmitting: boolean
  isDirty: boolean

  // ──────────────────────────────────────────────────────────
  // ACTIONS
  // ──────────────────────────────────────────────────────────

  // Data hydration from server
  hydrate: (data: Step4OutputDTO) => void

  // Reset to initial state
  reset: () => void

  // Providers setters
  setProvidersField: <K extends keyof ProvidersDTO>(
    field: K,
    value: ProvidersDTO[K]
  ) => void
  setPhoneNumber: (displayValue: string, normalizedValue: string) => void
  clearValidationError: (section: 'providers' | 'psychiatrist', field: string) => void
  resetConditionalFields: (section: 'providers' | 'psychiatrist') => void

  // Psychiatrist setters
  setPsychiatristField: <K extends keyof PsychiatristDTO>(
    field: K,
    value: PsychiatristDTO[K]
  ) => void

  // UI state setters
  toggleSection: (section: 'providers' | 'psychiatrist') => void
  setValidationErrors: (
    section: 'providers' | 'psychiatrist',
    errors: Record<string, string>
  ) => void
  clearValidationErrors: () => void
  setIsSubmitting: (isSubmitting: boolean) => void
  markDirty: () => void
  markClean: () => void
}

// ============================================================
// INITIAL STATE
// ============================================================

const initialState: Omit<
  Step4State,
  | 'hydrate'
  | 'reset'
  | 'setProvidersField'
  | 'setPhoneNumber'
  | 'clearValidationError'
  | 'resetConditionalFields'
  | 'setPsychiatristField'
  | 'toggleSection'
  | 'setValidationErrors'
  | 'clearValidationErrors'
  | 'setIsSubmitting'
  | 'markDirty'
  | 'markClean'
> = {
  providers: {},
  psychiatrist: {},
  expandedSections: {
    providers: true,
    psychiatrist: true
  },
  validationErrors: {
    providers: {},
    psychiatrist: {}
  },
  isSubmitting: false,
  isDirty: false
}

// ============================================================
// STORE IMPLEMENTATION
// ============================================================

export const useStep4Store = create<Step4State>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // ────────────────────────────────────────────────────────
      // HYDRATE: Load data from server (Step4OutputDTO)
      // ────────────────────────────────────────────────────────
      hydrate: (data: Step4OutputDTO) => {
        const providers: Step4State['providers'] = {}
        const psychiatrist: Step4State['psychiatrist'] = {}

        // Only set defined values
        if (data.data.providers.hasPCP) providers.hasPCP = data.data.providers.hasPCP
        if (data.data.providers.pcpName) providers.pcpName = data.data.providers.pcpName
        if (data.data.providers.pcpPhone) providers.pcpPhone = data.data.providers.pcpPhone
        if (data.data.providers.pcpPractice) providers.pcpPractice = data.data.providers.pcpPractice
        if (data.data.providers.pcpAddress) providers.pcpAddress = data.data.providers.pcpAddress
        if (data.data.providers.authorizedToShare !== undefined) providers.authorizedToShare = data.data.providers.authorizedToShare

        if (data.data.psychiatrist.hasBeenEvaluated) psychiatrist.hasBeenEvaluated = data.data.psychiatrist.hasBeenEvaluated
        if (data.data.psychiatrist.psychiatristName) psychiatrist.psychiatristName = data.data.psychiatrist.psychiatristName
        if (data.data.psychiatrist.evaluationDate) psychiatrist.evaluationDate = data.data.psychiatrist.evaluationDate
        if (data.data.psychiatrist.clinicName) psychiatrist.clinicName = data.data.psychiatrist.clinicName
        if (data.data.psychiatrist.notes) psychiatrist.notes = data.data.psychiatrist.notes
        if (data.data.psychiatrist.differentEvaluator !== undefined) psychiatrist.differentEvaluator = data.data.psychiatrist.differentEvaluator
        if (data.data.psychiatrist.evaluatorName) psychiatrist.evaluatorName = data.data.psychiatrist.evaluatorName
        if (data.data.psychiatrist.evaluatorClinic) psychiatrist.evaluatorClinic = data.data.psychiatrist.evaluatorClinic

        set(
          {
            providers,
            psychiatrist,
            isDirty: false,
            validationErrors: {
              providers: {},
              psychiatrist: {}
            }
          },
          false,
          'step4/hydrate'
        )
      },

      // ────────────────────────────────────────────────────────
      // RESET: Clear all state
      // ────────────────────────────────────────────────────────
      reset: () => {
        set(
          {
            ...initialState
          },
          false,
          'step4/reset'
        )
      },

      // ────────────────────────────────────────────────────────
      // PROVIDERS SETTERS
      // ────────────────────────────────────────────────────────
      setProvidersField: (field, value) => {
        set(
          (state) => ({
            providers: {
              ...state.providers,
              [field]: value
            },
            isDirty: true
          }),
          false,
          `step4/setProvidersField/${field}`
        )
      },

      setPhoneNumber: (displayValue, normalizedValue) => {
        set(
          (state) => ({
            providers: {
              ...state.providers,
              phoneDisplayValue: displayValue,
              pcpPhone: normalizedValue
            },
            isDirty: true
          }),
          false,
          'step4/setPhoneNumber'
        )
      },

      clearValidationError: (section, field) => {
        set(
          (state) => {
            const errors = { ...state.validationErrors[section] }
            delete errors[field]
            return {
              validationErrors: {
                ...state.validationErrors,
                [section]: errors
              }
            }
          },
          false,
          `step4/clearValidationError/${section}/${field}`
        )
      },

      resetConditionalFields: (section) => {
        const state = get()
        if (section === 'providers') {
          set(
            (prevState) => ({
              ...prevState,
              providers: { hasPCP: state.providers.hasPCP },
              isDirty: true
            }),
            false,
            'step4/resetConditionalFields/providers'
          )
        } else if (section === 'psychiatrist') {
          set(
            (prevState) => ({
              ...prevState,
              psychiatrist: { hasBeenEvaluated: state.psychiatrist.hasBeenEvaluated },
              isDirty: true
            }),
            false,
            'step4/resetConditionalFields/psychiatrist'
          )
        }
      },

      // ────────────────────────────────────────────────────────
      // PSYCHIATRIST SETTERS
      // ────────────────────────────────────────────────────────
      setPsychiatristField: (field, value) => {
        set(
          (state) => ({
            psychiatrist: {
              ...state.psychiatrist,
              [field]: value
            },
            isDirty: true
          }),
          false,
          `step4/setPsychiatristField/${field}`
        )
      },

      // ────────────────────────────────────────────────────────
      // UI STATE SETTERS
      // ────────────────────────────────────────────────────────
      toggleSection: (section) => {
        set(
          (state) => ({
            expandedSections: {
              ...state.expandedSections,
              [section]: !state.expandedSections[section]
            }
          }),
          false,
          `step4/toggleSection/${section}`
        )
      },

      setValidationErrors: (section, errors) => {
        set(
          (state) => ({
            validationErrors: {
              ...state.validationErrors,
              [section]: errors
            }
          }),
          false,
          `step4/setValidationErrors/${section}`
        )
      },

      clearValidationErrors: () => {
        set(
          {
            validationErrors: {
              providers: {},
              psychiatrist: {}
            }
          },
          false,
          'step4/clearValidationErrors'
        )
      },

      setIsSubmitting: (isSubmitting) => {
        set({ isSubmitting }, false, 'step4/setIsSubmitting')
      },

      markDirty: () => {
        set({ isDirty: true }, false, 'step4/markDirty')
      },

      markClean: () => {
        set({ isDirty: false }, false, 'step4/markClean')
      }
    }),
    { name: 'Step4Store' }
  )
)

// ============================================================
// SELECTORS
// ============================================================

export const step4Selectors = {
  // Form data selectors
  providers: (state: Step4State) => state.providers,
  psychiatrist: (state: Step4State) => state.psychiatrist,

  // UI state selectors
  isProvidersExpanded: (state: Step4State) => state.expandedSections.providers,
  isPsychiatristExpanded: (state: Step4State) => state.expandedSections.psychiatrist,
  providersErrors: (state: Step4State) => state.validationErrors.providers,
  psychiatristErrors: (state: Step4State) => state.validationErrors.psychiatrist,
  hasErrors: (state: Step4State) =>
    Object.keys(state.validationErrors.providers).length > 0 ||
    Object.keys(state.validationErrors.psychiatrist).length > 0,
  isSubmitting: (state: Step4State) => state.isSubmitting,
  isDirty: (state: Step4State) => state.isDirty,

  // Computed payload selector for submission
  buildPayload: (state: Step4State) => {
    const providers: Partial<ProvidersDTO> = {}
    const psychiatrist: Partial<PsychiatristDTO> = {}

    // Providers payload
    if (state.providers.hasPCP) {
      providers.hasPCP = state.providers.hasPCP

      if (state.providers.hasPCP === 'Yes') {
        if (state.providers.pcpName?.trim()) providers.pcpName = state.providers.pcpName.trim()
        if (state.providers.pcpPhone?.trim()) providers.pcpPhone = state.providers.pcpPhone.trim()
        if (state.providers.pcpPractice?.trim()) providers.pcpPractice = state.providers.pcpPractice.trim()
        if (state.providers.pcpAddress?.trim()) providers.pcpAddress = state.providers.pcpAddress.trim()
        if (state.providers.authorizedToShare !== undefined) providers.authorizedToShare = state.providers.authorizedToShare
      }
    }

    // Psychiatrist payload
    if (state.psychiatrist.hasBeenEvaluated) {
      psychiatrist.hasBeenEvaluated = state.psychiatrist.hasBeenEvaluated

      if (state.psychiatrist.hasBeenEvaluated === 'Yes') {
        if (state.psychiatrist.psychiatristName?.trim()) psychiatrist.psychiatristName = state.psychiatrist.psychiatristName.trim()
        if (state.psychiatrist.evaluationDate) psychiatrist.evaluationDate = state.psychiatrist.evaluationDate
        if (state.psychiatrist.clinicName?.trim()) psychiatrist.clinicName = state.psychiatrist.clinicName.trim()
        if (state.psychiatrist.notes?.trim()) psychiatrist.notes = state.psychiatrist.notes.trim()
        if (state.psychiatrist.differentEvaluator !== undefined) {
          psychiatrist.differentEvaluator = state.psychiatrist.differentEvaluator
          if (state.psychiatrist.differentEvaluator) {
            if (state.psychiatrist.evaluatorName?.trim()) psychiatrist.evaluatorName = state.psychiatrist.evaluatorName.trim()
            if (state.psychiatrist.evaluatorClinic?.trim()) psychiatrist.evaluatorClinic = state.psychiatrist.evaluatorClinic.trim()
          }
        }
      }
    }

    return { providers, psychiatrist }
  }
}
