/**
 * Step1 Demographics Selectors Exports
 * OrbiPax Community Mental Health System
 *
 * Aggregates and exports all Step1 selectors
 * These selectors provide derived UI state without PHI
 */

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
} from './step1.selectors';