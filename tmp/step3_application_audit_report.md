# Step 3 Application Layer Audit Report
## Diagnoses & Clinical Evaluation - Pattern Discovery

**Date**: 2025-09-28
**Task**: Audit Application layer needs for Step 3 following step2 pattern
**Status**: ✅ AUDIT COMPLETE (Read-Only)

---

## Executive Summary

Audited existing Application layer patterns (step1 & step2) to propose Step 3 structure:
- ✅ **Pattern Identified**: 5 files per step (dtos, mappers, ports, usecases, index)
- ✅ **DTOs Mapped**: 10 DTO interfaces needed for clinical data
- ✅ **Port Defined**: DiagnosesRepository with 4 methods
- ✅ **Use Cases**: 3 main operations (load, upsert, validate)
- ✅ **Dependencies**: Application → Domain only (no UI/Infra)
- ✅ **Next Step**: Create dtos.ts first (single file APPLY)

---

## 1. EXISTING PATTERN DISCOVERY

### Step 2 File Structure (Model to Follow)
```
src/modules/intake/application/step2/
├── dtos.ts       (80 lines) - JSON-serializable DTOs
├── mappers.ts    (150 lines) - DTO ↔ Domain transformations
├── ports.ts      (158 lines) - Repository interface + mock
├── usecases.ts   (176 lines) - Business orchestration
└── index.ts      (20 lines) - Barrel export
```

### Key Patterns Observed

#### DTOs Pattern
- Separate Input/Output DTOs for each operation
- All dates as ISO strings (not Date objects)
- RepositoryResponse<T> for all repository returns
- Error codes enum for standardized errors

#### Mappers Pattern
- Pure functions: `toPartialDomain()`, `toOutput()`, `createEmptyOutput()`
- Date helpers: `dateToISOString()`, `parseISOString()`
- No side effects, no async operations

#### Ports Pattern
- Interface defines contract (4-5 methods typical)
- Mock implementation for testing
- Methods: findBySession, save, exists, delete (optional)
- Multi-tenant via organizationId parameter

#### Use Cases Pattern
- Dependency injection of repository
- Domain validation via Zod schemas
- Try-catch for unexpected errors
- Return standardized response types

---

## 2. PROPOSED STEP 3 STRUCTURE

### File Paths (To Be Created)
```
src/modules/intake/application/step3/
├── dtos.ts       - Clinical DTOs (diagnoses, psychiatric, functional)
├── mappers.ts    - Step3Data ↔ DTOs transformations
├── ports.ts      - DiagnosesRepository interface
├── usecases.ts   - loadStep3, upsertDiagnoses, validateStep3ForSubmit
└── index.ts      - Barrel export
```

---

## 3. PROPOSED DTOS (dtos.ts)

### Core Record DTOs
```typescript
// Individual diagnosis record
export interface DiagnosisRecordDTO {
  code: string                    // ICD-10/DSM-5 code
  description: string
  diagnosisType: string           // From DiagnosisType enum
  severity: string                // mild/moderate/severe/unspecified
  diagnosisDate: string           // ISO date string
  onsetDate?: string             // ISO date string
  verifiedBy?: string            // Clinician name
  isBillable?: boolean
  notes?: string
}

// Diagnoses section
export interface DiagnosesDTO {
  primaryDiagnosis?: string
  secondaryDiagnoses: string[]
  substanceUseDisorder?: string   // yes/no/unknown
  mentalHealthHistory?: string
  diagnosisRecords: DiagnosisRecordDTO[]
}

// Psychiatric evaluation
export interface PsychiatricEvaluationDTO {
  currentSymptoms: string[]
  severityLevel?: string          // From SeverityLevel enum
  suicidalIdeation?: boolean
  homicidalIdeation?: boolean
  psychoticSymptoms?: boolean
  medicationCompliance?: string   // From MedicationCompliance enum
  treatmentHistory?: string
  hasPsychEval: boolean
  evaluationDate?: string         // ISO date string
  evaluatedBy?: string
  evaluationSummary?: string
}

// Functional assessment
export interface FunctionalAssessmentDTO {
  affectedDomains: string[]       // From WHODASDomain enum
  adlsIndependence: string        // From IndependenceLevel enum
  iadlsIndependence: string       // From IndependenceLevel enum
  cognitiveFunctioning: string    // From CognitiveFunctioning enum
  hasSafetyConcerns: boolean
  globalFunctioning?: number      // GAF score 0-100
  dailyLivingActivities: string[]
  socialFunctioning?: string      // From SocialFunctioning enum
  occupationalFunctioning?: string // From OccupationalFunctioning enum
  cognitiveStatus?: string        // From CognitiveStatus enum
  adaptiveBehavior?: string
  additionalNotes?: string
}
```

