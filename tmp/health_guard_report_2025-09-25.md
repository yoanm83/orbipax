# Health Guard Violations Report v1.1

**Generated**: 2025-09-25T04:15:15.391Z
**Mode**: FAST
**Guard Version**: Sentinel v1.1
**Files Analyzed**: 12

## 📊 Summary

- **Total Violations**: 18
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


### NO_AUDIT (9 occurrences)

**Impact**: AUDIT SUMMARY missing or incomplete

1. AUDIT SUMMARY is stale (26 hours old). Create fresh audit for current changes
2. AUDIT SUMMARY missing required section: ### 📋 Contexto de la Tarea
3. AUDIT SUMMARY missing required section: ### 🔍 Búsqueda por Directorios
4. AUDIT SUMMARY missing required section: ### 🏗️ Arquitectura & Capas
5. AUDIT SUMMARY missing required section: ### 🔒 RLS/Multi-tenant
6. AUDIT SUMMARY missing required section: ### ✅ Validación Zod
7. AUDIT SUMMARY missing required section: ### 🎨 UI & Accesibilidad
8. AUDIT SUMMARY missing required section: ### 🛡️ Wrappers BFF
9. AUDIT SUMMARY missing required section: ### 🚦 Go/No-Go Decision

**Resolution**: Create complete AUDIT SUMMARY in /tmp using CLAUDE.md template with all 8 required sections


### SOC_VIOLATION (3 occurrences)

**Impact**: Layer boundary violation (UI→App→Domain→Infra)

1. UI layer violation in src/modules/intake/ui/step1-demographics/components/intake-wizard-step1-demographics.tsx: '@/modules/intake/state' not in allowed imports. UI components and presentation logic
2. UI layer violation in src/modules/intake/ui/step2-eligibility-insurance/Step2EligibilityInsurance.tsx: '@/modules/intake/state' not in allowed imports. UI components and presentation logic
3. UI layer violation in src/modules/intake/ui/wizard-content.tsx: '@/modules/intake/state' not in allowed imports. UI components and presentation logic

**Resolution**: Respect layer boundaries: UI→Application→Domain→Infrastructure. Check SoC manifest rules


### UI_HARDCODE (6 occurrences)

**Impact**: Hardcoded colors/tokens instead of semantic Tailwind v4

1. Hardcoded colors in src/modules/intake/ui/enhanced-wizard-tabs.tsx: green-500, green-600. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
2. Excessive hardcoded spacing in src/modules/intake/ui/enhanced-wizard-tabs.tsx: 11, 11, 11, 11, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
3. Excessive hardcoded spacing in src/modules/intake/ui/step2-eligibility-insurance/components/AuthorizationsSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
4. Excessive hardcoded spacing in src/modules/intake/ui/step2-eligibility-insurance/components/EligibilityRecordsSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
5. Excessive hardcoded spacing in src/modules/intake/ui/step2-eligibility-insurance/components/GovernmentCoverageSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
6. Excessive hardcoded spacing in src/modules/intake/ui/step2-eligibility-insurance/components/InsuranceRecordsSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding

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
- **NO_AUDIT**: AUDIT SUMMARY is stale (26 hours old). Create fresh audit for current changes
- **NO_AUDIT**: AUDIT SUMMARY missing required section: ### 📋 Contexto de la Tarea
- **NO_AUDIT**: AUDIT SUMMARY missing required section: ### 🔍 Búsqueda por Directorios
- **NO_AUDIT**: AUDIT SUMMARY missing required section: ### 🏗️ Arquitectura & Capas
- **NO_AUDIT**: AUDIT SUMMARY missing required section: ### 🔒 RLS/Multi-tenant
- **NO_AUDIT**: AUDIT SUMMARY missing required section: ### ✅ Validación Zod
- **NO_AUDIT**: AUDIT SUMMARY missing required section: ### 🎨 UI & Accesibilidad
- **NO_AUDIT**: AUDIT SUMMARY missing required section: ### 🛡️ Wrappers BFF
- **NO_AUDIT**: AUDIT SUMMARY missing required section: ### 🚦 Go/No-Go Decision
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step1-demographics/components/intake-wizard-step1-demographics.tsx: '@/modules/intake/state' not in allowed imports. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step2-eligibility-insurance/Step2EligibilityInsurance.tsx: '@/modules/intake/state' not in allowed imports. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/wizard-content.tsx: '@/modules/intake/state' not in allowed imports. UI components and presentation logic


---

*Health Guard Sentinel v1.1 - Automated OrbiPax CMH Philosophy Enforcement*
*Enhanced with fast/full modes, allowlist validation, and manifest-driven rules*
