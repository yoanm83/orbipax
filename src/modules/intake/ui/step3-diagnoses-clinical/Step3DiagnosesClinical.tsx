'use client'

import { useState } from "react"

import { DiagnosesSection } from "./components/DiagnosesSection"

/**
 * Step 3: Diagnoses & Clinical Evaluation
 * Container for clinical assessment sections
 * SoC: UI layer only - manages section expansion state
 */
export function Step3DiagnosesClinical() {
  // Local state for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    diagnoses: true,
    psychiatric: false,
    functional: false
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="flex-1 w-full p-6">
      {/* Diagnoses (DSM-5) Section */}
      <DiagnosesSection
        isExpanded={expandedSections.diagnoses}
        onSectionToggle={() => toggleSection("diagnoses")}
      />

      {/* Placeholder for future sections */}
      {/* <PsychiatricEvaluationSection /> */}
      {/* <FunctionalAssessmentSection /> */}
    </div>
  )
}