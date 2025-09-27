'use client'

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { normalizePhoneNumber, formatPhoneNumber } from '@/shared/utils/phone'
// Types defined locally to avoid module resolution issues
// These match the schema definitions in providers.schema.ts

type PCPStatus = 'Yes' | 'No' | 'Unknown'

/**
 * Providers UI Slice - UI-Only Presentation State
 *
 * IMPORTANT: NO PHI (Protected Health Information) persisted.
 * This slice manages UI state and form data temporarily during user interaction.
 * Data is not persisted and should be transferred to secure storage on form submission.
 */

// =================================================================
// STATE INTERFACE
// =================================================================

interface ProvidersUIState {
  // Form fields from PartialProviders
  hasPCP?: PCPStatus
  pcpName?: string
  pcpPhone?: string
  pcpPractice?: string
  pcpAddress?: string
  authorizedToShare?: boolean

  // Additional UI state
  phoneDisplayValue: string // Formatted phone for display
  isExpanded: boolean
  validationErrors: Record<string, string>
  isDirty: boolean
  isValidating: boolean
}

// =================================================================
// ACTIONS INTERFACE
// =================================================================

interface ProvidersUIActions {
  // PCP status
  setHasPCP: (status: PCPStatus) => void

  // Field setters
  setPCPField: (field: keyof Pick<ProvidersUIState, 'pcpName' | 'pcpPractice' | 'pcpPhone' | 'pcpAddress' | 'authorizedToShare'>, value: string | boolean | undefined) => void

  // Special phone handling
  setPhoneNumber: (phone: string) => void

  // Authorization toggle
  toggleAuthorization: () => void
  setAuthorization: (authorized: boolean) => void

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

const initialState: ProvidersUIState = {
  // Form fields
  hasPCP: undefined,
  pcpName: '',
  pcpPhone: '',
  pcpPractice: '',
  pcpAddress: '',
  authorizedToShare: false,

  // UI state
  phoneDisplayValue: '',
  isExpanded: true, // PCP section typically starts expanded
  validationErrors: {},
  isDirty: false,
  isValidating: false
}

// =================================================================
// STORE CREATION
// =================================================================

export const useProvidersUIStore = create<
  ProvidersUIState & ProvidersUIActions
>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // PCP status
      setHasPCP: (status) =>
        set(
          (state) => {
            const updates: Partial<ProvidersUIState> = {
              hasPCP: status,
              isDirty: true
            }

            // Clear conditional fields when not 'Yes'
            if (status !== 'Yes') {
              updates.pcpName = ''
              updates.pcpPhone = ''
              updates.pcpPractice = ''
              updates.pcpAddress = ''
              updates.authorizedToShare = false
              updates.phoneDisplayValue = ''
              updates.validationErrors = {}
            }

            return updates
          },
          false,
          'providers/setHasPCP'
        ),

      // Field setters
      setPCPField: (field, value) =>
        set(
          (state) => ({
            [field]: value,
            isDirty: true,
            validationErrors: {
              ...state.validationErrors,
              [field]: undefined
            }
          }),
          false,
          `providers/setPCPField:${String(field)}`
        ),

      // Special phone handling
      setPhoneNumber: (phone) =>
        set(
          (state) => {
            // Allow only digits and formatting characters during input
            const cleanPhone = phone.replace(/[^\d\s()-]/g, '')

            // Normalize for storage (digits only)
            const normalized = normalizePhoneNumber(cleanPhone)

            // Limit to reasonable phone length
            if (normalized.length > 15) return state

            // Format for display
            const displayValue = normalized.length >= 10
              ? formatPhoneNumber(normalized)
              : cleanPhone

            return {
              pcpPhone: normalized,
              phoneDisplayValue: displayValue,
              isDirty: true,
              validationErrors: {
                ...state.validationErrors,
                pcpPhone: normalized.length >= 10 ? undefined : state.validationErrors.pcpPhone
              }
            }
          },
          false,
          'providers/setPhoneNumber'
        ),

      // Authorization toggle
      toggleAuthorization: () =>
        set(
          (state) => ({
            authorizedToShare: !state.authorizedToShare,
            isDirty: true
          }),
          false,
          'providers/toggleAuthorization'
        ),

      setAuthorization: (authorized) =>
        set(
          { authorizedToShare: authorized, isDirty: true },
          false,
          'providers/setAuthorization'
        ),

      // UI controls
      toggleExpanded: () =>
        set(
          (state) => ({ isExpanded: !state.isExpanded }),
          false,
          'providers/toggleExpanded'
        ),

      setExpanded: (expanded) =>
        set(
          { isExpanded: expanded },
          false,
          'providers/setExpanded'
        ),

      // Validation
      setValidationErrors: (errors) =>
        set(
          { validationErrors: errors },
          false,
          'providers/setValidationErrors'
        ),

      clearValidationError: (field) =>
        set(
          (state) => {
            const errors = { ...state.validationErrors }
            delete errors[field]
            return { validationErrors: errors }
          },
          false,
          'providers/clearValidationError'
        ),

      setIsValidating: (validating) =>
        set(
          { isValidating: validating },
          false,
          'providers/setIsValidating'
        ),

      // Reset
      resetSection: () =>
        set(
          initialState,
          false,
          'providers/resetSection'
        ),

      resetConditionalFields: () =>
        set(
          {
            pcpName: '',
            pcpPhone: '',
            pcpPractice: '',
            pcpAddress: '',
            authorizedToShare: false,
            phoneDisplayValue: '',
            validationErrors: {}
          },
          false,
          'providers/resetConditionalFields'
        )
    }),
    {
      name: 'providers-ui-store'
    }
  )
)

// =================================================================
// SELECTORS
// =================================================================

export const providersSelectors = {
  hasPCP: (state: ProvidersUIState) => state.hasPCP,
  isExpanded: (state: ProvidersUIState) => state.isExpanded,
  validationErrors: (state: ProvidersUIState) => state.validationErrors,
  isDirty: (state: ProvidersUIState) => state.isDirty,
  isValidating: (state: ProvidersUIState) => state.isValidating,
  phoneDisplay: (state: ProvidersUIState) => state.phoneDisplayValue,

  // Computed selectors
  hasErrors: (state: ProvidersUIState) =>
    Object.keys(state.validationErrors).length > 0,

  isComplete: (state: ProvidersUIState) => {
    if (!state.hasPCP) return false
    if (state.hasPCP === 'No' || state.hasPCP === 'Unknown') return true

    // For 'Yes', check required fields
    const hasName = !!(state.pcpName?.trim())
    const hasPhone = !!(state.pcpPhone && state.pcpPhone.length >= 10)

    return hasName && hasPhone
  },

  hasConditionalData: (state: ProvidersUIState) =>
    !!(state.pcpName || state.pcpPhone || state.pcpPractice || state.pcpAddress)
}