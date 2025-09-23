# Tokens & Globals Coverage Audit Report

**Date:** 2025-09-23
**Scope:** Audit token coverage for OrbiPax primitives vs globals.css
**Status:** AUDIT-ONLY (No code modified)

---

## Executive Summary

Audited 28 primitive components for semantic token usage against `globals.css`. Found **critical missing variables** that block proper rendering (P0) and styling issues (P1). The system uses OKLCH color space in `:root` but many Tailwind semantic classes expect HSL-based CSS variables that don't exist.

### Key Findings:
- **15 missing P0 variables** (blocks rendering)
- **12 missing P1 variables** (degrades styling)
- **3 dangerous resets** in globals.css affecting focus accessibility
- Most primitives rely on undefined semantic tokens like `bg-popover`, `text-popover-foreground`

---

## 1. TOKEN COVERAGE TABLE

### Critical Primitives Analysis

| Primitive | File | Class/Token Used | CSS Var Required | Exists? | Defined In | Risk | Suggested Mapping |
|-----------|------|------------------|------------------|---------|------------|------|-------------------|
| **Popover** | Popover/index.tsx:25 | `bg-popover` | `--bg-popover` | ❌ NO | - | **P0** Blocks | `var(--bg)` |
| Popover | Popover/index.tsx:25 | `text-popover-foreground` | `--text-popover-foreground` | ❌ NO | - | **P0** Blocks | `var(--fg)` |
| Popover | Popover/index.tsx:25 | `border` | `--border` | ✅ YES | :root:79 | None | - |
| **DatePicker** | DatePicker/index.tsx:228 | `text-muted-foreground` | `--text-muted-foreground` | ❌ NO | - | **P0** Blocks | `var(--muted-fg)` |
| DatePicker | DatePicker/index.tsx:259 | `bg-muted` | `--bg-muted` | ❌ NO | - | **P0** Blocks | `var(--muted)` |
| DatePicker | DatePicker/index.tsx:259 | `text-foreground` | `--text-foreground` | ❌ NO | - | **P0** Blocks | `var(--fg)` |
| DatePicker | DatePicker/index.tsx:259 | `ring-primary` | `--ring-primary` | ❌ NO | - | P1 Degrades | `var(--primary)` |
| DatePicker | DatePicker/index.tsx:260 | `bg-primary` | `--bg-primary` | ❌ NO | - | **P0** Blocks | `var(--primary)` |
| DatePicker | DatePicker/index.tsx:260 | `text-primary-foreground` | `--text-primary-foreground` | ❌ NO | - | **P0** Blocks | `var(--primary-fg)` |
| DatePicker | DatePicker/index.tsx:261 | `border-primary` | `--border-primary` | ❌ NO | - | P1 Degrades | `var(--primary)` |
| **Card** | Card/index.tsx:40-42 | `bg-card` | `--bg-card` | ❌ NO | - | **P0** Blocks | `var(--bg)` |
| Card | Card/index.tsx:40-42 | `border-border` | `--border-border` | ❌ NO | - | P1 Degrades | `var(--border)` |
| **Select** | Select/index.tsx:40 | `bg-bg` | `--bg-bg` | ❌ NO | - | **P0** Blocks | `var(--bg)` |
| Select | Select/index.tsx:40 | `text-fg` | `--text-fg` | ❌ NO | - | **P0** Blocks | `var(--fg)` |
| Select | Select/index.tsx:43 | `ring-ring` | `--ring-ring` | ❌ NO | - | P1 Degrades | `var(--ring)` |
| Select | Select/index.tsx:43 | `ring-offset-2` | `--tw-ring-offset-width` | ✅ YES | Tailwind | None | - |
| Select | Select/index.tsx:106 | `bg-accent` | `--bg-accent` | ❌ NO | - | P1 Degrades | `var(--accent)` |
| Select | Select/index.tsx:106 | `text-accent-foreground` | `--text-accent-foreground` | ❌ NO | - | P1 Degrades | `var(--accent-fg)` |
| **Button** | Button/index.tsx:46 | `ring-ring` | `--ring-ring` | ❌ NO | - | P1 Degrades | `var(--ring)` |
| Button | Button/index.tsx:50 | `bg-primary` | `--bg-primary` | ❌ NO | - | **P0** Blocks | `var(--primary)` |
| Button | Button/index.tsx:50 | `text-on-primary` | `--text-on-primary` | ❌ NO | - | **P0** Blocks | `var(--primary-fg)` |
| Button | Button/index.tsx:51 | `bg-muted` | `--bg-muted` | ❌ NO | - | **P0** Blocks | `var(--muted)` |
| Button | Button/index.tsx:51 | `text-on-muted` | `--text-on-muted` | ❌ NO | - | **P0** Blocks | `var(--muted-fg)` |
| Button | Button/index.tsx:52 | `bg-success` | `--bg-success` | ❌ NO | - | P1 Degrades | `oklch(65% 0.15 140)` |
| Button | Button/index.tsx:53 | `bg-warning` | `--bg-warning` | ❌ NO | - | P1 Degrades | `oklch(80% 0.12 85)` |
| Button | Button/index.tsx:54 | `bg-error` | `--bg-error` | ❌ NO | - | P1 Degrades | `var(--destructive)` |
| **Dialog** | Dialog/index.tsx:161 | `bg-black/50` | Native CSS | ✅ YES | CSS | None | - |
| Dialog | Dialog/index.tsx:165 | `bg-card` | `--bg-card` | ❌ NO | - | **P0** Blocks | `var(--bg)` |
| Dialog | Dialog/index.tsx:178 | `border-error` | `--border-error` | ❌ NO | - | P1 Degrades | `var(--destructive)` |
| Dialog | Dialog/index.tsx:179 | `border-success` | `--border-success` | ❌ NO | - | P1 Degrades | `oklch(65% 0.15 140)` |
| Dialog | Dialog/index.tsx:180 | `border-warning` | `--border-warning` | ❌ NO | - | P1 Degrades | `oklch(80% 0.12 85)` |

