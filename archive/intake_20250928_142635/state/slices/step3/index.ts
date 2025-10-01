/**
 * Step 3 Diagnoses/Clinical - UI Store Exports
 * OrbiPax Community Mental Health System
 *
 * Aggregates and exports all Step 3 UI store slices
 * These stores manage UI-only state and do not persist PHI
 */

// =================================================================
// STORE EXPORTS
// =================================================================

export {
  useDiagnosesUIStore,
  diagnosesSelectors
} from './diagnoses.ui.slice'

export { usePsychiatricEvaluationUIStore } from './psychiatricEvaluation.ui.slice'
export { useFunctionalAssessmentUIStore } from './functionalAssessment.ui.slice'

// =================================================================
// TYPE EXPORTS
// =================================================================

export type { DiagnosesUIStore } from './diagnoses.ui.slice'