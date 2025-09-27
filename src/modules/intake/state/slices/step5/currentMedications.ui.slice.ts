/**
 * Current Medications UI Store Slice
 * OrbiPax Community Mental Health System
 *
 * UI-only state management for Current Medications section
 * IMPORTANT: No PHI is persisted in browser storage
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { MedicationStatus, MedicationItem, AllergyItem } from '@/modules/intake/domain/schemas/step5/currentMedications.schema'

// =========================================================================
// STORE INTERFACE
// =========================================================================

interface CurrentMedicationsUIStore {
  // Form Fields
  hasMedications?: MedicationStatus
  medications: MedicationItem[]
  allergies: AllergyItem[]

  // UI State
  isExpanded: boolean
  isDirty: boolean
  validationErrors: Record<string, string>
  medicationErrors: Record<string, Record<string, string>>
  allergyErrors: Record<string, Record<string, string>>

  // Actions - Field Updates
  setHasMedications: (value: MedicationStatus) => void
  clearConditionalFields: () => void

  // Actions - Medications Array
  addMedication: () => void
  removeMedication: (id: string) => void
  updateMedication: (id: string, field: keyof MedicationItem, value: any) => void

  // Actions - Allergies Array
  addAllergy: () => void
  removeAllergy: (id: string) => void
  updateAllergy: (id: string, field: keyof AllergyItem, value: any) => void

  // Actions - UI State
  setExpanded: (expanded: boolean) => void
  toggleExpanded: () => void
  setDirty: (dirty: boolean) => void
  setValidationErrors: (errors: Record<string, string>) => void
  clearValidationError: (field: string) => void
  setMedicationErrors: (id: string, errors: Record<string, string>) => void
  setAllergyErrors: (id: string, errors: Record<string, string>) => void

  // Actions - Bulk Operations
  resetSection: () => void
  loadFromPayload: (data: Partial<CurrentMedicationsUIStore>) => void
}

// =========================================================================
// INITIAL STATE
// =========================================================================

const initialState = {
  // Form Fields
  hasMedications: undefined as MedicationStatus | undefined,
  medications: [] as MedicationItem[],
  allergies: [] as AllergyItem[],

  // UI State
  isExpanded: true,
  isDirty: false,
  validationErrors: {},
  medicationErrors: {},
  allergyErrors: {}
}

// =========================================================================
// STORE IMPLEMENTATION
// =========================================================================

export const useCurrentMedicationsUIStore = create<CurrentMedicationsUIStore>()(
  devtools(
    (set) => ({
      ...initialState,

      // Field Updates
      setHasMedications: (value) =>
        set((state) => {
          // Clear conditional fields when changing from Yes to No/Unknown
          const shouldClear = state.hasMedications === 'Yes' && value !== 'Yes'

          return {
            hasMedications: value,
            isDirty: true,
            validationErrors: {
              ...state.validationErrors,
              hasMedications: undefined as unknown as string
            }
          }
        }, false, 'setHasMedications'),

      clearConditionalFields: () =>
        set(() => ({
          medications: [],
          allergies: [],
          medicationErrors: {},
          allergyErrors: {},
          validationErrors: {}
        }), false, 'clearConditionalFields'),

      // Medications Array Actions
      addMedication: () =>
        set((state) => ({
          medications: [
            ...state.medications,
            {
              id: `med_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              name: '',
              dosage: '',
              frequency: '',
              route: undefined,
              startDate: undefined,
              prescribedBy: '',
              notes: ''
            }
          ],
          isDirty: true
        }), false, 'addMedication'),

      removeMedication: (id) =>
        set((state) => ({
          medications: state.medications.filter(med => med.id !== id),
          medicationErrors: Object.fromEntries(
            Object.entries(state.medicationErrors).filter(([key]) => key !== id)
          ),
          isDirty: true
        }), false, 'removeMedication'),

      updateMedication: (id, field, value) =>
        set((state) => ({
          medications: state.medications.map(med =>
            med.id === id ? { ...med, [field]: value } : med
          ),
          medicationErrors: {
            ...state.medicationErrors,
            [id]: {
              ...state.medicationErrors[id],
              [field]: undefined as unknown as string
            }
          },
          isDirty: true
        }), false, 'updateMedication'),

      // Allergies Array Actions
      addAllergy: () =>
        set((state) => ({
          allergies: [
            ...state.allergies,
            {
              id: `allergy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              allergen: '',
              reaction: '',
              severity: undefined,
              onsetDate: undefined,
              notes: ''
            }
          ],
          isDirty: true
        }), false, 'addAllergy'),

      removeAllergy: (id) =>
        set((state) => ({
          allergies: state.allergies.filter(allergy => allergy.id !== id),
          allergyErrors: Object.fromEntries(
            Object.entries(state.allergyErrors).filter(([key]) => key !== id)
          ),
          isDirty: true
        }), false, 'removeAllergy'),

      updateAllergy: (id, field, value) =>
        set((state) => ({
          allergies: state.allergies.map(allergy =>
            allergy.id === id ? { ...allergy, [field]: value } : allergy
          ),
          allergyErrors: {
            ...state.allergyErrors,
            [id]: {
              ...state.allergyErrors[id],
              [field]: undefined as unknown as string
            }
          },
          isDirty: true
        }), false, 'updateAllergy'),

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

      setMedicationErrors: (id, errors) =>
        set((state) => ({
          medicationErrors: {
            ...state.medicationErrors,
            [id]: errors
          }
        }), false, 'setMedicationErrors'),

      setAllergyErrors: (id, errors) =>
        set((state) => ({
          allergyErrors: {
            ...state.allergyErrors,
            [id]: errors
          }
        }), false, 'setAllergyErrors'),

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
      name: 'current-medications-ui-store'
    }
  )
)

// =========================================================================
// SELECTORS
// =========================================================================

export const currentMedicationsSelectors = {
  isComplete: (state: CurrentMedicationsUIStore): boolean => {
    return !!(
      state.hasMedications &&
      Object.keys(state.validationErrors).length === 0
    )
  },

  hasErrors: (state: CurrentMedicationsUIStore): boolean => {
    return Object.keys(state.validationErrors).length > 0
  },

  getPayload: (state: CurrentMedicationsUIStore) => ({
    hasMedications: state.hasMedications,
    medications: state.medications
  })
}

// =========================================================================
// TYPE EXPORTS
// =========================================================================

export type { CurrentMedicationsUIStore }
export default CurrentMedicationsUIStore