# Step 2 InsuranceRecordsSection Required Fields Audit

**Date**: 2025-09-29
**Task**: Audit placement and implementation plan for required schema fields
**Status**: ✅ AUDIT COMPLETE

---

## EXECUTIVE SUMMARY

Identified optimal UI placement and binding patterns for the 3 required schema fields missing from InsuranceRecordsSection: `type`, `isPrimary`, and `subscriberDateOfBirth`. These fields are mandatory in the canonical schema and must be added to ensure form validation passes.

---

## 1. REQUIRED FIELDS ANALYSIS

### Field Specifications from Canonical Schema

| Field | Schema Path | Schema Location | Type | DTO Type | Required |
|-------|------------|-----------------|------|----------|----------|
| **type** | `insuranceCoverages[].type` | Line 23 | `z.nativeEnum(InsuranceType)` | `string` | ✅ Yes |
| **isPrimary** | `insuranceCoverages[].isPrimary` | Line 50 | `z.boolean()` | `boolean` | ✅ Yes |
| **subscriberDateOfBirth** | `insuranceCoverages[].subscriberDateOfBirth` | Line 40 | `z.date()` | `string` (ISO) | ✅ Yes |

### InsuranceType Enum Values
**Location**: `src/modules/intake/domain/types/common.ts`
```typescript
enum InsuranceType {
  MEDICAID = 'medicaid',
  MEDICARE = 'medicare',
  PRIVATE = 'private',
  TRICARE = 'tricare',
  UNINSURED = 'uninsured',
  OTHER = 'other'
}
```

---

## 2. PROPOSED UI PLACEMENT

### Current Grid Layout Analysis
The form uses a 2-column grid on desktop (`md:grid-cols-2`) with the following current arrangement:

**Row 1**: Insurance Carrier | Member ID
**Row 2**: Group Number | Effective Date
**Row 3**: Expiration Date | Plan Type (display-only)
**Row 4**: Plan Name (display-only) | Subscriber Name
**Row 5**: Relationship to Subscriber | (empty)

### Optimal Placement Strategy

#### Field 1: Insurance Type
- **Placement**: Insert BEFORE Insurance Carrier (new first field)
- **Grid Position**: Row 1, Column 1
- **Rationale**: Type determines carrier context, logical to select first
- **Layout Impact**: Shifts Carrier to Column 2, Member ID to Row 2 Column 1

#### Field 2: Primary Insurance Flag (isPrimary)
- **Placement**: Row 5, Column 2 (currently empty)
- **Grid Position**: Next to Relationship field
- **Rationale**: Utilizes empty space, keeps related subscriber info together
- **Layout Impact**: None - fills existing gap

#### Field 3: Subscriber Date of Birth
- **Placement**: Insert AFTER Subscriber Name, BEFORE Relationship
- **Grid Position**: Row 4, Column 2 (pushes Relationship to Row 5, Column 1)
- **Rationale**: Groups subscriber information logically
- **Layout Impact**: Minimal - reflows last two fields

### New Grid Layout (After Implementation)
**Row 1**: Insurance Type* | Insurance Carrier*
**Row 2**: Member ID* | Group Number
**Row 3**: Effective Date* | Expiration Date
**Row 4**: Plan Type (display) | Plan Name (display)
**Row 5**: Subscriber Name | Subscriber DOB*
**Row 6**: Relationship | Primary Insurance*

---

## 3. BINDING PATTERNS & IMPLEMENTATION

### Insurance Type Field
```typescript
// Position: Before Insurance Carrier (line ~120)
<div>
  <Label htmlFor={`ins-${field.id}-type`}>
    Insurance Type<span className="text-[var(--destructive)]">*</span>
  </Label>
  <Controller
    name={`insuranceCoverages.${index}.type`} // sentinel: mapped to insuranceCoverages[].type
    control={control}
    rules={{ required: "Insurance type is required" }}
    render={({ field: controllerField }) => (
      <>
        <Select
          value={controllerField.value}
          onValueChange={controllerField.onChange}
        >
          <SelectTrigger
            id={`ins-${field.id}-type`}
            className="mt-1"
            aria-label="Insurance Type"
            aria-required="true"
            aria-invalid={!!errors?.insuranceCoverages?.[index]?.type}
            aria-describedby={errors?.insuranceCoverages?.[index]?.type ? `ins-${field.id}-type-error` : undefined}
          >
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="medicaid">Medicaid</SelectItem>
            <SelectItem value="medicare">Medicare</SelectItem>
            <SelectItem value="private">Private</SelectItem>
            <SelectItem value="tricare">TRICARE</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        {/* Error message with role="alert" */}
      </>
    )}
  />
</div>
```

