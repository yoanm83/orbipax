# Step 4 Application Layer - ports.ts Wire to dtos.ts Report
**OrbiPax Intake Module - Medical Providers Port Integration**
**Date**: 2025-09-30
**Status**: ✅ COMPLETE

---

## 📋 Executive Summary

**Objective**: Update `application/step4/ports.ts` to import types from `./dtos.ts` and remove temporary stub definitions, achieving parity with Step 3 pattern.

**Result**: ✅ **SUCCESS** - `ports.ts` now imports canonical types from `dtos.ts`, temporary stubs removed, TypeScript and ESLint pass.

**Key Changes**:
- ✅ Added import statement for `Step4InputDTO`, `Step4OutputDTO`, `RepositoryResponse` from `./dtos`
- ✅ Removed 54 lines of temporary stub types (lines 12-63)
- ✅ Removed TODO comments about dtos.ts creation
- ✅ Fixed mock repository to use proper default values (not empty objects)
- ✅ Zero TypeScript errors
- ✅ Zero ESLint errors
- ✅ No API changes to `MedicalProvidersRepository` interface

---

## 🎯 Task Scope

### Requirements Met
1. ✅ Import types from `./dtos` (Step4InputDTO, Step4OutputDTO, RepositoryResponse)
2. ✅ Remove temporary stub definitions (interfaces and types)
3. ✅ Remove TODO comments related to dtos.ts
4. ✅ Maintain exact same API for `MedicalProvidersRepository` interface
5. ✅ Fix mock repository to work with concrete types
6. ✅ Ensure TypeScript strict mode passes
7. ✅ Ensure ESLint passes
8. ✅ Follow Step 3 pattern exactly

### Constraints Followed
- **No API Changes**: `MedicalProvidersRepository` interface unchanged
- **SoC**: Port still only defines contract, no implementation logic added
- **Minimal Changes**: Only import and type definition changes, no business logic
- **Pattern Consistency**: Matches Step 3 ports.ts structure exactly

---

## 📂 File Modified

### `src/modules/intake/application/step4/ports.ts`

**Before**: 206 lines (with temporary stubs)
**After**: 159 lines (importing from dtos.ts)
**Net Change**: -47 lines (-23%)

---

## 🔍 Detailed Changes

### Change 1: Added Import Statement (Lines 12-16)

**Before** (Lines 12-17):
```typescript
// TODO(next task - dtos.ts): Import these types from './dtos' once created
// import {
//   type Step4InputDTO,
//   type Step4OutputDTO,
//   type RepositoryResponse
// } from './dtos'
```

**After** (Lines 12-16):
```typescript
import {
  type Step4InputDTO,
  type Step4OutputDTO,
  type RepositoryResponse
} from './dtos'
```

**Rationale**:
- Uncommented the import that was prepared in the first task
- Now imports real types from canonical `dtos.ts` file
- Matches Step 3 pattern exactly (same import structure)

---

### Change 2: Removed Temporary Type Definitions (Lines 19-63)

**Before** (54 lines removed):
```typescript
// =================================================================
// TEMPORARY TYPE DEFINITIONS (will move to dtos.ts in next task)
// =================================================================

/**
 * Temporary stub for Step4InputDTO
 * Will be replaced by import from './dtos' in next task
 */
export interface Step4InputDTO {
  providers?: unknown
  psychiatrist?: unknown
}

/**
 * Temporary stub for Step4OutputDTO
 * Will be replaced by import from './dtos' in next task
 */
export interface Step4OutputDTO {
  sessionId: string
  organizationId: string
  data: {
    providers: unknown
    psychiatrist: unknown
  }
  lastModified?: string
  completedAt?: string
}

/**
 * Repository response contract
 * Generic response type for all repository operations
 * Will be moved to './dtos' in next task
 */
export type RepositoryResponse<T> =
  | {
      ok: true
      data: T
    }
  | {
      ok: false
      error: {
        code: string
        message?: string // Generic message only, no PHI
      }
    }
```

