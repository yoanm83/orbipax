# Step 4 Application Layer - dtos.ts Creation Report
**OrbiPax Intake Module - Medical Providers DTOs**
**Date**: 2025-09-30
**Status**: ✅ COMPLETE

---

## 📋 Executive Summary

**Objective**: Create canonical DTOs for Step 4 Medical Providers in the Application layer, following Step 3 pattern exactly, without modifying ports.ts.

**Result**: ✅ **SUCCESS** - `application/step4/dtos.ts` created with complete DTO definitions (133 lines).

**Key Deliverables**:
- ✅ `ProvidersDTO` - PCP section data contract
- ✅ `PsychiatristDTO` - Psychiatrist/Evaluator section data contract
- ✅ `Step4InputDTO` - Input contract for saving
- ✅ `Step4OutputDTO` - Output contract for loading
- ✅ `RepositoryResponse<T>` - Generic response type with discriminated union
- ✅ `MedicalProvidersErrorCodes` - Standard error codes enum
- ✅ Response type aliases: `LoadStep4Response`, `SaveStep4Response`, `ValidateStep4Response`
- ✅ Zero TypeScript errors
- ✅ Zero ESLint errors
- ✅ No PHI in error messages
- ✅ No `any` types

---

## 🎯 Task Scope

### Requirements Met
1. ✅ Define section DTOs (ProvidersDTO, PsychiatristDTO) matching domain schema
2. ✅ Define input/output DTOs (Step4InputDTO, Step4OutputDTO)
3. ✅ Define `RepositoryResponse<T>` discriminated union type
4. ✅ Define error codes enum (MedicalProvidersErrorCodes)
5. ✅ Define response type aliases (LoadStep4Response, SaveStep4Response, ValidateStep4Response)
6. ✅ Follow Step 3 pattern exactly (structure, naming, JSDoc)
7. ✅ Ensure strict TypeScript (no `any`, no circular dependencies)
8. ✅ Ensure JSON-serializable types only (dates as ISO strings)
9. ✅ Generic error messages (no PHI)
10. ✅ Do NOT modify ports.ts (as instructed)

### Constraints Followed
- **SoC**: DTOs are pure TypeScript interfaces, no validation logic
- **No PHI**: Error messages are generic ("Failed to save data", not specific patient info)
- **No UI/Infra**: No dependencies on UI components or Infrastructure implementations
- **JSON-serializable**: All types use primitives, strings, and objects (dates as ISO strings)
- **Pattern Consistency**: Matches Step 3 naming conventions and structure

---

## 📂 Files Created

### 1. `src/modules/intake/application/step4/dtos.ts` (133 lines)

**Purpose**: Define JSON-serializable DTOs for Medical Providers data transfer across layers

**Structure**:
```
├── SECTION 1: Primary Care Provider DTO (lines 11-26)
│   └── ProvidersDTO (6 fields)
│
├── SECTION 2: Psychiatrist/Evaluator DTO (lines 28-48)
│   └── PsychiatristDTO (8 fields)
│
├── SECTION 3: Input/Output DTOs (lines 50-76)
│   ├── Step4InputDTO (2 optional sections)
│   └── Step4OutputDTO (sessionId, organizationId, data, timestamps)
│
├── SECTION 4: Response Types (lines 78-113)
│   ├── RepositoryResponse<T> (discriminated union)
│   ├── LoadStep4Response (type alias)
│   ├── SaveStep4Response (type alias)
│   └── ValidateStep4Response (type alias)
│
└── SECTION 5: Error Codes (lines 115-133)
    ├── MedicalProvidersErrorCodes (const enum)
    └── MedicalProvidersErrorCode (type)
```

---

## 🔍 Detailed Implementation

### Section 1: ProvidersDTO (Primary Care Provider)

```typescript
export interface ProvidersDTO {
  hasPCP: 'Yes' | 'No' | 'Unknown'
  pcpName?: string
  pcpPhone?: string
  pcpPractice?: string
  pcpAddress?: string
  authorizedToShare?: boolean
}
```

**Field Mapping** (Domain → DTO):
- ✅ `hasPCP` - enum: 'Yes' | 'No' | 'Unknown'
- ✅ `pcpName` - optional string
- ✅ `pcpPhone` - optional string
- ✅ `pcpPractice` - optional string
- ✅ `pcpAddress` - optional string
- ✅ `authorizedToShare` - optional boolean

