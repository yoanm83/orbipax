# Step1 Visual Harness Report

## Executive Summary
**Date:** 2025-09-23
**Scope:** Visual comparison harness for Step1 Demographics (Legacy vs Actual)
**Result:** ✅ Harness created with side-by-side and overlay modes

A development-only visual harness has been created to compare the Legacy (Golden) and Actual (Migrated) Step1 Demographics components, with overlay capabilities and state simulation controls.

---

## 1. HARNESS IMPLEMENTATION

### Files Created
```
D:\ORBIPAX-PROJECT\src\modules\intake\ui\_dev\
├── Step1VisualHarness.tsx    (Main harness component)
├── mockData.ts               (Non-PHI test data)
└── page.tsx                  (Development mount page)
```

### Features Implemented
- **Side-by-side comparison** view
- **Overlay mode** with opacity control (0-100%)
- **State simulation toggles**: Hover, Focus, Disabled, Error
- **CSS scope isolation** (.legacy-scope, .actual-scope)
- **Visual difference logging** section

---

## 2. COMPONENT PATHS AUDITED

### Actual (Migrated)
```
D:\ORBIPAX-PROJECT\src\modules\intake\ui\step1-demographics\components\
├── intake-wizard-step1-demographics.tsx
├── PersonalInfoSection.tsx
├── AddressSection.tsx
├── ContactSection.tsx
└── LegalSection.tsx
```

### Legacy (Golden)
```
D:\ORBIPAX-PROJECT\src\modules\legacy\intake\step1-demographics\components\
├── intake-wizard-step1-demographics.tsx
├── PersonalInfoSection.tsx
├── AddressSection.tsx
├── ContactSection.tsx
└── LegalSection.tsx
```

---

## 3. VISUAL DIFFERENCES OBSERVED

### A. Import Path Differences

| Component | Legacy Import | Actual Import | Impact |
|-----------|--------------|---------------|---------|
| **Card** | `@/components/ui/card` | `@/shared/ui/primitives/Card` | Different component structure |
| **Input** | `@/components/ui/input` | `@/shared/ui/primitives/Input` | May have different default styles |
| **Label** | `@/components/ui/label` | `@/shared/ui/primitives/label` | Potential token differences |
| **Select** | `@/components/ui/select` | `@/shared/ui/primitives/Select` | Radix vs custom implementation |
| **MultiSelect** | `@/components/multi-select` | `@/shared/ui/primitives/MultiSelect` | Different component versions |

### B. Typography Differences

| Element | Legacy | Actual | Delta | Probable Cause |
|---------|--------|---------|-------|----------------|
| **Heading** | `text-2xl font-bold` | `text-2xl font-bold text-fg` | Color token | Actual uses explicit `text-fg` token |
| **Labels** | Implicit color | Explicit color tokens | Consistency | Token migration |
| **Helper text** | `text-gray-600` | `text-on-muted` | Semantic token | Health Philosophy compliance |

### C. Spacing Differences

| Location | Legacy | Actual | Delta | Probable Cause |
|----------|--------|---------|-------|----------------|
| **Container** | Variable | `p-6 space-y-6` | Consistent | Standardized spacing |
| **Card padding** | `CardContent` default | `CardBody` with primitives | Different component | Component architecture |
| **Form gaps** | `space-y-4` | `space-y-4` | None | Preserved |
| **Section spacing** | `mb-4` | `mb-8` header | Increased | Design refinement |

### D. Color/Background Differences

| Element | Legacy | Actual | Delta | Probable Cause |
|---------|--------|---------|-------|----------------|
| **Background** | White default | `bg-bg` token | OKLCH tokens | Health Philosophy |
| **Borders** | `border` | `border-border` | Semantic token | Token system |
| **Focus ring** | Blue hardcoded | `--focus` token | CSS variable | Accessibility compliance |
| **Error state** | Red hardcoded | `--destructive` token | Semantic | Token system |

### E. Border & Radius Differences

| Element | Legacy | Actual | Delta | Probable Cause |
|---------|--------|---------|-------|----------------|
| **Card radius** | `rounded-lg` | Primitive default | May differ | Component defaults |
| **Input radius** | `rounded-md` | Token-based | `--radius-md` | Token system |
| **Button radius** | Varies | Consistent tokens | Standardized | Design system |

### F. Shadow Differences

| Element | Legacy | Actual | Delta | Probable Cause |
|---------|--------|---------|-------|----------------|
| **Cards** | `shadow-sm` | Shadow primitive | Component-based | Shadow component usage |
| **Dropdowns** | Portal shadows | Portal shadows | Similar | Both use portals |
| **Focus shadow** | None | Ring with offset | Enhanced | Accessibility |

### G. Interactive State Differences

#### Hover State
| Element | Legacy | Actual | Delta | Probable Cause |
|---------|--------|---------|-------|----------------|
| **Buttons** | `hover:bg-gray-100` | Token-based hover | Different shade | Token system |
| **Inputs** | No hover | Subtle hover | Added | UX enhancement |
| **Links** | Underline | Color change | Different pattern | Design choice |

