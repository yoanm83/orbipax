# Step 3 Domain Schemas - Consolidation Audit Report

**OrbiPax Community Mental Health System**
**Date**: 2025-09-29
**Author**: Claude Code (Sonnet 4.5)
**Task**: Audit Step 3 domain schemas and plan canonical consolidation + folder rename

---

## Executive Summary

**Status**: ⚠️ **CRITICAL ISSUES FOUND** - Duplicate schemas with incompatible structures

### Key Findings

| Finding | Severity | Impact |
|---------|----------|--------|
| **Duplicate Step 3 schemas** | 🔴 **CRITICAL** | Two complete Step 3 schemas exist with different structures |
| **Missing enum definitions** | 🔴 **CRITICAL** | Canonical schema imports 8 enums that don't exist |
| **Folder naming inconsistency** | 🟡 WARNING | `step3/` subfolder exists but root-level schemas do not follow pattern |
| **No centralized export** | 🟡 WARNING | `step3/` schemas not exported from main `index.ts` |
| **Orphaned UI import** | 🟢 INFO | Only 1 UI consumer found, easy to refactor |

### Recommended Actions

1. ✅ **KEEP**: Root-level `diagnoses-clinical.schema.ts` as canonical (more complete)
2. ❌ **DEPRECATE**: `step3/` subfolder schemas (less complete, duplicative)
3. ➕ **ADD**: Missing 8 enum definitions to `types/common.ts`
4. 📁 **RENAME**: Create `diagnoses-clinical/` folder following Steps 1 & 2 pattern
5. 🔗 **UPDATE**: 1 UI import to point to new location

---

## Part I: File Inventory

### 1.1 Step 3 Subfolder (`domain/schemas/step3/`)

| File | Lines | Exports | Purpose | Status |
|------|-------|---------|---------|--------|
| **index.ts** | 137 | `step3DiagnosesClinicalSchema`, `validateStep3()`, `sectionValidators`, `defaultStep3Values` | Composite schema aggregator | 🟡 DUPLICATE |
| **diagnoses.schema.ts** | 77 | `diagnosesSchema`, `DiagnosesSchema`, `validateDiagnoses()` | DSM-5 diagnoses validation | 🟡 DUPLICATE |
| **psychiatricEvaluation.schema.ts** | 94 | `psychiatricEvaluationSchema`, `PsychiatricEvaluationSchema`, `validatePsychiatricEvaluation()` | Psych eval validation | 🟡 DUPLICATE |
| **functionalAssessment.schema.ts** | 151 | `functionalAssessmentSchema`, `FunctionalAssessmentSchema`, `FUNCTIONAL_DOMAINS`, `INDEPENDENCE_LEVELS` | WHODAS 2.0 functional assessment | 🟡 DUPLICATE |

**Total**: 4 files, ~459 lines

**Key Characteristics**:
- Comment says "Step 4 Medical Providers" (WRONG - this is Step 3)
- Simpler structure with fewer fields
- Local enum definitions (`FUNCTIONAL_DOMAINS`, `INDEPENDENCE_LEVELS`)
- Validation utilities included
- Default values provided

---

### 1.2 Root-Level Canonical Schemas (`domain/schemas/`)

| File | Lines | Exports | Purpose | Status |
|------|-------|---------|---------|--------|
| **diagnoses-clinical.schema.ts** | 287 | `step3DataSchema`, `diagnosisRecordSchema`, `diagnosesSchema`, `psychiatricEvaluationSchema`, `functionalAssessmentSchema`, `validateStep3()` | Canonical Step 3 schema | ✅ CANONICAL |
| **clinical-history.schema.ts** | 401 | `clinicalHistoryDataSchema`, `diagnosisSchema`, `symptomAssessmentSchema`, `mentalHealthHistorySchema`, etc. | Comprehensive clinical history (appears to be a separate, more detailed step) | ℹ️ DIFFERENT SCOPE |

**Key Characteristics (diagnoses-clinical.schema.ts)**:
- Imports from `types/common` (follows architecture pattern)
- More fields: `diagnosisRecords[]`, `currentSymptoms[]`, `severityLevel`, etc.
- Uses `z.nativeEnum()` for type safety
- Includes refined schemas with conditional validation
- Helper function `createEmptyStep3Data()`

---

### 1.3 Steps 1 & 2 for Comparison