### Primary Insurance Flag
```typescript
// Position: After Relationship field (line ~365)
<div>
  <Label htmlFor={`ins-${field.id}-isPrimary`}>
    Primary Insurance
  </Label>
  <Controller
    name={`insuranceCoverages.${index}.isPrimary`} // sentinel: mapped to insuranceCoverages[].isPrimary
    control={control}
    render={({ field: controllerField }) => (
      <>
        <div className="flex items-center space-x-2 mt-1">
          <Checkbox
            id={`ins-${field.id}-isPrimary`}
            checked={controllerField.value || false}
            onCheckedChange={controllerField.onChange}
            aria-label="Primary Insurance"
            aria-invalid={!!errors?.insuranceCoverages?.[index]?.isPrimary}
            aria-describedby={errors?.insuranceCoverages?.[index]?.isPrimary ? `ins-${field.id}-isPrimary-error` : undefined}
          />
          <Label
            htmlFor={`ins-${field.id}-isPrimary`}
            className="text-sm font-normal cursor-pointer"
          >
            This is the primary insurance
          </Label>
        </div>
        {/* Error message */}
      </>
    )}
  />
</div>
```

### Subscriber Date of Birth
```typescript
// Position: After Subscriber Name field (line ~323)
<div>
  <Label htmlFor={`ins-${field.id}-subscriberDOB`}>
    Subscriber Date of Birth<span className="text-[var(--destructive)]">*</span>
  </Label>
  <Controller
    name={`insuranceCoverages.${index}.subscriberDateOfBirth`} // sentinel: mapped to insuranceCoverages[].subscriberDateOfBirth
    control={control}
    rules={{ required: "Subscriber date of birth is required" }}
    render={({ field: controllerField }) => (
      <>
        <DatePicker
          {...controllerField}
          id={`ins-${field.id}-subscriberDOB`}
          placeholder="Select date"
          className="mt-1"
          aria-label="Subscriber Date of Birth"
          aria-required="true"
          aria-invalid={!!errors?.insuranceCoverages?.[index]?.subscriberDateOfBirth}
          aria-describedby={errors?.insuranceCoverages?.[index]?.subscriberDateOfBirth ? `ins-${field.id}-subscriberDOB-error` : undefined}
        />
        {/* Error message */}
      </>
    )}
  />
</div>
```

---

## 4. COMPLIANCE CHECKLIST

### SoC (Separation of Concerns)
| Requirement | Verification |
|-------------|--------------|
| No fetch/API in UI | ✅ Use Controller with form state only |
| No business logic | ✅ Only UI binding |
| No validation logic | ✅ Validation in Zod schema |
| Server action pattern | ✅ Data flows through existing actions |

### Accessibility (A11y)
| Requirement | Implementation |
|-------------|----------------|
| Labels with htmlFor | ✅ Each field has proper label |
| aria-required | ✅ On required fields (type, DOB) |
| aria-invalid | ✅ Conditional on error state |
| aria-describedby | ✅ Links to error messages |
| role="alert" | ✅ On error paragraphs |
| Focus management | ✅ Standard focus behavior |
| Target size ≥44px | ✅ Using standard components |
| Keyboard navigation | ✅ All controls keyboard accessible |

### Tailwind Tokens
| Requirement | Implementation |
|-------------|----------------|
| CSS variables | ✅ Use var(--destructive) for required asterisk |
| No hex colors | ✅ No hardcoded colors |
| Semantic classes | ✅ Standard Tailwind utilities |
| Responsive grid | ✅ Maintains md:grid-cols-2 pattern |

