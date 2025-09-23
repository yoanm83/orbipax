"use client"

import { useEffect } from "react"
import { useIntakeFormStore } from "@/lib/store/intake-form-store"
import { DiagnosesSection } from "./DiagnosesSection"
import { PsychiatricEvaluationSection } from "./PsychiatricEvaluationSection"
import { FunctionalAssessmentSection } from "./FunctionalAssessmentSection"

export function IntakeWizardStep3() {
  const { clinicalInfo, setFormData, lastEditedStep } = useIntakeFormStore()

  // Force correct expanded sections state on mount
  useEffect(() => {
    setFormData('clinicalInfo', {
      ...clinicalInfo,
      expandedSections: {
        diagnoses: true,
        psychiatric: false,
        functional: false
      }
    })
  }, [])

  // Toggle section expansion
  const toggleSection = (section: keyof typeof clinicalInfo.expandedSections) => {
    setFormData('clinicalInfo', {
      ...clinicalInfo,
      expandedSections: {
        ...clinicalInfo.expandedSections,
        [section]: !clinicalInfo.expandedSections[section]
      }
    })
  }

  return (
    <div className="flex-1 w-full p-6">
      <DiagnosesSection
        isExpanded={clinicalInfo.expandedSections.diagnoses}
        onSectionToggle={() => toggleSection("diagnoses")}
        lastEditedStep={lastEditedStep}
      />

      <PsychiatricEvaluationSection
        isExpanded={clinicalInfo.expandedSections.psychiatric}
        onSectionToggle={() => toggleSection("psychiatric")}
        lastEditedStep={lastEditedStep}
      />

      <FunctionalAssessmentSection
        isExpanded={clinicalInfo.expandedSections.functional}
        onSectionToggle={() => toggleSection("functional")}
        lastEditedStep={lastEditedStep}
      />
    </div>
  )
}
