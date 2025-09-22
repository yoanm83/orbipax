# OrbiPax Architectural Rules & Import Boundaries

**Version:** 1.0
**Status:** Enforced by ESLint
**Last Updated:** 2025-09-21

## Core Principles

• **Separation of Concerns (SoC):** Each layer has a single responsibility and clear boundaries
• **Dependency Direction:** Always flows inward (UI → Application → Domain)
• **Domain Purity:** Business logic remains framework-agnostic and testable
• **Infrastructure Isolation:** External services only accessed through Application layer
• **JSON Serialization:** All cross-boundary data must be plain objects (HIPAA compliance)

---

## Layer Import Matrix

| Layer | ✅ Can Import From | ❌ Cannot Import From |
|-------|-------------------|----------------------|
| **UI** | Application (same module), Shared | Infrastructure, Domain (direct), Other modules |
| **Application** | Domain (same module), Infrastructure (same module), Shared | UI, Other modules (direct) |
| **Domain** | Shared utilities only | UI, Application, Infrastructure, External frameworks |
| **Infrastructure** | Shared utilities only | UI, Application, Domain, Other modules |
| **Shared** | Standard libraries only | Any module-specific code |

---

## Allowed Import Directions

### ✅ **Permitted Flows**

```
UI → Application (same module)
├─ React components call use cases
├─ Server Actions invoke application services
└─ Pages consume application layer APIs

Application → Domain (same module)
├─ Use cases call business logic
├─ Services validate with domain rules
└─ Commands transform domain entities

Application → Infrastructure (same module)
├─ Use cases call repositories
├─ Services use external APIs
└─ Commands persist via adapters

Domain → Shared
├─ Entities use shared utilities
├─ Value objects use validators
└─ Business rules use constants

Infrastructure → Shared
├─ Repositories use shared types
├─ Adapters use shared utilities
└─ Clients use shared configurations
```

### ❌ **Forbidden Flows**

```
UI ❌ Infrastructure
├─ No direct database calls from components
├─ No external API calls from UI
└─ No repository imports in pages

Domain ❌ Infrastructure/UI/Application
├─ No React imports in domain
├─ No database clients in entities
└─ No external service calls from business logic

Cross-Module Deep Imports ❌
├─ No @/modules/patients/domain from billing
├─ No @/modules/*/infrastructure from other modules
└─ Use public module APIs only
```

---

## Wrapper Order (Security Middleware)

**Mandatory Order for Application Layer:**

```typescript
withAuth → withSecurity → withRateLimit → withAudit → withIdempotency (mutations only)
```

### Read Operations
```typescript
withAuth(withSecurity(withRateLimit(withAudit(readAction))))
```

### Write Operations
```typescript
withAuth(withSecurity(withRateLimit(withAudit(withIdempotency(writeAction)))))
```

**Enforcement:** ESLint rules detect incorrect wrapper composition

---

## JSON-Serializable Contracts

### ✅ **Allowed Return Types**

```typescript
// Plain objects
{ ok: true, data: { name: "John", age: 30 } }

// Primitives
string | number | boolean | null

// Arrays of serializable values
string[] | { id: string; name: string; }[]

// Nested plain objects
{ user: { id: string; profile: { name: string } } }
```

### ❌ **Forbidden Return Types**

```typescript
// Class instances
return new Patient(data);

// Functions
return () => console.log("Not serializable");

// Undefined (use null instead)
return undefined;

// Symbols
return Symbol("not-serializable");
```

---

## Console Usage Rules

• **Allowed:** `console.warn()` and `console.error()` for debugging and error reporting
• **Forbidden:** `console.log()`, `console.info()`, `console.debug()` in production code
• **Rationale:** Prevents PHI leakage through development logs

---

## Module Boundaries

### Public Module APIs

Each module should expose public contracts:

```typescript
// src/modules/patients/index.ts
export type { Patient, PatientCreateInput } from './domain';
export { createPatient, getPatient } from './application';
// Note: Infrastructure and UI are private to the module
```

### Cross-Module Communication

```typescript
// ✅ Correct - via public API
import { createPatient } from '@/modules/patients';

// ❌ Incorrect - deep import
import { createPatient } from '@/modules/patients/application/create-patient';
```

---

## Exception Workflow

### Temporary Exceptions

```typescript
// eslint-disable-next-line no-restricted-imports
import { DatabaseClient } from '@/infrastructure/db';
// TODO: Refactor to use proper dependency injection
```

### Permanent Exceptions

1. **Document in ADR:** Create `docs/soc/exceptions/ADR-XXXX-exception-name.md`
2. **Add to Exception Registry:** Update `docs/soc/exceptions.md`
3. **Review Quarterly:** Ensure exceptions are still valid

### Exception Categories

- **Technical Debt:** Temporary violations during refactoring
- **Framework Limitations:** Next.js specific requirements
- **Performance Critical:** Optimizations that bypass normal flows
- **External Dependencies:** Third-party library constraints

---

## Enforcement Mechanisms

### ESLint Rules

- `no-restricted-imports`: Enforces layer boundaries
- `no-console`: Prevents console pollution
- `@typescript-eslint/no-explicit-any`: Ensures type safety
- `import/no-default-export`: Promotes explicit contracts
- Custom rules for wrapper order validation

### TypeScript Configuration

- `strict: true`: Maximum type safety
- `noUncheckedIndexedAccess: true`: Prevents undefined access
- `exactOptionalPropertyTypes: true`: Strict optional handling

### Build-Time Checks

- ESLint must pass before build
- TypeScript compilation with zero errors
- Import cycle detection
- Dependency graph validation

---

## Violation Examples & Fixes

### UI → Infrastructure Violation

```typescript
// ❌ Violation
import { DatabaseClient } from '@/infrastructure/db';

function PatientList() {
  const patients = DatabaseClient.query('SELECT * FROM patients');
  return <div>{/* render patients */}</div>;
}

// ✅ Fix
import { getPatients } from '@/modules/patients/application';

function PatientList() {
  const patients = getPatients();
  return <div>{/* render patients */}</div>;
}
```

### Domain → Framework Violation

```typescript
// ❌ Violation
import { useState } from 'react';

export class Patient {
  constructor(private data: PatientData) {}

  getDisplayName() {
    const [name] = useState(this.data.name); // React in domain!
    return name;
  }
}

// ✅ Fix
export class Patient {
  constructor(private data: PatientData) {}

  getDisplayName(): string {
    return this.data.firstName + ' ' + this.data.lastName;
  }
}
```

---

## Quality Gates

### Pre-Commit Checks
- ESLint with zero violations
- TypeScript compilation success
- Prettier formatting applied

### CI Pipeline Checks
- Architecture boundary validation
- Import cycle detection
- Security wrapper usage verification
- JSON serialization compliance

### Code Review Checklist
- [ ] Layer boundaries respected
- [ ] No console.log statements
- [ ] Wrapper order correct for security-sensitive operations
- [ ] Return types are JSON-serializable
- [ ] No cross-module deep imports

---

**Remember:** These rules exist to maintain HIPAA compliance, ensure system security, and enable long-term maintainability of the OrbiPax CMH platform.