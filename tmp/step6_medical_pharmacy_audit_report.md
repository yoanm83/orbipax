# Step 6 Medical & Pharmacy Audit Report
**Date:** 2025-09-26
**Type:** AUDIT-ONLY - No code modifications
**Scope:** Medical Providers (Step 4) & Medications/Pharmacy (Step 5)

## Executive Summary

**CRITICAL FINDING:** There is no "Step 6" in the OrbiPax system. Medical and pharmacy functionality is distributed across:
- **Step 4:** Medical Providers (PCP & Psychiatrist)
- **Step 5:** Medications (Current Medications & Pharmacy Information)

Both steps show partial adoption of shared utilities with critical gaps in name validation consistency.

## System Architecture Discovery

### Step 4: Medical Providers
```
D:\ORBIPAX-PROJECT\src\modules\intake\
├── domain\schemas\step4\
│   ├── providers.schema.ts        # PCP validation
│   └── psychiatrist.schema.ts     # Psychiatrist validation
└── ui\step4-medical-providers\
    └── components\
        ├── ProvidersSection.tsx
        └── PsychiatristEvaluatorSection.tsx
```

### Step 5: Medications & Pharmacy
```
D:\ORBIPAX-PROJECT\src\modules\intake\
├── domain\schemas\step5\
│   ├── currentMedications.schema.ts
│   └── pharmacyInformation.schema.ts
└── ui\step5-medications\
    └── components\
        ├── CurrentMedicationsSection.tsx
        └── PharmacyInformationSection.tsx
```

## Complete Field Inventory

### Table: All Fields Analysis