**After**:
```typescript
// (section removed entirely)
```

**Rationale**:
- Temporary stubs no longer needed (types imported from dtos.ts)
- Eliminates duplicate type definitions
- Reduces file length by 54 lines
- Removes TODO comments that are now obsolete

---

### Change 3: Fixed Mock Repository Default Values (Lines 112-117)

**Before**:
```typescript
data: {
  providers: input.providers ?? {},
  psychiatrist: input.psychiatrist ?? {}
},
```

**After**:
```typescript
data: {
  providers: input.providers ?? {
    hasPCP: 'Unknown'
  },
  psychiatrist: input.psychiatrist ?? {
    hasBeenEvaluated: 'No'
  }
},
```

**Rationale**:
- Empty objects `{}` don't satisfy `ProvidersDTO` and `PsychiatristDTO` (required fields)
- `ProvidersDTO` requires `hasPCP: 'Yes' | 'No' | 'Unknown'`
- `PsychiatristDTO` requires `hasBeenEvaluated: 'Yes' | 'No'`
- Now uses safe defaults ('Unknown', 'No') when input is not provided
- TypeScript now passes without errors

---

## 📊 Pseudo-Diff Summary

```diff
File: src/modules/intake/application/step4/ports.ts

@@ Lines 12-16 @@
- // TODO(next task - dtos.ts): Import these types from './dtos' once created
- // import {
- //   type Step4InputDTO,
- //   type Step4OutputDTO,
- //   type RepositoryResponse
- // } from './dtos'
+ import {
+   type Step4InputDTO,
+   type Step4OutputDTO,
+   type RepositoryResponse
+ } from './dtos'

@@ Lines 19-63 (REMOVED) @@
- // =================================================================
- // TEMPORARY TYPE DEFINITIONS (will move to dtos.ts in next task)
- // =================================================================
-
- /**
-  * Temporary stub for Step4InputDTO
-  * Will be replaced by import from './dtos' in next task
-  */
- export interface Step4InputDTO {
-   providers?: unknown
-   psychiatrist?: unknown
- }
-
- /**
-  * Temporary stub for Step4OutputDTO
-  * Will be replaced by import from './dtos' in next task
-  */
- export interface Step4OutputDTO {
-   sessionId: string
-   organizationId: string
-   data: {
-     providers: unknown
-     psychiatrist: unknown
-   }
-   lastModified?: string
-   completedAt?: string
- }
-
- /**
-  * Repository response contract
-  * Generic response type for all repository operations
-  * Will be moved to './dtos' in next task
-  */
- export type RepositoryResponse<T> =
-   | {
-       ok: true
-       data: T
-     }
-   | {
-       ok: false
-       error: {
-         code: string
-         message?: string // Generic message only, no PHI
-       }
-     }

@@ Lines 112-117 (MockMedicalProvidersRepository.save) @@
       data: {
-        providers: input.providers ?? {},
-        psychiatrist: input.psychiatrist ?? {}
+        providers: input.providers ?? {
+          hasPCP: 'Unknown'
+        },
+        psychiatrist: input.psychiatrist ?? {
+          hasBeenEvaluated: 'No'
+        }
       },
```

**Summary**:
- **Lines Added**: 8 (import + default values)
- **Lines Removed**: 55 (temporary stubs + TODO comments)
- **Net Change**: -47 lines (-23% reduction)

---

## ✅ Validation Results

### TypeScript Compilation

**Command**: `npx tsc --noEmit src/modules/intake/application/step4/ports.ts`

**Result**: ✅ **PASS** - No TypeScript errors

