# Step 4 Application Layer - usecases.ts Creation Report
**OrbiPax Intake Module - Medical Providers Use Cases**
**Date**: 2025-09-30
**Status**: ✅ COMPLETE

---

## 📋 Executive Summary

**Objective**: Create use cases for Step 4 Medical Providers that orchestrate repository operations using canonical contracts from `dtos.ts` and `ports.ts`.

**Result**: ✅ **SUCCESS** - `application/step4/usecases.ts` created with 3 use case functions (loadStep4, upsertMedicalProviders, saveStep4).

**Key Deliverables**:
- ✅ `loadStep4(repository, sessionId, organizationId)` - Loads medical providers data
- ✅ `upsertMedicalProviders(repository, input, sessionId, organizationId)` - Saves medical providers data
- ✅ `saveStep4(...)` - Alias for upsertMedicalProviders (Step consistency pattern)
- ✅ Multi-tenant pattern (sessionId + organizationId required)
- ✅ Generic error handling (no PHI)
- ✅ Zero TypeScript errors
- ✅ Zero ESLint errors
- ✅ No `any` types
- ✅ No UI/Infrastructure dependencies

---

## 🎯 Task Scope

### Requirements Met
1. ✅ Create `application/step4/usecases.ts` with two main use cases
2. ✅ `loadStep4` delegates to `repository.findBySession()`
3. ✅ `upsertMedicalProviders` delegates to `repository.save()`
4. ✅ Both return `RepositoryResponse<T>` types from dtos.ts
5. ✅ Multi-tenant parameters (sessionId, organizationId) required
6. ✅ Generic error messages (no PHI exposure)
7. ✅ No domain validation logic (deferred to future task with mappers)
8. ✅ Follow Step 3 pattern (structure, error handling, alias function)
9. ✅ Strict TypeScript (no `any`)
10. ✅ Pass ESLint validation

### Constraints Followed
- **SoC**: Use cases orchestrate only, no business logic or validation (deferred to mappers task)
- **No UI/Infrastructure**: Only imports from Application layer (ports.ts, dtos.ts)
- **Multi-tenant**: Both functions require sessionId + organizationId
- **Generic Errors**: Use error codes from `MedicalProvidersErrorCodes`, no patient-specific messages
- **Pattern Consistency**: Match Step 3 structure (load, upsert, save alias)

---

## 📂 File Created

### `src/modules/intake/application/step4/usecases.ts` (174 lines)

**Purpose**: Orchestrate medical providers data operations using repository port

**Structure**:
```
├── SECTION 1: Imports (lines 1-17)
│   ├── DTOs and response types from './dtos'
│   ├── Error codes from './dtos'
│   └── Repository port from './ports'
│
├── SECTION 2: loadStep4 Use Case (lines 19-86)
│   ├── Parameter validation (sessionId, organizationId)
│   ├── Repository.findBySession() call
│   ├── Success: Return data as-is
│   ├── Error: Propagate repository error
│   └── Exception: Return UNKNOWN error
│
├── SECTION 3: upsertMedicalProviders Use Case (lines 88-151)
│   ├── Parameter validation (sessionId, organizationId)
│   ├── Repository.save() call (no domain validation yet)
│   ├── Success: Return { sessionId }
│   ├── Error: Propagate repository error
│   └── Exception: Return UNKNOWN error
│
└── SECTION 4: saveStep4 Alias (lines 153-174)
    └── Delegates to upsertMedicalProviders (pattern consistency)
```

---

## 🔍 Detailed Implementation

### Section 1: Imports

```typescript
import {
  type Step4InputDTO,
  type LoadStep4Response,
  type SaveStep4Response,
  MedicalProvidersErrorCodes
} from './dtos'
import { type MedicalProvidersRepository } from './ports'
```

**Import Strategy**:
- **From dtos**: Input/output types, response type aliases, error codes
- **From ports**: Repository port interface
- **No Domain imports**: Domain validation deferred to future mappers task
- **Type-only imports**: Uses `type` keyword for zero runtime overhead

