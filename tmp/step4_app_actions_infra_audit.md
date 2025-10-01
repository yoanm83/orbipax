# Step 4 (Medical Providers) - Application/Actions/Infrastructure Audit
**OrbiPax Intake Module - Pre-Creation Audit**
**Date**: 2025-09-30
**Status**: ✅ AUDIT COMPLETE

---

## 📋 Executive Summary

**Objective**: Audit existing Application, Actions, and Infrastructure layers for Step 4 (Medical Providers) to identify gaps before creating new components.

**Finding**: **100% Missing** - No Application, Actions, or Infrastructure components exist for Step 4.

**Reference Pattern**: Step 3 (Diagnoses & Clinical Assessment) serves as the canonical pattern.

**Required Components**:
- **Application Layer**: 7 files (Ports, DTOs, Use Cases, Mappers, Enums, Index, Optional Service)
- **Actions Layer**: 2 files (Server Actions, Index)
- **Infrastructure Layer**: 2 files (Repository, Factory)

---

## 🔍 Inventory by Layer

### ✅ Domain Layer (COMPLETE - Phase 1-3)
**Status**: ✅ Fully migrated to canonical pattern

**Location**: `src/modules/intake/domain/schemas/medical-providers/`

**Files**:
1. ✅ `medical-providers.schema.ts` (436 lines) - Canonical schema with validation
2. ✅ `index.ts` (56 lines) - Barrel export

**Exports**:
- Schemas: `medicalProvidersDataSchema`, `medicalProvidersDataPartialSchema`, `providersSchema`, `psychiatristSchema`
- Types: `MedicalProvidersData`, `MedicalProvidersDataPartial`, `ProvidersSchema`, `PsychiatristSchema`
- Validators: `validateMedicalProviders()`, `validateMedicalProvidersPartial()`, `validateProviders()`, `validatePsychiatrist()`
- Utilities: `isProviderInfoComplete()`, `isPsychiatristInfoComplete()`, `isSectionComplete()`, `isMedicalProvidersComplete()`
- Defaults: `defaultProvidersValues`, `defaultPsychiatristValues`, `defaultMedicalProvidersValues`

**Contract**: `{ ok: true, data: T } | { ok: false, issues: ZodIssue[] }`

---

### ❌ Application Layer (MISSING - 0% Complete)
**Status**: ❌ Does not exist

**Expected Location**: `src/modules/intake/application/step4/`

**Current State**: Directory does not exist

**Required Files** (7):
1. ❌ `ports.ts` - Repository port interface
2. ❌ `dtos.ts` - JSON-serializable DTOs for cross-layer communication
3. ❌ `usecases.ts` - Business logic orchestration (loadStep4, upsertMedicalProviders)
4. ❌ `mappers.ts` - DTO ↔ Domain transformations
5. ❌ `medical-providers.enums.ts` - Shared enums (PCPStatus, EvaluationStatus)
6. ❌ `index.ts` - Barrel export
7. ⚠️ `providerLookupService.ts` - Optional (if external provider lookup needed)

**Reference Pattern**: `src/modules/intake/application/step3/` (7 files, 884 total lines)

---

### ❌ Actions Layer (MISSING - 0% Complete)
**Status**: ❌ Does not exist

**Expected Location**: `src/modules/intake/actions/step4/`

**Current State**: Directory does not exist

**Required Files** (2):
1. ❌ `medical-providers.actions.ts` - Server actions with auth guards and DI
2. ❌ `index.ts` - Barrel export

**Expected Exports**:
- `loadStep4Action()` - Load medical providers data
- `upsertMedicalProvidersAction(input: Step4InputDTO)` - Save/update medical providers

**Contract**: `ActionResponse<T> = { ok: boolean; data?: T; error?: { code: string; message?: string } }`

**Reference Pattern**: `src/modules/intake/actions/step3/` (2 files, 215 total lines)

---

### ❌ Infrastructure Layer (MISSING - 0% Complete)
**Status**: ❌ Does not exist

**Expected Locations**:
- Repository: `src/modules/intake/infrastructure/repositories/medical-providers.repository.ts`
- Factory: `src/modules/intake/infrastructure/factories/medical-providers.factory.ts`

**Current State**: No files exist

**Required Files** (2):
1. ❌ `medical-providers.repository.ts` - Supabase repository implementation with RLS
2. ❌ `medical-providers.factory.ts` - DI factory function

**Database Schema**: Table `orbipax_core.medical_providers` with columns:
- `session_id` (PK)
- `organization_id` (PK + RLS filter)
- `providers` (JSONB)
- `psychiatrist` (JSONB)
- `last_modified` (timestamptz)
- `completed_at` (timestamptz, nullable)