**Step 1: Demographics**
- **Folder**: `domain/schemas/demographics/`
- **Main File**: `demographics.schema.ts` (exports `demographicsSchema`)
- **Pattern**: Nested folder with descriptive name

**Step 2: Insurance & Eligibility**
- **Folder**: `domain/schemas/insurance-eligibility/`
- **Main Files**: `insurance-eligibility.schema.ts` + `index.ts`
- **Pattern**: Nested folder with descriptive name

**Observation**: Steps 1 & 2 use **descriptive folder names**, not `step1/` or `step2/`

---

## Part II: Duplicate Analysis

### 2.1 Diagnoses Schema Comparison

| Field/Feature | `step3/diagnoses.schema.ts` | `diagnoses-clinical.schema.ts` |
|--------------|----------------------------|-------------------------------|
| **primaryDiagnosis** | ✅ `z.string().min(1).max(255)` | ✅ `z.string().optional()` (less strict) |
| **secondaryDiagnoses** | ✅ `z.array(z.string()).optional()` | ✅ `z.array(z.string()).default([])` |
| **substanceUseDisorder** | ✅ `z.string().min(1)` | ✅ `z.enum(['yes', 'no', 'unknown'])` (more structured) |
| **mentalHealthHistory** | ✅ `z.string().max(2000).optional()` | ✅ `z.string().max(1000).optional()` (shorter limit) |
| **diagnosisRecords** | ❌ NOT PRESENT | ✅ `z.array(diagnosisRecordSchema)` (ICD-10 codes, severity, dates) |

**Winner**: `diagnoses-clinical.schema.ts` - More complete with structured diagnosis records

---

### 2.2 Psychiatric Evaluation Schema Comparison

| Field/Feature | `step3/psychiatricEvaluation.schema.ts` | `diagnoses-clinical.schema.ts` |
|--------------|----------------------------------------|-------------------------------|
| **hasEvaluation** | ✅ `z.enum(['Yes', 'No'])` | ✅ `hasPsychEval: z.boolean()` (better naming) |
| **evaluationDate** | ✅ `z.date().optional()` | ✅ `z.string().optional()` (ISO string for JSON) |
| **clinicianName** | ✅ `z.string().max(120)` with validation | ✅ `evaluatedBy: z.string().optional()` (simpler) |
| **evaluationSummary** | ✅ `z.string().max(300)` | ✅ `z.string().max(2000)` (longer limit) |
| **currentSymptoms** | ❌ NOT PRESENT | ✅ `z.array(z.string()).default([])` |
| **severityLevel** | ❌ NOT PRESENT | ✅ `z.nativeEnum(SeverityLevel)` |
| **suicidalIdeation** | ❌ NOT PRESENT | ✅ `z.boolean().optional()` |
| **homicidalIdeation** | ❌ NOT PRESENT | ✅ `z.boolean().optional()` |
| **psychoticSymptoms** | ❌ NOT PRESENT | ✅ `z.boolean().optional()` |
| **medicationCompliance** | ❌ NOT PRESENT | ✅ `z.nativeEnum(MedicationCompliance)` |
| **treatmentHistory** | ❌ NOT PRESENT | ✅ `z.string().max(1000)` |
| **Conditional validation** | ✅ If 'Yes', requires date/clinician | ✅ If `hasPsychEval`, requires date/evaluatedBy |

**Winner**: `diagnoses-clinical.schema.ts` - Significantly more complete clinical assessment

---

### 2.3 Functional Assessment Schema Comparison

