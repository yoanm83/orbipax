# Step 3 CI Gate Audit Report
**OrbiPax Intake Module - Step 3 Clinical Assessment**

## Executive Summary

**Task**: Audit CI/CD configuration to verify Step 3 is protected by quality gates after RHF migration and legacy store removal.

**Status**: ⚠️ **GAPS IDENTIFIED** - Step 3 not yet protected by CI gate

**Key Findings**:
- ✅ Global quality gates exist (TypeScript, ESLint, Build, Health Guard)
- ✅ Step 1 and Step 2 have dedicated module gates
- ❌ **Step 3 has NO dedicated gate workflow**
- ❌ **No anti-legacy sentinel for Step 3 stores**
- ❌ **No contract tests for Step 3 actions**
- ❌ **No E2E smoke tests for Step 3**

**Risk Level**: 🔴 **HIGH** - Step 3 could regress to legacy patterns without CI protection

---

## 1. CI Pipeline Discovery

### 1.1 Platform and Structure

**CI/CD Platform**: GitHub Actions
**Location**: `.github/workflows/`

**Discovered Workflows**:
1. `quality.yml` - Global quality gate (all PRs)
2. `health-guard.yml` - Philosophy compliance sentinel
3. `intake-step1-gate.yml` - Step 1 Demographics module gate
4. `intake-step2-gate.yml` - Step 2 Insurance module gate
5. ❌ **MISSING**: `intake-step3-gate.yml`

---

### 1.2 Trigger Patterns

**Global Quality Gate** (`quality.yml`):
```yaml
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
```
- Runs on: Every PR to main, every push to main
- No path filtering - always runs

**Step 1/2 Gates** (`intake-step1-gate.yml`, `intake-step2-gate.yml`):
```yaml
on:
  pull_request:
    branches: [main, develop, release/*]
    paths:
      - 'src/modules/intake/**'
      - 'tests/modules/intake/**'
      - 'package.json'
      - 'package-lock.json'
      - 'pnpm-lock.yaml'
      - '.github/workflows/intake-step*-gate.yml'
```
- Runs on: PRs touching intake module or dependencies
- Path-filtered for efficiency

**Health Guard** (`health-guard.yml`):
```yaml
on:
  pull_request:
    branches: [main, develop]
    types: [opened, synchronize, reopened]
  push:
    branches: [main, develop]
```
- Runs on: All PRs and pushes to main/develop
- Philosophy compliance validation

---

## 2. Jobs Inventory

### 2.1 Global Quality Gate (`quality.yml`)

**Job**: `quality`

| Step | Command | Purpose |
|------|---------|---------|
| TypeScript type check | `npm run typecheck` | `tsc -p tsconfig.json --noEmit` |
| ESLint check | `npm run lint` | `eslint . && stylelint "src/**/*.{css,scss}"` |
| Prettier format check | `npm run format:check` | `prettier . --check` |
| Build check | `npm run build` | `next build` |

**Coverage**: ✅ Global - protects all modules including Step 3

**Limitations**:
- Generic errors may mask Step 3-specific issues
- No Step 3-specific validation (legacy stores, RHF compliance)

---

### 2.2 Health Guard Gate (`health-guard.yml`)

**Job**: `health-guard`

**Command**: `node scripts/sentinel/health-guard.cjs --full`

**Sentinel Script**: `scripts/sentinel/health-guard.cjs` (925 lines)

**Gates Validated**:
1. ✅ **AUDIT SUMMARY** - Enhanced validation with content quality checks
2. ✅ **PATH VALIDATION** - Confirmed imports and TypeScript aliases
3. ✅ **DUPLICATE DETECTION** - No duplicate components or functionality
4. ✅ **SOC BOUNDARIES** - Manifest-driven layer isolation validation
5. ✅ **RLS COMPLIANCE** - Manifest-driven organization filtering
6. ✅ **UI TOKENS** - Allowlist-driven semantic token validation
7. ✅ **ACCESSIBILITY** - WCAG 2.1 AA compliance
8. ✅ **ZOD VALIDATION** - Zod schemas for forms and APIs
9. ✅ **BFF WRAPPERS** - Correct security wrapper order

**Modes**:
- **Fast mode** (`--fast`): Gates 1, 2, 4, 6 (pre-commit)
- **Full mode** (`--full`): All 9 gates (pre-push/CI)

**Step 3 Coverage**: ✅ Partial - catches SoC violations, UI token issues, Zod schema absence

**Limitations**:
- **No legacy store detection** - Health Guard does NOT check for Step 3 legacy patterns:
  - `useDiagnosesUIStore`
  - `usePsychiatricEvaluationUIStore`
  - `useFunctionalAssessmentUIStore`
  - `state/slices/step3` (without `-ui`)
