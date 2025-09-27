/**
 * Step 5 Medications - UI Store Slices Exports
 * OrbiPax Community Mental Health System
 *
 * Aggregates and exports all Step 5 UI store slices
 * IMPORTANT: These are UI-only stores, no PHI is persisted
 */

// =================================================================
// STORE EXPORTS
// =================================================================

export {
  useCurrentMedicationsUIStore,
  currentMedicationsSelectors
} from './currentMedications.ui.slice'

export {
  usePharmacyInformationUIStore,
  pharmacyInformationSelectors
} from './pharmacyInformation.ui.slice'

// =================================================================
// TYPE EXPORTS
// =================================================================

export type { CurrentMedicationsUIStore } from './currentMedications.ui.slice'
export type { PharmacyInformationUIStore } from './pharmacyInformation.ui.slice'

// =================================================================
// COMPOSITE HOOKS
// =================================================================

/**
 * Hook to get all Step 5 UI stores at once
 * Useful for aggregator components
 */
export function useStep5UIStores() {
  const currentMedications = useCurrentMedicationsUIStore()
  const pharmacyInformation = usePharmacyInformationUIStore()

  return {
    currentMedications,
    pharmacyInformation
  }
}

/**
 * Hook to get expansion states for all sections
 */
export function useStep5ExpansionStates() {
  const currentMedicationsExpanded = useCurrentMedicationsUIStore(
    state => state.isExpanded
  )
  const pharmacyInformationExpanded = usePharmacyInformationUIStore(
    state => state.isExpanded
  )

  return {
    currentMedications: currentMedicationsExpanded,
    pharmacyInformation: pharmacyInformationExpanded
  }
}

/**
 * Hook to get validation states for all sections
 */
export function useStep5ValidationStates() {
  const currentMedicationsErrors = useCurrentMedicationsUIStore(
    state => state.validationErrors
  )
  const pharmacyInformationErrors = usePharmacyInformationUIStore(
    state => state.validationErrors
  )

  return {
    currentMedications: currentMedicationsErrors,
    pharmacyInformation: pharmacyInformationErrors,
    hasErrors: !!(
      Object.keys(currentMedicationsErrors).length ||
      Object.keys(pharmacyInformationErrors).length
    )
  }
}

/**
 * Hook to check if Step 5 is complete
 */
export function useStep5CompletionStatus() {
  const currentMedicationsComplete = useCurrentMedicationsUIStore(
    state => currentMedicationsSelectors.isComplete(state)
  )
  const pharmacyInformationComplete = usePharmacyInformationUIStore(
    state => pharmacyInformationSelectors.isComplete(state)
  )

  return {
    sections: {
      currentMedications: currentMedicationsComplete,
      pharmacyInformation: pharmacyInformationComplete
    },
    isStepComplete: currentMedicationsComplete && pharmacyInformationComplete
  }
}

// =================================================================
// ACTION AGGREGATORS
// =================================================================

/**
 * Reset all Step 5 sections
 */
export function resetStep5Stores() {
  useCurrentMedicationsUIStore.getState().resetSection()
  usePharmacyInformationUIStore.getState().resetSection()
}

/**
 * Expand all Step 5 sections
 */
export function expandAllStep5Sections() {
  useCurrentMedicationsUIStore.getState().setExpanded(true)
  usePharmacyInformationUIStore.getState().setExpanded(true)
}

/**
 * Collapse all Step 5 sections
 */
export function collapseAllStep5Sections() {
  useCurrentMedicationsUIStore.getState().setExpanded(false)
  usePharmacyInformationUIStore.getState().setExpanded(false)
}