/**
 * Pharmacy Information UI Store Slice
 * OrbiPax Community Mental Health System
 *
 * UI-only state management for Pharmacy Information section
 * IMPORTANT: No PHI is persisted in browser storage
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { PharmacyInformationSchema } from '@/modules/intake/domain/schemas/step5/pharmacyInformation.schema'

// =========================================================================
// STORE INTERFACE
// =========================================================================

interface PharmacyInformationUIStore {
  // Form Fields
  pharmacyName: string
  pharmacyPhone: string
  pharmacyAddress: string

  // UI State
  isExpanded: boolean
  isDirty: boolean
  validationErrors: Record<string, string>

  // Actions - Field Updates
  setPharmacyName: (value: string) => void
  setPharmacyPhone: (value: string) => void
  setPharmacyAddress: (value: string) => void

  // Actions - UI State
  setExpanded: (expanded: boolean) => void
  toggleExpanded: () => void
  setDirty: (dirty: boolean) => void
  setValidationErrors: (errors: Record<string, string>) => void
  clearValidationError: (field: string) => void

  // Actions - Bulk Operations
  resetSection: () => void
  loadFromPayload: (data: Partial<PharmacyInformationSchema>) => void
}

// =========================================================================
// INITIAL STATE
// =========================================================================

const initialState = {
  // Form Fields
  pharmacyName: '',
  pharmacyPhone: '',
  pharmacyAddress: '',

  // UI State
  isExpanded: false,
  isDirty: false,
  validationErrors: {}
}

// =========================================================================
// STORE IMPLEMENTATION
// =========================================================================

export const usePharmacyInformationUIStore = create<PharmacyInformationUIStore>()(
  devtools(
    (set) => ({
      ...initialState,

      // Field Updates
      setPharmacyName: (value) =>
        set((state) => ({
          pharmacyName: value,
          isDirty: true,
          validationErrors: {
            ...state.validationErrors,
            pharmacyName: undefined as unknown as string
          }
        }), false, 'setPharmacyName'),

      setPharmacyPhone: (value) =>
        set((state) => ({
          pharmacyPhone: value,
          isDirty: true,
          validationErrors: {
            ...state.validationErrors,
            pharmacyPhone: undefined as unknown as string
          }
        }), false, 'setPharmacyPhone'),

      setPharmacyAddress: (value) =>
        set((state) => ({
          pharmacyAddress: value,
          isDirty: true,
          validationErrors: {
            ...state.validationErrors,
            pharmacyAddress: undefined as unknown as string
          }
        }), false, 'setPharmacyAddress'),

      // UI State
      setExpanded: (expanded) =>
        set({ isExpanded: expanded }, false, 'setExpanded'),

      toggleExpanded: () =>
        set((state) => ({ isExpanded: !state.isExpanded }), false, 'toggleExpanded'),

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
      name: 'pharmacy-information-ui-store'
    }
  )
)

// =========================================================================
// SELECTORS
// =========================================================================

export const pharmacyInformationSelectors = {
  isComplete: (state: PharmacyInformationUIStore): boolean => {
    return !!(
      state.pharmacyName.trim() &&
      state.pharmacyPhone.trim() &&
      Object.keys(state.validationErrors).length === 0
    )
  },

  hasErrors: (state: PharmacyInformationUIStore): boolean => {
    return Object.keys(state.validationErrors).length > 0
  },

  getPayload: (state: PharmacyInformationUIStore) => ({
    pharmacyName: state.pharmacyName,
    pharmacyPhone: state.pharmacyPhone,
    pharmacyAddress: state.pharmacyAddress
  })
}

// =========================================================================
// TYPE EXPORTS
// =========================================================================

export type { PharmacyInformationUIStore }
export default PharmacyInformationUIStore