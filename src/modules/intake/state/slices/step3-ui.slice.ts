/**
 * Step 3 Clinical Assessment UI Store Slice
 * OrbiPax Intake Module - State Layer
 *
 * UI-only state management for Step 3 (Clinical Assessment)
 * No business logic, no PHI - only UI flags
 *
 * SoC: UI state only - loading/error/dirty flags
 * Pattern: Follows Step 2 (Insurance) exact structure
 */

import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

/**
 * Step 3 UI State
 * Ephemeral UI flags only - no domain data
 */
interface Step3UiState {
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
  resetStep3Ui: () => void
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
 * Step 3 UI Store
 * Zustand store with devtools for debugging
 */
export const useStep3UiStore = create<Step3UiState>()(
  devtools(
    (set) => ({
      ...initialState,

      // Loading actions
      markLoading: (loading) =>
        set(
          { isLoading: loading },
          false,
          'step3-ui/markLoading'
        ),

      markSaving: (saving) =>
        set(
          { isSaving: saving },
          false,
          'step3-ui/markSaving'
        ),

      // Error actions
      setLoadError: (error) =>
        set(
          { loadError: error },
          false,
          'step3-ui/setLoadError'
        ),

      setSaveError: (error) =>
        set(
          { saveError: error },
          false,
          'step3-ui/setSaveError'
        ),

      // Form state actions
      markDirty: () =>
        set(
          { isDirty: true },
          false,
          'step3-ui/markDirty'
        ),

      markSaved: (timestamp) =>
        set(
          {
            isDirty: false,
            lastSavedAt: timestamp ?? new Date().toISOString(),
            saveError: null
          },
          false,
          'step3-ui/markSaved'
        ),

      // Reset action
      resetStep3Ui: () =>
        set(
          initialState,
          false,
          'step3-ui/reset'
        )
    }),
    {
      name: 'step3-ui-store'
    }
  )
)