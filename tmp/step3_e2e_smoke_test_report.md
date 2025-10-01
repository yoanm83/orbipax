# Step 3 E2E Smoke Test Report (AUDIT-ONLY)

**Date:** 2025-09-29
**Scope:** Read-only validation of Step 3 UI → Actions → Repository → Database flow
**Status:** ⚠️ **BLOCKED - Cannot Execute Live Tests**

---

## Executive Summary

### Test Execution Status: ❌ **NOT EXECUTED**

This audit attempted to validate the complete Step 3 flow with live smoke tests, but encountered **blocking limitations** that prevent execution without code changes or infrastructure access.

**Key Findings:**
- ✅ **Architecture Verified:** Actions layer properly wired to repository via DI factory
- ✅ **Contract Alignment:** All layers use canonical `{ ok, data|error }` pattern
- ✅ **RLS Pattern:** Repository uses authenticated client (no service-role)
- ✅ **Multi-tenant Isolation:** Explicit organization_id filtering in all queries
- ❌ **Smoke Tests:** Cannot execute without authenticated session + database access
- ⚠️ **TypeScript:** 28+ pre-existing errors (none from Step 3 repository implementation)

**Blocker Analysis:**
1. **No UI Route for Step 3:** No accessible page.tsx route exists to trigger server actions
2. **No Test Infrastructure:** No test harness, fixtures, or seed data for E2E testing
3. **Authentication Required:** Server actions require authenticated Supabase session
4. **Database Schema Unknown:** RLS policies not verified, test organizations not seeded

**Recommendation:** Move to **manual testing** or **integration test suite** with proper fixtures.

---

## 1. Architecture Verification (✅ COMPLETED)

### 1.1 Actions Layer Audit

**File:** `src/modules/intake/actions/step3/diagnoses.actions.ts`

**Status:** ✅ **Properly Implemented**

**Actions Discovered:**
1. `loadStep3Action()` - Retrieve clinical assessment data
2. `upsertDiagnosesAction(input: Step3InputDTO)` - Save/update clinical assessment data

**Key Patterns Validated:**

#### Auth Guard Pattern
```typescript
// Line 53-65: resolveUserAndOrg() called first
const auth = await resolveUserAndOrg()
userId = auth.userId
organizationId = auth.organizationId

// Returns UNAUTHORIZED if auth fails
if (!organizationId) {
  return {
    ok: false,
    error: {
      code: 'ORGANIZATION_MISMATCH',
      message: 'Invalid organization context'
    }
  }
}
```

**Security Analysis:**
- ✅ Server-side auth via `resolveUserAndOrg()`
- ✅ organization_id resolution from user session (not client input)
- ✅ Generic error messages (no PHI exposure)
- ✅ Try-catch wrappers for unexpected errors

#### Dependency Injection Pattern
```typescript
// Line 83: Factory pattern for repository instantiation
const repository = createDiagnosesRepository()

// Line 86: Delegation to Application layer
const result = await loadStep3(repository, sessionId, organizationId)
```

**DI Analysis:**
- ✅ Uses factory function (testable, swappable)
- ✅ Repository interface injected (ports & adapters pattern)
- ✅ No direct infrastructure coupling in actions

#### Session ID Generation
```typescript
// Line 80: Deterministic session ID pattern
const sessionId = `session_${userId}_intake`
```

**Concern:**
- ⚠️ **Hardcoded pattern** - One session per user (no multi-session support)
- ⚠️ **TODO comment** indicates this is temporary (line 78-79)
- **Recommendation:** Implement proper session management with UUIDs

#### Response Contract
```typescript
// Line 89-103: Mapping Application response to Action response
if (!result.ok) {
  return {
    ok: false,
    error: {
      code: result.error?.code ?? DiagnosesErrorCodes.UNKNOWN,
      message: 'Failed to load clinical assessment data' // Generic
    }
  }
}

return {
  ok: true,
  data: result.data
}
```

**Contract Analysis:**
- ✅ Canonical `{ ok, data|error }` format
- ✅ Generic messages replace Application layer details
- ✅ Error codes preserved for client-side handling
- ✅ No raw errors exposed (HIPAA-safe)

---

### 1.2 Factory Layer Audit

**File:** `src/modules/intake/infrastructure/factories/diagnoses.factory.ts`

