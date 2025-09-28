# Step 1: Demographics - UI-Only Audit Report (Phase 1)

**Date**: 2025-09-27
**Scope**: UI Layer Compliance Audit - Demographics Step
**Target**: `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step1-demographics\`
**Type**: Read-only audit (no code changes)

## Executive Summary

The Demographics step shows **CRITICAL NON-COMPLIANCE** with project standards. Major violations include:
- **Native HTML buttons** instead of Button primitive
- **Hardcoded colors** in inline styles
- **Inconsistent spacing** compared to other wizard steps
- **Missing container queries** despite @container usage
- **Import casing violations** (label vs Label)

## Compliance Matrix

### 1. Typography & Text

| Category | Status | Evidence | Risk |
|----------|--------|----------|------|
| Heading scales | ⚠️ PARTIAL | `h2 text-lg font-medium` (line 121) - consistent size but no semantic hierarchy | MEDIUM |
| Font weights | ✅ PASS | Uses `font-medium` tokens | LOW |
| Text colors | ✅ PASS | Uses `text-[var(--foreground)]`, `text-[var(--muted-foreground)]` | LOW |
| Line heights | ❌ MISSING | No explicit leading classes | MEDIUM |

### 2. Colors & Tokens

| Category | Status | Evidence | Risk |
|----------|--------|----------|------|
| Background colors | ⚠️ PARTIAL | Uses `bg-[var(--primary)]` BUT hardcoded gradients in PersonalInfoSection:137 | HIGH |
| Text colors | ❌ FAIL | Hardcoded `text-white` in intake-wizard-step1-demographics.tsx | HIGH |
| Border colors | ✅ PASS | Uses `border-[var(--border)]` | LOW |
| Shadow classes | ⚠️ PARTIAL | Hardcoded shadows `shadow-lg`, `shadow-xl`, `shadow-primary/20` (lines 133-137) | MEDIUM |
| Hover states | ✅ PASS | Uses `hover:bg-[var(--accent)]` | LOW |

**Critical Violations Found**:
- PersonalInfoSection.tsx:133-137: `shadow-lg hover:shadow-xl shadow-primary/20`
- PersonalInfoSection.tsx:136: `bg-gradient-to-br from-secondary/50 to-secondary`

### 3. Spacing & Layout

| Category | Status | Evidence | Risk |
|----------|--------|----------|------|
| Container padding | ❌ FAIL | `p-6` inconsistent with other steps using `px-6 py-4` for headers | HIGH |
| Section spacing | ✅ PASS | Uses `space-y-6` consistently | LOW |
| Grid layouts | ✅ PASS | Uses `grid grid-cols-1 md:grid-cols-2` appropriately | LOW |
| Container queries | ⚠️ PARTIAL | `@container` declared in AddressSection:44 but uses `@lg:` prefix incorrectly | MEDIUM |
| Max widths | ❌ MISSING | No `max-w-5xl mx-auto` wrapper like other steps | HIGH |

### 4. Primitives Usage

| Category | Status | Evidence | Risk |
|----------|--------|----------|------|
| Button primitive | ❌ FAIL | Uses native `<button>` elements (lines 54-77) | CRITICAL |
| Input primitive | ✅ PASS | Uses `Input` from primitives | LOW |
| Select primitive | ✅ PASS | Uses `Select` from primitives | LOW |
| Card primitive | ✅ PASS | Uses `Card`, `CardBody` from primitives | LOW |
| Label primitive | ❌ FAIL | Import casing error: `label` instead of `Label` | HIGH |
| Checkbox primitive | ✅ PASS | Uses `Checkbox` from primitives | LOW |
| DatePicker | ✅ PASS | Uses `DatePicker` from primitives | LOW |

**Critical Native Elements Found**:
```tsx
// intake-wizard-step1-demographics.tsx:54-77
<button type="button" onClick={prevStep} className="...">Back</button>
<button type="button" className="...">Save Draft</button>
<button type="button" onClick={nextStep} className="...">Continue</button>
```

### 5. Accessibility

| Category | Status | Evidence | Risk |
|----------|--------|----------|------|
| Label associations | ✅ PASS | Uses `htmlFor` and `id` properly | LOW |
| ARIA attributes | ✅ PASS | Uses `aria-expanded`, `aria-controls`, `aria-labelledby` | LOW |
| Focus management | ⚠️ PARTIAL | Custom focus-visible styles instead of primitive defaults | MEDIUM |
| Touch targets | ✅ PASS | `min-h-[44px]` on interactive elements | LOW |
| Keyboard support | ✅ PASS | Handles Enter/Space keys for toggles | LOW |
| Required fields | ⚠️ INCONSISTENT | Mix of `required` prop and asterisk in labels | MEDIUM |

### 6. Visual Consistency

| Category | Status | Evidence | Risk |
|----------|--------|----------|------|
| Card pattern | ✅ PASS | Uses `rounded-3xl shadow-md` consistently | LOW |
| Header pattern | ❌ FAIL | Missing step-level header like other steps | HIGH |
| Icon usage | ✅ PASS | Uses Lucide icons consistently | LOW |
| Chevron position | ✅ PASS | Right-aligned expand/collapse chevrons | LOW |
| Border radius | ✅ PASS | Uses `rounded-3xl` for cards | LOW |

## Comparison with Consolidated Steps

### Step 8 (Treatment Goals) Pattern
```tsx
// Correct pattern from Step8TreatmentGoalsPage.tsx
<div className="flex-1 w-full">
  <div className="p-6 space-y-4">
    <Card className="w-full rounded-3xl shadow-md">
