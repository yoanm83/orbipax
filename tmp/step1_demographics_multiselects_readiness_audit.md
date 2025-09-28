# Step1 Demographics: Multi-Select Readiness Audit

**Date**: 2025-09-28
**Task**: Readiness audit for implementing multi-select components
**Type**: AUDIT-ONLY (no code changes)
**Target Fields**: `race` and `preferredCommunicationMethod`
**Scope**: PersonalInfoSection and ContactSection

## Executive Summary

**Readiness Status**: ⚠️ **PARTIAL**
- Domain schema: ✅ READY (arrays with enums defined)
- UI implementation: ⚠️ PLACEHOLDER (single-select workaround)
- Primitives: ❌ MISSING (no multi-select component available)
- A11y patterns: ❌ NOT ESTABLISHED

## 1. Domain Schema Analysis

### Field: `race`
**Location**: `D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\demographics\demographics.schema.ts`
- **Line**: 113
- **Type**: `z.array(z.nativeEnum(Race))`
- **Validation**: `.min(1, 'At least one race selection required')`
- **Required**: Yes
- **Cardinality**: 1 to unlimited

### Field: `preferredCommunicationMethod`
**Location**: `D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\demographics\demographics.schema.ts`
- **Line**: 123-124
- **Type**: `z.array(z.nativeEnum(CommunicationMethod))`
- **Validation**: `.min(1, 'At least one communication method required')`
- **Required**: Yes
- **Cardinality**: 1 to unlimited

### Enum Definitions

#### Race Enum
**Location**: `D:\ORBIPAX-PROJECT\src\modules\intake\domain\types\common.ts`
- **Lines**: 62-70
```typescript
export enum Race {
  AMERICAN_INDIAN_ALASKA_NATIVE = 'american-indian-alaska-native',
  ASIAN = 'asian',
  BLACK_AFRICAN_AMERICAN = 'black-african-american',
  NATIVE_HAWAIIAN_PACIFIC_ISLANDER = 'native-hawaiian-pacific-islander',
  WHITE = 'white',
  OTHER = 'other',
  UNKNOWN = 'unknown'
}
```

#### CommunicationMethod Enum
**Location**: `D:\ORBIPAX-PROJECT\src\modules\intake\domain\types\common.ts`
- **Lines**: 114-121
```typescript
export enum CommunicationMethod {
  PHONE = 'phone',
  EMAIL = 'email',
  TEXT_SMS = 'text-sms',
  MAIL = 'mail',
  SECURE_PORTAL = 'secure-portal',
  IN_PERSON = 'in-person'
}
```

## 2. Current UI Implementation Status

### Field: `race` in PersonalInfoSection
**Location**: `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step1-demographics\components\PersonalInfoSection.tsx`
- **Lines**: 228-257
- **Current**: Single Select with TODO comment
- **Workaround**: `field.onChange([value])` - wraps single value in array
- **Display**: Shows first array item only
- **Comment**: `{/* Field 5: Race - TODO: Make multi-select */}`

### Field: `preferredCommunicationMethod` in ContactSection
**Location**: `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step1-demographics\components\ContactSection.tsx`
- **Lines**: 208-235
- **Current**: Single Select with TODO comment
- **Workaround**: `field.onChange([value])` - wraps single value in array
- **Display**: Shows first array item only
- **Comment**: `{/* Contact Preference - TODO: Make multi-select */}`

## 3. UI↔Schema Alignment Matrix

| Field | Schema Type | Schema Values | UI Type | UI Values | Alignment Status |
|-------|------------|---------------|---------|-----------|------------------|
| **race** | `Race[]` | 7 enum values (kebab-case) | Single Select | 7 options (kebab-case) | ✅ Values match<br>❌ Single vs Multi |
| **preferredCommunicationMethod** | `CommunicationMethod[]` | 6 enum values (kebab-case) | Single Select | 5 options (UPPERCASE) | ❌ Values mismatch<br>❌ Single vs Multi |

### Detailed Gaps

#### Race Field
- **Type Gap**: Schema expects array, UI provides single value wrapped in array
- **UX Gap**: Users can only select one race (violates USCDI v4 requirements)
- **Values**: ✅ All 7 enum values present and correctly formatted

#### PreferredCommunicationMethod Field
- **Type Gap**: Schema expects array, UI provides single value wrapped in array
- **UX Gap**: Users can only select one method
- **Value Gaps**:
  - UI has "PHONE" → should be "phone"
  - UI has "EMAIL" → should be "email"
  - UI has "TEXT" → should be "text-sms"
  - UI has "MAIL" → should be "mail"
  - UI has "IN_PERSON" → should be "in-person"
  - UI missing: "secure-portal"

## 4. Primitives Inventory

### Available Components

| Component | Location | Multi-Select Support | A11y Features |
|-----------|----------|---------------------|---------------|
| **Combobox** | `@/shared/ui/primitives/Combobox` | ❌ Single only | aria-label, aria-describedby |
| **Checkbox** | `@/shared/ui/primitives/Checkbox` | ❌ Individual only | Radix-based, 44px touch target |
| **Select** | `@/shared/ui/primitives/Select` | ❌ Single only | Native select A11y |

### Missing Components
- ❌ MultiSelect
- ❌ CheckboxGroup
- ❌ Chips/Tags
- ❌ ListBox with multi-selection

