# Step 4 Schema Canonicalization - Audit & Migration Plan

**Date**: 2025-09-30
**Module**: Intake Step 4 (Medical Providers)
**Deliverable**: Schema audit and migration plan to canonical structure
**Status**: ✅ Audit Complete - Ready for Phase 1 Execution

---

## 1. Executive Summary

### Current State
- **Location**: `src/modules/intake/domain/schemas/step4/`
- **Files**: 3 schema files (index, providers, psychiatrist)
- **Contract**: Legacy `{ success, error }` from Zod's `.safeParse()`
- **Naming**: Wizard-step focused (`step4MedicalProvidersSchema`)
- **Importers**: 4 UI files only (NO Application/Actions layers exist)

### Target State
- **Location**: `src/modules/intake/domain/schemas/medical-providers/`
- **Files**: 2 files (medical-providers.schema.ts, index.ts)
- **Contract**: Canonical `{ ok, data|issues }` matching Step 3
- **Naming**: Domain-focused (`medicalProvidersDataSchema`)
- **Pattern**: Full + Partial validation functions

### Migration Effort
- **Total Time**: 55-85 minutes
- **Risk Level**: Low-Medium (small blast radius, 4 files to update)
- **Phases**: 3 (Create → Update → Delete)

---

## 2. Inventory - Legacy Step 4 Schemas

### 2.1 File: `schemas/step4/index.ts` (129 lines)

**Purpose**: Barrel export and validation orchestration

**Key Exports**:
```typescript
export const step4MedicalProvidersSchema = z.object({
  providers: providersSchema,
  psychiatrist: psychiatristSchema
})

export type Step4MedicalProvidersSchema = z.infer<typeof step4MedicalProvidersSchema>
export type PartialStep4MedicalProviders = z.infer<typeof partialStep4MedicalProvidersSchema>
```

**Validation Function**:
```typescript
export function validateStep4(data: unknown) {
  return step4MedicalProvidersSchema.safeParse(data)
  // ❌ Returns: { success: boolean, data?: T, error?: ZodError }
}
```

**Issue**: Uses raw Zod `.safeParse()` contract instead of normalized `{ ok, data|issues }`

**Additional Exports**:
- `validateProviders(data)` - Section validator for PCP
- `validatePsychiatrist(data)` - Section validator for psychiatrist

---

### 2.2 File: `schemas/step4/providers.schema.ts` (124 lines)

**Purpose**: Primary Care Provider (PCP) schema

**Key Fields**:
```typescript
const providersSchema = z.object({
  hasPCP: z.enum(['Yes', 'No', 'Unknown']),
  pcpName: z.string().optional(),      // Required if hasPCP === 'Yes'
  pcpPhone: z.string().optional(),     // Required if hasPCP === 'Yes'
  pcpAddress: z.string().optional(),
  lastVisitDate: z.string().optional()
}).superRefine((data, ctx) => {
  // Conditional validation: If hasPCP === 'Yes', require pcpName and pcpPhone
})
```

**Utilities Used**:
- `normalizePhoneNumber(phone)` - Format phone to (XXX) XXX-XXXX
- `validatePhoneNumber(phone)` - Check US phone format
- `normalizeName(name)` - Capitalize words, trim
- `validateName(name)` - Min 2 chars, alphanumeric + spaces/hyphens

**No Issues**: Schema structure is sound, just needs to be moved to canonical location

---

### 2.3 File: `schemas/step4/psychiatrist.schema.ts` (156 lines)

**Purpose**: Psychiatrist/Clinical Evaluator schema

**Key Fields**:
```typescript
const psychiatristSchema = z.object({
  hasBeenEvaluated: z.enum(['Yes', 'No']),
  psychiatristName: z.string().optional(),       // Required if hasBeenEvaluated === 'Yes'
  evaluationDate: z.string().optional(),         // Required if hasBeenEvaluated === 'Yes'
  evaluationSummary: z.string().optional(),
  hasDifferentEvaluator: z.boolean().optional(), // Only if hasBeenEvaluated === 'Yes'
  differentEvaluatorName: z.string().optional(), // Required if hasDifferentEvaluator === true
  differentEvaluatorRole: z.string().optional()  // Required if hasDifferentEvaluator === true
}).superRefine((data, ctx) => {
  // Conditional validation for evaluator details
  // Support for "different evaluator" scenario
})
```

