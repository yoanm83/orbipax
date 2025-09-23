"use client";

import { useStep1UIStore } from "../slices/step1.ui.slice";

/**
 * Step1 Demographics Selectors - Pure UI State Selectors
 *
 * IMPORTANT: NO PHI (Protected Health Information).
 * Only UI state derivations and presentation logic.
 */

/** Get all expanded sections state */
export const useStep1ExpandedSections = () =>
  useStep1UIStore((state) => state.expandedSections);

/** Get specific section expansion state */
export const useStep1IsSectionExpanded = (section: 'personal' | 'address' | 'contact' | 'legal') =>
  useStep1UIStore((state) => state.expandedSections[section]);

/** Get personal section expansion state */
export const useStep1IsPersonalExpanded = () =>
  useStep1UIStore((state) => state.expandedSections.personal);

/** Get address section expansion state */
export const useStep1IsAddressExpanded = () =>
  useStep1UIStore((state) => state.expandedSections.address);

/** Get contact section expansion state */
export const useStep1IsContactExpanded = () =>
  useStep1UIStore((state) => state.expandedSections.contact);

/** Get legal section expansion state */
export const useStep1IsLegalExpanded = () =>
  useStep1UIStore((state) => state.expandedSections.legal);

/** Get UI error state */
export const useStep1UIError = () =>
  useStep1UIStore((state) => state.uiError);

/** Get busy/loading state */
export const useStep1IsBusy = () =>
  useStep1UIStore((state) => state.isBusy);

/** Get form validation state */
export const useStep1IsValid = () =>
  useStep1UIStore((state) => state.isValid);

/** Get last UI action */
export const useStep1LastAction = () =>
  useStep1UIStore((state) => state.lastAction);

/** Get photo upload state */
export const useStep1PhotoUpload = () =>
  useStep1UIStore((state) => state.photoUpload);

/** Get photo uploading state */
export const useStep1IsPhotoUploading = () =>
  useStep1UIStore((state) => state.photoUpload.isUploading);

/** Get photo upload error */
export const useStep1PhotoUploadError = () =>
  useStep1UIStore((state) => state.photoUpload.uploadError);

/** Derived: Check if any section is expanded */
export const useStep1HasExpandedSections = () =>
  useStep1UIStore((state) =>
    Object.values(state.expandedSections).some(expanded => expanded)
  );

/** Derived: Check if all sections are expanded */
export const useStep1AllSectionsExpanded = () =>
  useStep1UIStore((state) =>
    Object.values(state.expandedSections).every(expanded => expanded)
  );

/** Derived: Check if all sections are collapsed */
export const useStep1AllSectionsCollapsed = () =>
  useStep1UIStore((state) =>
    Object.values(state.expandedSections).every(expanded => !expanded)
  );

/** Derived: Count of expanded sections */
export const useStep1ExpandedSectionCount = () =>
  useStep1UIStore((state) =>
    Object.values(state.expandedSections).filter(expanded => expanded).length
  );

/** Derived: Get section names that are expanded */
export const useStep1ExpandedSectionNames = () =>
  useStep1UIStore((state) =>
    Object.entries(state.expandedSections)
      .filter(([_, expanded]) => expanded)
      .map(([section, _]) => section)
  );

/** Derived: Check if form has any UI issues */
export const useStep1HasUIIssues = () =>
  useStep1UIStore((state) =>
    Boolean(state.uiError || state.photoUpload.uploadError || state.isBusy)
  );

/** Derived: Get comprehensive UI status */
export const useStep1UIStatus = () =>
  useStep1UIStore((state) => ({
    hasError: Boolean(state.uiError || state.photoUpload.uploadError),
    isBusy: state.isBusy || state.photoUpload.isUploading,
    isValid: state.isValid,
    expandedCount: Object.values(state.expandedSections).filter(Boolean).length,
    lastAction: state.lastAction,
  }));