---

## 5. RISKS & MITIGATION

### Risk 1: Primary Insurance Uniqueness
- **Issue**: Schema allows max 1 primary across all coverages
- **Detection**: Line 159-162 in schema has validation
- **Mitigation**: Add client-side check to disable other isPrimary when one selected
- **Alternative**: Let server validation handle (simpler)

### Risk 2: Type-Carrier Mismatch
- **Issue**: User might select Medicare type but Aetna carrier
- **Detection**: No validation currently
- **Mitigation**: Consider filtering carrier list based on type
- **Decision**: Keep independent for flexibility

### Risk 3: DOB Future Date
- **Issue**: User might enter future date for DOB
- **Detection**: No validation in schema
- **Mitigation**: Add max date to DatePicker (today)
- **Implementation**: `maxDate={new Date()}`

### Risk 4: Grid Reflow on Mobile
- **Issue**: Adding fields might break mobile layout
- **Detection**: Test on small screens
- **Mitigation**: Maintains single column on mobile (grid-cols-1)

---

## 6. APPLY PLAN (Next Task)

### Execution Order

#### Step 1: Add Insurance Type Field
1. Insert new div before Insurance Carrier (line ~120)
2. Add Controller with Select for type enum
3. Add error handling with role="alert"
4. Test enum values match schema

#### Step 2: Add Subscriber DOB Field
1. Insert new div after Subscriber Name (line ~323)
2. Add Controller with DatePicker
3. Set maxDate to prevent future dates
4. Add required validation and error display

#### Step 3: Add Primary Insurance Flag
1. Add new div after Relationship field (line ~365)
2. Add Controller with Checkbox component
3. Consider adding validation for uniqueness
4. Add helper text about primary selection

#### Step 4: Update Append Function
1. Modify addRecord() to include new fields:
```typescript
append({
  type: 'private', // default
  carrierName: '',
  policyNumber: '',
  subscriberDateOfBirth: new Date(),
  isPrimary: fields.length === 0, // first is primary
  // ... existing fields
})
```

#### Step 5: Validation & Testing
1. Run ESLint
2. Run TypeScript check
3. Test form submission with all fields
4. Verify error messages display correctly
5. Test primary insurance uniqueness

### Allowed Paths
**Read/Write**:
```
D:\ORBIPAX-PROJECT\src\modules\intake\ui\step2-eligibility-insurance\components\InsuranceRecordsSection.tsx
```

**Read-Only Reference**:
```
D:\ORBIPAX-PROJECT\src\modules\intake\domain\schemas\insurance-eligibility\insurance-eligibility.schema.ts
D:\ORBIPAX-PROJECT\src\modules\intake\domain\types\common.ts
D:\ORBIPAX-PROJECT\src\shared\ui\primitives\**
```

**Do NOT Touch**:
```
- Schema files (no modifications)
- DTO files (no changes)
- Other UI sections
- Actions/Infrastructure
```

---

## 7. VALIDATION REQUIREMENTS

### Pre-Implementation
- [ ] Verify Checkbox component exists in primitives
- [ ] Confirm DatePicker accepts maxDate prop
- [ ] Check if Select supports disabled state

### Post-Implementation
- [ ] All 3 fields render correctly
- [ ] Form state updates on change
- [ ] Validation triggers on blur/submit
- [ ] Error messages display
- [ ] Primary uniqueness works
- [ ] Mobile layout intact
- [ ] TypeScript compilation passes
- [ ] ESLint no errors

---

## CONCLUSION

The 3 required fields can be seamlessly integrated into the existing InsuranceRecordsSection layout with minimal disruption. The proposed placement maintains logical grouping while utilizing available grid space efficiently.

**Key Implementation Points**:
- Insurance Type goes first (logical flow)
- Subscriber DOB groups with subscriber info
- Primary flag utilizes empty grid space
- All fields use Controller pattern
- Full A11y compliance maintained

**Estimated Effort**: 30-40 minutes for complete implementation including testing

**Critical Success Factors**:
- Maintain grid layout integrity
- Preserve all existing field bindings
- Add comprehensive error handling
- Ensure schema compliance