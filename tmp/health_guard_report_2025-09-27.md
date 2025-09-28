# Health Guard Violations Report v1.1

**Generated**: 2025-09-27T19:58:40.284Z
**Mode**: FAST
**Guard Version**: Sentinel v1.1
**Files Analyzed**: 65

## 📊 Summary

- **Total Violations**: 55
- **Violation Types**: 4
- **Status**: ❌ FAILED

⚡ **Fast Mode**: Critical gates only (pre-commit validation)

## 🚦 GATES Status

| Gate | Status | Description |
|------|--------|-------------|
| 1 - AUDIT SUMMARY | ❌ | Enhanced validation with content quality checks |
| 2 - PATH VALIDATION | ❌ | Confirmed imports and TypeScript aliases |
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


### PATH_GUESS (3 occurrences)

**Impact**: Invented paths not confirmed in repository

1. Invalid import path in src/modules/legacy/intake/step7-legal-forms-consents/components/SignatureSection.tsx: @/components/ui/input
2. Invalid import path in src/modules/legacy/intake/step7-legal-forms-consents/components/SignatureSection.tsx: @/components/ui/label
3. Invalid import path in src/modules/legacy/intake/step7-legal-forms-consents/components/SignatureSection.tsx: @/lib/store/intake-form-store

**Resolution**: Verify all import paths exist in repository and use correct TypeScript aliases from tsconfig.json


### SOC_VIOLATION (30 occurrences)

**Impact**: Layer boundary violation (UI→App→Domain→Infra)

1. DOMAIN layer violation in src/modules/intake/domain/schemas/step5/currentMedications.schema.ts: '@/modules/intake/domain/types/common' not in allowed imports. Pure business logic and domain entities
2. UI layer violation in src/modules/intake/ui/step3-diagnoses-clinical/Step3DiagnosesClinical.tsx: '@/modules/intake/domain/schemas/step3' violates boundary rules. UI components and presentation logic
3. UI layer violation in src/modules/intake/ui/step3-diagnoses-clinical/Step3DiagnosesClinical.tsx: '@/modules/intake/domain/schemas/step3' not in allowed imports. UI components and presentation logic
4. UI layer violation in src/modules/intake/ui/step3-diagnoses-clinical/Step3DiagnosesClinical.tsx: '@/modules/intake/state/slices/step3' not in allowed imports. UI components and presentation logic
5. UI layer violation in src/modules/intake/ui/step3-diagnoses-clinical/components/DiagnosesSection.tsx: '@/modules/intake/actions/diagnoses.actions' not in allowed imports. UI components and presentation logic
6. UI layer violation in src/modules/intake/ui/step4-medical-providers/Step4MedicalProviders.tsx: '@/modules/intake/domain/schemas/step4' violates boundary rules. UI components and presentation logic
7. UI layer violation in src/modules/intake/ui/step4-medical-providers/Step4MedicalProviders.tsx: '@/modules/intake/domain/schemas/step4' not in allowed imports. UI components and presentation logic
8. UI layer violation in src/modules/intake/ui/step4-medical-providers/Step4MedicalProviders.tsx: '@/modules/intake/state/slices/step4' not in allowed imports. UI components and presentation logic
9. UI layer violation in src/modules/intake/ui/step4-medical-providers/components/ProvidersSection.tsx: '@/modules/intake/domain/schemas/step4' violates boundary rules. UI components and presentation logic
10. UI layer violation in src/modules/intake/ui/step4-medical-providers/components/ProvidersSection.tsx: '@/modules/intake/domain/schemas/step4' not in allowed imports. UI components and presentation logic
11. UI layer violation in src/modules/intake/ui/step4-medical-providers/components/ProvidersSection.tsx: '@/modules/intake/state/slices/step4' not in allowed imports. UI components and presentation logic
12. UI layer violation in src/modules/intake/ui/step4-medical-providers/components/PsychiatristEvaluatorSection.tsx: '@/modules/intake/state/slices/step4' not in allowed imports. UI components and presentation logic
13. UI layer violation in src/modules/intake/ui/step4-medical-providers/components/PsychiatristEvaluatorSection.tsx: '@/modules/intake/domain/schemas/step4' violates boundary rules. UI components and presentation logic
14. UI layer violation in src/modules/intake/ui/step4-medical-providers/components/PsychiatristEvaluatorSection.tsx: '@/modules/intake/domain/schemas/step4' not in allowed imports. UI components and presentation logic
15. UI layer violation in src/modules/intake/ui/step5-medications/Step5Medications.tsx: '@/modules/intake/domain/schemas/step5' violates boundary rules. UI components and presentation logic
16. UI layer violation in src/modules/intake/ui/step5-medications/Step5Medications.tsx: '@/modules/intake/domain/schemas/step5' not in allowed imports. UI components and presentation logic
17. UI layer violation in src/modules/intake/ui/step5-medications/Step5Medications.tsx: '@/modules/intake/state/slices/step5' not in allowed imports. UI components and presentation logic
18. UI layer violation in src/modules/intake/ui/step5-medications/components/CurrentMedicationsSection.tsx: '@/modules/intake/domain/schemas/step5/currentMedications.schema' violates boundary rules. UI components and presentation logic
19. UI layer violation in src/modules/intake/ui/step5-medications/components/CurrentMedicationsSection.tsx: '@/modules/intake/domain/schemas/step5/currentMedications.schema' not in allowed imports. UI components and presentation logic
20. UI layer violation in src/modules/intake/ui/step5-medications/components/CurrentMedicationsSection.tsx: '@/modules/intake/domain/types/common' violates boundary rules. UI components and presentation logic
21. UI layer violation in src/modules/intake/ui/step5-medications/components/CurrentMedicationsSection.tsx: '@/modules/intake/domain/types/common' not in allowed imports. UI components and presentation logic
22. UI layer violation in src/modules/intake/ui/step5-medications/components/CurrentMedicationsSection.tsx: '@/modules/intake/state/slices/step5/currentMedications.ui.slice' not in allowed imports. UI components and presentation logic
23. UI layer violation in src/modules/intake/ui/step5-medications/components/PharmacyInformationSection.tsx: '@/modules/intake/domain/schemas/step5/pharmacyInformation.schema' violates boundary rules. UI components and presentation logic
24. UI layer violation in src/modules/intake/ui/step5-medications/components/PharmacyInformationSection.tsx: '@/modules/intake/domain/schemas/step5/pharmacyInformation.schema' not in allowed imports. UI components and presentation logic
25. UI layer violation in src/modules/intake/ui/step5-medications/components/PharmacyInformationSection.tsx: '@/modules/intake/state/slices/step5/pharmacyInformation.ui.slice' not in allowed imports. UI components and presentation logic
26. UI layer violation in src/modules/intake/ui/step7-legal-consents/Step7LegalConsents.tsx: '@/modules/intake/domain/schemas/step7-legal-consents/legalConsents.schema' violates boundary rules. UI components and presentation logic
27. UI layer violation in src/modules/intake/ui/step7-legal-consents/Step7LegalConsents.tsx: '@/modules/intake/domain/schemas/step7-legal-consents/legalConsents.schema' not in allowed imports. UI components and presentation logic
28. UI layer violation in src/modules/intake/ui/step8-treatment-goals/components/TreatmentGoalsSection.tsx: '@/modules/intake/actions/goals.actions' not in allowed imports. UI components and presentation logic
29. UI layer violation in src/modules/intake/ui/wizard-content.tsx: '@/modules/intake/state' not in allowed imports. UI components and presentation logic
30. UI layer violation in tests/unit/modules/intake/ui/DiagnosesSection.code.test.tsx: '@/modules/intake/ui/step3-diagnoses-clinical/components/DiagnosesSection' not in allowed imports. UI components and presentation logic

