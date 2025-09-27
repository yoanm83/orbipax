# Pharmacy Phone Field Status Report
**Date:** 2025-09-26
**Type:** AUDIT-ONLY - No code modifications
**Target:** `pharmacyPhone` field in Step 5 Pharmacy Information

## Executive Summary

**Status:** ⚠️ **PARTIALLY COMPLIANT** - Missing normalization transform in schema

The `pharmacyPhone` field has inconsistent implementation:
- ✅ UI layer correctly uses phone utilities
- ❌ Schema missing `normalizePhoneNumber` transform
- ✅ No local regex/helpers found

## Current State Analysis

### 1. Schema Layer (Domain)
**File:** `D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\step5\pharmacyInformation.schema.ts`
**Lines:** 31-33

#### Current Implementation
```typescript
// Line 10 - Imports (INCOMPLETE)
import { validatePhoneNumber } from '@/shared/utils/phone'

// Lines 31-33 - Field definition
pharmacyPhone: z.string()
  .min(1, 'Phone number is required')
  .refine(validatePhoneNumber, 'Please enter a valid phone number'),
```

#### Issues Found
- ❌ **Missing import:** `normalizePhoneNumber` not imported
- ❌ **Missing transform:** No `.transform(normalizePhoneNumber)` before `.refine()`
- ✅ **Validation present:** Uses `validatePhoneNumber` correctly
- ✅ **No local regex:** No ad-hoc regex patterns found

### 2. UI Layer
**File:** `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step5-medications\components\PharmacyInformationSection.tsx`
**Lines:** 85-95, 164-179

#### Current Implementation
```typescript
// Line 11 - Imports (CORRECT)
import { formatPhoneInput, normalizePhoneNumber } from "@/shared/utils/phone"

// Lines 85-95 - Phone change handler
const handlePhoneChange = (value: string) => {
  const formatted = formatPhoneInput(value, pharmacyPhone)
  setPharmacyPhone(formatted)

  const normalized = normalizePhoneNumber(formatted)
  if (normalized.length >= 10) {
    clearValidationError('pharmacyPhone')
  }
}

// Line 168 - Input onChange
onChange={(e) => handlePhoneChange(e.target.value)}
```

#### Analysis
- ✅ **Formatting:** Uses `formatPhoneInput` for real-time formatting
- ✅ **Normalization:** Uses `normalizePhoneNumber` for validation
- ✅ **No local masks:** No ad-hoc regex or masking logic
- ✅ **Clean implementation:** Properly structured handler

## Gap Analysis

### Schema vs UI Mismatch
| Layer | Normalization | Validation | Formatting | Status |
|-------|---------------|------------|------------|--------|
| Schema | ❌ Missing | ✅ Present | N/A | ⚠️ Incomplete |
| UI | ✅ Present | ✅ Present | ✅ Present | ✅ Complete |

### Impact
- **Data Storage:** Phone numbers may be stored with formatting characters
- **Validation Inconsistency:** UI normalizes but schema doesn't
- **Potential Issues:**
  - Phone comparison failures
  - Database storage inconsistency
  - API validation mismatches

## Remediation Plan (APPLY)

### Required Fix
**File:** `D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\step5\pharmacyInformation.schema.ts`

#### Step 1: Update Import
```typescript
// Line 10 - Add normalizePhoneNumber to import
import { validatePhoneNumber, normalizePhoneNumber } from '@/shared/utils/phone'
```

#### Step 2: Add Transform
```typescript
// Lines 31-33 - Add transform before refine
pharmacyPhone: z.string()
  .min(1, 'Phone number is required')
  .transform(normalizePhoneNumber)  // ADD THIS LINE
  .refine(validatePhoneNumber, 'Please enter a valid phone number'),
```

### Expected Result
The validation chain should be:
1. Check minimum length (required field)
2. **Transform** to normalize (strip non-digits)
3. **Refine** to validate format

### Risk Assessment
- **Risk Level:** LOW
- **Impact:** Additive change only
- **Breaking Changes:** None
- **Testing Required:** Minimal (existing validation tests should pass)

## Comparison with Other Phone Fields

### Compliant Examples
#### providers.schema.ts (Step 4)
```typescript
pcpPhone: z.string()
  .transform(normalizePhoneNumber)  // ✅ Has transform
  .refine(validatePhoneNumber, 'Invalid phone number')
  .optional()
```

### Current Non-Compliant
#### pharmacyInformation.schema.ts (Step 5)
```typescript
pharmacyPhone: z.string()
  .min(1, 'Phone number is required')
  // ❌ Missing .transform(normalizePhoneNumber)
  .refine(validatePhoneNumber, 'Please enter a valid phone number')
```

## Validation Checklist

✅ **Audit Completed:**
- [x] Located pharmacy schema at correct path
- [x] Identified missing transform in schema
- [x] Verified UI implementation is correct
- [x] No local regex/helpers found
- [x] Documented exact line numbers
- [x] Created minimal APPLY plan

✅ **Compliance Verified:**
- [x] AUDIT-ONLY - No code modified
- [x] No PHI in report
- [x] Exact file paths provided
- [x] Clear status (PARTIALLY COMPLIANT)
- [x] Single-file fix identified

## Summary

The `pharmacyPhone` field is **partially compliant**:
- **UI Layer:** ✅ Fully compliant with shared utilities
- **Schema Layer:** ⚠️ Missing normalization transform

**Required Action:** Add `.transform(normalizePhoneNumber)` to schema (1 line change)

**Priority:** MEDIUM - Data consistency issue but no functional impact

---
**Report Generated:** 2025-09-26
**Status:** AUDIT-ONLY COMPLETE
**Next Step:** Apply single-line fix to add transform