# Step 2 Insurance UI Actions Wiring Report
## UI Integration with Server Actions (Load/Save)

**Date**: 2025-09-28
**Module**: `src/modules/intake/ui/step2-insurance`
**Status**: ✅ Complete
**Architecture**: UI → Server Actions with RHF + Zod

---

## Executive Summary

Successfully wired Step 2 Insurance UI with server actions:
- Pre-load data with `loadInsuranceAction()` on mount
- Submit data with `saveInsuranceAction()` on form submit
- Full RHF + Zod validation with Domain schema
- Accessible error handling with role="alert" and aria-* attributes
- No console.log, no toasts, strict SoC maintained

## Files Created/Modified

### Created
1. `src/modules/intake/ui/step2-insurance/intake-wizard-step2-insurance.tsx` (406 lines)
   - Complete insurance form with RHF integration
   - Server action wiring for load/save
   - Dynamic insurance records management
   - Full accessibility attributes

### Existing (Reused)
2. `src/modules/intake/ui/step2-eligibility-insurance/` (existing structure preserved)
   - Original components remain for reference
   - New form created separately to avoid breaking existing code

## Implementation Details

### Pre-load Handler (useEffect)
```typescript
useEffect(() => {
  async function loadData() {
    setIsLoading(true)
    setLoadError(null)

    try {
      const result = await loadInsuranceAction()

      if (result.ok && result.data) {
        // Reset form with loaded data
        form.reset({
          insuranceRecords: result.data.data.insuranceRecords || [],
          governmentCoverage: result.data.data.governmentCoverage
        })
      } else if (!result.ok) {
        setLoadError(result.error?.message || 'Failed to load insurance data')
      }
    }
  }

  loadData()
}, [form])
```

### Submit Handler
```typescript
const onSubmit = async (values: InsuranceDataPartial) => {
  setIsSaving(true)
  setSaveError(null)

  try {
    const result = await saveInsuranceAction(values)

    if (result.ok) {
      nextStep() // Advance wizard
    } else {
      setSaveError(result.error?.message || 'Failed to save insurance data')
      // Focus error for accessibility
      const errorElement = document.getElementById('save-error')
      errorElement?.focus()
    }
  }
}
```

## Import Structure

### Final Imports
```typescript
// Domain schema for validation
import { insuranceDataPartialSchema, type InsuranceDataPartial } from '@/modules/intake/domain'

// Server actions
import { loadInsuranceAction, saveInsuranceAction } from '@/modules/intake/actions/step2'

// UI primitives (reused from Step 1)
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/primitives/Form'
import { Input } from '@/shared/ui/primitives/Input'
import { Button } from '@/shared/ui/primitives/Button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/primitives/Select'

// Wizard state
import { useWizardProgressStore } from '@/modules/intake/state'
```

## RHF + Zod Integration

### Form Setup
```typescript
const form = useForm<InsuranceDataPartial>({
  resolver: zodResolver(insuranceDataPartialSchema),
  defaultValues: {
    insuranceRecords: [],
    governmentCoverage: undefined
  }
})
```

### Domain Schema Usage
- Using `insuranceDataPartialSchema` from Domain layer
- No validation logic in UI layer
- Zod handles all field validation

## Accessibility Implementation

### Error Alerts
```typescript
// Load error
<div
  role="alert"
  aria-live="polite"
  className="..."
>
  <AlertCircle />
  <span>{loadError}</span>
</div>

// Field errors
<FormMessage role="alert" />
```

### Form Controls
```typescript
// Invalid state
<Input
  aria-invalid={!!form.formState.errors.field}
  aria-label="Field Label"
  aria-required="true"
/>

// Error association
<FormControl>
  <Input aria-describedby={fieldErrorId} />
</FormControl>
<FormMessage id={fieldErrorId} role="alert" />
```

### Focus Management
```typescript
// Focus error on save failure
if (!result.ok) {
  setSaveError(error.message)
  const errorElement = document.getElementById('save-error')
  errorElement?.focus()
}
```

## Error Handling Flow

### Load Errors
1. Server action returns `{ ok: false, error }`
2. Set error state with generic message
3. Display in accessible alert div
4. User can retry or continue with empty form

