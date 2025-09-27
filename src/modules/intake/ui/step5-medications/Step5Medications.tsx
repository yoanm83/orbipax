'use client'

import { useCallback, useState } from "react"
import { Button } from "@/shared/ui/primitives/Button"

import { CurrentMedicationsSection } from "./components/CurrentMedicationsSection"
import { PharmacyInformationSection } from "./components/PharmacyInformationSection"

// Import validation utilities
import { validateStep5 } from "@/modules/intake/domain/schemas/step5"
// Import UI stores
import {
  useCurrentMedicationsUIStore,
  usePharmacyInformationUIStore
} from "@/modules/intake/state/slices/step5"

/**
 * Step 5: Medications
 * Container for medication and allergy information sections
 * SoC: UI layer only - orchestrates sections and handles submit
 */
interface Step5MedicationsProps {
  onSubmit?: (data: Record<string, unknown>) => void
  onNext?: () => void
}

export function Step5Medications({
  onSubmit,
  onNext
}: Step5MedicationsProps = {}) {
  // Local state for collapsible sections
  const [expandedSections, setExpandedSections] = useState({
    currentMedications: true,
    pharmacyInformation: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Connect to stores for payload collection
  const currentMedicationsStore = useCurrentMedicationsUIStore()
  const pharmacyInformationStore = usePharmacyInformationUIStore()

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  /**
   * Build payload from all UI stores
   */
  const buildPayload = useCallback(() => {
    // Current Medications payload
    const currentMedicationsPayload: Record<string, unknown> = {
      hasMedications: currentMedicationsStore.hasMedications,
      medications: currentMedicationsStore.medications
    }

    // Pharmacy Information payload
    const pharmacyInformationPayload: Record<string, unknown> = {
      pharmacyName: pharmacyInformationStore.pharmacyName,
      pharmacyPhone: pharmacyInformationStore.pharmacyPhone,
      pharmacyAddress: pharmacyInformationStore.pharmacyAddress
    }

    // Clean undefined values from payloads
    const cleanPayload = (obj: Record<string, unknown>) => {
      return Object.fromEntries(
        Object.entries(obj).filter(([, v]) => v !== undefined)
      )
    }

    return {
      currentMedications: cleanPayload(currentMedicationsPayload),
      pharmacyInformation: cleanPayload(pharmacyInformationPayload),
      stepId: 'step5-medications'
    }
  }, [currentMedicationsStore, pharmacyInformationStore])

  /**
   * Handle unified submit with validation
   */
  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true)

    try {
      // Build complete payload
      const payload = buildPayload()

      // Validate with composite schema
      const result = validateStep5(payload)

      if (!result.success) {
        // Map errors to respective stores
        const errorsBySection: Record<string, Record<string, string>> = {
          currentMedications: {},
          pharmacyInformation: {}
        }

        // Process Zod errors
        result.error.issues.forEach(issue => {
          const path = issue.path
          if (path.length >= 2) {
            const section = path[0] as string
            const field = path[1] as string

            if (section in errorsBySection) {
              let message = issue.message

              // Custom messages for better UX
              if (field === 'hasMedications' && section === 'currentMedications') {
                message = 'Please indicate if you are currently taking any medications'
              }

              errorsBySection[section][field] = message
            }
          }
        })

        // Set errors in respective stores
        if (Object.keys(errorsBySection['currentMedications']).length > 0) {
          currentMedicationsStore.setValidationErrors(errorsBySection['currentMedications'])
        }
        if (Object.keys(errorsBySection['pharmacyInformation']).length > 0) {
          pharmacyInformationStore.setValidationErrors(errorsBySection['pharmacyInformation'])
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
      currentMedicationsStore.setValidationErrors({})
      pharmacyInformationStore.setValidationErrors({})

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
    currentMedicationsStore,
    pharmacyInformationStore
  ])

  return (
    <div className="flex-1 w-full">
      <div className="p-6 space-y-6">
        {/* Current Medications & Allergies Section */}
        <CurrentMedicationsSection
          isExpanded={expandedSections.currentMedications}
          onSectionToggle={() => toggleSection("currentMedications")}
        />

        {/* Pharmacy Information Section */}
        <PharmacyInformationSection
          isExpanded={expandedSections.pharmacyInformation}
          onSectionToggle={() => toggleSection("pharmacyInformation")}
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