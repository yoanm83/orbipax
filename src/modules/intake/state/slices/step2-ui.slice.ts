/**
 * Step 2 Insurance UI Store Slice
 * OrbiPax Intake Module - State Layer
 *
 * UI-only state management for Step 2 (Insurance)
 * No business logic, no PHI - only UI flags
 *
 * SoC: UI state only - loading/error/dirty flags
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

/**
 * Step 2 UI State
 * Ephemeral UI flags only - no domain data
 */
interface Step2UiState {
  // Loading states
  isLoading: boolean
  isSaving: boolean

  // Error states (generic messages only)
  loadError: string | null
  saveError: string | null

  // Form states
  isDirty: boolean
  lastSavedAt: string | null

  // Actions
  markLoading: (loading: boolean) => void
  markSaving: (saving: boolean) => void
  setLoadError: (error: string | null) => void
  setSaveError: (error: string | null) => void
  markDirty: () => void
  markSaved: (timestamp?: string) => void
  resetStep2Ui: () => void
}

/**
 * Initial state - all flags false/null
 */
const initialState = {
  isLoading: false,
  isSaving: false,
  loadError: null,
  saveError: null,
  isDirty: false,
  lastSavedAt: null
}

/**
 * Step 2 UI Store
 * Zustand store with devtools for debugging
 */
export const useStep2UiStore = create<Step2UiState>()(
  devtools(
    (set) => ({
      ...initialState,

      // Loading actions
      markLoading: (loading) =>
        set(
          { isLoading: loading },
          false,
          'step2-ui/markLoading'
        ),

      markSaving: (saving) =>
        set(
          { isSaving: saving },
          false,
          'step2-ui/markSaving'
        ),

      // Error actions
      setLoadError: (error) =>
        set(
          { loadError: error },
          false,
          'step2-ui/setLoadError'
        ),

      setSaveError: (error) =>
        set(
          { saveError: error },
          false,
          'step2-ui/setSaveError'
        ),

      // Form state actions
      markDirty: () =>
        set(
          { isDirty: true },
          false,
          'step2-ui/markDirty'
        ),

      markSaved: (timestamp) =>
        set(
          {
            isDirty: false,
            lastSavedAt: timestamp || new Date().toISOString(),
            saveError: null
          },
          false,
          'step2-ui/markSaved'
        ),

      // Reset action
      resetStep2Ui: () =>
        set(
          initialState,
          false,
          'step2-ui/reset'
        )
    }),
    {
      name: 'step2-ui-store'
    }
  )
)