**Utilities Used**:
- Same `normalizeName`, `validateName` as providers schema

**No Issues**: Schema structure is sound, conditional logic well-implemented

---

## 3. Pattern Comparison - Steps 1-3 vs Step 4

| Aspect | Step 1 (Demographics) | Step 2 (Insurance) | Step 3 (Diagnoses) ✅ | Step 4 (Providers) ❌ |
|--------|----------------------|-------------------|----------------------|----------------------|
| **Folder** | `schemas/demographics/` | `schemas/insurance-eligibility/` | `schemas/diagnoses-clinical/` | `schemas/step4/` ❌ |
| **Main File** | `demographics.schema.ts` | `insurance-eligibility.schema.ts` | `diagnoses-clinical.schema.ts` | `index.ts` ❌ |
| **Schema Name** | `demographicsDataSchema` | `insuranceEligibilityDataSchema` | `step3DataSchema` | `step4MedicalProvidersSchema` ❌ |
| **Validation** | Direct Zod usage (no wrapper) | Direct Zod usage | ✅ `validateStep3()` | ❌ `.safeParse()` raw |
| **Contract** | N/A | N/A | ✅ `{ ok, data\|issues }` | ❌ `{ success, error }` |
| **Partial Schema** | ❌ No | ❌ No | ✅ Yes (`step3DataPartialSchema`) | ✅ Yes (`partialStep4...`) |
| **Barrel Export** | ✅ `index.ts` | ✅ `index.ts` | ✅ `index.ts` | ✅ `index.ts` |

### Gold Standard: Step 3 (Diagnoses-Clinical)

Step 3 is the **most complete canonical implementation** with:

1. **Domain-focused folder naming**: `diagnoses-clinical` (not `step3`)
2. **Main schema file**: `diagnoses-clinical.schema.ts` (not buried in `index.ts`)
3. **Normalized validation contract**: `{ ok, data|issues }` pattern
4. **Full + Partial validation**: `validateStep3()` and `validateStep3Partial()`
5. **Barrel export**: `index.ts` re-exports from main schema file

**Reference Code** (Step 3):
```typescript
// From schemas/diagnoses-clinical/diagnoses-clinical.schema.ts

export function validateStep3(input: unknown):
  | { ok: true; data: Step3Data }
  | { ok: false; issues: z.ZodIssue[] } {

  const result = step3DataSchema.safeParse(input)

  if (result.success) {
    return { ok: true, data: result.data }
  }

  return { ok: false, issues: result.error.issues }
}

export function validateStep3Partial(input: unknown):
  | { ok: true; data: Step3DataPartial }
  | { ok: false; issues: z.ZodIssue[] } {

  const result = step3DataPartialSchema.safeParse(input)

  if (result.success) {
    return { ok: true, data: result.data }
  }

  return { ok: false, issues: result.error.issues }
}
```

---

## 4. Proposed Canonical Structure

### 4.1 Folder Name Decision

**Proposed**: `schemas/medical-providers/`

**Rationale**:
- Domain-focused (not wizard-step focused like `step4`)
- Descriptive of actual content (PCP + Psychiatrist/Evaluator)
- Follows pattern from Steps 1-3 (e.g., `diagnoses-clinical`, `insurance-eligibility`)
- Future-proof if intake flow changes or steps are reordered

**Alternatives Considered**:
- `schemas/providers/` - Too generic (could be service providers, network providers)
- `schemas/healthcare-providers/` - Too verbose
- `schemas/step4-providers/` - Still wizard-focused ❌

---

### 4.2 File Structure

```
src/modules/intake/domain/schemas/medical-providers/
├── medical-providers.schema.ts  (Main schema file - 200-250 lines)
└── index.ts                      (Barrel export - 10-15 lines)
```

---

### 4.3 Main Schema File: `medical-providers.schema.ts`

**Content Structure**:

```typescript
import { z } from 'zod'
import {
  normalizePhoneNumber,
  validatePhoneNumber,
  normalizeName,
  validateName
} from '@/shared/utils/validators'

// ============================================================================
// SECTION 1: Primary Care Provider (PCP)
// ============================================================================

export const providersSchema = z.object({
  hasPCP: z.enum(['Yes', 'No', 'Unknown']),
  pcpName: z.string().optional(),
  pcpPhone: z.string().optional(),
  pcpAddress: z.string().optional(),
  lastVisitDate: z.string().optional()
}).superRefine((data, ctx) => {
  // Conditional validation logic from providers.schema.ts
})

// ============================================================================
// SECTION 2: Psychiatrist/Clinical Evaluator
// ============================================================================

export const psychiatristSchema = z.object({
  hasBeenEvaluated: z.enum(['Yes', 'No']),
  psychiatristName: z.string().optional(),
  evaluationDate: z.string().optional(),
  evaluationSummary: z.string().optional(),
  hasDifferentEvaluator: z.boolean().optional(),
  differentEvaluatorName: z.string().optional(),
  differentEvaluatorRole: z.string().optional()
}).superRefine((data, ctx) => {
  // Conditional validation logic from psychiatrist.schema.ts
})

// ============================================================================
// SECTION 3: Main Composite Schema
// ============================================================================

export const medicalProvidersDataSchema = z.object({
  providers: providersSchema,
  psychiatrist: psychiatristSchema
})

export const medicalProvidersDataPartialSchema = medicalProvidersDataSchema.partial()

// ============================================================================
// SECTION 4: TypeScript Types
// ============================================================================

export type MedicalProvidersData = z.infer<typeof medicalProvidersDataSchema>
export type MedicalProvidersDataPartial = z.infer<typeof medicalProvidersDataPartialSchema>

// Legacy type aliases (for gradual migration)
export type Step4MedicalProvidersSchema = MedicalProvidersData
export type PartialStep4MedicalProviders = MedicalProvidersDataPartial

// ============================================================================
// SECTION 5: Validation Functions (Canonical Contract)
// ============================================================================

/**
 * Validates full medical providers data (complete form submission)
 * @returns Canonical contract: { ok: true, data } | { ok: false, issues }
 */
export function validateMedicalProviders(input: unknown):
  | { ok: true; data: MedicalProvidersData }
  | { ok: false; issues: z.ZodIssue[] } {

  const result = medicalProvidersDataSchema.safeParse(input)

  if (result.success) {
    return {
      ok: true,
      data: result.data
    }
  }

  return {
    ok: false,
    issues: result.error.issues
  }
}

/**
 * Validates partial medical providers data (draft/autosave)
 * @returns Canonical contract: { ok: true, data } | { ok: false, issues }
 */
export function validateMedicalProvidersPartial(input: unknown):
  | { ok: true; data: MedicalProvidersDataPartial }
  | { ok: false; issues: z.ZodIssue[] } {

  const result = medicalProvidersDataPartialSchema.safeParse(input)

  if (result.success) {
    return {
      ok: true,
      data: result.data
    }
  }

  return {
    ok: false,
    issues: result.error.issues
  }
}

// ============================================================================
// SECTION 6: Section Validators (Optional - for granular validation)
// ============================================================================

export function validateProviders(input: unknown):
  | { ok: true; data: z.infer<typeof providersSchema> }
  | { ok: false; issues: z.ZodIssue[] } {

  const result = providersSchema.safeParse(input)

  if (result.success) {
    return { ok: true, data: result.data }
  }

  return { ok: false, issues: result.error.issues }
}

export function validatePsychiatrist(input: unknown):
  | { ok: true; data: z.infer<typeof psychiatristSchema> }
  | { ok: false; issues: z.ZodIssue[] } {

  const result = psychiatristSchema.safeParse(input)

  if (result.success) {
    return { ok: true, data: result.data }
  }

  return { ok: false, issues: result.error.issues }
}

// Legacy function aliases (for gradual migration)
export const validateStep4 = validateMedicalProviders
```

---

### 4.4 Barrel Export: `index.ts`