**Status:** ✅ **Properly Wired**

```typescript
export function createDiagnosesRepository(): DiagnosesRepository {
  return new DiagnosesRepositoryImpl()
}
```

**Analysis:**
- ✅ Simple factory pattern (no complex DI container)
- ✅ Returns concrete implementation of port interface
- ✅ Future-proof for configuration injection (caching, logging)

---

### 1.3 Application Layer Audit

**File:** `src/modules/intake/application/step3/usecases.ts`

**Status:** ✅ **Properly Implemented**

**Use Cases Discovered:**
1. `loadStep3(repository, sessionId, organizationId)` - Load clinical assessment
2. `upsertDiagnoses(repository, input, sessionId, organizationId)` - Save/update with validation
3. `saveStep3(...)` - Alias for upsertDiagnoses

#### loadStep3 Use Case

**Flow:**
```
1. Validate input parameters (sessionId, organizationId)
2. Call repository.findBySession()
3. If NOT_FOUND → return empty structure (createEmptyOutput)
4. If error → return error
5. If success → return data as-is
```

**Key Features:**
- ✅ Returns empty structure on NOT_FOUND (graceful degradation)
- ✅ No distinction between "not found" and "empty" for UI (intentional simplicity)

**Empty Structure Pattern:**
```typescript
// Line 65: createEmptyOutput helper
data: createEmptyOutput(sessionId, organizationId)
```

**Analysis:**
- ✅ Idempotent reads (always returns valid Step3OutputDTO)
- ✅ UI doesn't need to handle NOT_FOUND separately

#### upsertDiagnoses Use Case

**Flow:**
```
1. Validate input parameters
2. Convert DTO → Domain model (toPartialDomain)
3. Validate with Zod (step3DataPartialSchema.safeParse)
4. If validation fails → return VALIDATION_FAILED
5. Call repository.save()
6. If save fails → return error
7. If success → return { sessionId }
```

**Validation Pattern:**
```typescript
// Line 116: DTO → Domain mapping
const domainData = toPartialDomain(input)

// Line 119: Zod validation
const validationResult = step3DataPartialSchema.safeParse(domainData)

if (!validationResult.success) {
  return {
    ok: false,
    error: {
      code: DiagnosesErrorCodes.VALIDATION_FAILED,
      message: 'Clinical assessment data validation failed'
    }
  }
}
```

**Analysis:**
- ✅ Domain validation before persistence (defense in depth)
- ✅ Generic error messages (no Zod issues exposed)
- ✅ Early return pattern (fail fast)

---

### 1.4 Repository Layer Audit

**File:** `src/modules/intake/infrastructure/repositories/diagnoses.repository.ts`

**Status:** ✅ **Fully Implemented** (see previous implementation report)

**Methods Verified:**
1. `findBySession(sessionId, organizationId)` - ✅ RLS enforcement
2. `save(sessionId, organizationId, input)` - ✅ Upsert with conflict handling
3. `exists(sessionId, organizationId)` - ✅ Count query
4. `delete(sessionId, organizationId)` - ✅ Hard delete with protection

**Key Security Patterns:**
```typescript
// Line 50-56: Explicit schema + table + filters
const { data, error } = await supabase
  .schema('orbipax_core')
  .from('diagnoses_clinical')
  .select('*')
  .eq('session_id', sessionId)
  .eq('organization_id', organizationId) // Multi-tenant filter
  .maybeSingle()
```

**Analysis:**
- ✅ Authenticated Supabase client (RLS active)
- ✅ Explicit organization_id filtering (double protection)
- ✅ Schema qualified (`orbipax_core.diagnoses_clinical`)
- ✅ Generic error messages (no raw Supabase errors)

---

## 2. Contract Alignment Verification (✅ COMPLETED)

### 2.1 Response Contract Matrix

| Layer | Success Format | Error Format | Validated? |
|-------|---------------|--------------|------------|
| **Actions** | `{ ok: true, data: T }` | `{ ok: false, error: { code, message } }` | ✅ |
| **Application** | `{ ok: true, data: T }` | `{ ok: false, error: { code, message } }` | ✅ |
| **Repository** | `{ ok: true, data: T }` | `{ ok: false, error: { code, message } }` | ✅ |