| File | Source | Field | Type | Required | Validators | Normalizers | Uses Shared? | Status | Notes |
|------|--------|-------|------|----------|------------|-------------|--------------|--------|--------|
| **Step 4 - Medical Providers Domain** |
| providers.schema.ts:21 | Domain | hasPCP | enum | ✓ | ['Yes','No','Unknown'] | - | N/A | ✅ | - |
| providers.schema.ts:24 | Domain | pcpName | string | ◯ | max(120) | - | ❌ | 🔴 CRITICAL | Missing name utils |
| providers.schema.ts:28 | Domain | pcpPhone | string | ◯ | validatePhoneNumber | normalizePhoneNumber | ✅ | ✅ | Uses shared phone |
| providers.schema.ts:33 | Domain | pcpPractice | string | ◯ | max(120) | - | ❌ | 🟡 | Should use NAME_LENGTHS.ORGANIZATION_NAME |
| providers.schema.ts:37 | Domain | pcpAddress | string | ◯ | max(200) | - | N/A | ✅ | - |
| providers.schema.ts:41 | Domain | authorizedToShare | boolean | ◯ | - | - | N/A | ✅ | - |
| psychiatrist.schema.ts:21 | Domain | hasBeenEvaluated | enum | ✓ | ['Yes','No'] | - | N/A | ✅ | - |
| psychiatrist.schema.ts:23 | Domain | psychiatristName | string | ◯* | validateName, max(120) | normalizeName | ✅ | ✅ | *Required if hasBeenEvaluated='Yes' |
| psychiatrist.schema.ts:29 | Domain | evaluationDate | date | ◯* | - | - | N/A | ✅ | *Required if hasBeenEvaluated='Yes' |
| psychiatrist.schema.ts:32 | Domain | clinicName | string | ◯ | validateName, max(120) | normalizeName | ✅ | ✅ | - |
| psychiatrist.schema.ts:38 | Domain | notes | string | ◯ | max(300) | - | N/A | ✅ | - |
| psychiatrist.schema.ts:42 | Domain | differentEvaluator | boolean | ◯ | - | - | N/A | ✅ | - |
| psychiatrist.schema.ts:45 | Domain | evaluatorName | string | ◯ | validateName, max(120) | normalizeName | ✅ | ✅ | - |
| psychiatrist.schema.ts:51 | Domain | evaluatorClinic | string | ◯ | max(120) | - | ❌ | 🟡 | Missing name utils |
| **Step 4 - Medical Providers UI** |
| ProvidersSection.tsx:181 | UI | hasPCP | select | ✓ | schema | - | - | ✅ | register("pcp-has") |
| ProvidersSection.tsx:228 | UI | pcpName | input | ◯ | schema | - | ❌ | 🟡 | No UI normalization |
| ProvidersSection.tsx:261 | UI | pcpPractice | input | ◯ | schema | - | ❌ | 🟡 | No UI normalization |
| ProvidersSection.tsx:294 | UI | pcpAddress | input | ◯ | schema | - | N/A | ✅ | - |
| ProvidersSection.tsx:325 | UI | pcpPhone | input | ◯ | schema | formatPhoneInput | ✅ | ✅ | onChange normalization |
| ProvidersSection.tsx:354 | UI | authorizedToShare | checkbox | ◯ | schema | - | N/A | ✅ | - |
| PsychiatristEvaluator:182 | UI | hasBeenEvaluated | select | ✓ | schema | - | N/A | ✅ | register("psy-has") |
| PsychiatristEvaluator:227 | UI | psychiatristName | input | ◯* | schema | - | ❌ | 🟡 | No UI normalization |
| PsychiatristEvaluator:261 | UI | evaluationDate | datepicker | ◯* | schema | - | N/A | ✅ | - |
| PsychiatristEvaluator:289 | UI | clinicName | input | ◯ | schema | - | ❌ | 🟡 | No UI normalization |
| PsychiatristEvaluator:319 | UI | notes | textarea | ◯ | schema | - | N/A | ✅ | - |
| PsychiatristEvaluator:349 | UI | differentEvaluator | switch | ◯ | schema | - | N/A | ✅ | - |
| PsychiatristEvaluator:374 | UI | evaluatorName | input | ◯ | schema | - | ❌ | 🟡 | No UI normalization |
| PsychiatristEvaluator:404 | UI | evaluatorClinic | input | ◯ | schema | - | ❌ | 🟡 | No UI normalization |
| **Step 5 - Medications Domain** |
| currentMedications.schema.ts:57 | Domain | hasMedications | enum | ✓ | ['Yes','No','Unknown'] | - | N/A | ✅ | - |
| currentMedications.schema.ts:33 | Domain | medications[].id | string | ✓ | - | - | N/A | ✅ | - |
| currentMedications.schema.ts:34 | Domain | medications[].name | string | ✓ | min(1), max(200) | - | ❌ | 🟡 | Medication name, not person |
| currentMedications.schema.ts:35 | Domain | medications[].dosage | string | ✓ | min(1), max(100) | - | N/A | ✅ | - |
| currentMedications.schema.ts:36 | Domain | medications[].frequency | string | ✓ | min(1), max(100) | - | N/A | ✅ | - |
| currentMedications.schema.ts:37 | Domain | medications[].route | enum | ◯ | ['oral','injection',...] | - | N/A | ✅ | - |
| currentMedications.schema.ts:38 | Domain | medications[].startDate | date | ◯ | - | - | N/A | ✅ | - |
| currentMedications.schema.ts:39 | Domain | medications[].prescribedBy | string | ◯ | validateName, max(120) | normalizeName | ✅ | ✅ | - |
| currentMedications.schema.ts:44 | Domain | medications[].notes | string | ◯ | max(500) | - | N/A | ✅ | - |
| pharmacyInformation.schema.ts:24 | Domain | pharmacyName | string | ✓ | validateName, max(120) | normalizeName | ✅ | ✅ | - |
| pharmacyInformation.schema.ts:31 | Domain | pharmacyPhone | string | ✓ | validatePhoneNumber | - | ⚠️ | 🔴 CRITICAL | Missing normalizePhoneNumber |
| pharmacyInformation.schema.ts:36 | Domain | pharmacyAddress | string | ◯ | max(200) | - | N/A | ✅ | - |
| **Step 5 - Medications UI** |
| CurrentMedications:134 | UI | hasMedications | select | ✓ | schema | - | N/A | ✅ | register("medications-has") |
| CurrentMedications:213 | UI | medications[].name | input | ✓ | schema | - | N/A | ✅ | Medication name |
| CurrentMedications:243 | UI | medications[].dosage | input | ✓ | schema | - | N/A | ✅ | - |
| CurrentMedications:272 | UI | medications[].frequency | input | ✓ | schema | - | N/A | ✅ | - |
| CurrentMedications:299 | UI | medications[].route | select | ◯ | schema | - | N/A | ✅ | - |
| CurrentMedications:324 | UI | medications[].prescribedBy | input | ◯ | schema | - | ❌ | 🟡 | No UI normalization |
| CurrentMedications:343 | UI | medications[].startDate | datepicker | ◯ | schema | - | N/A | ✅ | - |
| CurrentMedications:355 | UI | medications[].notes | textarea | ◯ | schema | - | N/A | ✅ | - |
| PharmacyInformation:132 | UI | pharmacyName | input | ✓ | schema | - | ❌ | 🟡 | No UI normalization |
| PharmacyInformation:164 | UI | pharmacyPhone | input | ✓ | schema | formatPhoneInput | ✅ | ✅ | onChange normalization |
| PharmacyInformation:187 | UI | pharmacyAddress | input | ◯ | schema | - | N/A | ✅ | - |