---

### Section 2: loadStep4 Use Case

```typescript
export async function loadStep4(
  repository: MedicalProvidersRepository,
  sessionId: string,
  organizationId: string
): Promise<LoadStep4Response> {
  // Validate input parameters
  if (!sessionId || !organizationId) {
    return {
      ok: false,
      error: {
        code: MedicalProvidersErrorCodes.VALIDATION_FAILED,
        message: 'Session ID and Organization ID are required'
      }
    }
  }

  try {
    // Attempt to load from repository
    const result = await repository.findBySession(sessionId, organizationId)

    if (result.ok) {
      // Data found, return as-is
      return {
        ok: true,
        data: result.data
      }
    } else {
      // Error occurred (not ok)
      const errorResult = result as { ok: false; error?: { code: string; message?: string } }
      return {
        ok: false,
        error: errorResult.error ?? {
          code: MedicalProvidersErrorCodes.UNKNOWN,
          message: 'Failed to load medical providers data'
        }
      }
    }
  } catch {
    // Unexpected error
    return {
      ok: false,
      error: {
        code: MedicalProvidersErrorCodes.UNKNOWN,
        message: 'An unexpected error occurred while loading medical providers data'
      }
    }
  }
}
```

**Flow**:
1. **Parameter Validation**: Check sessionId and organizationId are provided
2. **Repository Call**: Delegate to `repository.findBySession()`
3. **Success Path**: Return data as-is (type: `Step4OutputDTO`)
4. **Error Path**: Propagate repository error or return generic UNKNOWN error
5. **Exception Path**: Catch unexpected errors and return UNKNOWN

**Key Design Decisions**:
- **No Empty Structure**: Unlike Step 3, NOT_FOUND returns error (no `createEmptyOutput()` yet)
  - Note in code: "Future task will create mappers to return empty structure for NOT_FOUND"
- **Type Assertion**: Used `as { ok: false; error?: ... }` to help TypeScript narrow discriminated union
- **Generic Errors**: All error messages are generic ("Failed to load", not patient-specific)

---

### Section 3: upsertMedicalProviders Use Case

```typescript
export async function upsertMedicalProviders(
  repository: MedicalProvidersRepository,
  input: Step4InputDTO,
  sessionId: string,
  organizationId: string
): Promise<SaveStep4Response> {
  // Validate input parameters
  if (!sessionId || !organizationId) {
    return {
      ok: false,
      error: {
        code: MedicalProvidersErrorCodes.VALIDATION_FAILED,
        message: 'Session ID and Organization ID are required'
      }
    }
  }

  try {
    // Note: Future task will add domain validation via mappers
    // For now, delegate directly to repository

    // Persist to repository
    const result = await repository.save(sessionId, organizationId, input)

    if (result.ok) {
      // Success - data is guaranteed to be defined
      return {
        ok: true,
        data: result.data
      }
    } else {
      // Save failed
      const errorResult = result as { ok: false; error?: { code: string; message?: string } }
      return {
        ok: false,
        error: errorResult.error ?? {
          code: MedicalProvidersErrorCodes.UNKNOWN,
          message: 'An unexpected error occurred while saving medical providers data'
        }
      }
    }
  } catch {
    // Unexpected error
    return {
      ok: false,
      error: {
        code: MedicalProvidersErrorCodes.UNKNOWN,
        message: 'An unexpected error occurred while saving medical providers data'
      }
    }
  }
}
```

**Flow**:
1. **Parameter Validation**: Check sessionId and organizationId are provided
2. **No Domain Validation**: Deferred to future mappers task (see note in code)
3. **Repository Call**: Delegate to `repository.save()`
4. **Success Path**: Return `{ sessionId }` (type: `{ sessionId: string }`)
5. **Error Path**: Propagate repository error or return generic UNKNOWN error
6. **Exception Path**: Catch unexpected errors and return UNKNOWN