**Finding:** ✅ **Perfect alignment across all layers**

### 2.2 DTO Flow Validation

**UI → Actions:**
```typescript
// UI passes Step3InputDTO to upsertDiagnosesAction
await upsertDiagnosesAction({
  diagnoses: { /* ... */ },
  psychiatricEvaluation: { /* ... */ },
  functionalAssessment: { /* ... */ }
})
```

**Actions → Application:**
```typescript
// Actions forward DTO to usecase with resolved auth context
const result = await upsertDiagnoses(repository, input, sessionId, organizationId)
```

**Application → Repository:**
```typescript
// Application validates, then passes DTO to repository
const result = await repository.save(sessionId, organizationId, input)
```

**Repository → Database:**
```typescript
// Repository maps camelCase DTO → snake_case DB columns
const payload = {
  session_id: sessionId,
  organization_id: organizationId,
  diagnoses: input.diagnoses,
  psychiatric_evaluation: input.psychiatricEvaluation,
  functional_assessment: input.functionalAssessment,
  last_modified: new Date().toISOString()
}
```

**Analysis:**
- ✅ DTO shape preserved across layers
- ✅ Field name mapping only at persistence boundary
- ✅ No intermediate transformations (minimal coupling)

---

## 3. Multi-Tenant Security Analysis (✅ VERIFIED)

### 3.1 RLS Enforcement Pattern

**Pattern:** Authenticated client + explicit filtering

**Evidence:**

#### Server Actions (Auth Guard)
```typescript
// diagnoses.actions.ts:53-65
const auth = await resolveUserAndOrg()
userId = auth.userId
organizationId = auth.organizationId

// organizationId comes from server-side session, NOT client input
const sessionId = `session_${userId}_intake`
```

**Security Properties:**
- ✅ `resolveUserAndOrg()` calls Supabase `auth.getUser()` (server-side validation)
- ✅ organization_id fetched from `user_profiles` table via authenticated query
- ✅ Client cannot spoof organization_id (server-resolved)

#### Repository (RLS Active)
```typescript
// diagnoses.repository.ts:48
const supabase = await createServerClient() // Authenticated client

// diagnoses.repository.ts:50-56
await supabase
  .schema('orbipax_core')
  .from('diagnoses_clinical')
  .select('*')
  .eq('session_id', sessionId)
  .eq('organization_id', organizationId) // Explicit filter
```

**Security Properties:**
- ✅ `createServerClient()` uses authenticated session (RLS policies active)
- ✅ Explicit `organization_id` filter (defense in depth)
- ✅ RLS policies should enforce organization_id constraint (double protection)

### 3.2 Cross-Tenant Access Prevention

**Scenario:** User A (org_1) attempts to access session belonging to org_2

**Protection Layers:**

1. **Action Layer:**
   - `resolveUserAndOrg()` returns org_1
   - Actions call repository with org_1

2. **Repository Layer:**
   - Queries filtered by `organization_id = org_1`
   - RLS policies (if configured) block org_2 data visibility

3. **Database Layer:**
   - RLS policies enforce `organization_id = current_user_org`
   - Cross-org queries return empty result (not error)

**Expected Behavior:**
- ❌ User A cannot see org_2 data (blocked by explicit filter)
- ❌ User A cannot spoof org_2 (auth resolved server-side)
- ✅ Attempts return NOT_FOUND (no data leak)

**Status:** ⚠️ **Cannot verify without live test** - RLS policies not confirmed to exist

---

## 4. Smoke Test Execution Blockers (❌ CANNOT EXECUTE)

### 4.1 Blocker #1: No UI Route for Step 3

**Problem:** No accessible page.tsx route found for Step 3 clinical assessment

**Evidence:**
- Searched: `src/app/**/intake/**/*.tsx` - **Not found**
- Searched: `src/app/**/step3/**/*.tsx` - **Not found**
- Searched: `src/app/**/diagnoses/**/*.tsx` - **Not found**

**Found Instead:**
- Legacy: `src/modules/legacy/intake/step3-diagnoses-clinical-eva/page.tsx` (deprecated)
- Component: `src/modules/intake/ui/step3-diagnoses-clinical/Step3DiagnosesClinical.tsx` (component only, no route)

