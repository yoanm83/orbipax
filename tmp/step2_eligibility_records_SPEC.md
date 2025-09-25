# SPECIFICATION: EligibilityRecordsSection for Step 2

**Document Type:** Implementation Specification (NO CODE)
**Date:** 2025-09-24
**Target Component:** EligibilityRecordsSection.tsx
**Pattern Source:** Step 1 Demographics (READ-ONLY REFERENCE)
**Status:** READY FOR IMPLEMENTATION

---

## 1. FILE STRUCTURE

### Component Location:
```
D:\ORBIPAX-PROJECT\src\modules\intake\ui\step2-eligibility-insurance\
└── components\
    └── EligibilityRecordsSection.tsx  [NEW FILE TO CREATE]
```

### Integration Point:
```
D:\ORBIPAX-PROJECT\src\modules\intake\ui\step2-eligibility-insurance\
└── Step2EligibilityInsurance.tsx  [MOUNT AS SECOND SECTION]
```

### Import Statement Required:
```
import { EligibilityRecordsSection } from './components/EligibilityRecordsSection'
```

---

## 2. CANONICAL PATTERN FROM STEP 1

### Card Container (From PersonalInfoSection.tsx Line 103):
```
CLASS: w-full rounded-3xl shadow-md mb-6
```

### Collapsible Header Pattern (Lines 104-124):
```
STRUCTURE:
<div> [Header Container]
  - id="header-eligibility"  [UNIQUE ID FOR STEP 2]
  - className="py-3 px-6 flex justify-between items-center cursor-pointer min-h-[44px]"
  - onClick={onSectionToggle}
  - onKeyDown handler for Enter/Space keys
  - role="button"
  - tabIndex={0}
  - aria-expanded={isExpanded}
  - aria-controls="panel-eligibility"  [MATCHES PANEL ID]

  <div> [Left Side: Icon + Title]
    - className="flex items-center gap-2"
    <Icon> - className="h-5 w-5 text-[var(--primary)]"
    <h2> - className="text-lg font-medium text-[var(--foreground)]"

  [Right Side: Chevron]
  {isExpanded ? <ChevronUp /> : <ChevronDown />}
  - className="h-5 w-5"
</div>
```

### Panel Container (Line 127):
```
<div> [Panel]
  - id="panel-eligibility"  [MATCHES aria-controls]
  - aria-labelledby="header-eligibility"  [MATCHES HEADER ID]
  - className="p-6"
```

### Grid Layout (Line 164):
```
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  [FIELDS GO HERE]
</div>
```

### Field Container Pattern (Lines 166-176):
```
<div>  [No additional classes]
  <Label htmlFor="[field-id]">[Label Text]</Label>
  <Input/Select/DatePicker
    id="[field-id]"
    placeholder="[placeholder text]"
    className="mt-1"
    [additional props]
  />
</div>
```

---

## 3. FIELD SPECIFICATIONS

### Field 1: Eligibility Date
```
POSITION: Grid Row 1, Column 1
LABEL: "Eligibility Date"
ID: "eligibility-date"
TYPE: DatePicker component (same as Step 1)
PLACEHOLDER: "Select date"
REQUIRED: false
ARIA: aria-label="Eligibility Date"
FALLBACK: If DatePicker unavailable, use <input type="date">
```

### Field 2: Program Type
```
POSITION: Grid Row 1, Column 2
LABEL: "Program Type"
ID: "eligibility-program-type"
TYPE: Select component (from primitives)
PLACEHOLDER: "Select program type"
REQUIRED: false
ARIA: aria-label="Program Type"
OPTIONS:
  - value="medicaid", label="Medicaid"
  - value="medicare", label="Medicare"
  - value="private", label="Private Insurance"
  - value="other", label="Other"
FALLBACK: If Select unavailable, use native <select>
```

---

## 4. TOKEN MAPPING (EXACT FROM STEP 1)

### Container Tokens:
| Element | Token | CSS Variable |
|---------|-------|--------------|
| Card background | Card primitive | Inherits from Card |
| Border | border | var(--border) |
| Shadow | shadow-md | Tailwind utility |

