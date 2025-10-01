/**
 * Medical Providers Domain Schema (Step 4)
 * OrbiPax Community Mental Health System
 *
 * Canonical location: schemas/medical-providers/
 * Pattern: Domain-focused naming (not wizard-step focused)
 *
 * Barrel export for all medical providers schemas, types, and validators
 */

export {
  // ============================================================================
  // Schemas
  // ============================================================================
  medicalProvidersDataSchema,
  medicalProvidersDataPartialSchema,
  providersSchema,
  psychiatristSchema,

  // ============================================================================
  // Types
  // ============================================================================
  type MedicalProvidersData,
  type MedicalProvidersDataPartial,
  type ProvidersSchema,
  type PsychiatristSchema,
  type PartialProviders,
  type PartialPsychiatrist,
  type PCPStatus,
  type EvaluationStatus,

  // ============================================================================
  // Validation Functions (Canonical Contract: { ok, data|issues })
  // ============================================================================
  validateMedicalProviders,
  validateMedicalProvidersPartial,
  validateProviders,
  validatePsychiatrist,

  // ============================================================================
  // Utility Functions
  // ============================================================================
  isProviderInfoComplete,
  isPsychiatristInfoComplete,
  shouldShowDifferentEvaluator,
  validateTextLength,
  isSectionComplete,
  isMedicalProvidersComplete,

  // ============================================================================
  // Default Values
  // ============================================================================
  defaultProvidersValues,
  defaultPsychiatristValues,
  defaultMedicalProvidersValues
} from './medical-providers.schema'