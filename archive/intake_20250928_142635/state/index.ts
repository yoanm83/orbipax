/**
 * Intake State Module - UI-Only Exports
 *
 * IMPORTANT: NO PHI (Protected Health Information) allowed.
 * Only UI state management for navigation and interface flags.
 */

// Types
export type { WizardStep, TransitionState, WizardFlags, StepCompletion, WizardPreferences } from './types';

// Store
export { useWizardProgressStore } from './slices/wizardProgress.slice';
export { useStep1UIStore } from './slices/step1/step1.ui.slice';

// Wizard Selectors
export {
  useCurrentStep,
  useTransitionState,
  useIsTransitioning,
  useVisitedSteps,
  useCompletedSteps,
  useIsStepCompleted,
  useIsStepVisited,
  useWizardFlags,
  useWizardPreferences,
  useCanAdvance,
  useCanGoBack,
  useProgressPercentage,
  useNextStep,
  usePrevStep,
} from './selectors/wizard.selectors';

// Step1 Selectors
export {
  useStep1ExpandedSections,
  useStep1IsSectionExpanded,
  useStep1IsPersonalExpanded,
  useStep1IsAddressExpanded,
  useStep1IsContactExpanded,
  useStep1IsLegalExpanded,
  useStep1UIError,
  useStep1IsBusy,
  useStep1IsValid,
  useStep1LastAction,
  useStep1PhotoUpload,
  useStep1IsPhotoUploading,
  useStep1PhotoUploadError,
  useStep1HasExpandedSections,
  useStep1AllSectionsExpanded,
  useStep1AllSectionsCollapsed,
  useStep1ExpandedSectionCount,
  useStep1ExpandedSectionNames,
  useStep1HasUIIssues,
  useStep1UIStatus,
} from './selectors/step1/step1.selectors';