**Key Design Decisions**:
1. **Literal Union Types**: `hasPCP` uses string literals (not enum) for JSON compatibility
2. **Optional Fields**: All fields except `hasPCP` are optional (partial data support)
3. **No Validation**: DTO is pure data contract, validation happens in Domain layer

---

### Section 2: PsychiatristDTO (Psychiatrist/Evaluator)

```typescript
export interface PsychiatristDTO {
  hasBeenEvaluated: 'Yes' | 'No'
  psychiatristName?: string
  evaluationDate?: string // ISO date string
  clinicName?: string
  notes?: string
  differentEvaluator?: boolean
  evaluatorName?: string
  evaluatorClinic?: string
}
```

**Field Mapping** (Domain → DTO):
- ✅ `hasBeenEvaluated` - enum: 'Yes' | 'No'
- ✅ `psychiatristName` - optional string
- ✅ `evaluationDate` - optional string (ISO date, not Date object for JSON serialization)
- ✅ `clinicName` - optional string
- ✅ `notes` - optional string
- ✅ `differentEvaluator` - optional boolean
- ✅ `evaluatorName` - optional string
- ✅ `evaluatorClinic` - optional string

**Key Design Decisions**:
1. **ISO Date Strings**: `evaluationDate` is `string` (not `Date`) for JSON serialization
2. **Conditional Fields**: `differentEvaluator`, `evaluatorName`, `evaluatorClinic` are optional (conditional UI flow)
3. **Max Length**: No max length in DTO (enforced by Domain layer Zod schema)

---

### Section 3: Input/Output DTOs

#### Step4InputDTO (Input for Save Operations)

```typescript
export interface Step4InputDTO {
  providers?: ProvidersDTO
  psychiatrist?: PsychiatristDTO
}
```

**Purpose**: Received from UI/Actions layer when saving Step 4 data

**Design**:
- Both sections are optional (supports partial saves/drafts)
- No `sessionId`/`organizationId` at this level (added by use cases)

#### Step4OutputDTO (Output for Load Operations)

```typescript
export interface Step4OutputDTO {
  sessionId: string
  organizationId: string
  data: {
    providers: ProvidersDTO
    psychiatrist: PsychiatristDTO
  }
  lastModified?: string // ISO date string
  completedAt?: string // ISO date string if step completed
}
```

**Purpose**: Sent to UI/Actions layer after loading Step 4 data from DB

**Design**:
- Required: `sessionId`, `organizationId` (multi-tenant identifiers)
- Required: `data` object with both sections (even if empty)
- Optional: `lastModified` (auto-save tracking)
- Optional: `completedAt` (step completion timestamp)

**Multi-tenant Pattern**:
- `sessionId` + `organizationId` form composite key
- RLS enforcement happens at Infrastructure layer

---

### Section 4: Response Types

#### RepositoryResponse<T> (Discriminated Union)

```typescript
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

**Contract Properties**:
- **Discriminator**: `ok: boolean` enables type narrowing
- **Success Branch**: `{ ok: true, data: T }` - strongly typed data
- **Failure Branch**: `{ ok: false, error: { code, message? } }` - generic error (no PHI)
- **Type Safety**: TypeScript narrows types based on `ok` check

**Usage Example**:
```typescript
const result = await repository.findBySession(sessionId, orgId)
if (result.ok) {
  console.log(result.data) // Type: Step4OutputDTO
} else {
  console.error(result.error.code) // Type: string
}
```

#### Response Type Aliases

```typescript
export type LoadStep4Response = RepositoryResponse<Step4OutputDTO>
export type SaveStep4Response = RepositoryResponse<{ sessionId: string }>
export type ValidateStep4Response = RepositoryResponse<{
  isValid: boolean
  issues?: string[]
}>
```

**Purpose**: Provide semantic type names for common use case responses

---

### Section 5: Error Codes

```typescript
export const MedicalProvidersErrorCodes = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  SAVE_FAILED: 'SAVE_FAILED',
  UNKNOWN: 'UNKNOWN'
} as const

export type MedicalProvidersErrorCode =
  typeof MedicalProvidersErrorCodes[keyof typeof MedicalProvidersErrorCodes]
