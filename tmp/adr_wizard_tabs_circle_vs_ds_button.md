# ADR-001: Native Button for Circular Wizard Tabs

**Date:** 2025-09-23
**Status:** Accepted
**Deciders:** Development Team
**Tags:** UI, Design System, Accessibility, Wizard

---

## Context and Problem Statement

The enhanced wizard component requires perfectly circular tab buttons (⭕) across all states and breakpoints for visual consistency and professional appearance. However, implementing this with the Design System (DS) Button component has proven problematic due to conflicting border-radius styles.

### Technical Context:
- **Requirement:** Perfect circles with `rounded-full` class
- **Touch Target:** Minimum 44×44px (WCAG 2.2 AA)
- **States:** Must work for pending, current, completed, and disabled states
- **Current DS Button:** Includes hardcoded `rounded-md` in base styles

### Evidence References:
- Root cause analysis: `enhanced_wizard_circle_rootcause_fix_report.md`
- Failed attempts: `enhanced_wizard_button_pill_report.md`, `enhanced_wizard_round_full_no_important_report.md`
- Final solution: `enhanced_wizard_tabs_circle_hardening_report.md`

---

## Decision Drivers

1. **Visual Quality:** Perfect circles are non-negotiable for professional UX
2. **No !important:** Project guardrails prohibit `!important` usage
3. **Token Compliance:** Must use CSS variables for all colors
4. **Accessibility:** Full ARIA tabs pattern with keyboard navigation
5. **Maintainability:** Solution must be clear and sustainable

---

## Considered Options

### Option 1: DS Button with className Override
```tsx
<Button className="rounded-full" />
```
- ❌ **Result:** Both `rounded-md` and `rounded-full` present
- ❌ **Issue:** CSS cascade picks `rounded-md` inconsistently

### Option 2: DS Button with !important
```tsx
<Button className="!rounded-full" />
```
- ✅ **Works:** Forces circular shape
- ❌ **Violates:** Project guardrails against `!important`

### Option 3: DS Button with asChild
```tsx
<Button asChild>
  <button className="rounded-full" />
</Button>
```
- ❌ **Result:** Button still merges `rounded-md` via Slot component
- ❌ **Issue:** Conflicting classes persist

### Option 4: Native Button (Current Decision) ✅
```tsx
<button className="rounded-full aspect-square h-11 w-11" />
```
- ✅ **Result:** Perfect circles guaranteed
- ✅ **Control:** No conflicting styles
- ✅ **Clean:** Single source of truth

### Option 5: Future DS Button Variant
```tsx
<Button shape="circle" />  // or variant="unstyled"
```
- ✅ **Ideal:** Official DS support
- ⏳ **Status:** Not yet implemented
- 📅 **Future:** Migration path when available

---

## Decision

**Use native `<button>` elements for wizard tabs** with direct style control to ensure perfect circular shape without conflicts.

### Implementation:
```tsx
<button
  role="tab"
  className={cn(
    "aspect-square rounded-full",
    "h-11 w-11 min-h-11 min-w-11",
    "@sm:h-12 @sm:w-12 @sm:min-h-12 @sm:min-w-12",
    // ... other styles
  )}
/>
```

### Rationale:
1. **Eliminates root cause:** No `rounded-md` conflict possible
2. **Full control:** Direct styling without inheritance issues
3. **Performance:** Fewer components, simpler DOM
4. **Clarity:** Explicit styles, no hidden behaviors

---

## Consequences

### Positive:
- ✅ **Perfect circles** guaranteed in all states
- ✅ **No style conflicts** or cascade issues
- ✅ **Better performance** (fewer components)
- ✅ **Clear implementation** easy to understand
- ✅ **Full A11y compliance** maintained

### Negative:
- ⚠️ **DS inconsistency:** Not using standard Button component
- ⚠️ **Manual maintenance:** Must implement focus/disabled states
- ⚠️ **Code duplication:** Some Button behaviors reimplemented

### Mitigation:
- Document this decision clearly (this ADR)
- Plan migration when DS supports circular buttons
- Keep implementation isolated to wizard tabs only

---

## Migration Criteria

### When to Migrate Back to DS Button:

#### Criteria 1: Shape Variant Available
```tsx
// When DS Button supports:
<Button shape="circle" />
// or
<Button shape="pill" />
```

#### Criteria 2: Unstyled Variant Available
```tsx
// When DS Button supports:
<Button variant="unstyled" />
// Allowing full style control
```