| Field/Feature | `step3/functionalAssessment.schema.ts` | `diagnoses-clinical.schema.ts` |
|--------------|---------------------------------------|-------------------------------|
| **affectedDomains** | ✅ `z.array(z.enum(FUNCTIONAL_DOMAINS)).min(1)` | ✅ `z.array(z.nativeEnum(WHODASDomain)).min(1)` |
| **Domain values** | 6 hardcoded strings (cognition, mobility, etc.) | Enum `WHODASDomain` (NOT DEFINED - ❌ BROKEN) |
| **adlsIndependence** | ✅ `z.enum(INDEPENDENCE_LEVELS)` | ✅ `z.nativeEnum(IndependenceLevel)` (NOT DEFINED - ❌ BROKEN) |
| **iadlsIndependence** | ✅ `z.enum(INDEPENDENCE_LEVELS)` | ✅ `z.nativeEnum(IndependenceLevel)` (NOT DEFINED - ❌ BROKEN) |
| **cognitiveFunctioning** | ✅ `z.enum(COGNITIVE_FUNCTIONING_LEVELS)` | ✅ `z.nativeEnum(CognitiveFunctioning)` (NOT DEFINED - ❌ BROKEN) |
| **safetyConcerns** | ✅ `z.boolean()` | ✅ `hasSafetyConcerns: z.boolean()` (better naming) |
| **additionalNotes** | ✅ `z.string().max(300)` | ✅ `z.string().max(1000)` (longer limit) |
| **globalFunctioning** | ❌ NOT PRESENT | ✅ `z.number().min(0).max(100)` (GAF score) |
| **dailyLivingActivities** | ❌ NOT PRESENT | ✅ `z.array(z.string()).default([])` |
| **socialFunctioning** | ❌ NOT PRESENT | ✅ `z.nativeEnum(SocialFunctioning)` (NOT DEFINED - ❌ BROKEN) |
| **occupationalFunctioning** | ❌ NOT PRESENT | ✅ `z.nativeEnum(OccupationalFunctioning)` (NOT DEFINED - ❌ BROKEN) |
| **cognitiveStatus** | ❌ NOT PRESENT | ✅ `z.nativeEnum(CognitiveStatus)` (NOT DEFINED - ❌ BROKEN) |
| **adaptiveBehavior** | ❌ NOT PRESENT | ✅ `z.string().max(500)` |
| **Helper functions** | ✅ `getDomainLabel()` for UI | ❌ NOT PRESENT |

**Winner**: `diagnoses-clinical.schema.ts` has more fields, BUT **CRITICAL BUG** - imports 8 enums that don't exist!

---

### 2.4 Missing Enum Definitions (CRITICAL)

`diagnoses-clinical.schema.ts` imports these enums from `../types/common`, but they **DO NOT EXIST**:

| Enum | Referenced At | Status |
|------|--------------|--------|
| `DiagnosisType` | Line 16 | ❌ NOT FOUND in `types/common.ts` |
| `MedicationCompliance` | Line 18 | ❌ NOT FOUND |
| `CognitiveFunctioning` | Line 18 | ❌ NOT FOUND |
| `IndependenceLevel` | Line 19 | ❌ NOT FOUND |
| `SocialFunctioning` | Line 20 | ❌ NOT FOUND |
| `OccupationalFunctioning` | Line 21 | ❌ NOT FOUND |
| `CognitiveStatus` | Line 22 | ❌ NOT FOUND |
| `WHODASDomain` | Line 23 | ❌ NOT FOUND |

**Existing Enums in `types/common.ts`** (30 total):
- GenderIdentity, Race, Ethnicity, MaritalStatus, Language, etc.
- DiagnosisCategory (NOT DiagnosisType), SeverityLevel, ProviderType
- InsuranceType, InsurancePlanKind, ConsentType, BooleanResponse
- IntakeStep, StepStatus, IntakeStatus

**Conclusion**: `diagnoses-clinical.schema.ts` was written with planned enums that were never added to `types/common.ts`

---

## Part III: Proposed Canonical Schema Structure

### 3.1 Recommended Action: Merge + Fix

**Strategy**:
1. **Keep**: `diagnoses-clinical.schema.ts` as base (more complete)
2. **Merge In**: Best features from `step3/` schemas (conditional validation, helper functions)
3. **Fix**: Add missing 8 enums to `types/common.ts`
4. **Deprecate**: `step3/` subfolder entirely

---

### 3.2 Missing Enums to Add to `types/common.ts`

**Location**: After line 157 (after `SeverityLevel`)

