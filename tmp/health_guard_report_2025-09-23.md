# Health Guard Violations Report v1.1

**Generated**: 2025-09-23T06:33:09.795Z
**Mode**: FAST
**Guard Version**: Sentinel v1.1
**Files Analyzed**: 105

## 📊 Summary

- **Total Violations**: 222
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


### PATH_GUESS (176 occurrences)

**Impact**: Invented paths not confirmed in repository

1. Invalid import path in src/modules/intake/ui/review-submit/components/ReviewStatusSection.tsx: @/components/ui/card
2. Invalid import path in src/modules/intake/ui/review-submit/components/SubmissionSection.tsx: @/components/ui/button
3. Invalid import path in src/modules/intake/ui/review-submit/components/SubmissionSection.tsx: @/components/ui/card
4. Invalid import path in src/modules/intake/ui/review-submit/components/SubmissionSection.tsx: @/components/ui/input
5. Invalid import path in src/modules/intake/ui/review-submit/components/SubmissionSection.tsx: @/components/ui/label
6. Invalid import path in src/modules/intake/ui/review-submit/components/SubmissionSection.tsx: @/components/ui/checkbox
7. Invalid import path in src/modules/intake/ui/review-submit/components/SubmissionSection.tsx: @/components/ui/alert
8. Invalid import path in src/modules/intake/ui/review-submit/components/intake-review-submit.tsx: @/components/ui/button
9. Invalid import path in src/modules/intake/ui/review-submit/components/intake-review-submit.tsx: @/components/ui/card
10. Invalid import path in src/modules/intake/ui/review-submit/components/intake-review-submit.tsx: @/components/ui/input
11. Invalid import path in src/modules/intake/ui/review-submit/components/intake-review-submit.tsx: @/components/ui/label
12. Invalid import path in src/modules/intake/ui/review-submit/components/intake-review-submit.tsx: @/components/ui/alert
13. Invalid import path in src/modules/intake/ui/review-submit/components/intake-review-submit.tsx: @/components/ui/checkbox
14. Invalid import path in src/modules/intake/ui/review-submit/components/intake-review-submit.tsx: @/components/ui/accordion
15. Invalid import path in src/modules/intake/ui/review-submit/components/intake-review-submit.tsx: @/lib/store/intake-form-store
16. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/AuthorizationsSection.tsx: @/components/ui/button
17. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/AuthorizationsSection.tsx: @/components/ui/card
18. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/AuthorizationsSection.tsx: @/components/ui/label
19. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/AuthorizationsSection.tsx: @/components/ui/select
20. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/AuthorizationsSection.tsx: @/components/ui/input
21. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/AuthorizationsSection.tsx: @/components/ui/textarea
22. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/AuthorizationsSection.tsx: @/components/ui/popover
23. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/AuthorizationsSection.tsx: @/lib/utils
24. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/AuthorizationsSection.tsx: @/components/ui/custom-calendar
25. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/EligibilityRecordsSection.tsx: @/components/ui/button
26. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/EligibilityRecordsSection.tsx: @/components/ui/card
27. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/EligibilityRecordsSection.tsx: @/components/ui/label
28. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/EligibilityRecordsSection.tsx: @/components/ui/select
29. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/EligibilityRecordsSection.tsx: @/components/ui/popover
30. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/EligibilityRecordsSection.tsx: @/lib/utils
31. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/EligibilityRecordsSection.tsx: @/components/ui/custom-calendar
32. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/GovernmentCoverageSection.tsx: @/components/ui/button
33. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/GovernmentCoverageSection.tsx: @/components/ui/card
34. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/GovernmentCoverageSection.tsx: @/components/ui/input
35. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/GovernmentCoverageSection.tsx: @/components/ui/label
36. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/GovernmentCoverageSection.tsx: @/components/ui/popover
37. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/GovernmentCoverageSection.tsx: @/lib/utils
38. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/GovernmentCoverageSection.tsx: @/components/ui/custom-calendar
39. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/InsuranceRecordsSection.tsx: @/components/ui/button
40. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/InsuranceRecordsSection.tsx: @/components/ui/card
41. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/InsuranceRecordsSection.tsx: @/components/ui/label
42. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/InsuranceRecordsSection.tsx: @/components/ui/select
43. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/InsuranceRecordsSection.tsx: @/components/ui/input
44. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/InsuranceRecordsSection.tsx: @/components/ui/popover
45. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/InsuranceRecordsSection.tsx: @/lib/utils
46. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/InsuranceRecordsSection.tsx: @/components/ui/custom-calendar
47. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/components/ui/button
48. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/components/ui/card
49. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/components/ui/input
50. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/components/ui/label
51. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/components/ui/select
52. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/components/ui/switch
53. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/components/ui/popover
54. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/components/ui/calendar
55. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/lib/utils
56. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/components/ui/alert
57. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/components/ui/custom-calendar
58. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/lib/store/intake-form-store
59. Invalid import path in src/modules/intake/ui/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/components/ui/textarea
60. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: @/components/ui/button
61. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: @/components/ui/card
62. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: @/components/ui/input
63. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: @/components/ui/label
64. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: @/components/ui/select
65. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: @/components/ui/switch
66. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: @/components/ui/popover
67. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: @/components/ui/textarea
68. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: @/lib/utils
69. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: @/components/ui/custom-calendar
70. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: @/lib/store/intake-form-store
71. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/FunctionalAssessmentSection.tsx: @/components/ui/button
72. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/FunctionalAssessmentSection.tsx: @/components/ui/card
73. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/FunctionalAssessmentSection.tsx: @/components/ui/label
74. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/FunctionalAssessmentSection.tsx: @/components/ui/select
75. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/FunctionalAssessmentSection.tsx: @/components/ui/switch
76. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/FunctionalAssessmentSection.tsx: @/components/ui/textarea
77. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/FunctionalAssessmentSection.tsx: @/lib/utils
78. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/FunctionalAssessmentSection.tsx: @/components/ui/checkbox
79. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/FunctionalAssessmentSection.tsx: @/lib/store/intake-form-store
80. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/PsychiatricEvaluationSection.tsx: @/components/ui/button
81. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/PsychiatricEvaluationSection.tsx: @/components/ui/card
82. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/PsychiatricEvaluationSection.tsx: @/components/ui/input
83. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/PsychiatricEvaluationSection.tsx: @/components/ui/label
84. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/PsychiatricEvaluationSection.tsx: @/components/ui/select
85. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/PsychiatricEvaluationSection.tsx: @/components/ui/popover
86. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/PsychiatricEvaluationSection.tsx: @/components/ui/textarea
87. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/PsychiatricEvaluationSection.tsx: @/lib/utils
88. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/PsychiatricEvaluationSection.tsx: @/components/ui/custom-calendar
89. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/PsychiatricEvaluationSection.tsx: @/lib/store/intake-form-store
90. Invalid import path in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/intake-step3-clinical-information.tsx: @/lib/store/intake-form-store
91. Invalid import path in src/modules/intake/ui/step4-medical-providers/components/PrimaryCareProviderSection.tsx: @/components/ui/card
92. Invalid import path in src/modules/intake/ui/step4-medical-providers/components/PrimaryCareProviderSection.tsx: @/components/ui/input
93. Invalid import path in src/modules/intake/ui/step4-medical-providers/components/PrimaryCareProviderSection.tsx: @/components/ui/label
94. Invalid import path in src/modules/intake/ui/step4-medical-providers/components/PrimaryCareProviderSection.tsx: @/components/ui/select
95. Invalid import path in src/modules/intake/ui/step4-medical-providers/components/PrimaryCareProviderSection.tsx: @/components/ui/checkbox
96. Invalid import path in src/modules/intake/ui/step4-medical-providers/components/PrimaryCareProviderSection.tsx: @/lib/utils
97. Invalid import path in src/modules/intake/ui/step4-medical-providers/components/PrimaryCareProviderSection.tsx: @/lib/store/intake-form-store
98. Invalid import path in src/modules/intake/ui/step4-medical-providers/components/PsychiatristSection.tsx: @/components/ui/card
99. Invalid import path in src/modules/intake/ui/step4-medical-providers/components/PsychiatristSection.tsx: @/components/ui/input
100. Invalid import path in src/modules/intake/ui/step4-medical-providers/components/PsychiatristSection.tsx: @/components/ui/label
101. Invalid import path in src/modules/intake/ui/step4-medical-providers/components/PsychiatristSection.tsx: @/components/ui/select
102. Invalid import path in src/modules/intake/ui/step4-medical-providers/components/PsychiatristSection.tsx: @/components/ui/switch
103. Invalid import path in src/modules/intake/ui/step4-medical-providers/components/PsychiatristSection.tsx: @/components/ui/popover
104. Invalid import path in src/modules/intake/ui/step4-medical-providers/components/PsychiatristSection.tsx: @/components/ui/button
105. Invalid import path in src/modules/intake/ui/step4-medical-providers/components/PsychiatristSection.tsx: @/components/ui/textarea
106. Invalid import path in src/modules/intake/ui/step4-medical-providers/components/PsychiatristSection.tsx: @/lib/utils
107. Invalid import path in src/modules/intake/ui/step4-medical-providers/components/PsychiatristSection.tsx: @/components/ui/custom-calendar
108. Invalid import path in src/modules/intake/ui/step4-medical-providers/components/PsychiatristSection.tsx: @/lib/store/intake-form-store
109. Invalid import path in src/modules/intake/ui/step4-medical-providers/components/intake-step4-medical-providers.tsx: @/lib/store/intake-form-store
110. Invalid import path in src/modules/intake/ui/step5-medications-pharmacy/components/MedicationsSection.tsx: @/components/ui/button
111. Invalid import path in src/modules/intake/ui/step5-medications-pharmacy/components/MedicationsSection.tsx: @/components/ui/card
112. Invalid import path in src/modules/intake/ui/step5-medications-pharmacy/components/MedicationsSection.tsx: @/components/ui/input
113. Invalid import path in src/modules/intake/ui/step5-medications-pharmacy/components/MedicationsSection.tsx: @/components/ui/label
114. Invalid import path in src/modules/intake/ui/step5-medications-pharmacy/components/MedicationsSection.tsx: @/components/ui/select
115. Invalid import path in src/modules/intake/ui/step5-medications-pharmacy/components/MedicationsSection.tsx: @/components/ui/popover
116. Invalid import path in src/modules/intake/ui/step5-medications-pharmacy/components/MedicationsSection.tsx: @/components/ui/calendar
117. Invalid import path in src/modules/intake/ui/step5-medications-pharmacy/components/MedicationsSection.tsx: @/lib/utils
118. Invalid import path in src/modules/intake/ui/step5-medications-pharmacy/components/MedicationsSection.tsx: @/components/ui/alert
119. Invalid import path in src/modules/intake/ui/step5-medications-pharmacy/components/MedicationsSection.tsx: @/lib/store/intake-form-store
120. Invalid import path in src/modules/intake/ui/step5-medications-pharmacy/components/PharmacySection.tsx: @/components/ui/card
121. Invalid import path in src/modules/intake/ui/step5-medications-pharmacy/components/PharmacySection.tsx: @/components/ui/input
122. Invalid import path in src/modules/intake/ui/step5-medications-pharmacy/components/PharmacySection.tsx: @/components/ui/label
123. Invalid import path in src/modules/intake/ui/step5-medications-pharmacy/components/PharmacySection.tsx: @/lib/utils
124. Invalid import path in src/modules/intake/ui/step5-medications-pharmacy/components/PharmacySection.tsx: @/lib/store/intake-form-store
125. Invalid import path in src/modules/intake/ui/step5-medications-pharmacy/components/intake-step5-medications-pharmacy.tsx: @/lib/store/intake-form-store
126. Invalid import path in src/modules/intake/ui/step6-referrals-service/components/ExternalReferralsSection.tsx: @/components/ui/card
127. Invalid import path in src/modules/intake/ui/step6-referrals-service/components/ExternalReferralsSection.tsx: @/components/ui/input
128. Invalid import path in src/modules/intake/ui/step6-referrals-service/components/ExternalReferralsSection.tsx: @/components/ui/label
129. Invalid import path in src/modules/intake/ui/step6-referrals-service/components/ExternalReferralsSection.tsx: @/components/ui/select
130. Invalid import path in src/modules/intake/ui/step6-referrals-service/components/ExternalReferralsSection.tsx: @/components/ui/checkbox
131. Invalid import path in src/modules/intake/ui/step6-referrals-service/components/ExternalReferralsSection.tsx: @/lib/utils
132. Invalid import path in src/modules/intake/ui/step6-referrals-service/components/ExternalReferralsSection.tsx: @/lib/store/intake-form-store
133. Invalid import path in src/modules/intake/ui/step6-referrals-service/components/InternalServicesSection.tsx: @/components/ui/card
134. Invalid import path in src/modules/intake/ui/step6-referrals-service/components/InternalServicesSection.tsx: @/components/ui/input
135. Invalid import path in src/modules/intake/ui/step6-referrals-service/components/InternalServicesSection.tsx: @/components/ui/label
136. Invalid import path in src/modules/intake/ui/step6-referrals-service/components/InternalServicesSection.tsx: @/components/ui/select
137. Invalid import path in src/modules/intake/ui/step6-referrals-service/components/InternalServicesSection.tsx: @/components/ui/textarea
138. Invalid import path in src/modules/intake/ui/step6-referrals-service/components/InternalServicesSection.tsx: @/lib/utils
139. Invalid import path in src/modules/intake/ui/step6-referrals-service/components/InternalServicesSection.tsx: @/lib/store/intake-form-store
140. Invalid import path in src/modules/intake/ui/step6-referrals-service/components/InternalServicesSection.tsx: @/components/multi-select
141. Invalid import path in src/modules/intake/ui/step6-referrals-service/components/TreatmentHistorySection.tsx: @/components/ui/card
142. Invalid import path in src/modules/intake/ui/step6-referrals-service/components/TreatmentHistorySection.tsx: @/components/ui/label
143. Invalid import path in src/modules/intake/ui/step6-referrals-service/components/TreatmentHistorySection.tsx: @/components/ui/select
144. Invalid import path in src/modules/intake/ui/step6-referrals-service/components/TreatmentHistorySection.tsx: @/components/ui/textarea
145. Invalid import path in src/modules/intake/ui/step6-referrals-service/components/TreatmentHistorySection.tsx: @/lib/utils
146. Invalid import path in src/modules/intake/ui/step6-referrals-service/components/TreatmentHistorySection.tsx: @/lib/store/intake-form-store
147. Invalid import path in src/modules/intake/ui/step6-referrals-service/components/intake-step6-referrals-service.tsx: @/lib/store/intake-form-store
148. Invalid import path in src/modules/intake/ui/step7-legal-forms-consents/components/ClientTypeSection.tsx: @/components/ui/checkbox
149. Invalid import path in src/modules/intake/ui/step7-legal-forms-consents/components/ClientTypeSection.tsx: @/components/ui/label
150. Invalid import path in src/modules/intake/ui/step7-legal-forms-consents/components/ClientTypeSection.tsx: @/lib/store/intake-form-store
151. Invalid import path in src/modules/intake/ui/step7-legal-forms-consents/components/FormStatusAlert.tsx: @/components/ui/alert
152. Invalid import path in src/modules/intake/ui/step7-legal-forms-consents/components/LegalFormCard.tsx: @/components/ui/button
153. Invalid import path in src/modules/intake/ui/step7-legal-forms-consents/components/LegalFormCard.tsx: @/components/ui/badge
154. Invalid import path in src/modules/intake/ui/step7-legal-forms-consents/components/LegalFormCard.tsx: @/components/ui/checkbox
155. Invalid import path in src/modules/intake/ui/step7-legal-forms-consents/components/LegalFormCard.tsx: @/components/ui/label
156. Invalid import path in src/modules/intake/ui/step7-legal-forms-consents/components/LegalFormCard.tsx: @/lib/utils
157. Invalid import path in src/modules/intake/ui/step7-legal-forms-consents/components/LegalFormCard.tsx: @/lib/store/intake-form-store
158. Invalid import path in src/modules/intake/ui/step7-legal-forms-consents/components/constants/default-legal-forms.ts: @/lib/store/intake-form-store
159. Invalid import path in src/modules/intake/ui/step7-legal-forms-consents/components/intake-step7-legal-forms-consents.tsx: @/components/ui/card
160. Invalid import path in src/modules/intake/ui/step7-legal-forms-consents/components/intake-step7-legal-forms-consents.tsx: @/lib/store/intake-form-store
161. Invalid import path in src/modules/intake/ui/step8-goals-treatment-focus/components/AiGoalSuggestionsSection.tsx: @/components/ui/button
162. Invalid import path in src/modules/intake/ui/step8-goals-treatment-focus/components/AiGoalSuggestionsSection.tsx: @/components/ui/card
163. Invalid import path in src/modules/intake/ui/step8-goals-treatment-focus/components/AiGoalSuggestionsSection.tsx: @/lib/store/intake-form-store
164. Invalid import path in src/modules/intake/ui/step8-goals-treatment-focus/components/PriorityAreasSection.tsx: @/components/ui/button
165. Invalid import path in src/modules/intake/ui/step8-goals-treatment-focus/components/PriorityAreasSection.tsx: @/components/ui/card
166. Invalid import path in src/modules/intake/ui/step8-goals-treatment-focus/components/PriorityAreasSection.tsx: @/components/ui/label
167. Invalid import path in src/modules/intake/ui/step8-goals-treatment-focus/components/PriorityAreasSection.tsx: @/components/ui/textarea
168. Invalid import path in src/modules/intake/ui/step8-goals-treatment-focus/components/PriorityAreasSection.tsx: @/components/ui/badge
169. Invalid import path in src/modules/intake/ui/step8-goals-treatment-focus/components/PriorityAreasSection.tsx: @/lib/utils
170. Invalid import path in src/modules/intake/ui/step8-goals-treatment-focus/components/PriorityAreasSection.tsx: @/lib/store/intake-form-store
171. Invalid import path in src/modules/intake/ui/step8-goals-treatment-focus/components/TreatmentGoalsSection.tsx: @/components/ui/card
172. Invalid import path in src/modules/intake/ui/step8-goals-treatment-focus/components/TreatmentGoalsSection.tsx: @/components/ui/label
173. Invalid import path in src/modules/intake/ui/step8-goals-treatment-focus/components/TreatmentGoalsSection.tsx: @/components/ui/textarea
174. Invalid import path in src/modules/intake/ui/step8-goals-treatment-focus/components/TreatmentGoalsSection.tsx: @/lib/utils
175. Invalid import path in src/modules/intake/ui/step8-goals-treatment-focus/components/TreatmentGoalsSection.tsx: @/lib/store/intake-form-store
176. Invalid import path in src/modules/intake/ui/step8-goals-treatment-focus/components/intake-step8-goals-treatment-focus.tsx: @/lib/store/intake-form-store

