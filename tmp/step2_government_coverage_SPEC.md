# SPECIFICATION: GovernmentCoverageSection for Step 2

**Document Type:** Implementation Specification (NO CODE)
**Date:** 2025-09-24
**Target Component:** GovernmentCoverageSection.tsx
**Pattern Source:** Step 1 Demographics (READ-ONLY REFERENCE)
**Status:** READY FOR IMPLEMENTATION

---

## 1. FILE STRUCTURE

### Component Location:
```
D:\ORBIPAX-PROJECT\src\modules\intake\ui\step2-eligibility-insurance\
└── components\
    └── GovernmentCoverageSection.tsx  [NEW FILE TO CREATE]
```

### Integration Point:
```
D:\ORBIPAX-PROJECT\src\modules\intake\ui\step2-eligibility-insurance\
└── Step2EligibilityInsurance.tsx  [MOUNT AS FIRST SECTION]
```

### Import Statement Required:
```
import { GovernmentCoverageSection } from './components/GovernmentCoverageSection'
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
  - id="header-government"  [UNIQUE ID FOR STEP 2]
  - className="py-3 px-6 flex justify-between items-center cursor-pointer min-h-[44px]"
  - onClick={onSectionToggle}
  - onKeyDown handler for Enter/Space keys
  - role="button"
  - tabIndex={0}
  - aria-expanded={isExpanded}
  - aria-controls="panel-government"  [MATCHES PANEL ID]

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
  - id="panel-government"  [MATCHES aria-controls]
  - aria-labelledby="header-government"  [MATCHES HEADER ID]
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
  <Input
    id="[field-id]"
    placeholder="[placeholder text]"
    className="mt-1"
    [additional props]
  />
</div>
```

---

## 3. FIELD SPECIFICATIONS

### Field 1: Medicaid ID
```
POSITION: Grid Row 1, Column 1
LABEL: "Medicaid ID"
ID: "gov-medicaid-id"
TYPE: text
PLACEHOLDER: "Enter Medicaid ID"
REQUIRED: false
ARIA: aria-label="Medicaid ID"
```

### Field 2: Medicaid Effective Date
```
POSITION: Grid Row 1, Column 2
LABEL: "Medicaid Effective Date"
ID: "gov-medicaid-effective-date"
TYPE: DatePicker component (same as Step 1)
PLACEHOLDER: "Select date"
REQUIRED: false
FALLBACK: If DatePicker unavailable, use <input type="date">
GAP NOTE: Document if DatePicker from @/shared/ui/primitives/DatePicker is missing
```

### Field 3: Medicare ID
```
POSITION: Grid Row 2, Column 1
LABEL: "Medicare ID"
ID: "gov-medicare-id"
TYPE: text
PLACEHOLDER: "Enter Medicare ID"
REQUIRED: false
ARIA: aria-label="Medicare ID"
```

### Field 4: Social Security Number
```
POSITION: Grid Row 2, Column 2
LABEL: "Social Security Number"
ID: "gov-ssn"
TYPE: password
PLACEHOLDER: "XXX-XX-XXXX"
REQUIRED: false
ARIA: aria-label="Social Security Number"
ARIA: aria-describedby="gov-ssn-hint"
HINT: <span id="gov-ssn-hint" className="text-xs text-[var(--muted-foreground)] mt-1">
      Format: XXX-XX-XXXX (last 4 digits visible)
      </span>
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
| Placeholder text | muted-foreground | Handled by Input |
| Hint text | muted-foreground | var(--muted-foreground) |

### Interactive Tokens:
| Element | Token | CSS Variable |
|---------|-------|--------------|
| Icon color | primary | var(--primary) |
| Focus ring | ring | var(--ring) |
| Input background | background | var(--background) |
| Input border | border | var(--border) |

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
- All interactive elements: ≥44×44px
```

### Field Spacing:
```
- Label to Input: mt-1
- Between fields: gap-4 (grid gap)
- Hint below input: mt-1
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
```

### ARIA Attributes:
```
HEADER:
- role="button"
- tabIndex={0}
- aria-expanded={true|false}
- aria-controls="panel-government"

PANEL:
- id="panel-government"
- aria-labelledby="header-government"

FIELDS:
- Label htmlFor matches Input id
- aria-label on inputs (redundant but safer)
- aria-describedby for SSN hint
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
ICON: Wallet (from lucide-react)
IMPORT: import { Wallet, ChevronUp, ChevronDown } from 'lucide-react'
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

FROM @/shared/ui/primitives/Input:
- Input

FROM @/shared/ui/primitives/label:
- Label

FROM @/shared/ui/primitives/DatePicker:
- DatePicker (IF AVAILABLE)

FROM lucide-react:
- Wallet, ChevronUp, ChevronDown
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
interface GovernmentCoverageSectionProps {
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
- [ ] Rendered as FIRST section

### Visual:
- [ ] Card with rounded-3xl corners
- [ ] Shadow-md applied
- [ ] 2×2 grid on desktop
- [ ] Single column on mobile
- [ ] Wallet icon visible
- [ ] Chevron toggles correctly

### Functionality:
- [ ] Header toggles on click
- [ ] Header toggles on Enter/Space
- [ ] Panel shows/hides correctly
- [ ] All fields render
- [ ] SSN shows as password type
- [ ] SSN hint displays

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
6. Add 4 fields in order
7. Add SSN hint
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

### ESLint Warnings Expected:
```
- "Use @/shared/ui/primitives/Button" (if buttons used)
- "Use @/shared/ui/primitives/Input" (if primitives not found)
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

### Do Not Touch:
- Step 1 files (READ ONLY for pattern)
- Application layer
- Domain layer
- Infrastructure
- Global styles
- Router configuration

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
*Next Task: Implement GovernmentCoverageSection.tsx following this spec exactly*
*No code changes to Step 1 permitted*