# Application Step 2 Insurance Use Cases Report
## DTOs, Mappers, Use Cases, and Repository Port

**Date**: 2025-09-28
**Module**: `src/modules/intake/application/step2`
**Status**: ✅ Complete
**Architecture**: Clean Application Layer with DI

---

## Executive Summary

Successfully created the Application layer for Step 2 (Insurance) with DTOs, mappers, use cases (loadInsurance, saveInsurance), and the InsuranceRepository port. The implementation follows clean architecture principles with strict separation of concerns and dependency injection.

## Directory Structure Created

```
src/modules/intake/application/step2/
├── dtos.ts        # Data Transfer Objects
├── mappers.ts     # DTO ↔ Domain mappers
├── ports.ts       # Repository port definition
├── usecases.ts    # Business use cases
└── index.ts       # Barrel export
```

## Symbols Exported

### DTOs (`dtos.ts`)
```typescript
// DTOs
export interface InsuranceRecordDTO
export interface GovernmentCoverageDTO
export interface InsuranceInputDTO
export interface InsuranceOutputDTO

// Response types
export interface RepositoryResponse<T>
export type LoadInsuranceResponse
export type SaveInsuranceResponse

// Error codes
export const InsuranceErrorCodes
export type InsuranceErrorCode
```

### Mappers (`mappers.ts`)
```typescript
export function toDomain(input: InsuranceInputDTO): InsuranceData | InsuranceDataPartial
export function toPartialDomain(input: InsuranceInputDTO): InsuranceDataPartial
export function toOutput(domainData, sessionId, organizationId): InsuranceOutputDTO
export function createEmptyOutput(sessionId, organizationId): InsuranceOutputDTO
```

### Port (`ports.ts`)
```typescript
export interface InsuranceRepository {
  findBySession(sessionId: string, organizationId: string): Promise<RepositoryResponse<InsuranceOutputDTO>>
  save(sessionId: string, organizationId: string, input: InsuranceInputDTO): Promise<RepositoryResponse<{ sessionId: string }>>
  exists(sessionId: string, organizationId: string): Promise<RepositoryResponse<{ exists: boolean }>>
  delete?(sessionId: string, organizationId: string): Promise<RepositoryResponse<{ deleted: boolean }>>
}

export class MockInsuranceRepository // For testing only
```

### Use Cases (`usecases.ts`)
```typescript
export async function loadInsurance(repository, sessionId, organizationId): Promise<LoadInsuranceResponse>
export async function saveInsurance(repository, input, sessionId, organizationId): Promise<SaveInsuranceResponse>
export async function checkInsuranceExists(repository, sessionId, organizationId): Promise<...>
export async function deleteInsurance(repository, sessionId, organizationId): Promise<...>
```

## Domain Integration Evidence

### Imports from Domain
```typescript
// mappers.ts
import {
  type InsuranceData,
  type InsuranceDataPartial,
  insuranceDataSchema,
  insuranceDataPartialSchema
} from '@/modules/intake/domain'

// usecases.ts
import { insuranceDataPartialSchema } from '@/modules/intake/domain'
```

### Enums from domain/types/common.ts
The following enums are defined in `domain/types/common.ts` and used by the schema:
- `InsuranceCarrier` (aetna, bcbs, cigna, humana, united, other)
- `PlanType` (hmo, ppo, epo, pos, hdhp, other)
- `SubscriberRelationship` (self, spouse, child, other)

## Contract Structure

### Input/Output Contract
```typescript
// Request
{
  ok: boolean,
  data?: InsuranceOutputDTO,
  error?: {
    code: 'UNAUTHORIZED' | 'NOT_FOUND' | 'VALIDATION_FAILED' | 'CONFLICT' | 'UNKNOWN',
    message?: string  // Generic only, no PHI
  }
}

// InsuranceOutputDTO shape
{
  sessionId: string,
  organizationId: string,
  data: {
    insuranceRecords: InsuranceRecordDTO[],
    governmentCoverage?: GovernmentCoverageDTO
  },
  lastModified?: string  // ISO date
}
```

## Key Design Decisions

### 1. JSON-Serializable DTOs
- All dates as ISO strings
- No class instances or Date objects in DTOs
- Clean transport layer contracts

### 2. Dependency Injection Pattern
```typescript
// Port defined in Application
interface InsuranceRepository { ... }

// Use case accepts repository
loadInsurance(repository: InsuranceRepository, ...)

// Infrastructure will implement
class InsuranceRepositoryImpl implements InsuranceRepository
```

### 3. Validation with Domain Schema
```typescript
// Mapper validates with domain schema
const domainData = toPartialDomain(input)  // Uses insuranceDataPartialSchema
const validationResult = insuranceDataPartialSchema.safeParse(domainData)
```

### 4. Error Handling
- Generic error codes only
- No PHI in error messages
- Consistent error structure

## Validation Results

### TypeScript Compilation
```bash
npx tsc --noEmit src/modules/intake/application/step2/*.ts
✅ No errors after import path fixes
```

### Import Test
```bash
npx tsx -e "import { loadInsurance, saveInsurance, InsuranceRepository } from './src/modules/intake/application/step2'"
✅ Application/step2 imports working
```

### ESLint
```bash
npm run lint -- src/modules/intake/application/step2/
✅ Clean (ESLint config warnings ignored)
```

## SoC Compliance

### ✅ Application Layer Only
- No domain validation logic (delegates to schema)
- No persistence implementation (uses port)
- No UI concerns
- No direct Infrastructure imports

### ✅ Pure Orchestration
- Use cases coordinate domain and repository
- Mappers handle data transformation
- Port defines contract only

### ✅ No Side Effects
- No console.log statements
- No timers or fetch calls
- Pure functions where possible

## Multi-tenant Support

All operations scoped by organizationId:
```typescript
repository.findBySession(sessionId, organizationId)
repository.save(sessionId, organizationId, input)
```

Infrastructure layer will implement RLS via Supabase.

## Files Created

| File | Lines | Purpose |
|------|-------|---------|
| `dtos.ts` | 92 | Data transfer objects and types |
| `mappers.ts` | 159 | Domain ↔ DTO mapping functions |
| `ports.ts` | 127 | Repository port and mock |
| `usecases.ts` | 247 | Business use cases |
| `index.ts` | 18 | Barrel export |

## Next Micro-task Suggestion

**Actions Step 2: Server Actions for Insurance**

Create server actions for Step 2 with auth guards and factory pattern:
1. Create `src/modules/intake/actions/step2/insurance.actions.ts`
2. Implement `loadInsuranceAction` and `saveInsuranceAction`
3. Add session and organization guards
4. Use factory to create repository (will be implemented in Infrastructure later)
5. Map errors to generic codes for UI

Example structure:
```typescript
// insurance.actions.ts
'use server'

export async function loadInsuranceAction() {
  // Guards: session, organization
  // Factory: createInsuranceRepository()
  // Call: loadInsurance(repo, sessionId, orgId)
  // Return: generic error or data
}
```

## Conclusion

Application layer for Step 2 Insurance successfully implemented with:
- ✅ JSON-serializable DTOs
- ✅ Domain-aware mappers with validation
- ✅ Repository port for DI
- ✅ Complete use cases (load/save/exists/delete)
- ✅ Mock repository for testing
- ✅ Clean barrel exports
- ✅ Full TypeScript type safety
- ✅ No console statements
- ✅ SoC maintained

The layer is ready for integration with server actions (Actions layer) and persistence implementation (Infrastructure layer).

---

**Implementation by**: Claude Assistant
**Pattern**: Clean Architecture with Ports & Adapters
**Next**: Actions Step 2 (Server Actions)