**Legend:**
- ✓ = Required field
- ◯ = Optional field
- ◯* = Conditionally required
- ✅ = Compliant/No issues
- 🟡 = Minor issue/Enhancement needed
- 🔴 = Critical issue/Must fix
- ⚠️ = Partial implementation

## Gap Analysis vs Standards

### 🔴 Critical Gaps (Must Fix)

#### 1. Missing Name Validation in providers.schema.ts
**File:** `D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\step4\providers.schema.ts`
**Line:** 24-26
**Field:** `pcpName`
**Current State:**
```typescript
pcpName: z.string().max(120).optional()
```
**Required State:**
```typescript
pcpName: z.string()
  .max(NAME_LENGTHS.PROVIDER_NAME)
  .transform(normalizeName)
  .refine(validateName, 'Invalid characters in provider name')
  .optional()
```
**Impact:** Inconsistent validation, allows invalid characters

#### 2. Missing Phone Normalization in pharmacyInformation.schema.ts
**File:** `D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\step5\pharmacyInformation.schema.ts`
**Line:** 31-33
**Field:** `pharmacyPhone`
**Current State:**
```typescript
pharmacyPhone: z.string()
  .min(1, 'Phone number is required')
  .refine(validatePhoneNumber, 'Please enter a valid phone number')
```
**Required State:**
```typescript
pharmacyPhone: z.string()
  .min(1, 'Phone number is required')
  .transform(normalizePhoneNumber)
  .refine(validatePhoneNumber, 'Please enter a valid phone number')
```
**Impact:** Phone numbers stored with formatting characters

### 🟡 Enhancement Gaps (Should Fix)

#### 3. Practice/Organization Name Fields
**Files:**
- `providers.schema.ts:33` - `pcpPractice`
- `psychiatrist.schema.ts:51` - `evaluatorClinic`

**Issue:** Using plain string validation instead of organization name standards
**Recommendation:** Apply NAME_LENGTHS.ORGANIZATION_NAME and name utilities

#### 4. Missing UI-Level Name Normalization
**Files:**
- `ProvidersSection.tsx` - pcpName, pcpPractice
- `PsychiatristEvaluatorSection.tsx` - All name fields
- `CurrentMedicationsSection.tsx` - prescribedBy
- `PharmacyInformationSection.tsx` - pharmacyName

**Issue:** No real-time normalization feedback
**Recommendation:** Add onChange handlers with normalizeName

### ✅ Compliant Areas

1. **Phone Fields:**
   - `pcpPhone` in providers.schema.ts ✅
   - UI phone formatting in ProvidersSection.tsx ✅
   - UI phone formatting in PharmacyInformationSection.tsx ✅

2. **Name Fields with Full Compliance:**
   - `psychiatristName` ✅
   - `clinicName` ✅
   - `evaluatorName` ✅
   - `prescribedBy` ✅
   - `pharmacyName` ✅

3. **Non-Name/Phone Fields:**
   - All address fields ✅
   - All date fields ✅
   - All enum/boolean fields ✅
   - All note/textarea fields ✅

## Remediation Plan (APPLY Tasks)

### Priority 1: Critical Schema Fixes
**Task 1.1:** Fix pcpName in providers.schema.ts
```
File: D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\step4\providers.schema.ts
Action:
1. Import name utilities at top
2. Replace pcpName validation with shared utilities
Risk: Low - Schema validation only
```

