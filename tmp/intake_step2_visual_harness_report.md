# Step 2 Visual Harness Report

## Executive Summary
**Date:** 2025-09-23
**Scope:** Visual comparison harness for Step 2 Insurance & Eligibility (Legacy vs Actual)
**Result:** ✅ Harness created | ⚠️ Step 2 not yet migrated

A visual harness has been created for Step 2, but the Actual implementation does not exist yet. The harness compares the full Legacy implementation against a placeholder, documenting the structure needed for future migration.

---

## 1. HARNESS IMPLEMENTATION

### Files Created
```
D:\ORBIPAX-PROJECT\src\modules\intake\ui\_dev\
├── Step2VisualHarness.tsx       (Main harness component)
├── mockDataStep2.ts             (Non-PHI test data)
└── Step2PlaceholderActual.tsx   (Placeholder for unmigrated step)
```

### Features Implemented
- **Side-by-side comparison** view
- **Overlay mode** with opacity control (0-100%)
- **State simulation toggles**: Hover, Focus, Disabled, Error
- **CSS scope isolation** (.legacy-scope, .actual-scope)
- **Placeholder component** for non-existent Actual

---

## 2. COMPONENT PATHS AUDITED

### Actual (Not Found)
```
D:\ORBIPAX-PROJECT\src\modules\intake\ui\step2-*
❌ Step 2 does not exist in Actual implementation
```

### Legacy (Golden)
```
D:\ORBIPAX-PROJECT\src\modules\legacy\intake\step2-eligibility-insurance\components\
├── intake-step2-eligibility-insurance.tsx  (Main component)
├── GovernmentCoverageSection.tsx          (Medicaid/Medicare)
├── EligibilityRecordsSection.tsx          (Coverage verification)
├── InsuranceRecordsSection.tsx            (Private insurance)
└── AuthorizationsSection.tsx              (Pre-authorizations)
```

---

## 3. LEGACY STRUCTURE ANALYSIS

### A. Main Component Structure
```typescript
// intake-step2-eligibility-insurance.tsx
export function IntakeStep2EligibilityInsurance() {
  return (
    <div className="flex-1 w-full p-6">
      <GovernmentCoverageSection />
      <EligibilityRecordsSection />
      <InsuranceRecordsSection />
      <AuthorizationsSection />
    </div>
  )
}
```

### B. Section Pattern (Consistent Across All)
```typescript
<Card className="w-full rounded-2xl shadow-md mb-6">
  <div className="p-6 border-b flex justify-between items-center cursor-pointer">
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-primary" />
      <h2 className="text-xl font-semibold">Section Title</h2>
    </div>
    {isExpanded ? <ChevronUp /> : <ChevronDown />}
  </div>
  {isExpanded && <CardContent className="p-6">...</CardContent>}
</Card>
```

### C. Component Types Used

| Component Type | Legacy Implementation | Count | Purpose |
|---------------|----------------------|-------|---------|
| **Card** | `@/components/ui/card` | 4 main + nested | Section containers |
| **Switch** | `@/components/ui/switch` | 6+ | Boolean toggles |
| **Input** | `@/components/ui/input` | 20+ | Text fields |
| **Select** | `@/components/ui/select` | 8+ | Dropdowns |
| **Calendar** | `@/components/ui/custom-calendar` | 8+ | Date pickers |
| **Button** | `@/components/ui/button` | 10+ | Actions |
| **Table** | Custom implementation | 3 | Record lists |
| **Textarea** | `@/components/ui/textarea` | 2 | Notes |
| **Alert** | `@/components/ui/alert` | 1+ | Warnings |

---

## 4. VISUAL ELEMENTS TO MIGRATE

### A. Government Coverage Section

| Element | Legacy Styling | Required for Migration |
|---------|---------------|------------------------|
| **Card** | `rounded-2xl shadow-md` | OrbiPax Card primitive |
| **Header** | `p-6 border-b flex justify-between` | Collapsible header pattern |
| **Icon** | `Wallet h-5 w-5 text-primary` | Lucide icon with blue |
| **Switch** | Default shadcn/ui switch | OrbiPax Switch primitive |
| **Input groups** | `grid-cols-2 gap-6` | Responsive grid layout |
| **Date picker** | Popover with Calendar | CustomCalendar primitive |

### B. Eligibility Records Section

| Element | Legacy Styling | Required for Migration |
|---------|---------------|------------------------|
| **Table** | `border-separate border-spacing-0` | OrbiPax Table primitive |
| **Table header** | `bg-gray-50 font-medium` | Header styling |
| **Table rows** | `hover:bg-gray-50` | Row hover states |
| **Status badge** | Custom colored badges | OrbiPax Badge primitive |
| **Action buttons** | `X icon for delete` | Icon buttons |

### C. Insurance Records Section

| Element | Legacy Styling | Required for Migration |
|---------|---------------|------------------------|
| **Record cards** | Nested cards in table | Card within Card pattern |
| **Add button** | `Plus icon + text` | Button with icon |
| **Form grid** | `grid-cols-3 gap-4` | Form layout |
| **Select** | Radix Select component | OrbiPax Select primitive |
| **Relationships** | Select with options | Dropdown values |

### D. Authorizations Section

| Element | Legacy Styling | Required for Migration |
|---------|---------------|------------------------|
| **Procedure codes** | Input with validation | Validated input |
| **Provider lookup** | Input with search | Search functionality |
| **Units tracking** | Number inputs | Numeric validation |
| **Date ranges** | Start/End date pickers | Date range pattern |
| **Progress indicator** | Units used/remaining | Visual progress |

