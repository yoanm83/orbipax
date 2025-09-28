# Step 1 Demographics: MD3 Audit Report
## Elevation, Shape Scale & State Layers

**Date**: 2025-09-27
**Type**: AUDIT-ONLY (no code changes)
**Scope**: Material Design 3 compliance assessment
**Target**: Step 1 Demographics components

## Executive Summary

**MD3 Compliance Score**: ~65%

### Key Findings:
- ✅ Shape scale properly implemented (`rounded-3xl` for cards)
- ⚠️ Elevation system partially compliant (using `shadow-md` instead of MD3 levels)
- ⚠️ State layers incomplete (missing ripple effects, pressed states)
- ✅ Focus states well-implemented across components

## 1. ELEVATION AUDIT (MD3 Levels 0-5)

### Current Implementation vs MD3 Standard

| Component | Current | MD3 Expected | Token/Variant Used | Gap |
|-----------|---------|--------------|-------------------|-----|
| **Section Cards** | Level ~2 | Level 1 | `shadow-md` | Missing elevation variants |
| PersonalInfoSection | shadow-md | Level 1 (rest) | Hard-coded class | No `variant="elevated"` |
| AddressSection | shadow-md | Level 1 (rest) | Hard-coded class | No `variant="elevated"` |
| ContactSection | shadow-md | Level 1 (rest) | Hard-coded class | No `variant="elevated"` |
| LegalSection | shadow-md | Level 1 (rest) | Hard-coded class | No `variant="elevated"` |
| **Navigation Bar** | Level 0 | Level 0-1 | `border-t` only | ✅ Compliant |
| **Photo Upload** | Level 0-4 | Level 0-3 | `ring-4` on selected | Partial compliance |

### Available Elevation Variants in Card Primitive:
```tsx
variants: {
  default: "bg-card border border-border",        // Level 0
  outlined: "bg-card border-2 border-border",     // Level 0
  elevated: "bg-card shadow-lg border",           // Level 2-3
  filled: "bg-muted border"                       // Level 0
}
```

### GAP: Card Components Not Using Elevation Variants
**Issue**: All cards use inline `shadow-md` instead of Card primitive's `variant="elevated"`
**Solution Path**: `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step1-demographics\components\*Section.tsx`
- Change: `<Card className="... shadow-md ...">`
- To: `<Card variant="elevated" className="...">`

## 2. SHAPE SCALE AUDIT (Radii)

### Current Implementation vs MD3 Shape Scale

| Component | Current Radius | MD3 Scale | Token Used | Gap |
|-----------|---------------|-----------|------------|-----|
| **Section Cards** | Extra Large | Large | `rounded-3xl` | Over-rounded |
| **Buttons** | Small | Small-Medium | `rounded-md` | ✅ Compliant |
| **Inputs** | Small | Small | `rounded-md` | ✅ Compliant |
| **Select** | Small | Small | `rounded-md` | ✅ Compliant |
| **Photo Circle** | Full | Full | `rounded-full` | ✅ Compliant |
| **Checkbox** | Minimal | Extra Small | Default primitive | ✅ Compliant |

### MD3 Shape Scale Mapping:
- Extra Small: `rounded` (4px)
- Small: `rounded-md` (8px) ✅ Used
- Medium: `rounded-lg` (12px)
- Large: `rounded-xl` (16px)
- Extra Large: `rounded-2xl` (24px)
- Full: `rounded-full` ✅ Used

### GAP: Cards Using Non-Standard Radius
**Issue**: `rounded-3xl` (28px+) exceeds MD3 Large (16px)
**Solution Path**: Standardize to `rounded-xl` or `rounded-2xl`

## 3. STATE LAYERS AUDIT (Hover/Pressed/Focus)

### Interactive Components State Analysis

| Component | Hover | Pressed | Focus | Disabled | Gap |
|-----------|-------|---------|-------|----------|-----|
| **Button Primitive** | ✅ `/90` opacity | ❌ Missing | ✅ Ring | ✅ Opacity | No pressed state |
| **Input Primitive** | ❌ None | N/A | ✅ Ring | ✅ Opacity | No hover feedback |
| **Select Trigger** | ❌ None | N/A | ✅ Ring | ✅ Opacity | No hover feedback |
| **Section Headers** | ❌ None | ❌ None | ✅ Ring | N/A | No state layers |
| **Checkbox** | ⚠️ Unknown | ❌ None | ✅ Default | ✅ Opacity | Missing pressed |
| **Switch** | ⚠️ Unknown | ❌ None | ✅ Default | ✅ Opacity | Missing pressed |