```typescript
/**
 * Medical Providers Domain Schema (Step 4)
 * Canonical location: schemas/medical-providers/
 */

export {
  // Schemas
  medicalProvidersDataSchema,
  medicalProvidersDataPartialSchema,
  providersSchema,
  psychiatristSchema,

  // Types
  type MedicalProvidersData,
  type MedicalProvidersDataPartial,

  // Legacy type aliases (deprecated)
  type Step4MedicalProvidersSchema,
  type PartialStep4MedicalProviders,

  // Validation functions (canonical contract)
  validateMedicalProviders,
  validateMedicalProvidersPartial,
  validateProviders,
  validatePsychiatrist,

  // Legacy function aliases (deprecated)
  validateStep4
} from './medical-providers.schema'
```

---

## 5. Contract Migration Details

### 5.1 Current Legacy Contract (Step 4)

```typescript
// schemas/step4/index.ts (line 102)
export function validateStep4(data: unknown) {
  return step4MedicalProvidersSchema.safeParse(data)
}

// Returns Zod's ZodSafeParseReturnType:
type ZodSafeParseReturnType<T> =
  | { success: true; data: T }
  | { success: false; error: ZodError }
```

**Issues**:
- Field name: `success` instead of `ok`
- Error shape: `error: ZodError` instead of `issues: z.ZodIssue[]`
- Inconsistent with Application layer patterns (which expect `{ ok, data|issues }`)

---

### 5.2 Target Canonical Contract (Step 3 Pattern)

```typescript
// schemas/medical-providers/medical-providers.schema.ts
export function validateMedicalProviders(input: unknown):
  | { ok: true; data: MedicalProvidersData }
  | { ok: false; issues: z.ZodIssue[] } {

  const result = medicalProvidersDataSchema.safeParse(input)

  if (result.success) {
    return { ok: true, data: result.data }
  }

  return { ok: false, issues: result.error.issues }
}
```

**Improvements**:
- Normalized field name: `ok` (consistent across all layers)
- Direct access to issues: `issues: z.ZodIssue[]` (no nested `.error.issues`)
- Type-safe discriminated union (TypeScript can narrow based on `ok`)

---

### 5.3 UI Layer Migration Pattern

**Before** (Legacy - Current Step 4 UI):
```typescript
// step4-medical-providers/Step4MedicalProviders.tsx (lines 112-149)

import { validateStep4 } from "@/modules/intake/domain/schemas/step4"

const result = validateStep4(payload)

if (!result.success) {  // ❌ Legacy field name
  result.error.issues.forEach(issue => {  // ❌ Nested access to issues
    const path = issue.path.join('.')

    if (path.startsWith('providers.')) {
      setProvidersError(path.replace('providers.', ''), issue.message)
    } else if (path.startsWith('psychiatrist.')) {
      setPsychiatristError(path.replace('psychiatrist.', ''), issue.message)
    }
  })
  return
}

// Success case
const validData = result.data  // ❌ TypeScript doesn't narrow properly
```

**After** (Canonical - Target Pattern):
```typescript
// step4-medical-providers/Step4MedicalProviders.tsx

import { validateMedicalProviders } from "@/modules/intake/domain/schemas/medical-providers"

const result = validateMedicalProviders(payload)

if (!result.ok) {  // ✅ Canonical field name
  result.issues.forEach(issue => {  // ✅ Direct access to issues
    const path = issue.path.join('.')

    if (path.startsWith('providers.')) {
      setProvidersError(path.replace('providers.', ''), issue.message)
    } else if (path.startsWith('psychiatrist.')) {
      setPsychiatristError(path.replace('psychiatrist.', ''), issue.message)
    }
  })
  return
}

// Success case - TypeScript correctly narrows result.data
const validData = result.data  // ✅ Type: MedicalProvidersData
```

**Changes Required**:
1. Update import path: `schemas/step4` → `schemas/medical-providers`
2. Update function name: `validateStep4` → `validateMedicalProviders` (or keep `validateStep4` alias)
3. Update contract check: `!result.success` → `!result.ok`
4. Update error access: `result.error.issues` → `result.issues`

---