**Difference from Step 3**:
- **No Domain Validation**: Step 3 calls `toPartialDomain()` and `step3DataPartialSchema.safeParse()`
- **No Zod Import**: Step 3 imports `ZodError` and catches it
- **Reason**: Task says "sin lógica de dominio" (no domain logic), mappers will be created in future task

**Note in Code**:
```typescript
// Note: Future task will add domain validation via mappers
// For now, delegate directly to repository
```

---

### Section 4: saveStep4 Alias

```typescript
export async function saveStep4(
  repository: MedicalProvidersRepository,
  input: Step4InputDTO,
  sessionId: string,
  organizationId: string
): Promise<SaveStep4Response> {
  return upsertMedicalProviders(repository, input, sessionId, organizationId)
}
```

**Purpose**: Provide alias for consistency with Step 2/Step 3 pattern

**Pattern**:
- Step 2: `saveStep2` → `upsertInsurance`
- Step 3: `saveStep3` → `upsertDiagnoses`
- Step 4: `saveStep4` → `upsertMedicalProviders`

**Usage**: Actions layer can call either `upsertMedicalProviders` (explicit) or `saveStep4` (Step naming convention)

---

## ✅ Validation Results

### TypeScript Compilation

**Command**: `npx tsc --noEmit src/modules/intake/application/step4/usecases.ts`

**Result**: ✅ **PASS** - No TypeScript errors

**Challenges Encountered**:
1. **Initial Issue**: TypeScript wasn't narrowing discriminated union after `if (result.ok)` check
2. **Root Cause**: Control flow analysis didn't recognize `else` branch type narrowing
3. **Solution**: Added explicit type assertion: `const errorResult = result as { ok: false; error?: ... }`
4. **Verification**: TypeScript now correctly types `errorResult.error` as optional

**Type Safety**:
- ✅ No `any` types
- ✅ All parameters properly typed
- ✅ Return types use aliases from dtos.ts (`LoadStep4Response`, `SaveStep4Response`)
- ✅ Discriminated union properly handled

---

### ESLint Validation

**Command**: `npx eslint src/modules/intake/application/step4/usecases.ts`

**Result**: ✅ **PASS** - No ESLint errors or warnings

**Checks Passed**:
- No unused imports
- No unused variables
- Consistent naming conventions
- Proper JSDoc formatting
- No console statements
- Import order correct (DTOs before ports)
- Type-only imports used

---

### SoC Compliance

**✅ Application Orchestration Only**:
- ✅ No domain validation (Zod schemas)
- ✅ No UI dependencies (React, forms)
- ✅ No infrastructure dependencies (Supabase, database)
- ✅ No business logic (just delegation to repository)
- ✅ Only imports from Application layer (./dtos, ./ports)

**✅ Multi-Tenant Pattern**:
- ✅ Both use cases require `sessionId` + `organizationId`
- ✅ Parameters validated (reject if missing)
- ✅ JSDoc comments mention "Multi-tenant: scoped by organizationId"
- ✅ RLS enforcement delegated to Infrastructure (repository implementation)

**✅ PHI Protection**:
- ✅ Error messages are generic ("Failed to load", "An unexpected error occurred")
- ✅ No patient-specific information in error messages
- ✅ Error codes from enum (VALIDATION_FAILED, NOT_FOUND, UNKNOWN)

---

### Pattern Consistency with Step 3

