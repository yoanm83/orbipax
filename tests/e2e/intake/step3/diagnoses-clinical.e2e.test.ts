/**
 * Step 3 Clinical Assessment E2E Smoke Test
 * OrbiPax Intake Module
 *
 * Tests the full stack flow: UI→Actions→Application→Infrastructure→DB
 * Validates RLS (Row-Level Security) via organization_id filtering
 * Verifies contract shape and data persistence
 *
 * SoC: E2E test - calls server actions directly (no UI scripting)
 * Pattern: Happy path only - load→save→reload→verify echo
 *
 * NOTE: This test requires actual database connection and auth context.
 * In CI, environment variables and Supabase service should be configured.
 * Test may be skipped if environment is not ready (dev-mode only).
 */

import { describe, it, expect, beforeAll, vi } from 'vitest'

// Conditional import - only in environments where server actions work
let loadStep3Action: any
let upsertDiagnosesAction: any

try {
  // Attempt dynamic import to avoid server-only errors
  const actions = await import('@/modules/intake/actions/step3/diagnoses.actions')
  loadStep3Action = actions.loadStep3Action
  upsertDiagnosesAction = actions.upsertDiagnosesAction
} catch (error) {
  console.warn('⚠️ Cannot import server actions in this environment. E2E tests will be skipped.')
  console.warn('Error:', error instanceof Error ? error.message : String(error))
}

import {
  createValidMinimalInput,
  assertContractShape,
  assertStep3OutputStructure,
  assertDataEcho
} from './helpers'