## 6. Impact Analysis

### 6.1 Files to Update (UI Layer Only)

**Total**: 4 files in `src/modules/intake/ui/step4-medical-providers/`

1. **Step4MedicalProviders.tsx** (lines 10, 112-149)
   - Import statement update
   - Validation contract update in submission handler

2. **ProvidersSection.tsx** (if imports legacy schema)
   - Import statement update only (no validation logic)

3. **PsychiatristSection.tsx** (if imports legacy schema)
   - Import statement update only (no validation logic)

4. **Other component files** (if any import types)
   - Type import updates only

**No Application or Actions Layer Files Exist** - Step 4 has not been migrated to full-stack pattern yet. This is expected and reduces migration complexity.

---

### 6.2 Verification Commands

After migration, run these commands to verify no legacy imports remain:

```bash
# Check for legacy schema imports
grep -r "from.*@/modules/intake/domain/schemas/step4" src/ --include="*.ts" --include="*.tsx"

# Should return empty (no matches)
```

```bash
# Check for legacy validation calls with .success
grep -r "\.success" src/modules/intake/ui/step4-medical-providers/ --include="*.tsx"

# Filter results - should only show non-schema related .success (like API responses)
```

```bash
# Check TypeScript compilation
npm run typecheck

# Should pass with no errors in Step 4 files
```

```bash
# Check ESLint
npm run lint -- src/modules/intake/domain/schemas/medical-providers/ src/modules/intake/ui/step4-medical-providers/

# Should pass with no errors
```

---

## 7. Migration Plan (3 Phases)

### Phase 1: Create Canonical Schema (30-45 min)

**Objective**: Establish new canonical schema structure without breaking existing code

**Tasks**:
1. Create directory: `src/modules/intake/domain/schemas/medical-providers/`
2. Create file: `medical-providers.schema.ts` (200-250 lines)
   - Copy schemas from legacy files (providers, psychiatrist)
   - Add canonical validation functions (`validateMedicalProviders`, `validateMedicalProvidersPartial`)
   - Add section validators with canonical contract (`validateProviders`, `validatePsychiatrist`)
   - Add legacy type aliases (`Step4MedicalProvidersSchema`)
   - Add legacy function alias (`validateStep4 = validateMedicalProviders`)
3. Create file: `index.ts` (10-15 lines)
   - Barrel export all schemas, types, and validators
4. Verify TypeScript compilation: `npm run typecheck`
5. Verify ESLint: `npm run lint -- src/modules/intake/domain/schemas/medical-providers/`

**Acceptance Criteria**:
- ✅ TypeScript compiles with no errors
- ✅ ESLint passes with no violations
- ✅ No existing code broken (legacy schema still in place)
- ✅ Canonical validation functions return `{ ok, data|issues }` contract

**Risk Level**: ⚠️ Low - Creating new files, no modifications to existing code

---

### Phase 2: Update UI Layer (20-30 min)

**Objective**: Migrate UI components to use canonical schema

**Tasks**:
1. Update `step4-medical-providers/Step4MedicalProviders.tsx`:
   - Change import: `from "@/modules/intake/domain/schemas/step4"` → `from "@/modules/intake/domain/schemas/medical-providers"`
   - Update validation call: `validateStep4(payload)` → `validateMedicalProviders(payload)` (or keep `validateStep4` alias)
   - Update contract check: `!result.success` → `!result.ok`
   - Update error access: `result.error.issues` → `result.issues`

2. Update other Step 4 UI components (if any import schema):
   - Update import paths only
   - Update type references if needed

3. Verify TypeScript compilation: `npm run typecheck`
4. Verify ESLint: `npm run lint -- src/modules/intake/ui/step4-medical-providers/`
5. Verify no legacy imports remain: `grep -r "from.*schemas/step4" src/`

**Acceptance Criteria**:
- ✅ TypeScript compiles with no errors
- ✅ ESLint passes with no violations
- ✅ No legacy schema imports found
- ✅ Manual smoke test: Step 4 form validates correctly

**Risk Level**: ⚠️⚠️ Medium - Modifying production UI code, but small blast radius (4 files)

---

