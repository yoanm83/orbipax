'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from 'react-hook-form'

import { Button } from "@/shared/ui/primitives/Button"
import { Form } from "@/shared/ui/primitives/Form"

import { loadStep3Action, upsertDiagnosesAction } from "@/modules/intake/actions/step3"
import {
  step3DataPartialSchema,
  type Step3DataPartial
} from "@/modules/intake/domain/schemas/diagnoses-clinical"
import { useStep3UiStore } from "@/modules/intake/state/slices/step3-ui.slice"

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
  onSubmit: onSubmitCallback,
  onNext
}: Step3DiagnosesClinicalProps = {}) {
  const pathname = usePathname()

  // UI-only flags from canonical store
  const uiStore = useStep3UiStore()

  // Initialize React Hook Form with Zod resolver
  const form = useForm<Step3DataPartial>({
    resolver: zodResolver(step3DataPartialSchema),
    mode: 'onBlur',
    defaultValues: {
      diagnoses: {
        primaryDiagnosis: '',
        secondaryDiagnoses: [],
        substanceUseDisorder: undefined,
        mentalHealthHistory: '',
        diagnosisRecords: []
      },
      psychiatricEvaluation: {
        currentSymptoms: [],
        severityLevel: undefined,
        suicidalIdeation: undefined,
        homicidalIdeation: undefined,
        psychoticSymptoms: undefined,
        medicationCompliance: undefined,
        treatmentHistory: '',
        hasPsychEval: false,
        evaluationDate: undefined,
        evaluatedBy: undefined,
        evaluationSummary: undefined
      },
      functionalAssessment: {
        affectedDomains: [],
        adlsIndependence: undefined,
        iadlsIndependence: undefined,
        cognitiveFunctioning: undefined,
        hasSafetyConcerns: false,
        globalFunctioning: undefined,
        dailyLivingActivities: [],
        socialFunctioning: undefined,
        occupationalFunctioning: undefined,
        cognitiveStatus: undefined,
        adaptiveBehavior: undefined,
        additionalNotes: undefined
      }
    }
  })

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

  // Load existing clinical assessment data on mount
  // Guard: Skip preload if we're in /patients/new (no existing patient to load)
  useEffect(() => {
    // Check if we're in the "new" patient flow
    const isNewPatient = pathname?.includes('/patients/new')

    if (isNewPatient) {
      // Skip preload - use default empty form values
      return
    }

    const loadData = async () => {
      uiStore.markLoading(true)
      uiStore.setLoadError(null)

      try {
        // Call loadStep3Action (sessionId auto-resolved server-side)
        const result = await loadStep3Action()

        if (result.ok && result.data) {
          // Hydrate form with loaded data (RHF handles all fields)
          form.reset(result.data)
        } else if (!result.ok && result.error?.code !== 'NOT_FOUND') {
          // Show error for failures other than NOT_FOUND (no data is expected state)
          uiStore.setLoadError('Something went wrong while loading your information. Please refresh the page.')
        }
        // If NOT_FOUND, use defaults (already set in defaultValues)
      } catch {
        // Unexpected error - show generic message
        uiStore.setLoadError('Something went wrong while loading your information. Please refresh the page.')
      } finally {
        uiStore.markLoading(false)
      }
    }

    loadData()
  }, [pathname, uiStore, form])

  /**
   * Handle unified submit with RHF
   * Validation automatic via zodResolver
   */
  const onSubmit = async (data: Step3DataPartial) => {
    uiStore.markSaving(true)
    uiStore.setSaveError(null)

    try {
      // Validation already done by zodResolver
      // data is clean and type-safe

      // Call server action to persist data
      const result = await upsertDiagnosesAction(data as Record<string, unknown>)

      if (!result.ok) {
        // Map error codes to generic messages
        let errorMessage = 'Unable to save clinical assessment. Please try again.'

        if (result.error?.code === 'VALIDATION_FAILED') {
          errorMessage = 'Invalid clinical assessment data provided.'
        } else if (result.error?.code === 'UNAUTHORIZED') {
          errorMessage = 'Your session has expired. Please refresh the page.'
        }

        uiStore.setSaveError(errorMessage)
        return
      }

      // Call onSubmit callback if provided (for additional side effects)
      if (onSubmitCallback) {
        await onSubmitCallback(data as Record<string, unknown>)
      }

      // Mark as saved and navigate
      uiStore.markSaved()

      // Navigate to next step if callback provided
      if (onNext) {
        onNext()
      }
    } catch {
      // Handle unexpected errors gracefully
      uiStore.setSaveError('An unexpected error occurred. Please try again.')
    } finally {
      uiStore.markSaving(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 w-full">
        <div className="p-6 space-y-6">
          {/* Loading state */}
          {uiStore.isLoading && (
            <div
              role="alert"
              aria-live="polite"
              className="p-4 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
            >
              Loading clinical assessment information...
            </div>
          )}

          {/* Load error display */}
          {uiStore.loadError && (
            <div
              role="alert"
              aria-live="polite"
              className="p-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
            >
              {uiStore.loadError}
            </div>
          )}

          {/* Save error display */}
          {uiStore.saveError && (
            <div
              role="alert"
              aria-live="polite"
              className="p-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
            >
              {uiStore.saveError}
            </div>
          )}

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
          <div className="flex justify-end pt-6 border-[var(--border)]">
            <Button
              type="submit"
              disabled={uiStore.isLoading || uiStore.isSaving}
              className="min-w-[120px]"
              variant="primary"
            >
              {uiStore.isSaving ? 'Saving...' : 'Save & Continue'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}