### Text Tokens:
| Element | Token | CSS Variable |
|---------|-------|--------------|
| Section title | foreground | var(--foreground) |
| Labels | Inherits from Label | Label component |
| Placeholder text | muted-foreground | Handled by Input/Select |

### Interactive Tokens:
| Element | Token | CSS Variable |
|---------|-------|--------------|
| Icon color | primary | var(--primary) |
| Focus ring | ring | var(--ring) |
| Input background | background | var(--background) |
| Input border | border | var(--border) |
| Select background | background | var(--background) |
| Select border | border | var(--border) |

### State Tokens:
| State | Token | Application |
|-------|-------|-------------|
| Hover | hover states | Handled by primitives |
| Focus | focus-visible:ring-2 | Applied via Tailwind |
| Disabled | opacity-50 | If needed |

---

## 5. SPACING & SIZING (EXACT FROM STEP 1)

### Container Spacing:
```
- Card: mb-6 (margin bottom)
- Header: py-3 px-6 (padding)
- Panel: p-6 (padding)
- Grid: gap-4 (gap between fields)
```

### Touch Targets:
```
- Header: min-h-[44px]
- Inputs: Inherit min-h from Input primitive (≥44px)
- Select: Inherit min-h from Select primitive (≥44px)
- All interactive elements: ≥44×44px
```

### Field Spacing:
```
- Label to Input/Select: mt-1
- Between fields: gap-4 (grid gap)
```

---

## 6. ACCESSIBILITY REQUIREMENTS

### Keyboard Navigation:
```
HEADER:
- Tab: Focus header
- Enter: Toggle expand/collapse
- Space: Toggle expand/collapse
- Escape: No action (preserve default)

FIELDS:
- Tab: Navigate through fields in order
- Shift+Tab: Navigate backward
- Select: Arrow keys for option navigation
```

### ARIA Attributes:
```
HEADER:
- role="button"
- tabIndex={0}
- aria-expanded={true|false}
- aria-controls="panel-eligibility"

PANEL:
- id="panel-eligibility"
- aria-labelledby="header-eligibility"

FIELDS:
- Label htmlFor matches Input/Select id
- aria-label on inputs (redundant but safer)
- Select: aria-label="Program Type"
```

### Focus Management:
```
- Visible focus ring via focus-visible:ring-2
- Focus ring color: var(--ring)
- Focus preserved during expand/collapse
- No focus trapping
```

---

## 7. ICON SELECTION

Based on legacy reference (Line 38):
```
ICON: FileCheck (from lucide-react)
IMPORT: import { FileCheck, ChevronUp, ChevronDown } from 'lucide-react'
SIZE: h-5 w-5
COLOR: text-[var(--primary)]
```

---

## 8. PRIMITIVES TO USE (SAME AS STEP 1)

### Required Imports:
```
FROM @/shared/ui/primitives/Card:
- Card
- CardBody

FROM @/shared/ui/primitives/DatePicker:
- DatePicker (IF AVAILABLE)

FROM @/shared/ui/primitives/Select:
- Select (IF AVAILABLE)
- SelectContent
- SelectItem
- SelectTrigger
- SelectValue

FROM @/shared/ui/primitives/label:
- Label

FROM lucide-react:
- FileCheck, ChevronUp, ChevronDown
```

### DO NOT CREATE:
- No new primitive components
- No custom styled wrappers
- No inline style objects
- No CSS modules

---

## 9. PROPS INTERFACE

### Required Props:
```
interface EligibilityRecordsSectionProps {
  onSectionToggle: () => void
  isExpanded: boolean
}
```

### NO STATE MANAGEMENT:
- No local useState
- No form validation
- No data fetching
- No business logic
- No console.log statements

---

## 10. RESPONSIVE BEHAVIOR

### Mobile (Default):
```
- Single column stack
- Full width fields
- Touch targets ≥44px
```

### Desktop (md: breakpoint):
```
- 2-column grid
- Equal width columns
- Same touch targets
```

### Container Queries:
```
- Use @container if parent uses it
- Otherwise use standard md: breakpoint
```

---

## 11. ACCEPTANCE CRITERIA CHECKLIST

### Structure:
- [ ] File created at correct path
- [ ] Imported in Step2EligibilityInsurance.tsx
- [ ] Rendered as SECOND section

