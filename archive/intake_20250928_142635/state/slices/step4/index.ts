/**
 * Step 4 Medical Providers - UI Store Slices Exports
 * OrbiPax Community Mental Health System
 *
 * Aggregates and exports all Step 4 UI store slices
 * IMPORTANT: These are UI-only stores, no PHI is persisted
 */

// =================================================================
// STORE EXPORTS
// =================================================================

export {
  useProvidersUIStore,
  providersSelectors
} from './providers.ui.slice'

export {
  usePsychiatristUIStore,
  psychiatristSelectors
} from './psychiatrist.ui.slice'

// =================================================================
// COMPOSITE HOOKS
// =================================================================

/**
 * Hook to get all Step 4 UI stores at once
 * Useful for aggregator components
 */
export function useStep4UIStores() {
  const providers = useProvidersUIStore()
  const psychiatrist = usePsychiatristUIStore()

  return {
    providers,
    psychiatrist
  }
}

/**
 * Hook to get expansion states for all sections
 */
export function useStep4ExpansionStates() {
  const providersExpanded = useProvidersUIStore(
    state => state.isExpanded
  )
  const psychiatristExpanded = usePsychiatristUIStore(
    state => state.isExpanded
  )

  return {
    providers: providersExpanded,
    psychiatrist: psychiatristExpanded
  }
}

/**
 * Hook to get validation states for all sections
 */
export function useStep4ValidationStates() {
  const providersErrors = useProvidersUIStore(
    state => state.validationErrors
  )
  const psychiatristErrors = usePsychiatristUIStore(
    state => state.validationErrors
  )

  return {
    providers: providersErrors,
    psychiatrist: psychiatristErrors,
    hasErrors: !!(
      Object.keys(providersErrors).length ||
      Object.keys(psychiatristErrors).length
    )
  }
}

/**
 * Hook to check if Step 4 is complete
 */
export function useStep4CompletionStatus() {
  const providersComplete = useProvidersUIStore(
    state => providersSelectors.isComplete(state)
  )
  const psychiatristComplete = usePsychiatristUIStore(
    state => psychiatristSelectors.isComplete(state)
  )

  return {
    sections: {
      providers: providersComplete,
      psychiatrist: psychiatristComplete
    },
    isStepComplete: (
      providersComplete &&
      psychiatristComplete
    )
  }
}

// =================================================================
// ACTION AGGREGATORS
// =================================================================

/**
 * Reset all Step 4 sections
 */
export function resetStep4Stores() {
  useProvidersUIStore.getState().resetSection()
  usePsychiatristUIStore.getState().resetSection()
}

/**
 * Expand all Step 4 sections
 */
export function expandAllStep4Sections() {
  useProvidersUIStore.getState().setExpanded(true)
  usePsychiatristUIStore.getState().setExpanded(true)
}

/**
 * Collapse all Step 4 sections
 */
export function collapseAllStep4Sections() {
  useProvidersUIStore.getState().setExpanded(false)
  usePsychiatristUIStore.getState().setExpanded(false)
}

// =================================================================
// TYPE EXPORTS
// =================================================================

// Re-export types from slices for convenience
export type { default as ProvidersUIStore } from './providers.ui.slice'
export type { default as PsychiatristUIStore } from './psychiatrist.ui.slice'