**Resolution**: Verify all import paths exist in repository and use correct TypeScript aliases from tsconfig.json


### SOC_VIOLATION (1 occurrence)

**Impact**: Layer boundary violation (UI→App→Domain→Infra)

1. UI layer violation in src/modules/intake/ui/step1-demographics/components/intake-wizard-step1-demographics.tsx: '@/modules/intake/state' not in allowed imports. UI components and presentation logic

**Resolution**: Respect layer boundaries: UI→Application→Domain→Infrastructure. Check SoC manifest rules


### UI_HARDCODE (37 occurrences)

**Impact**: Hardcoded colors/tokens instead of semantic Tailwind v4

1. Hardcoded colors in src/app/(app)/patients/new/page.tsx: blue-600, blue-800, gray-600. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
2. RGB/HSL colors in src/modules/intake/ui/enhanced-wizard-tabs.tsx: hsl(var(--primary). Use OKLCH-based semantic tokens for accessibility
3. Hardcoded colors in src/modules/intake/ui/review-submit/components/ReviewStatusSection.tsx: green-200, green-50, green-700. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
4. Hardcoded colors in src/modules/intake/ui/review-submit/components/SubmissionSection.tsx: amber-500, amber-50, amber-900. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
5. Hardcoded colors in src/modules/intake/ui/review-submit/components/intake-review-submit.tsx: green-200, green-50, green-500, green-700, green-700, green-50, green-500, green-100, green-800, blue-600, gray-200, gray-700. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
6. Excessive hardcoded spacing in src/modules/intake/ui/review-submit/components/intake-review-submit.tsx: 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
7. Excessive hardcoded spacing in src/modules/intake/ui/step1-demographics/components/AddressSection.tsx: 5, 5, 5, 5, 5, 5, 11, 11, 11, 11. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
8. Excessive hardcoded spacing in src/modules/intake/ui/step1-demographics/components/ContactSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
9. Excessive hardcoded spacing in src/modules/intake/ui/step1-demographics/components/LegalSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
10. Excessive hardcoded spacing in src/modules/intake/ui/step1-demographics/components/PersonalInfoSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
11. Excessive hardcoded spacing in src/modules/intake/ui/step2-eligibility-insurance/components/AuthorizationsSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
12. Excessive hardcoded spacing in src/modules/intake/ui/step2-eligibility-insurance/components/EligibilityRecordsSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
13. Excessive hardcoded spacing in src/modules/intake/ui/step2-eligibility-insurance/components/GovernmentCoverageSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
14. Excessive hardcoded spacing in src/modules/intake/ui/step2-eligibility-insurance/components/InsuranceRecordsSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
15. Hardcoded colors in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: gray-50, gray-200, gray-700, gray-200, gray-600, gray-600. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
16. Excessive hardcoded spacing in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
17. Excessive hardcoded spacing in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/FunctionalAssessmentSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
18. Excessive hardcoded spacing in src/modules/intake/ui/step3-diagnoses-clinical-eva/components/PsychiatricEvaluationSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
19. Excessive hardcoded spacing in src/modules/intake/ui/step4-medical-providers/components/PrimaryCareProviderSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
20. Excessive hardcoded spacing in src/modules/intake/ui/step4-medical-providers/components/PsychiatristSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
21. Hardcoded colors in src/modules/intake/ui/step5-medications-pharmacy/components/MedicationsSection.tsx: amber-500, amber-50, amber-900. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
22. Excessive hardcoded spacing in src/modules/intake/ui/step5-medications-pharmacy/components/MedicationsSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
23. Excessive hardcoded spacing in src/modules/intake/ui/step5-medications-pharmacy/components/PharmacySection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
24. Excessive hardcoded spacing in src/modules/intake/ui/step6-referrals-service/components/ExternalReferralsSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
25. Excessive hardcoded spacing in src/modules/intake/ui/step6-referrals-service/components/InternalServicesSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
26. Excessive hardcoded spacing in src/modules/intake/ui/step6-referrals-service/components/TreatmentHistorySection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
27. Hardcoded colors in src/modules/intake/ui/step7-legal-forms-consents/components/FormStatusAlert.tsx: amber-500, amber-50, amber-600, amber-900. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
28. Hardcoded colors in src/modules/intake/ui/step7-legal-forms-consents/components/LegalFormCard.tsx: green-200, green-50, gray-200, green-500, gray-300, red-500, green-100, green-800, green-200, amber-500, amber-600, indigo-50, indigo-700, indigo-200. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
29. Excessive hardcoded spacing in src/modules/intake/ui/step7-legal-forms-consents/components/LegalFormCard.tsx: 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
30. Excessive hardcoded spacing in src/modules/intake/ui/step7-legal-forms-consents/components/intake-step7-legal-forms-consents.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
31. Excessive hardcoded spacing in src/modules/intake/ui/step8-goals-treatment-focus/components/AiGoalSuggestionsSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
32. Excessive hardcoded spacing in src/modules/intake/ui/step8-goals-treatment-focus/components/PriorityAreasSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
33. Hardcoded colors in src/modules/intake/ui/step8-goals-treatment-focus/components/TreatmentGoalsSection.tsx: amber-500, amber-500. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
34. Excessive hardcoded spacing in src/modules/intake/ui/step8-goals-treatment-focus/components/TreatmentGoalsSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
35. Excessive hardcoded spacing in src/shared/ui/primitives/Calendar/index.tsx: 9, 9, 10, 10. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
36. Hardcoded colors in src/shared/ui/primitives/Sheet/examples.tsx: violet-500, purple-500, violet-600, purple-600, violet-50, purple-50, violet-200, violet-500, purple-500, violet-100, violet-50, purple-50, violet-600, violet-800, violet-800, violet-500, violet-700, violet-200, violet-700, violet-500, purple-500, violet-600, purple-600. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
37. Hardcoded colors in src/shared/ui/primitives/Toggle/examples.tsx: red-500, red-500. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.

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