**Reference Pattern**:
- Repository: `src/modules/intake/infrastructure/repositories/diagnoses.repository.ts` (257 lines)
- Factory: `src/modules/intake/infrastructure/factories/diagnoses.factory.ts` (26 lines)

---

## 📊 Contract Matrix (Layer-by-Layer)

| Layer | Contract Type | Success | Failure | Notes |
|-------|--------------|---------|---------|-------|
| **Domain (Schema)** | `{ ok, data\|issues }` | `{ ok: true, data: T }` | `{ ok: false, issues: ZodIssue[] }` | ✅ Implemented |
| **Application (DTOs)** | `RepositoryResponse<T>` | `{ ok: true, data: T }` | `{ ok: false, error: { code, message } }` | ❌ Missing |
| **Actions** | `ActionResponse<T>` | `{ ok: true, data?: T }` | `{ ok: false, error: { code, message } }` | ❌ Missing |
| **Infrastructure (Repo)** | `RepositoryResponse<T>` | `{ ok: true, data: T }` | `{ ok: false, error: { code, message } }` | ❌ Missing |

**Key Differences**:
- Domain returns Zod `issues[]` (detailed validation errors)
- Application/Infrastructure/Actions return generic `error: { code, message }` (no PHI exposure)

---

## 🎯 Step 3 Reference Pattern Analysis

### Application Layer Structure (Step 3)

#### 1. **ports.ts** (172 lines)
**Purpose**: Define repository port interface for DI

**Pattern**:
```typescript
export interface DiagnosesRepository {
  findBySession(sessionId: string, organizationId: string):
    Promise<RepositoryResponse<Step3OutputDTO>>

  save(sessionId: string, organizationId: string, input: Step3InputDTO):
    Promise<RepositoryResponse<{ sessionId: string }>>

  exists(sessionId: string, organizationId: string):
    Promise<RepositoryResponse<{ exists: boolean }>>

  delete?(sessionId: string, organizationId: string):
    Promise<RepositoryResponse<{ deleted: boolean }>>
}

export interface RepositoryResponse<T> {
  ok: boolean
  data?: T
  error?: {
    code: string
    message?: string
  }
}
```

**Step 4 Equivalent**:
- Interface name: `MedicalProvidersRepository`
- Input DTO: `Step4InputDTO`
- Output DTO: `Step4OutputDTO`

---

#### 2. **dtos.ts** (188 lines)
**Purpose**: JSON-serializable contracts between layers

**Pattern**:
```typescript
export interface Step3InputDTO {
  diagnoses?: DiagnosesDTO
  psychiatricEvaluation?: PsychiatricEvaluationDTO
  functionalAssessment?: FunctionalAssessmentDTO
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

// Section-specific DTOs
export interface DiagnosesDTO {
  primaryDiagnosis?: string
  secondaryDiagnoses: string[]
  substanceUseDisorder?: string
  mentalHealthHistory?: string
  diagnosisRecords: DiagnosisRecordDTO[]
}
```

**Step 4 Equivalent**:
```typescript
export interface Step4InputDTO {
  providers?: ProvidersDTO
  psychiatrist?: PsychiatristDTO
}

export interface Step4OutputDTO {
  sessionId: string
  organizationId: string
  data: {
    providers: ProvidersDTO
    psychiatrist: PsychiatristDTO
  }
  lastModified?: string
  completedAt?: string
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
  evaluationDate?: string // ISO date string
  clinicName?: string
  notes?: string
  differentEvaluator?: boolean
  evaluatorName?: string
  evaluatorClinic?: string
}
```

---

#### 3. **usecases.ts** (189 lines)
**Purpose**: Orchestrate business logic (auth-free, repository-injected)

