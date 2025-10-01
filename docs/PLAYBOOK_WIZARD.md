# OrbiPax Intake Wizard - Implementation Playbook

**Version:** 1.0
**Last Updated:** 2025-09-29
**Status:** ✅ Production Standard (based on Step 2 Insurance)

---

## Table of Contents

1. [Overview](#overview)
2. [11-Phase Pipeline](#11-phase-pipeline)
3. [Canonical Contracts](#canonical-contracts)
4. [File Structure & Barrels](#file-structure--barrels)
5. [Database & RLS Standards](#database--rls-standards)
6. [Implementation Checklists](#implementation-checklists)
7. [Antipatterns to Avoid](#antipatterns-to-avoid)
8. [Validation Gates](#validation-gates)

---

## Overview

### Purpose

This playbook standardizes the implementation of **all intake wizard steps** (Steps 1-11) to ensure:
- **Architectural consistency** across all steps
- **Security-first design** with RLS and multi-tenant isolation
- **Contract alignment** between UI, Application, Domain, and Infrastructure layers
- **Zero regressions** through systematic AUDIT → APPLY workflow

### Reference Implementation

**Step 2 (Insurance & Eligibility)** is the **gold standard** for all wizard steps.

**Key Characteristics:**
- ✅ Clean layer separation (UI → Actions → Application → Domain → Infrastructure)
- ✅ Canonical `{ ok, data|error }` contracts across all layers
- ✅ RLS enforcement with explicit `organization_id` filtering
- ✅ Generic HIPAA-safe error messages
- ✅ Barrel exports for clean imports
- ✅ exactOptionalPropertyTypes compliance

---

## 11-Phase Pipeline

Each wizard step follows this **sequential pipeline** from initial audit through production deployment.

### Phase 1: Controlled Purge (if needed)

**Objective:** Remove deprecated/conflicting artifacts before starting clean implementation

**Actions:**
- [ ] Audit for duplicate schema locations (e.g., `step3/` vs `diagnoses-clinical/`)
- [ ] Search codebase for references to old paths
- [ ] Remove deprecated folders/files only after confirming zero references
- [ ] Run TypeScript validation to confirm no broken imports

**Criteria for "Done":**
- No duplicate schemas or conflicting barrel exports
- TypeScript compilation passes (no new errors introduced)
- Error count reduced or unchanged

**Allowed Operations:**
- `rm -rf <deprecated-folder>` (after verification)
- Update imports if redirecting to canonical paths

---

### Phase 2: Domain Schema

**Objective:** Define Zod validation schemas and domain types

**Files to Create/Update:**
```
src/modules/intake/domain/schemas/<step-name>/
├── <step-name>.schema.ts       # Zod schemas + types
└── index.ts                     # Barrel export
```

**Actions:**
- [ ] Create Zod schemas for all domain entities (e.g., `diagnosesSchema`, `psychiatricEvaluationSchema`)
- [ ] Export TypeScript types inferred from Zod (`z.infer<typeof schema>`)
- [ ] Create validation helper functions (e.g., `validateStep3()`, `validateStep3Partial()`)
- [ ] Export constants (enums, validation limits)
- [ ] Create barrel export (`index.ts`) exporting all schemas, types, helpers, and constants

**Contract:**
- Schemas use `z.object()`, `z.enum()`, `z.array()` patterns
- Optional fields use `.optional()` (not `.nullable()` unless explicitly needed)
- Validation functions return `{ ok: true, data: T } | { ok: false, issues: ZodIssue[] }`
- No business logic in schemas (pure validation)

**Criteria for "Done":**
- All domain entities have Zod schemas
- Barrel export exists and exports all artifacts
- TypeScript compilation passes
- ESLint passes

**Example (Step 3):**
```typescript
// diagnoses-clinical/diagnoses-clinical.schema.ts
export const diagnosesSchema = z.object({
  primaryDiagnosis: z.string().optional(),
  secondaryDiagnoses: z.array(z.string()).default([]),
  // ...
})

export type Diagnoses = z.infer<typeof diagnosesSchema>

export function validateStep3(data: unknown) {
  const result = step3DataSchema.safeParse(data)
  return result.success
    ? { ok: true as const, data: result.data }
    : { ok: false as const, issues: result.error.issues }
}

// diagnoses-clinical/index.ts (barrel)
export {
  diagnosesSchema,
  type Diagnoses,
  validateStep3,
  DIAGNOSIS_TYPES
} from './diagnoses-clinical.schema'
```

---

### Phase 3: Application Layer (DTOs)

**Objective:** Define Data Transfer Objects for inter-layer communication

**Files to Create:**
```
src/modules/intake/application/<step-name>/
├── dtos.ts        # DTOs and response types
└── index.ts       # Barrel export (updated later)
```

**Actions:**
- [ ] Create Input DTO (data from UI → Application)
- [ ] Create Output DTO (data from Application → UI)
- [ ] Create section DTOs (e.g., `DiagnosesDTO`, `InsuranceCoverageDTO`)
- [ ] Define `RepositoryResponse<T>` type (if not already in shared)
- [ ] Define error code constants (e.g., `DiagnosesErrorCodes`)

**Contract:**
```typescript
// Input DTO (from UI)
export interface Step<N>InputDTO {
  section1: Section1DTO
  section2: Section2DTO
  // ...
}

// Output DTO (to UI)
export interface Step<N>OutputDTO {
  sessionId: string
  organizationId: string
  data: {
    section1: Section1DTO
    section2: Section2DTO
  }
  lastModified?: string  // ISO date string
  completedAt?: string   // ISO date string
}

// Repository response (canonical contract)
export interface RepositoryResponse<T> {
  ok: boolean
  data?: T
  error?: {
    code: string
    message?: string  // Generic only, no PHI
  }
}

// Error codes (string constants)
export const Step<N>ErrorCodes = {
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  SAVE_FAILED: 'SAVE_FAILED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  UNKNOWN: 'UNKNOWN'
} as const
```

**Criteria for "Done":**
- All DTOs defined with explicit types
- `RepositoryResponse<T>` defined or imported from shared
- Error codes exported as const object
- Optional fields use `?` (not `| undefined`)
- TypeScript compilation passes

---

### Phase 4: Application Layer (Ports)

**Objective:** Define repository interface (port) for Infrastructure layer

**Files to Create:**
```
src/modules/intake/application/<step-name>/
├── ports.ts       # Repository interface + mock
└── index.ts       # Barrel export (updated)
```

**Actions:**
- [ ] Define repository interface with standard methods:
  - `findBySession(sessionId, organizationId): Promise<RepositoryResponse<OutputDTO>>`
  - `save(sessionId, organizationId, input): Promise<RepositoryResponse<{ sessionId }>>`
  - `exists(sessionId, organizationId): Promise<RepositoryResponse<{ exists: boolean }>>`
  - `delete?(sessionId, organizationId): Promise<RepositoryResponse<{ deleted: boolean }>>`
- [ ] Create MockRepository for testing (returns hardcoded data)
- [ ] Update barrel export to export interface (type) and mock (value)

**Contract:**
```typescript
export interface Step<N>Repository {
  findBySession(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<Step<N>OutputDTO>>

  save(
    sessionId: string,
    organizationId: string,
    input: Step<N>InputDTO
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

**Mock Repository:**
```typescript
export class MockStep<N>Repository implements Step<N>Repository {
  async findBySession() {
    return {
      ok: true,
      data: { sessionId: 'mock', organizationId: 'mock', data: { /* ... */ } }
    }
  }
  // ... other methods
}
```

**Criteria for "Done":**
- Repository interface defined
- All methods use `RepositoryResponse<T>` return type
- Mock repository implements interface
- Barrel export includes `type` for interface, value export for mock
- TypeScript compilation passes

---

### Phase 5: Application Layer (Mappers)

**Objective:** Transform between Domain models and DTOs

**Files to Create:**
```
src/modules/intake/application/<step-name>/
├── mappers.ts     # Domain ↔ DTO transformations
└── index.ts       # Barrel export (updated)
```

**Actions:**
- [ ] Create `toDomain()` mapper (DTO → Domain model)
- [ ] Create `toDTO()` mapper (Domain model → DTO)
- [ ] Create `createEmpty()` helper (empty DTO structure)
- [ ] Apply **exactOptionalPropertyTypes** pattern (conditional spreading for optional fields)

**Contract:**
```typescript
// DTO → Domain
export function toStep<N>Domain(dto: Step<N>InputDTO): Step<N>Data {
  return {
    section1: dto.section1,
    section2: dto.section2,
    // ...
  }
}

// Domain → DTO
export function toStep<N>DTO(domain: Step<N>Data): Step<N>OutputDTO {
  return {
    sessionId: domain.sessionId,
    organizationId: domain.organizationId,
    data: {
      section1: domain.section1,
      section2: domain.section2
    },
    // exactOptionalPropertyTypes pattern:
    ...(domain.lastModified && { lastModified: domain.lastModified }),
    ...(domain.completedAt && { completedAt: domain.completedAt })
  }
}

// Empty structure helper
export function createEmptyOutput(
  sessionId: string,
  organizationId: string
): Step<N>OutputDTO {
  return {
    sessionId,
    organizationId,
    data: {
      section1: {},
      section2: {}
    }
  }
}
```

**exactOptionalPropertyTypes Pattern:**
```typescript
// ❌ Wrong: Explicit undefined
{ optionalField: value ?? undefined }  // Type error!

// ✅ Correct: Conditional spreading
{ ...(value && { optionalField: value }) }  // Omits field if falsy
```

**Criteria for "Done":**
- All DTO ↔ Domain mappers implemented
- Optional fields use conditional spreading
- Empty helper returns valid OutputDTO
- TypeScript compilation passes (no exactOptionalPropertyTypes errors)

---

### Phase 6: Application Layer (Use Cases)

**Objective:** Implement business logic that orchestrates domain validation and repository calls

**Files to Create:**
```
src/modules/intake/application/<step-name>/
├── usecases.ts    # Business operations
└── index.ts       # Barrel export (updated)
```

**Actions:**
- [ ] Implement `loadStep<N>(repository, sessionId, organizationId)` use case
- [ ] Implement `saveStep<N>(repository, input, sessionId, organizationId)` use case
- [ ] Call domain validation before persistence
- [ ] Map errors to generic messages
- [ ] Return NOT_FOUND as empty structure (graceful degradation)

**Contract:**
```typescript
export async function loadStep<N>(
  repository: Step<N>Repository,
  sessionId: string,
  organizationId: string
): Promise<RepositoryResponse<Step<N>OutputDTO>> {
  // 1. Validate inputs
  if (!sessionId || !organizationId) {
    return { ok: false, error: { code: 'VALIDATION_FAILED', message: '...' } }
  }

  // 2. Call repository
  const result = await repository.findBySession(sessionId, organizationId)

  // 3. Handle NOT_FOUND → return empty structure
  if (!result.ok && result.error?.code === 'NOT_FOUND') {
    return {
      ok: true,
      data: createEmptyOutput(sessionId, organizationId)
    }
  }

  // 4. Return result
  return result
}

export async function saveStep<N>(
  repository: Step<N>Repository,
  input: Step<N>InputDTO,
  sessionId: string,
  organizationId: string
): Promise<RepositoryResponse<{ sessionId: string }>> {
  // 1. Validate inputs
  if (!sessionId || !organizationId) {
    return { ok: false, error: { code: 'VALIDATION_FAILED', message: '...' } }
  }

  // 2. Convert DTO → Domain
  const domainData = toStep<N>Domain(input)

  // 3. Validate with Zod
  const validationResult = step<N>DataSchema.safeParse(domainData)
  if (!validationResult.success) {
    return { ok: false, error: { code: 'VALIDATION_FAILED', message: '...' } }
  }

  // 4. Persist to repository
  const result = await repository.save(sessionId, organizationId, input)

  // 5. Return result
  return result
}
```

**Criteria for "Done":**
- Load use case returns empty structure on NOT_FOUND
- Save use case validates with Zod before persistence
- Error messages are generic (no PHI, no Zod details)
- Use cases accept repository via dependency injection
- TypeScript compilation passes

---

### Phase 7: Application Layer (Barrel Export)

**Objective:** Consolidate all Application layer exports in single index.ts

**File to Update:**
```
src/modules/intake/application/<step-name>/index.ts
```

**Actions:**
- [ ] Export all DTOs (types only)
- [ ] Export error codes (const)
- [ ] Export repository interface (type)
- [ ] Export mock repository (value)
- [ ] Export mappers (functions)
- [ ] Export use cases (functions)

**Contract:**
```typescript
// DTOs
export type {
  Step<N>InputDTO,
  Step<N>OutputDTO,
  Section1DTO,
  RepositoryResponse
} from './dtos'

// Error codes
export { Step<N>ErrorCodes } from './dtos'

// Ports
export type { Step<N>Repository } from './ports'
export { MockStep<N>Repository } from './ports'

// Mappers
export {
  toStep<N>Domain,
  toStep<N>DTO,
  createEmptyOutput
} from './mappers'

// Use cases
export {
  loadStep<N>,
  saveStep<N>
} from './usecases'
```

**Criteria for "Done":**
- All Application layer exports consolidated
- Types exported with `type` keyword
- Values (functions, constants) exported without `type`
- No `export *` wildcards (explicit exports only for clarity)
- Other modules import from barrel, not individual files

---

### Phase 8: Actions Layer (Server Actions)

**Objective:** Create Next.js server actions that guard auth, resolve organization, and delegate to Application use cases

**Files to Create:**
```
src/modules/intake/actions/<step-name>/
├── <step-name>.actions.ts    # Server actions
└── index.ts                   # Barrel export
```

**Actions:**
- [ ] Mark file with `'use server'` directive
- [ ] Import `resolveUserAndOrg()` from shared auth
- [ ] Create `loadStep<N>Action()` server action
- [ ] Create `saveStep<N>Action(input)` server action
- [ ] Call Application use cases with resolved auth context
- [ ] Map Application errors to generic Action errors

**Contract:**
```typescript
'use server'

import { resolveUserAndOrg } from '@/shared/lib/current-user.server'
import {
  loadStep<N>,
  saveStep<N>,
  type Step<N>InputDTO,
  type Step<N>OutputDTO,
  Step<N>ErrorCodes
} from '@/modules/intake/application/<step-name>'
import { createStep<N>Repository } from '@/modules/intake/infrastructure/factories/<step-name>.factory'

type ActionResponse<T = void> = {
  ok: boolean
  data?: T
  error?: {
    code: string
    message?: string
  }
}

export async function loadStep<N>Action(): Promise<ActionResponse<Step<N>OutputDTO>> {
  try {
    // Auth guard
    const { userId, organizationId } = await resolveUserAndOrg()

    // Validate organization context
    if (!organizationId) {
      return {
        ok: false,
        error: {
          code: 'ORGANIZATION_MISMATCH',
          message: 'Invalid organization context'
        }
      }
    }

    // Session ID (deterministic pattern)
    const sessionId = `session_${userId}_intake`

    // Create repository
    const repository = createStep<N>Repository()

    // Delegate to Application layer
    const result = await loadStep<N>(repository, sessionId, organizationId)

    // Map to Action response
    if (!result.ok) {
      return {
        ok: false,
        error: {
          code: result.error?.code ?? Step<N>ErrorCodes.UNKNOWN,
          message: 'Failed to load data'  // Generic
        }
      }
    }

    return { ok: true, data: result.data }
  } catch {
    return {
      ok: false,
      error: {
        code: Step<N>ErrorCodes.UNKNOWN,
        message: 'An unexpected error occurred'
      }
    }
  }
}

export async function saveStep<N>Action(
  input: Step<N>InputDTO
): Promise<ActionResponse<{ sessionId: string }>> {
  try {
    // Auth guard
    const { userId, organizationId } = await resolveUserAndOrg()

    if (!organizationId) {
      return {
        ok: false,
        error: {
          code: 'ORGANIZATION_MISMATCH',
          message: 'Invalid organization context'
        }
      }
    }

    const sessionId = `session_${userId}_intake`

    const repository = createStep<N>Repository()

    const result = await saveStep<N>(repository, input, sessionId, organizationId)

    if (!result.ok) {
      return {
        ok: false,
        error: {
          code: result.error?.code ?? Step<N>ErrorCodes.UNKNOWN,
          message: 'Failed to save data'
        }
      }
    }

    return { ok: true, data: result.data }
  } catch {
    return {
      ok: false,
      error: {
        code: Step<N>ErrorCodes.UNKNOWN,
        message: 'An unexpected error occurred'
      }
    }
  }
}
```

**Criteria for "Done":**
- `'use server'` directive at top of file
- `resolveUserAndOrg()` called for auth
- organization_id resolved server-side (not from client input)
- Generic error messages only (no Application error details)
- Try-catch wraps all operations
- Barrel export (`index.ts`) exports actions

---

### Phase 9: Infrastructure Layer (Repository + Factory)

**Objective:** Implement repository with Supabase queries and RLS enforcement

**Files to Create:**
```
src/modules/intake/infrastructure/repositories/<step-name>.repository.ts
src/modules/intake/infrastructure/factories/<step-name>.factory.ts
```

**Actions:**
- [ ] Create repository class implementing Application port interface
- [ ] Implement `findBySession()` with Supabase query
- [ ] Implement `save()` with upsert logic
- [ ] Implement `exists()` with count query
- [ ] Implement `delete()` (optional)
- [ ] Use authenticated Supabase client (no service-role)
- [ ] Apply explicit `organization_id` filtering (RLS + explicit filter)
- [ ] Map DB columns (snake_case) ↔ DTOs (camelCase)
- [ ] Return generic error messages (no raw Supabase errors)
- [ ] Create factory function for DI

**Contract:**
```typescript
// Repository
import { createServerClient } from '@/shared/lib/supabase.client'
import type {
  Step<N>Repository,
  RepositoryResponse,
  Step<N>InputDTO,
  Step<N>OutputDTO
} from '@/modules/intake/application/<step-name>'

export class Step<N>RepositoryImpl implements Step<N>Repository {
  async findBySession(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<Step<N>OutputDTO>> {
    try {
      const supabase = await createServerClient()

      const { data, error } = await supabase
        .schema('orbipax_core')
        .from('<step_name>_data')
        .select('*')
        .eq('session_id', sessionId)
        .eq('organization_id', organizationId)  // Explicit filter
        .maybeSingle()

      if (error) {
        return {
          ok: false,
          error: {
            code: 'UNKNOWN',
            message: 'Failed to retrieve data'
          }
        }
      }

      if (!data) {
        return {
          ok: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Data not found'
          }
        }
      }

      // Map DB row → DTO (snake_case → camelCase)
      const output: Step<N>OutputDTO = {
        sessionId: data.session_id,
        organizationId: data.organization_id,
        data: {
          section1: data.section1_data,
          section2: data.section2_data
        },
        ...(data.last_modified && { lastModified: data.last_modified }),
        ...(data.completed_at && { completedAt: data.completed_at })
      }

      return { ok: true, data: output }
    } catch {
      return {
        ok: false,
        error: {
          code: 'UNKNOWN',
          message: 'An unexpected error occurred'
        }
      }
    }
  }

  async save(
    sessionId: string,
    organizationId: string,
    input: Step<N>InputDTO
  ): Promise<RepositoryResponse<{ sessionId: string }>> {
    try {
      const supabase = await createServerClient()

      // Map DTO → DB payload (camelCase → snake_case)
      const payload = {
        session_id: sessionId,
        organization_id: organizationId,
        section1_data: input.section1,
        section2_data: input.section2,
        last_modified: new Date().toISOString()
      }

      const { error } = await supabase
        .schema('orbipax_core')
        .from('<step_name>_data')
        .upsert(payload, {
          onConflict: 'session_id,organization_id'
        })

      if (error) {
        return {
          ok: false,
          error: {
            code: 'UNKNOWN',
            message: 'Failed to save data'
          }
        }
      }

      return { ok: true, data: { sessionId } }
    } catch {
      return {
        ok: false,
        error: {
          code: 'UNKNOWN',
          message: 'An unexpected error occurred'
        }
      }
    }
  }

  // exists() and delete() implementations...
}

// Factory
export function createStep<N>Repository(): Step<N>Repository {
  return new Step<N>RepositoryImpl()
}
```

**Criteria for "Done":**
- Repository implements all port interface methods
- Uses authenticated Supabase client (RLS active)
- Explicit `organization_id` filtering in all queries
- snake_case ↔ camelCase mapping applied
- Generic error messages (no raw Supabase errors)
- Factory function exports repository instance
- TypeScript compilation passes
- ESLint passes

---

### Phase 10: UI State Slice (Optional)

**Objective:** Create Zustand store for UI-only state (loading, errors, dirty flags)

**File to Create:**
```
src/modules/intake/state/slices/<step-name>-ui.slice.ts
```

**Actions:**
- [ ] Create Zustand store with UI-only state
- [ ] Add loading flags (`isLoading`, `isSaving`)
- [ ] Add error flags (`loadError`, `saveError`)
- [ ] Add form flags (`isDirty`, `lastSavedAt`)
- [ ] Create actions to update flags
- [ ] Wrap store with devtools middleware

**Contract:**
```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface Step<N>UiState {
  // Loading states
  isLoading: boolean
  isSaving: boolean

  // Error states (generic messages only)
  loadError: string | null
  saveError: string | null

  // Form states
  isDirty: boolean
  lastSavedAt: string | null

  // Actions
  markLoading: (loading: boolean) => void
  markSaving: (saving: boolean) => void
  setLoadError: (error: string | null) => void
  setSaveError: (error: string | null) => void
  markDirty: () => void
  markSaved: (timestamp?: string) => void
  resetStep<N>Ui: () => void
}

export const useStep<N>UiStore = create<Step<N>UiState>()(
  devtools(
    (set) => ({
      // Initial state
      isLoading: false,
      isSaving: false,
      loadError: null,
      saveError: null,
      isDirty: false,
      lastSavedAt: null,

      // Actions
      markLoading: (loading) =>
        set({ isLoading: loading }, false, 'step<N>-ui/markLoading'),

      markSaving: (saving) =>
        set({ isSaving: saving }, false, 'step<N>-ui/markSaving'),

      setLoadError: (error) =>
        set({ loadError: error }, false, 'step<N>-ui/setLoadError'),

      setSaveError: (error) =>
        set({ saveError: error }, false, 'step<N>-ui/setSaveError'),

      markDirty: () =>
        set({ isDirty: true }, false, 'step<N>-ui/markDirty'),

      markSaved: (timestamp) =>
        set(
          { isDirty: false, lastSavedAt: timestamp ?? new Date().toISOString() },
          false,
          'step<N>-ui/markSaved'
        ),

      resetStep<N>Ui: () =>
        set(
          {
            isLoading: false,
            isSaving: false,
            loadError: null,
            saveError: null,
            isDirty: false,
            lastSavedAt: null
          },
          false,
          'step<N>-ui/reset'
        )
    }),
    { name: 'step<N>-ui' }
  )
)
```

**Criteria for "Done":**
- UI state only (no domain data, no PHI)
- All flags initialized to false/null
- Actions use devtools middleware with action names
- Store exported with `use*` naming convention
- TypeScript compilation passes

---

### Phase 11: E2E Smoke Test (Manual or Automated)

**Objective:** Validate complete flow from UI → Actions → Application → Repository → Database

**Actions:**
- [ ] Create test page or mount component in development route
- [ ] Call `loadStep<N>Action()` and verify response
- [ ] Call `saveStep<N>Action(payload)` and verify success
- [ ] Call `loadStep<N>Action()` again and verify data persisted
- [ ] Attempt cross-tenant access (should fail with RLS)
- [ ] Verify TypeScript and ESLint pass
- [ ] Document results in `/tmp/<step>_e2e_smoke_test_report.md`

**Test Scenarios:**
1. **Happy Path:** Save minimal payload, load back, verify data integrity
2. **RLS Enforcement:** User A cannot access User B's data (different orgs)
3. **Validation Failure:** Invalid payload rejected with VALIDATION_FAILED
4. **Idempotency:** Multiple saves to same sessionId update (not duplicate)

**Criteria for "Done":**
- Save succeeds with `{ ok: true, data: { sessionId } }`
- Load returns saved data
- Cross-tenant access denied (NOT_FOUND or empty structure)
- TypeScript/ESLint pass
- E2E report generated in `/tmp`

---

## Canonical Contracts

### Success Response

**Format:**
```typescript
{
  ok: true,
  data: T
}
```

**Rules:**
- `ok` field is `true` (boolean literal)
- `data` field contains the success payload
- No `error` field present

---

### Error Response

**Format:**
```typescript
{
  ok: false,
  error: {
    code: string,
    message?: string  // Optional, generic only
  }
}
```

**Rules:**
- `ok` field is `false` (boolean literal)
- `error.code` is a string constant (e.g., `'NOT_FOUND'`, `'VALIDATION_FAILED'`)
- `error.message` is optional, generic, and **never contains PHI**
- No `data` field present

---

### Validation Response (Domain Layer)

**Format:**
```typescript
// Success
{
  ok: true,
  data: T
}

// Failure
{
  ok: false,
  issues: ZodIssue[]
}
```

**Rules:**
- Domain validation returns `{ ok, data|issues }` (not `{ ok, error }`)
- Application layer converts `issues` → `error.code: 'VALIDATION_FAILED'`
- Actions layer replaces detailed issues with generic message

---

### Error Code Standards

**Standard Codes (all steps):**
- `NOT_FOUND` - Resource does not exist
- `VALIDATION_FAILED` - Input validation failed (Zod or parameter checks)
- `SAVE_FAILED` - Persistence operation failed
- `UNAUTHORIZED` - Authentication failed or missing
- `ORGANIZATION_MISMATCH` - Invalid organization context
- `UNKNOWN` - Unexpected error (catch-all)

**Step-Specific Codes:**
- `CONFLICT` - Unique constraint violation (if applicable)
- `CHECK_VIOLATION` - Database constraint failed (if applicable)

---

## File Structure & Barrels

### Standard Directory Layout

```
src/modules/intake/
├── domain/
│   └── schemas/
│       └── <step-name>/
│           ├── <step-name>.schema.ts       # Zod schemas + types
│           └── index.ts                     # Barrel export
├── application/
│   └── <step-name>/
│       ├── dtos.ts                          # DTOs + error codes
│       ├── ports.ts                         # Repository interface + mock
│       ├── mappers.ts                       # Domain ↔ DTO transformations
│       ├── usecases.ts                      # Business logic
│       └── index.ts                         # Barrel export (all of above)
├── actions/
│   └── <step-name>/
│       ├── <step-name>.actions.ts           # Server actions
│       └── index.ts                         # Barrel export
├── infrastructure/
│   ├── repositories/
│   │   └── <step-name>.repository.ts        # Supabase implementation
│   └── factories/
│       └── <step-name>.factory.ts           # DI factory
├── state/
│   └── slices/
│       └── <step-name>-ui.slice.ts          # UI-only Zustand store
└── ui/
    └── <step-name>-*/
        ├── Step<N>*.tsx                      # React components
        └── components/
            └── *.tsx                         # Section components
```

---

### Barrel Export Rules

**Purpose:** Centralize exports to avoid deep imports and enable clean refactoring

**Rules:**
1. **Every layer has a barrel** (`index.ts`)
2. **Export types with `type` keyword:**
   ```typescript
   export type { FooDTO, BarDTO } from './dtos'
   ```
3. **Export values (functions, constants) without `type`:**
   ```typescript
   export { loadFoo, saveFoo } from './usecases'
   export { FooErrorCodes } from './dtos'
   ```
4. **Import from barrels, not individual files:**
   ```typescript
   // ✅ Good
   import { FooDTO, loadFoo } from '@/modules/intake/application/foo'

   // ❌ Bad
   import { FooDTO } from '@/modules/intake/application/foo/dtos'
   import { loadFoo } from '@/modules/intake/application/foo/usecases'
   ```
5. **No wildcard exports (`export *`)** in Application/Actions layers (explicit exports for clarity)

---

### Import Path Aliases

**Standard Aliases:**
- `@/modules/intake/domain/schemas/<step-name>` → Domain schemas
- `@/modules/intake/application/<step-name>` → Application layer
- `@/modules/intake/actions/<step-name>` → Server actions
- `@/modules/intake/infrastructure/...` → Infrastructure layer
- `@/modules/intake/state/slices/<step>-ui` → UI state
- `@/shared/lib/...` → Shared utilities

**Example:**
```typescript
// Actions layer imports Application barrel
import {
  loadStep3,
  saveStep3,
  Step3InputDTO,
  Step3ErrorCodes
} from '@/modules/intake/application/step3'
```

---

## Database & RLS Standards

### Table Structure

**Standard Pattern:**
```sql
CREATE TABLE orbipax_core.<step_name>_data (
  session_id UUID NOT NULL,
  organization_id UUID NOT NULL REFERENCES orbipax_core.organizations(id) ON DELETE CASCADE,

  -- Step-specific JSONB columns (one per section)
  section1_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  section2_data JSONB NOT NULL DEFAULT '{}'::jsonb,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_modified TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,

  -- Primary key (composite for multi-tenant)
  PRIMARY KEY (session_id, organization_id)
);
```

**Key Requirements:**
- **Schema:** Always use `orbipax_core` schema (not `public`)
- **Primary Key:** Composite `(session_id, organization_id)` for multi-tenant isolation
- **JSONB Columns:** One per logical section (e.g., `diagnoses`, `psychiatric_evaluation`)
- **Timestamps:** `created_at`, `last_modified` (auto-update via trigger), `completed_at` (optional)
- **Foreign Key:** `organization_id` references `orbipax_core.organizations(id)` with CASCADE delete

---

### Indexes

**Standard Indexes:**
```sql
-- Organization filter (used in every query)
CREATE INDEX idx_<step_name>_data_org_id
ON orbipax_core.<step_name>_data (organization_id);

-- Session lookup (used in findBySession)
CREATE INDEX idx_<step_name>_data_session_id
ON orbipax_core.<step_name>_data (session_id);

-- Sort by recent activity
CREATE INDEX idx_<step_name>_data_modified
ON orbipax_core.<step_name>_data (organization_id, last_modified DESC);
```

---

### Triggers

**Auto-update last_modified:**
```sql
CREATE TRIGGER trg_<step_name>_data_updated_at
  BEFORE UPDATE ON orbipax_core.<step_name>_data
  FOR EACH ROW
  EXECUTE FUNCTION orbipax_core.update_updated_at_column();
```

**Trigger Function (shared):**
```sql
CREATE OR REPLACE FUNCTION orbipax_core.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_modified = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

### RLS Policies

**Standard Policies:**

#### 1. SELECT Policy
```sql
CREATE POLICY <step_name>_data_select_policy
ON orbipax_core.<step_name>_data
FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id
    FROM orbipax_core.organization_memberships
    WHERE user_id = auth.uid()
  )
);
```

#### 2. INSERT Policy
```sql
CREATE POLICY <step_name>_data_insert_policy
ON orbipax_core.<step_name>_data
FOR INSERT
WITH CHECK (
  organization_id IN (
    SELECT organization_id
    FROM orbipax_core.organization_memberships
    WHERE user_id = auth.uid()
  )
);
```

#### 3. UPDATE Policy
```sql
CREATE POLICY <step_name>_data_update_policy
ON orbipax_core.<step_name>_data
FOR UPDATE
USING (
  organization_id IN (
    SELECT organization_id
    FROM orbipax_core.organization_memberships
    WHERE user_id = auth.uid()
  )
)
WITH CHECK (
  organization_id IN (
    SELECT organization_id
    FROM orbipax_core.organization_memberships
    WHERE user_id = auth.uid()
  )
);
```

#### 4. DELETE Policy (Optional - restrict to admins)
```sql
CREATE POLICY <step_name>_data_delete_policy
ON orbipax_core.<step_name>_data
FOR DELETE
USING (
  organization_id IN (
    SELECT organization_id
    FROM orbipax_core.organization_memberships
    WHERE user_id = auth.uid()
      AND role IN ('owner', 'admin')  -- Restrict to admins only
  )
);
```

---

### Grants

**Standard Grants:**
```sql
-- Enable RLS
ALTER TABLE orbipax_core.<step_name>_data ENABLE ROW LEVEL SECURITY;

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE
ON orbipax_core.<step_name>_data
TO authenticated;

-- Revoke permissions from anonymous users
REVOKE ALL ON orbipax_core.<step_name>_data FROM anon;
```

---

### Security Principles

1. **RLS Always Enabled:** No table should have `DISABLE ROW LEVEL SECURITY`
2. **No service_role in Actions:** Server actions must use authenticated client
3. **Explicit organization_id Filtering:** Always add `.eq('organization_id', organizationId)` (defense in depth)
4. **organization_id from Server:** Resolve via `resolveUserAndOrg()` (never from client input)
5. **organization_memberships Check:** RLS policies query `organization_memberships` to verify user belongs to org
6. **Role-Based Deletes:** DELETE policies should restrict to admins/owners (if supported)

---

## Implementation Checklists

### AUDIT Phase Checklist

**Objective:** Understand current state before making changes

- [ ] Read existing implementations (Step 2 as reference)
- [ ] Identify domain schemas (location, barrel exports)
- [ ] Identify Application layer (DTOs, ports, mappers, usecases)
- [ ] Identify Actions layer (server actions, auth guards)
- [ ] Identify Infrastructure layer (repository, factory)
- [ ] Check for duplicate/conflicting artifacts (e.g., `step3/` vs `diagnoses-clinical/`)
- [ ] Verify database schema exists (table, indexes, RLS policies)
- [ ] Run TypeScript validation (`npx tsc --noEmit`) to baseline error count
- [ ] Run ESLint validation to baseline warnings
- [ ] Document findings in `/tmp/<task>_audit_report.md`

---

### APPLY Phase Checklist (Per Phase)

**Phase 2: Domain Schema**
- [ ] Create `domain/schemas/<step-name>/<step-name>.schema.ts`
- [ ] Define all Zod schemas
- [ ] Export TypeScript types (z.infer)
- [ ] Create validation helper functions
- [ ] Export constants (enums, limits)
- [ ] Create barrel export (`index.ts`)
- [ ] Run `npx tsc --noEmit` (should pass or not increase error count)
- [ ] Run `npx eslint` on new files (should pass)

**Phase 3-7: Application Layer**
- [ ] Create DTOs (`dtos.ts`)
- [ ] Create ports (`ports.ts`) with mock repository
- [ ] Create mappers (`mappers.ts`) with exactOptionalPropertyTypes pattern
- [ ] Create usecases (`usecases.ts`)
- [ ] Update barrel export (`index.ts`)
- [ ] Run TypeScript validation (should pass)
- [ ] Run ESLint validation (should pass)

**Phase 8: Actions Layer**
- [ ] Create server actions (`<step-name>.actions.ts`)
- [ ] Add `'use server'` directive
- [ ] Implement auth guard with `resolveUserAndOrg()`
- [ ] Delegate to Application usecases
- [ ] Map errors to generic messages
- [ ] Create barrel export (`index.ts`)
- [ ] Run TypeScript validation (should pass)
- [ ] Run ESLint validation (should pass)

**Phase 9: Infrastructure Layer**
- [ ] Create repository (`repositories/<step-name>.repository.ts`)
- [ ] Implement all port interface methods
- [ ] Use authenticated Supabase client
- [ ] Apply explicit organization_id filtering
- [ ] Map snake_case ↔ camelCase
- [ ] Return generic error messages
- [ ] Create factory (`factories/<step-name>.factory.ts`)
- [ ] Run TypeScript validation (should pass)
- [ ] Run ESLint validation (should pass)

**Phase 10: UI State Slice (Optional)**
- [ ] Create Zustand store (`state/slices/<step-name>-ui.slice.ts`)
- [ ] Define UI-only state (no domain data)
- [ ] Add loading, error, dirty flags
- [ ] Add actions to update flags
- [ ] Wrap with devtools middleware
- [ ] Run TypeScript validation (should pass)

**Phase 11: E2E Smoke Test**
- [ ] Create test page or mount component
- [ ] Test save action (verify success)
- [ ] Test load action (verify data returned)
- [ ] Test cross-tenant access (verify denial)
- [ ] Test validation failure (verify VALIDATION_FAILED)
- [ ] Run TypeScript validation (final check)
- [ ] Run ESLint validation (final check)
- [ ] Document results in `/tmp/<step>_e2e_smoke_test_report.md`

---

### Allowed Paths by Phase

**Read-Only Paths (Always Allowed):**
- `src/modules/intake/**` (read for reference)
- `docs/**` (read for reference)
- `supabase/migrations/**` (read for schema reference)

**Write Paths (Phase-Specific):**
- **Phase 1:** `src/modules/intake/domain/schemas/<deprecated-folder>` (delete only)
- **Phase 2:** `src/modules/intake/domain/schemas/<step-name>/` (create)
- **Phase 3-7:** `src/modules/intake/application/<step-name>/` (create)
- **Phase 8:** `src/modules/intake/actions/<step-name>/` (create)
- **Phase 9:** `src/modules/intake/infrastructure/{repositories,factories}/` (create)
- **Phase 10:** `src/modules/intake/state/slices/` (create)
- **Phase 11:** `src/app/test-<step-name>/` (create test page if needed)

**Report Paths (Always Allowed):**
- `D:\ORBIPAX-PROJECT\tmp\*.md` (write reports)

**Prohibited Operations:**
- ❌ **Do not modify** `supabase/migrations/**` (schema changes outside scope)
- ❌ **Do not modify** `src/shared/**` (shared utilities outside scope)
- ❌ **Do not modify** auth wrappers (security-wrappers.ts)
- ❌ **Do not run** migrations or alter RLS policies
- ❌ **Do not use** service_role client in actions/usecases

---

## Antipatterns to Avoid

### 1. Mixing Contract Formats

**❌ Wrong:**
```typescript
// Inconsistent response shapes
return { success: true, data: result }   // Using "success"
return { ok: false, error: message }     // Using "ok"
```

**✅ Correct:**
```typescript
// Canonical format everywhere
return { ok: true, data: result }
return { ok: false, error: { code: 'ERROR_CODE', message: 'Generic message' } }
```

---

### 2. Importing from Schemas Instead of Barrels

**❌ Wrong:**
```typescript
import { diagnosesSchema } from '@/modules/intake/domain/schemas/diagnoses-clinical/diagnoses-clinical.schema'
```

**✅ Correct:**
```typescript
import { diagnosesSchema } from '@/modules/intake/domain/schemas/diagnoses-clinical'
```

---

### 3. Using service_role in Actions

**❌ Wrong:**
```typescript
// actions/step3/diagnoses.actions.ts
const supabase = getServiceClient()  // Bypasses RLS!
```

**✅ Correct:**
```typescript
// infrastructure/repositories/diagnoses.repository.ts
const supabase = await createServerClient()  // RLS enforced
```

---

### 4. Explicit undefined in Optional Fields

**❌ Wrong:**
```typescript
// Causes exactOptionalPropertyTypes error
const dto: OutputDTO = {
  requiredField: value,
  optionalField: maybeValue ?? undefined  // Type error!
}
```

**✅ Correct:**
```typescript
// Use conditional spreading
const dto: OutputDTO = {
  requiredField: value,
  ...(maybeValue && { optionalField: maybeValue })
}
```

---

### 5. RLS Policies with Wrong Comparison

**❌ Wrong:**
```sql
-- Comparing organization_id directly to auth.uid() (wrong tables!)
CREATE POLICY foo_select_policy
ON orbipax_core.foo_data
FOR SELECT
USING (organization_id = auth.uid());  -- auth.uid() is user_id, not org_id!
```

**✅ Correct:**
```sql
-- Query organization_memberships to map user → org
CREATE POLICY foo_select_policy
ON orbipax_core.foo_data
FOR SELECT
USING (
  organization_id IN (
    SELECT organization_id
    FROM orbipax_core.organization_memberships
    WHERE user_id = auth.uid()
  )
);
```

---

### 6. PHI in Error Messages

**❌ Wrong:**
```typescript
return {
  ok: false,
  error: {
    code: 'VALIDATION_FAILED',
    message: `Patient SSN ${ssn} is invalid`  // PHI leak!
  }
}
```

**✅ Correct:**
```typescript
return {
  ok: false,
  error: {
    code: 'VALIDATION_FAILED',
    message: 'Invalid input provided'  // Generic
  }
}
```

---

### 7. Missing organization_id Filter in Queries

**❌ Wrong:**
```typescript
// Only relies on RLS (single layer of defense)
const { data } = await supabase
  .from('diagnoses_clinical')
  .select('*')
  .eq('session_id', sessionId)
```

**✅ Correct:**
```typescript
// Explicit filter + RLS (defense in depth)
const { data } = await supabase
  .schema('orbipax_core')
  .from('diagnoses_clinical')
  .select('*')
  .eq('session_id', sessionId)
  .eq('organization_id', organizationId)  // Explicit filter
```

---

### 8. Hardcoded Session IDs in UI

**❌ Wrong:**
```typescript
// UI component directly generates session ID
const sessionId = `session_${user.id}_intake`
await saveStep3Action({ sessionId, data })  // Client-controlled!
```

**✅ Correct:**
```typescript
// Server action generates session ID server-side
export async function saveStep3Action(input: Step3InputDTO) {
  const { userId, organizationId } = await resolveUserAndOrg()
  const sessionId = `session_${userId}_intake`  // Server-controlled
  // ...
}
```

---

### 9. Not Handling NOT_FOUND Gracefully

**❌ Wrong:**
```typescript
// Application usecase returns error on NOT_FOUND
if (result.error?.code === 'NOT_FOUND') {
  return { ok: false, error: result.error }  // UI must handle empty state
}
```

**✅ Correct:**
```typescript
// Application usecase returns empty structure on NOT_FOUND
if (result.error?.code === 'NOT_FOUND') {
  return { ok: true, data: createEmptyOutput(sessionId, organizationId) }
}
```

---

### 10. Wildcard Barrel Exports

**❌ Wrong:**
```typescript
// application/<step-name>/index.ts
export * from './dtos'
export * from './ports'
export * from './mappers'
export * from './usecases'
```

**✅ Correct:**
```typescript
// Explicit exports for clarity
export type {
  Step3InputDTO,
  Step3OutputDTO,
  RepositoryResponse
} from './dtos'

export { Step3ErrorCodes } from './dtos'
export type { Step3Repository } from './ports'
export { MockStep3Repository } from './ports'
export { toStep3Domain, toStep3DTO } from './mappers'
export { loadStep3, saveStep3 } from './usecases'
```

---

## Validation Gates

### TypeScript Validation

**Command:**
```bash
npx tsc --noEmit
```

**Requirements:**
- Must pass (0 errors) or not increase error count from baseline
- No new exactOptionalPropertyTypes errors
- No unresolved imports (barrel exports must work)

**Run Frequency:**
- After each phase (2-10)
- Before committing code
- In CI/CD pipeline

---

### ESLint Validation

**Command:**
```bash
npx eslint src/modules/intake/<layer>/<step-name>/
```

**Requirements:**
- Must pass (0 errors, 0 warnings) for new files
- No unused imports
- No unused variables
- Proper import ordering

**Run Frequency:**
- After each phase (2-10)
- Before committing code
- In CI/CD pipeline

---

### Sentinel Validation (Custom)

**Command:**
```bash
# Example: Check for service_role usage in actions
grep -r "getServiceClient" src/modules/intake/actions/
```

**Requirements:**
- No service_role usage in actions layer
- No hardcoded organization IDs
- No PHI in error messages (manual review)

**Run Frequency:**
- Before final phase (Phase 11)
- In code review

---

### Manual Review Checklist

**Security:**
- [ ] organization_id resolved server-side (not from client input)
- [ ] RLS policies enabled on table
- [ ] Explicit organization_id filtering in queries
- [ ] Generic error messages (no PHI, no raw Supabase errors)
- [ ] No service_role in actions/usecases

**Architecture:**
- [ ] Barrel exports exist and work
- [ ] Contracts aligned across layers (`{ ok, data|error }`)
- [ ] DTOs use camelCase, DB columns use snake_case
- [ ] Optional fields use conditional spreading (exactOptionalPropertyTypes)

**Code Quality:**
- [ ] TypeScript passes (no new errors)
- [ ] ESLint passes (no warnings)
- [ ] No console.log statements
- [ ] No commented-out code
- [ ] Consistent naming conventions

---

## Appendix: Step-by-Step Example (Step 3)

### Phase 2: Domain Schema

**File:** `src/modules/intake/domain/schemas/diagnoses-clinical/diagnoses-clinical.schema.ts`

```typescript
import { z } from 'zod'

export const diagnosesSchema = z.object({
  primaryDiagnosis: z.string().optional(),
  secondaryDiagnoses: z.array(z.string()).default([]),
  substanceUseDisorder: z.string().optional(),
  mentalHealthHistory: z.string().optional()
})

export type Diagnoses = z.infer<typeof diagnosesSchema>

export const step3DataSchema = z.object({
  diagnoses: diagnosesSchema,
  psychiatricEvaluation: psychiatricEvaluationSchema,
  functionalAssessment: functionalAssessmentSchema
})

export type Step3Data = z.infer<typeof step3DataSchema>

export function validateStep3(data: unknown) {
  const result = step3DataSchema.safeParse(data)
  return result.success
    ? { ok: true as const, data: result.data }
    : { ok: false as const, issues: result.error.issues }
}
```

**File:** `src/modules/intake/domain/schemas/diagnoses-clinical/index.ts`

```typescript
export {
  diagnosesSchema,
  type Diagnoses,
  step3DataSchema,
  type Step3Data,
  validateStep3,
  DIAGNOSIS_TYPES
} from './diagnoses-clinical.schema'
```

---

### Phase 3-7: Application Layer

**File:** `src/modules/intake/application/step3/dtos.ts`

```typescript
export interface Step3InputDTO {
  diagnoses: DiagnosesDTO
  psychiatricEvaluation: PsychiatricEvaluationDTO
  functionalAssessment: FunctionalAssessmentDTO
}

export interface Step3OutputDTO {
  sessionId: string
  organizationId: string
  data: {
    diagnoses: DiagnosesDTO
    psychiatricEvaluation: PsychiatricEvaluationDTO
    functionalAssessment: FunctionalAssessmentDTO
  }
  lastModified?: string
  completedAt?: string
}

export interface RepositoryResponse<T> {
  ok: boolean
  data?: T
  error?: {
    code: string
    message?: string
  }
}

export const DiagnosesErrorCodes = {
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  SAVE_FAILED: 'SAVE_FAILED',
  UNAUTHORIZED: 'UNAUTHORIZED',
  UNKNOWN: 'UNKNOWN'
} as const
```

**File:** `src/modules/intake/application/step3/index.ts`

```typescript
export type {
  Step3InputDTO,
  Step3OutputDTO,
  DiagnosesDTO,
  RepositoryResponse
} from './dtos'

export { DiagnosesErrorCodes } from './dtos'
export type { DiagnosesRepository } from './ports'
export { MockDiagnosesRepository } from './ports'
export { toPartialDomain, createEmptyOutput } from './mappers'
export { loadStep3, upsertDiagnoses } from './usecases'
```

---

### Phase 8: Actions Layer

**File:** `src/modules/intake/actions/step3/diagnoses.actions.ts`

```typescript
'use server'

import { resolveUserAndOrg } from '@/shared/lib/current-user.server'
import {
  loadStep3,
  upsertDiagnoses,
  type Step3InputDTO,
  type Step3OutputDTO,
  DiagnosesErrorCodes
} from '@/modules/intake/application/step3'
import { createDiagnosesRepository } from '@/modules/intake/infrastructure/factories/diagnoses.factory'

type ActionResponse<T = void> = {
  ok: boolean
  data?: T
  error?: {
    code: string
    message?: string
  }
}

export async function loadStep3Action(): Promise<ActionResponse<Step3OutputDTO>> {
  try {
    const { userId, organizationId } = await resolveUserAndOrg()

    if (!organizationId) {
      return {
        ok: false,
        error: {
          code: 'ORGANIZATION_MISMATCH',
          message: 'Invalid organization context'
        }
      }
    }

    const sessionId = `session_${userId}_intake`
    const repository = createDiagnosesRepository()
    const result = await loadStep3(repository, sessionId, organizationId)

    if (!result.ok) {
      return {
        ok: false,
        error: {
          code: result.error?.code ?? DiagnosesErrorCodes.UNKNOWN,
          message: 'Failed to load clinical assessment data'
        }
      }
    }

    return { ok: true, data: result.data }
  } catch {
    return {
      ok: false,
      error: {
        code: DiagnosesErrorCodes.UNKNOWN,
        message: 'An unexpected error occurred'
      }
    }
  }
}
```

---

### Phase 9: Infrastructure Layer

**File:** `src/modules/intake/infrastructure/repositories/diagnoses.repository.ts`

```typescript
import { createServerClient } from '@/shared/lib/supabase.client'
import type {
  DiagnosesRepository,
  RepositoryResponse,
  Step3InputDTO,
  Step3OutputDTO
} from '@/modules/intake/application/step3'

export class DiagnosesRepositoryImpl implements DiagnosesRepository {
  async findBySession(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<Step3OutputDTO>> {
    try {
      const supabase = await createServerClient()

      const { data, error } = await supabase
        .schema('orbipax_core')
        .from('diagnoses_clinical')
        .select('*')
        .eq('session_id', sessionId)
        .eq('organization_id', organizationId)
        .maybeSingle()

      if (error) {
        return {
          ok: false,
          error: {
            code: 'UNKNOWN',
            message: 'Failed to retrieve clinical assessment data'
          }
        }
      }

      if (!data) {
        return {
          ok: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Clinical assessment data not found'
          }
        }
      }

      const output: Step3OutputDTO = {
        sessionId: data.session_id,
        organizationId: data.organization_id,
        data: {
          diagnoses: data.diagnoses,
          psychiatricEvaluation: data.psychiatric_evaluation,
          functionalAssessment: data.functional_assessment
        },
        ...(data.last_modified && { lastModified: data.last_modified }),
        ...(data.completed_at && { completedAt: data.completed_at })
      }

      return { ok: true, data: output }
    } catch {
      return {
        ok: false,
        error: {
          code: 'UNKNOWN',
          message: 'An unexpected error occurred'
        }
      }
    }
  }

  // ... save(), exists(), delete() methods
}
```

**File:** `src/modules/intake/infrastructure/factories/diagnoses.factory.ts`

```typescript
import type { DiagnosesRepository } from '@/modules/intake/application/step3'
import { DiagnosesRepositoryImpl } from '../repositories/diagnoses.repository'

export function createDiagnosesRepository(): DiagnosesRepository {
  return new DiagnosesRepositoryImpl()
}
```

---

## Document Maintenance

### Update Triggers

**This playbook must be updated when:**
1. A new wizard step is added (Steps 12+)
2. Canonical contract format changes
3. RLS pattern changes (e.g., role-based policies added)
4. New validation gates added (e.g., new linters)
5. Antipatterns discovered (add to section)

### Review Schedule

- **Quarterly:** Review against latest implementations
- **Pre-Production:** Verify compliance before major releases
- **Post-Incident:** Update if security issue related to pattern violation

---

**Playbook Version:** 1.0
**Last Reviewed:** 2025-09-29
**Next Review:** 2025-12-29
**Maintainers:** Engineering Team