### Input/Output DTOs
```typescript
// Input for saving Step 3 data
export interface Step3InputDTO {
  diagnoses?: DiagnosesDTO
  psychiatricEvaluation?: PsychiatricEvaluationDTO
  functionalAssessment?: FunctionalAssessmentDTO
}

// Output for loading Step 3 data
export interface Step3OutputDTO {
  sessionId: string
  organizationId: string
  data: {
    diagnoses: DiagnosesDTO
    psychiatricEvaluation: PsychiatricEvaluationDTO
    functionalAssessment: FunctionalAssessmentDTO
  }
  lastModified?: string // ISO date string
  completedAt?: string  // ISO date string if step completed
}
```

### Response Types
```typescript
// Repository response wrapper
export interface RepositoryResponse<T> {
  ok: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

// Error codes enum
export enum DiagnosesErrorCodes {
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  SAVE_FAILED = 'SAVE_FAILED',
  UNKNOWN = 'UNKNOWN'
}

// Use case responses
export type LoadStep3Response = RepositoryResponse<Step3OutputDTO>
export type SaveStep3Response = RepositoryResponse<{ sessionId: string }>
export type ValidateStep3Response = RepositoryResponse<{ isValid: boolean; issues?: string[] }>
```

---

## 4. PROPOSED PORTS (ports.ts)

### DiagnosesRepository Interface
```typescript
export interface DiagnosesRepository {
  /**
   * Find Step 3 data by session and organization
   * Multi-tenant: scoped to organization via RLS
   */
  findBySession(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<Step3OutputDTO>>

  /**
   * Upsert Step 3 data for a session
   * Creates or updates the clinical assessment data
   */
  upsert(
    sessionId: string,
    organizationId: string,
    input: Step3InputDTO
  ): Promise<RepositoryResponse<{ sessionId: string }>>

  /**
   * Check if Step 3 data exists for a session
   */
  exists(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<{ exists: boolean }>>

  /**
   * Mark Step 3 as complete
   * Sets completedAt timestamp
   */
  markComplete(
    sessionId: string,
    organizationId: string
  ): Promise<RepositoryResponse<{ completedAt: string }>>
}
```

### Mock Implementation
```typescript
export class MockDiagnosesRepository implements DiagnosesRepository {
  private store = new Map<string, Step3OutputDTO>()
  // Implementation similar to MockInsuranceRepository
}
```

---

## 5. PROPOSED MAPPERS (mappers.ts)

### Key Mapping Functions
```typescript
// DTO to Domain
export function toDomain(dto: Step3InputDTO): Step3Data
export function toPartialDomain(dto: Step3InputDTO): Step3DataPartial

// Domain to DTO
export function toOutput(
  domain: Step3Data,
  sessionId: string,
  organizationId: string
): Step3OutputDTO

// Helpers
export function createEmptyOutput(
  sessionId: string,
  organizationId: string
): Step3OutputDTO

// Individual section mappers
export function mapDiagnosesDTO(dto: DiagnosesDTO): Diagnoses
export function mapPsychiatricDTO(dto: PsychiatricEvaluationDTO): PsychiatricEvaluation
export function mapFunctionalDTO(dto: FunctionalAssessmentDTO): FunctionalAssessment
```

---

## 6. PROPOSED USE CASES (usecases.ts)