```typescript
/**
 * Diagnosis type classification (DSM-5)
 */
export enum DiagnosisType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  RULE_OUT = 'rule-out',
  PROVISIONAL = 'provisional'
}

/**
 * Medication compliance levels
 */
export enum MedicationCompliance {
  FULL = 'full',
  PARTIAL = 'partial',
  NON_COMPLIANT = 'non-compliant',
  NOT_PRESCRIBED = 'not-prescribed',
  UNKNOWN = 'unknown'
}

/**
 * Cognitive functioning levels (clinical assessment)
 */
export enum CognitiveFunctioning {
  NORMAL = 'normal',
  MILD_IMPAIRMENT = 'mild-impairment',
  MODERATE_IMPAIRMENT = 'moderate-impairment',
  SEVERE_IMPAIRMENT = 'severe-impairment',
  UNKNOWN = 'unknown'
}

/**
 * Independence levels for ADL/IADL assessment
 */
export enum IndependenceLevel {
  INDEPENDENT = 'independent',
  MINIMAL_ASSISTANCE = 'minimal-assistance',
  MODERATE_ASSISTANCE = 'moderate-assistance',
  MAXIMUM_ASSISTANCE = 'maximum-assistance',
  DEPENDENT = 'dependent',
  UNKNOWN = 'unknown'
}

/**
 * Social functioning levels
 */
export enum SocialFunctioning {
  EXCELLENT = 'excellent',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor',
  VERY_POOR = 'very-poor',
  UNKNOWN = 'unknown'
}

/**
 * Occupational functioning levels
 */
export enum OccupationalFunctioning {
  FULL_TIME = 'full-time',
  PART_TIME = 'part-time',
  UNABLE_TO_WORK = 'unable-to-work',
  NOT_APPLICABLE = 'not-applicable',
  UNKNOWN = 'unknown'
}

/**
 * Cognitive status assessment
 */
export enum CognitiveStatus {
  ALERT_ORIENTED = 'alert-oriented',
  MILD_CONFUSION = 'mild-confusion',
  MODERATE_CONFUSION = 'moderate-confusion',
  SEVERE_CONFUSION = 'severe-confusion',
  UNKNOWN = 'unknown'
}

/**
 * WHODAS 2.0 functional domains
 */
export enum WHODASDomain {
  COGNITION = 'cognition',
  MOBILITY = 'mobility',
  SELF_CARE = 'self-care',
  GETTING_ALONG = 'getting-along',
  LIFE_ACTIVITIES = 'life-activities',
  PARTICIPATION = 'participation'
}
```

**Why These Values**:
- Aligned with DSM-5 and WHO standards (WHODAS 2.0)
- Consistent with existing enum naming conventions (uppercase keys, kebab-case values)
- Includes `UNKNOWN` for all assessment enums (allows incomplete data)

---

### 3.3 Canonical Schema Structure (Post-Consolidation)

**Folder**: `domain/schemas/diagnoses-clinical/` (NEW - following Steps 1 & 2 pattern)

**Files**:

1. **`diagnoses-clinical.schema.ts`** (Main schema - 287 lines + enhancements)
   - Exports: `step3DataSchema`, `diagnosisRecordSchema`, `diagnosesSchema`, `psychiatricEvaluationSchema`, `functionalAssessmentSchema`
   - Types: `Step3Data`, `Step3DataPartial`, `DiagnosisRecord`, etc.
   - Validators: `validateStep3()`, `validateStep3Partial()`
   - Helpers: `createEmptyStep3Data()`
   - **Enhancement**: Add `getDomainLabel()` helper from `step3/functionalAssessment.schema.ts`

2. **`index.ts`** (Barrel export)
   ```typescript
   export * from './diagnoses-clinical.schema'
   ```

**Schema Contracts** (Export Names - NO CHANGES):
- `step3DataSchema` - Main composite schema
- `diagnosesSchema` - Diagnoses section
- `psychiatricEvaluationSchema` - Psych eval section (refined with conditionals)
- `functionalAssessmentSchema` - Functional assessment section
- `validateStep3()` - Full validation function
- `validateStep3Partial()` - Draft validation function

**NO Contract Changes**: Existing consumers (Actions, Application) will continue to work

---

## Part IV: Folder Rename Plan

### 4.1 Current State

```
domain/schemas/
├── index.ts (exports diagnoses-clinical.schema)
├── diagnoses-clinical.schema.ts ← ROOT LEVEL (non-standard)
├── clinical-history.schema.ts ← ROOT LEVEL (different scope)
├── demographics/
│   └── demographics.schema.ts ← NESTED (Step 1 pattern)
├── insurance-eligibility/
│   ├── index.ts
│   └── insurance-eligibility.schema.ts ← NESTED (Step 2 pattern)
└── step3/ ← SUBFOLDER (inconsistent naming)
    ├── index.ts
    ├── diagnoses.schema.ts
    ├── psychiatricEvaluation.schema.ts
    └── functionalAssessment.schema.ts
```