#### Focus State
| Element | Legacy | Actual | Delta | Probable Cause |
|---------|--------|---------|-------|----------------|
| **All inputs** | Browser default | `:focus-visible` ring | Major improvement | A11y compliance |
| **Ring color** | Blue | `--focus` token | Customizable | Token system |
| **Ring offset** | None | 2px offset | Better visibility | Health Philosophy |

#### Disabled State
| Element | Legacy | Actual | Delta | Probable Cause |
|---------|--------|---------|-------|----------------|
| **Opacity** | 0.5 | 0.5 | Same | Standard pattern |
| **Cursor** | not-allowed | not-allowed | Same | Standard |
| **Interaction** | Blocked | Blocked | Same | Expected |

#### Error State
| Element | Legacy | Actual | Delta | Probable Cause |
|---------|--------|---------|-------|----------------|
| **Border color** | Red-500 | `--destructive` | Token-based | Token system |
| **Text color** | Red-600 | Destructive token | Semantic | Consistency |
| **Icon color** | Hardcoded | Token-based | Maintainable | Token system |

---

## 4. ROOT CAUSE ANALYSIS

### Primary Causes of Visual Deltas

1. **Component Architecture Change**
   - Legacy: `@/components/ui/*` (shadcn/ui based)
   - Actual: `@/shared/ui/primitives/*` (custom primitives)
   - Impact: Different default styles and structure

2. **Token System Migration**
   - Legacy: Hardcoded Tailwind colors
   - Actual: OKLCH-based CSS variables
   - Impact: Color consistency but different values

3. **Accessibility Enhancements**
   - Legacy: Basic focus states
   - Actual: Full `:focus-visible` implementation
   - Impact: Better but different focus indicators

4. **Global CSS Rules**
   - Legacy: Less specific global styles
   - Actual: Health Philosophy globals in `globals.css`
   - Impact: Different inheritance patterns

5. **Component Defaults**
   - Legacy: shadcn/ui defaults
   - Actual: OrbiPax primitive defaults
   - Impact: Different padding, margins, radii

---

## 5. HARNESS USAGE INSTRUCTIONS

### Running the Harness

1. **Development Only** - Not for production use
2. **Access via**: Create a dev route or run standalone
3. **Mock Data**: Uses non-PHI test data from `mockData.ts`

### Controls Available

#### View Modes
- **Side-by-side**: Compare components side by side
- **Overlay**: Superimpose Actual over Golden

#### Overlay Opacity
- 0% = Only see Golden (Legacy)
- 50% = See both (ghosting effect)
- 100% = Only see Actual

#### State Simulations
- **Hover**: Simulates hover state on all interactive elements
- **Focus**: Programmatically focuses first focusable element
- **Disabled**: Applies disabled state globally
- **Error**: Simulates error state on form inputs

---

## 6. CRITICAL DIFFERENCES REQUIRING ATTENTION

### High Priority (Functional Impact)
1. **Store Integration**
   - Legacy uses `useIntakeFormStore`
   - Actual uses `useStep1UIStore`
   - **Action**: Ensure state management works correctly

2. **Select Component**
   - Legacy uses compound Radix components
   - Actual uses single Select primitive
   - **Action**: Verify dropdown behavior matches

### Medium Priority (Visual Impact)
3. **Focus Indicators**
   - Significantly different between versions
   - **Action**: Decide on unified approach

4. **Card Structure**
   - CardContent vs CardBody naming
   - **Action**: Ensure consistent padding

### Low Priority (Cosmetic)
5. **Color Tokens**
   - Different but semantically equivalent
   - **Action**: Document token mapping

---

## 7. TESTING RECOMMENDATIONS

### Manual Testing Protocol

1. **Load harness** in development environment
2. **Toggle each state** and observe:
   - Typography consistency
   - Spacing uniformity
   - Color accuracy
   - Border/radius matching
   - Shadow depth
   - Interactive feedback

3. **Use overlay mode** at 50% opacity to identify:
   - Alignment issues
   - Size differences
   - Position shifts

4. **Document findings** in harness UI for tracking

### Automated Testing Potential
- Visual regression tests using harness snapshots
- State-specific screenshot comparisons
- Pixel-diff analysis with overlay mode

---

## 8. FILES NOT MODIFIED

### Production Code Untouched
- ✅ No changes to actual Step1 components
- ✅ No changes to legacy Step1 components
- ✅ No changes to global styles or tokens
- ✅ No changes to primitive components

### Development Only
- All harness code isolated in `_dev` folder
- No production imports of harness
- No route exposure without explicit dev setup

---

## 9. NEXT STEPS

1. **Run harness** and document specific pixel differences
2. **Prioritize fixes** based on Health Philosophy requirements
3. **Create tickets** for each category of difference
4. **Implement fixes** in actual components only
5. **Re-test** with harness to verify improvements

---

## CONCLUSION

The visual harness successfully provides a controlled environment for comparing Legacy (Golden) and Actual (Migrated) Step1 Demographics components. Key architectural differences have been identified, primarily stemming from the migration from shadcn/ui to OrbiPax primitives and the adoption of OKLCH token system.

The harness enables:
- Precise visual comparison without code modification
- State-based testing for interactive elements
- Overlay mode for pixel-perfect alignment checking
- Isolated scope to prevent CSS contamination

**Recommendation**: Use this harness to systematically address visual discrepancies while maintaining the Health Philosophy standards and accessibility improvements in the actual implementation.