### Load Step 3 Data
```typescript
export async function loadStep3(
  repository: DiagnosesRepository,
  sessionId: string,
  organizationId: string
): Promise<LoadStep3Response>
```

### Upsert Step 3 Data
```typescript
export async function upsertDiagnoses(
  repository: DiagnosesRepository,
  input: Step3InputDTO,
  sessionId: string,
  organizationId: string
): Promise<SaveStep3Response>
```

### Validate for Submit
```typescript
export async function validateStep3ForSubmit(
  repository: DiagnosesRepository,
  sessionId: string,
  organizationId: string
): Promise<ValidateStep3Response>
```

---

## 7. DEPENDENCIES MAP

### Application Layer Dependencies
```
application/step3/
├── usecases.ts
│   ├── imports from './dtos'
│   ├── imports from './mappers'
│   ├── imports from './ports'
│   └── imports from '@/modules/intake/domain/schemas'
├── mappers.ts
│   ├── imports from './dtos'
│   └── imports from '@/modules/intake/domain/schemas'
├── dtos.ts
│   └── No domain imports (pure DTOs)
├── ports.ts
│   └── imports from './dtos'
└── index.ts
    └── Re-exports all
```

### Cross-Layer Dependencies
- **Application → Domain**: ✅ Allowed (schemas, types)
- **Application → Infrastructure**: ❌ Not allowed (uses ports)
- **Application → UI**: ❌ Not allowed
- **Application → Actions**: ❌ Not allowed

---

## 8. INFRASTRUCTURE PORT NEEDED

### Repository Implementation Path
```
src/modules/intake/infrastructure/repositories/diagnoses.repository.ts
```

Will implement `DiagnosesRepository` interface with:
- Supabase client injection
- RLS via organization_id
- Table: `intake_step3_clinical`
- JSON column for data storage

---

## 9. GAPS & RISKS

### Identified Gaps
1. **Enum Compatibility**: Some domain enums have values not in DTOs (e.g., 'unspecified' in severity)
2. **Date Handling**: Need consistent ISO string conversion
3. **Validation Messages**: Need generic messages without PHI
4. **Error Mapping**: Need standardized error codes

### Risks
1. **Large Payload**: Step 3 has significant data (3 sections)
2. **Conditional Fields**: Psychiatric eval has conditional requirements
3. **Type Safety**: Many optional fields need careful mapping

### Mitigation
- Start with DTOs (smallest risk)
- Test mappers thoroughly
- Use partial schemas for drafts

---

## 10. RECOMMENDED IMPLEMENTATION ORDER

### Phase 1: Core Contracts (This Sprint)
1. **dtos.ts** - Define all DTOs ✅ (NEXT TASK)
2. **ports.ts** - Define repository interface
3. **index.ts** - Set up barrel export

### Phase 2: Logic Implementation
4. **mappers.ts** - Implement transformations
5. **usecases.ts** - Implement business logic

### Phase 3: Infrastructure
6. Create `diagnoses.repository.ts` in Infrastructure
7. Create factory for DI
8. Wire to Actions layer

---

## ALLOWED PATHS FOR NEXT TASK (dtos.ts)

### Write Access
```
D:\ORBIPAX-PROJECT\src\modules\intake\application\step3\dtos.ts
```

### Read Access
```
D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\diagnoses-clinical.schema.ts
D:\ORBIPAX-PROJECT\src\modules\intake\domain\types\common.ts
D:\ORBIPAX-PROJECT\src\modules\intake\application\step2\dtos.ts (for pattern)
```

---

## CONCLUSION

The audit reveals Step 3 needs:
- **10 DTO interfaces** for clinical data transport
- **1 Repository port** with 4 methods
- **3 Use cases** for load/save/validate operations
- **5 Mapper functions** for transformations

**Next Micro-Task**: Create `application/step3/dtos.ts` with all DTO definitions

**Pattern Source**: step2 implementation (proven working)
**Risk Level**: Low (following established patterns)
**Dependencies**: Domain schemas already exist

---

**Audit Status**: COMPLETE
**Files Read**: 8
**Files to Create**: 5
**Next Action**: APPLY dtos.ts