**Pattern**:
```typescript
export async function loadStep3(
  repository: DiagnosesRepository,
  sessionId: string,
  organizationId: string
): Promise<LoadStep3Response> {
  // 1. Validate parameters
  if (!sessionId || !organizationId) {
    return {
      ok: false,
      error: {
        code: DiagnosesErrorCodes.VALIDATION_FAILED,
        message: 'Session ID and Organization ID are required'
      }
    }
  }

  try {
    // 2. Call repository
    const result = await repository.findBySession(sessionId, organizationId)

    // 3. Handle NOT_FOUND → return empty structure
    if (result.ok && result.data) {
      return { ok: true, data: result.data }
    }

    if (result.error?.code === DiagnosesErrorCodes.NOT_FOUND) {
      return {
        ok: true,
        data: createEmptyOutput(sessionId, organizationId)
      }
    }

    // 4. Generic error handling
    return {
      ok: false,
      error: result.error ?? {
        code: DiagnosesErrorCodes.UNKNOWN,
        message: 'Failed to load clinical assessment data'
      }
    }
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

export async function upsertDiagnoses(
  repository: DiagnosesRepository,
  input: Step3InputDTO,
  sessionId: string,
  organizationId: string
): Promise<SaveStep3Response> {
  // 1. Validate parameters
  if (!sessionId || !organizationId) {
    return {
      ok: false,
      error: {
        code: DiagnosesErrorCodes.VALIDATION_FAILED,
        message: 'Session ID and Organization ID are required'
      }
    }
  }

  try {
    // 2. Convert DTO to domain model
    const domainData = toPartialDomain(input)

    // 3. Validate with Zod schema
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

    // 4. Persist to repository
    const result = await repository.save(sessionId, organizationId, input)

    if (!result.ok || !result.data) {
      return {
        ok: false,
        error: result.error ?? {
          code: DiagnosesErrorCodes.UNKNOWN,
          message: 'An unexpected error occurred while saving clinical assessment data'
        }
      }
    }

    // 5. Success
    return {
      ok: true,
      data: result.data
    }
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        ok: false,
        error: {
          code: DiagnosesErrorCodes.VALIDATION_FAILED,
          message: 'Clinical assessment data validation failed'
        }
      }
    }

    return {
      ok: false,
      error: {
        code: DiagnosesErrorCodes.UNKNOWN,
        message: 'An unexpected error occurred while saving clinical assessment data'
      }
    }
  }
}
```

**Step 4 Equivalent**:
- `loadStep4(repository, sessionId, organizationId): Promise<LoadStep4Response>`
- `upsertMedicalProviders(repository, input, sessionId, organizationId): Promise<SaveStep4Response>`
- Error codes: `MedicalProvidersErrorCodes.VALIDATION_FAILED`, `NOT_FOUND`, `SAVE_FAILED`, `UNKNOWN`

---

#### 4. **mappers.ts** (283 lines)
**Purpose**: Transform between DTOs (Application) and Domain models

**Pattern**:
```typescript
// DTO → Domain (for validation before save)
export function toPartialDomain(dto: Step3InputDTO): Step3DataPartial {
  return {
    diagnoses: dto.diagnoses ? diagnosesToDomain(dto.diagnoses) : undefined,
    psychiatricEvaluation: dto.psychiatricEvaluation ?
      psychiatricEvaluationToDomain(dto.psychiatricEvaluation) : undefined,
    functionalAssessment: dto.functionalAssessment ?
      functionalAssessmentToDomain(dto.functionalAssessment) : undefined,
    stepId: 'step3-diagnoses-clinical'
  }
}

// Domain → DTO (for output)
export function toOutput(
  domain: Step3Data,
  sessionId: string,
  organizationId: string
): Step3OutputDTO {
  return {
    sessionId,
    organizationId,
    data: {
      diagnoses: diagnosesToDTO(domain.diagnoses),
      psychiatricEvaluation: psychiatricEvaluationToDTO(domain.psychiatricEvaluation),
      functionalAssessment: functionalAssessmentToDTO(domain.functionalAssessment)
    },
    lastModified: new Date().toISOString()
  }
}

// Empty output for NOT_FOUND cases
export function createEmptyOutput(
  sessionId: string,
  organizationId: string
): Step3OutputDTO {
  return {
    sessionId,
    organizationId,
    data: {
      diagnoses: { secondaryDiagnoses: [], diagnosisRecords: [] },
      psychiatricEvaluation: { currentSymptoms: [], hasPsychEval: false },
      functionalAssessment: {
        affectedDomains: [],
        adlsIndependence: 'unknown',
        iadlsIndependence: 'unknown',
        cognitiveFunctioning: 'unknown',
        hasSafetyConcerns: false,
        dailyLivingActivities: []
      }
    },
    lastModified: new Date().toISOString()
  }
}
```

**Step 4 Equivalent**:
```typescript
// DTO → Domain
export function toPartialDomain(dto: Step4InputDTO): MedicalProvidersDataPartial {
  return {
    providers: dto.providers ? providersToDomain(dto.providers) : undefined,
    psychiatrist: dto.psychiatrist ? psychiatristToDomain(dto.psychiatrist) : undefined,
    stepId: 'step4-medical-providers'
  }
}

// Empty output for NOT_FOUND cases
export function createEmptyOutput(
  sessionId: string,
  organizationId: string
): Step4OutputDTO {
  return {
    sessionId,
    organizationId,
    data: {
      providers: {
        hasPCP: 'Unknown',
        pcpName: '',
        pcpPhone: '',
        pcpPractice: '',
        pcpAddress: '',
        authorizedToShare: false
      },
      psychiatrist: {
        hasBeenEvaluated: 'No',
        psychiatristName: '',
        evaluationDate: undefined,
        clinicName: '',
        notes: '',
        differentEvaluator: false,
        evaluatorName: '',
        evaluatorClinic: ''
      }
    },
    lastModified: new Date().toISOString()
  }
}
```

