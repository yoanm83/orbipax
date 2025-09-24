# Health Guard Violations Report v1.1

**Generated**: 2025-09-23T19:44:34.898Z
**Mode**: FAST
**Guard Version**: Sentinel v1.1
**Files Analyzed**: 120

## 📊 Summary

- **Total Violations**: 265
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


### PATH_GUESS (197 occurrences)

**Impact**: Invented paths not confirmed in repository

1. Invalid import path in src/modules/legacy/intake/layout/IntakeWizardLayout.tsx: @/components/layout/Sidebar
2. Invalid import path in src/modules/legacy/intake/layout/IntakeWizardProvider.tsx: @/lib/store/intake-form-store
3. Invalid import path in src/modules/legacy/intake/layout/IntakeWizardProvider.tsx: @/lib/supabase/queries
4. Invalid import path in src/modules/legacy/intake/review-submit/components/ReviewStatusSection.tsx: @/components/ui/card
5. Invalid import path in src/modules/legacy/intake/review-submit/components/SubmissionSection.tsx: @/components/ui/button
6. Invalid import path in src/modules/legacy/intake/review-submit/components/SubmissionSection.tsx: @/components/ui/card
7. Invalid import path in src/modules/legacy/intake/review-submit/components/SubmissionSection.tsx: @/components/ui/input
8. Invalid import path in src/modules/legacy/intake/review-submit/components/SubmissionSection.tsx: @/components/ui/label
9. Invalid import path in src/modules/legacy/intake/review-submit/components/SubmissionSection.tsx: @/components/ui/checkbox
10. Invalid import path in src/modules/legacy/intake/review-submit/components/SubmissionSection.tsx: @/components/ui/alert
11. Invalid import path in src/modules/legacy/intake/review-submit/components/intake-review-submit.tsx: @/components/ui/button
12. Invalid import path in src/modules/legacy/intake/review-submit/components/intake-review-submit.tsx: @/components/ui/card
13. Invalid import path in src/modules/legacy/intake/review-submit/components/intake-review-submit.tsx: @/components/ui/input
14. Invalid import path in src/modules/legacy/intake/review-submit/components/intake-review-submit.tsx: @/components/ui/label
15. Invalid import path in src/modules/legacy/intake/review-submit/components/intake-review-submit.tsx: @/components/ui/alert
16. Invalid import path in src/modules/legacy/intake/review-submit/components/intake-review-submit.tsx: @/components/ui/checkbox
17. Invalid import path in src/modules/legacy/intake/review-submit/components/intake-review-submit.tsx: @/components/ui/accordion
18. Invalid import path in src/modules/legacy/intake/review-submit/components/intake-review-submit.tsx: @/lib/store/intake-form-store
19. Invalid import path in src/modules/legacy/intake/step1-demographics/components/AddressSection.tsx: @/lib/store/intake-form-store
20. Invalid import path in src/modules/legacy/intake/step1-demographics/components/AddressSection.tsx: @/components/ui/card
21. Invalid import path in src/modules/legacy/intake/step1-demographics/components/AddressSection.tsx: @/components/ui/input
22. Invalid import path in src/modules/legacy/intake/step1-demographics/components/AddressSection.tsx: @/components/ui/label
23. Invalid import path in src/modules/legacy/intake/step1-demographics/components/AddressSection.tsx: @/components/ui/select
24. Invalid import path in src/modules/legacy/intake/step1-demographics/components/AddressSection.tsx: @/components/ui/checkbox
25. Invalid import path in src/modules/legacy/intake/step1-demographics/components/AddressSection.tsx: @/components/ui/button
26. Invalid import path in src/modules/legacy/intake/step1-demographics/components/ContactSection.tsx: @/components/ui/card
27. Invalid import path in src/modules/legacy/intake/step1-demographics/components/ContactSection.tsx: @/components/ui/input
28. Invalid import path in src/modules/legacy/intake/step1-demographics/components/ContactSection.tsx: @/components/ui/label
29. Invalid import path in src/modules/legacy/intake/step1-demographics/components/ContactSection.tsx: @/components/ui/select
30. Invalid import path in src/modules/legacy/intake/step1-demographics/components/ContactSection.tsx: @/lib/store/intake-form-store
31. Invalid import path in src/modules/legacy/intake/step1-demographics/components/LegalSection.tsx: @/components/ui/card
32. Invalid import path in src/modules/legacy/intake/step1-demographics/components/LegalSection.tsx: @/components/ui/input
33. Invalid import path in src/modules/legacy/intake/step1-demographics/components/LegalSection.tsx: @/components/ui/label
34. Invalid import path in src/modules/legacy/intake/step1-demographics/components/LegalSection.tsx: @/components/ui/switch
35. Invalid import path in src/modules/legacy/intake/step1-demographics/components/LegalSection.tsx: @/lib/store/intake-form-store
36. Invalid import path in src/modules/legacy/intake/step1-demographics/components/PersonalInfoSection.tsx: @/components/ui/card
37. Invalid import path in src/modules/legacy/intake/step1-demographics/components/PersonalInfoSection.tsx: @/components/ui/input
38. Invalid import path in src/modules/legacy/intake/step1-demographics/components/PersonalInfoSection.tsx: @/components/ui/label
39. Invalid import path in src/modules/legacy/intake/step1-demographics/components/PersonalInfoSection.tsx: @/components/multi-select
40. Invalid import path in src/modules/legacy/intake/step1-demographics/components/PersonalInfoSection.tsx: @/components/ui/custom-calendar
41. Invalid import path in src/modules/legacy/intake/step1-demographics/components/PersonalInfoSection.tsx: @/lib/store/intake-form-store
42. Invalid import path in src/modules/legacy/intake/step1-demographics/components/intake-wizard-step1-demographics.tsx: @/lib/store/intake-form-store
43. Invalid import path in src/modules/legacy/intake/step1-demographics/components/intake-wizard-step1-demographics.tsx: @/components/ui/button
44. Invalid import path in src/modules/legacy/intake/step1-demographics/components/intake-wizard-step1-demographics.tsx: @/components/ui/card
45. Invalid import path in src/modules/legacy/intake/step1-demographics/components/intake-wizard-step1-demographics.tsx: @/components/ui/input
46. Invalid import path in src/modules/legacy/intake/step1-demographics/components/intake-wizard-step1-demographics.tsx: @/components/ui/label
47. Invalid import path in src/modules/legacy/intake/step1-demographics/components/intake-wizard-step1-demographics.tsx: @/components/ui/select
48. Invalid import path in src/modules/legacy/intake/step1-demographics/components/intake-wizard-step1-demographics.tsx: @/components/ui/popover
49. Invalid import path in src/modules/legacy/intake/step1-demographics/components/intake-wizard-step1-demographics.tsx: @/components/multi-select
50. Invalid import path in src/modules/legacy/intake/step1-demographics/components/intake-wizard-step1-demographics.tsx: @/components/ui/alert
51. Invalid import path in src/modules/legacy/intake/step1-demographics/components/intake-wizard-step1-demographics.tsx: @/components/ui/custom-calendar
52. Invalid import path in src/modules/legacy/intake/step1-demographics/components/intake-wizard-step1-demographics.tsx: @/lib/analytics
53. Invalid import path in src/modules/legacy/intake/step1-demographics/page.tsx: @/lib/analytics
54. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/AuthorizationsSection.tsx: @/components/ui/button
55. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/AuthorizationsSection.tsx: @/components/ui/card
56. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/AuthorizationsSection.tsx: @/components/ui/label
57. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/AuthorizationsSection.tsx: @/components/ui/select
58. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/AuthorizationsSection.tsx: @/components/ui/input
59. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/AuthorizationsSection.tsx: @/components/ui/textarea
60. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/AuthorizationsSection.tsx: @/components/ui/popover
61. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/AuthorizationsSection.tsx: @/components/ui/custom-calendar
62. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/EligibilityRecordsSection.tsx: @/components/ui/button
63. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/EligibilityRecordsSection.tsx: @/components/ui/card
64. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/EligibilityRecordsSection.tsx: @/components/ui/label
65. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/EligibilityRecordsSection.tsx: @/components/ui/select
66. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/EligibilityRecordsSection.tsx: @/components/ui/popover
67. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/EligibilityRecordsSection.tsx: @/components/ui/custom-calendar
68. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/GovernmentCoverageSection.tsx: @/components/ui/button
69. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/GovernmentCoverageSection.tsx: @/components/ui/card
70. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/GovernmentCoverageSection.tsx: @/components/ui/input
71. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/GovernmentCoverageSection.tsx: @/components/ui/label
72. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/GovernmentCoverageSection.tsx: @/components/ui/popover
73. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/GovernmentCoverageSection.tsx: @/components/ui/custom-calendar
74. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/InsuranceRecordsSection.tsx: @/components/ui/button
75. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/InsuranceRecordsSection.tsx: @/components/ui/card
76. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/InsuranceRecordsSection.tsx: @/components/ui/label
77. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/InsuranceRecordsSection.tsx: @/components/ui/select
78. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/InsuranceRecordsSection.tsx: @/components/ui/input
79. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/InsuranceRecordsSection.tsx: @/components/ui/popover
80. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/InsuranceRecordsSection.tsx: @/components/ui/custom-calendar
81. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/components/ui/button
82. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/components/ui/card
83. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/components/ui/input
84. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/components/ui/label
85. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/components/ui/select
86. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/components/ui/switch
87. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/components/ui/popover
88. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/components/ui/calendar
89. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/components/ui/alert
90. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/components/ui/custom-calendar
91. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/lib/store/intake-form-store
92. Invalid import path in src/modules/legacy/intake/step2-eligibility-insurance/components/intake-step2-eligibility-insurance.tsx: @/components/ui/textarea
93. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: @/components/ui/button
94. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: @/components/ui/card
95. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: @/components/ui/input
96. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: @/components/ui/label
97. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: @/components/ui/select
98. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: @/components/ui/switch
99. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: @/components/ui/popover
100. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: @/components/ui/textarea
101. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: @/components/ui/custom-calendar
102. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: @/lib/store/intake-form-store
103. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/FunctionalAssessmentSection.tsx: @/components/ui/button
104. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/FunctionalAssessmentSection.tsx: @/components/ui/card
105. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/FunctionalAssessmentSection.tsx: @/components/ui/label
106. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/FunctionalAssessmentSection.tsx: @/components/ui/select
107. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/FunctionalAssessmentSection.tsx: @/components/ui/switch
108. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/FunctionalAssessmentSection.tsx: @/components/ui/textarea
109. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/FunctionalAssessmentSection.tsx: @/components/ui/checkbox
110. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/FunctionalAssessmentSection.tsx: @/lib/store/intake-form-store
111. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/PsychiatricEvaluationSection.tsx: @/components/ui/button
112. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/PsychiatricEvaluationSection.tsx: @/components/ui/card
113. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/PsychiatricEvaluationSection.tsx: @/components/ui/input
114. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/PsychiatricEvaluationSection.tsx: @/components/ui/label
115. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/PsychiatricEvaluationSection.tsx: @/components/ui/select
116. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/PsychiatricEvaluationSection.tsx: @/components/ui/popover
117. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/PsychiatricEvaluationSection.tsx: @/components/ui/textarea
118. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/PsychiatricEvaluationSection.tsx: @/components/ui/custom-calendar
119. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/PsychiatricEvaluationSection.tsx: @/lib/store/intake-form-store
120. Invalid import path in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/intake-step3-clinical-information.tsx: @/lib/store/intake-form-store
121. Invalid import path in src/modules/legacy/intake/step4-medical-providers/components/PrimaryCareProviderSection.tsx: @/components/ui/card
122. Invalid import path in src/modules/legacy/intake/step4-medical-providers/components/PrimaryCareProviderSection.tsx: @/components/ui/input
123. Invalid import path in src/modules/legacy/intake/step4-medical-providers/components/PrimaryCareProviderSection.tsx: @/components/ui/label
124. Invalid import path in src/modules/legacy/intake/step4-medical-providers/components/PrimaryCareProviderSection.tsx: @/components/ui/select
125. Invalid import path in src/modules/legacy/intake/step4-medical-providers/components/PrimaryCareProviderSection.tsx: @/components/ui/checkbox
126. Invalid import path in src/modules/legacy/intake/step4-medical-providers/components/PrimaryCareProviderSection.tsx: @/lib/store/intake-form-store
127. Invalid import path in src/modules/legacy/intake/step4-medical-providers/components/PsychiatristSection.tsx: @/components/ui/card
128. Invalid import path in src/modules/legacy/intake/step4-medical-providers/components/PsychiatristSection.tsx: @/components/ui/input
129. Invalid import path in src/modules/legacy/intake/step4-medical-providers/components/PsychiatristSection.tsx: @/components/ui/label
130. Invalid import path in src/modules/legacy/intake/step4-medical-providers/components/PsychiatristSection.tsx: @/components/ui/select
131. Invalid import path in src/modules/legacy/intake/step4-medical-providers/components/PsychiatristSection.tsx: @/components/ui/switch
132. Invalid import path in src/modules/legacy/intake/step4-medical-providers/components/PsychiatristSection.tsx: @/components/ui/popover
133. Invalid import path in src/modules/legacy/intake/step4-medical-providers/components/PsychiatristSection.tsx: @/components/ui/button
134. Invalid import path in src/modules/legacy/intake/step4-medical-providers/components/PsychiatristSection.tsx: @/components/ui/textarea
135. Invalid import path in src/modules/legacy/intake/step4-medical-providers/components/PsychiatristSection.tsx: @/components/ui/custom-calendar
136. Invalid import path in src/modules/legacy/intake/step4-medical-providers/components/PsychiatristSection.tsx: @/lib/store/intake-form-store
137. Invalid import path in src/modules/legacy/intake/step4-medical-providers/components/intake-step4-medical-providers.tsx: @/lib/store/intake-form-store
138. Invalid import path in src/modules/legacy/intake/step5-medications-pharmacy/components/MedicationsSection.tsx: @/components/ui/button
139. Invalid import path in src/modules/legacy/intake/step5-medications-pharmacy/components/MedicationsSection.tsx: @/components/ui/card
140. Invalid import path in src/modules/legacy/intake/step5-medications-pharmacy/components/MedicationsSection.tsx: @/components/ui/input
141. Invalid import path in src/modules/legacy/intake/step5-medications-pharmacy/components/MedicationsSection.tsx: @/components/ui/label
142. Invalid import path in src/modules/legacy/intake/step5-medications-pharmacy/components/MedicationsSection.tsx: @/components/ui/select
143. Invalid import path in src/modules/legacy/intake/step5-medications-pharmacy/components/MedicationsSection.tsx: @/components/ui/popover
144. Invalid import path in src/modules/legacy/intake/step5-medications-pharmacy/components/MedicationsSection.tsx: @/components/ui/calendar
145. Invalid import path in src/modules/legacy/intake/step5-medications-pharmacy/components/MedicationsSection.tsx: @/components/ui/alert
146. Invalid import path in src/modules/legacy/intake/step5-medications-pharmacy/components/MedicationsSection.tsx: @/lib/store/intake-form-store
147. Invalid import path in src/modules/legacy/intake/step5-medications-pharmacy/components/PharmacySection.tsx: @/components/ui/card
148. Invalid import path in src/modules/legacy/intake/step5-medications-pharmacy/components/PharmacySection.tsx: @/components/ui/input
149. Invalid import path in src/modules/legacy/intake/step5-medications-pharmacy/components/PharmacySection.tsx: @/components/ui/label
150. Invalid import path in src/modules/legacy/intake/step5-medications-pharmacy/components/PharmacySection.tsx: @/lib/store/intake-form-store
151. Invalid import path in src/modules/legacy/intake/step5-medications-pharmacy/components/intake-step5-medications-pharmacy.tsx: @/lib/store/intake-form-store
152. Invalid import path in src/modules/legacy/intake/step6-referrals-service/components/ExternalReferralsSection.tsx: @/components/ui/card
153. Invalid import path in src/modules/legacy/intake/step6-referrals-service/components/ExternalReferralsSection.tsx: @/components/ui/input
154. Invalid import path in src/modules/legacy/intake/step6-referrals-service/components/ExternalReferralsSection.tsx: @/components/ui/label
155. Invalid import path in src/modules/legacy/intake/step6-referrals-service/components/ExternalReferralsSection.tsx: @/components/ui/select
156. Invalid import path in src/modules/legacy/intake/step6-referrals-service/components/ExternalReferralsSection.tsx: @/components/ui/checkbox
157. Invalid import path in src/modules/legacy/intake/step6-referrals-service/components/ExternalReferralsSection.tsx: @/lib/store/intake-form-store
158. Invalid import path in src/modules/legacy/intake/step6-referrals-service/components/InternalServicesSection.tsx: @/components/ui/card
159. Invalid import path in src/modules/legacy/intake/step6-referrals-service/components/InternalServicesSection.tsx: @/components/ui/input
160. Invalid import path in src/modules/legacy/intake/step6-referrals-service/components/InternalServicesSection.tsx: @/components/ui/label
161. Invalid import path in src/modules/legacy/intake/step6-referrals-service/components/InternalServicesSection.tsx: @/components/ui/select
162. Invalid import path in src/modules/legacy/intake/step6-referrals-service/components/InternalServicesSection.tsx: @/components/ui/textarea
163. Invalid import path in src/modules/legacy/intake/step6-referrals-service/components/InternalServicesSection.tsx: @/lib/store/intake-form-store
164. Invalid import path in src/modules/legacy/intake/step6-referrals-service/components/InternalServicesSection.tsx: @/components/multi-select
165. Invalid import path in src/modules/legacy/intake/step6-referrals-service/components/TreatmentHistorySection.tsx: @/components/ui/card
166. Invalid import path in src/modules/legacy/intake/step6-referrals-service/components/TreatmentHistorySection.tsx: @/components/ui/label
167. Invalid import path in src/modules/legacy/intake/step6-referrals-service/components/TreatmentHistorySection.tsx: @/components/ui/select
168. Invalid import path in src/modules/legacy/intake/step6-referrals-service/components/TreatmentHistorySection.tsx: @/components/ui/textarea
169. Invalid import path in src/modules/legacy/intake/step6-referrals-service/components/TreatmentHistorySection.tsx: @/lib/store/intake-form-store
170. Invalid import path in src/modules/legacy/intake/step6-referrals-service/components/intake-step6-referrals-service.tsx: @/lib/store/intake-form-store
171. Invalid import path in src/modules/legacy/intake/step7-legal-forms-consents/components/ClientTypeSection.tsx: @/components/ui/checkbox
172. Invalid import path in src/modules/legacy/intake/step7-legal-forms-consents/components/ClientTypeSection.tsx: @/components/ui/label
173. Invalid import path in src/modules/legacy/intake/step7-legal-forms-consents/components/ClientTypeSection.tsx: @/lib/store/intake-form-store
174. Invalid import path in src/modules/legacy/intake/step7-legal-forms-consents/components/FormStatusAlert.tsx: @/components/ui/alert
175. Invalid import path in src/modules/legacy/intake/step7-legal-forms-consents/components/LegalFormCard.tsx: @/components/ui/button
176. Invalid import path in src/modules/legacy/intake/step7-legal-forms-consents/components/LegalFormCard.tsx: @/components/ui/badge
177. Invalid import path in src/modules/legacy/intake/step7-legal-forms-consents/components/LegalFormCard.tsx: @/components/ui/checkbox
178. Invalid import path in src/modules/legacy/intake/step7-legal-forms-consents/components/LegalFormCard.tsx: @/components/ui/label
179. Invalid import path in src/modules/legacy/intake/step7-legal-forms-consents/components/LegalFormCard.tsx: @/lib/store/intake-form-store
180. Invalid import path in src/modules/legacy/intake/step7-legal-forms-consents/components/constants/default-legal-forms.ts: @/lib/store/intake-form-store
181. Invalid import path in src/modules/legacy/intake/step7-legal-forms-consents/components/intake-step7-legal-forms-consents.tsx: @/components/ui/card
182. Invalid import path in src/modules/legacy/intake/step7-legal-forms-consents/components/intake-step7-legal-forms-consents.tsx: @/lib/store/intake-form-store
183. Invalid import path in src/modules/legacy/intake/step8-goals-treatment-focus/components/AiGoalSuggestionsSection.tsx: @/components/ui/button
184. Invalid import path in src/modules/legacy/intake/step8-goals-treatment-focus/components/AiGoalSuggestionsSection.tsx: @/components/ui/card
185. Invalid import path in src/modules/legacy/intake/step8-goals-treatment-focus/components/AiGoalSuggestionsSection.tsx: @/lib/store/intake-form-store
186. Invalid import path in src/modules/legacy/intake/step8-goals-treatment-focus/components/PriorityAreasSection.tsx: @/components/ui/button
187. Invalid import path in src/modules/legacy/intake/step8-goals-treatment-focus/components/PriorityAreasSection.tsx: @/components/ui/card
188. Invalid import path in src/modules/legacy/intake/step8-goals-treatment-focus/components/PriorityAreasSection.tsx: @/components/ui/label
189. Invalid import path in src/modules/legacy/intake/step8-goals-treatment-focus/components/PriorityAreasSection.tsx: @/components/ui/textarea
190. Invalid import path in src/modules/legacy/intake/step8-goals-treatment-focus/components/PriorityAreasSection.tsx: @/components/ui/badge
191. Invalid import path in src/modules/legacy/intake/step8-goals-treatment-focus/components/PriorityAreasSection.tsx: @/lib/store/intake-form-store
192. Invalid import path in src/modules/legacy/intake/step8-goals-treatment-focus/components/TreatmentGoalsSection.tsx: @/components/ui/card
193. Invalid import path in src/modules/legacy/intake/step8-goals-treatment-focus/components/TreatmentGoalsSection.tsx: @/components/ui/label
194. Invalid import path in src/modules/legacy/intake/step8-goals-treatment-focus/components/TreatmentGoalsSection.tsx: @/components/ui/textarea
195. Invalid import path in src/modules/legacy/intake/step8-goals-treatment-focus/components/TreatmentGoalsSection.tsx: @/lib/store/intake-form-store
196. Invalid import path in src/modules/legacy/intake/step8-goals-treatment-focus/components/intake-step8-goals-treatment-focus.tsx: @/lib/store/intake-form-store
197. Invalid import path in src/shared/ui/primitives/CountryCombobox/index.tsx: @/shared/data/countries