```

### Demographics Current Pattern
```tsx
// Current incorrect pattern
<div className="flex-1 w-full p-6"> // padding at wrong level
  <div className="space-y-6"> // missing wrapper structure
```

## Hardcoded Values Detected

1. **PersonalInfoSection.tsx:133-137**: Complex inline conditional styles with hardcoded shadows
2. **PersonalInfoSection.tsx:149**: `text-4xl` hardcoded instead of Typography primitive
3. **PersonalInfoSection.tsx:154**: `text-sm` hardcoded
4. **intake-wizard-step1-demographics.tsx:54-77**: Entire button styling inline

## Missing Primitives Analysis

| Current Implementation | Should Use | Location |
|------------------------|------------|----------|
| Native `<button>` | Button primitive | intake-wizard-step1-demographics.tsx:54-77 |
| Import from 'label' | Import from 'Label' | PersonalInfoSection.tsx:6, AddressSection.tsx:7 |
| Inline button styles | Button variants | Navigation buttons |
| Text size classes | Typography primitive | Various text elements |

## Microtasks Remediation Plan (Prioritized)

### Priority 1: CRITICAL (Blocks compliance)
1. **Replace native buttons with Button primitive** (3 instances)
   - Back button → `<Button variant="secondary">`
   - Save Draft → `<Button variant="outline">`
   - Continue → `<Button variant="primary">`

2. **Fix import casing violations**
   - Change all `import { Label } from "@/shared/ui/primitives/label"`
   - To: `import { Label } from "@/shared/ui/primitives/Label"`

### Priority 2: HIGH (Visual inconsistency)
3. **Add step-level wrapper structure**
   - Match Step8 pattern with proper nesting
   - Add `max-w-5xl mx-auto` container

4. **Remove hardcoded shadows and gradients**
   - Replace inline shadow classes with Shadow primitive
   - Remove gradient backgrounds, use solid tokens

5. **Standardize header padding**
   - Change `py-3 px-6` to `px-6 py-4` to match other steps

### Priority 3: MEDIUM (Polish)
6. **Add Typography primitive usage**
   - Replace text size classes with Typography components
   - Implement semantic heading hierarchy

7. **Fix container query syntax**
   - Correct `@lg:` to proper container query syntax

8. **Standardize required field indicators**
   - Use consistent pattern (either prop or visual indicator)

## Build Verification Status

- **TypeScript**: Not executed (read-only audit)
- **ESLint**: Not executed (read-only audit)
- **Known Issues**: Import casing will cause build errors

## Security & Compliance Notes

- ✅ No PHI exposure detected
- ✅ No console.log statements found
- ❌ Hardcoded values violate token system
- ⚠️ Button implementations bypass DS security patterns

## Recommendations

1. **IMMEDIATE**: Fix button primitive usage before any domain/state work
2. **URGENT**: Resolve import casing to prevent build failures
3. **HIGH**: Align visual structure with consolidated wizard steps
4. **MEDIUM**: Implement Typography primitive for text hierarchy

## Phase 2 Prerequisites

Before proceeding to Domain audit (Zod schemas), the following UI issues must be resolved:
- Button primitive implementation
- Import casing corrections
- Structural alignment with wizard pattern

---

**Audit Type**: UI-Only (Phase 1)
**Next Phase**: Domain/Zod audit (after UI remediation)
**Status**: **FAILED** - Critical violations requiring immediate remediation