---

#### 5. **medical-providers.enums.ts** (Optional - ~30 lines)
**Purpose**: Shared enums for Application + UI consistency

**Step 4 Equivalent**:
```typescript
// PCP Status options
export const PCP_STATUS = ['Yes', 'No', 'Unknown'] as const
export type PCPStatus = typeof PCP_STATUS[number]

// Evaluation Status options
export const EVALUATION_STATUS = ['Yes', 'No'] as const
export type EvaluationStatus = typeof EVALUATION_STATUS[number]

// UI Select options
export const PCP_STATUS_OPTIONS = PCP_STATUS.map(value => ({
  value,
  label: value
}))

export const EVALUATION_STATUS_OPTIONS = EVALUATION_STATUS.map(value => ({
  value,
  label: value
}))
```

---

#### 6. **index.ts** (20 lines)
**Purpose**: Barrel export for Application layer

**Pattern**:
```typescript
export * from './dtos'
export * from './mappers'
export type { DiagnosesRepository } from './ports'
export { MockDiagnosesRepository } from './ports'
export * from './usecases'
```

---

#### 7. **providerLookupService.ts** (Optional)
**Purpose**: External provider lookup (if needed)

**Step 3 Equivalent**: `diagnosisSuggestionService.ts` (for OpenAI diagnosis suggestions)

**Decision**: Skip for now unless external provider directory lookup is required.

---

### Actions Layer Structure (Step 3)

#### 1. **medical-providers.actions.ts** (~210 lines)
**Purpose**: Server actions with auth guards, multi-tenant isolation, and DI

**Pattern**:
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
    // Auth guard
    let userId: string
    let organizationId: string

    try {
      const auth = await resolveUserAndOrg()
      userId = auth.userId
      organizationId = auth.organizationId
    } catch {
      return {
        ok: false,
        error: {
          code: DiagnosesErrorCodes.UNAUTHORIZED,
          message: 'Authentication required'
        }
      }
    }

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

    // TODO: Get actual session ID from context/params
    const sessionId = `session_${userId}_intake`

    // Dependency injection
    const repository = createDiagnosesRepository()

    // Delegate to Application layer
    const result = await loadStep3(repository, sessionId, organizationId)

    // Map to Action response
    if (!result.ok) {
      return {
        ok: false,
        error: {
          code: result.error?.code ?? DiagnosesErrorCodes.UNKNOWN,
          message: 'Failed to load clinical assessment data'
        }
      }
    }

    return {
      ok: true,
      data: result.data
    }
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

export async function upsertDiagnosesAction(
  input: Step3InputDTO
): Promise<ActionResponse<{ sessionId: string }>> {
  // Same pattern as loadStep3Action
  // 1. Auth guard
  // 2. Session ID resolution
  // 3. DI (create repository)
  // 4. Delegate to usecase
  // 5. Map result to ActionResponse
}
```

**Step 4 Equivalent**:
- `loadStep4Action(): Promise<ActionResponse<Step4OutputDTO>>`
- `upsertMedicalProvidersAction(input: Step4InputDTO): Promise<ActionResponse<{ sessionId: string }>>`

---

#### 2. **index.ts** (11 lines)
**Purpose**: Barrel export for Actions

**Pattern**:
```typescript
export {
  loadStep3Action,
  upsertDiagnosesAction
} from './diagnoses.actions'
```

---

### Infrastructure Layer Structure (Step 3)

#### 1. **medical-providers.repository.ts** (~260 lines)
**Purpose**: Supabase repository implementation with RLS

**Pattern**:
```typescript
import { createServerClient } from '@/shared/lib/supabase.client'
import type {
  MedicalProvidersRepository,
  RepositoryResponse,
  Step4InputDTO,
  Step4OutputDTO
} from '@/modules/intake/application/step4'

const REPO_ERROR_CODES = {
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  NOT_IMPLEMENTED: 'NOT_IMPLEMENTED',
  UNKNOWN: 'UNKNOWN'
} as const