**Resolution**: Verify all import paths exist in repository and use correct TypeScript aliases from tsconfig.json


### SOC_VIOLATION (2 occurrences)

**Impact**: Layer boundary violation (UI→App→Domain→Infra)

1. UI layer violation in src/modules/intake/ui/step1-demographics/components/intake-wizard-step1-demographics.tsx: '@/modules/intake/state' not in allowed imports. UI components and presentation logic
2. UI layer violation in src/modules/intake/ui/wizard-content.tsx: '@/modules/intake/state' not in allowed imports. UI components and presentation logic

**Resolution**: Respect layer boundaries: UI→Application→Domain→Infrastructure. Check SoC manifest rules


### UI_HARDCODE (58 occurrences)

**Impact**: Hardcoded colors/tokens instead of semantic Tailwind v4

1. Hardcoded colors in src/app/(app)/patients/new/page.tsx: blue-600, blue-800, gray-600. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
2. Hardcoded colors in src/modules/intake/ui/_dev/Step1VisualHarness.tsx: gray-100, blue-500, gray-200, blue-500, gray-200, blue-500, gray-200, blue-500, gray-200, gray-600, gray-600, gray-700. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
3. Hex colors in src/modules/intake/ui/_dev/Step1VisualHarness.tsx: #4C6EF5, #EF4444. Use OKLCH-based semantic tokens instead
4. RGB/HSL colors in src/modules/intake/ui/_dev/Step1VisualHarness.tsx: rgba(0,0,0,0.05). Use OKLCH-based semantic tokens for accessibility
5. Hardcoded colors in src/modules/intake/ui/_dev/Step2PlaceholderActual.tsx: gray-400, gray-600, gray-500, gray-400. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
6. Hardcoded colors in src/modules/intake/ui/_dev/Step2VisualHarness.tsx: gray-100, amber-600, amber-50, blue-500, gray-200, blue-500, gray-200, blue-500, gray-200, blue-500, gray-200, gray-600, amber-600, amber-50, amber-800, amber-700, gray-600, gray-700, gray-600, gray-700, gray-600, gray-700. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
7. Hex colors in src/modules/intake/ui/_dev/Step2VisualHarness.tsx: #4C6EF5, #EF4444, #FEF2F2, #4C6EF5. Use OKLCH-based semantic tokens instead
8. RGB/HSL colors in src/modules/intake/ui/_dev/Step2VisualHarness.tsx: rgba(0,0,0,0.05). Use OKLCH-based semantic tokens for accessibility
9. Excessive hardcoded spacing in src/modules/intake/ui/step1-demographics/components/AddressSection.tsx: 5, 5, 5, 5, 5, 5, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
10. Excessive hardcoded spacing in src/modules/intake/ui/step1-demographics/components/ContactSection.tsx: 5, 5, 5, 5, 5, 5, 11. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
11. Excessive hardcoded spacing in src/modules/intake/ui/step1-demographics/components/PersonalInfoSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
12. Hex colors in src/modules/intake/ui/step1-demographics/components/Step1SkinScope.tsx: #4C6EF5, #E5E7EB, #F9FAFB, #111827, #6B7280, #9CA3AF, #D1D5DB, #F9FAFB, #9CA3AF, #3B82F6, #2563EB, #111827, #E5E7EB, #3B82F6, #3B82F6, #F3F4F6, #9CA3AF, #F9FAFB, #6B7280, #EF4444. Use OKLCH-based semantic tokens instead
13. RGB/HSL colors in src/modules/intake/ui/step1-demographics/components/Step1SkinScope.tsx: rgb(0 0 0 / 0.1), rgb(0 0 0 / 0.1), rgba(255, 255, 255, 1), rgb(0 0 0 / 0.1), rgb(0 0 0 / 0.1). Use OKLCH-based semantic tokens for accessibility
14. Hex colors in src/modules/legacy/intake/layout/IntakeWizardLayout.tsx: #F5F7FA. Use OKLCH-based semantic tokens instead
15. Hardcoded colors in src/modules/legacy/intake/review-submit/components/ReviewStatusSection.tsx: green-200, green-50, green-700. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
16. Hardcoded colors in src/modules/legacy/intake/review-submit/components/SubmissionSection.tsx: amber-500, amber-50, amber-900. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
17. Hardcoded colors in src/modules/legacy/intake/review-submit/components/intake-review-submit.tsx: green-200, green-50, green-500, green-700, green-700, green-50, green-500, green-100, green-800, blue-600, gray-200, gray-700. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
18. Excessive hardcoded spacing in src/modules/legacy/intake/review-submit/components/intake-review-submit.tsx: 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
19. Excessive hardcoded spacing in src/modules/legacy/intake/step1-demographics/components/AddressSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
20. Excessive hardcoded spacing in src/modules/legacy/intake/step1-demographics/components/ContactSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
21. Excessive hardcoded spacing in src/modules/legacy/intake/step1-demographics/components/LegalSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
22. Hardcoded colors in src/modules/legacy/intake/step1-demographics/components/PersonalInfoSection.tsx: gray-100, blue-500, blue-500, gray-300, gray-50, gray-100, gray-100, gray-200, gray-500. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
23. Excessive hardcoded spacing in src/modules/legacy/intake/step1-demographics/components/PersonalInfoSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
24. Hardcoded colors in src/modules/legacy/intake/step1-demographics/components/intake-wizard-step1-demographics.tsx: gray-100, blue-500, blue-500, gray-300, gray-50, gray-100, gray-100, gray-200, blue-100, blue-600, gray-600, red-600, red-700, gray-500. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
25. Excessive hardcoded spacing in src/modules/legacy/intake/step1-demographics/components/intake-wizard-step1-demographics.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
26. RGB/HSL colors in src/modules/legacy/intake/step1-demographics/components/intake-wizard-step1-demographics.tsx: rgba(59, 130, 246, 0.3), rgba(59, 130, 246, 0.1), rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05). Use OKLCH-based semantic tokens for accessibility
27. Hex colors in src/modules/legacy/intake/step1-demographics/page.tsx: #F5F7FA. Use OKLCH-based semantic tokens instead
28. Excessive hardcoded spacing in src/modules/legacy/intake/step2-eligibility-insurance/components/AuthorizationsSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
29. Excessive hardcoded spacing in src/modules/legacy/intake/step2-eligibility-insurance/components/EligibilityRecordsSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
30. Excessive hardcoded spacing in src/modules/legacy/intake/step2-eligibility-insurance/components/GovernmentCoverageSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
31. Excessive hardcoded spacing in src/modules/legacy/intake/step2-eligibility-insurance/components/InsuranceRecordsSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
32. Hardcoded colors in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: gray-50, gray-200, gray-700, gray-200, gray-600, gray-600. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
33. Excessive hardcoded spacing in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/DiagnosesSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
34. Excessive hardcoded spacing in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/FunctionalAssessmentSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
35. Excessive hardcoded spacing in src/modules/legacy/intake/step3-diagnoses-clinical-eva/components/PsychiatricEvaluationSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
36. Excessive hardcoded spacing in src/modules/legacy/intake/step4-medical-providers/components/PrimaryCareProviderSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
37. Excessive hardcoded spacing in src/modules/legacy/intake/step4-medical-providers/components/PsychiatristSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
38. Hardcoded colors in src/modules/legacy/intake/step5-medications-pharmacy/components/MedicationsSection.tsx: amber-500, amber-50, amber-900. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
39. Excessive hardcoded spacing in src/modules/legacy/intake/step5-medications-pharmacy/components/MedicationsSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
40. Excessive hardcoded spacing in src/modules/legacy/intake/step5-medications-pharmacy/components/PharmacySection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
41. Excessive hardcoded spacing in src/modules/legacy/intake/step6-referrals-service/components/ExternalReferralsSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
42. Excessive hardcoded spacing in src/modules/legacy/intake/step6-referrals-service/components/InternalServicesSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
43. Excessive hardcoded spacing in src/modules/legacy/intake/step6-referrals-service/components/TreatmentHistorySection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
44. Hardcoded colors in src/modules/legacy/intake/step7-legal-forms-consents/components/FormStatusAlert.tsx: amber-500, amber-50, amber-600, amber-900. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
45. Hardcoded colors in src/modules/legacy/intake/step7-legal-forms-consents/components/LegalFormCard.tsx: green-200, green-50, gray-200, green-500, gray-300, red-500, green-100, green-800, green-200, amber-500, amber-600, indigo-50, indigo-700, indigo-200. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
46. Excessive hardcoded spacing in src/modules/legacy/intake/step7-legal-forms-consents/components/LegalFormCard.tsx: 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
47. Excessive hardcoded spacing in src/modules/legacy/intake/step7-legal-forms-consents/components/intake-step7-legal-forms-consents.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
48. Excessive hardcoded spacing in src/modules/legacy/intake/step8-goals-treatment-focus/components/AiGoalSuggestionsSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
49. Excessive hardcoded spacing in src/modules/legacy/intake/step8-goals-treatment-focus/components/PriorityAreasSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
50. Hardcoded colors in src/modules/legacy/intake/step8-goals-treatment-focus/components/TreatmentGoalsSection.tsx: amber-500, amber-500. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
51. Excessive hardcoded spacing in src/modules/legacy/intake/step8-goals-treatment-focus/components/TreatmentGoalsSection.tsx: 5, 5, 5, 5, 5, 5. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
52. Excessive hardcoded spacing in src/shared/ui/primitives/Calendar/calendar.tsx: 7, 7, 9, 9, 9, 9, 9. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
53. Hex colors in src/shared/ui/primitives/Chart/index.tsx: #ccc, #fff, #ccc, #ccc, #fff. Use OKLCH-based semantic tokens instead
54. Excessive hardcoded spacing in src/shared/ui/primitives/Command/index.tsx: 5, 5, 5, 5, 11. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
55. Excessive hardcoded spacing in src/shared/ui/primitives/DatePicker/index.tsx: 9, 9, 9, 9, 9. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
56. Excessive hardcoded spacing in src/shared/ui/primitives/Sheet/sheet-skeleton.tsx: 7, 5, 5, 5, 10, 10, 10, 10, 10, 10. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding
57. Hardcoded colors in src/shared/ui/primitives/Table/table.tsx: green-500, green-700, green-400, yellow-500, yellow-700, yellow-400, red-500, red-700, red-400, blue-500, blue-700, blue-400, green-500, green-700, green-400, green-500, red-500, red-700, red-400, red-500, yellow-500, yellow-700, yellow-400, yellow-500, blue-500, blue-700, blue-400, blue-500. Use semantic tokens: primary, secondary, tertiary, success, warning, etc.
58. Excessive hardcoded spacing in src/shared/ui/primitives/Table/table.tsx: 10, 11, 14, 9, 10, 11, 500, 700, 400, 500, 700, 400, 500, 7, 9. Use semantic tokens: xs, sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, clinical-touch, form-spacing, card-padding, section-spacing, page-margin, component-gap, input-padding, button-padding, modal-padding, header-height, sidebar-width, content-width, mobile-padding, tablet-padding, desktop-padding

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
- **SOC_VIOLATION**: UI layer violation in src/modules/intake/ui/wizard-content.tsx: '@/modules/intake/state' not in allowed imports. UI components and presentation logic


---

*Health Guard Sentinel v1.1 - Automated OrbiPax CMH Philosophy Enforcement*
*Enhanced with fast/full modes, allowlist validation, and manifest-driven rules*
