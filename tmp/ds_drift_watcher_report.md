# DS Drift Watcher Report

**Date:** 2025-09-23
**Duration:** 0.02s
**Files Scanned:** 260
**Total Violations:** 91

---

## Summary by Category

| Category | Count | Description |
|----------|-------|-------------|
| ⚠️ TW-ArbitraryColor | 2 | Tailwind arbitrary value with hardcoded color |
| ⚠️ Inline-Color | 4 | Inline style with non-tokenized color |
| ⚠️ Dangerous-Reset | 1 | Dangerous focus reset that harms accessibility |
| ❌ Native-In-ModulesUI | 30 | Native HTML element in modules UI layer |
| ❌ Missing-FocusHint | 54 | Trigger/Button component potentially missing focus styles |

---

## Detailed Violations

| Category | File | Line | Snippet | Suggestion |
|----------|------|------|---------|------------|
| Dangerous-Reset | `src/styles/globals.css:313` | 313 | `/* Removed dangerous *:focus outline:none - focus handled by components */` | Use focus-visible:ring-0 or proper focus management utilities |
| Inline-Color | `src/modules/auth/ui/components/SubmitButton.tsx:24` | 24 | `style={{` | Use CSS variables: color: "var(--token)" or Tailwind classes |
| Inline-Color | `src/modules/intake/ui/enhanced-wizard-tabs.tsx:177` | 177 | `style={{` | Use CSS variables: color: "var(--token)" or Tailwind classes |
| Inline-Color | `src/shared/ui/primitives/EmptyState/examples.tsx:359` | 359 | `<stop offset="0%" style={{ stopColor: "currentColor", stopOpacity: 0.2 }} />` | Use CSS variables: color: "var(--token)" or Tailwind classes |
| Inline-Color | `src/shared/ui/primitives/EmptyState/examples.tsx:360` | 360 | `<stop offset="100%" style={{ stopColor: "currentColor", stopOpacity: 0.1 }} />` | Use CSS variables: color: "var(--token)" or Tailwind classes |
| Missing-FocusHint | `src/shared/ui/primitives/Accordion/index.tsx:23` | 23 | `const AccordionTrigger = React.forwardRef<` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Accordion/index.tsx:38` | 38 | `</AccordionPrimitive.Trigger>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/AlertDialog/index.tsx:7` | 7 | `import { buttonVariants } from "@/shared/ui/primitives/Button"` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Avatar/examples.tsx:249` | 249 | `</Button>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Badge/examples.tsx:357` | 357 | `</Button>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Button/index.tsx:44` | 44 | `const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Calendar/calendar.tsx:6` | 6 | `import { buttonVariants } from "@/shared/ui/primitives/Button"` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Carousel/index.tsx:198` | 198 | `HTMLButtonElement,` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Carousel/index.tsx:221` | 221 | `</Button>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Checkbox/examples.tsx:64` | 64 | `</Button>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Combobox/ComboboxButtons.tsx:11` | 11 | `export interface ComboboxButtonsProps {` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Combobox/ComboboxButtons.tsx:25` | 25 | `export const ComboboxButtons = React.forwardRef<HTMLDivElement, ComboboxButtonsProps>(` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/ContextMenu/index.tsx:38` | 38 | `</ContextMenuPrimitive.SubTrigger>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/date-picker/date-picker.tsx:10` | 10 | `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/primitive...` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/DatePicker/DatePickerTriggerInput.tsx:8` | 8 | `import { PopoverTrigger } from "@/shared/ui/primitives/Popover"` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/DatePicker/DatePickerTriggerInput.tsx:29` | 29 | `export const DatePickerTriggerInput = React.forwardRef<` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/DatePicker/index.tsx:11` | 11 | `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/primitive...` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Dialog/examples.tsx:50` | 50 | `<Button onClick={handleConfirm}>Confirm</Button>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Dialog/examples.tsx:491` | 491 | `</Button>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Dialog/index.tsx:11` | 11 | `const DialogTrigger = DialogPrimitive.Trigger` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Drawer/index.tsx:19` | 19 | `const DrawerTrigger = DrawerPrimitive.Trigger` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/DropdownMenu/index.tsx:38` | 38 | `</DropdownMenuPrimitive.SubTrigger>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/EmptyState/examples.tsx:32` | 32 | `</Button>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/EmptyState/examples.tsx:161` | 161 | `<Button onClick={() => setShowEmpty(true)}>Search</Button>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/EmptyState/examples.tsx:178` | 178 | `</Button>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/HoverCard/index.tsx:10` | 10 | `const HoverCardTrigger = HoverCardPrimitive.Trigger` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Modal/examples.tsx:46` | 46 | `<Button onClick={handleConfirm}>Confirm</Button>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Modal/examples.tsx:93` | 93 | `<Button variant="outline">Close</Button>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Modal/examples.tsx:242` | 242 | `<Button onClick={handleConfirm}>Confirm</Button>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Modal/examples.tsx:293` | 293 | `<Button variant="outline">Close</Button>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Modal/examples.tsx:545` | 545 | `<Button variant="outline">Close</Button>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Modal/index.tsx:616` | 616 | `// Modal Close Button component` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Popover/index.tsx:10` | 10 | `const PopoverTrigger = PopoverPrimitive.Trigger` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Select/examples.tsx:5` | 5 | `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./index";` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Select/index.tsx:16` | 16 | `const SelectTriggerLegacy = React.forwardRef<` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Select/index.tsx:37` | 37 | `import { SelectTriggerInput } from "./SelectTriggerInput"` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Select/index.tsx:55` | 55 | `</SelectPrimitive.ScrollUpButton>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Select/index.tsx:72` | 72 | `</SelectPrimitive.ScrollDownButton>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Select/index.tsx:102` | 102 | `<SelectScrollDownButton />` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Select/SelectTriggerInput.tsx:12` | 12 | `export const SelectTriggerInput = React.forwardRef<` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Sheet/examples.tsx:65` | 65 | `<Button onClick={handleAction}>Confirm</Button>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Sheet/examples.tsx:110` | 110 | `<Button variant="outline">Close</Button>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Sheet/examples.tsx:665` | 665 | `<Button variant="outline">Close</Button>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Sheet/sheet.tsx:10` | 10 | `const SheetTrigger = SheetPrimitive.Trigger` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Sheet/sheet.tsx:56` | 56 | `hideCloseButton?: boolean` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Table/table.tsx:759` | 759 | `const TableButton = React.forwardRef<HTMLButtonElement, TableButtonProps>(` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Tabs/index.tsx:25` | 25 | `const TabsTrigger = React.forwardRef<` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Tabs/index.tsx:38` | 38 | `TabsTrigger.displayName = TabsPrimitive.Trigger.displayName` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Textarea/examples.tsx:244` | 244 | `</Button>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/time-picker/time-picker-content.tsx:5` | 5 | `import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/primitive...` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/time-picker/time-picker-trigger.tsx:15` | 15 | `const TimePickerTrigger = React.forwardRef<HTMLButtonElement, TimePickerTriggerProps>(` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/time-picker/time-picker.tsx:28` | 28 | `const TimePicker = React.forwardRef<HTMLButtonElement, TimePickerProps>(` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Tooltip/index.tsx:12` | 12 | `const TooltipTrigger = TooltipPrimitive.Trigger` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Missing-FocusHint | `src/shared/ui/primitives/Typography/examples.tsx:228` | 228 | `</Button>` | Add focus-visible:ring-2 focus-visible:ring-offset-2 |
| Native-In-ModulesUI | `src/modules/auth/ui/components/PasswordField.tsx:33` | 33 | `<button` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/auth/ui/components/RememberMe.tsx:16` | 16 | `<input` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/auth/ui/components/SignupPrompt.tsx:26` | 26 | `<button` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/auth/ui/components/SignupPrompt.tsx:51` | 51 | `<button` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/auth/ui/components/SubmitButton.tsx:19` | 19 | `<button` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/dashboard/ui/components/QuickActionsCard.tsx:18` | 18 | `<button` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/intake/ui/_dev/Step1VisualHarness.tsx:126` | 126 | `<select` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/intake/ui/_dev/Step1VisualHarness.tsx:157` | 157 | `<button` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/intake/ui/_dev/Step1VisualHarness.tsx:163` | 163 | `<button` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/intake/ui/_dev/Step1VisualHarness.tsx:169` | 169 | `<button` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/intake/ui/_dev/Step1VisualHarness.tsx:175` | 175 | `<button` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/intake/ui/_dev/Step2VisualHarness.tsx:131` | 131 | `<select` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/intake/ui/_dev/Step2VisualHarness.tsx:162` | 162 | `<button` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/intake/ui/_dev/Step2VisualHarness.tsx:168` | 168 | `<button` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/intake/ui/_dev/Step2VisualHarness.tsx:174` | 174 | `<button` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/intake/ui/_dev/Step2VisualHarness.tsx:180` | 180 | `<button` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/intake/ui/enhanced-wizard-tabs.tsx:185` | 185 | `<button` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/intake/ui/step1-demographics/components/AddressSection.tsx:115` | 115 | `<Select` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/intake/ui/step1-demographics/components/AddressSection.tsx:247` | 247 | `<Select` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/intake/ui/step1-demographics/components/AddressSection.tsx:341` | 341 | `<Select` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/intake/ui/step1-demographics/components/ContactSection.tsx:123` | 123 | `<Select` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/intake/ui/step1-demographics/components/PersonalInfoSection.tsx:200` | 200 | `<Select` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/intake/ui/step1-demographics/components/PersonalInfoSection.tsx:222` | 222 | `<Select` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/intake/ui/step1-demographics/components/PersonalInfoSection.tsx:244` | 244 | `<Select` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/intake/ui/step1-demographics/components/PersonalInfoSection.tsx:262` | 262 | `<Select` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/intake/ui/step1-demographics/components/PersonalInfoSection.tsx:289` | 289 | `<Select` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/intake/ui/step1-demographics/components/PersonalInfoSection.tsx:309` | 309 | `<Select` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/intake/ui/step1-demographics/components/PersonalInfoSection.tsx:327` | 327 | `<Select` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/organizations/ui/OrgSwitcher.tsx:62` | 62 | `<select` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| Native-In-ModulesUI | `src/modules/patients/ui/PatientForm.tsx:103` | 103 | `<button` | Use primitives: Select, Textarea, Button, Checkbox, RadioGroup |
| TW-ArbitraryColor | `src/modules/legacy/intake/layout/IntakeWizardLayout.tsx:18` | 18 | `<div className="flex w-full min-h-screen bg-[#F5F7FA]">` | Use design tokens: bg-[var(--token)] or semantic classes |
| TW-ArbitraryColor | `src/modules/legacy/intake/step1-demographics/page.tsx:15` | 15 | `<main className="min-h-screen bg-[#F5F7FA] p-4 md:p-8 flex">` | Use design tokens: bg-[var(--token)] or semantic classes |

---

## How to Fix

### TW-ArbitraryColor
Replace hardcoded colors with design tokens:
- ❌ `bg-[#ff0000]` → ✅ `bg-destructive`
- ❌ `text-[rgb(255,255,255)]` → ✅ `text-white` or `text-background`

### Inline-Color
Use CSS variables or Tailwind classes:
- ❌ `style={{ color: '#ff0000' }}` → ✅ `className="text-destructive"`
- ❌ `style={{ backgroundColor: 'rgb(0,0,0)' }}` → ✅ `className="bg-black"`

### Dangerous-Reset
Use proper focus management:
- ❌ `outline: none` → ✅ `focus-visible:outline-none focus-visible:ring-2`
- ❌ `box-shadow: none` → ✅ `shadow-none` (if not for focus)

### Native-In-ModulesUI
Import and use primitives:
```tsx
import { Select } from '@/shared/ui/primitives/Select'
import { Button } from '@/shared/ui/primitives/Button'
import { Checkbox } from '@/shared/ui/primitives/Checkbox'
```

### Missing-FocusHint
Add focus-visible utilities to interactive components:
```tsx
className={cn(
  "...",
  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
)}
```

---

## Integration

### Run Locally
```bash
npm run ds:drift
```

### CI Integration (Non-blocking)
```yaml
- name: DS Drift Check
  run: npm run ds:drift
  continue-on-error: true

- name: Upload Drift Report
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: ds-drift-report
    path: tmp/ds_drift_watcher_report.md
```

---

*This report complements ESLint/Stylelint rules. It's a read-only audit for awareness, not enforcement.*