### Visual:
- [ ] Card with rounded-3xl corners
- [ ] Shadow-md applied
- [ ] 2-column grid on desktop
- [ ] Single column on mobile
- [ ] FileCheck icon visible
- [ ] Chevron toggles correctly

### Functionality:
- [ ] Header toggles on click
- [ ] Header toggles on Enter/Space
- [ ] Panel shows/hides correctly
- [ ] Date picker renders
- [ ] Select dropdown works
- [ ] All options display

### Accessibility:
- [ ] All ARIA attributes present
- [ ] Keyboard navigation works
- [ ] Focus rings visible
- [ ] Labels linked to inputs
- [ ] Touch targets ≥44px

### Code Quality:
- [ ] Zero console.log
- [ ] Zero inline styles
- [ ] Zero hex colors
- [ ] All tokens used
- [ ] No business logic
- [ ] No state management

### Pipeline:
- [ ] TypeScript: No errors
- [ ] ESLint: Expected warnings only (primitives)
- [ ] Build: Compiles successfully
- [ ] Render: No runtime errors

---

## 12. IMPLEMENTATION SEQUENCE

1. Create component file with imports
2. Add props interface
3. Create Card container
4. Implement collapsible header (exact pattern)
5. Add panel with grid
6. Add Eligibility Date field
7. Add Program Type select
8. Import in Step2EligibilityInsurance
9. Test collapsible behavior
10. Run pipeline validation

---

## 13. KNOWN GAPS TO DOCUMENT

### DatePicker Availability:
```
IF @/shared/ui/primitives/DatePicker EXISTS:
  - Use DatePicker component
ELSE:
  - Use <input type="date" className="...">
  - Document in comments: "TODO: Replace with DatePicker when available"
```

### Select Component Availability:
```
IF @/shared/ui/primitives/Select EXISTS:
  - Use Select components
ELSE:
  - Use native <select> with Tailwind classes:
    <select
      id="eligibility-program-type"
      className="mt-1 w-full rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
    >
      <option value="">Select program type</option>
      <option value="medicaid">Medicaid</option>
      <option value="medicare">Medicare</option>
      <option value="private">Private Insurance</option>
      <option value="other">Other</option>
    </select>
  - Document: "TODO: Replace with Select primitive when available"
```

### ESLint Warnings Expected:
```
- "Use @/shared/ui/primitives/Button" (if buttons used)
- "Use @/shared/ui/primitives/Select" (if primitives not found)
NOTE: These are expected until DS is complete
```

---

## 14. DO NOT INCLUDE

### Forbidden Elements:
- NO hardcoded colors (#hex, rgb, etc.)
- NO inline style={{}} objects
- NO !important flags
- NO custom CSS files
- NO external dependencies
- NO form submission handlers
- NO validation logic
- NO error states (yet)
- NO loading states
- NO API calls
- NO console.log/warn/error
- NO date-fns library imports
- NO CustomCalendar component
- NO Popover/PopoverContent/PopoverTrigger

### Do Not Touch:
- Step 1 files (READ ONLY for pattern)
- Application layer
- Domain layer
- Infrastructure
- Global styles
- Router configuration

---

## 15. INTEGRATION WITH STEP 2

### In Step2EligibilityInsurance.tsx:
```
1. Add to state:
   eligibility: false  // Add to expandedSections

2. Import component:
   import { EligibilityRecordsSection } from './components/EligibilityRecordsSection'

3. Mount as second section (after GovernmentCoverageSection):
   <EligibilityRecordsSection
     onSectionToggle={() => toggleSection('eligibility')}
     isExpanded={expandedSections.eligibility}
   />
```

---

## FINAL VALIDATION

This specification is complete when:
1. All patterns match Step 1 exactly
2. All fields are specified with unique IDs
3. All tokens are mapped
4. All ARIA requirements documented
5. Implementation can proceed without checking Step 1 again

**READY FOR IMPLEMENTATION:** ✅

---

*Specification completed: 2025-09-24*
*Next Task: Implement EligibilityRecordsSection.tsx following this spec exactly*
*No code changes to Step 1 permitted*