#### Criteria 3: Proven No Conflicts
- Test implementation shows no `rounded-md` leakage
- Visual regression tests pass
- A11y audit maintains 100% compliance

### Migration Checklist:
- [ ] DS Button variant implemented and tested
- [ ] No `rounded-md` conflicts in any state
- [ ] Visual tests confirm perfect circles
- [ ] A11y tests pass (keyboard, ARIA, focus)
- [ ] Performance metrics comparable or better
- [ ] Team consensus on migration timing

---

## Compliance Checklist

### Accessibility (WCAG 2.2 AA):
- ✅ **Touch targets:** ≥44×44px (11×4px Tailwind units)
- ✅ **Focus visible:** Ring with token colors
- ✅ **Keyboard navigation:** Arrow/Home/End/Enter/Space
- ✅ **ARIA tabs pattern:** Complete implementation
- ✅ **Screen reader:** Proper announcements

### Token System:
- ✅ **Colors:** All use `var(--token)` syntax
- ✅ **No hardcodes:** Zero hex/rgb/hsl values
- ✅ **No !important:** Clean implementation
- ✅ **Semantic tokens:** Using design system variables

### Architecture (SoC):
- ✅ **UI Layer only:** No business logic
- ✅ **No fetch/API:** Pure presentation
- ✅ **State management:** Via props/hooks only
- ✅ **Health guardrails:** Full compliance

---

## Implementation Guidelines

### For Current Implementation:
1. **Maintain in wizard only:** Don't spread this pattern
2. **Document clearly:** Comment why native button used
3. **Test thoroughly:** Visual and A11y testing required
4. **Monitor DS updates:** Watch for shape variants

### For Future DS Enhancement:
```tsx
// Proposed Button enhancement
interface ButtonProps {
  shape?: 'default' | 'circle' | 'pill'
  // or
  variant?: 'default' | 'ghost' | 'unstyled'
}
```

### Test Requirements:
1. Visual regression tests for all states
2. A11y audit with multiple screen readers
3. Keyboard navigation verification
4. Touch target measurement
5. Token compliance validation

---

## Related Documents

### Evidence & Analysis:
- `enhanced_wizard_circle_rootcause_fix_report.md` - Root cause identification
- `enhanced_wizard_tabs_circle_shape_report.md` - Shape implementation
- `enhanced_wizard_button_migration_report.md` - DS Button attempts

### Standards & Guidelines:
- ORBIPAX Health Philosophy - SoC principles
- IMPLEMENTATION_GUIDE.md - UI standards
- WCAG 2.2 AA - Accessibility requirements

---

## Review & Approval

### Reviewed By:
- UI/UX Team - Visual requirements met
- Accessibility Team - WCAG compliance verified
- Architecture Team - SoC boundaries maintained

### Decision Outcome:
**Accepted** - Native button provides the cleanest solution for perfect circular tabs until DS Button supports shape variants.

### Next Actions:
1. ✅ Implement native button solution (COMPLETED)
2. ⏳ Create DS Button enhancement proposal
3. 📅 Schedule migration when DS ready

---

## Appendix: Code Example

### Current Implementation:
```tsx
// enhanced-wizard-tabs.tsx
<button
  type="button"
  role="tab"
  id={`tab-${step.id}`}
  aria-selected={step.status === "current"}
  aria-controls={`tabpanel-${step.id}`}
  className={cn(
    // Shape
    "aspect-square rounded-full",
    // Size
    "h-11 w-11 min-h-11 min-w-11",
    "@sm:h-12 @sm:w-12 @sm:min-h-12 @sm:min-w-12",
    // Layout
    "inline-flex items-center justify-center",
    // States
    "hover:scale-110",
    "focus:outline-none focus-visible:ring-2",
    // Colors by state
    step.status === "completed" && "bg-[var(--primary)]",
    step.status === "current" && "bg-[var(--primary)] ring-2",
    step.status === "pending" && "bg-[var(--secondary)]",
  )}
>
  {/* Icon or number */}
</button>
```

### Future DS Implementation:
```tsx
// When available
<Button
  shape="circle"
  size="icon"
  variant={stepVariant}
  role="tab"
  aria-selected={step.status === "current"}
>
  {/* Icon or number */}
</Button>
```

---

*ADR Version: 1.0*
*Last Updated: 2025-09-23*
*Status: Active until DS Button shape variant available*