**Issues**:
- Steps 1 & 2 use descriptive folder names (demographics/, insurance-eligibility/)
- Step 3 canonical schema is at root level (non-standard)
- `step3/` subfolder exists but uses generic "step3" name (not descriptive)

---

### 4.2 Target State

```
domain/schemas/
├── index.ts (exports diagnoses-clinical/)
├── diagnoses-clinical/ ← NEW FOLDER (aligned with Steps 1 & 2)
│   ├── index.ts (barrel export)
│   └── diagnoses-clinical.schema.ts (moved from root)
├── demographics/
│   └── demographics.schema.ts (Step 1 - unchanged)
├── insurance-eligibility/
│   ├── index.ts
│   └── insurance-eligibility.schema.ts (Step 2 - unchanged)
└── clinical-history.schema.ts (stays at root - different scope)
```

**Deleted**:
- ❌ `step3/` subfolder entirely (4 files deprecated)

---

### 4.3 Rename Actions (Detailed)

#### Action 1: Create new folder
```bash
mkdir src/modules/intake/domain/schemas/diagnoses-clinical
```

#### Action 2: Move canonical schema
```bash
# FROM
src/modules/intake/domain/schemas/diagnoses-clinical.schema.ts

# TO
src/modules/intake/domain/schemas/diagnoses-clinical/diagnoses-clinical.schema.ts
```

#### Action 3: Create barrel export
**File**: `src/modules/intake/domain/schemas/diagnoses-clinical/index.ts`
```typescript
/**
 * Diagnoses & Clinical Evaluation Schemas
 * OrbiPax Community Mental Health System
 *
 * Step 3: Clinical Assessment
 */

export * from './diagnoses-clinical.schema'
```

#### Action 4: Update main schemas index
**File**: `src/modules/intake/domain/schemas/index.ts`
```diff
  // Demographics - Canonical nested location
  export * from './demographics/demographics.schema'

+ // Diagnoses & Clinical - Step 3
+ export * from './diagnoses-clinical'

- // Other schemas remain as-is for now
- export * from './insurance.schema'
- export * from './diagnoses-clinical.schema'
```

#### Action 5: Delete deprecated step3 folder
```bash
rm -rf src/modules/intake/domain/schemas/step3
```

---

### 4.4 Import Updates Required

#### Consumer 1: UI Component

**File**: `src/modules/intake/ui/step3-diagnoses-clinical/Step3DiagnosesClinical.tsx`

**Current Import**:
```typescript
import {
  step3DiagnosesClinicalSchema,
  validateStep3
} from '@/modules/intake/domain/schemas/step3'
```

**New Import** (Option A - Direct):
```typescript
import {
  step3DataSchema as step3DiagnosesClinicalSchema,
  validateStep3
} from '@/modules/intake/domain/schemas/diagnoses-clinical'
```

**New Import** (Option B - Main index):
```typescript
import {
  step3DataSchema as step3DiagnosesClinicalSchema,
  validateStep3
} from '@/modules/intake/domain/schemas'
```

**Note**: `step3DiagnosesClinicalSchema` from old `step3/index.ts` is named `step3DataSchema` in canonical schema. Use import alias `as step3DiagnosesClinicalSchema` to preserve UI code compatibility.

---

#### Consumer 2: Actions Layer (If Exists)

**Search Pattern**:
```bash
grep -r "from.*schemas/step3" src/modules/intake/actions --include="*.ts"
```

**Expected**: No results (step3 schemas not consumed by actions yet)

---

#### Consumer 3: Application Layer (If Exists)

**Search Pattern**:
```bash
grep -r "from.*schemas/step3" src/modules/intake/application --include="*.ts"
```

**Expected**: No results (step3 schemas not consumed by application yet)

---

### 4.5 Import Update Summary Table

| File | Current Import | New Import | Status |
|------|---------------|-----------|--------|
| `ui/step3-diagnoses-clinical/Step3DiagnosesClinical.tsx` | `from '@/modules/intake/domain/schemas/step3'` | `from '@/modules/intake/domain/schemas/diagnoses-clinical'` | ⚠️ REQUIRED |
| Actions layer | N/A | N/A | ✅ NONE FOUND |
| Application layer | N/A | N/A | ✅ NONE FOUND |

**Total Imports to Update**: 1 file

---

## Part V: Consolidation Plan (Step-by-Step)