| Aspect | Step 3 (Diagnoses) | Step 4 (Medical Providers) | Match |
|--------|-------------------|---------------------------|-------|
| **Load Use Case** | `loadStep3(repo, sessionId, orgId)` | `loadStep4(repo, sessionId, orgId)` | ✅ |
| **Upsert Use Case** | `upsertDiagnoses(repo, input, ...)` | `upsertMedicalProviders(repo, input, ...)` | ✅ |
| **Save Alias** | `saveStep3(...)` → `upsertDiagnoses` | `saveStep4(...)` → `upsertMedicalProviders` | ✅ |
| **Parameter Validation** | Check sessionId, organizationId | Check sessionId, organizationId | ✅ |
| **Error Handling** | Try-catch with generic messages | Try-catch with generic messages | ✅ |
| **Return Types** | `LoadStep3Response`, `SaveStep3Response` | `LoadStep4Response`, `SaveStep4Response` | ✅ |
| **Domain Validation** | Uses `toPartialDomain()` + Zod | **Deferred to future mappers task** | ⚠️ Intentional deviation |
| **Empty Structure** | Returns `createEmptyOutput()` for NOT_FOUND | **Returns error (future task)** | ⚠️ Intentional deviation |

**Intentional Deviations**:
1. **No Domain Validation**: Task says "sin lógica de dominio" (without domain logic)
2. **No Mappers**: Mappers will be created in future task
3. **NOT_FOUND Handling**: Returns error instead of empty structure (mappers needed)

---

## 📊 Code Metrics

### File Size
- **Lines**: 174
- **Functions**: 3 (loadStep4, upsertMedicalProviders, saveStep4)
- **Imports**: 2 statements (dtos, ports)

### Complexity
- **Cyclomatic Complexity**: Low (simple delegation, parameter validation, error handling)
- **Dependencies**: 2 files (dtos.ts, ports.ts)
- **Nesting Depth**: 2 levels (try-catch, if-else)

### Comparison to Step 3
- **Step 3**: 189 lines (with domain validation, mappers import, ZodError handling)
- **Step 4**: 174 lines (without domain validation yet)
- **Difference**: -15 lines (-8%) - Expected since domain validation deferred

---

## 📐 Design Decisions

### Decision 1: Defer Domain Validation to Future Task

**Context**: Step 3 includes domain validation with mappers and Zod.

**Decision**: Skip domain validation in this task, add note for future task
```typescript
// Note: Future task will add domain validation via mappers
// For now, delegate directly to repository
```

**Rationale**:
- Task explicitly says "sin lógica de dominio" (no domain logic)
- Mappers don't exist yet (will be created in future task)
- Keeps use cases focused on orchestration only
- Matches task requirement: "solo orquestación"

**Alternative Considered**: Include validation now
- ❌ Rejected: Violates task scope, requires creating mappers first

---

### Decision 2: Return Error for NOT_FOUND (Not Empty Structure)

**Context**: Step 3 returns `createEmptyOutput()` when data not found.

**Decision**: Return error for NOT_FOUND, add note for future task
```typescript
// Error occurred (not ok)
// Note: Future task will create mappers to return empty structure for NOT_FOUND
return {
  ok: false,
  error: errorResult.error ?? { ... }
}
```

**Rationale**:
- `createEmptyOutput()` doesn't exist yet (defined in mappers)
- Returning error is safer default (UI can handle gracefully)
- Future task will add mapper with empty structure logic
- Maintains consistency with current state (no mappers)

**Alternative Considered**: Create `createEmptyOutput()` inline
- ❌ Rejected: Violates SoC (mappers should define default structures)

---

### Decision 3: Use Type Assertion for Discriminated Union

**Context**: TypeScript couldn't narrow `RepositoryResponse<T>` in else branch.

**Decision**: Use explicit type assertion
```typescript
const errorResult = result as { ok: false; error?: { code: string; message?: string } }
```

**Rationale**:
- TypeScript control flow analysis didn't recognize narrowing in else branch
- Assertion is safe (else branch means `ok === false`)
- Alternative was to check `!result.ok` again (redundant)
- Step 3 doesn't have this issue (different TS version or pattern)

**Alternative Considered**: Check `result.error` directly
- ❌ Rejected: TypeScript still complained about accessing `.error` on union

---

### Decision 4: Create saveStep4 Alias

**Context**: Should we provide both `upsertMedicalProviders` and `saveStep4`?

**Decision**: Yes, create alias for pattern consistency

