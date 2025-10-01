# Step 3 Discovery & Scope Audit Report
## Diagnoses & Clinical Evaluation Module

**Date**: 2025-09-28
**Module**: `src/modules/intake/step3-diagnoses-clinical`
**Type**: AUDIT-ONLY (Read-only discovery)
**Status**: 🔴 CRITICAL - Missing Core Infrastructure

---

## Executive Summary

Step 3 UI exists but lacks entire backend infrastructure:
- ❌ **No Domain Schema**: `validateStep3` imported but doesn't exist
- ❌ **No State Stores**: 3 stores imported but not implemented
- ❌ **No Actions Layer**: `generateDiagnosisSuggestions` imported but missing
- ❌ **No Application Layer**: Enums imported from non-existent files
- ⚠️ **UI Antipatterns**: Multiple useState, no proper error handling
- 🔴 **Architecture Violation**: UI directly building complex payloads

---

## 1. UI INVENTORY

### Directory Structure
```
src/modules/intake/ui/step3-diagnoses-clinical/
├── index.ts
├── Step3DiagnosesClinical.tsx (237 lines)
└── components/
    ├── DiagnosesSection.tsx
    ├── PsychiatricEvaluationSection.tsx
    └── FunctionalAssessmentSection.tsx
```

### Component Hierarchy
```
Step3DiagnosesClinical (Container)
├── DiagnosesSection
│   └── Diagnosis Records (dynamic)
│   └── AI Suggestions (OpenAI integration)
├── PsychiatricEvaluationSection
│   └── Conditional fields based on hasPsychEval
└── FunctionalAssessmentSection
    └── Multi-select domains (WHODAS 2.0)
```

### Event Handlers Detected

| Component | Handler | Line | Purpose |
|-----------|---------|------|---------|
| Step3DiagnosesClinical | `handleSubmit` | 108 | Validate & submit all sections |
| Step3DiagnosesClinical | `buildPayload` | 55 | Aggregate data from stores |
| DiagnosesSection | `handleGenerateSuggestions` | 68 | AI diagnosis suggestions |
| DiagnosesSection | `handleAddRecord` | N/A | Add diagnosis record |
| PsychiatricEvaluation | `handleHasPsychEvalChange` | 54 | Toggle conditional fields |
| FunctionalAssessment | `validateFields` | 79 | Local validation |

---

## 2. FIELDS EXTRACTED FROM UI

### Diagnoses Section Fields

| Field | Type | UI Component | Required | Notes |
|-------|------|--------------|----------|-------|
| primaryDiagnosis | string | Input | No | DSM-5 code |
| secondaryDiagnoses | string[] | Array of Input | No | Multiple diagnoses |
| substanceUseDisorder | string | Select | No | Yes/No/Unknown |
| mentalHealthHistory | string | Textarea | No | Free text |
| **Per Record:** | | | | |
| code | string | Input | Yes | ICD/DSM code |
| description | string | Input | Yes | Diagnosis name |
| diagnosisType | string | Select | Yes | Primary/Secondary |
| onsetDate | Date | DatePicker | No | Date of onset |
| diagnosisDate | Date | DatePicker | Yes | When diagnosed |
| severity | string | Select | Yes | Mild/Moderate/Severe |
| verifiedBy | string | Input | No | Clinician name |
| isBillable | boolean | Switch | No | Insurance billing |
| notes | string | Textarea | No | Additional notes |

### Psychiatric Evaluation Fields

| Field | Type | UI Component | Required | Notes |
|-------|------|--------------|----------|-------|
| currentSymptoms | string[] | Array | No | Symptom list |
| severityLevel | string | Select | No | Overall severity |
| suicidalIdeation | boolean | Select | No | Yes/No |
| homicidalIdeation | boolean | Select | No | Yes/No |
| psychoticSymptoms | boolean | Select | No | Yes/No |
| medicationCompliance | string | Select | No | Good/Fair/Poor |
| treatmentHistory | string | Textarea | No | Previous treatments |
| hasPsychEval | string | Select | No | Yes/No trigger |
| evaluationDate | Date | DatePicker | Conditional | If hasPsychEval=Yes |
| evaluatedBy | string | Input | Conditional | Evaluator name |
| evaluationSummary | string | Textarea | No | Summary text |

### Functional Assessment Fields