### Phase 1: Add Missing Enums (CRITICAL)

**File**: `src/modules/intake/domain/types/common.ts`

**Action**: Add 8 new enums after `SeverityLevel` (line 157)

**Enums**: DiagnosisType, MedicationCompliance, CognitiveFunctioning, IndependenceLevel, SocialFunctioning, OccupationalFunctioning, CognitiveStatus, WHODASDomain

**Validation**:
```bash
npx tsc --noEmit  # Should compile without errors
```

---

### Phase 2: Enhance Canonical Schema (Optional)

**File**: `domain/schemas/diagnoses-clinical.schema.ts`

**Action**: Add `getDomainLabel()` helper from `step3/functionalAssessment.schema.ts` (lines 125-135)

**Why**: Provides UI-friendly labels for WHODAS domains

**Code to Add** (after line 242):
```typescript
/**
 * Helper to get readable domain labels for UI
 */
export function getWHODASDomainLabel(domain: WHODASDomain): string {
  const labels: Record<WHODASDomain, string> = {
    [WHODASDomain.COGNITION]: 'Cognition (Understanding & Communication)',
    [WHODASDomain.MOBILITY]: 'Mobility (Moving & Getting Around)',
    [WHODASDomain.SELF_CARE]: 'Self-Care (Hygiene, Dressing, Eating)',
    [WHODASDomain.GETTING_ALONG]: 'Getting Along (Interacting with People)',
    [WHODASDomain.LIFE_ACTIVITIES]: 'Life Activities (Domestic & Work/School)',
    [WHODASDomain.PARTICIPATION]: 'Participation (Community & Social)'
  }
  return labels[domain]
}
```

---

### Phase 3: Create Nested Folder Structure

**Actions**:
1. Create `domain/schemas/diagnoses-clinical/` folder
2. Move `diagnoses-clinical.schema.ts` into folder
3. Create `index.ts` barrel export
4. Update main `schemas/index.ts` export

**Validation**:
```bash
# Imports should still resolve
npx tsc --noEmit
```

---

### Phase 4: Update UI Import

**File**: `ui/step3-diagnoses-clinical/Step3DiagnosesClinical.tsx`

**Action**: Change import from `schemas/step3` to `schemas/diagnoses-clinical`

**Validation**:
```bash
# UI should compile
npx tsc --noEmit
npm run build
```

---

### Phase 5: Delete Deprecated Folder

**Action**: Remove `domain/schemas/step3/` entirely

**Validation**:
```bash
# No broken imports
npx tsc --noEmit
grep -r "schemas/step3" src/modules/intake --include="*.ts" --include="*.tsx"
# Should return 0 results
```

---

### Phase 6: Update Documentation

**Files to Update**:
- `README.md` (if exists) with new folder structure
- Architecture diagrams showing Step 3 location

---

## Part VI: Risk Analysis

### 6.1 High Risk Items

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Missing enums break build** | 🔴 HIGH | 🔴 CRITICAL | Add enums FIRST before any other changes |
| **Forgotten imports** | 🟡 MEDIUM | 🟡 HIGH | Use grep to find all imports before delete |
| **Type changes break UI** | 🟢 LOW | 🟡 MEDIUM | Use import alias to preserve names |

---

### 6.2 Rollback Plan

**If Phase 1 Breaks Build**:
```bash
git checkout HEAD -- src/modules/intake/domain/types/common.ts
```

**If Phase 3-5 Break Build**:
```bash
# Restore original structure
git checkout HEAD -- src/modules/intake/domain/schemas/
```

**If Phase 4 Breaks UI**:
```bash
# Revert UI import
git checkout HEAD -- src/modules/intake/ui/step3-diagnoses-clinical/Step3DiagnosesClinical.tsx
```

---

## Part VII: Validation Checklist

### Pre-Implementation

- [ ] Audit complete - all duplicates identified
- [ ] Enum definitions prepared
- [ ] Folder rename plan documented
- [ ] Import update list created
- [ ] Backup created (`git stash` or commit current work)

### Post-Phase 1 (Add Enums)

- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] ESLint passes: `npx eslint src/modules/intake/domain/types/common.ts`
- [ ] No breaking changes in other schemas

### Post-Phase 3 (Folder Rename)

- [ ] Canonical schema moved to new folder
- [ ] Barrel export created
- [ ] Main index.ts updated
- [ ] TypeScript compiles: `npx tsc --noEmit`

