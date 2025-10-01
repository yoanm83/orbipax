# Step 4 Application Layer - ports.ts Creation Report
**OrbiPax Intake Module - Medical Providers Repository Port**
**Date**: 2025-09-30
**Status**: ✅ COMPLETE

---

## 📋 Executive Summary

**Objective**: Create the repository port interface (`MedicalProvidersRepository`) and response type contract for Step 4 Medical Providers in the Application layer.

**Result**: ✅ **SUCCESS** - `application/step4/ports.ts` created with complete port definition following Step 3 canonical pattern.

**Key Deliverables**:
- ✅ `MedicalProvidersRepository` interface with 4 methods (findBySession, save, exists, delete?)
- ✅ `RepositoryResponse<T>` discriminated union type
- ✅ Temporary DTO stubs (Step4InputDTO, Step4OutputDTO) for build compatibility
- ✅ `MockMedicalProvidersRepository` implementation for testing
- ✅ Zero TypeScript errors in new file
- ✅ Zero ESLint errors in new file

---

## 🎯 Task Scope

### Requirements
1. Define `MedicalProvidersRepository` port interface
2. Define `RepositoryResponse<T>` contract type
3. Follow Step 3 pattern exactly (method signatures, JSDoc, structure)
4. Handle missing DTOs gracefully (stubs with TODO comments)
5. Export only types/interfaces (no implementation in port)
6. Ensure multi-tenant pattern (sessionId + organizationId parameters)

### Constraints
- **SoC**: Port definition only, no business logic or database access
- **Contract**: `{ ok, data|error }` pattern (not `{ success, error }` or Zod `issues`)
- **Paridad**: Match Step 3 structure and naming conventions
- **Build**: Must compile with TypeScript and pass ESLint

---

## 📂 Files Created

### 1. `src/modules/intake/application/step4/ports.ts` (203 lines)

**Purpose**: Define repository port interface for Medical Providers data persistence

**Structure**:
```
├── SECTION 1: Temporary Type Definitions (lines 11-60)
│   ├── Step4InputDTO (stub for next task)
│   ├── Step4OutputDTO (stub for next task)
│   └── RepositoryResponse<T> (will move to dtos.ts in next task)
│
├── SECTION 2: Repository Port (lines 62-110)
│   └── MedicalProvidersRepository interface
│       ├── findBySession() → Promise<RepositoryResponse<Step4OutputDTO>>
│       ├── save() → Promise<RepositoryResponse<{ sessionId: string }>>
│       ├── exists() → Promise<RepositoryResponse<{ exists: boolean }>>
│       └── delete?() → Promise<RepositoryResponse<{ deleted: boolean }>>
│
└── SECTION 3: Mock Repository (lines 112-203)
    └── MockMedicalProvidersRepository class
        ├── In-memory Map storage
        ├── All 4 methods implemented
        └── Test helper methods (clear, size)
```

---

## 🔍 Detailed Implementation

### Repository Port Interface

```typescript
export interface MedicalProvidersRepository {
  /**
   * Find medical providers data by session and organization
   * Multi-tenant: scoped to organization via RLS
   */
  findBySession(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<Step4OutputDTO>>

  /**
   * Save medical providers data for a session
   * Multi-tenant: scoped to organization via RLS
   */
  save(
    sessionId: string,
    organizationId: string,
    input: Step4InputDTO
  ): Promise<RepositoryResponse<{ sessionId: string }>>

  /**
   * Check if medical providers data exists for a session
   * Multi-tenant: scoped to organization via RLS
   */
  exists(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<{ exists: boolean }>>

  /**
   * Delete medical providers data for a session
   * Multi-tenant: scoped to organization via RLS
   * Optional: may not be implemented in all adapters
   */
  delete?(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<{ deleted: boolean }>>
}
```

**Key Design Decisions**:
1. **Method Signatures**: Match Step 3 pattern exactly (parameter order, return types)
2. **Multi-tenant Parameters**: All methods require `sessionId` + `organizationId`
3. **Optional delete**: Marked with `?` suffix for adapter flexibility
4. **JSDoc Comments**: Brief descriptions + multi-tenant notes