| Field | Type | UI Component | Required | Notes |
|-------|------|--------------|----------|-------|
| globalFunctioning | number | Input | No | GAF score |
| dailyLivingActivities | string[] | MultiSelect | No | ADLs |
| socialFunctioning | string | Select | No | Level |
| occupationalFunctioning | string | Select | No | Level |
| cognitiveStatus | string | Select | No | Intact/Impaired |
| adaptiveBehavior | string | Textarea | No | Description |
| affectedDomains | string[] | MultiSelect | Yes | WHODAS domains |
| adlsIndependence | string | Select | Yes | Yes/No/Partial |
| iadlsIndependence | string | Select | Yes | Yes/No/Partial |
| cognitiveFunctioning | string | Select | Yes | Impairment level |
| hasSafetyConcerns | boolean | Switch | No | Safety flag |
| additionalNotes | string | Textarea | No | Extra notes |

---

## 3. ANTIPATTERNS & VIOLATIONS DETECTED

### 🔴 CRITICAL VIOLATIONS

| Violation | Location | Line | Impact |
|-----------|----------|------|--------|
| **Missing Domain Schema** | Step3DiagnosesClinical.tsx | 5 | Import fails - no validation |
| **Missing State Stores** | Step3DiagnosesClinical.tsx | 6-10 | Stores don't exist |
| **Missing Actions** | DiagnosesSection.tsx | 21 | Server action undefined |
| **Missing Application** | DiagnosesSection.tsx | 22 | Enums don't exist |
| **Payload Building in UI** | Step3DiagnosesClinical.tsx | 55-102 | Business logic in UI layer |

### ⚠️ MODERATE ISSUES

| Issue | Location | Line | Problem |
|-------|----------|------|---------|
| Multiple useState | DiagnosesSection.tsx | 57-61 | Should use store |
| Local validation | FunctionalAssessment.tsx | 79-80 | Validation in UI |
| Inline error handling | All components | Various | No centralized errors |
| No PHI protection | Step3DiagnosesClinical.tsx | 55-83 | Sensitive data in UI |

### ✅ GOOD PRACTICES FOUND

- No console.log statements
- Semantic Tailwind tokens used
- Accessibility attributes present (role, aria-expanded)
- TypeScript interfaces defined

---

## 4. DEPENDENCIES & IMPORTS ANALYSIS

### Missing Dependencies
```typescript
// These imports fail - files don't exist:
import { validateStep3 } from "@/modules/intake/domain/schemas/step3" // ❌
import {
  useDiagnosesUIStore,
  usePsychiatricEvaluationUIStore,
  useFunctionalAssessmentUIStore
} from "@/modules/intake/state/slices/step3" // ❌
import { generateDiagnosisSuggestions } from "@/modules/intake/actions/diagnoses.actions" // ❌
import { DIAGNOSIS_TYPE_OPTIONS, DIAGNOSIS_SEVERITY_OPTIONS } from "@/modules/intake/application/step3/diagnoses.enums" // ❌
```

### Existing Dependencies
```typescript
// These work:
import { Button } from "@/shared/ui/primitives/Button" // ✅
import { Card, CardBody } from "@/shared/ui/primitives/Card" // ✅
import { DatePicker } from "@/shared/ui/primitives/DatePicker" // ✅
```

---

## 5. PROPOSED MINIMAL CONTRACT SCOPE

### Domain Layer (Step 3)
```typescript
// domain/schemas/step3.schema.ts
export const diagnosisRecordSchema = z.object({
  code: z.string().min(1),
  description: z.string().min(1),
  diagnosisType: z.enum(['primary', 'secondary', 'provisional']),
  severity: z.enum(['mild', 'moderate', 'severe']),
  onsetDate: z.string().optional(),
  diagnosisDate: z.string(),
  verifiedBy: z.string().optional(),
  isBillable: z.boolean().default(false),
  notes: z.string().optional()
})

export const psychiatricEvaluationSchema = z.object({
  hasPsychEval: z.boolean(),
  evaluationDate: z.string().optional(),
  evaluatedBy: z.string().optional(),
  evaluationSummary: z.string().optional(),
  suicidalIdeation: z.boolean().optional(),
  homicidalIdeation: z.boolean().optional(),
  psychoticSymptoms: z.boolean().optional(),
  medicationCompliance: z.enum(['good', 'fair', 'poor']).optional()
})

export const functionalAssessmentSchema = z.object({
  affectedDomains: z.array(z.string()).min(1),
  adlsIndependence: z.enum(['yes', 'no', 'partial']),
  iadlsIndependence: z.enum(['yes', 'no', 'partial']),
  cognitiveFunctioning: z.enum(['intact', 'mild', 'moderate', 'severe']),
  hasSafetyConcerns: z.boolean(),
  globalFunctioning: z.number().min(0).max(100).optional()
})

export const step3DataSchema = z.object({
  diagnoses: z.array(diagnosisRecordSchema),
  psychiatricEvaluation: psychiatricEvaluationSchema,
  functionalAssessment: functionalAssessmentSchema
})
```