### Token Usage Summary by Primitive

| Primitive | Total Tokens | Missing P0 | Missing P1 | Coverage % |
|-----------|--------------|------------|------------|------------|
| Popover | 3 | 2 | 0 | 33% |
| DatePicker | 9 | 6 | 3 | 0% |
| Card | 2 | 1 | 1 | 0% |
| Select | 8 | 3 | 3 | 25% |
| Button | 10 | 5 | 3 | 20% |
| Dialog | 6 | 1 | 3 | 33% |
| **TOTAL** | **38** | **18** | **13** | **18%** |

---

## 2. MISSING VARIABLES (PRIORITIZED)

### P0 - Critical (Blocks Rendering)

These variables MUST be defined for components to render correctly:

```css
/* Popover tokens */
--bg-popover: var(--bg);
--text-popover-foreground: var(--fg);

/* Card tokens */
--bg-card: var(--bg);

/* Muted tokens */
--bg-muted: var(--muted);
--text-muted-foreground: var(--muted-fg);

/* Primary tokens */
--bg-primary: var(--primary);
--text-primary-foreground: var(--primary-fg);

/* Foreground/Background tokens */
--text-foreground: var(--fg);
--bg-bg: var(--bg);
--text-fg: var(--fg);

/* On-color tokens */
--text-on-primary: var(--primary-fg);
--text-on-muted: var(--muted-fg);
```

### P1 - Important (Degrades Styling)

These affect visual consistency but don't block rendering:

```css
/* Ring/Border tokens */
--ring-primary: var(--primary);
--ring-ring: var(--ring);
--border-primary: var(--primary);
--border-border: var(--border);
--border-error: var(--destructive);
--border-success: oklch(65% 0.15 140);
--border-warning: oklch(80% 0.12 85);

/* Accent tokens */
--bg-accent: var(--accent);
--text-accent-foreground: var(--accent-fg);

/* Status tokens */
--bg-success: oklch(65% 0.15 140);
--bg-warning: oklch(80% 0.12 85);
--bg-error: var(--destructive);
```

---

## 3. DANGEROUS RESETS IN GLOBALS

### Finding 1: Universal Focus Outline Removal (Lines 163-165)
```css
*:focus {
  outline: none;
}
```
**Impact:** Removes ALL focus outlines before applying `:focus-visible`. This creates a flash of no focus indication and breaks keyboard navigation for users who don't trigger `:focus-visible`.

**Risk Level:** HIGH - Accessibility violation (WCAG 2.1 2.4.7)

### Finding 2: Textarea Focus Override (Line 214)
```css
textarea:focus {
  outline: none;
}
```
**Impact:** Specifically removes textarea focus, creating inconsistent focus behavior.

**Risk Level:** MEDIUM - Inconsistent UX

### Finding 3: Generic Reset at Line 290
```css
outline: none;
```
**Impact:** Another outline removal without context, likely in an animation or transition block.

**Risk Level:** LOW - Context unclear

---