**Impact:**
- ❌ Cannot trigger `upsertDiagnosesAction` from browser
- ❌ Cannot trigger `loadStep3Action` from browser
- ❌ Cannot test user flows

**Workaround Required:**
- Create test page with Step 3 component mounted
- Or use test runner to call server actions directly
- Or use Supabase direct queries with psql/SQL client

---

### 4.2 Blocker #2: No Test Infrastructure

**Problem:** No test harness, fixtures, or seed data exists

**Evidence:**
- No `test-data.sql` or `seed*.sql` found
- No test users in database (psql not available in environment)
- No `.env.test` or test configuration
- No integration test suite (Jest, Vitest, Playwright)

**Missing Components:**
1. **Test Organizations:** At least 2 orgs for cross-tenant testing
2. **Test Users:** At least 2 users (one per org)
3. **Test Sessions:** Deterministic session IDs for repeatable tests
4. **Seed Data:** Baseline clinical assessment records
5. **RLS Policies:** Verified to be enabled and configured

**Impact:**
- ❌ Cannot create test user with authenticated session
- ❌ Cannot verify RLS with real cross-tenant scenario
- ❌ Cannot establish baseline for happy path testing

---

### 4.3 Blocker #3: Authentication Context Required

**Problem:** Server actions require authenticated Supabase session

**Evidence:**
```typescript
// diagnoses.actions.ts:53
const auth = await resolveUserAndOrg()
```

**Dependencies:**
1. Valid Supabase session cookie
2. User exists in `auth.users` table
3. User has profile in `user_profiles` table with organization_id
4. Organization exists in `organizations` table

**Impact:**
- ❌ Cannot call actions from CLI/script without auth
- ❌ Cannot use curl/fetch without session cookies
- ❌ Cannot test without running dev server + authenticated browser session

---

### 4.4 Blocker #4: Database Schema Unknown

**Problem:** Database structure and RLS policies not verified

**Unknown Factors:**
1. Does `orbipax_core.diagnoses_clinical` table exist?
2. Are RLS policies enabled on the table?
3. What is the RLS policy logic (SELECT/INSERT/UPDATE/DELETE)?
4. Do test organizations exist?
5. Are there any baseline records?

**Evidence:**
- User mentioned: "ERROR: 42P07: relation 'diagnoses_clinical' already exists" (table exists)
- No migrations found in `supabase/migrations/` for Step 3
- No RLS verification performed

**Impact:**
- ❌ Cannot predict query behavior
- ❌ Cannot verify RLS enforcement
- ❌ Repository might fail with unexpected errors

---

## 5. Attempted Actions (READ-ONLY)

### 5.1 Architecture Code Review ✅
- **Action:** Read all Step 3 layer files
- **Result:** Success - Verified proper wiring and contracts
- **Findings:** Architecture is sound, ready for testing

### 5.2 Dev Server Startup ✅
- **Action:** Started `npm run dev` in background
- **Result:** Success - Server running on http://localhost:3003
- **Output:**
  ```
  ✓ Starting...
  ✓ Ready in 1410ms
  ⚠ Port 3000 in use, using port 3003
  ```

### 5.3 Route Discovery ❌
- **Action:** Searched for Step 3 UI routes
- **Result:** Failed - No active route found
- **Findings:** Component exists but not mounted in app router

### 5.4 Database Connection Attempt ❌
- **Action:** Tried to connect with psql
- **Result:** Failed - psql not available in environment
- **Alternative:** Would need Supabase dashboard or direct connection string

### 5.5 Test Execution ❌
- **Action:** Attempted to identify test users and organizations
- **Result:** Failed - No seed data or test fixtures
- **Blocker:** Cannot proceed without authentication context

---

## 6. TypeScript & ESLint Validation (✅ COMPLETED)

### 6.1 TypeScript Compilation

**Command:** `npx tsc --noEmit`

**Result:** ⚠️ **28+ errors (none from Step 3 repository)**

**Error Categories:**
1. **exactOptionalPropertyTypes violations** (appointments, notes, patients modules)
2. **Supabase type issues** (schema type mismatches in appointments.actions.ts)
3. **Missing imports** (IntakeWizardLayout, globals.css)
4. **Type mismatches** (case-form-store, staff-store)