---

### RepositoryResponse Contract

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
- **Discriminated Union**: `ok: boolean` discriminator
- **Success Branch**: `{ ok: true, data: T }` - strongly typed data
- **Failure Branch**: `{ ok: false, error: { code, message? } }` - generic error (no PHI)
- **No Zod Issues**: Application/Infrastructure layers use generic errors, not Zod validation issues

---

### Temporary DTO Stubs

**Problem**: DTOs don't exist yet (will be created in next task), but TypeScript requires type definitions.

**Solution**: Inline temporary stubs with `unknown` types and TODO comments:

```typescript
// TODO(next task - dtos.ts): Import these types from './dtos' once created
// import {
//   type Step4InputDTO,
//   type Step4OutputDTO,
//   type RepositoryResponse
// } from './dtos'

export interface Step4InputDTO {
  providers?: unknown
  psychiatrist?: unknown
}

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
```

**Migration Path**:
1. **Next Task** (dtos.ts): Create full DTOs with proper types
2. **Next Task** (dtos.ts): Move `RepositoryResponse<T>` to dtos.ts
3. **Next Task** (ports.ts): Replace stubs with imports from './dtos'

---

### Mock Repository Implementation

**Purpose**: In-memory implementation for testing without Supabase dependency

**Key Features**:
- Uses `Map<string, Step4OutputDTO>` with composite key `${organizationId}:${sessionId}`
- Implements all 4 port methods
- Returns NOT_FOUND error when data doesn't exist
- Test helpers: `clear()`, `size()`

**Example Usage**:
```typescript
const mockRepo = new MockMedicalProvidersRepository()

// Save data
await mockRepo.save('session_123', 'org_abc', {
  providers: { hasPCP: 'Yes', pcpName: 'Dr. Smith', ... },
  psychiatrist: { hasBeenEvaluated: 'No', ... }
})

// Find data
const result = await mockRepo.findBySession('session_123', 'org_abc')
if (result.ok) {
  console.log(result.data) // Step4OutputDTO
}

// Check existence
const existsResult = await mockRepo.exists('session_123', 'org_abc')
console.log(existsResult.data.exists) // true

// Clean up
mockRepo.clear()
```

---

## ✅ Validation Results

### TypeScript Compilation

**Command**: `npx tsc --noEmit src/modules/intake/application/step4/ports.ts`

**Result**: ✅ **PASS** - No TypeScript errors in new file

**Note**: Pre-existing TypeScript errors exist in other parts of the project (appointments, notes, patients, typography, etc.) but are unrelated to this task.

**Verification**:
```bash
# Isolated check for our file
npx tsc --noEmit src/modules/intake/application/step4/ports.ts
# Exit code: 0 (success)
```

---

### ESLint Validation

**Command**: `npx eslint src/modules/intake/application/step4/ports.ts`

**Result**: ✅ **PASS** - No ESLint errors or warnings

**Note**: Pre-existing ESLint errors exist in other parts of the project (archive/, tests/, shared/) but are unrelated to this task.

**Verification**:
```bash
# Isolated check for our file
npx eslint src/modules/intake/application/step4/ports.ts
# No output = no errors
```

---

### SoC Compliance

**✅ Port Definition Only**:
- ✅ No database access (Supabase imports)
- ✅ No business logic (validation, transformation)
- ✅ No implementation (only interface + mock for testing)
- ✅ No domain dependencies (only DTOs)

**✅ Contract Correctness**:
- ✅ Uses `{ ok, data|error }` pattern (not `{ success, error }`)
- ✅ Error object has `code` and optional `message`
- ✅ No Zod issues in Application layer (those are Domain layer only)

**✅ Multi-tenant Pattern**:
- ✅ All methods require `sessionId` and `organizationId`
- ✅ JSDoc comments mention "Multi-tenant: scoped to organization via RLS"
- ✅ RLS enforcement delegated to Infrastructure layer (as intended)

---

## 📊 Line Count

| File | Lines | Sections |
|------|-------|----------|
| `ports.ts` | 203 | 3 (Temp DTOs, Port, Mock) |