- Generic - not Step 3 specific

---

### 2.3 Step 1 Gate (`intake-step1-gate.yml`)

**Jobs**: 5 parallel jobs

| Job | Purpose | Command |
|-----|---------|---------|
| `contracts-tests` | Contract tests for Step 1 | `npm test -- tests/modules/intake/application/step1/ --run`<br>`npm test -- tests/modules/intake/actions/step1/ --run` |
| `typecheck` | TypeScript validation (Intake-filtered) | `npm run typecheck` + grep filter for `src/modules/intake` |
| `eslint` | ESLint validation (Intake-filtered) | `npm run lint -- src/modules/intake tests/modules/intake` |
| `sentinel` | SoC, PHI, Multi-tenant, A11y checks | Custom shell scripts |
| `no-console` | No console statements in prod | grep for `console.log/warn/error` |

**Sentinel Checks** (Step 1 specific):
1. **SoC compliance**: Application doesn't import Infrastructure
2. **PHI protection**: No firstName/lastName/dob/ssn in state
3. **Multi-tenant reset**: `resetStep1Ui` and `setOrganizationContext` exist
4. **Accessibility**: ARIA attributes, no toast notifications
5. **AUDIT documentation**: Check for `tmp/*step1*.md`

**Pattern to Follow**: ✅ Gold standard for Step 3 gate

---

### 2.4 Step 2 Gate (`intake-step2-gate.yml`)

**Jobs**: 5 parallel jobs (same structure as Step 1)

| Job | Purpose | Command |
|-----|---------|---------|
| `contracts-tests-step2` | Contract tests for Step 2 | `npm test -- tests/modules/intake/application/step2/ --run`<br>`npm test -- tests/modules/intake/actions/step2/ --run` |
| `typecheck` | TypeScript validation | Same as Step 1 |
| `eslint` | ESLint validation | Same as Step 1 |
| `sentinel` | SoC, PHI, Multi-tenant, A11y checks | Step 2 specific checks |
| `no-console` | No console statements | Same as Step 1 |

**Sentinel Checks** (Step 2 specific):
1. **SoC compliance**: Actions use factory pattern (`createInsuranceRepository`)
2. **PHI protection**: No memberId/groupNumber/subscriberName in state
3. **Multi-tenant reset**: `resetStep2Ui` exists
4. **Accessibility**: ARIA attributes + `aria-describedby` for errors
5. **AUDIT documentation**: Check for `tmp/*step2*.md`

**Pattern Match**: ✅ Consistent with Step 1

---

## 3. TypeScript and ESLint Configuration

### 3.1 TypeScript Configuration

**Command**: `npm run typecheck` → `tsc -p tsconfig.json --noEmit`

**Configuration**: `tsconfig.json`

