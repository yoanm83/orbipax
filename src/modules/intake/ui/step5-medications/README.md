# Step 5: Medications & Pharmacy

**Last Updated:** 2025-09-26
**Version:** 1.0.0
**Status:** Production Ready

## Overview

Step 5 of the OrbiPax intake wizard collects medication and pharmacy information through two main sections with conditional field arrays and full accessibility support.

## Sections

### 1. Current Medications & Allergies
**Component:** `CurrentMedicationsSection.tsx`

#### Functionality
- **Initial Selector:** Yes/No/Unknown status
- **Conditional Display:** When "Yes" is selected:
  - **Medications Array:** Dynamic list with Add/Remove functionality
    - Medication Name* (required, max 200 chars)
    - Dosage* (required, max 100 chars)
    - Frequency* (required, max 100 chars)
    - Route (optional, enum: oral/injection/topical/sublingual/other)
    - Prescribed By (optional, validated with name utility)
    - Start Date (optional, DatePicker)
    - Notes (optional, max 500 chars)
  - **Allergies & Reactions Array:** Dynamic list with Add/Remove functionality
    - Allergen* (required, max 200 chars)
    - Reaction* (required, max 200 chars)
    - Severity (optional, uses shared `SeverityLevel` enum)
    - Onset Date (optional, DatePicker with max=today)
    - Notes (optional, max 500 chars)

### 2. Pharmacy Information
**Component:** `PharmacyInformationSection.tsx`

#### Fields
- **Pharmacy Name*** (required, validated with name utility)
- **Phone Number*** (required, normalized and validated with phone utility)
- **Address** (optional, max 200 chars)

## Architecture Note

This step follows the OrbiPax monolith modular architecture:

```
UI Layer (this directory)
├── Components (React + RHF)
├── No business logic
└── Connected to UI stores

Application Layer
├── Actions (server actions)
└── Service orchestration

Domain Layer (pure)
├── Schemas (Zod validation)
├── Types (TypeScript)
└── Validation helpers
```

### Key Architectural Decisions
- **Domain Purity:** All validation logic in Zod schemas
- **UI Separation:** Components only handle presentation and user interaction
- **No Infrastructure in UI:** No direct API calls or database access
- **Shared Utilities:** Centralized validation for consistency

## Shared Resources

### Validation Utilities
- **Phone:** `@/shared/utils/phone`
  - `normalizePhoneNumber()` - Strips formatting
  - `validatePhoneNumber()` - US format validation
  - `formatPhoneInput()` - Real-time formatting
- **Name:** `@/shared/utils/name`
  - `normalizeName()` - Whitespace normalization
  - `validateName()` - Character validation
  - `NAME_LENGTHS` - Consistent limits

### Shared Enums
- **SeverityLevel:** `@/modules/intake/domain/types/common`
  - Values: MILD, MODERATE, SEVERE, VERY_SEVERE

### Reusable Components
- All primitives from `@/shared/ui/primitives/`
  - Card, Input, Select, DatePicker, Textarea, Button, Label, Alert

## Patterns & Reusability

### Field Array Pattern
Consistent with Insurance and other multi-record sections:
- Dynamic Add/Remove with unique IDs
- Numbered headers (Medication 1, Allergy 1, etc.)
- Separator lines between records
- Remove button only shown for multiple records
- Focus management on new record creation
- Smooth scroll to new records

### Button Patterns
- **Add Button:** Ghost variant with Plus icon, full width, muted background
- **Remove Button:** Ghost variant icon button with Trash2, destructive color
- Consistent with Insurance "Add Another Insurance Record" pattern

### Validation Patterns
- Required field indicators with asterisk
- Inline error messages below fields
- Real-time validation clearing
- Per-field error tracking with unique IDs
- Character limit enforcement with counters

## Accessibility Checklist

### ✅ ARIA Support
- [x] `aria-required="true"` on all required fields
- [x] `aria-invalid` for fields with errors
- [x] `aria-describedby` linking errors to fields
- [x] `aria-label` on icon-only buttons
- [x] `aria-labelledby` for grouped sections
- [x] `aria-expanded` on collapsible sections
- [x] `aria-controls` for toggle controls
- [x] `role="alert"` on error messages
- [x] `role="button"` on clickable headers

### ✅ Keyboard Navigation
- [x] All controls keyboard accessible
- [x] Tab order follows logical flow
- [x] Enter/Space triggers buttons and toggles
- [x] Escape closes dropdowns
- [x] Focus visible rings on all interactive elements

### ✅ Focus Management
- [x] Auto-focus first field of new records
- [x] Focus trapped within modals/dropdowns
- [x] Focus returns appropriately after deletions
- [x] Scroll to view for newly added items

### ✅ Target Sizes
- [x] Minimum 44×44px touch targets
- [x] Adequate spacing between interactive elements
- [x] Button heights meet accessibility standards
- [x] Select triggers properly sized

### ✅ Screen Reader Support
- [x] Semantic HTML structure
- [x] Proper heading hierarchy
- [x] Descriptive labels for all inputs
- [x] Error messages announced
- [x] State changes communicated

## State Management

### UI Store: `currentMedications.ui.slice.ts`
- Manages temporary form state
- Handles field arrays (medications, allergies)
- Tracks validation errors per field
- No PHI persistence

### UI Store: `pharmacyInformation.ui.slice.ts`
- Manages pharmacy fields
- Handles expansion state
- Tracks validation errors
- No PHI persistence

## Validation

### Schema Location
- `@/modules/intake/domain/schemas/step5/currentMedications.schema.ts`
- `@/modules/intake/domain/schemas/step5/pharmacyInformation.schema.ts`

### Validation Rules
All validation centralized in Zod schemas:
- Required field validation
- Character limits with clear messages
- Format validation (phone, names)
- Enum constraints (routes, severity)
- Date constraints (max today for onset)

## Testing Considerations

### Unit Tests
- Schema validation for all field combinations
- Store actions (add, remove, update)
- Payload generation with conditional fields

### Integration Tests
- Conditional rendering based on selection
- Field array operations
- Cross-field validation
- Form submission flow

### A11y Tests
- Keyboard-only operation
- Screen reader navigation
- Focus management verification
- WCAG 2.2 compliance checks

## Security & Compliance

### HIPAA Compliance
- No PHI in console logs
- No PHI in browser storage
- Secure form submission only
- No sensitive data in URLs

### Data Handling
- All data validated before submission
- Normalized formats for consistency
- No client-side data persistence
- Clean payload generation

## Performance

### Optimizations
- Lazy loading of conditional content
- Memoized callbacks for array operations
- Debounced validation on typing
- Efficient re-renders with proper keys

## Known Issues & TODOs

- [ ] Consider adding medication interaction warnings
- [ ] Add autocomplete for common medications
- [ ] Consider allergy severity color coding
- [ ] Add print-friendly medication list view

## Related Documentation

- [Step 4: Medical Providers](../step4-medical-providers/README.md)
- [Step 6: Next steps in intake flow]
- [Shared Utilities Documentation](../../../../shared/utils/README.md)
- [Domain Schema Guidelines](../../../domain/schemas/README.md)

---

**Maintained by:** OrbiPax Development Team
**Questions:** Contact architecture team
**Last Architecture Review:** 2025-09-26