# Health Guard Violations Report v1.1

**Generated**: 2025-09-24T01:52:11.758Z
**Mode**: FAST
**Guard Version**: Sentinel v1.1
**Files Analyzed**: 15

## 📊 Summary

- **Total Violations**: 16
- **Violation Types**: 3
- **Status**: ❌ FAILED

⚡ **Fast Mode**: Critical gates only (pre-commit validation)

## 🚦 GATES Status

| Gate | Status | Description |
|------|--------|-------------|
| 1 - AUDIT SUMMARY | ❌ | Enhanced validation with content quality checks |
| 2 - PATH VALIDATION | ✅ | Confirmed imports and TypeScript aliases |
| 3 - DUPLICATE DETECTION | ⏭️ | Skipped in fast mode |
| 4 - SOC BOUNDARIES | ❌ | Manifest-driven layer isolation validation |
| 5 - RLS COMPLIANCE | ⏭️ | Skipped in fast mode |
| 6 - UI TOKENS | ❌ | Allowlist-driven semantic token validation |
| 7 - ACCESSIBILITY | ⏭️ | Skipped in fast mode |
| 8 - ZOD VALIDATION | ⏭️ | Skipped in fast mode |
| 9 - BFF WRAPPERS | ⏭️ | Skipped in fast mode |

## 🚫 Violations by Category


### NO_AUDIT (8 occurrences)

**Impact**: AUDIT SUMMARY missing or incomplete

1. AUDIT SUMMARY missing required section: ### 📋 Contexto de la Tarea
2. AUDIT SUMMARY missing required section: ### 🔍 Búsqueda por Directorios
3. AUDIT SUMMARY missing required section: ### 🏗️ Arquitectura & Capas
4. AUDIT SUMMARY missing required section: ### 🔒 RLS/Multi-tenant
5. AUDIT SUMMARY missing required section: ### ✅ Validación Zod
6. AUDIT SUMMARY missing required section: ### 🎨 UI & Accesibilidad
7. AUDIT SUMMARY missing required section: ### 🛡️ Wrappers BFF
8. AUDIT SUMMARY missing required section: ### 🚦 Go/No-Go Decision

**Resolution**: Create complete AUDIT SUMMARY in /tmp using CLAUDE.md template with all 8 required sections


### SOC_VIOLATION (1 occurrence)

**Impact**: Layer boundary violation (UI→App→Domain→Infra)

1. UI layer violation in src/modules/intake/ui/step1-demographics/components/intake-wizard-step1-demographics.tsx: '@/modules/intake/state' not in allowed imports. UI components and presentation logic

**Resolution**: Respect layer boundaries: UI→Application→Domain→Infrastructure. Check SoC manifest rules


### UI_HARDCODE (7 occurrences)

**Impact**: Hardcoded colors/tokens instead of semantic Tailwind v4

1. Excessive hardcoded spacing in src/modules/intake/ui/step1-demographics/components/AddressSection.tsx: 5, 5, 5, 5, 5, 5, 11, 11, 11, 11, 11, 11, 5, 5, 11, 11, 11, 11, 11, 11. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
2. Excessive hardcoded spacing in src/modules/intake/ui/step1-demographics/components/ContactSection.tsx: 5, 5, 5, 5, 5, 5, 11, 11. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
3. Excessive hardcoded spacing in src/modules/intake/ui/step1-demographics/components/LegalSection.tsx: 5, 5, 5, 5, 5, 5, 11, 11, 11, 11, 11, 11. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
4. Excessive hardcoded spacing in src/modules/intake/ui/step1-demographics/components/PersonalInfoSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
5. Hex colors in src/modules/intake/ui/step1-demographics/components/Step1SkinScope.tsx: #4C6EF5, #E5E7EB, #F9FAFB, #111827, #6B7280, #9CA3AF, #D1D5DB, #F9FAFB, #9CA3AF, #3B82F6, #2563EB, #111827, #E5E7EB, #3B82F6, #3B82F6, #F3F4F6, #9CA3AF, #F9FAFB, #6B7280, #EF4444. Use OKLCH-based semantic tokens instead
6. RGB/HSL colors in src/modules/intake/ui/step1-demographics/components/Step1SkinScope.tsx: rgb(0 0 0 / 0.1), rgb(0 0 0 / 0.1), rgba(255, 255, 255, 1), rgb(0 0 0 / 0.1), rgb(0 0 0 / 0.1). Use OKLCH-based semantic tokens for accessibility
7. Excessive hardcoded spacing in src/shared/ui/primitives/DatePicker/index.tsx: 9, 9, 9, 9, 9. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding

**Resolution**: Replace hardcoded values with semantic tokens from Tailwind allowlist


## 📋 Configuration Status

- **SoC Manifest**: ✅ Custom
- **RLS Manifest**: ✅ Custom
- **Tailwind Allowlist**: ✅ Custom

## 📚 Health Philosophy References

- **[IMPLEMENTATION_GUIDE.md](../../docs/IMPLEMENTATION_GUIDE.md)**: Architecture and layer boundaries
- **[CLAUDE.md](../../CLAUDE.md)**: AUDIT-FIRST workflow and templates
- **[SENTINEL_PRECHECKLIST.md](../../docs/SENTINEL_PRECHECKLIST.md)**: Exhaustive validation protocols

## 🔧 Next Steps


### ❌ Violations Must Be Fixed

1. **Review each violation** listed above with its specific resolution steps
2. **Update your code** to address the Health philosophy violations
3. **Re-run validation**: `npm run health:guard` (fast) or `npm run health:guard:verbose` (full)
4. **Ensure AUDIT SUMMARY** is complete and follows the enhanced template requirements
5. **Follow the manifest-driven rules** for SoC, RLS, and UI tokens

### 🚨 Critical Violations
The following violations are critical for healthcare compliance and must be fixed immediately:
- **NO_AUDIT**: AUDIT SUMMARY missing required section: ### 📋 Contexto de la Tarea
- **NO_AUDIT**: AUDIT SUMMARY missing required section: ### 🔍 Búsqueda por Directorios
- **NO_AUDIT**: AUDIT SUMMARY missing required section: ### 🏗️ Arquitectura & Capas
- **NO_AUDIT**: AUDIT SUMMARY missing required section: ### 🔒 RLS/Multi-tenant
- **NO_AUDIT**: AUDIT SUMMARY missing required section: ### ✅ Validación Zod
- **NO_AUDIT**: AUDIT SUMMARY missing required section: ### 🎨 UI & Accesibilidad
- **NO_AUDIT**: AUDIT SUMMARY missing required section: ### 🛡️ Wrappers BFF
- **NO_AUDIT**: AUDIT SUMMARY missing required section: ### 🚦 Go/No-Go Decision
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step1-demographics/components/intake-wizard-step1-demographics.tsx: '@/modules/intake/state' not in allowed imports. UI components and presentation logic


---

*Health Guard Sentinel v1.1 - Automated OrbiPax CMH Philosophy Enforcement*
*Enhanced with fast/full modes, allowlist validation, and manifest-driven rules*
