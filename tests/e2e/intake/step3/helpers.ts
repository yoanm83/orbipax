/**
 * E2E Test Helpers for Step 3 Clinical Assessment
 * OrbiPax Intake Module
 *
 * Provides utilities for E2E smoke testing the full stack
 * (UI→Actions→Application→Infrastructure→DB with RLS)
 *
 * SoC: Test utilities only - no production code
 * Pattern: Pure helper functions for test setup and assertions
 */

import type {
  Step3InputDTO,
  Step3OutputDTO
} from '@/modules/intake/application/step3/dtos'

/**
 * Creates minimal valid input data for Step 3
 * Matches schema requirements from step3DataPartialSchema
 *
 * @returns Valid Step3InputDTO with minimal required fields
 */
export function createValidMinimalInput(): Step3InputDTO {
  return {
    diagnoses: {
      primaryDiagnosis: 'F41.1 Generalized Anxiety Disorder',
      secondaryDiagnoses: [],
      substanceUseDisorder: 'no',
      mentalHealthHistory: 'E2E test data - minimal history',
      diagnosisRecords: []
    },
    psychiatricEvaluation: {
      currentSymptoms: ['anxiety'],
      severityLevel: 'mild',
      suicidalIdeation: false,
      homicidalIdeation: false,
      psychoticSymptoms: false,
      medicationCompliance: 'not-prescribed',
      treatmentHistory: 'E2E test data - no prior treatment',
      hasPsychEval: false
    },
    functionalAssessment: {
      // affectedDomains requires min(1) per schema
      affectedDomains: ['cognition'],
      // Required enum fields
      adlsIndependence: 'independent',
      iadlsIndependence: 'independent',
      cognitiveFunctioning: 'normal',
      hasSafetyConcerns: false,
      globalFunctioning: 75,
      dailyLivingActivities: ['bathing', 'dressing', 'eating'],
      socialFunctioning: 'good',
      occupationalFunctioning: 'full-time',
      cognitiveStatus: 'alert-oriented',
      adaptiveBehavior: 'E2E test data - adequate adaptive behavior'
    }
  }
}

/**
 * Asserts that a response matches the contract shape
 * { ok: boolean, data?: T, error?: { code, message } }
 *
 * @param response - Response to validate
 */
export function assertContractShape(
  response: unknown
): asserts response is { ok: boolean; data?: unknown; error?: { code: string; message?: string } } {
  if (typeof response !== 'object' || response === null) {
    throw new Error('Response must be an object')
  }

  const r = response as Record<string, unknown>

  if (typeof r.ok !== 'boolean') {
    throw new Error('Response must have boolean "ok" field')
  }

  if (r.ok && !('data' in r)) {
    throw new Error('Success response must have "data" field')
  }

  if (!r.ok && !('error' in r)) {
    throw new Error('Error response must have "error" field')
  }

  if (r.error) {
    const err = r.error as Record<string, unknown>
    if (typeof err.code !== 'string') {
      throw new Error('Error must have string "code" field')
    }
  }
}

/**
 * Asserts that Step3OutputDTO has expected structure
 * Does NOT compare values (to avoid PHI assertions)
 *
 * @param output - Step3OutputDTO to validate
 */
export function assertStep3OutputStructure(output: Step3OutputDTO): void {
  // Validate top-level fields
  if (!output.sessionId) {
    throw new Error('Output must have sessionId')
  }
  if (!output.organizationId) {
    throw new Error('Output must have organizationId')
  }
  if (!output.data) {
    throw new Error('Output must have data')
  }

  // Validate data sections
  const { data } = output

  if (!data.diagnoses) {
    throw new Error('Output data must have diagnoses section')
  }
  if (!data.psychiatricEvaluation) {
    throw new Error('Output data must have psychiatricEvaluation section')
  }
  if (!data.functionalAssessment) {
    throw new Error('Output data must have functionalAssessment section')
  }

  // Validate required sub-fields (structure only, not values)
  if (!Array.isArray(data.diagnoses.secondaryDiagnoses)) {
    throw new Error('diagnoses.secondaryDiagnoses must be an array')
  }
  if (!Array.isArray(data.diagnoses.diagnosisRecords)) {
    throw new Error('diagnoses.diagnosisRecords must be an array')
  }

  if (typeof data.psychiatricEvaluation.hasPsychEval !== 'boolean') {
    throw new Error('psychiatricEvaluation.hasPsychEval must be a boolean')
  }
  if (!Array.isArray(data.psychiatricEvaluation.currentSymptoms)) {
    throw new Error('psychiatricEvaluation.currentSymptoms must be an array')
  }

  if (!Array.isArray(data.functionalAssessment.affectedDomains)) {
    throw new Error('functionalAssessment.affectedDomains must be an array')
  }
  if (typeof data.functionalAssessment.hasSafetyConcerns !== 'boolean') {
    throw new Error('functionalAssessment.hasSafetyConcerns must be a boolean')
  }
  if (!Array.isArray(data.functionalAssessment.dailyLivingActivities)) {
    throw new Error('functionalAssessment.dailyLivingActivities must be an array')
  }
}

/**
 * Asserts that saved data was persisted correctly
 * Checks subset of fields to verify echo (not exact match to avoid PHI)
 *
 * @param input - Original input data
 * @param output - Loaded output data after save
 */
export function assertDataEcho(input: Step3InputDTO, output: Step3OutputDTO): void {
  const { data } = output

  // Check diagnoses section (structure, not exact values)
  if (input.diagnoses?.primaryDiagnosis && !data.diagnoses.primaryDiagnosis) {
    throw new Error('Primary diagnosis was not persisted')
  }

  // Check psychiatric evaluation section
  if (input.psychiatricEvaluation?.hasPsychEval !== data.psychiatricEvaluation.hasPsychEval) {
    throw new Error('Psychiatric evaluation flag was not persisted correctly')
  }

  // Check functional assessment section (key boolean flag)
  if (input.functionalAssessment?.hasSafetyConcerns !== data.functionalAssessment.hasSafetyConcerns) {
    throw new Error('Safety concerns flag was not persisted correctly')
  }

  // Check that affected domains has at least 1 entry if input had any
  if (
    input.functionalAssessment?.affectedDomains &&
    input.functionalAssessment.affectedDomains.length > 0 &&
    data.functionalAssessment.affectedDomains.length === 0
  ) {
    throw new Error('Affected domains were not persisted')
  }
}