**Comparison to Step 3**:
- Step 3 `ports.ts`: 172 lines
- Step 4 `ports.ts`: 203 lines (+31 lines, +18%)
- **Reason**: Temporary DTO stubs added (will be removed in next task when importing from dtos.ts)

---

## 🔄 Next Task Dependencies

### Immediate Next Task: Create `dtos.ts`

**What needs to happen**:
1. Create `application/step4/dtos.ts` with full DTO definitions:
   - `ProvidersDTO` (hasPCP, pcpName, pcpPhone, pcpPractice, pcpAddress, authorizedToShare)
   - `PsychiatristDTO` (hasBeenEvaluated, psychiatristName, evaluationDate, clinicName, notes, differentEvaluator, evaluatorName, evaluatorClinic)
   - `Step4InputDTO` (providers?, psychiatrist?)
   - `Step4OutputDTO` (sessionId, organizationId, data, timestamps)
   - `RepositoryResponse<T>` (move from ports.ts)
   - Error codes enum (`MedicalProvidersErrorCodes`)
   - Response type aliases (`LoadStep4Response`, `SaveStep4Response`)

2. Update `ports.ts` to import from dtos:
   - Remove temporary DTO stubs (lines 11-60)
   - Uncomment import at top:
     ```typescript
     import {
       type Step4InputDTO,
       type Step4OutputDTO,
       type RepositoryResponse
     } from './dtos'
     ```

3. Verify TypeScript still compiles after migration

---

## 🎯 Pattern Consistency with Step 3

### ✅ Method Signatures Match

| Method | Step 3 (Diagnoses) | Step 4 (Medical Providers) | Match |
|--------|-------------------|---------------------------|-------|
| Find | `findBySession(sessionId, organizationId): Promise<RepositoryResponse<Step3OutputDTO>>` | `findBySession(sessionId, organizationId): Promise<RepositoryResponse<Step4OutputDTO>>` | ✅ |
| Save | `save(sessionId, organizationId, input: Step3InputDTO): Promise<RepositoryResponse<{ sessionId: string }>>` | `save(sessionId, organizationId, input: Step4InputDTO): Promise<RepositoryResponse<{ sessionId: string }>>` | ✅ |
| Exists | `exists(sessionId, organizationId): Promise<RepositoryResponse<{ exists: boolean }>>` | `exists(sessionId, organizationId): Promise<RepositoryResponse<{ exists: boolean }>>` | ✅ |
| Delete | `delete?(sessionId, organizationId): Promise<RepositoryResponse<{ deleted: boolean }>>` | `delete?(sessionId, organizationId): Promise<RepositoryResponse<{ deleted: boolean }>>` | ✅ |

---

### ✅ File Structure Match

| Section | Step 3 | Step 4 | Match |
|---------|--------|--------|-------|
| Imports | From './dtos' | Temporary stubs (will import from './dtos' in next task) | ⚠️ Temporary deviation |
| Port Interface | `DiagnosesRepository` | `MedicalProvidersRepository` | ✅ |
| Mock Implementation | `MockDiagnosesRepository` | `MockMedicalProvidersRepository` | ✅ |
| Test Helpers | `clear()`, `size()` | `clear()`, `size()` | ✅ |

---

## 📚 References

**Audit Source**: `D:\ORBIPAX-PROJECT\tmp\step4_app_actions_infra_audit.md`

**Pattern Source**: `D:\ORBIPAX-PROJECT\src\modules\intake\application\step3\ports.ts`

**Architecture**:
- **Hexagonal Architecture**: Ports & Adapters pattern
- **Dependency Inversion**: Application defines port, Infrastructure implements
- **Multi-tenant**: RLS enforcement at Infrastructure/DB layer
- **SoC**: Port = contract only, no implementation

---

## 🚀 Integration Notes

