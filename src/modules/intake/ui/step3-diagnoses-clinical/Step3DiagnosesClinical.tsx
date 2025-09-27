'use client'

import { useCallback, useState } from "react"

import { validateStep3 } from "@/modules/intake/domain/schemas/step3"
import {
  useDiagnosesUIStore,
  usePsychiatricEvaluationUIStore,
  useFunctionalAssessmentUIStore
} from "@/modules/intake/state/slices/step3"
import { Button } from "@/shared/ui/primitives/Button"

import { DiagnosesSection } from "./components/DiagnosesSection"
import { FunctionalAssessmentSection } from "./components/FunctionalAssessmentSection"
import { PsychiatricEvaluationSection } from "./components/PsychiatricEvaluationSection"

/**
 * Step 3: Diagnoses & Clinical Evaluation
 * Container for clinical assessment sections with unified validation
 * SoC: UI layer only - orchestrates sections and handles submit
 */
interface Step3DiagnosesClinicalProps {
  onSubmit?: (data: Record<string, unknown>) => void
  onNext?: () => void
}

export function Step3DiagnosesClinical({
  onSubmit,
  onNext
}: Step3DiagnosesClinicalProps = {}) {
  // Local state for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    diagnoses: true,
    psychiatric: false,
    functional: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Connect to stores for payload collection
  const diagnosesStore = useDiagnosesUIStore()
  const psychiatricStore = usePsychiatricEvaluationUIStore()
  const functionalStore = useFunctionalAssessmentUIStore()

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  /**
   * Build payload from all UI stores
   * Applies conditional logic to exclude unnecessary fields
   */
  const buildPayload = useCallback(() => {
    // Diagnoses payload
    const diagnosesPayload: Record<string, unknown> = {
      primaryDiagnosis: diagnosesStore.primaryDiagnosis ?? undefined,
      secondaryDiagnoses: diagnosesStore.secondaryDiagnoses?.filter(d => d.trim()) ?? [],
      substanceUseDisorder: diagnosesStore.substanceUseDisorder ?? undefined,
      mentalHealthHistory: diagnosesStore.mentalHealthHistory?.trim() ?? undefined
    }

    // Psychiatric Evaluation payload
    const psychiatricPayload: Record<string, unknown> = {
      currentSymptoms: psychiatricStore.currentSymptoms?.filter(s => s.trim()) ?? [],
      severityLevel: psychiatricStore.severityLevel ?? undefined,
      suicidalIdeation: psychiatricStore.suicidalIdeation ?? undefined,
      homicidalIdeation: psychiatricStore.homicidalIdeation ?? undefined,
      psychoticSymptoms: psychiatricStore.psychoticSymptoms ?? undefined,
      medicationCompliance: psychiatricStore.medicationCompliance ?? undefined,
      treatmentHistory: psychiatricStore.treatmentHistory?.trim() ?? undefined
    }

    // Functional Assessment payload
    const functionalPayload: Record<string, unknown> = {
      globalFunctioning: functionalStore.globalFunctioning ?? undefined,
      dailyLivingActivities: functionalStore.dailyLivingActivities ?? [],
      socialFunctioning: functionalStore.socialFunctioning ?? undefined,
      occupationalFunctioning: functionalStore.occupationalFunctioning ?? undefined,
      cognitiveStatus: functionalStore.cognitiveStatus ?? undefined,
      adaptiveBehavior: functionalStore.adaptiveBehavior?.trim() ?? undefined
    }

    // Clean undefined values from payloads
    const cleanPayload = (obj: Record<string, unknown>) => {
      return Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== undefined)
      )
    }

    return {
      diagnoses: cleanPayload(diagnosesPayload),
      psychiatricEvaluation: cleanPayload(psychiatricPayload),
      functionalAssessment: cleanPayload(functionalPayload),
      stepId: 'step3-diagnoses-clinical'
    }
  }, [
    diagnosesStore,
    psychiatricStore,
    functionalStore
  ])

  /**
   * Handle unified submit with validation
   * Distributes errors to respective UI stores
   */
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)

    try {
      // Build complete payload
      const payload = buildPayload()

      // Validate with composite schema
      const result = validateStep3(payload)

      if (!result.success) {
        // Map errors to respective stores
        const errorsBySection: Record<string, Record<string, string>> = {
          diagnoses: {},
          psychiatricEvaluation: {},
          functionalAssessment: {}
        }

        // Process Zod errors
        result.error.issues.forEach(issue => {
          const path = issue.path
          if (path.length >= 2) {
            const section = path[0] as string
            const field = path[1] as string

            if (section in errorsBySection) {
              errorsBySection[section][field] = issue.message
            }
          }
        })

        // Set errors in respective stores
        if (Object.keys(errorsBySection['diagnoses']).length > 0) {
          diagnosesStore.setValidationErrors(errorsBySection['diagnoses'])
        }
        if (Object.keys(errorsBySection['psychiatricEvaluation']).length > 0) {
          psychiatricStore.setValidationErrors(errorsBySection['psychiatricEvaluation'])
        }
        if (Object.keys(errorsBySection['functionalAssessment']).length > 0) {
          functionalStore.setValidationErrors(errorsBySection['functionalAssessment'])
        }

        // Expand first section with errors
        const sectionsWithErrors = Object.keys(errorsBySection).filter(
          section => Object.keys(errorsBySection[section]).length > 0
        )
        if (sectionsWithErrors.length > 0) {
          const sectionMap: Record<string, keyof typeof expandedSections> = {
            diagnoses: 'diagnoses',
            psychiatricEvaluation: 'psychiatric',
            functionalAssessment: 'functional'
          }
          const sectionKey = sectionMap[sectionsWithErrors[0]]
          if (sectionKey) {
            setExpandedSections(prev => ({
              ...prev,
              [sectionKey]: true
            }))
          }
        }

        setIsSubmitting(false)
        return
      }

      // Clear all validation errors on success
      diagnosesStore.setValidationErrors({})
      psychiatricStore.setValidationErrors({})
      functionalStore.setValidationErrors({})

      // Call onSubmit callback if provided
      if (onSubmit) {
        await onSubmit(payload)
      }

      // Navigate to next step if callback provided
      if (onNext) {
        onNext()
      }
    } catch {
      // Handle unexpected errors gracefully
      setIsSubmitting(false)
    } finally {
      setIsSubmitting(false)
    }
  }, [
    buildPayload,
    onSubmit,
    onNext,
    diagnosesStore,
    psychiatricStore,
    functionalStore
  ])

  return (
    <div className="flex-1 w-full">
      <div className="p-6 space-y-6">
        {/* Diagnoses (DSM-5) Section */}
        <DiagnosesSection
          isExpanded={expandedSections.diagnoses}
          onSectionToggle={() => toggleSection("diagnoses")}
        />

        {/* Psychiatric Evaluation Section */}
        <PsychiatricEvaluationSection
          isExpanded={expandedSections.psychiatric}
          onSectionToggle={() => toggleSection("psychiatric")}
        />

        {/* Functional Assessment Section */}
        <FunctionalAssessmentSection
          isExpanded={expandedSections.functional}
          onSectionToggle={() => toggleSection("functional")}
        />

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-[var(--border)]">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="min-w-[120px]"
            variant="primary"
          >
            {isSubmitting ? 'Validating...' : 'Save & Continue'}
          </Button>
        </div>
      </div>
    </div>
  )
}