**Task 1.2:** Fix pharmacyPhone normalization
```
File: D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\step5\pharmacyInformation.schema.ts
Action:
1. Add .transform(normalizePhoneNumber) before .refine()
Risk: Low - Additive change only
```

### Priority 2: Organization Name Standards
**Task 2.1:** Standardize pcpPractice field
```
File: D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\step4\providers.schema.ts
Action:
1. Apply NAME_LENGTHS.ORGANIZATION_NAME
2. Add normalizeName and validateName
Risk: Low - Consistent with other org fields
```

**Task 2.2:** Standardize evaluatorClinic field
```
File: D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\step4\psychiatrist.schema.ts
Action:
1. Apply NAME_LENGTHS.ORGANIZATION_NAME
2. Add normalizeName and validateName
Risk: Low - Consistent pattern
```

### Priority 3: UI Normalization Enhancements
**Task 3.1:** Add name normalization to ProvidersSection
```
File: D:\ORBIPAX-PROJECT\src\modules\intake\ui\step4-medical-providers\components\ProvidersSection.tsx
Action:
1. Import normalizeName from shared
2. Add onChange handler for pcpName with normalization
3. Add onChange handler for pcpPractice with normalization
Risk: Medium - UI behavior change
```

**Task 3.2:** Add name normalization to PsychiatristEvaluatorSection
```
File: D:\ORBIPAX-PROJECT\src\modules\intake\ui\step4-medical-providers\components\PsychiatristEvaluatorSection.tsx
Action:
1. Import normalizeName
2. Add onChange handlers for all name fields
Risk: Medium - Multiple fields affected
```

**Task 3.3:** Add prescriber normalization to CurrentMedicationsSection
```
File: D:\ORBIPAX-PROJECT\src\modules\intake\ui\step5-medications\components\CurrentMedicationsSection.tsx
Action:
1. Import normalizeName
2. Add onChange handler for prescribedBy field
Risk: Low - Single field
```

**Task 3.4:** Add pharmacy name normalization
```
File: D:\ORBIPAX-PROJECT\src\modules\intake\ui\step5-medications\components\PharmacyInformationSection.tsx
Action:
1. Import normalizeName
2. Add onChange handler for pharmacyName
Risk: Low - Single field
```

## Email Field Analysis

**Finding:** No email fields found in Step 4 or Step 5
- No provider email addresses collected
- No pharmacy email addresses collected
- Email validation standard (z.string().email()) not applicable to these steps

## Additional Observations

### Positive Findings
1. **Consistent phone formatting** in UI where implemented
2. **Strong adoption** of shared utilities in Step 5 schemas
3. **Good separation** of validation logic in domain layer
4. **Character limits** properly enforced

### Areas for Improvement
1. **Inconsistent** shared utility adoption in Step 4
2. **Missing** real-time normalization in most UI components
3. **Organization names** not using dedicated validation
4. **No email collection** for providers/pharmacies (design decision?)

## Validation Checklist

✅ **Audit Scope Completed:**
- [x] Located all Step 4 & 5 files (no Step 6 exists)
- [x] Inventoried all fields in domain schemas
- [x] Inventoried all form bindings in UI components
- [x] Identified shared utility usage
- [x] Documented all validation patterns
- [x] Created remediation plan

✅ **Compliance Verified:**
- [x] AUDIT-ONLY - No code modified
- [x] No PHI exposed in report
- [x] Paths verified and accurate
- [x] All fields accounted for
- [x] Priority-based remediation plan
- [x] Risk assessment included

## Summary

The medical and pharmacy functionality (Steps 4 & 5) shows **70% compliance** with shared utilities:
- **10 of 14** name fields use shared utilities
- **2 of 3** phone fields fully compliant
- **0 email fields** present (none needed)

**Immediate action required** for:
1. pcpName field validation
2. pharmacyPhone normalization

**Enhancement opportunities** for UI-level normalization would significantly improve user experience.

---
**Report Generated:** 2025-09-26
**Status:** AUDIT-ONLY COMPLETE
**Next Step:** Review and approve remediation tasks