### Combobox Analysis
**File**: `D:\ORBIPAX-PROJECT\src\shared\ui\primitives\Combobox\index.tsx`
- Single selection only (`value?: T | null`)
- No multiple prop or array handling
- Good A11y base (aria-label, aria-describedby)
- Could be extended for multi-select

## 5. A11y Requirements for Multi-Select

### WCAG 2.2 AA Requirements
1. **Role**: `listbox` with `aria-multiselectable="true"`
2. **Selection State**: `aria-selected` on each option
3. **Live Region**: Announce selection changes
4. **Keyboard Navigation**:
   - Space/Enter to toggle selection
   - Ctrl+A to select all (optional)
   - Arrow keys for navigation
5. **Focus Management**: Maintain focus during selection
6. **Labels**: Clear indication of multi-select capability
7. **Instructions**: "Select all that apply" helper text

### Current A11y Gaps
- No multi-select ARIA patterns established
- No live region announcements
- No keyboard shortcuts for multiple selection
- No selected items summary/chips display

## 6. Implementation Patterns Analysis

### Option 1: Checkbox Group Pattern
```typescript
// Pseudo-implementation using existing Checkbox primitive
<div role="group" aria-labelledby="race-label">
  <span id="race-label">Race (select all that apply)</span>
  {raceOptions.map(option => (
    <label key={option.value}>
      <Checkbox
        checked={field.value?.includes(option.value)}
        onCheckedChange={(checked) => {
          const newValue = checked
            ? [...(field.value || []), option.value]
            : field.value?.filter(v => v !== option.value) || []
          field.onChange(newValue)
        }}
      />
      {option.label}
    </label>
  ))}
</div>
```

### Option 2: Custom MultiSelect Component
Would need to create in: `D:\ORBIPAX-PROJECT\src\modules\intake\ui\step1-demographics\components\MultiSelect.tsx`

## 7. Prioritized Gaps

### Critical Gaps (P0)
1. **No multi-select primitive** - Blocks implementation
2. **Value format mismatch** - CommunicationMethod uses wrong case
3. **Missing enum value** - secure-portal not in UI

### Important Gaps (P1)
1. **No A11y pattern** - Need to establish multi-select A11y
2. **No visual feedback** - Need chips/tags for selections
3. **No keyboard navigation** - Multi-select keyboard shortcuts

### Nice-to-Have (P2)
1. **Select all/none** - Bulk selection actions
2. **Search/filter** - For long lists (Race has 7 options)
3. **Validation messages** - Specific multi-select errors

## 8. Recommended Micro-Task (Apply)

### Task: Implement CheckboxGroup Component for Multi-Select

**Objective**: Create a reusable CheckboxGroup component using existing Checkbox primitive, then apply to both race and preferredCommunicationMethod fields.

**Scope**:
1. Create `CheckboxGroup.tsx` in step1-demographics folder
2. Implement with full A11y support
3. Replace single selects in PersonalInfoSection and ContactSection
4. Fix value mismatches in preferredCommunicationMethod

**Implementation Path**:
```
D:\ORBIPAX-PROJECT\src\modules\intake\ui\step1-demographics\components\
  ├── CheckboxGroup.tsx (NEW - create here, not in primitives)
  ├── PersonalInfoSection.tsx (EDIT - use CheckboxGroup for race)
  └── ContactSection.tsx (EDIT - use CheckboxGroup for preferredCommunicationMethod)
```

**CheckboxGroup Requirements**:
- Accept `value: string[]` and `onChange: (value: string[]) => void`
- Render using existing Checkbox primitive
- Include `role="group"` and `aria-labelledby`
- Support FormField integration
- Handle min(1) validation visually
- Show "Select all that apply" helper text

**Value Corrections Needed**:
```typescript
// ContactSection - Fix preferredCommunicationMethod values
const COMMUNICATION_OPTIONS = [
  { value: 'phone', label: 'Phone' },           // was 'PHONE'
  { value: 'email', label: 'Email' },           // was 'EMAIL'
  { value: 'text-sms', label: 'Text/SMS' },     // was 'TEXT'
  { value: 'mail', label: 'Mail' },             // was 'MAIL'
  { value: 'secure-portal', label: 'Portal' },  // MISSING - add
  { value: 'in-person', label: 'In Person' }    // was 'IN_PERSON'
]
```

## 9. Alternative Approach

If CheckboxGroup is too complex for immediate implementation, consider:
1. **Temporary**: Keep single select but fix value mismatches
2. **Document**: Add user-facing note about limitation
3. **Track**: Create tech debt ticket for proper multi-select

## Validation Checklist

✅ **Reviewed Paths**:
- Domain schemas: demographics.schema.ts
- Domain types: common.ts
- UI components: PersonalInfoSection.tsx, ContactSection.tsx
- Primitives: Combobox, Checkbox, Select

✅ **Architectural Compliance**:
- UI imports from Domain ✅
- No schema definition in UI ✅
- No PHI/fetch in components ✅
- Component location in step folder proposed ✅

✅ **No Code Changes**: This audit made no modifications

---

**Status**: Audit Complete
**Readiness**: Partial - Requires new component
**Recommended Action**: Implement CheckboxGroup in step folder
**Effort Estimate**: 4-6 hours for both fields with full A11y