**Before Fix**: 2 errors (empty objects don't satisfy DTO interfaces)
```
error TS2322: Type 'ProvidersDTO | {}' is not assignable to type 'ProvidersDTO'.
  Property 'hasPCP' is missing in type '{}' but required in type 'ProvidersDTO'.
error TS2322: Type 'PsychiatristDTO | {}' is not assignable to type 'PsychiatristDTO'.
  Property 'hasBeenEvaluated' is missing in type '{}' but required in type 'PsychiatristDTO'.
```

**After Fix**: 0 errors (proper default values provided)

---

### ESLint Validation

**Command**: `npx eslint src/modules/intake/application/step4/ports.ts`

**Result**: ✅ **PASS** - No ESLint errors or warnings

**Checks Passed**:
- No unused imports
- No unused variables
- Import order correct (type-only import from relative path)
- Consistent formatting
- No TODO comments without context
- No console statements

---

### API Consistency Check

**✅ `MedicalProvidersRepository` Interface Unchanged**:

**Before and After** (Identical):
```typescript
export interface MedicalProvidersRepository {
  findBySession(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<Step4OutputDTO>>

  save(
    sessionId: string,
    organizationId: string,
    input: Step4InputDTO
  ): Promise<RepositoryResponse<{ sessionId: string }>>

  exists(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<{ exists: boolean }>>

  delete?(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<{ deleted: boolean }>>
}
```

**Verification**:
- ✅ Method names unchanged
- ✅ Parameter names unchanged
- ✅ Parameter types unchanged (now using canonical types from dtos.ts)
- ✅ Return types unchanged
- ✅ JSDoc comments unchanged
- ✅ Optional `delete?` still optional

---

### Pattern Consistency with Step 3

| Aspect | Step 3 (Diagnoses) | Step 4 (Medical Providers) | Match |
|--------|-------------------|---------------------------|-------|
| **Import Statement** | `import { type Step3InputDTO, ... } from './dtos'` | `import { type Step4InputDTO, ... } from './dtos'` | ✅ |
| **Import Location** | Lines 12-16 | Lines 12-16 | ✅ |
| **Temporary Stubs** | None (always imported) | None (removed in this task) | ✅ |
| **Port Interface** | `DiagnosesRepository` | `MedicalProvidersRepository` | ✅ |
| **Mock Implementation** | `MockDiagnosesRepository` | `MockMedicalProvidersRepository` | ✅ |
| **File Structure** | Import → Port → Mock | Import → Port → Mock | ✅ |

---

## 🔍 Type Safety Improvements

### Before (Temporary Stubs)

**Problem**: Types used `unknown` for data fields
```typescript
export interface Step4InputDTO {
  providers?: unknown  // ❌ No type safety
  psychiatrist?: unknown  // ❌ No type safety
}
```

**Impact**:
- No IntelliSense in IDE
- No compile-time validation
- Can assign any value (no safety)

---

### After (Canonical Types)

**Solution**: Types use concrete interfaces from dtos.ts
```typescript
// Imported from dtos.ts
export interface Step4InputDTO {
  providers?: ProvidersDTO  // ✅ Fully typed
  psychiatrist?: PsychiatristDTO  // ✅ Fully typed
}

export interface ProvidersDTO {
  hasPCP: 'Yes' | 'No' | 'Unknown'
  pcpName?: string
  pcpPhone?: string
  pcpPractice?: string
  pcpAddress?: string
  authorizedToShare?: boolean
}

export interface PsychiatristDTO {
  hasBeenEvaluated: 'Yes' | 'No'
  psychiatristName?: string
  evaluationDate?: string
  clinicName?: string
  notes?: string
  differentEvaluator?: boolean
  evaluatorName?: string
  evaluatorClinic?: string
}
```

**Benefits**:
- ✅ Full IntelliSense in IDE
- ✅ Compile-time validation
- ✅ Type safety (can't assign wrong types)
- ✅ Autocomplete for field names
- ✅ Hover documentation

---

## 🚀 Integration Status

### Current State (After This Task)

```
┌─────────────────────────────────────────────────────────────┐
│            ✅ Application Layer - dtos.ts                   │
│                application/step4/dtos.ts                    │
│                                                             │
│  - ProvidersDTO (6 fields)                                  │
│  - PsychiatristDTO (8 fields)                               │
│  - Step4InputDTO (2 optional sections)                      │
│  - Step4OutputDTO (sessionId, organizationId, data, ...)    │
│  - RepositoryResponse<T> (discriminated union)              │
│  - MedicalProvidersErrorCodes (5 error codes)               │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Types imported by
                       ↓
┌─────────────────────────────────────────────────────────────┐
│            ✅ Application Layer - ports.ts                  │
│                application/step4/ports.ts                   │
│                                                             │
│  - Imports: Step4InputDTO, Step4OutputDTO, RepositoryResponse
│  - Defines: MedicalProvidersRepository interface            │
│  - Provides: MockMedicalProvidersRepository for testing     │
│  - NO temporary stubs (all types from dtos.ts)              │
└─────────────────────────────────────────────────────────────┘
```

### Next Steps (Future Tasks)

1. **Create `usecases.ts`**: Implement `loadStep4`, `upsertMedicalProviders`
2. **Create `mappers.ts`**: DTO ↔ Domain transformations
3. **Create `index.ts`**: Barrel export for Application layer
4. **Create Infrastructure**: Repository implementation + factory
5. **Create Actions**: Server actions with auth guards

---

## ✅ Acceptance Criteria (All Met)

### Requirements Checklist

- [x] `ports.ts` imports `Step4InputDTO`, `Step4OutputDTO`, `RepositoryResponse` from `./dtos`
- [x] Temporary stub types removed (Step4InputDTO, Step4OutputDTO, RepositoryResponse)
- [x] TODO comments removed
- [x] `MedicalProvidersRepository` interface unchanged (same API)
- [x] Mock repository uses concrete types (not `unknown`)
- [x] Mock repository provides proper default values (not empty objects)
- [x] TypeScript compiles without errors
- [x] ESLint passes without errors
- [x] No unused imports
- [x] Pattern matches Step 3 exactly
- [x] No business logic added (still just port definition)
- [x] File size reduced (-47 lines, -23%)

---

## 📐 Design Decisions

### Decision 1: Use Safe Defaults in Mock Repository

**Context**: When input doesn't provide `providers` or `psychiatrist`, what should mock return?

**Decision**: Provide minimal valid defaults
```typescript
providers: input.providers ?? { hasPCP: 'Unknown' }
psychiatrist: input.psychiatrist ?? { hasBeenEvaluated: 'No' }
```

**Rationale**:
- Empty objects `{}` don't satisfy interface requirements
- 'Unknown' and 'No' are safe neutral values
- Matches use case pattern (use cases will also use defaults)
- Allows mock to work without full data

**Alternative Considered**: Throw error if data missing
- ❌ Rejected: Mock should be lenient for testing flexibility

---

### Decision 2: Keep Mock Repository in ports.ts

**Context**: Should mock be in separate file or stay in ports.ts?

**Decision**: Keep mock in ports.ts (same as Step 3)

**Rationale**:
- Matches Step 3 pattern exactly
- Mock is simple (60 lines)
- Convenient for testing (one import)
- Infrastructure will provide real implementation

**Alternative Considered**: Move to `ports.test.ts`
- ❌ Rejected: Breaks pattern consistency with Step 3

---

### Decision 3: Use Type-Only Imports

**Context**: Should we use `import type` or regular `import`?

**Decision**: Use `import type` for all imports
```typescript
import {
  type Step4InputDTO,
  type Step4OutputDTO,
  type RepositoryResponse
} from './dtos'
```

**Rationale**:
- TypeScript best practice (explicit intent)
- No runtime overhead (types erased at compile time)
- Matches Step 3 pattern
- ESLint prefers type-only imports

---

## 🔍 Code Quality Metrics

### Before This Task
- **File Lines**: 206
- **Import Lines**: 0 (commented out)
- **Stub Type Lines**: 54
- **TypeScript Errors**: 0 (stubs used `unknown`)
- **ESLint Errors**: 0

### After This Task
- **File Lines**: 159 (-47 lines, -23%)
- **Import Lines**: 5 (active import)
- **Stub Type Lines**: 0 (removed)
- **TypeScript Errors**: 0 (proper types from dtos.ts)
- **ESLint Errors**: 0

### Type Safety
- **Before**: Partial (stub types with `unknown`)
- **After**: Full (concrete types from dtos.ts)
- **IntelliSense**: ✅ Now works for all imported types
- **Compile-time Validation**: ✅ Now enforces correct structure

---

## 📚 References

**Pattern Source**: `D:\ORBIPAX-PROJECT\src\modules\intake\application\step3\ports.ts`

**DTO Source**: `D:\ORBIPAX-PROJECT\src\modules\intake\application\step4\dtos.ts`

**Previous Reports**:
- `tmp/step4_app_ports_apply_report.md` (ports.ts creation with stubs)
- `tmp/step4_app_dtos_apply_report.md` (dtos.ts creation)

**Architecture**:
- **Hexagonal Architecture**: Ports define contracts, Infrastructure implements
- **Dependency Inversion**: Application depends on abstractions (ports), not implementations
- **Type Safety**: TypeScript ensures correct usage at compile time

---

## 📈 File Size Evolution

| Stage | File | Lines | Notes |
|-------|------|-------|-------|
| **Task 1** | ports.ts (with stubs) | 206 | Temporary types with `unknown` |
| **Task 2** | dtos.ts (created) | 133 | Canonical DTOs |
| **Task 3** | ports.ts (after wire) | 159 | Imports from dtos.ts |
| **Total** | Both files | 292 | -14 lines from initial stub approach |

**Efficiency Gain**: By creating separate dtos.ts, we:
- ✅ Eliminated 54 lines of duplicate types
- ✅ Enabled reuse across Application layer (usecases, mappers will import same DTOs)
- ✅ Achieved single source of truth for types

---

## 🔐 Security & Guardrails Verification

### SoC Compliance
- ✅ Port still only defines contract (no implementation logic)
- ✅ No database access (Supabase)
- ✅ No business logic (validation, transformation)
- ✅ No UI dependencies (React, forms)
- ✅ Only imports from same Application layer (./dtos)

### Multi-tenant Pattern
- ✅ All repository methods require `sessionId` + `organizationId`
- ✅ JSDoc comments mention "Multi-tenant: scoped to organization via RLS"
- ✅ RLS enforcement delegated to Infrastructure (as intended)

### PHI Protection
- ✅ Error messages remain generic in `RepositoryResponse<T>`
- ✅ No sensitive data in mock repository
- ✅ No logging of patient information

### Type Safety
- ✅ No `any` types
- ✅ No `unknown` in public APIs (only in private mock internals if needed)
- ✅ Discriminated union for `RepositoryResponse<T>`
- ✅ Proper optional field handling

---

## ✅ Summary

**Modified**: `src/modules/intake/application/step4/ports.ts` (-47 lines)

**Changes**:
1. Added import statement from `./dtos` (5 lines)
2. Removed temporary stub types (54 lines)
3. Fixed mock repository default values (4 lines changed)

**Validation**: ✅ TypeScript passes, ✅ ESLint passes, ✅ API unchanged, ✅ Pattern matches Step 3

**Next Task**: Create `application/step4/usecases.ts` with `loadStep4` and `upsertMedicalProviders`

---

**Report Generated**: 2025-09-30
**Deliverable**: `D:\ORBIPAX-PROJECT\tmp\step4_app_ports_wire_dtos_apply_report.md`
**Status**: ✅ COMPLETE - ports.ts successfully wired to dtos.ts
