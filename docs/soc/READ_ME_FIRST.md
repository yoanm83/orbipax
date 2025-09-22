# 🛡️ OrbiPax Development Guardrails - READ ME FIRST

**Welcome to OrbiPax!** This project enforces strict architectural boundaries to ensure HIPAA compliance, security, and maintainability. This guide will help you understand and fix common lint errors.

---

## 🚨 Common ESLint Errors & Quick Fixes

### 1. **UI → Infrastructure Import Violation**

**Error Message:**
```
ESLint: UI layer cannot import from Infrastructure. Use Application layer instead. (ui → application → infrastructure)
```

**What it means:** Your UI component is trying to directly access database, API clients, or external services.

**❌ Problematic Code:**
```typescript
// src/modules/patients/ui/PatientList.tsx
import { DatabaseClient } from '@/infrastructure/db'; // ❌ BLOCKED

function PatientList() {
  const patients = DatabaseClient.getPatients(); // Direct DB access
  return <div>...</div>;
}
```

**✅ Correct Approach:**
```typescript
// src/modules/patients/ui/PatientList.tsx
import { getPatients } from '../application/get-patients'; // ✅ ALLOWED

function PatientList() {
  const patients = getPatients(); // Via application layer
  return <div>...</div>;
}
```

### 2. **Domain → Framework Import Violation**

**Error Message:**
```
ESLint: Domain layer cannot import from UI. Domain must be pure and framework-agnostic.
```

**What it means:** Your business logic is importing React, Next.js, or other UI frameworks.

**❌ Problematic Code:**
```typescript
// src/modules/patients/domain/patient.ts
import { useState } from 'react'; // ❌ BLOCKED

export class Patient {
  getName() {
    const [name] = useState(''); // React in business logic!
    return name;
  }
}
```

**✅ Correct Approach:**
```typescript
// src/modules/patients/domain/patient.ts
// No React imports - pure business logic

export class Patient {
  constructor(private data: PatientData) {}

  getName(): string {
    return `${this.data.firstName} ${this.data.lastName}`;
  }

  isActive(): boolean {
    return this.data.status === 'active';
  }
}
```

### 3. **Console.log Usage**

**Error Message:**
```
ESLint: Unexpected console statement. (no-console)
```

**What it means:** You're using `console.log` which can leak PHI data in production.

**❌ Problematic Code:**
```typescript
console.log('Patient data:', patient); // ❌ BLOCKED - PHI leak risk
```

**✅ Correct Approach:**
```typescript
console.warn('Patient validation failed'); // ✅ ALLOWED
console.error('Database connection error:', error.message); // ✅ ALLOWED

// For debugging, use proper logging in development
if (process.env.NODE_ENV === 'development') {
  console.warn('Debug info:', sanitizedData); // No PHI
}
```

### 4. **Cross-Module Deep Imports**

**Error Message:**
```
ESLint: Use public module APIs instead of deep imports.
```

**❌ Problematic Code:**
```typescript
// From billing module trying to access patient internals
import { PatientRepository } from '@/modules/patients/infrastructure/patient-repository'; // ❌ BLOCKED
```

**✅ Correct Approach:**
```typescript
// Use the public API
import { getPatient } from '@/modules/patients'; // ✅ ALLOWED
```

### 5. **Any Type Usage**

**Error Message:**
```
ESLint: Unexpected any. Specify a different type. (@typescript-eslint/no-explicit-any)
```

**❌ Problematic Code:**
```typescript
function processData(data: any) { // ❌ BLOCKED
  return data.someProperty;
}
```

**✅ Correct Approach:**
```typescript
interface ProcessableData {
  someProperty: string;
  otherProperty?: number;
}

function processData(data: ProcessableData) { // ✅ ALLOWED
  return data.someProperty;
}

// Or use unknown for truly dynamic data
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'someProperty' in data) {
    return (data as ProcessableData).someProperty;
  }
  throw new Error('Invalid data format');
}
```

---

## 🏗️ Architecture Layer Guide

### **UI Layer** (`src/modules/*/ui/`)
**Purpose:** React components, pages, user interactions
**Can import:** Application layer (same module), Shared utilities
**Cannot import:** Infrastructure, Domain (directly), Other modules