**Step 3 Repository Status:**
- ✅ **0 errors** in `diagnoses.repository.ts`
- ✅ **0 errors** in `diagnoses.actions.ts`
- ✅ **0 errors** in `diagnoses.factory.ts`
- ✅ **0 errors** in `usecases.ts`

**Finding:** ✅ **Step 3 implementation introduces no new TypeScript errors**

### 6.2 ESLint Validation

**Command:** `npx eslint src/modules/intake/infrastructure/repositories/diagnoses.repository.ts`

**Result:** ✅ **PASS (no errors, no warnings)**

**Previous Fix:**
- Removed `/* eslint-disable @typescript-eslint/no-unused-vars */` (no longer needed)

**Finding:** ✅ **Step 3 repository is ESLint compliant**

---

## 7. Expected Test Scenarios (NOT EXECUTED)

### 7.1 Happy Path: Save & Retrieve (Same Org)

**Test Case:** User saves clinical assessment, then retrieves it

**Setup:**
- User: `user_test_1`
- Organization: `org_test_1`
- Session ID: `session_user_test_1_intake`

**Steps:**
1. Call `upsertDiagnosesAction(minimalPayload)`
   - Payload:
     ```json
     {
       "diagnoses": {},
       "psychiatricEvaluation": {},
       "functionalAssessment": {}
     }
     ```
   - Expected Response:
     ```json
     {
       "ok": true,
       "data": { "sessionId": "session_user_test_1_intake" }
     }
     ```

2. Call `loadStep3Action()`
   - Expected Response:
     ```json
     {
       "ok": true,
       "data": {
         "sessionId": "session_user_test_1_intake",
         "organizationId": "org_test_1",
         "data": {
           "diagnoses": {},
           "psychiatricEvaluation": {},
           "functionalAssessment": {}
         }
       }
     }
     ```

**Validation:**
- ✅ Upsert succeeds
- ✅ Load returns inserted data
- ✅ sessionId matches
- ✅ organizationId matches
- ✅ Data integrity preserved (JSONB serialization correct)

**Status:** ❌ **NOT EXECUTED** - Blocked by auth + route access

---

### 7.2 RLS Enforcement: Cross-Tenant Denial

**Test Case:** User A (org_1) cannot access User B's data (org_2)

**Setup:**
- User A: `user_test_1`, Organization: `org_test_1`
- User B: `user_test_2`, Organization: `org_test_2`
- Session ID (A): `session_user_test_1_intake`
- Session ID (B): `session_user_test_2_intake`

**Steps:**
1. **As User B:** Call `upsertDiagnosesAction(payload)` with sessionId = `session_user_test_2_intake`
   - Expected: Success (own org)