### Post-Phase 4 (UI Update)

- [ ] UI import updated
- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] Build succeeds: `npm run build`
- [ ] No console warnings about missing modules

### Post-Phase 5 (Delete step3/)

- [ ] `step3/` folder deleted
- [ ] No references to `step3/` exist: `grep -r "schemas/step3"`
- [ ] TypeScript compiles: `npx tsc --noEmit`
- [ ] Build succeeds: `npm run build`

---

## Part VIII: Appendix

### A. Full File Paths

**Current (Before Rename)**:
```
D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\diagnoses-clinical.schema.ts
D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\step3\index.ts
D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\step3\diagnoses.schema.ts
D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\step3\psychiatricEvaluation.schema.ts
D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\step3\functionalAssessment.schema.ts
D:\ORBIPAX-PROJECT\src\modules\intake\ui\step3-diagnoses-clinical\Step3DiagnosesClinical.tsx
```

**Target (After Rename)**:
```
D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\diagnoses-clinical\index.ts (NEW)
D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\diagnoses-clinical\diagnoses-clinical.schema.ts (MOVED)
D:\ORBIPAX-PROJECT\src\modules\intake\ui\step3-diagnoses-clinical\Step3DiagnosesClinical.tsx (IMPORT UPDATED)
```

---

### B. Export Name Mapping

| Old Name (step3/index.ts) | Canonical Name (diagnoses-clinical.schema.ts) | Action |
|---------------------------|----------------------------------------------|--------|
| `step3DiagnosesClinicalSchema` | `step3DataSchema` | Use import alias in UI |
| `diagnosesSchema` | `diagnosesSchema` | ✅ SAME |
| `psychiatricEvaluationSchema` | `psychiatricEvaluationRefinedSchema` | Use canonical (has refinement) |
| `functionalAssessmentSchema` | `functionalAssessmentSchema` | ✅ SAME |
| `validateStep3()` | `validateStep3()` | ✅ SAME |
| `sectionValidators` | N/A | Use individual validators if needed |
| `defaultStep3Values` | Use `createEmptyStep3Data()` | Use canonical helper |

---

### C. Canonical Enum Values (For Reference)

**WHODASDomain**:
- cognition, mobility, self-care, getting-along, life-activities, participation

**IndependenceLevel**:
- independent, minimal-assistance, moderate-assistance, maximum-assistance, dependent, unknown

**CognitiveFunctioning**:
- normal, mild-impairment, moderate-impairment, severe-impairment, unknown

**MedicationCompliance**:
- full, partial, non-compliant, not-prescribed, unknown

**DiagnosisType**:
- primary, secondary, rule-out, provisional

**SocialFunctioning**:
- excellent, good, fair, poor, very-poor, unknown

**OccupationalFunctioning**:
- full-time, part-time, unable-to-work, not-applicable, unknown

**CognitiveStatus**:
- alert-oriented, mild-confusion, moderate-confusion, severe-confusion, unknown

---

## Summary

### Actions Required (In Order)

1. ✅ **ADD** 8 missing enums to `types/common.ts`
2. ✅ **CREATE** `diagnoses-clinical/` folder
3. ✅ **MOVE** canonical schema into new folder
4. ✅ **CREATE** barrel export `index.ts`
5. ✅ **UPDATE** main `schemas/index.ts`
6. ✅ **UPDATE** 1 UI import
7. ✅ **DELETE** `step3/` subfolder
8. ✅ **VALIDATE** typecheck + build

### Files Touched (Summary)

| File | Action |
|------|--------|
| `domain/types/common.ts` | Add 8 enums (~80 lines) |
| `domain/schemas/diagnoses-clinical/` | Create folder |
| `domain/schemas/diagnoses-clinical/diagnoses-clinical.schema.ts` | Move from root |
| `domain/schemas/diagnoses-clinical/index.ts` | Create barrel |
| `domain/schemas/index.ts` | Update export |
| `ui/step3-diagnoses-clinical/Step3DiagnosesClinical.tsx` | Update import |
| `domain/schemas/step3/` | Delete folder (4 files) |

**Total**: 7 files/folders modified, 4 files deleted

---

**Generated**: 2025-09-29
**By**: Claude Code (Sonnet 4.5)
**Status**: ✅ AUDIT COMPLETE - Ready for implementation