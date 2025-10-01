"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from "react"
import { useForm } from 'react-hook-form'

import { Button } from "@/shared/ui/primitives/Button"

import { loadInsuranceAction, saveInsuranceAction } from '@/modules/intake/actions/step2'
import { insuranceDataSchema, type InsuranceData } from '@/modules/intake/domain/schemas/insurance.schema'
import { useWizardProgressStore } from "@/modules/intake/state"

// Section components with RHF integration
import { GovernmentCoverageSection } from "./components/GovernmentCoverageSection"
import { InsuranceRecordsSection } from "./components/InsuranceRecordsSection"
// TODO: Wire these sections when schemas are ready
// import { EligibilityRecordsSection } from "./components/EligibilityRecordsSection"
// import { AuthorizationsSection } from "./components/AuthorizationsSection"

interface Step2EligibilityInsuranceProps {
  onSubmit?: (data: Record<string, unknown>) => void
  onNext?: () => void
}

/**
 * Step 2: Eligibility & Insurance
 * UI component for insurance and eligibility management
 * SoC: UI layer only - no business logic or API calls
 */
export function Step2EligibilityInsurance({
  onSubmit,
  onNext
}: Step2EligibilityInsuranceProps = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Section expansion state
  const [expandedSections, setExpandedSections] = useState({
    government: true,
    insurance: false,
    eligibility: false,
    authorizations: false
  })

  // Navigation actions from wizard store
  const { nextStep, prevStep } = useWizardProgressStore()

  // React Hook Form setup with Zod resolver
  const form = useForm<Partial<InsuranceData>>({
    resolver: zodResolver(insuranceDataSchema.partial()),
    defaultValues: {
      insuranceRecords: [],
      governmentCoverage: {
        medicaidId: '',
        medicareId: '',
        socialSecurityNumber: ''
      }
    }
  })

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const result = await loadInsuranceAction()
        if (result.ok && result.data) {
          form.reset({
            insuranceRecords: result.data.data.insuranceRecords ?? [],
            governmentCoverage: result.data.data.governmentCoverage ?? {}
          })
        }
      } catch {
        // Silent fail for initial load
      }
    }
    loadData()
  }, [form])

  // Error messages (generic, no PHI)
  const ERROR_MESSAGES: Record<string, string> = {
    UNAUTHORIZED: 'Please sign in to continue',
    VALIDATION_FAILED: 'Please check the form for errors',
    NOT_FOUND: 'Insurance information not found',
    SAVE_FAILED: 'Unable to save insurance data',
    UNKNOWN: 'An error occurred. Please try again'
  }

  // Handle form submission
  const handleSubmit = form.handleSubmit(async (values: Partial<InsuranceData>) => {
    setIsSubmitting(true)
    setSaveError(null)

    try {
      // Submit to server action
      const result = await saveInsuranceAction({
        insuranceRecords: values.insuranceRecords ?? [],
        governmentCoverage: values.governmentCoverage ?? {}
      })

      if (result.ok) {
        // Call onSubmit callback if provided
        if (onSubmit) {
          await onSubmit(values as Record<string, unknown>)
        }

        // Navigate to next step
        if (onNext) {
          onNext()
        } else {
          nextStep()
        }
      } else {
        // Handle error with generic message
        const errorCode = result.error?.code ?? 'UNKNOWN'
        setSaveError(ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.UNKNOWN)
      }
    } catch {
      // Handle unexpected errors gracefully
      setSaveError(ERROR_MESSAGES.UNKNOWN)
    } finally {
      setIsSubmitting(false)
    }
  })

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  return (
    <div className="space-y-6 p-4 @container">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold text-[var(--foreground)]">
          Insurance & Eligibility
        </h1>
        <p className="text-sm text-[var(--muted-foreground)] mt-2">
          Manage insurance information, verify coverage, and handle authorizations
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Alert */}
        {saveError && (
          <div className="bg-[var(--destructive)]/10 border border-[var(--destructive)] text-[var(--destructive)] px-4 py-3 rounded" role="alert">
            <span className="font-medium">Error: </span>
            <span>{saveError}</span>
          </div>
        )}

        {/* Government Coverage Section */}
        <GovernmentCoverageSection
          onSectionToggle={() => toggleSection('government')}
          isExpanded={expandedSections.government}
          form={form}
        />

        {/* Insurance Records Section */}
        <InsuranceRecordsSection
          onSectionToggle={() => toggleSection('insurance')}
          isExpanded={expandedSections.insurance}
          form={form}
        />

        {/* Eligibility Records Section - Placeholder */}
        <div className="p-4 border border-[var(--border)] rounded-lg">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
            Eligibility Records
          </h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            Eligibility verification will be available in a future update.
          </p>
        </div>

        {/* Authorizations Section - Placeholder */}
        <div className="p-4 border border-[var(--border)] rounded-lg">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">
            Prior Authorizations
          </h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            Authorization management will be available in a future update.
          </p>
        </div>

        {/* Form actions */}
        <div className="flex justify-between pt-8 border-t border-[var(--border)]">
          <Button
            type="button"
            onClick={prevStep}
            variant="outline"
            aria-label="Go back to previous step"
          >
            Back
          </Button>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              aria-label="Reset form"
            >
              Clear
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !form.formState.isDirty}
              variant="primary"
              aria-label="Save and continue to next step"
            >
              {isSubmitting ? 'Saving...' : 'Save & Continue'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}