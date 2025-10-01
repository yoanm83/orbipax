/**
 * Step 2 Insurance UI Selectors
 * OrbiPax Intake Module - State Layer
 *
 * Selectors for Step 2 UI state
 * Provides memoized access to UI flags
 *
 * SoC: Read-only state access - no mutations
 */

import { useStep2UiStore } from '../slices/step2-ui.slice'

/**
 * Loading state selector
 * @returns true if currently loading insurance data
 */
export const selectStep2IsLoading = () =>
  useStep2UiStore((state) => state.isLoading)

/**
 * Saving state selector
 * @returns true if currently saving insurance data
 */
export const selectStep2IsSaving = () =>
  useStep2UiStore((state) => state.isSaving)

/**
 * Load error selector
 * @returns Generic error message or null
 */
export const selectStep2LoadError = () =>
  useStep2UiStore((state) => state.loadError)

/**
 * Save error selector
 * @returns Generic error message or null
 */
export const selectStep2SaveError = () =>
  useStep2UiStore((state) => state.saveError)

/**
 * Dirty state selector
 * @returns true if form has unsaved changes
 */
export const selectStep2IsDirty = () =>
  useStep2UiStore((state) => state.isDirty)

/**
 * Last saved timestamp selector
 * @returns ISO timestamp of last successful save or null
 */
export const selectStep2LastSavedAt = () =>
  useStep2UiStore((state) => state.lastSavedAt)

/**
 * Combined loading state selector
 * @returns true if any async operation is in progress
 */
export const selectStep2IsProcessing = () =>
  useStep2UiStore((state) => state.isLoading || state.isSaving)

/**
 * Combined error state selector
 * @returns true if any error is present
 */
export const selectStep2HasError = () =>
  useStep2UiStore((state) => !!(state.loadError || state.saveError))

/**
 * All UI state selector (for debugging)
 * @returns Complete UI state object
 */
export const selectStep2UiState = () =>
  useStep2UiStore((state) => ({
    isLoading: state.isLoading,
    isSaving: state.isSaving,
    loadError: state.loadError,
    saveError: state.saveError,
    isDirty: state.isDirty,
    lastSavedAt: state.lastSavedAt
  }))

/**
 * Actions selectors
 * Provides access to state mutations
 */
export const useStep2UiActions = () =>
  useStep2UiStore((state) => ({
    markLoading: state.markLoading,
    markSaving: state.markSaving,
    setLoadError: state.setLoadError,
    setSaveError: state.setSaveError,
    markDirty: state.markDirty,
    markSaved: state.markSaved,
    resetStep2Ui: state.resetStep2Ui
  }))