**Resolution**: Respect layer boundaries: UI→Application→Domain→Infrastructure. Check SoC manifest rules


### UI_HARDCODE (14 occurrences)

**Impact**: Hardcoded colors/tokens instead of semantic Tailwind v4

1. Excessive hardcoded spacing in src/modules/intake/ui/step3-diagnoses-clinical/components/DiagnosesSection.tsx: 5, 5, 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
2. Excessive hardcoded spacing in src/modules/intake/ui/step3-diagnoses-clinical/components/FunctionalAssessmentSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
3. Excessive hardcoded spacing in src/modules/intake/ui/step3-diagnoses-clinical/components/PsychiatricEvaluationSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
4. Excessive hardcoded spacing in src/modules/intake/ui/step4-medical-providers/components/ProvidersSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
5. Excessive hardcoded spacing in src/modules/intake/ui/step4-medical-providers/components/PsychiatristEvaluatorSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
6. Hardcoded colors in src/modules/intake/ui/step5-medications/components/CurrentMedicationsSection.tsx: amber-200, amber-50, amber-600, amber-800. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
7. Excessive hardcoded spacing in src/modules/intake/ui/step5-medications/components/CurrentMedicationsSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
8. Excessive hardcoded spacing in src/modules/intake/ui/step5-medications/components/PharmacyInformationSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
9. Excessive hardcoded spacing in src/modules/intake/ui/step6-referrals-services/components/ExternalReferralsSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
10. Excessive hardcoded spacing in src/modules/intake/ui/step6-referrals-services/components/InternalServiceReferralsSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
11. Excessive hardcoded spacing in src/modules/intake/ui/step6-referrals-services/components/TreatmentHistorySection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
12. Excessive hardcoded spacing in src/modules/intake/ui/step7-legal-consents/Step7LegalConsents.tsx: 5, 5, 5, 5, 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
13. Excessive hardcoded spacing in src/modules/intake/ui/step8-treatment-goals/components/PriorityAreasSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
14. Excessive hardcoded spacing in src/modules/intake/ui/step8-treatment-goals/components/TreatmentGoalsSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding

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
- **SOC_VIOLATION**: DOMAIN layer violation in src/modules/intake/domain/schemas/step5/currentMedications.schema.ts: '@/modules/intake/domain/types/common' not in allowed imports. Pure business logic and domain entities
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step3-diagnoses-clinical/Step3DiagnosesClinical.tsx: '@/modules/intake/domain/schemas/step3' violates boundary rules. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step3-diagnoses-clinical/Step3DiagnosesClinical.tsx: '@/modules/intake/domain/schemas/step3' not in allowed imports. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step3-diagnoses-clinical/Step3DiagnosesClinical.tsx: '@/modules/intake/state/slices/step3' not in allowed imports. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step3-diagnoses-clinical/components/DiagnosesSection.tsx: '@/modules/intake/actions/diagnoses.actions' not in allowed imports. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step4-medical-providers/Step4MedicalProviders.tsx: '@/modules/intake/domain/schemas/step4' violates boundary rules. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step4-medical-providers/Step4MedicalProviders.tsx: '@/modules/intake/domain/schemas/step4' not in allowed imports. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step4-medical-providers/Step4MedicalProviders.tsx: '@/modules/intake/state/slices/step4' not in allowed imports. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step4-medical-providers/components/ProvidersSection.tsx: '@/modules/intake/domain/schemas/step4' violates boundary rules. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step4-medical-providers/components/ProvidersSection.tsx: '@/modules/intake/domain/schemas/step4' not in allowed imports. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step4-medical-providers/components/ProvidersSection.tsx: '@/modules/intake/state/slices/step4' not in allowed imports. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step4-medical-providers/components/PsychiatristEvaluatorSection.tsx: '@/modules/intake/state/slices/step4' not in allowed imports. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step4-medical-providers/components/PsychiatristEvaluatorSection.tsx: '@/modules/intake/domain/schemas/step4' violates boundary rules. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step4-medical-providers/components/PsychiatristEvaluatorSection.tsx: '@/modules/intake/domain/schemas/step4' not in allowed imports. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step5-medications/Step5Medications.tsx: '@/modules/intake/domain/schemas/step5' violates boundary rules. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step5-medications/Step5Medications.tsx: '@/modules/intake/domain/schemas/step5' not in allowed imports. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step5-medications/Step5Medications.tsx: '@/modules/intake/state/slices/step5' not in allowed imports. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step5-medications/components/CurrentMedicationsSection.tsx: '@/modules/intake/domain/schemas/step5/currentMedications.schema' violates boundary rules. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step5-medications/components/CurrentMedicationsSection.tsx: '@/modules/intake/domain/schemas/step5/currentMedications.schema' not in allowed imports. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step5-medications/components/CurrentMedicationsSection.tsx: '@/modules/intake/domain/types/common' violates boundary rules. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step5-medications/components/CurrentMedicationsSection.tsx: '@/modules/intake/domain/types/common' not in allowed imports. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step5-medications/components/CurrentMedicationsSection.tsx: '@/modules/intake/state/slices/step5/currentMedications.ui.slice' not in allowed imports. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step5-medications/components/PharmacyInformationSection.tsx: '@/modules/intake/domain/schemas/step5/pharmacyInformation.schema' violates boundary rules. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step5-medications/components/PharmacyInformationSection.tsx: '@/modules/intake/domain/schemas/step5/pharmacyInformation.schema' not in allowed imports. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step5-medications/components/PharmacyInformationSection.tsx: '@/modules/intake/state/slices/step5/pharmacyInformation.ui.slice' not in allowed imports. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step7-legal-consents/Step7LegalConsents.tsx: '@/modules/intake/domain/schemas/step7-legal-consents/legalConsents.schema' violates boundary rules. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step7-legal-consents/Step7LegalConsents.tsx: '@/modules/intake/domain/schemas/step7-legal-consents/legalConsents.schema' not in allowed imports. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/step8-treatment-goals/components/TreatmentGoalsSection.tsx: '@/modules/intake/actions/goals.actions' not in allowed imports. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/wizard-content.tsx: '@/modules/intake/state' not in allowed imports. UI components and presentation logic
- **SOC_VIOLATION**: UI layer violation in tests/unit/modules/intake/ui/DiagnosesSection.code.test.tsx: '@/modules/intake/ui/step3-diagnoses-clinical/components/DiagnosesSection' not in allowed imports. UI components and presentation logic


---

*Health Guard Sentinel v1.1 - Automated OrbiPax CMH Philosophy Enforcement*
*Enhanced with fast/full modes, allowlist validation, and manifest-driven rules*