export class MedicalProvidersRepositoryImpl implements MedicalProvidersRepository {
  async findBySession(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<Step4OutputDTO>> {
    try {
      const supabase = await createServerClient()

      const { data, error } = await supabase
        .schema('orbipax_core')
        .from('medical_providers')
        .select('*')
        .eq('session_id', sessionId)
        .eq('organization_id', organizationId)
        .maybeSingle()

      if (error) {
        return {
          ok: false,
          error: {
            code: REPO_ERROR_CODES.UNKNOWN,
            message: 'Failed to retrieve medical providers data'
          }
        }
      }

      if (!data) {
        return {
          ok: false,
          error: {
            code: REPO_ERROR_CODES.NOT_FOUND,
            message: 'Medical providers data not found'
          }
        }
      }

      // Map DB row to Step4OutputDTO
      const output: Step4OutputDTO = {
        sessionId: data.session_id,
        organizationId: data.organization_id,
        data: {
          providers: data.providers,
          psychiatrist: data.psychiatrist
        },
        ...(data.last_modified && { lastModified: data.last_modified }),
        ...(data.completed_at && { completedAt: data.completed_at })
      }

      return {
        ok: true,
        data: output
      }
    } catch {
      return {
        ok: false,
        error: {
          code: REPO_ERROR_CODES.UNKNOWN,
          message: 'An unexpected error occurred'
        }
      }
    }
  }

  async save(
    sessionId: string,
    organizationId: string,
    input: Step4InputDTO
  ): Promise<RepositoryResponse<{ sessionId: string }>> {
    try {
      const supabase = await createServerClient()

      // Prepare upsert payload
      const payload = {
        session_id: sessionId,
        organization_id: organizationId,
        providers: input.providers,
        psychiatrist: input.psychiatrist,
        last_modified: new Date().toISOString()
      }

      const { error } = await supabase
        .schema('orbipax_core')
        .from('medical_providers')
        .upsert(payload, {
          onConflict: 'session_id,organization_id'
        })

      if (error) {
        // Check for conflict errors
        if (error.code === '23505') {
          return {
            ok: false,
            error: {
              code: REPO_ERROR_CODES.CONFLICT,
              message: 'Medical providers data conflict detected'
            }
          }
        }

        return {
          ok: false,
          error: {
            code: REPO_ERROR_CODES.UNKNOWN,
            message: 'Failed to save medical providers data'
          }
        }
      }

      return {
        ok: true,
        data: { sessionId }
      }
    } catch {
      return {
        ok: false,
        error: {
          code: REPO_ERROR_CODES.UNKNOWN,
          message: 'An unexpected error occurred'
        }
      }
    }
  }

  async exists(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<{ exists: boolean }>> {
    try {
      const supabase = await createServerClient()

      const { count, error } = await supabase
        .schema('orbipax_core')
        .from('medical_providers')
        .select('*', { count: 'exact', head: true })
        .eq('session_id', sessionId)
        .eq('organization_id', organizationId)

      if (error) {
        return {
          ok: false,
          error: {
            code: REPO_ERROR_CODES.UNKNOWN,
            message: 'Failed to check medical providers data existence'
          }
        }
      }

      return {
        ok: true,
        data: { exists: (count ?? 0) > 0 }
      }
    } catch {
      return {
        ok: false,
        error: {
          code: REPO_ERROR_CODES.UNKNOWN,
          message: 'An unexpected error occurred'
        }
      }
    }
  }

  async delete(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<{ deleted: boolean }>> {
    try {
      const supabase = await createServerClient()

      const { error } = await supabase
        .schema('orbipax_core')
        .from('medical_providers')
        .delete()
        .eq('session_id', sessionId)
        .eq('organization_id', organizationId)

      if (error) {
        return {
          ok: false,
          error: {
            code: REPO_ERROR_CODES.UNKNOWN,
            message: 'Failed to delete medical providers data'
          }
        }
      }

      return {
        ok: true,
        data: { deleted: true }
      }
    } catch {
      return {
        ok: false,
        error: {
          code: REPO_ERROR_CODES.UNKNOWN,
          message: 'An unexpected error occurred'
        }
      }
    }
  }
}
```

---

#### 2. **medical-providers.factory.ts** (~26 lines)
**Purpose**: DI factory for repository

**Pattern**:
```typescript
import type { MedicalProvidersRepository } from '@/modules/intake/application/step4'
import { MedicalProvidersRepositoryImpl } from '../repositories/medical-providers.repository'

export function createMedicalProvidersRepository(): MedicalProvidersRepository {
  return new MedicalProvidersRepositoryImpl()
}
```

---

## 🚨 Gap Analysis

### Priority 0 (P0) - Must Create First
1. ✅ **Domain Layer** - Already complete
2. ❌ **Application Layer** - Ports, DTOs, Use Cases, Mappers (6 files)
3. ❌ **Infrastructure Layer** - Repository, Factory (2 files)
4. ❌ **Actions Layer** - Server Actions (2 files)

### Priority 1 (P1) - Optional Enhancements
1. ⚠️ **Application Enums** - `medical-providers.enums.ts` (if UI needs shared constants)
2. ⚠️ **Provider Lookup Service** - Only if external provider directory integration needed

---

## 📝 Implementation Plan (Micro-Tasks)

### Phase 1: Application Layer (P0)
**Objective**: Create business logic orchestration layer

**Tasks**:
1. **TASK 1.1**: Create `application/step4/ports.ts`
   - Define `MedicalProvidersRepository` interface
   - Define `RepositoryResponse<T>` type
   - Add optional Mock implementation
   - **Lines**: ~180
   - **Acceptance**: TypeScript compiles, interface has 4 methods (findBySession, save, exists, delete?)

2. **TASK 1.2**: Create `application/step4/dtos.ts`
   - Define `Step4InputDTO` (providers, psychiatrist)
   - Define `Step4OutputDTO` (sessionId, organizationId, data, timestamps)
   - Define `ProvidersDTO` (hasPCP, pcpName, pcpPhone, pcpPractice, pcpAddress, authorizedToShare)
   - Define `PsychiatristDTO` (hasBeenEvaluated, psychiatristName, evaluationDate, clinicName, notes, differentEvaluator, evaluatorName, evaluatorClinic)
   - **Lines**: ~120
   - **Acceptance**: All DTOs are plain TypeScript interfaces (no Zod), JSON-serializable

3. **TASK 1.3**: Create `application/step4/usecases.ts`
   - Define `MedicalProvidersErrorCodes` enum
   - Implement `loadStep4(repository, sessionId, organizationId): Promise<LoadStep4Response>`
   - Implement `upsertMedicalProviders(repository, input, sessionId, organizationId): Promise<SaveStep4Response>`
   - Add alias `saveStep4` → `upsertMedicalProviders`
   - **Lines**: ~190
   - **Acceptance**: Both functions use canonical `{ ok, data|error }` contract, handle NOT_FOUND with createEmptyOutput()

4. **TASK 1.4**: Create `application/step4/mappers.ts`
   - Implement `toPartialDomain(dto: Step4InputDTO): MedicalProvidersDataPartial`
   - Implement `toDomain(dto: Step4InputDTO): MedicalProvidersData`
   - Implement `toOutput(domain, sessionId, organizationId): Step4OutputDTO`
   - Implement `createEmptyOutput(sessionId, organizationId): Step4OutputDTO`
   - Add section mappers: `providersToDomain()`, `providersToDTO()`, `psychiatristToDomain()`, `psychiatristToDTO()`
   - **Lines**: ~180
   - **Acceptance**: All mappers are pure functions, no side effects, handle optional fields with `?.` operator

5. **TASK 1.5**: Create `application/step4/medical-providers.enums.ts`
   - Define `PCP_STATUS` tuple and type
   - Define `EVALUATION_STATUS` tuple and type
   - Add `PCP_STATUS_OPTIONS` for UI
   - Add `EVALUATION_STATUS_OPTIONS` for UI
   - **Lines**: ~30
   - **Acceptance**: Enums match Domain schema exactly

6. **TASK 1.6**: Create `application/step4/index.ts`
   - Export all DTOs
   - Export all mappers
   - Export repository port (type only)
   - Export all use cases
   - Export enums
   - **Lines**: ~20
   - **Acceptance**: All public APIs are exported

---

### Phase 2: Infrastructure Layer (P0)
**Objective**: Create persistence adapters for Supabase

**Tasks**:
1. **TASK 2.1**: Create `infrastructure/repositories/medical-providers.repository.ts`
   - Implement `MedicalProvidersRepositoryImpl` class
   - Implement `findBySession()` method with RLS
   - Implement `save()` method with upsert
   - Implement `exists()` method
   - Implement `delete()` method (optional)
   - Use `orbipax_core.medical_providers` table
   - **Lines**: ~260
   - **Acceptance**: All methods use `{ ok, data|error }` contract, snake_case DB columns mapped to camelCase DTOs

2. **TASK 2.2**: Create `infrastructure/factories/medical-providers.factory.ts`
   - Implement `createMedicalProvidersRepository(): MedicalProvidersRepository`
   - Return `new MedicalProvidersRepositoryImpl()`
   - **Lines**: ~26
   - **Acceptance**: Factory returns correct interface type

---

### Phase 3: Actions Layer (P0)
**Objective**: Create server actions with auth guards and DI

**Tasks**:
1. **TASK 3.1**: Create `actions/step4/medical-providers.actions.ts`
   - Add `'use server'` directive
   - Define `ActionResponse<T>` type
   - Implement `loadStep4Action(): Promise<ActionResponse<Step4OutputDTO>>`
   - Implement `upsertMedicalProvidersAction(input: Step4InputDTO): Promise<ActionResponse<{ sessionId: string }>>`
   - Add auth guards with `resolveUserAndOrg()`
   - Add TODO comment for session ID resolution
   - **Lines**: ~210
   - **Acceptance**: Both actions have auth guards, use DI factory, delegate to use cases, never expose PHI in error messages

2. **TASK 3.2**: Create `actions/step4/index.ts`
   - Export `loadStep4Action`
   - Export `upsertMedicalProvidersAction`
   - **Lines**: ~11
   - **Acceptance**: All public actions are exported

---

### Phase 4: Verification (P0)
**Objective**: Ensure all layers work together

**Tasks**:
1. **TASK 4.1**: Run TypeScript compiler
   - Command: `npx tsc --noEmit`
   - **Acceptance**: 0 errors

2. **TASK 4.2**: Run ESLint
   - Command: `npm run lint`
   - **Acceptance**: 0 errors in Application/Actions/Infrastructure for Step 4

3. **TASK 4.3**: Verify imports
   - Grep: `import.*application/step4`
   - Grep: `import.*actions/step4`
   - **Acceptance**: Actions import from Application, Application imports from Domain

4. **TASK 4.4**: Verify contract consistency
   - Check: All validation returns `{ ok, data|issues }`
   - Check: All use cases return `{ ok, data|error }`
   - Check: All actions return `{ ok, data|error }`
   - Check: All repository methods return `{ ok, data|error }`
   - **Acceptance**: Contracts match matrix in this audit

---

## 📐 Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer                             │
│  (Step4MedicalProviders.tsx, ProvidersSection.tsx, etc.)   │
│                                                             │
│  Imports: validateMedicalProviders(), { ok, issues }       │
│  Calls: loadStep4Action(), upsertMedicalProvidersAction()  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Server Actions Call
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    Actions Layer (P0 - MISSING)             │
│            actions/step4/medical-providers.actions.ts       │
│                                                             │
│  - 'use server'                                             │
│  - Auth guards (resolveUserAndOrg)                          │
│  - Multi-tenant isolation (organizationId)                  │
│  - DI (createMedicalProvidersRepository)                    │
│  - Delegates to Application use cases                       │
│  - Returns: { ok, data|error }                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Use Case Call
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                Application Layer (P0 - MISSING)             │
│              application/step4/usecases.ts                  │
│                                                             │
│  - loadStep4(repository, sessionId, organizationId)         │
│  - upsertMedicalProviders(repository, input, ...)           │
│  - Validates parameters                                     │
│  - Calls mappers (toPartialDomain)                          │
│  - Validates with Domain schema (medicalProvidersDataPartialSchema) │
│  - Delegates to Repository                                  │
│  - Returns: { ok, data|error }                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Repository Call
                       ↓
┌─────────────────────────────────────────────────────────────┐
│              Infrastructure Layer (P0 - MISSING)            │
│      infrastructure/repositories/medical-providers.repository.ts │
│                                                             │
│  - Implements MedicalProvidersRepository port               │
│  - Uses Supabase client (createServerClient)                │
│  - RLS enforcement (organization_id filter)                 │
│  - JSONB columns: providers, psychiatrist                   │
│  - Methods: findBySession, save (upsert), exists, delete    │
│  - Returns: { ok, data|error }                              │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Supabase Query
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                    Database Layer                           │
│           orbipax_core.medical_providers table              │
│                                                             │
│  Columns:                                                   │
│  - session_id (PK)                                          │
│  - organization_id (PK + RLS filter)                        │
│  - providers (JSONB)                                        │
│  - psychiatrist (JSONB)                                     │
│  - last_modified (timestamptz)                              │
│  - completed_at (timestamptz, nullable)                     │
└─────────────────────────────────────────────────────────────┘

Validation Flow (UI → Domain):
┌─────────────────────────────────────────────────────────────┐
│                     Domain Layer (✅ COMPLETE)              │
│       domain/schemas/medical-providers/medical-providers.schema.ts │
│                                                             │
│  - validateMedicalProviders(input) → { ok, data|issues }    │
│  - validateMedicalProvidersPartial(input) → { ok, data|issues } │
│  - Zod schemas: medicalProvidersDataSchema, providersSchema, │
│    psychiatristSchema                                       │
│  - NO business logic (validation only)                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 Acceptance Criteria

### Application Layer
- [ ] 6 files created in `application/step4/`
- [ ] All DTOs are plain TypeScript interfaces (no Zod)
- [ ] Use cases use `{ ok, data|error }` contract
- [ ] Mappers handle DTO ↔ Domain transformations
- [ ] Error codes enum defined (VALIDATION_FAILED, NOT_FOUND, SAVE_FAILED, UNKNOWN)
- [ ] `createEmptyOutput()` function returns valid empty structure
- [ ] TypeScript compiles with 0 errors

### Actions Layer
- [ ] 2 files created in `actions/step4/`
- [ ] `'use server'` directive present
- [ ] Auth guards with `resolveUserAndOrg()` in both actions
- [ ] Organization validation (rejects if missing)
- [ ] DI factory used (not direct repository instantiation)
- [ ] Generic error messages (no PHI exposure)
- [ ] TODO comment for session ID resolution
- [ ] TypeScript compiles with 0 errors

### Infrastructure Layer
- [ ] 2 files created (repository + factory)
- [ ] Repository implements `MedicalProvidersRepository` interface
- [ ] RLS enforced (`eq('organization_id', organizationId)`)
- [ ] Upsert uses `onConflict: 'session_id,organization_id'`
- [ ] DB columns use snake_case, DTOs use camelCase
- [ ] Error handling with try-catch + generic responses
- [ ] Factory returns correct interface type
- [ ] TypeScript compiles with 0 errors

### Cross-Layer Verification
- [ ] Actions → Application imports work
- [ ] Application → Domain imports work
- [ ] Infrastructure → Application imports work (ports only)
- [ ] No circular dependencies
- [ ] Contract consistency: Domain uses `issues`, all others use `error: { code, message }`
- [ ] ESLint passes with 0 errors
- [ ] No legacy references (no `step4` legacy naming)

---

## 📊 Line Count Estimates

| Layer | File | Estimated Lines | Notes |
|-------|------|-----------------|-------|
| **Application** | ports.ts | 180 | Port interface + RepositoryResponse |
| **Application** | dtos.ts | 120 | Input/Output DTOs + Section DTOs |
| **Application** | usecases.ts | 190 | loadStep4 + upsertMedicalProviders |
| **Application** | mappers.ts | 180 | DTO↔Domain transformations |
| **Application** | medical-providers.enums.ts | 30 | Enums for UI consistency |
| **Application** | index.ts | 20 | Barrel export |
| **Actions** | medical-providers.actions.ts | 210 | loadStep4Action + upsertMedicalProvidersAction |
| **Actions** | index.ts | 11 | Barrel export |
| **Infrastructure** | medical-providers.repository.ts | 260 | Repository implementation |
| **Infrastructure** | medical-providers.factory.ts | 26 | DI factory |
| **Total** |  | **~1,227** | **11 files** |

**Comparison to Step 3**:
- Step 3 Total: ~1,130 lines (10 files, excluding diagnosisSuggestionService)
- Step 4 Estimate: ~1,227 lines (11 files, including enums)
- Difference: +97 lines (+8.6%) - Similar complexity

---

## 🔐 Security & Multi-Tenant Considerations

### RLS Enforcement
- All repository queries **MUST** include `.eq('organization_id', organizationId)`
- Supabase RLS policies enforce organization isolation at DB level
- Actions layer validates `organizationId` is present before proceeding

### PHI Protection
- Error messages in Actions/Infrastructure use generic descriptions
- Never expose raw Zod validation errors to client
- Use error codes instead of detailed messages

### Auth Guards
- All actions use `resolveUserAndOrg()` from `@/shared/lib/current-user.server`
- Return `UNAUTHORIZED` error if auth fails
- Return `ORGANIZATION_MISMATCH` if organizationId missing

---

## 🚀 Next Steps

1. **Review this audit** with stakeholders
2. **Approve implementation plan** (Phases 1-4)
3. **Execute Phase 1** (Application Layer) - 6 files
4. **Execute Phase 2** (Infrastructure Layer) - 2 files
5. **Execute Phase 3** (Actions Layer) - 2 files
6. **Execute Phase 4** (Verification) - TypeScript + ESLint
7. **Update UI** to call new Actions (if needed)
8. **Database Migration** (create `medical_providers` table) - if not exists

---

## 📚 References

- **Step 3 Application**: `src/modules/intake/application/step3/` (7 files)
- **Step 3 Actions**: `src/modules/intake/actions/step3/` (2 files)
- **Step 3 Infrastructure**: `src/modules/intake/infrastructure/` (2 files)
- **Step 4 Domain**: `src/modules/intake/domain/schemas/medical-providers/` (2 files)
- **Hexagonal Architecture**: Ports & Adapters pattern
- **Contract Pattern**: `{ ok, data|issues|error }` discriminated unions

---

**Audit Completed**: 2025-09-30
**Deliverable**: `D:\ORBIPAX-PROJECT\tmp\step4_app_actions_infra_audit.md`
**Status**: ✅ Ready for implementation approval