### Save Errors
1. Server action returns `{ ok: false, error }`
2. Set error state with generic message
3. Display in alert with focus management
4. Form remains editable for corrections

### Field Validation
1. Zod validates on submit/blur
2. RHF displays field-level errors
3. Each error has role="alert" and aria-describedby

## Dynamic Records Management

### Add Insurance Record
```typescript
const addInsuranceRecord = () => {
  const currentRecords = form.getValues('insuranceRecords') || []
  form.setValue('insuranceRecords', [
    ...currentRecords,
    { carrier: '', memberId: '', ... }
  ])
}
```

### Remove Insurance Record
```typescript
const removeInsuranceRecord = (index: number) => {
  const currentRecords = form.getValues('insuranceRecords') || []
  form.setValue('insuranceRecords',
    currentRecords.filter((_, i) => i !== index)
  )
}
```

## SoC Compliance

### ✅ UI Layer Only
- No business logic
- No direct API calls
- No validation logic (uses Domain schema)
- Delegates to server actions

### ✅ No Side Effects
- No console.log statements
- No toast notifications
- No external state mutations
- Pure UI rendering

### ✅ Proper Imports
- Actions from actions layer
- Schema from domain layer
- UI primitives from shared
- No Infrastructure imports

## Validation Results

### TypeScript
- Import paths validated
- Types properly inferred from Domain
- Server action types respected

### Accessibility
- All form controls have labels
- Error messages have role="alert"
- Invalid states properly marked
- Focus management implemented

### UI/UX
- Loading state while fetching data
- Saving state during submission
- Clear error messages
- Semantic HTML structure

## UI Features

### Government Coverage Section
- Medicaid/Medicare toggles
- ID fields for each program
- Optional fields properly handled

### Insurance Records Section
- Dynamic add/remove records
- Required fields marked with *
- Select dropdowns for enums
- Field-level validation

### Form Actions
- Back button (navigation)
- Save Draft (save only)
- Save & Continue (save + navigate)
- Disabled states during operations

## Next Micro-task Suggestions

### Option 1: Integration Tests
Test the full flow from UI to Infrastructure:
```typescript
describe('Step 2 Insurance', () => {
  it('loads existing data on mount')
  it('saves form data on submit')
  it('handles load errors gracefully')
  it('validates required fields')
})
```

### Option 2: Step 3 Domain Base
Begin Step 3 (Diagnoses):
- Create diagnosis schema in Domain
- Define types and enums
- Prepare for Application layer

### Option 3: Wizard Integration
Wire up the wizard navigation:
- Connect all steps to main wizard
- Handle step transitions
- Persist wizard state

## Tailwind Semantic Tokens

All colors use CSS variables:
- `var(--foreground)` - Text color
- `var(--muted-foreground)` - Secondary text
- `var(--destructive)` - Error states
- `var(--primary)` - Primary actions
- `var(--border)` - Border colors
- `var(--background)` - Background
- `var(--accent)` - Hover states

## Pseudo-diff: Handler Changes

### Before (Placeholder)
```typescript
// No server action calls
const [data, setData] = useState({})

// Local state only
const handleSubmit = (values) => {
  setData(values)
  nextStep()
}
```

### After (Wired)
```typescript
// Pre-load with server action
useEffect(() => {
  async function loadData() {
    const result = await loadInsuranceAction()
    if (result.ok) {
      form.reset(result.data.data)
    }
  }
  loadData()
}, [])

// Submit with server action
const onSubmit = async (values) => {
  const result = await saveInsuranceAction(values)
  if (result.ok) {
    nextStep()
  } else {
    setSaveError(result.error?.message)
  }
}
```

## Conclusion

Step 2 Insurance UI successfully wired with server actions:
- ✅ loadInsuranceAction for pre-load with form.reset()
- ✅ saveInsuranceAction for submit with error handling
- ✅ RHF + zodResolver with Domain schema
- ✅ Accessible error handling (role="alert", aria-*)
- ✅ No toasts, no console.log
- ✅ Semantic Tailwind tokens
- ✅ SoC maintained throughout
- ✅ Focus management on errors

The UI is now fully connected to the backend through server actions with proper error handling and accessibility.

---

**Implementation by**: Claude Assistant
**Pattern**: UI → Server Actions → Application → Infrastructure
**Next**: Integration Tests or Step 3 Domain