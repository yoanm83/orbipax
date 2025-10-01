# Step 3 Infrastructure Pattern Audit Report
## Exact Repository and Factory Patterns from Steps 1/2

**Date**: 2025-09-28
**Task**: Audit existing Infrastructure patterns for exact replication in Step 3
**Status**: ✅ AUDIT COMPLETE (Read-Only)

---

## Executive Summary

Comprehensive audit of existing Infrastructure patterns reveals:
- ✅ **2 Patterns Found**: Demographics (complex) and Insurance (simple)
- ✅ **Naming Convention**: `{domain}.repository.ts` and `{domain}.factory.ts`
- ✅ **Export Styles**: Class exports for repos, function exports for factories
- ✅ **Factory Pattern**: `create{Domain}Repository()` returns interface instance
- ✅ **Template Ready**: Exact pattern for Step 3 documented

---

## 1. EXISTING FILE INVENTORY

### Exact Paths and Names

| Step | Repository File | Factory File |
|------|----------------|--------------|
| Step 1 | `src/modules/intake/infrastructure/repositories/demographics.repository.ts` | `src/modules/intake/infrastructure/factories/demographics.factory.ts` |
| Step 2 | `src/modules/intake/infrastructure/repositories/insurance.repository.ts` | `src/modules/intake/infrastructure/factories/insurance.factory.ts` |
| **Step 3** | `src/modules/intake/infrastructure/repositories/diagnoses.repository.ts` | `src/modules/intake/infrastructure/factories/diagnoses.factory.ts` |

**Pattern**: Domain-based naming (NOT step-based)

---

## 2. REPOSITORY EXPORT PATTERNS

### demographics.repository.ts
```typescript
// Named export of implementation class
export class DemographicsRepositoryImpl implements DemographicsRepository { ... }

// Named export of singleton instance (legacy pattern)
export const demographicsRepository = new DemographicsRepositoryImpl()
```

### insurance.repository.ts
```typescript
// Named export of implementation class ONLY
export class InsuranceRepositoryImpl implements InsuranceRepository { ... }

// NO singleton instance export
```

### Pattern for Step 3
```typescript
// Follow insurance pattern (simpler, no singleton)
export class DiagnosesRepositoryImpl implements DiagnosesRepository { ... }
```

---

## 3. FACTORY EXPORT PATTERNS

### demographics.factory.ts (Complex Pattern)
```typescript
// Primary factory function
export function createDemographicsRepository(): DemographicsRepository {
  return new DemographicsRepositoryImpl()
}

// Test factory function (optional)
export function createTestDemographicsRepository(options?: {...}): DemographicsRepository {
  return new DemographicsRepositoryImpl()
}

// Singleton for backward compatibility (legacy)
export const demographicsRepositorySingleton = createDemographicsRepository()
```

### insurance.factory.ts (Simple Pattern)
```typescript
// Single factory function ONLY
export function createInsuranceRepository(): InsuranceRepository {
  return new InsuranceRepositoryImpl()
}
```

### Pattern for Step 3
```typescript
// Follow insurance pattern (simpler, cleaner)
export function createDiagnosesRepository(): DiagnosesRepository {
  return new DiagnosesRepositoryImpl()
}
```

---

## 4. IMPORT PATTERNS

### Repository Imports
```typescript
// All repositories import these consistently:
import { createServerClient } from '@/shared/lib/supabase.client'
import type { {Domain}Repository, RepositoryResponse } from '@/modules/intake/application/step{N}/ports'
import type { {Domain}InputDTO, {Domain}OutputDTO } from '@/modules/intake/application/step{N}/dtos'
```

### Factory Imports
```typescript
// All factories import these consistently:
import { {Domain}RepositoryImpl } from '../repositories/{domain}.repository'
import type { {Domain}Repository } from '@/modules/intake/application/step{N}/ports'
```

**Note**: Imports use relative path for same-module, alias for cross-module

---

## 5. JSDOC STYLE ANALYSIS

### Repository JSDoc Pattern
```typescript
/**
 * {Domain} Repository Implementation - Infrastructure Layer
 * OrbiPax Community Mental Health System
 *
 * Concrete implementation using Supabase for {domain} persistence
 * Enforces RLS and multi-tenant isolation via organization_id
 *
 * SoC: Persistence adapter only - NO validation, NO business logic
 */
```