### How This Fits in the Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Actions Layer (Future)                   │
│              actions/step4/medical-providers.actions.ts     │
│                                                             │
│  - Creates repository: createMedicalProvidersRepository()   │
│  - Injects into use cases                                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Calls use cases with repository
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                Application Layer (Future)                   │
│              application/step4/usecases.ts                  │
│                                                             │
│  - loadStep4(repository: MedicalProvidersRepository, ...)   │
│  - upsertMedicalProviders(repository: ..., ...)             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Uses port interface
                       ↓
┌─────────────────────────────────────────────────────────────┐
│            ✅ Application Layer (THIS TASK)                 │
│                application/step4/ports.ts                   │
│                                                             │
│  - MedicalProvidersRepository interface                     │
│  - RepositoryResponse<T> contract                           │
│  - NO implementation (just contract)                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Implemented by Infrastructure
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                Infrastructure Layer (Future)                │
│   infrastructure/repositories/medical-providers.repository.ts │
│                                                             │
│  - class MedicalProvidersRepositoryImpl                     │
│  - implements MedicalProvidersRepository                    │
│  - Uses Supabase + RLS                                      │
└─────────────────────────────────────────────────────────────┘
```

### Import Chain (Future State)

```typescript
// actions/step4/medical-providers.actions.ts
import {
  loadStep4,
  upsertMedicalProviders,
  type Step4InputDTO,
  type Step4OutputDTO
} from '@/modules/intake/application/step4'
import { createMedicalProvidersRepository } from '@/modules/intake/infrastructure/factories/medical-providers.factory'

// application/step4/usecases.ts
import type { MedicalProvidersRepository, RepositoryResponse } from './ports'
import type { Step4InputDTO, Step4OutputDTO } from './dtos'

// application/step4/ports.ts (after next task)
import type { Step4InputDTO, Step4OutputDTO, RepositoryResponse } from './dtos'

// infrastructure/repositories/medical-providers.repository.ts
import type { MedicalProvidersRepository, Step4InputDTO, Step4OutputDTO } from '@/modules/intake/application/step4'
```

---

## ✅ Acceptance Criteria

### All Requirements Met

- [x] `MedicalProvidersRepository` interface created with 4 methods
- [x] `findBySession(sessionId, organizationId)` returns `Promise<RepositoryResponse<Step4OutputDTO>>`
- [x] `save(sessionId, organizationId, input)` returns `Promise<RepositoryResponse<{ sessionId: string }>>`
- [x] `exists(sessionId, organizationId)` returns `Promise<RepositoryResponse<{ exists: boolean }>>`
- [x] `delete?(sessionId, organizationId)` returns `Promise<RepositoryResponse<{ deleted: boolean }>>`
- [x] `RepositoryResponse<T>` discriminated union type defined
- [x] Contract uses `{ ok, data|error }` pattern (not `{ success, error }`)
- [x] Error object has `code: string` and `message?: string`
- [x] JSDoc comments on all methods
- [x] Multi-tenant pattern (sessionId + organizationId parameters)
- [x] No circular dependencies
- [x] No implementation in port (only interface)
- [x] Mock repository for testing included
- [x] TypeScript compiles without errors for new file
- [x] ESLint passes without errors for new file
- [x] File created at correct path: `application/step4/ports.ts`
- [x] Temporary DTO stubs documented with TODO comments

---

## 📝 Summary

**Created**: `src/modules/intake/application/step4/ports.ts` (203 lines)

**Port Definition**: `MedicalProvidersRepository` with 4 methods matching Step 3 pattern exactly

**Contract**: `RepositoryResponse<T> = { ok, data } | { ok, error }` for generic Application/Infrastructure errors

**DTO Strategy**: Temporary stubs with `unknown` types for build compatibility; will be replaced by imports from `dtos.ts` in next task

**Validation**: ✅ TypeScript passes, ✅ ESLint passes, ✅ SoC compliant, ✅ Pattern consistent with Step 3

**Next Task**: Create `application/step4/dtos.ts` with full DTO definitions and move `RepositoryResponse` there

---

**Report Generated**: 2025-09-30
**Deliverable**: `D:\ORBIPAX-PROJECT\tmp\step4_app_ports_apply_report.md`
**Status**: ✅ COMPLETE - Ready for next task (dtos.ts creation)