**Rationale**:
- Step 2 has `saveStep2`
- Step 3 has `saveStep3`
- Consistency across steps
- Some code may prefer "save" naming
- Zero runtime cost (just function call)

---

## 🔄 Future Tasks (Noted in Code)

### Task 1: Create mappers.ts

**Purpose**: DTO ↔ Domain transformations

**Required Functions**:
```typescript
// toPartialDomain(input: Step4InputDTO): MedicalProvidersDataPartial
// toDomain(input: Step4InputDTO): MedicalProvidersData
// toOutput(domain, sessionId, orgId): Step4OutputDTO
// createEmptyOutput(sessionId, orgId): Step4OutputDTO
```

**Impact on usecases.ts**:
1. Add import: `import { toPartialDomain, createEmptyOutput } from './mappers'`
2. In `upsertMedicalProviders`: Add domain validation
   ```typescript
   const domainData = toPartialDomain(input)
   const validationResult = medicalProvidersDataPartialSchema.safeParse(domainData)
   if (!validationResult.success) { ... }
   ```
3. In `loadStep4`: Return empty structure for NOT_FOUND
   ```typescript
   if (result.error?.code === MedicalProvidersErrorCodes.NOT_FOUND) {
     return { ok: true, data: createEmptyOutput(sessionId, organizationId) }
   }
   ```

**Estimated Changes**: +10 lines (imports, validation, empty structure)

---

### Task 2: Add Domain Validation

**Purpose**: Validate input with Zod before saving

**Required**:
- Import `medicalProvidersDataPartialSchema` from domain
- Import `ZodError` from 'zod'
- Call `safeParse()` after `toPartialDomain()`
- Catch `ZodError` in exception handler

**Example** (from Step 3):
```typescript
import { ZodError } from 'zod'
import { medicalProvidersDataPartialSchema } from '@/modules/intake/domain/schemas/medical-providers'

// In upsertMedicalProviders
const domainData = toPartialDomain(input)
const validationResult = medicalProvidersDataPartialSchema.safeParse(domainData)
if (!validationResult.success) {
  return {
    ok: false,
    error: {
      code: MedicalProvidersErrorCodes.VALIDATION_FAILED,
      message: 'Medical providers data validation failed'
    }
  }
}

// In catch block
catch (error) {
  if (error instanceof ZodError) {
    return { ok: false, error: { code: ..., message: 'Validation failed' } }
  }
  // ...
}
```

**Estimated Changes**: +15 lines (import, validation, ZodError handling)

---

## 🚀 Integration Status

### Current State (After This Task)

```
┌─────────────────────────────────────────────────────────────┐
│                    Actions Layer (Future)                   │
│              actions/step4/medical-providers.actions.ts     │
│                                                             │
│  Will call: loadStep4Action() → loadStep4(repo, ...)       │
│             upsertMedicalProvidersAction() → upsertMedicalProviders(...)
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Will use
                       ↓
┌─────────────────────────────────────────────────────────────┐
│            ✅ Application Layer - usecases.ts               │
│                application/step4/usecases.ts                │
│                                                             │
│  - loadStep4(repo, sessionId, orgId)                        │
│  - upsertMedicalProviders(repo, input, sessionId, orgId)    │
│  - saveStep4(...) [alias]                                   │
│  - Uses: MedicalProvidersRepository port                    │
│  - Returns: LoadStep4Response, SaveStep4Response            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Imports types from
                       ↓
┌─────────────────────────────────────────────────────────────┐
│            ✅ Application Layer - dtos.ts                   │
│                application/step4/dtos.ts                    │
│                                                             │
│  - Step4InputDTO, Step4OutputDTO                            │
│  - LoadStep4Response, SaveStep4Response                     │
│  - MedicalProvidersErrorCodes                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│            ✅ Application Layer - ports.ts                  │
│                application/step4/ports.ts                   │
│                                                             │
│  - MedicalProvidersRepository interface                     │
│  - RepositoryResponse<T> type                               │
└─────────────────────────────────────────────────────────────┘
```