### Application Layer (Step 3)
```typescript
// application/step3/dtos.ts
export interface Step3InputDTO {
  diagnoses: DiagnosisRecordDTO[]
  psychiatricEvaluation: PsychiatricEvaluationDTO
  functionalAssessment: FunctionalAssessmentDTO
}

// application/step3/ports.ts
export interface Step3Repository {
  findBySession(sessionId: string, organizationId: string): Promise<RepositoryResponse<Step3OutputDTO>>
  save(sessionId: string, organizationId: string, data: Step3InputDTO): Promise<RepositoryResponse>
}

// application/step3/usecases.ts
export async function loadStep3(repo: Step3Repository, sessionId: string, orgId: string)
export async function saveStep3(repo: Step3Repository, input: Step3InputDTO, sessionId: string, orgId: string)
```

### Actions Layer (Step 3)
```typescript
// actions/step3/clinical.actions.ts
export async function loadClinicalDataAction(): Promise<ActionResponse<Step3OutputDTO>>
export async function saveClinicalDataAction(input: Step3InputDTO): Promise<ActionResponse>

// actions/step3/diagnoses.actions.ts (AI integration)
export async function generateDiagnosisSuggestions(input: { presentingProblem: string })
```

### State Layer (Step 3 UI-only)
```typescript
// state/slices/step3-diagnoses-ui.slice.ts
interface DiagnosesUIState {
  isLoading: boolean
  isSaving: boolean
  loadError: string | null
  saveError: string | null
  validationErrors: Record<string, string>
  expandedSections: Record<string, boolean>
}

// state/slices/step3-psychiatric-ui.slice.ts
// state/slices/step3-functional-ui.slice.ts
```

---

## 6. DUPLICATION ANALYSIS

### Pattern Duplication
- 3 separate UI stores for one step (should be unified)
- Local useState for each section (should use store)
- Validation logic scattered across components

### File Organization Issue
```
❌ Current: step3-diagnoses-clinical/ (mixed concerns)
✅ Proposed: step3-clinical/ (cleaner naming)
```

---

## 7. SECURITY & COMPLIANCE GAPS

### PHI Exposure Risk
- Diagnosis descriptions in UI state
- Patient evaluation summaries in local state
- No error message sanitization

### Multi-tenant Gaps
- No organizationId validation
- No reset functionality for org switch
- Missing RLS preparation

---

## 8. RECOMMENDED IMPLEMENTATION ORDER

1. **Domain Schema** (1 hour)
   - Single unified schema file
   - Zod validation for all fields
   - Partial schemas for drafts

2. **State Stores** (2 hours)
   - 3 UI-only slices (or 1 unified)
   - No PHI in state
   - Reset functions

3. **Application Layer** (2 hours)
   - DTOs and mappers
   - Repository port
   - Use cases with DI

4. **Actions Layer** (1 hour)
   - Load/save with guards
   - Factory pattern
   - Generic error mapping

5. **Infrastructure** (1 hour)
   - Repository implementation
   - RLS enforcement
   - Factory function

6. **UI Refactor** (2 hours)
   - Connect to real stores
   - Remove local useState
   - Fix imports

---

## 9. NEXT MICRO-TASK (APPLY)

### Proposed Task
**"— Domain/Step3: Schema base mínima (diagnoses+psychiatric+functional) — APPLY (UNA sola tarea)"**

Create minimal Domain schema for Step 3 with:
- `diagnosisRecordSchema` (individual diagnosis)
- `psychiatricEvaluationSchema` (eval data)
- `functionalAssessmentSchema` (WHODAS-based)
- `step3DataSchema` (composite)
- `step3DataPartialSchema` (for drafts)
- Export `validateStep3` function

**File**: `src/modules/intake/domain/schemas/step3.schema.ts`

**Rationale**: Domain layer must exist before any other layer can be built. The UI is already trying to import `validateStep3`.

---

## 10. RISK ASSESSMENT

### High Risk
- 🔴 **Broken Build**: UI imports non-existent files
- 🔴 **No Validation**: Data could be saved invalid
- 🔴 **PHI Exposure**: Sensitive data in UI state

### Medium Risk
- 🟡 **Maintainability**: Scattered validation logic
- 🟡 **Testing**: No clear contracts to test
- 🟡 **Performance**: Multiple useState re-renders

### Mitigation
Implement layers in order: Domain → State → Application → Actions → Infrastructure

---

## CONCLUSION

Step 3 UI is **partially implemented** but **critically incomplete**:
- UI components exist and are well-structured
- All backend layers are missing
- Multiple architecture violations need correction

**Immediate Action Required**: Create Domain schema to unblock the UI imports.

---

**Audit Status**: COMPLETE
**Files Audited**: 4 UI components
**Violations Found**: 5 critical, 4 moderate
**Next Step**: Domain schema implementation