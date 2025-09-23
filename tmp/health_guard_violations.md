# Health Guard Violations Report v1.1

**Generated**: 2025-09-22T22:51:23.418Z
**Mode**: FULL
**Guard Version**: Sentinel v1.1
**Files Analyzed**: 7

## 📊 Summary

- **Total Violations**: 36
- **Violation Types**: 8
- **Status**: ❌ FAILED

🔍 **Full Mode**: Complete validation (pre-push/CI)

## 🚦 GATES Status

| Gate | Status | Description |
|------|--------|-------------|
| 1 - AUDIT SUMMARY | ❌ | Enhanced validation with content quality checks |
| 2 - PATH VALIDATION | ❌ | Confirmed imports and TypeScript aliases |
| 3 - DUPLICATE DETECTION | ✅ | No duplicate components or functionality |
| 4 - SOC BOUNDARIES | ❌ | Manifest-driven layer isolation validation |
| 5 - RLS COMPLIANCE | ❌ | Manifest-driven organization filtering |
| 6 - UI TOKENS | ❌ | Allowlist-driven semantic token validation |
| 7 - ACCESSIBILITY | ❌ | WCAG 2.1 AA compliance |
| 8 - ZOD VALIDATION | ❌ | Zod schemas for forms and APIs |
| 9 - BFF WRAPPERS | ❌ | Correct security wrapper order |

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


### PATH_GUESS (6 occurrences)

**Impact**: Invented paths not confirmed in repository

1. Invalid import path in scripts/sentinel/_smoke/ui/components/ViolationPathGuess.tsx: @/modules/nonexistent/application/services
2. Invalid import path in scripts/sentinel/_smoke/ui/components/ViolationPathGuess.tsx: @/lib/fake-utility
3. Invalid import path in scripts/sentinel/_smoke/ui/components/ViolationPathGuess.tsx: @/shared/ui/invented-component
4. Invalid import path in scripts/sentinel/_smoke/ui/components/ViolationSoC.tsx: @/modules/patient/domain/entities/Patient
5. Invalid import path in scripts/sentinel/_smoke/ui/components/ViolationSoC.tsx: @/modules/patient/infrastructure/database/connection
6. Invalid import path in scripts/sentinel/_smoke/ui/components/ViolationSoC.tsx: @/modules/patient/infrastructure/repositories/PatientRepository

**Resolution**: Verify all import paths exist in repository and use correct TypeScript aliases from tsconfig.json


### SOC_VIOLATION (6 occurrences)

**Impact**: Layer boundary violation (UI→App→Domain→Infra)

1. UI layer violation in scripts/sentinel/_smoke/ui/components/ViolationSoC.tsx: '@/modules/patient/domain/entities/Patient' violates boundary rules. UI components and presentation logic
2. UI layer violation in scripts/sentinel/_smoke/ui/components/ViolationSoC.tsx: '@/modules/patient/domain/entities/Patient' not in allowed imports. UI components and presentation logic
3. UI layer violation in scripts/sentinel/_smoke/ui/components/ViolationSoC.tsx: '@/modules/patient/infrastructure/database/connection' violates boundary rules. UI components and presentation logic
4. UI layer violation in scripts/sentinel/_smoke/ui/components/ViolationSoC.tsx: '@/modules/patient/infrastructure/database/connection' not in allowed imports. UI components and presentation logic
5. UI layer violation in scripts/sentinel/_smoke/ui/components/ViolationSoC.tsx: '@/modules/patient/infrastructure/repositories/PatientRepository' violates boundary rules. UI components and presentation logic
6. UI layer violation in scripts/sentinel/_smoke/ui/components/ViolationSoC.tsx: '@/modules/patient/infrastructure/repositories/PatientRepository' not in allowed imports. UI components and presentation logic

**Resolution**: Respect layer boundaries: UI→Application→Domain→Infrastructure. Check SoC manifest rules


### RLS_RISK (6 occurrences)

**Impact**: Missing organization_id filtering or RLS violation

1. Explicit RLS bypass detected in scripts/sentinel/_smoke/infrastructure/repositories/ViolationRLS.ts for 'patients'. This is dangerous for PHI protection
2. Clinical entity 'appointments' in scripts/sentinel/_smoke/infrastructure/repositories/ViolationRLS.ts missing required filters: patient_id, facility_id. Add patient_id filtering and facility_id filtering for HIPAA compliance
3. Explicit RLS bypass detected in scripts/sentinel/_smoke/infrastructure/repositories/ViolationRLS.ts for 'appointments'. This is dangerous for PHI protection
4. Clinical entity 'notes' in scripts/sentinel/_smoke/infrastructure/repositories/ViolationRLS.ts missing required filters: provider_id, patient_id. Add provider_id filtering and patient_id filtering for HIPAA compliance
5. Explicit RLS bypass detected in scripts/sentinel/_smoke/infrastructure/repositories/ViolationRLS.ts for 'notes'. This is dangerous for PHI protection
6. Cross-table JOIN in scripts/sentinel/_smoke/infrastructure/repositories/ViolationRLS.ts may leak data across organizations. Ensure organization_id filtering in JOIN conditions