### Next Steps (Remaining Application Layer Tasks)

1. **Create `mappers.ts`**: DTO ↔ Domain transformations
2. **Create `index.ts`**: Barrel export for Application layer
3. **Update `usecases.ts`**: Add domain validation with mappers

---

## ✅ Acceptance Criteria (All Met)

### Requirements Checklist

- [x] File created: `application/step4/usecases.ts`
- [x] `loadStep4(repository, sessionId, organizationId)` function created
- [x] `upsertMedicalProviders(repository, input, sessionId, organizationId)` function created
- [x] `saveStep4(...)` alias function created
- [x] `loadStep4` returns `LoadStep4Response` (RepositoryResponse<Step4OutputDTO>)
- [x] `upsertMedicalProviders` returns `SaveStep4Response` (RepositoryResponse<{ sessionId: string }>)
- [x] Both functions validate sessionId and organizationId (reject if missing)
- [x] Multi-tenant pattern followed (all params required)
- [x] Generic error messages (no PHI)
- [x] Error codes from `MedicalProvidersErrorCodes` enum
- [x] No `any` types used
- [x] No UI dependencies
- [x] No Infrastructure dependencies
- [x] Only imports from Application layer (dtos.ts, ports.ts)
- [x] TypeScript compiles without errors
- [x] ESLint passes without errors
- [x] Pattern matches Step 3 structure (with intentional deviations noted)
- [x] JSDoc comments on all functions

---

## 📚 References

**Pattern Source**: `D:\ORBIPAX-PROJECT\src\modules\intake\application\step3\usecases.ts` (189 lines)

**Contract Sources**:
- `application/step4/dtos.ts` - Input/output types, response types, error codes
- `application/step4/ports.ts` - Repository port interface

**Previous Reports**:
- `tmp/step4_app_ports_apply_report.md` - Ports creation
- `tmp/step4_app_dtos_apply_report.md` - DTOs creation
- `tmp/step4_app_ports_wire_dtos_apply_report.md` - Ports wiring to DTOs

**Architecture**:
- **Hexagonal Architecture**: Use cases orchestrate domain + ports
- **Dependency Injection**: Repository injected as parameter
- **SoC**: Use cases coordinate, don't implement business logic

---

## 📈 Progress Summary

### Application Layer Completion Status

| File | Status | Lines | Purpose |
|------|--------|-------|---------|
| `ports.ts` | ✅ Complete | 159 | Repository port interface |
| `dtos.ts` | ✅ Complete | 133 | JSON-serializable DTOs |
| `usecases.ts` | ✅ Complete | 174 | Use case orchestration |
| `mappers.ts` | ⏳ Future | ~280 | DTO ↔ Domain transformations |
| `index.ts` | ⏳ Future | ~20 | Barrel export |

**Current Total**: 466 lines (3 files)
**Estimated Final**: ~766 lines (5 files)
**Completion**: 61% of Application layer

---

## ✅ Summary

**Created**: `src/modules/intake/application/step4/usecases.ts` (174 lines)

**Use Cases**:
1. `loadStep4(repository, sessionId, organizationId)` - Loads medical providers data
2. `upsertMedicalProviders(repository, input, sessionId, organizationId)` - Saves medical providers data
3. `saveStep4(...)` - Alias for upsertMedicalProviders

**Key Features**:
- Multi-tenant pattern (sessionId + organizationId required)
- Generic error handling (no PHI)
- Repository delegation (no business logic)
- Domain validation deferred (future mappers task)

**Validation**: ✅ TypeScript passes, ✅ ESLint passes, ✅ SoC compliant, ✅ Pattern consistent with Step 3

**Next Task**: Create `application/step4/mappers.ts` with DTO ↔ Domain transformations

---

**Report Generated**: 2025-09-30
**Deliverable**: `D:\ORBIPAX-PROJECT\tmp\step4_app_usecases_apply_report.md`
**Status**: ✅ COMPLETE - Use cases ready, mappers pending (next task)
