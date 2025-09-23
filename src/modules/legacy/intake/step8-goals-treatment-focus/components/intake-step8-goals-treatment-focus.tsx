"use client"

import { useEffect } from "react"
import { useIntakeFormStore } from '@/lib/store/intake-form-store'
import { TreatmentGoalsSection } from "./TreatmentGoalsSection"
import { AiGoalSuggestionsSection } from "./AiGoalSuggestionsSection"
import { PriorityAreasSection } from "./PriorityAreasSection"

export function IntakeWizardStep8GoalsTreatmentFocus() {
  const {
    treatmentInfo,
    setFormData
  } = useIntakeFormStore()

  const {
    expandedSections,
    treatmentGoals,
    priorityAreas,
  } = treatmentInfo

  const goalText = String(treatmentGoals || '')

  useEffect(() => {
    // Always set initial sections state on mount
    setFormData('treatmentInfo', {
      ...treatmentInfo,
      expandedSections: {
        goals: true,
        suggestions: true,
        priorities: false
      }
    })
  }, []) // Empty dependency array means this runs once on mount

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setFormData('treatmentInfo', {
      ...treatmentInfo,
      expandedSections: {
        ...expandedSections,
        [section]: !expandedSections[section],
      },
    })
  }

  return (
    <div className="flex-1 w-full p-6">
      <TreatmentGoalsSection 
        isExpanded={expandedSections.goals}
        onToggleExpand={() => toggleSection('goals')}
      />

      <AiGoalSuggestionsSection
        isExpanded={expandedSections.suggestions}
        onToggleExpand={() => toggleSection('suggestions')}
      />

      <PriorityAreasSection
        isExpanded={expandedSections.priorities}
        onToggleExpand={() => toggleSection('priorities')}
      />
    </div>
  )
}