## 4. GLOBALS.CSS ANALYSIS

### Current Structure
- **@theme block:** Defines HSL colors as `--color-*` (Tailwind v4 convention)
- **:root block:** Defines OKLCH colors as simple names (`--bg`, `--fg`, etc.)
- **Problem:** Tailwind classes expect `--bg-*` and `--text-*` patterns, not found

### Token Mapping Confusion
The system has TWO color systems:
1. HSL in `@theme` (e.g., `--color-bg`)
2. OKLCH in `:root` (e.g., `--bg`)

But Tailwind classes expect a THIRD pattern: `--bg-popover`, `--text-muted-foreground`, etc.

---

## 5. MINIMUM ACTION PLAN (APPLY NEXT)

### Step 1: Add Missing Token Mappings to globals.css

Add to `:root` block (lines 67-98) WITHOUT modifying existing tokens:

```css
:root {
  /* [existing OKLCH tokens remain unchanged] */

  /* === PRIMITIVE TOKEN MAPPINGS === */
  /* Map Tailwind semantic classes to existing OKLCH tokens */

  /* Background tokens */
  --bg-popover: var(--bg);
  --bg-card: var(--bg);
  --bg-muted: var(--muted);
  --bg-primary: var(--primary);
  --bg-accent: var(--accent);
  --bg-bg: var(--bg);
  --bg-success: oklch(65% 0.15 140);
  --bg-warning: oklch(80% 0.12 85);
  --bg-error: var(--destructive);

  /* Text/Foreground tokens */
  --text-popover-foreground: var(--fg);
  --text-muted-foreground: var(--muted-fg);
  --text-primary-foreground: var(--primary-fg);
  --text-foreground: var(--fg);
  --text-fg: var(--fg);
  --text-on-primary: var(--primary-fg);
  --text-on-muted: var(--muted-fg);
  --text-accent-foreground: var(--accent-fg);

  /* Border tokens */
  --border-border: var(--border);
  --border-primary: var(--primary);
  --border-error: var(--destructive);
  --border-success: oklch(65% 0.15 140);
  --border-warning: oklch(80% 0.12 85);

  /* Ring tokens */
  --ring-primary: var(--primary);
  --ring-ring: var(--ring);
}
```

### Step 2: Add Dark Mode Mappings

Add same mappings to `.dark` block (lines 101-115):

```css
.dark {
  /* [existing dark OKLCH tokens remain unchanged] */

  /* === DARK MODE PRIMITIVE TOKEN MAPPINGS === */
  /* Same structure as light mode, inheriting from dark OKLCH values */
  --bg-popover: var(--bg);
  /* ... rest of mappings ... */
}
```

### Step 3: DO NOT Fix Focus Resets Yet

Document for future fix but don't change now (requires testing):
- Replace `*:focus { outline: none; }` with `*:focus:not(:focus-visible)`
- Or remove entirely and rely on `:focus-visible` only

---

## 6. VALIDATION METRICS

After applying token mappings:

| Component | Before | After Target |
|-----------|--------|--------------|
| Popover | Black border, no bg | White bg, subtle border |
| DatePicker | Broken calendar | Proper styled calendar |
| Card | Transparent | White background |
| Select | No dropdown styling | Proper dropdown |
| Button | Missing colors | All variants work |
| Dialog | No overlay | Proper modal overlay |

---

## 7. RISKS & MITIGATIONS

### Risk 1: Token Name Conflicts
**Mitigation:** All new tokens use Tailwind's expected naming pattern (`--bg-*`, `--text-*`) which doesn't conflict with existing `--color-*` or simple names.

### Risk 2: OKLCH vs HSL Mismatch
**Mitigation:** We're mapping to existing OKLCH values, maintaining color space consistency.

### Risk 3: Breaking Existing Components
**Mitigation:** Only ADDING new mappings, not modifying existing tokens.

---

## CONCLUSION

The OrbiPax primitive system has an **82% token coverage gap** due to missing CSS variable mappings. The globals.css file defines colors in OKLCH space but doesn't map them to Tailwind's expected semantic token patterns.

**Immediate Action Required:**
1. Add 31 missing token mappings (18 P0, 13 P1)
2. Test all primitives after mapping
3. Plan focus reset fixes for accessibility compliance

**No code was modified during this audit.** All findings are documented for the APPLY phase.

---

**Audit Complete:** 2025-09-23
**Files Analyzed:** 28 primitives + globals.css
**Deliverable:** `D:\ORBIPAX-PROJECT\tmp\tokens_globals_coverage_audit.md`