### Factory JSDoc Pattern
```typescript
/**
 * {Domain} Repository Factory - Infrastructure Layer
 * OrbiPax Community Mental Health System
 *
 * Factory function for creating {Domain}Repository instances
 * Used by Actions layer for dependency injection
 *
 * SoC: DI composition only - NO business logic
 */
```

### Method JSDoc Pattern
```typescript
/**
 * {Action description}
 * {Multi-tenant note if applicable}
 *
 * @param {params if any}
 * @returns {return type description}
 */
```

---

## 6. ERROR CODE CONSTANT

### Consistent Pattern in All Repositories
```typescript
/**
 * Error codes for repository operations
 */
const REPO_ERROR_CODES = {
  NOT_FOUND: 'NOT_FOUND',
  CONFLICT: 'CONFLICT',
  UNAUTHORIZED: 'UNAUTHORIZED',
  UNKNOWN: 'UNKNOWN'
} as const
```

**Location**: Inside repository file, before class definition

---

## 7. CLASS NAMING CONVENTION

| Domain | Class Name | Implements |
|--------|------------|------------|
| Demographics | `DemographicsRepositoryImpl` | `DemographicsRepository` |
| Insurance | `InsuranceRepositoryImpl` | `InsuranceRepository` |
| **Diagnoses** | `DiagnosesRepositoryImpl` | `DiagnosesRepository` |

**Pattern**: `{Domain}RepositoryImpl` implements `{Domain}Repository`

---

## 8. FACTORY FUNCTION NAMING

| Domain | Factory Function | Return Type |
|--------|-----------------|-------------|
| Demographics | `createDemographicsRepository()` | `DemographicsRepository` |
| Insurance | `createInsuranceRepository()` | `InsuranceRepository` |
| **Diagnoses** | `createDiagnosesRepository()` | `DiagnosesRepository` |

**Pattern**: `create{Domain}Repository()` with no parameters

---

## 9. TEMPLATE FOR STEP 3

### diagnoses.repository.ts
```
Path: src/modules/intake/infrastructure/repositories/diagnoses.repository.ts

Exports:
- export class DiagnosesRepositoryImpl implements DiagnosesRepository

Imports from:
- '@/shared/lib/supabase.client'
- '@/modules/intake/application/step3/ports'
- '@/modules/intake/application/step3/dtos'

Constants:
- const REPO_ERROR_CODES = { NOT_FOUND, CONFLICT, UNAUTHORIZED, UNKNOWN }

Methods to implement:
- findBySession(sessionId, organizationId)
- save(sessionId, organizationId, input)
- exists(sessionId, organizationId)
- delete?(sessionId, organizationId) // optional
```

### diagnoses.factory.ts
```
Path: src/modules/intake/infrastructure/factories/diagnoses.factory.ts

Exports:
- export function createDiagnosesRepository(): DiagnosesRepository

Imports from:
- '../repositories/diagnoses.repository' (DiagnosesRepositoryImpl)
- '@/modules/intake/application/step3/ports' (type DiagnosesRepository)

Implementation:
- return new DiagnosesRepositoryImpl()
```

---

## 10. KEY OBSERVATIONS

### Pattern Differences
1. **Demographics**: More complex with test factory and singleton (legacy)
2. **Insurance**: Cleaner, single factory function only (preferred)

### Recommendation for Step 3
Follow the **Insurance pattern** (simpler):
- Single class export from repository
- Single factory function
- No singleton exports
- No test factory (unless needed)

### File Size Reference
- demographics.repository.ts: 256 lines
- insurance.repository.ts: 247 lines
- demographics.factory.ts: 56 lines
- insurance.factory.ts: 25 lines

---

## CONCLUSION

The audit confirms:
- **Naming**: Domain-based, not step-based (`diagnoses` not `step3`)
- **Exports**: Named exports only, no default exports
- **Pattern**: Simple factory returning new instance
- **Consistency**: All files follow same import/JSDoc structure

**Ready for APPLY**: Create `diagnoses.repository.ts` and `diagnoses.factory.ts` following Insurance pattern

---

**Audit Status**: COMPLETE
**Files Analyzed**: 4
**Pattern**: Insurance (simpler, recommended)
**Next Action**: Implement repository and factory