```typescript
// ✅ Good UI component
import { createPatient } from '../application/create-patient';
import { Button } from '@/shared/ui/button';

export function CreatePatientForm() {
  const handleSubmit = async (data: FormData) => {
    const result = await createPatient(data); // Application layer call
    if (result.ok) {
      // Handle success
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### **Application Layer** (`src/modules/*/application/`)
**Purpose:** Use cases, orchestration, business workflows
**Can import:** Domain (same module), Infrastructure (same module), Shared
**Cannot import:** UI, Other modules

```typescript
// ✅ Good application service
import { Patient } from '../domain/patient';
import { PatientRepository } from '../infrastructure/patient-repository';
import { withAuth, withAudit } from '@/shared/wrappers';

export const createPatient = withAuth(withAudit(
  async (input: CreatePatientInput): Promise<CreatePatientResult> => {
    // 1. Validate with domain
    const patient = new Patient(input);

    // 2. Save via infrastructure
    const saved = await PatientRepository.save(patient);

    // 3. Return plain object (JSON-serializable)
    return { ok: true, data: saved.toPlainObject() };
  }
));
```

### **Domain Layer** (`src/modules/*/domain/`)
**Purpose:** Business entities, rules, validations (pure logic)
**Can import:** Shared utilities only
**Cannot import:** UI, Application, Infrastructure, React, etc.

```typescript
// ✅ Good domain entity
import { z } from 'zod';

const PatientSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.date(),
  status: z.enum(['active', 'inactive']),
});

export class Patient {
  constructor(private data: z.infer<typeof PatientSchema>) {
    PatientSchema.parse(data); // Validate on creation
  }

  getFullName(): string {
    return `${this.data.firstName} ${this.data.lastName}`;
  }

  isEligible(): boolean {
    const age = this.calculateAge();
    return age >= 18 && this.data.status === 'active';
  }

  private calculateAge(): number {
    const today = new Date();
    const birth = this.data.dateOfBirth;
    return today.getFullYear() - birth.getFullYear();
  }
}
```

### **Infrastructure Layer** (`src/modules/*/infrastructure/`)
**Purpose:** External services, databases, APIs, file storage
**Can import:** Shared utilities only
**Cannot import:** UI, Application, Domain

```typescript
// ✅ Good infrastructure adapter
import { DatabaseClient } from '@/shared/infrastructure/db';

export class PatientRepository {
  async save(patient: Patient): Promise<Patient> {
    const data = patient.toPlainObject();
    const result = await DatabaseClient.insert('patients', data);
    return Patient.fromPlainObject(result);
  }

  async findById(id: string): Promise<Patient | null> {
    const result = await DatabaseClient.findOne('patients', { id });
    return result ? Patient.fromPlainObject(result) : null;
  }
}
```

---

## 🔧 Quick Fix Strategies

### **Strategy 1: Layer Bypass**
**Problem:** UI trying to access Infrastructure directly
**Solution:** Create an Application layer service

```typescript
// Create: src/modules/patients/application/patient-service.ts
export async function getPatients(): Promise<Patient[]> {
  return PatientRepository.findAll(); // Infrastructure call
}

// Use in UI: src/modules/patients/ui/PatientList.tsx
import { getPatients } from '../application/patient-service';
```

### **Strategy 2: Cross-Module Access**
**Problem:** One module trying to import from another module's internals
**Solution:** Use public module APIs

```typescript
// Create: src/modules/patients/index.ts
export { getPatient, createPatient } from './application';
export type { Patient, PatientData } from './domain';

// Use from other modules:
import { getPatient } from '@/modules/patients';
```

### **Strategy 3: Domain Contamination**
**Problem:** Domain layer importing UI frameworks
**Solution:** Move framework code to Application/UI layers

```typescript
// ❌ Before (in domain)
import { useCallback } from 'react';

// ✅ After (move to UI)
// Domain stays pure, UI handles React hooks
```

---

## 🚀 Development Workflow

### 1. **Before Writing Code**
- Check which layer you're in: `ui/`, `application/`, `domain/`, `infrastructure/`
- Review allowed imports for that layer
- Plan your dependencies carefully

### 2. **When You Get Lint Errors**
- Read the error message carefully
- Identify which boundary you're crossing
- Use the quick fix strategies above
- Don't disable ESLint rules without strong justification

### 3. **For Complex Violations**
- Discuss with team lead
- Consider if architecture needs adjustment
- Document exceptions with ADRs in `docs/soc/exceptions/`

### 4. **Testing Your Changes**
- Run `npm run lint` frequently
- Fix violations immediately (don't accumulate)
- Use `npm run typecheck` to catch type issues

---

## 📞 Getting Help

### Common Resources
- **Architecture Rules:** `docs/soc/ARCH_RULES.md`
- **Wrapper Documentation:** `src/shared/wrappers/README.md`
- **Type Contracts:** `src/shared/wrappers/index.ts`

### Escalation Path
1. **Self-service:** Use this guide and quick fixes
2. **Team Discussion:** Ask in dev chat for clarification
3. **Architecture Review:** For persistent violations or design questions
4. **Exception Request:** Document in ADR if rule needs permanent exception

---

**Remember:** These guardrails exist to protect patient data, ensure HIPAA compliance, and maintain system security. When in doubt, follow the principle of least privilege and keep layers separated! 🔒