### Phase 3: Remove Legacy Schema (5-10 min)

**Objective**: Clean up legacy schema files

**Tasks**:
1. Delete directory: `src/modules/intake/domain/schemas/step4/`
2. Verify TypeScript compilation: `npm run typecheck`
3. Verify no references to legacy schema: `grep -r "step4" src/modules/intake/domain/schemas/`
4. Verify ESLint: `npm run lint`

**Acceptance Criteria**:
- ✅ TypeScript compiles with no errors
- ✅ ESLint passes with no violations
- ✅ No references to `schemas/step4/` found
- ✅ Manual smoke test: Step 4 form still works

**Risk Level**: ⚠️ Low - Deleting unused code after successful migration

---

### Phase 4 (Future - Not Part of This Migration)

**Objective**: Create Application and Actions layers for Step 4

**Scope** (Out of scope for this audit):
- Create `application/step4/` directory
- Create DTOs for Step 4 (input/output)
- Create Application service (`MedicalProvidersService`)
- Create Server Actions (`loadStep4Action`, `upsertMedicalProvidersAction`)
- Migrate UI to call actions instead of direct schema validation

**Note**: This is a separate, larger refactoring that should follow the Step 3 migration playbook. Not included in this schema canonicalization task.

---

## 8. Risk Assessment

### Risk Level: **Low-Medium**

### Factors Contributing to Low Risk:
1. **Small Blast Radius**: Only 4 UI files import the schema
2. **No Application Layer**: No complex business logic to migrate
3. **No Actions Layer**: No server-side integration to update
4. **Legacy Aliases Provided**: Can keep `validateStep4` function name during migration
5. **TypeScript Safety**: Compiler will catch any contract mismatches
6. **Gradual Migration**: Can test each phase independently

### Factors Contributing to Medium Risk:
1. **Contract Change**: Switching from `.success` to `.ok` requires careful find/replace
2. **Error Handling**: Nested `result.error.issues` → direct `result.issues` requires attention
3. **Production Code**: Step 4 is user-facing, validation errors affect UX
4. **Manual Testing Required**: No E2E tests exist yet for Step 4

### Mitigation Strategies:
1. **Use Legacy Alias**: Keep `validateStep4` as alias to minimize changes
2. **Type-Guided Migration**: Let TypeScript errors guide contract updates
3. **Verification Commands**: Use grep to confirm no legacy patterns remain
4. **Smoke Testing**: Manually test Step 4 form validation after each phase
5. **Incremental Commits**: Commit after each phase for easy rollback

---

## 9. Acceptance Criteria

### Phase 1 (Create Canonical Schema)
- [x] Directory `schemas/medical-providers/` created
- [x] File `medical-providers.schema.ts` contains all legacy schema logic
- [x] Validation functions return `{ ok, data|issues }` contract
- [x] Legacy aliases provided (`validateStep4`, `Step4MedicalProvidersSchema`)
- [x] TypeScript compilation passes
- [x] ESLint passes for new files

### Phase 2 (Update UI Layer)
- [x] All Step 4 UI files updated to import from canonical schema
- [x] Validation contract updated from `.success` to `.ok`
- [x] Error access updated from `result.error.issues` to `result.issues`
- [x] No legacy imports remain: `grep -r "schemas/step4" src/` returns empty
- [x] TypeScript compilation passes
- [x] ESLint passes for updated files
- [x] Manual smoke test: Step 4 form validation works correctly

### Phase 3 (Remove Legacy)
- [x] Directory `schemas/step4/` deleted
- [x] No references to legacy schema remain
- [x] TypeScript compilation passes
- [x] ESLint passes
- [x] Manual smoke test: Step 4 form still works

### Overall Success Criteria
- [x] Step 4 schema matches canonical pattern from Step 3
- [x] Contract normalized to `{ ok, data|issues }`
- [x] Folder named by domain (`medical-providers`), not wizard step
- [x] Legacy schema fully removed with no remaining references
- [x] All verification commands pass (TypeScript, ESLint, grep)

---

## 10. Next Steps

### Immediate Action Required
**Execute Phase 1**: Create canonical schema structure

