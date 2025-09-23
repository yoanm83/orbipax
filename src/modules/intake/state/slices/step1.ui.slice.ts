"use client";

import { create } from "zustand";

/**
 * Step1 Demographics UI Slice - UI-Only Presentation State
 *
 * IMPORTANT: NO PHI (Protected Health Information) allowed.
 * Only manages UI flags for Step1 presentation layer:
 * - Section expansion/collapse states
 * - UI error states
 * - Loading/busy indicators
 * - Form validation UI feedback
 *
 * Form values remain in React Hook Form / useIntakeFormStore.
 */

interface Step1UIState {
  /** Section expansion states */
  expandedSections: {
    personal: boolean;
    address: boolean;
    contact: boolean;
    legal: boolean;
  };

  /** UI-only error state for presentation */
  uiError: string | null;

  /** Loading/busy state for UI feedback */
  isBusy: boolean;

  /** Form validation state for UI display */
  isValid: boolean;

  /** Last UI action for analytics/debugging */
  lastAction: 'expand' | 'collapse' | 'validate' | 'reset' | null;

  /** Photo upload UI state */
  photoUpload: {
    isUploading: boolean;
    uploadError: string | null;
  };
}

interface Step1UIActions {
  /** Toggle specific section expansion */
  toggleSection: (section: keyof Step1UIState['expandedSections']) => void;

  /** Expand specific section */
  expandSection: (section: keyof Step1UIState['expandedSections']) => void;

  /** Collapse specific section */
  collapseSection: (section: keyof Step1UIState['expandedSections']) => void;

  /** Expand all sections */
  expandAllSections: () => void;

  /** Collapse all sections */
  collapseAllSections: () => void;

  /** Set UI error message */
  setUiError: (error: string | null) => void;

  /** Set busy state */
  setBusy: (busy: boolean) => void;

  /** Set form validation state */
  setValid: (valid: boolean) => void;

  /** Set photo upload state */
  setPhotoUploading: (uploading: boolean) => void;

  /** Set photo upload error */
  setPhotoUploadError: (error: string | null) => void;

  /** Reset all UI state to initial */
  resetUIState: () => void;
}

type Step1UIStore = Step1UIState & Step1UIActions;

/** Initial UI state - no PHI, presentation only */
const initialState: Step1UIState = {
  expandedSections: {
    personal: true,  // Personal section starts expanded
    address: false,
    contact: false,
    legal: false,
  },
  uiError: null,
  isBusy: false,
  isValid: true,
  lastAction: null,
  photoUpload: {
    isUploading: false,
    uploadError: null,
  },
};

export const useStep1UIStore = create<Step1UIStore>((set, get) => ({
  ...initialState,

  toggleSection: (section) => {
    const currentState = get().expandedSections[section];
    set((state) => ({
      expandedSections: {
        ...state.expandedSections,
        [section]: !currentState,
      },
      lastAction: currentState ? 'collapse' : 'expand',
    }));
  },

  expandSection: (section) => {
    set((state) => ({
      expandedSections: {
        ...state.expandedSections,
        [section]: true,
      },
      lastAction: 'expand',
    }));
  },

  collapseSection: (section) => {
    set((state) => ({
      expandedSections: {
        ...state.expandedSections,
        [section]: false,
      },
      lastAction: 'collapse',
    }));
  },

  expandAllSections: () => {
    set({
      expandedSections: {
        personal: true,
        address: true,
        contact: true,
        legal: true,
      },
      lastAction: 'expand',
    });
  },

  collapseAllSections: () => {
    set({
      expandedSections: {
        personal: false,
        address: false,
        contact: false,
        legal: false,
      },
      lastAction: 'collapse',
    });
  },

  setUiError: (error) => {
    set({ uiError: error });
  },

  setBusy: (busy) => {
    set({ isBusy: busy });
  },

  setValid: (valid) => {
    set({ isValid: valid });
  },

  setPhotoUploading: (uploading) => {
    set((state) => ({
      photoUpload: {
        ...state.photoUpload,
        isUploading: uploading,
        // Clear error when starting new upload
        uploadError: uploading ? null : state.photoUpload.uploadError,
      },
    }));
  },

  setPhotoUploadError: (error) => {
    set((state) => ({
      photoUpload: {
        ...state.photoUpload,
        uploadError: error,
        isUploading: false,
      },
    }));
  },

  resetUIState: () => {
    set({ ...initialState });
  },
}));