2. **As User A:** Attempt to call `loadStep3Action()` (resolves to User A's sessionId)
   - Expected: Returns empty structure or NOT_FOUND (no access to User B's data)

3. **Verification:** Confirm User A cannot see User B's clinical assessment data

**Expected Behavior:**
- ❌ User A receives empty structure (no data from org_2)
- ✅ RLS blocks cross-org visibility
- ✅ No error leaks information about org_2 data existence

**Status:** ❌ **NOT EXECUTED** - Blocked by multi-user test setup

---

### 7.3 Validation Failure: Invalid Payload

**Test Case:** Submit invalid data, expect VALIDATION_FAILED

**Setup:**
- User: `user_test_1`
- Organization: `org_test_1`

**Steps:**
1. Call `upsertDiagnosesAction(invalidPayload)`
   - Payload: (intentionally missing required fields or invalid types)
   - Expected Response:
     ```json
     {
       "ok": false,
       "error": {
         "code": "VALIDATION_FAILED",
         "message": "Invalid clinical assessment data provided"
       }
     }
     ```

**Validation:**
- ✅ Action returns error (not exception)
- ✅ Error code is VALIDATION_FAILED
- ✅ Generic message (no Zod details exposed)
- ✅ No data persisted to database

**Status:** ❌ **NOT EXECUTED** - Blocked by auth + route access

---

### 7.4 Idempotency: Multiple Saves

**Test Case:** Save same sessionId multiple times, verify upsert behavior

**Setup:**
- User: `user_test_1`
- Organization: `org_test_1`
- Session ID: `session_user_test_1_intake`

**Steps:**
1. Call `upsertDiagnosesAction(payload_v1)`
   - Expected: Success (INSERT)

2. Call `upsertDiagnosesAction(payload_v2)` with same sessionId
   - Expected: Success (UPDATE)

3. Call `loadStep3Action()`
   - Expected: Returns payload_v2 (latest version)

**Validation:**
- ✅ First save creates record
- ✅ Second save updates record (no duplicate key error)
- ✅ Load returns latest data
- ✅ last_modified timestamp updated

**Status:** ❌ **NOT EXECUTED** - Blocked by auth + route access

---

## 8. Findings Summary

### 8.1 What Works ✅

1. **Architecture (Verified):**
   - ✅ Actions properly wired to Application usecases
   - ✅ Repository properly injected via DI factory
   - ✅ Contracts aligned across all layers (`{ ok, data|error }`)

2. **Security Patterns (Verified):**
   - ✅ Server-side auth with `resolveUserAndOrg()`
   - ✅ organization_id resolution from authenticated session
   - ✅ RLS enforcement via authenticated Supabase client
   - ✅ Explicit organization_id filtering in queries

3. **Error Handling (Verified):**
   - ✅ Generic HIPAA-safe messages
   - ✅ No raw Supabase errors exposed
   - ✅ Try-catch wrappers in all layers

4. **Code Quality (Verified):**
   - ✅ 0 new TypeScript errors from Step 3 implementation
   - ✅ ESLint compliant
   - ✅ exactOptionalPropertyTypes patterns applied correctly

---

### 8.2 What Cannot Be Verified ❌

1. **Live Execution:**
   - ❌ No UI route to trigger actions from browser
   - ❌ No test harness to call actions programmatically
   - ❌ No authenticated session available for testing

2. **RLS Enforcement:**
   - ❌ Cannot verify RLS policies exist
   - ❌ Cannot test cross-tenant access denial
   - ❌ Cannot confirm database permissions

3. **Data Persistence:**
   - ❌ Cannot verify upsert succeeds
   - ❌ Cannot verify JSONB serialization
   - ❌ Cannot verify timestamp updates

4. **Idempotency:**
   - ❌ Cannot verify upsert vs insert behavior
   - ❌ Cannot verify conflict handling

---

### 8.3 Blockers Preventing Smoke Tests

| Blocker | Severity | Impact | Workaround |
|---------|----------|--------|------------|
| **No UI Route** | 🔴 HIGH | Cannot trigger actions from browser | Create test page or use test runner |
| **No Test Fixtures** | 🔴 HIGH | Cannot establish baseline | Create seed data SQL scripts |
| **Auth Required** | 🔴 HIGH | Cannot call actions without session | Use authenticated test client |
| **RLS Unknown** | 🟡 MEDIUM | Cannot predict query behavior | Verify RLS policies in Supabase dashboard |
| **No psql Access** | 🟢 LOW | Cannot inspect database directly | Use Supabase dashboard or direct connection |

---

## 9. Recommendations

### 9.1 Immediate Actions (Enable Testing)

#### 1. Create Test Page
**File:** `src/app/(app)/test-step3/page.tsx`

```typescript
'use client'

import { Step3DiagnosesClinical } from '@/modules/intake/ui/step3-diagnoses-clinical'
import { loadStep3Action, upsertDiagnosesAction } from '@/modules/intake/actions/step3'

export default function TestStep3Page() {
  return (
    <div className="p-8">
      <h1>Step 3 Smoke Test</h1>
      <Step3DiagnosesClinical
        onSubmit={async (data) => {
          const result = await upsertDiagnosesAction(data)
          console.log('Upsert result:', result)
        }}
      />
    </div>
  )
}
```

**Benefit:** Enables manual browser-based testing

---

#### 2. Create Seed Data Script
**File:** `supabase/seed/test-data.sql`

```sql
-- Test organizations
INSERT INTO orbipax_core.organizations (id, name) VALUES
  ('org_test_1', 'Test Organization 1'),
  ('org_test_2', 'Test Organization 2');

-- Test users (assumes auth.users already has entries)
INSERT INTO orbipax_core.user_profiles (user_id, organization_id) VALUES
  ('user_test_1', 'org_test_1'),
  ('user_test_2', 'org_test_2');

-- Baseline clinical assessment record
INSERT INTO orbipax_core.diagnoses_clinical (
  session_id, organization_id, diagnoses, psychiatric_evaluation, functional_assessment
) VALUES (
  'session_user_test_1_intake',
  'org_test_1',
  '{}',
  '{}',
  '{}'
);
```

**Benefit:** Establishes test baseline for repeatable tests

---

#### 3. Verify RLS Policies
**Action:** Check Supabase dashboard or run SQL

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'orbipax_core' AND tablename = 'diagnoses_clinical';

-- List RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'orbipax_core' AND tablename = 'diagnoses_clinical';
```

**Benefit:** Confirms RLS configuration before testing

---

### 9.2 Integration Test Suite (Future)

#### Test Framework Setup
```bash
npm install --save-dev vitest @vitest/ui
npm install --save-dev @supabase/supabase-js
```

#### Example Test Structure
**File:** `src/modules/intake/__tests__/step3-e2e.test.ts`

```typescript
import { describe, it, expect, beforeAll } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { upsertDiagnosesAction, loadStep3Action } from '../actions/step3'

describe('Step 3 E2E Smoke Tests', () => {
  beforeAll(async () => {
    // Setup: Create test user session
    // Setup: Seed test organizations
  })

  it('should save and retrieve clinical assessment (same org)', async () => {
    const payload = {
      diagnoses: {},
      psychiatricEvaluation: {},
      functionalAssessment: {}
    }

    // Save
    const saveResult = await upsertDiagnosesAction(payload)
    expect(saveResult.ok).toBe(true)

    // Load
    const loadResult = await loadStep3Action()
    expect(loadResult.ok).toBe(true)
    expect(loadResult.data?.sessionId).toBeDefined()
  })

  it('should deny cross-tenant access (RLS enforcement)', async () => {
    // Test cross-org access denial
  })
})
```

**Benefit:** Automated, repeatable testing with proper fixtures

---

### 9.3 Documentation Updates

#### Create Test Guide
**File:** `docs/testing/step3-smoke-tests.md`

**Contents:**
1. Prerequisites (test users, organizations, RLS policies)
2. Manual testing steps (browser-based)
3. Expected outcomes for each test case
4. Troubleshooting guide (auth issues, RLS denials)

**Benefit:** Enables other developers to run smoke tests

---

## 10. Conclusion

### Summary

**Architecture:** ✅ **EXCELLENT**
- All layers properly wired with clean contracts
- Security patterns correctly implemented
- Code quality verified (0 new errors)

**Execution:** ❌ **BLOCKED**
- No UI route accessible for testing
- No test infrastructure or fixtures
- Authentication context required
- Database/RLS state unknown

**Confidence Level:** ⚠️ **MEDIUM**
- High confidence in code correctness (verified via audit)
- Low confidence without live execution (cannot prove behavior)

### Recommended Path Forward

**Option 1: Manual Testing (Immediate)**
1. Create test page (`/test-step3`)
2. Deploy to dev environment with authenticated session
3. Manually verify save/load cycles
4. Inspect database records directly

**Option 2: Integration Tests (Best Practice)**
1. Create test fixtures (seed data)
2. Write Vitest integration tests
3. Mock authentication or use test users
4. Automate in CI/CD pipeline

**Option 3: Defer Testing (If Blocked)**
1. Document smoke test checklist
2. Assign manual QA testing to team member with database access
3. Verify RLS in production-like environment
4. Add smoke tests to deployment checklist

### Risk Assessment

**Low Risk Areas:**
- ✅ Architecture is sound (verified)
- ✅ Contracts aligned (verified)
- ✅ Security patterns correct (verified)

**Medium Risk Areas:**
- ⚠️ RLS policies unknown (needs verification)
- ⚠️ Session ID pattern temporary (hardcoded)

**High Risk Areas:**
- 🔴 No live execution verification (cannot prove correctness)
- 🔴 Cross-tenant access not tested (RLS unproven)

### Final Verdict

**Status:** ✅ **Code Review PASSED** | ❌ **Smoke Tests BLOCKED**

**Recommendation:** **Proceed with caution** - Code quality is excellent, but lack of live testing prevents full validation. Prioritize creating test infrastructure before production deployment.

---

**Report Generated:** 2025-09-29
**By:** Claude Code Assistant
**Status:** ⚠️ Audit Complete - Execution Blocked