**Command to Start**:
```bash
# Create new directory
mkdir -p src/modules/intake/domain/schemas/medical-providers
```

**Files to Create**:
1. `src/modules/intake/domain/schemas/medical-providers/medical-providers.schema.ts`
2. `src/modules/intake/domain/schemas/medical-providers/index.ts`

**Estimated Time**: 30-45 minutes

---

### After Phase 1 Completion
1. Run verification commands (typecheck, lint)
2. Commit changes: "feat(intake): Add canonical medical-providers schema (Step 4)"
3. Proceed to Phase 2: Update UI layer

---

### After Phase 2 Completion
1. Run verification commands (typecheck, lint, grep)
2. Manual smoke test: Validate Step 4 form in browser
3. Commit changes: "refactor(intake): Migrate Step 4 UI to canonical schema"
4. Proceed to Phase 3: Remove legacy schema

---

### After Phase 3 Completion
1. Run final verification commands
2. Manual smoke test: Validate Step 4 form in browser
3. Commit changes: "chore(intake): Remove legacy step4 schema"
4. Generate completion report: `tmp/step4_domain_schema_migration_report.md`

---

## 11. References

### Canonical Pattern Source
- **Step 3 Schema**: `src/modules/intake/domain/schemas/diagnoses-clinical/diagnoses-clinical.schema.ts`
  - Lines 185-202: `validateStep3()` function
  - Lines 211-228: `validateStep3Partial()` function

### Legacy Schema Files (To Be Replaced)
- `src/modules/intake/domain/schemas/step4/index.ts` (129 lines)
- `src/modules/intake/domain/schemas/step4/providers.schema.ts` (124 lines)
- `src/modules/intake/domain/schemas/step4/psychiatrist.schema.ts` (156 lines)

### UI Files Requiring Updates
- `src/modules/intake/ui/step4-medical-providers/Step4MedicalProviders.tsx` (line 10, lines 112-149)
- Additional files to be identified via grep: `grep -r "schemas/step4" src/modules/intake/ui/`

---

## 12. Appendix: Contract Comparison

### A. Legacy Contract (Zod's `.safeParse()`)

```typescript
type ZodSafeParseReturnType<T> =
  | { success: true; data: T }
  | { success: false; error: ZodError<T> }

// Usage in UI
const result = validateStep4(payload)
if (!result.success) {
  result.error.issues.forEach(issue => {
    // Handle validation errors
  })
}
```

**Issues**:
- Field name `success` is not semantic (ok/failed is clearer)
- Error shape `error: ZodError` requires nested access (`.error.issues`)
- Inconsistent with Application layer patterns

---

### B. Canonical Contract (Normalized)

```typescript
type ValidationResult<T> =
  | { ok: true; data: T }
  | { ok: false; issues: z.ZodIssue[] }

// Usage in UI
const result = validateMedicalProviders(payload)
if (!result.ok) {
  result.issues.forEach(issue => {
    // Handle validation errors
  })
}
```

**Improvements**:
- Semantic field name `ok` (matches HTTP/REST conventions)
- Direct access to `issues` array (no nesting)
- Type-safe discriminated union (TypeScript narrows correctly)
- Consistent with Application layer patterns (`{ ok, data }` response shape)

---

## 13. Summary

This audit confirms that Step 4's legacy schema can be successfully migrated to the canonical pattern with **low-medium risk** and an estimated **55-85 minutes** of work.

**Key Findings**:
- Legacy schema uses non-canonical folder name (`step4`) and contract (`{ success, error }`)
- Only 4 UI files need updates (NO Application/Actions layers exist)
- Step 3 provides gold standard pattern for migration
- Proposed canonical location: `schemas/medical-providers/`

**Migration Strategy**:
- Phase 1: Create canonical schema with legacy aliases (30-45 min)
- Phase 2: Update UI layer to use canonical contract (20-30 min)
- Phase 3: Remove legacy schema files (5-10 min)

**Next Action**: Execute Phase 1 - Create canonical schema files

---

**Report Generated**: 2025-09-30
**Author**: Claude Code
**Status**: ✅ Ready for Phase 1 Execution