---

## 5. STATE MANAGEMENT DIFFERENCES

### Legacy State
```typescript
// Uses useIntakeFormStore (Zustand)
const { insuranceInfo, setFormData } = useIntakeFormStore()

// Section expansion managed in store
expandedSections: {
  government: boolean,
  eligibility: boolean,
  insurance: boolean,
  authorizations: boolean
}
```

### Required for Actual
- Separate UI state store (like Step 1)
- Form data management
- Validation schemas
- Section toggle handlers

---

## 6. VISUAL DIFFERENCES EXPECTED

Since Step 2 doesn't exist in Actual yet, these are the expected differences when migrated:

### Typography
| Element | Legacy | Expected Actual | Delta |
|---------|--------|-----------------|-------|
| **Section headers** | `text-xl font-semibold` | Same with tokens | Font family |
| **Labels** | Default Label component | OrbiPax Label | Required indicator |
| **Helper text** | `text-sm text-gray-500` | `text-on-muted` | Color token |

### Spacing
| Element | Legacy | Expected Actual | Delta |
|---------|--------|-----------------|-------|
| **Section gap** | `mb-6` | `space-y-6` | Consistent |
| **Card padding** | `p-6` | Should match | None |
| **Grid gaps** | `gap-4`, `gap-6` | Token-based | Minor |

### Colors
| Element | Legacy | Expected Actual | Delta |
|---------|--------|-----------------|-------|
| **Primary** | `text-primary` (#3B82F6) | OKLCH primary | Token value |
| **Borders** | `border` (gray-200) | `border-border` | Token |
| **Background** | White | `bg-bg` | Token |
| **Muted text** | `text-gray-500` | `text-on-muted` | Token |

### Interactive States
| State | Legacy | Expected Actual | Delta |
|-------|--------|-----------------|-------|
| **Hover** | `hover:bg-gray-50` | Token-based hover | Shade |
| **Focus** | Browser default | `:focus-visible` ring | Major improvement |
| **Disabled** | `opacity-50` | Same | None |
| **Error** | Red borders | `border-destructive` | Token |

---

## 7. COMPONENTS NEEDED FOR MIGRATION

### Required Primitives
1. **Table** - For record display
2. **Switch** - For coverage toggles
3. **Badge** - For status indicators
4. **Alert** - For inline messages
5. **All from Step 1** - Card, Input, Select, etc.

### Custom Components Needed
1. **Record table with add/remove**
2. **Collapsible section wrapper**
3. **Date range picker**
4. **Status badge variants**
5. **Dynamic form arrays**

---

## 8. HARNESS CONTROL VERIFICATION

### Controls Tested
- [x] **Side-by-side view** - Shows Legacy vs Placeholder
- [x] **Overlay mode** - Overlays placeholder on Legacy
- [x] **Hover simulation** - Applies hover styles
- [x] **Focus simulation** - Shows focus rings
- [x] **Disabled simulation** - Opacity and cursor
- [x] **Error simulation** - Red borders and background

### Visual States Documented
- **Default**: Clean card layout
- **Hover**: Subtle background change
- **Focus**: Blue ring with offset
- **Disabled**: 50% opacity
- **Error**: Red indicators

---

## 9. MIGRATION RECOMMENDATIONS

### Priority Order
1. **Create base Step 2 component structure**
2. **Migrate Government Coverage section first** (simplest)
3. **Build reusable record table component**
4. **Implement Eligibility Records section**
5. **Add Insurance Records with dynamic forms**
6. **Complete Authorizations with validation**

### Key Considerations
- Use `Step1SkinScope` pattern for consistency
- Maintain collapsible section behavior
- Preserve table hover states
- Keep dynamic add/remove functionality
- Ensure date picker accessibility

### Estimated Components
```
step2-insurance/
├── components/
│   ├── intake-wizard-step2-insurance.tsx
│   ├── GovernmentCoverageSection.tsx
│   ├── EligibilityRecordsSection.tsx
│   ├── InsuranceRecordsSection.tsx
│   ├── AuthorizationsSection.tsx
│   ├── RecordTable.tsx (shared)
│   └── Step2SkinScope.tsx (for parity)
└── index.ts
```

---

## 10. FILES NOT MODIFIED

### Production Code Untouched
- ✅ No changes to legacy Step 2 components
- ✅ No changes to global styles or tokens
- ✅ No changes to primitive components
- ✅ No creation of actual Step 2 (only placeholder)

### Development Only
- All harness code isolated in `_dev` folder
- Placeholder component for visualization only
- No production imports of harness

---

## CONCLUSION

The Step 2 visual harness successfully provides infrastructure for comparing the Legacy implementation against future migration. While Step 2 doesn't exist in Actual yet, the harness documents:

1. **Complete Legacy structure** - All 4 sections analyzed
2. **Component inventory** - 10+ component types identified
3. **Visual patterns** - Consistent card/section structure
4. **State requirements** - Expansion, forms, and validation
5. **Migration path** - Clear priorities and patterns

The harness is ready to support pixel parity work once Step 2 migration begins. The placeholder clearly indicates the pending work while allowing visual inspection of the Legacy implementation.

**Next Steps:**
1. Implement Step 2 following Step 1 patterns
2. Use harness for pixel parity testing
3. Apply `Step2SkinScope` wrapper for consistency
4. Validate with harness overlay at each section

**Status:** ✅ Harness Ready | ⚠️ Step 2 Migration Pending