**Resolution**: Add organization_id filtering for clinical data access. Follow RLS manifest requirements


### UI_HARDCODE (3 occurrences)

**Impact**: Hardcoded colors/tokens instead of semantic Tailwind v4

1. Hardcoded colors in scripts/sentinel/_smoke/ui/components/ViolationUIHardcode.tsx: red-500, blue-600, green-400, purple-800, yellow-300, indigo-700, slate-900, zinc-300. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
2. Hex colors in scripts/sentinel/_smoke/ui/components/ViolationUIHardcode.tsx: #ff0000. Use OKLCH-based semantic tokens instead
3. RGB/HSL colors in scripts/sentinel/_smoke/ui/components/ViolationUIHardcode.tsx: rgb(255, 255, 255), hsl(120, 100%, 50%). Use OKLCH-based semantic tokens for accessibility

**Resolution**: Replace hardcoded values with semantic tokens from Tailwind allowlist


### A11Y_FAIL (5 occurrences)

**Impact**: Missing accessibility requirements (WCAG 2.1 AA)

1. Interactive elements in scripts/sentinel/_smoke/ui/components/ViolationNoZod.tsx missing ARIA labels
2. Interactive elements in scripts/sentinel/_smoke/ui/components/ViolationNoZod.tsx missing focus styles
3. Interactive elements in scripts/sentinel/_smoke/ui/components/ViolationUIHardcode.tsx missing ARIA labels
4. Interactive elements in scripts/sentinel/_smoke/ui/components/ViolationUIHardcode.tsx missing focus styles
5. Touch targets in scripts/sentinel/_smoke/ui/components/ViolationUIHardcode.tsx smaller than 44px: min-h-[20px]

**Resolution**: Add ARIA labels, focus styles, and ensure 44px minimum touch targets for healthcare accessibility


### NO_ZOD_SCHEMA (1 occurrence)

**Impact**: Validation without Zod schema

1. API endpoint in scripts/sentinel/_smoke/api/actions/ViolationWrappers.ts missing Zod validation

**Resolution**: Implement Zod validation schemas for all forms and API endpoints handling clinical data


### WRAPPERS_MISSING (1 occurrence)

**Impact**: Missing or incorrect BFF wrapper order

1. API endpoint in scripts/sentinel/_smoke/api/actions/ViolationNoZodAPI.ts missing wrappers: withAuth, withSecurity, withRateLimit, withAudit

**Resolution**: Add BFF security wrappers in correct order: withAuth→withSecurity→withRateLimit→withAudit


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
- **SOC_VIOLATION**: UI layer violation in scripts/sentinel/_smoke/ui/components/ViolationSoC.tsx: '@/modules/patient/domain/entities/Patient' violates boundary rules. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in scripts/sentinel/_smoke/ui/components/ViolationSoC.tsx: '@/modules/patient/domain/entities/Patient' not in allowed imports. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in scripts/sentinel/_smoke/ui/components/ViolationSoC.tsx: '@/modules/patient/infrastructure/database/connection' violates boundary rules. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in scripts/sentinel/_smoke/ui/components/ViolationSoC.tsx: '@/modules/patient/infrastructure/database/connection' not in allowed imports. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in scripts/sentinel/_smoke/ui/components/ViolationSoC.tsx: '@/modules/patient/infrastructure/repositories/PatientRepository' violates boundary rules. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in scripts/sentinel/_smoke/ui/components/ViolationSoC.tsx: '@/modules/patient/infrastructure/repositories/PatientRepository' not in allowed imports. UI components and presentation logic
- **RLS_RISK**: Explicit RLS bypass detected in scripts/sentinel/_smoke/infrastructure/repositories/ViolationRLS.ts for 'patients'. This is dangerous for PHI protection
- **RLS_RISK**: Clinical entity 'appointments' in scripts/sentinel/_smoke/infrastructure/repositories/ViolationRLS.ts missing required filters: patient_id, facility_id. Add patient_id filtering and facility_id filtering for HIPAA compliance
- **RLS_RISK**: Explicit RLS bypass detected in scripts/sentinel/_smoke/infrastructure/repositories/ViolationRLS.ts for 'appointments'. This is dangerous for PHI protection
- **RLS_RISK**: Clinical entity 'notes' in scripts/sentinel/_smoke/infrastructure/repositories/ViolationRLS.ts missing required filters: provider_id, patient_id. Add provider_id filtering and patient_id filtering for HIPAA compliance
- **RLS_RISK**: Explicit RLS bypass detected in scripts/sentinel/_smoke/infrastructure/repositories/ViolationRLS.ts for 'notes'. This is dangerous for PHI protection
- **RLS_RISK**: Cross-table JOIN in scripts/sentinel/_smoke/infrastructure/repositories/ViolationRLS.ts may leak data across organizations. Ensure organization_id filtering in JOIN conditions


---

*Health Guard Sentinel v1.1 - Automated OrbiPax CMH Philosophy Enforcement*
*Enhanced with fast/full modes, allowlist validation, and manifest-driven rules*