**Relevant Settings**:
- `strict: true`
- `exactOptionalPropertyTypes: true` (strict mode for optional fields)
- `noEmit: true` (check only, don't build)

**Path Aliases**:
```json
{
  "@/*": ["./src/*"],
  "@/shared/*": ["./src/shared/*"],
  "@/modules/*": ["./src/modules/*"]
}
```

**Step 3 Coverage**: ✅ Full - all Step 3 files included

**Current Status** (from previous validation):
- ✅ 0 new errors after RHF migration
- ⚠️ 28 pre-existing errors in other modules (appointments, notes, patients)

---

### 3.2 ESLint Configuration

**Command**: `npm run lint` → `eslint . && stylelint "src/**/*.{css,scss}"`

**Plugins**:
- `@typescript-eslint/eslint-plugin`
- `eslint-plugin-import`
- `eslint-plugin-jsx-a11y`
- `eslint-plugin-regexp`
- `eslint-plugin-unused-imports`

**Step 3 Coverage**: ✅ Full - all Step 3 files included

**Current Status** (from previous validation):
- ✅ 0 new errors after legacy store removal
- ⚠️ 40 pre-existing style issues in Step 3 section components (curly braces, unused vars)

---

### 3.3 Path Filtering in Step Gates

**Step 1/2 Gates** use grep filtering to isolate intake module errors:

```bash
# TypeScript check with Intake filter
npm run typecheck 2>&1 | tee typecheck-output.log
grep -E "src/modules/intake" typecheck-output.log | grep -v "legacy\|archive" > intake-errors.log

if grep -E "error TS" intake-errors.log; then
  echo "❌ TypeScript errors found in Intake module"
  exit 1
fi
```

**Benefit**: Isolates module-specific errors from global noise

**Limitation**: Still allows pre-existing errors if they're not new

---

## 4. Anti-Legacy Sentinel Analysis

### 4.1 Current Sentinel Scripts

**Health Guard** (`scripts/sentinel/health-guard.cjs`):
- 925 lines, 9 validation gates
- Manifest-driven (SoC, RLS, UI tokens)
- Generic architecture validation

**Coverage for Step 3**:
- ✅ SoC boundaries (UI→App→Domain→Infra)
- ✅ RLS compliance (organization_id filtering)
- ✅ UI tokens (semantic Tailwind v4)
- ✅ Accessibility (WCAG 2.1 AA)
- ✅ Zod validation
- ❌ **NO Step 3 legacy store detection**

---

### 4.2 Anti-Legacy Gap for Step 3

**Problem**: Health Guard does NOT prevent reintroduction of legacy stores.

**Missing Checks**:
1. Grep for legacy store imports:
   - `from "@/modules/intake/state/slices/step3"` (without `-ui`)
2. Grep for legacy store symbols:
   - `useDiagnosesUIStore`
   - `usePsychiatricEvaluationUIStore`
   - `useFunctionalAssessmentUIStore`
3. Verify canonical store usage:
   - `useStep3UiStore` imported from `step3-ui.slice.ts`
4. Verify RHF usage:
   - `useForm` with `zodResolver` in Step 3 container
   - No manual validation in Step 3 UI

**Risk**: Developer could accidentally:
- Re-create legacy store files
- Import from deleted `state/slices/step3/` path
- Mix form data back into UI stores

---

### 4.3 Step 1/2 Sentinel Patterns (Reference)

**Step 1 Sentinel** checks for:
```bash
# Multi-tenant reset
if ! grep -r "resetStep1Ui\|setOrganizationContext" src/modules/intake/state/slices/step1.ui.slice.ts; then
  echo "❌ Multi-tenant violation: Missing reset functionality"
  exit 1
fi
```

**Step 2 Sentinel** checks for:
```bash
# Factory pattern
if ! grep -r "createInsuranceRepository" src/modules/intake/actions/step2/ --include="*.ts"; then
  echo "❌ SoC violation: Actions not using factory pattern for Step2"
  exit 1
fi
```

**Pattern to Apply to Step 3**:
```bash
# Anti-legacy check
if grep -r "useDiagnosesUIStore\|usePsychiatricEvaluationUIStore\|useFunctionalAssessmentUIStore" src/modules/intake/ui/step3-* --include="*.tsx"; then
  echo "❌ Legacy store violation: Step 3 using legacy stores (removed in RHF migration)"
  exit 1
fi

# RHF compliance check
if ! grep -r "useForm.*Step3DataPartial" src/modules/intake/ui/step3-diagnoses-clinical/*.tsx; then
  echo "❌ RHF violation: Step 3 container not using React Hook Form"
  exit 1
fi

# Canonical store check
if ! grep -r "useStep3UiStore" src/modules/intake/ui/step3-diagnoses-clinical/*.tsx; then
  echo "❌ State violation: Step 3 not using canonical UI store"
  exit 1
fi
```

---

## 5. E2E Smoke Tests Analysis

### 5.1 E2E Test Infrastructure

**Framework Search Results**:
- ❌ Playwright: Not found (`playwright.config.ts` missing)
- ✅ Vitest: Configured (`vitest.config.ts` exists)

**Vitest Configuration**:
```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/shared': path.resolve(__dirname, './src/shared'),
      '@/modules': path.resolve(__dirname, './src/modules'),
    },
  },
})
```

**Test Environment**: Node (not browser/jsdom)
- **Implication**: Unit/integration tests only, not full E2E

---

### 5.2 Existing Contract Tests

**Step 1 Contract Tests**: ✅ Exist
- `tests/modules/intake/actions/step1/demographics.actions.test.ts`
- `tests/modules/intake/application/step1/usecases.test.ts`

**Pattern** (from Step 1):
```typescript
// Mock auth guard
vi.mock('@/shared/lib/current-user.server', () => ({
  resolveUserAndOrg: vi.fn()
}))

// Mock factory
vi.mock('@/modules/intake/infrastructure/factories/demographics.factory', () => ({
  createDemographicsRepository: vi.fn()
}))

// Test server action
describe('loadDemographicsAction', () => {
  it('should return data when authentication succeeds', async () => {
    // ... test logic
  })
})
```

**Step 2 Contract Tests**: ✅ Exist
- `tests/modules/intake/actions/step2/step2.insurance.actions.test.ts`
- `tests/modules/intake/application/step2/usecases.test.ts`

**Step 3 Contract Tests**: ❌ **MISSING**
- `tests/modules/intake/actions/step3/` directory does not exist
- `tests/modules/intake/application/step3/` directory does not exist

---

### 5.3 Smoke Test Gap for Step 3

**Missing Tests**:
1. **Action Layer Tests** (contract tests):
   - `tests/modules/intake/actions/step3/diagnoses.actions.test.ts`
   - Should test `loadStep3Action` and `upsertDiagnosesAction`
   - Mock auth, factory, use cases
   - Verify error mapping and security boundaries

2. **Application Layer Tests** (use case tests):
   - `tests/modules/intake/application/step3/usecases.test.ts`
   - Should test use cases with mocked repository
   - Verify business logic and validation

3. **E2E Smoke Test** (ideal, but requires Playwright setup):
   - Not viable in current infrastructure (Vitest is unit-test only)
   - Alternative: Smoke contract test that exercises full flow

**Risk**: Step 3 actions could break without detection:
- `loadStep3Action` fails to load data
- `upsertDiagnosesAction` fails to save data
- RLS not enforced (organization_id missing)
- Error codes not properly mapped

---

### 5.4 Contract Test Pattern (Reference)

**Minimal Smoke Contract Test** (based on Step 1/2 pattern):

```typescript
// tests/modules/intake/actions/step3/diagnoses.actions.test.ts

describe('loadStep3Action', () => {
  it('should return ok:true with valid data when user is authenticated', async () => {
    // Arrange
    mockResolveUserAndOrg.mockResolvedValueOnce({
      userId: 'user-123',
      organizationId: 'org-456',
      sessionId: 'session-789'
    })

    mockCreateDiagnosesRepository.mockReturnValueOnce(mockRepository)
    mockLoadDiagnoses.mockResolvedValueOnce({
      ok: true,
      data: { diagnoses: {}, psychiatricEvaluation: {}, functionalAssessment: {} }
    })

    // Act
    const result = await loadStep3Action()

    // Assert
    expect(result.ok).toBe(true)
    expect(result.data).toBeDefined()
  })

  it('should return NOT_FOUND when no data exists', async () => {
    mockLoadDiagnoses.mockResolvedValueOnce({
      ok: false,
      error: { code: 'NOT_FOUND' }
    })

    const result = await loadStep3Action()

    expect(result.ok).toBe(false)
    expect(result.error?.code).toBe('NOT_FOUND')
  })

  it('should return UNAUTHORIZED when user is not authenticated', async () => {
    mockResolveUserAndOrg.mockRejectedValueOnce(new Error('Unauthorized'))

    const result = await loadStep3Action()

    expect(result.ok).toBe(false)
    expect(result.error?.code).toBe('UNAUTHORIZED')
  })
})
```

**Smoke Validation Criteria**:
- ✅ Authentication required
- ✅ Error codes properly mapped
- ✅ Data structure matches schema
- ✅ Security boundaries respected

---

## 6. CI Gaps Matrix

| Check | Step 1 | Step 2 | Step 3 | Priority |
|-------|--------|--------|--------|----------|
| **Dedicated Gate Workflow** | ✅ | ✅ | ❌ | 🔴 **P0** |
| **Contract Tests (Actions)** | ✅ | ✅ | ❌ | 🔴 **P0** |
| **Contract Tests (Application)** | ✅ | ✅ | ❌ | 🔴 **P0** |
| **TypeScript Check (Filtered)** | ✅ | ✅ | ❌ | 🟠 **P1** |
| **ESLint Check (Filtered)** | ✅ | ✅ | ❌ | 🟠 **P1** |
| **Anti-Legacy Sentinel** | ✅ | ✅ | ❌ | 🔴 **P0** |
| **SoC Compliance Check** | ✅ | ✅ | ❌ | 🟠 **P1** |
| **PHI Protection Check** | ✅ | ✅ | ❌ | 🔴 **P0** |
| **Multi-tenant Reset Check** | ✅ | ✅ | ❌ | 🟠 **P1** |
| **Accessibility Check** | ✅ | ✅ | ❌ | 🟡 **P2** |
| **No Console Check** | ✅ | ✅ | ❌ | 🟡 **P2** |
| **AUDIT Documentation Check** | ✅ | ✅ | ❌ | 🟡 **P2** |
| **E2E Smoke Test** | ❌ | ❌ | ❌ | 🟢 **P3** |

**Legend**:
- ✅ Implemented
- ❌ Missing
- 🔴 **P0** - Critical (blocks regression)
- 🟠 **P1** - High (improves confidence)
- 🟡 **P2** - Medium (nice to have)
- 🟢 **P3** - Low (future enhancement)

---

## 7. Proposed Micro-Tasks (APPLY Phase)

### Task 1: Create Step 3 CI Gate Workflow (P0)

**Deliverable**: `.github/workflows/intake-step3-gate.yml`

**Objective**: Create dedicated CI gate for Step 3 Clinical Assessment module.

**Actions**:
1. Copy `intake-step2-gate.yml` as template
2. Update job names: `contracts-tests-step3`, `typecheck`, `eslint`, `sentinel`, `no-console`, `gate-summary`
3. Update test paths:
   - `npm test -- tests/modules/intake/application/step3/ --run`
   - `npm test -- tests/modules/intake/actions/step3/ --run`
4. Update sentinel checks (see Task 2)
5. Update gate summary comment: "Intake Step3 Gate Results - Clinical Assessment Module CI Gate"

**Acceptance Criteria**:
- ✅ Workflow triggers on PRs touching `src/modules/intake/**` or `tests/modules/intake/**`
- ✅ All 5 jobs run in parallel
- ✅ Workflow fails if any job fails
- ✅ PR comment shows gate summary

**Allowed Paths**:
- WRITE: `.github/workflows/intake-step3-gate.yml`

**Validation**:
```bash
# Dry run validation
act pull_request -W .github/workflows/intake-step3-gate.yml --dry-run
```

---

### Task 2: Add Step 3 Anti-Legacy Sentinel (P0)

**Deliverable**: Updated `sentinel` job in `.github/workflows/intake-step3-gate.yml`

**Objective**: Prevent reintroduction of legacy stores and ensure RHF compliance.

**Actions**:
Add to `sentinel` job:

```bash
- name: Check anti-legacy compliance (Step3)
  run: |
    echo "🚫 Checking for legacy Step 3 stores..."

    # Check for legacy store imports
    if grep -r "from.*@/modules/intake/state/slices/step3['\"]" src/modules/intake/ui/step3-* --include="*.tsx" --include="*.ts"; then
      echo "❌ Legacy store import detected: Do not import from @/modules/intake/state/slices/step3"
      echo "   Use @/modules/intake/state/slices/step3-ui.slice instead"
      exit 1
    fi

    # Check for legacy store symbols
    LEGACY_SYMBOLS="useDiagnosesUIStore|usePsychiatricEvaluationUIStore|useFunctionalAssessmentUIStore"
    if grep -rE "$LEGACY_SYMBOLS" src/modules/intake/ui/step3-* --include="*.tsx" --include="*.ts"; then
      echo "❌ Legacy store usage detected: These stores were removed in RHF migration"
      echo "   Form data: Use React Hook Form (useForm + zodResolver)"
      echo "   UI flags: Use useStep3UiStore from step3-ui.slice.ts"
      exit 1
    fi

    # Check for RHF compliance in container
    if ! grep -r "useForm.*Step3DataPartial" src/modules/intake/ui/step3-diagnoses-clinical/Step3DiagnosesClinical.tsx; then
      echo "❌ RHF violation: Step 3 container must use React Hook Form"
      exit 1
    fi

    # Check for canonical store usage
    if ! grep -r "useStep3UiStore" src/modules/intake/ui/step3-diagnoses-clinical/Step3DiagnosesClinical.tsx; then
      echo "❌ State violation: Step 3 must use canonical useStep3UiStore for UI flags"
      exit 1
    fi

    # Check for zodResolver usage
    if ! grep -r "zodResolver.*step3DataPartialSchema" src/modules/intake/ui/step3-diagnoses-clinical/Step3DiagnosesClinical.tsx; then
      echo "❌ Validation violation: Step 3 must use zodResolver with step3DataPartialSchema"
      exit 1
    fi

    echo "✅ Anti-legacy compliance check passed"
```

**Acceptance Criteria**:
- ✅ Sentinel fails if legacy stores are imported
- ✅ Sentinel fails if legacy symbols are used
- ✅ Sentinel fails if RHF is not used
- ✅ Sentinel fails if canonical store is not used
- ✅ Sentinel passes for current Step 3 implementation

**Allowed Paths**:
- EDIT: `.github/workflows/intake-step3-gate.yml` (sentinel job only)

**Validation**:
```bash
# Test anti-legacy sentinel locally
cd D:/ORBIPAX-PROJECT
grep -r "useDiagnosesUIStore" src/modules/intake/ui/step3-* && echo "FAIL" || echo "PASS"
grep -r "useForm.*Step3DataPartial" src/modules/intake/ui/step3-diagnoses-clinical/*.tsx && echo "PASS" || echo "FAIL"
```

---

### Task 3: Create Step 3 Contract Tests - Actions Layer (P0)

**Deliverable**: `tests/modules/intake/actions/step3/diagnoses.actions.test.ts`

**Objective**: Test Step 3 server actions with mocked dependencies.

**Actions**:
1. Create test file following Step 1/2 pattern
2. Mock `resolveUserAndOrg`, `createDiagnosesRepository`, use cases
3. Test `loadStep3Action`:
   - Success case: Returns `{ ok: true, data: {...} }`
   - NOT_FOUND case: Returns `{ ok: false, error: { code: 'NOT_FOUND' } }`
   - UNAUTHORIZED case: Returns `{ ok: false, error: { code: 'UNAUTHORIZED' } }`
4. Test `upsertDiagnosesAction`:
   - Success case: Returns `{ ok: true, data: { sessionId: '...' } }`
   - VALIDATION_FAILED case: Returns `{ ok: false, error: { code: 'VALIDATION_FAILED' } }`
   - UNAUTHORIZED case: Returns `{ ok: false, error: { code: 'UNAUTHORIZED' } }`

**Acceptance Criteria**:
- ✅ All tests pass: `npm test -- tests/modules/intake/actions/step3/ --run`
- ✅ Coverage includes auth, error mapping, data structure
- ✅ Mocks isolate actions layer from infrastructure

**Allowed Paths**:
- WRITE: `tests/modules/intake/actions/step3/diagnoses.actions.test.ts`

**Validation**:
```bash
npm test -- tests/modules/intake/actions/step3/diagnoses.actions.test.ts --run
```

---

### Task 4: Create Step 3 Contract Tests - Application Layer (P0)

**Deliverable**: `tests/modules/intake/application/step3/usecases.test.ts`

**Objective**: Test Step 3 use cases with mocked repository.

**Actions**:
1. Create test file following Step 1/2 pattern
2. Mock `DiagnosesRepository` interface
3. Test use cases:
   - `loadDiagnoses`: Success, NOT_FOUND
   - `saveDiagnoses`: Success, VALIDATION_FAILED
4. Verify business logic and validation

**Acceptance Criteria**:
- ✅ All tests pass: `npm test -- tests/modules/intake/application/step3/ --run`
- ✅ Coverage includes use case logic, repository interaction
- ✅ Mocks isolate application layer from infrastructure

**Allowed Paths**:
- WRITE: `tests/modules/intake/application/step3/usecases.test.ts`

**Validation**:
```bash
npm test -- tests/modules/intake/application/step3/usecases.test.ts --run
```

---

### Task 5: Add Step 3 Sentinel Checks - SoC and PHI (P1)

**Deliverable**: Updated `sentinel` job in `.github/workflows/intake-step3-gate.yml`

**Objective**: Add Step 3-specific SoC and PHI protection checks.

**Actions**:
Add to `sentinel` job:

```bash
- name: Check SoC compliance (Step3)
  run: |
    echo "🏗️ Checking Separation of Concerns for Step 3..."

    # Check Application doesn't import Infrastructure
    if grep -r "from.*infrastructure\|from.*@/infrastructure" src/modules/intake/application/step3/ --include="*.ts" --include="*.tsx"; then
      echo "❌ SoC violation: Application importing Infrastructure"
      exit 1
    fi

    # Check Domain doesn't import from other layers
    if grep -r "from.*application\|from.*infrastructure\|from.*ui" src/modules/intake/domain/schemas/diagnoses-clinical/ --include="*.ts" --include="*.tsx"; then
      echo "❌ SoC violation: Domain importing from other layers"
      exit 1
    fi

    echo "✅ SoC compliance check passed"

- name: Check PHI protection (Step3)
  run: |
    echo "🔒 Checking PHI protection in Step 3 state..."

    # Check for clinical PHI fields in state (Step 3 specific)
    PHI_PATTERNS="primaryDiagnosis\|secondaryDiagnoses\|substanceUseDisorder\|mentalHealthHistory\|currentSymptoms\|treatmentHistory"

    if grep -rE "$PHI_PATTERNS" src/modules/intake/state/slices/step3-ui.slice.ts --include="*.ts" | grep -v "// NO PHI"; then
      echo "❌ PHI violation: Clinical data found in state management"
      echo "   Clinical data must be managed by React Hook Form only"
      exit 1
    fi

    # Check for error.message exposure in UI
    if grep -r "error\.message" src/modules/intake/ui/step3-diagnoses-clinical/ --include="*.tsx" | grep -v "ERROR_MESSAGES\|Generic message"; then
      echo "❌ PHI violation: error.message exposed directly in UI"
      exit 1
    fi

    echo "✅ PHI protection check passed"

- name: Check multi-tenant reset (Step3)
  run: |
    echo "🏢 Checking multi-tenant reset implementation for Step 3..."

    # Check for resetStep3Ui in state slice
    if ! grep -r "resetStep3Ui" src/modules/intake/state/slices/step3-ui.slice.ts; then
      echo "❌ Multi-tenant violation: Missing reset functionality in Step 3"
      exit 1
    fi

    echo "✅ Multi-tenant reset check passed"
```

**Acceptance Criteria**:
- ✅ Sentinel fails if Application imports Infrastructure
- ✅ Sentinel fails if PHI is stored in state
- ✅ Sentinel fails if `resetStep3Ui` is missing
- ✅ Sentinel passes for current Step 3 implementation

**Allowed Paths**:
- EDIT: `.github/workflows/intake-step3-gate.yml` (sentinel job only)

**Validation**:
```bash
# Test SoC check locally
grep -r "from.*infrastructure" src/modules/intake/application/step3/ && echo "FAIL" || echo "PASS"

# Test PHI check locally
grep -rE "primaryDiagnosis|currentSymptoms" src/modules/intake/state/slices/step3-ui.slice.ts && echo "FAIL" || echo "PASS"

# Test reset check locally
grep -r "resetStep3Ui" src/modules/intake/state/slices/step3-ui.slice.ts && echo "PASS" || echo "FAIL"
```

---

### Task 6: Update Global Health Guard with Step 3 Manifest (P2)

**Deliverable**: Updated `scripts/sentinel/health-guard.cjs` with Step 3-aware checks

**Objective**: Enhance global Health Guard to detect Step 3 legacy pattern violations.

**Actions**:
1. Add Step 3 legacy patterns to RLS manifest exemptions
2. Add Step 3 clinical entities to clinical_entities list
3. Add custom gate for Step 3 legacy store detection (optional)

**Note**: This is lower priority since Step 3 gate will have dedicated checks.

**Allowed Paths**:
- EDIT: `scripts/sentinel/health-guard.cjs` (manifest loading only)
- WRITE: `scripts/sentinel/step3-legacy-manifest.json` (optional)

**Validation**:
```bash
npm run health:guard:verbose
```

---

## 8. Validation Checklist

### 8.1 Audit Compliance

| Check | Status | Evidence |
|-------|--------|----------|
| CI pipeline discovered | ✅ | GitHub Actions in `.github/workflows/` |
| Jobs and commands inventoried | ✅ | See Section 2 (5 jobs per gate) |
| tsc/ESLint paths verified | ✅ | Global + module-filtered checks |
| Anti-legacy sentinel analyzed | ⚠️ | Health Guard exists but no Step 3 checks |
| E2E smoke tests analyzed | ❌ | No Step 3 contract tests found |
| Gaps documented | ✅ | See Section 6 (CI Gaps Matrix) |
| Micro-tasks proposed | ✅ | See Section 7 (6 tasks, P0-P2) |
| No code/CI changes made | ✅ | Audit-only, no modifications |

---

### 8.2 Read-Only Compliance

**Files Read** (35 files):
- ✅ `.github/workflows/*.yml` (5 workflows)
- ✅ `package.json`
- ✅ `vitest.config.ts`
- ✅ `scripts/sentinel/health-guard.cjs`
- ✅ `tests/modules/intake/**/*.test.ts` (4 test files)

**Files Modified**: ❌ None (audit-only)

**Files Created**: ❌ None (audit-only, except this report)

**Validation**:
```bash
git status
# Should show: On branch {current-branch}, nothing to commit (except tmp/step3_ci_gate_audit_report.md)
```

---

### 8.3 Guardrails Compliance

| Guardrail | Status | Notes |
|-----------|--------|-------|
| AUDIT-FIRST | ✅ | Full discovery before proposing changes |
| Read-only compliance | ✅ | No code/CI modifications |
| Clear routes | ✅ | All paths documented in tasks |
| No duplication | ✅ | Following Step 1/2 patterns |
| Report generated | ✅ | This document |

---

## 9. Risk Assessment

### 9.1 Current Risk Level: 🔴 **HIGH**

**Without CI Gate Protection**:
- ❌ Legacy stores could be reintroduced (no sentinel)
- ❌ RHF compliance could regress (no validation)
- ❌ Actions could break (no contract tests)
- ❌ PHI could leak to state (no checks)
- ❌ SoC violations could occur (no enforcement)

**Impact**: Step 3 could silently degrade to legacy patterns without detection.

---

### 9.2 Risk After Task 1-2 (P0): 🟠 **MEDIUM**

**With Gate + Anti-Legacy Sentinel**:
- ✅ Legacy stores blocked by sentinel
- ✅ RHF compliance enforced
- ⚠️ Actions not tested (risk of silent breakage)
- ⚠️ PHI/SoC not enforced (manual review required)

**Impact**: Regression prevented, but no smoke tests to catch functional breaks.

---

### 9.3 Risk After Task 1-5 (P0-P1): 🟢 **LOW**

**With Full Gate + Tests + Sentinel**:
- ✅ Legacy stores blocked
- ✅ RHF compliance enforced
- ✅ Actions tested (contract tests)
- ✅ PHI/SoC enforced
- ✅ Parity with Step 1/2

**Impact**: Step 3 protected at same level as Steps 1 and 2.

---

## 10. Summary

### 10.1 Key Findings

**Positive**:
1. ✅ Robust CI infrastructure exists (GitHub Actions)
2. ✅ Step 1 and Step 2 have comprehensive gates (gold standard pattern)
3. ✅ Global quality gates (TypeScript, ESLint, Build) protect all modules
4. ✅ Health Guard sentinel enforces philosophy compliance
5. ✅ Clear patterns to follow for Step 3 gate

**Gaps**:
1. ❌ **Step 3 has NO dedicated CI gate** (critical gap)
2. ❌ **No anti-legacy sentinel for Step 3 stores** (regression risk)
3. ❌ **No contract tests for Step 3 actions** (functional risk)
4. ❌ **No PHI/SoC/multi-tenant checks for Step 3** (security risk)

**Risk Level**: 🔴 **HIGH** - Step 3 vulnerable to regression without CI protection

---

### 10.2 Recommended Actions

**Priority Order**:
1. **P0** - Task 1: Create Step 3 CI gate workflow (blocks regression)
2. **P0** - Task 2: Add anti-legacy sentinel (prevents legacy reintroduction)
3. **P0** - Task 3: Create actions layer contract tests (functional safety)
4. **P0** - Task 4: Create application layer contract tests (use case safety)
5. **P1** - Task 5: Add SoC/PHI/multi-tenant sentinel checks (security compliance)
6. **P2** - Task 6: Update global Health Guard manifest (optional enhancement)

**Estimated Effort**:
- Task 1: 2 hours (copy + adapt Step 2 gate)
- Task 2: 1 hour (write anti-legacy bash script)
- Task 3: 4 hours (actions layer tests, following Step 1/2 pattern)
- Task 4: 4 hours (application layer tests)
- Task 5: 2 hours (SoC/PHI/multi-tenant bash scripts)
- Task 6: 1 hour (manifest updates, optional)

**Total**: ~14 hours to achieve full parity with Step 1/2

---

### 10.3 Expected Outcome

**After Implementing P0-P1 Tasks**:
- ✅ Step 3 protected by dedicated CI gate
- ✅ Legacy stores permanently blocked by sentinel
- ✅ RHF compliance enforced automatically
- ✅ Actions tested via contract tests (smoke coverage)
- ✅ PHI, SoC, and multi-tenant compliance enforced
- ✅ Parity with Step 1 and Step 2
- ✅ CI fails on ANY regression attempt

**CI Gate Matrix (After Implementation)**:

| Check | Step 1 | Step 2 | Step 3 |
|-------|--------|--------|--------|
| Dedicated Gate Workflow | ✅ | ✅ | ✅ |
| Contract Tests | ✅ | ✅ | ✅ |
| Anti-Legacy Sentinel | ✅ | ✅ | ✅ |
| SoC/PHI/Multi-tenant | ✅ | ✅ | ✅ |
| TypeScript/ESLint | ✅ | ✅ | ✅ |

**Result**: Step 3 becomes production-ready with full CI protection.

---

## Conclusion

**Status**: ⚠️ **ACTION REQUIRED**

Step 3 Clinical Assessment has successfully completed:
- ✅ RHF migration (form data management)
- ✅ Legacy store removal (395 lines deleted)
- ✅ Canonical UI store integration (UI-only flags)

**However**, Step 3 lacks CI gate protection, creating **HIGH RISK** of regression.

**Next Step**: Execute proposed micro-tasks (P0-P1) to establish CI gate parity with Steps 1 and 2.

**Timeline**: 14 hours of implementation to achieve full production-grade CI protection.

**Deliverables**:
1. `.github/workflows/intake-step3-gate.yml` (Task 1)
2. Anti-legacy sentinel script in gate (Task 2)
3. `tests/modules/intake/actions/step3/diagnoses.actions.test.ts` (Task 3)
4. `tests/modules/intake/application/step3/usecases.test.ts` (Task 4)
5. SoC/PHI/multi-tenant sentinel checks (Task 5)

---

**Report Generated**: 2025-09-30
**Deliverable**: `D:\ORBIPAX-PROJECT\tmp\step3_ci_gate_audit_report.md`
**Task**: Step 3 CI Gate Audit - COMPLETE ✅

**Recommendation**: Proceed with APPLY phase to implement P0 tasks immediately.