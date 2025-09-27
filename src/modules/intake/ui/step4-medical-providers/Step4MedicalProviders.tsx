'use client'

import { useCallback, useState } from "react"
import { Button } from "@/shared/ui/primitives/Button"

import { ProvidersSection } from "./components/ProvidersSection"
import { PsychiatristEvaluatorSection } from "./components/PsychiatristEvaluatorSection"

// Import validation utilities
import { validateStep4 } from "@/modules/intake/domain/schemas/step4"
// Import UI stores
import {
  useProvidersUIStore,
  usePsychiatristUIStore
} from "@/modules/intake/state/slices/step4"

/**
 * Step 4: Medical Providers
 * Container for medical provider information sections with unified validation
 * SoC: UI layer only - orchestrates sections and handles submit
 */
interface Step4MedicalProvidersProps {
  onSubmit?: (data: Record<string, unknown>) => void
  onNext?: () => void
}

export function Step4MedicalProviders({
  onSubmit,
  onNext
}: Step4MedicalProvidersProps = {}) {
  // Local state for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    providers: true,
    psychiatrist: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Connect to stores for payload collection
  const providersStore = useProvidersUIStore()
  const psychiatristStore = usePsychiatristUIStore()

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
    // Providers payload
    const providersPayload: Record<string, unknown> = {
      hasPCP: providersStore.hasPCP
    }
    if (providersStore.hasPCP === 'Yes') {
      providersPayload['pcpName'] = providersStore.pcpName?.trim() || undefined
      providersPayload['pcpPhone'] = providersStore.pcpPhone?.replace(/\D/g, '') || undefined
      providersPayload['pcpPractice'] = providersStore.pcpPractice?.trim() || undefined
      providersPayload['pcpAddress'] = providersStore.pcpAddress?.trim() || undefined
      providersPayload['authorizedToShare'] = providersStore.authorizedToShare || false
    }

    // Psychiatrist payload
    const psychiatristPayload: Record<string, unknown> = {
      hasBeenEvaluated: psychiatristStore.hasBeenEvaluated
    }
    if (psychiatristStore.hasBeenEvaluated === 'Yes') {
      psychiatristPayload['psychiatristName'] = psychiatristStore.psychiatristName?.trim() || undefined
      psychiatristPayload['evaluationDate'] = psychiatristStore.evaluationDate || undefined
      psychiatristPayload['clinicName'] = psychiatristStore.clinicName?.trim() || undefined
      psychiatristPayload['notes'] = psychiatristStore.notes?.trim() || undefined
      psychiatristPayload['differentEvaluator'] = psychiatristStore.differentEvaluator || false

      if (psychiatristStore.differentEvaluator) {
        psychiatristPayload['evaluatorName'] = psychiatristStore.evaluatorName?.trim() || undefined
        psychiatristPayload['evaluatorClinic'] = psychiatristStore.evaluatorClinic?.trim() || undefined
      }
    }

    // Clean undefined values from payloads
    const cleanPayload = (obj: Record<string, unknown>) => {
      return Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== undefined)
      )
    }

    return {
      providers: cleanPayload(providersPayload),
      psychiatrist: cleanPayload(psychiatristPayload),
      stepId: 'step4-medical-providers'
    }
  }, [
    providersStore,
    psychiatristStore
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
      const result = validateStep4(payload)

      if (!result.success) {
        // Map errors to respective stores
        const errorsBySection: Record<string, Record<string, string>> = {
          providers: {},
          psychiatrist: {}
        }

        // Process Zod errors
        result.error.issues.forEach(issue => {
          const path = issue.path
          if (path.length >= 2) {
            const section = path[0] as string
            const field = path[1] as string

            if (section in errorsBySection) {
              // Map field-specific error messages
              let message = issue.message

              // Custom messages for better UX
              if (field === 'hasPCP' && section === 'providers') {
                message = 'Please indicate if you have a primary care provider'
              } else if (field === 'hasBeenEvaluated' && section === 'psychiatrist') {
                message = 'Please indicate if you have been evaluated by a psychiatrist'
              }

              errorsBySection[section][field] = message
            }
          }
        })

        // Set errors in respective stores
        if (Object.keys(errorsBySection['providers']).length > 0) {
          providersStore.setValidationErrors(errorsBySection['providers'])
        }
        if (Object.keys(errorsBySection['psychiatrist']).length > 0) {
          psychiatristStore.setValidationErrors(errorsBySection['psychiatrist'])
        }

        // Expand first section with errors
        const sectionsWithErrors = Object.keys(errorsBySection).filter(
          section => Object.keys(errorsBySection[section]).length > 0
        )
        if (sectionsWithErrors.length > 0) {
          setExpandedSections(prev => ({
            ...prev,
            [sectionsWithErrors[0]]: true
          }))
        }

        setIsSubmitting(false)
        return
      }

      // Clear all validation errors on success
      providersStore.setValidationErrors({})
      psychiatristStore.setValidationErrors({})

      // Call onSubmit callback if provided
      if (onSubmit) {
        await onSubmit(payload)
      }

      // Navigate to next step if callback provided
      if (onNext) {
        onNext()
      }
    } catch (error) {
      // Handle unexpected errors gracefully
      setIsSubmitting(false)
    } finally {
      setIsSubmitting(false)
    }
  }, [
    buildPayload,
    onSubmit,
    onNext,
    providersStore,
    psychiatristStore
  ])

  return (
    <div className="flex-1 w-full">
      <div className="p-6 space-y-6">
        {/* Primary Care Provider Section */}
        <ProvidersSection
          isExpanded={expandedSections.providers}
          onSectionToggle={() => toggleSection("providers")}
        />

        {/* Psychiatrist / Clinical Evaluator Section */}
        <PsychiatristEvaluatorSection
          isExpanded={expandedSections.psychiatrist}
          onSectionToggle={() => toggleSection("psychiatrist")}
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