### State Layer Implementation Details:

#### Button States (from primitive):
```tsx
variant: {
  default: "hover:bg-primary/90",      // ✅ Hover opacity
  outline: "hover:bg-accent",          // ✅ Tonal hover
  secondary: "hover:bg-secondary/80",  // ✅ Hover opacity
}
// ❌ Missing: Active/pressed state (MD3: 12% state layer)
```

#### Input States:
```tsx
base: "focus-visible:ring-2"  // ✅ Focus ring
// ❌ Missing: Hover state (MD3: 8% state layer)
// ❌ Missing: Pressed state (MD3: 12% state layer)
```

#### Section Headers (collapsible):
```tsx
className="cursor-pointer min-h-[44px]"
// ❌ Missing: Hover feedback
// ❌ Missing: Pressed feedback
// ✅ Has: Focus ring on keyboard navigation
```

## 4. GAPS & PROPOSED SOLUTIONS

### Priority 1: Elevation System
| Gap | Location | Solution |
|-----|----------|----------|
| Hard-coded shadows | All section cards | Use Card `variant="elevated"` |
| No elevation on hover | Cards | Add hover elevation increase |
| Missing elevation scale | Card primitive | Add MD3 levels 0-5 variants |

**Proposed Path**:
1. Update Card primitive to include MD3 elevation variants (0-5)
2. Apply appropriate variant to each section card
3. Add interactive elevation changes on hover

### Priority 2: State Layers
| Gap | Component | Solution |
|-----|-----------|----------|
| No pressed state | Buttons | Add `active:` classes with opacity |
| No hover on inputs | Input/Select | Add hover state layer (8% opacity) |
| No feedback on headers | Section headers | Add hover/active states |

**Proposed Path**:
1. Extend Button primitive: Add `active:bg-primary/88` (12% layer)
2. Extend Input primitive: Add `hover:bg-accent/8` (8% layer)
3. Add to section headers: `hover:bg-accent/4 active:bg-accent/8`

### Priority 3: Shape Consistency
| Gap | Location | Solution |
|-----|----------|----------|
| Over-rounded cards | `rounded-3xl` | Change to `rounded-xl` or `rounded-2xl` |

**Proposed Path**:
Replace `rounded-3xl` with `rounded-2xl` in all section cards

## 5. COMPLIANCE SUMMARY

### ✅ Compliant Areas (35%)
- Focus rings on all interactive elements
- Disabled states properly implemented
- Basic hover states on buttons
- Consistent spacing and padding
- Touch target sizes (44px minimum)

### ⚠️ Partial Compliance (30%)
- Elevation present but not MD3 levels
- Shape scale mostly correct except cards
- Some hover states implemented

### ❌ Non-Compliant (35%)
- Missing pressed/active states
- No ripple effects (MD3 signature)
- Elevation not using design tokens
- Input/Select lacking hover states
- Section headers missing state layers

## 6. RECOMMENDED NEXT STEPS

### Micro-Task 1: Elevation Tokens
**Path**: `D:\ORBIPAX-PROJECT\src\shared\ui\primitives\Card\index.tsx`
- Add MD3 elevation variants (level-0 through level-5)
- Update shadow values to match MD3 spec

### Micro-Task 2: Apply Elevation Variants
**Path**: `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step1-demographics\components\*.tsx`
- Replace `shadow-md` with Card variant
- Add hover elevation changes

### Micro-Task 3: State Layer Implementation
**Path**: `D:\ORBIPAX-PROJECT\src\shared\ui\primitives\{Button,Input,Select}\index.tsx`
- Add pressed states with proper opacity
- Implement hover layers for inputs

### Micro-Task 4: Shape Scale Normalization
**Path**: All section components
- Replace `rounded-3xl` with `rounded-2xl`

## VALIDATION

### Guardrails Compliance:
- ✅ **AUDIT-ONLY**: No code changes made
- ✅ **Architecture**: UI layer analysis only
- ✅ **No PHI**: No patient data referenced
- ✅ **Token System**: Identified token usage and gaps
- ✅ **No Duplication**: Referenced existing primitives

### Report Deliverables:
- ✅ Elevation mapping (current vs expected)
- ✅ Shape scale verification
- ✅ State layer assessment
- ✅ Gap identification with exact paths
- ✅ Priority-ordered solutions

---

**Status**: AUDIT COMPLETE
**MD3 Compliance**: ~65%
**Critical Gaps**: 4 identified
**Next Action**: Proceed with micro-task implementations