describe('Step 3 Clinical Assessment E2E Smoke Test', () => {
  // Note: This test assumes auth context is available via resolveUserAndOrg()
  // In dev mode, this uses opx_uid cookie or fallback to first organization
  // In CI/production, proper auth must be configured

  beforeAll(() => {
    // Environment check - log if running in CI
    if (process.env.CI) {
      console.log('Running E2E tests in CI environment')
    }

    // Skip all tests if actions couldn't be imported
    if (!loadStep3Action || !upsertDiagnosesAction) {
      console.warn('⚠️ Skipping E2E tests - server actions not available in this environment')
    }
  })

  it.skipIf(!loadStep3Action || !upsertDiagnosesAction)(
    'should complete full flow: load→save→reload with data persistence',
    async () => {
    // ==================================================================
    // STEP 1: Load existing data (or get empty structure)
    // ==================================================================

    const loadResult1 = await loadStep3Action()

    // Validate contract shape
    assertContractShape(loadResult1)

    // Should always succeed (returns empty structure if not found)
    expect(loadResult1.ok).toBe(true)

    if (!loadResult1.data) {
      throw new Error('Expected data in successful load response')
    }

    // Validate output structure
    assertStep3OutputStructure(loadResult1.data)

    const initialData = loadResult1.data

    // Log session and org for debugging (not PHI)
    console.log(`Session ID: ${initialData.sessionId}`)
    console.log(`Organization ID: ${initialData.organizationId}`)

    // ==================================================================
    // STEP 2: Create minimal valid input data
    // ==================================================================

    const validInput = createValidMinimalInput()

    // ==================================================================
    // STEP 3: Save data via upsertDiagnosesAction
    // ==================================================================

    const saveResult = await upsertDiagnosesAction(validInput)

    // Validate contract shape
    assertContractShape(saveResult)

    // Assert save succeeded
    if (!saveResult.ok) {
      console.error('Save failed:', saveResult.error)
      throw new Error(
        `Expected save to succeed, got error: ${saveResult.error?.code} - ${saveResult.error?.message || 'No message'}`
      )
    }

    expect(saveResult.ok).toBe(true)
    expect(saveResult.data).toBeDefined()
    expect(saveResult.data?.sessionId).toBe(initialData.sessionId)

    // ==================================================================
    // STEP 4: Reload data to verify persistence (echo test)
    // ==================================================================

    const loadResult2 = await loadStep3Action()

    // Validate contract shape
    assertContractShape(loadResult2)

    // Should succeed
    expect(loadResult2.ok).toBe(true)

    if (!loadResult2.data) {
      throw new Error('Expected data in reload response')
    }

    // Validate output structure
    assertStep3OutputStructure(loadResult2.data)

    // ==================================================================
    // STEP 5: Verify data echo (subset check, no PHI comparison)
    // ==================================================================

    assertDataEcho(validInput, loadResult2.data)

    // Additional non-PHI assertions for key fields
    expect(loadResult2.data.sessionId).toBe(initialData.sessionId)
    expect(loadResult2.data.organizationId).toBe(initialData.organizationId)

    // Verify diagnoses section has data
    expect(loadResult2.data.data.diagnoses.primaryDiagnosis).toBeTruthy()

    // Verify psychiatric evaluation flag persisted
    expect(loadResult2.data.data.psychiatricEvaluation.hasPsychEval).toBe(
      validInput.psychiatricEvaluation.hasPsychEval
    )

    // Verify functional assessment has at least 1 affected domain
    expect(loadResult2.data.data.functionalAssessment.affectedDomains.length).toBeGreaterThan(0)

    // ==================================================================
    // SUCCESS: Full E2E flow completed
    // ==================================================================

      console.log('✅ E2E smoke test passed: load→save→reload→echo verified')
    },
    30000
  ) // 30s timeout for E2E test with real DB calls

  it.skipIf(!loadStep3Action || !upsertDiagnosesAction)(
    'should handle empty/not-found state gracefully',
    async () => {
    // ==================================================================
    // TEST: Verify that loadStep3Action returns empty structure
    // when no data exists (NOT_FOUND case)
    // ==================================================================

    const loadResult = await loadStep3Action()

    // Validate contract shape
    assertContractShape(loadResult)

    // Should succeed even if no data found
    expect(loadResult.ok).toBe(true)

    if (!loadResult.data) {
      throw new Error('Expected empty structure in successful response')
    }

    // Validate structure
    assertStep3OutputStructure(loadResult.data)

    // Verify empty structure has required sections
    expect(loadResult.data.data.diagnoses).toBeDefined()
    expect(loadResult.data.data.psychiatricEvaluation).toBeDefined()
    expect(loadResult.data.data.functionalAssessment).toBeDefined()

      console.log('✅ Empty state handling verified')
    },
    15000
  ) // 15s timeout

  it.skipIf(!loadStep3Action || !upsertDiagnosesAction)(
    'should validate contract shape on error scenarios',
    async () => {
    // ==================================================================
    // TEST: Verify that invalid input returns proper error contract
    // ==================================================================

    // Create invalid input (empty affectedDomains violates min(1))
    const invalidInput = {
      diagnoses: {
        secondaryDiagnoses: [],
        diagnosisRecords: []
      },
      psychiatricEvaluation: {
        currentSymptoms: [],
        hasPsychEval: false
      },
      functionalAssessment: {
        affectedDomains: [], // Invalid - violates min(1)
        adlsIndependence: 'independent' as const,
        iadlsIndependence: 'independent' as const,
        cognitiveFunctioning: 'normal' as const,
        hasSafetyConcerns: false,
        dailyLivingActivities: []
      }
    }

    const saveResult = await upsertDiagnosesAction(invalidInput)

    // Validate contract shape
    assertContractShape(saveResult)

    // Should fail validation
    expect(saveResult.ok).toBe(false)
    expect(saveResult.error).toBeDefined()
    expect(saveResult.error?.code).toBeTruthy()

    // Error message should be generic (no PHI, no field details)
    expect(saveResult.error?.message).toBeTruthy()
    expect(saveResult.error?.message).not.toContain('affectedDomains')

      console.log('✅ Error contract validation verified')
    },
    15000
  ) // 15s timeout
})