```

**Error Code Definitions**:
- `UNAUTHORIZED` - Authentication/authorization failure
- `NOT_FOUND` - Medical providers data not found for session
- `VALIDATION_FAILED` - Domain validation failed (from Zod schema)
- `SAVE_FAILED` - Database save operation failed
- `UNKNOWN` - Unexpected error

**Usage Pattern**:
```typescript
return {
  ok: false,
  error: {
    code: MedicalProvidersErrorCodes.NOT_FOUND,
    message: 'Medical providers data not found' // Generic, no PHI
  }
}
```

**Why `as const`**:
- Creates a readonly object with literal types
- Enables type narrowing: `code: 'UNAUTHORIZED'` (not `code: string`)
- Prevents accidental modification

---

## ✅ Validation Results

### TypeScript Compilation

**Command**: `npx tsc --noEmit src/modules/intake/application/step4/dtos.ts`

**Result**: ✅ **PASS** - No TypeScript errors

**Verification**:
- No `any` types used (strict typing throughout)
- No circular dependencies
- No missing type definitions
- All optional properties properly marked with `?`
- Discriminated union `RepositoryResponse<T>` correctly typed

---

### ESLint Validation

**Command**: `npx eslint src/modules/intake/application/step4/dtos.ts`

**Result**: ✅ **PASS** - No ESLint errors or warnings

**Checks Passed**:
- No unused imports
- No unused variables
- Consistent naming conventions
- Proper JSDoc formatting
- No console statements
- No TODO comments without context

---

### SoC Compliance

**✅ Application Layer DTOs Only**:
- ✅ No domain validation logic (Zod schemas)
- ✅ No UI dependencies (React, form libraries)
- ✅ No infrastructure dependencies (Supabase, database)
- ✅ No business logic (use cases, transformations)
- ✅ Pure data contracts only

**✅ JSON-Serializable**:
- ✅ All types use primitives (string, number, boolean)
- ✅ Dates as ISO strings (not Date objects)
- ✅ No functions or classes
- ✅ No circular references

**✅ PHI Protection**:
- ✅ Error messages are generic ("Failed to save", not patient-specific)
- ✅ No sensitive data in error codes
- ✅ No logging of patient information

---

### Pattern Consistency with Step 3

| Aspect | Step 3 (Diagnoses) | Step 4 (Medical Providers) | Match |
|--------|-------------------|---------------------------|-------|
| **Section DTOs** | DiagnosesDTO, PsychiatricEvaluationDTO, FunctionalAssessmentDTO | ProvidersDTO, PsychiatristDTO | ✅ |
| **Input DTO** | `Step3InputDTO` (3 optional sections) | `Step4InputDTO` (2 optional sections) | ✅ |
| **Output DTO** | `Step3OutputDTO` (sessionId, organizationId, data, timestamps) | `Step4OutputDTO` (same structure) | ✅ |
| **Response Type** | `RepositoryResponse<T>` discriminated union | `RepositoryResponse<T>` discriminated union | ✅ |
| **Error Codes** | `DiagnosesErrorCodes` (5 codes) | `MedicalProvidersErrorCodes` (5 codes) | ✅ |
| **Response Aliases** | LoadStep3Response, SaveStep3Response, ValidateStep3Response | LoadStep4Response, SaveStep4Response, ValidateStep4Response | ✅ |
| **File Structure** | 5 sections (Section DTOs, Input/Output, Response, Error Codes) | 5 sections (same) | ✅ |
| **Line Count** | 188 lines | 133 lines (-29%) | ✅ Simpler domain |

**Why Step 4 is Shorter**:
- Step 3 has 3 complex sections (Diagnoses with records array, Psychiatric Eval with many fields, Functional Assessment with WHODAS domains)
- Step 4 has 2 simpler sections (Providers with 6 fields, Psychiatrist with 8 fields)
- No nested array types (like `diagnosisRecords: DiagnosisRecordDTO[]` in Step 3)

---

## 📊 Type Definitions Summary

### All Exported Types

| Type | Kind | Purpose | Lines |
|------|------|---------|-------|
| `ProvidersDTO` | Interface | PCP section data | 18-26 |
| `PsychiatristDTO` | Interface | Psychiatrist section data | 35-48 |
| `Step4InputDTO` | Interface | Input for save operations | 54-57 |
| `Step4OutputDTO` | Interface | Output for load operations | 63-73 |
| `RepositoryResponse<T>` | Type (Discriminated Union) | Generic response contract | 84-95 |
| `LoadStep4Response` | Type Alias | Load operation response | 100 |
| `SaveStep4Response` | Type Alias | Save operation response | 105 |
| `ValidateStep4Response` | Type Alias | Validation response | 110-113 |
| `MedicalProvidersErrorCodes` | Const Object | Error code enum | 122-128 |
| `MedicalProvidersErrorCode` | Type | Error code union type | 133 |

**Total Exports**: 10 types (all documented with JSDoc)

---

## 🔄 Audit Findings

### Pre-Creation Checks

**✅ No Duplicate DTOs Found**:
- Checked: `application/step4/**/*.ts` → Only `ports.ts` exists
- Checked: `**/*medical-providers*.dto*.ts` → No results
- Conclusion: Safe to create DTOs without duplication

**✅ Domain Schema Reviewed**:
- Source: `domain/schemas/medical-providers/medical-providers.schema.ts`
- Verified field names match exactly (hasPCP, pcpName, hasBeenEvaluated, etc.)
- Noted conditional validation (handled in Domain, not DTO layer)

**✅ Step 3 Pattern Reviewed**:
- Source: `application/step3/dtos.ts` (188 lines)
- Cloned structure: Section DTOs → Input/Output → Response Types → Error Codes
- Matched naming: `Step3InputDTO` → `Step4InputDTO`, `DiagnosesErrorCodes` → `MedicalProvidersErrorCodes`

---

## 🚀 Integration Notes

### How This Fits in the Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer                             │
│  (Step4MedicalProviders.tsx, ProvidersSection.tsx, etc.)   │
│                                                             │
│  - Calls: loadStep4Action(), upsertMedicalProvidersAction()│
│  - Receives: Step4OutputDTO (from load action)             │
│  - Sends: Step4InputDTO (to upsert action)                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Server Actions Call
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    Actions Layer (Future)                   │
│              actions/step4/medical-providers.actions.ts     │
│                                                             │
│  - Receives: Step4InputDTO from UI                          │
│  - Returns: ActionResponse<Step4OutputDTO>                  │
│  - Delegates to: loadStep4(repository, ...)                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Use Case Call
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                Application Layer (Future)                   │
│              application/step4/usecases.ts                  │
│                                                             │
│  - Uses: MedicalProvidersRepository port                    │
│  - Transforms: Step4InputDTO → Domain (via mappers)         │
│  - Validates: Domain schema (Zod)                           │
│  - Returns: LoadStep4Response, SaveStep4Response            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Repository Call
                       ↓
┌─────────────────────────────────────────────────────────────┐
│            ✅ Application Layer (THIS TASK)                 │
│                application/step4/dtos.ts                    │
│                                                             │
│  - Defines: ProvidersDTO, PsychiatristDTO                   │
│  - Defines: Step4InputDTO, Step4OutputDTO                   │
│  - Defines: RepositoryResponse<T>                           │
│  - Defines: MedicalProvidersErrorCodes                      │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Used by ports.ts
                       ↓
┌─────────────────────────────────────────────────────────────┐
│            ✅ Application Layer (PREVIOUS TASK)             │
│                application/step4/ports.ts                   │
│                                                             │
│  - Currently: Uses temporary DTO stubs                      │
│  - Next Task: Will import from './dtos'                     │
│  - Interface: MedicalProvidersRepository                    │
└─────────────────────────────────────────────────────────────┘
```

### Import Chain (Current + Future State)

**Current State (After This Task)**:
```typescript
// application/step4/dtos.ts (✅ Created)
export interface ProvidersDTO { ... }
export interface PsychiatristDTO { ... }
export interface Step4InputDTO { ... }
export interface Step4OutputDTO { ... }
export type RepositoryResponse<T> = ...
export const MedicalProvidersErrorCodes = { ... }

// application/step4/ports.ts (NOT modified in this task)
// Still has temporary stubs with TODO comments
```

**Future State (Next Task - Update ports.ts)**:
```typescript
// application/step4/ports.ts (will be updated)
import type {
  Step4InputDTO,
  Step4OutputDTO,
  RepositoryResponse
} from './dtos'

// Remove temporary stub types
// Use imported types in MedicalProvidersRepository interface
```

---

## 📝 Next Task: Update ports.ts

### What Needs to Happen (Future Task, Not This One)

**File**: `application/step4/ports.ts`

**Changes Required**:
1. **Uncomment Import**:
   ```typescript
   import type {
     Step4InputDTO,
     Step4OutputDTO,
     RepositoryResponse
   } from './dtos'
   ```

2. **Remove Temporary Stubs** (lines 11-60):
   - Delete temporary `Step4InputDTO` interface
   - Delete temporary `Step4OutputDTO` interface
   - Delete temporary `RepositoryResponse<T>` type

3. **Verify TypeScript**:
   - Run: `npx tsc --noEmit`
   - Ensure: 0 errors after import change

4. **Verify ESLint**:
   - Run: `npx eslint src/modules/intake/application/step4/ports.ts`
   - Ensure: 0 errors after import change

**Why Not Done in This Task**:
- Task instructions explicitly stated: "DO NOT TOUCH application/step4/ports.ts"
- Keeps tasks focused and atomic (single responsibility)
- Allows independent verification of DTOs before integration

---

## ✅ Acceptance Criteria (All Met)

### Requirements Checklist

- [x] File created: `application/step4/dtos.ts`
- [x] `ProvidersDTO` defined with 6 fields (hasPCP, pcpName, pcpPhone, pcpPractice, pcpAddress, authorizedToShare)
- [x] `PsychiatristDTO` defined with 8 fields (hasBeenEvaluated, psychiatristName, evaluationDate, clinicName, notes, differentEvaluator, evaluatorName, evaluatorClinic)
- [x] `Step4InputDTO` defined with 2 optional sections
- [x] `Step4OutputDTO` defined with sessionId, organizationId, data, timestamps
- [x] `RepositoryResponse<T>` discriminated union defined
- [x] `MedicalProvidersErrorCodes` enum defined with 5 codes
- [x] Response type aliases defined (LoadStep4Response, SaveStep4Response, ValidateStep4Response)
- [x] All types have JSDoc comments
- [x] No `any` types used
- [x] No UI/Infrastructure dependencies
- [x] No PHI in error messages
- [x] JSON-serializable types only
- [x] Dates as ISO strings (not Date objects)
- [x] TypeScript compiles without errors (isolated)
- [x] ESLint passes without errors (isolated)
- [x] Pattern matches Step 3 structure
- [x] No duplicate DTOs created
- [x] `ports.ts` NOT modified (as instructed)

---

## 📐 Design Decisions

### 1. RepositoryResponse as Discriminated Union (Not Interface)

**Decision**: Use `type` with union (`{ ok: true } | { ok: false }`) instead of `interface`

**Rationale**:
- TypeScript can narrow types based on `ok` boolean check
- Enforces mutually exclusive branches (success XOR failure)
- Prevents invalid states (e.g., `{ ok: true, error: ... }`)

**Example Type Narrowing**:
```typescript
if (result.ok) {
  result.data // Type: Step4OutputDTO (no null/undefined check needed)
} else {
  result.error // Type: { code: string, message?: string }
}
```

---

### 2. ISO Date Strings (Not Date Objects)

**Decision**: Use `evaluationDate?: string` instead of `evaluationDate?: Date`

**Rationale**:
- DTOs are JSON-serializable (Date objects don't serialize to JSON natively)
- Actions layer uses `'use server'` (Next.js server actions only accept serializable types)
- Domain layer uses `z.date()` (handles Date objects for validation)
- Mappers convert between ISO strings (DTO) and Date objects (Domain)

**Conversion Flow**:
```
UI (string) → DTO (string) → Mapper → Domain (Date) → Zod validation
DB (timestamptz) → DTO (ISO string) → UI (display)
```

---

### 3. Optional Fields Strategy

**Decision**: All fields except required enums (`hasPCP`, `hasBeenEvaluated`) are optional

**Rationale**:
- Supports partial saves/drafts (user can save incomplete data)
- Matches Domain schema (Zod `.optional()` fields)
- Conditional validation happens in Domain layer (not DTO layer)

**Example**:
```typescript
// Valid DTO (minimal data)
const minimalInput: Step4InputDTO = {
  providers: { hasPCP: 'Unknown' },
  psychiatrist: { hasBeenEvaluated: 'No' }
}

// Valid DTO (complete data)
const completeInput: Step4InputDTO = {
  providers: {
    hasPCP: 'Yes',
    pcpName: 'Dr. Smith',
    pcpPhone: '555-1234',
    ...
  },
  ...
}
```

---

### 4. Error Codes as `as const` Object

**Decision**: Use `const` object with `as const` instead of TypeScript enum

**Rationale**:
- Simpler than enum (no runtime overhead)
- Enables literal types ('UNAUTHORIZED' vs string)
- Matches Step 3 pattern exactly
- Can be iterated over with `Object.values()`

**Comparison**:
```typescript
// Enum approach (NOT used)
enum ErrorCodes {
  NOT_FOUND = 'NOT_FOUND'
}

// Const object approach (USED)
const ErrorCodes = {
  NOT_FOUND: 'NOT_FOUND'
} as const
```

---

## 🔍 Code Quality Metrics

### TypeScript Strictness
- ✅ No `any` types (0 occurrences)
- ✅ No `unknown` types in DTOs (only in temporary ports.ts stubs)
- ✅ All optional properties use `?` suffix
- ✅ All union types use literal types ('Yes' | 'No', not string)
- ✅ `strictNullChecks` compatible

### Documentation
- ✅ File-level JSDoc comment (purpose, SoC, pattern)
- ✅ Section comments for each major block
- ✅ JSDoc on every exported type (10 types)
- ✅ Inline comments for non-obvious fields (e.g., "ISO date string")
- ✅ No TODO comments (all work complete)

### Maintainability
- ✅ Clear section organization (5 sections)
- ✅ Consistent naming conventions (DTO suffix, Step4 prefix)
- ✅ No magic strings (error codes defined as constants)
- ✅ No duplicated types (checked for existing DTOs)
- ✅ Follows existing patterns (matches Step 3 structure)

---

## 📚 References

**Pattern Source**: `D:\ORBIPAX-PROJECT\src\modules\intake\application\step3\dtos.ts` (188 lines)

**Domain Schema**: `D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\medical-providers\medical-providers.schema.ts`

**Related Files**:
- `application/step4/ports.ts` (created in previous task, will be updated in next task)
- `domain/schemas/medical-providers/index.ts` (barrel export)

**Architecture**:
- **Hexagonal Architecture**: DTOs are the data contracts at layer boundaries
- **SoC**: Application DTOs ≠ Domain models (mappers convert between them)
- **Multi-tenant**: `organizationId` in OutputDTO for RLS enforcement

---

## 📈 Line Count Comparison

| File | Lines | Purpose |
|------|-------|---------|
| Step 3 `dtos.ts` | 188 | Clinical Assessment DTOs (3 complex sections) |
| Step 4 `dtos.ts` | 133 | Medical Providers DTOs (2 simpler sections) |
| **Difference** | -55 (-29%) | Step 4 domain is simpler |

**Why Step 4 is Smaller**:
1. Fewer sections (2 vs 3)
2. No nested array types (like `DiagnosisRecordDTO[]`)
3. Simpler field types (mostly strings, few enums)
4. No complex optional assessments (GAF score, WHODAS domains)

---

## ✅ Summary

**Created**: `src/modules/intake/application/step4/dtos.ts` (133 lines)

**Types Defined**:
- Section DTOs: `ProvidersDTO` (6 fields), `PsychiatristDTO` (8 fields)
- Input/Output: `Step4InputDTO`, `Step4OutputDTO`
- Response: `RepositoryResponse<T>` (discriminated union)
- Aliases: `LoadStep4Response`, `SaveStep4Response`, `ValidateStep4Response`
- Error Codes: `MedicalProvidersErrorCodes` (5 codes)

**Validation**: ✅ TypeScript passes, ✅ ESLint passes, ✅ No PHI, ✅ JSON-serializable, ✅ Pattern consistent with Step 3

**NOT Modified**: `application/step4/ports.ts` (as instructed)

**Next Task**: Update `ports.ts` to import from `dtos.ts` and remove temporary stubs

---

**Report Generated**: 2025-09-30
**Deliverable**: `D:\ORBIPAX-PROJECT\tmp\step4_app_dtos_apply_report.md`
**Status**: ✅ COMPLETE - DTOs ready, ports.ts update pending (next task)
