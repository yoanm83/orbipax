"use client"

import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useEffect, useRef } from "react"
import { usePathname } from 'next/navigation'
import { useForm } from 'react-hook-form'

import { Form } from "@/shared/ui/primitives/Form"

import {
  getInsuranceSnapshotAction,
  upsertInsuranceEligibilityAction
} from "@/modules/intake/actions/step2/insurance.actions"
import { insuranceEligibilityDataSchema, type InsuranceEligibility } from "@/modules/intake/domain/schemas/insurance-eligibility"
import { useWizardProgressStore } from "@/modules/intake/state"

import { AuthorizationsSection } from "./components/AuthorizationsSection"
import { EligibilityRecordsSection } from "./components/EligibilityRecordsSection"
import { GovernmentCoverageSection } from "./components/GovernmentCoverageSection"
import { InsuranceRecordsSection } from "./components/InsuranceRecordsSection"

interface Step2EligibilityInsuranceProps {
  // TODO(ui-only): Define props after state design
}

/**
 * Date Transformation Utilities
 * Transform ISO date strings from DTO to Date objects for form
 */

/**
 * Parse ISO date string to Date object
 * @param isoString - ISO 8601 date string (e.g., "2024-01-15T00:00:00Z")
 * @returns Date object or undefined if invalid
 */
function parseDateFromISO(isoString: string | undefined | null): Date | undefined {
  if (!isoString) {
    return undefined
  }

  try {
    const date = new Date(isoString)
    // Check if date is valid (not NaN)
    if (isNaN(date.getTime())) {
      return undefined
    }
    return date
  } catch {
    return undefined
  }
}

/**
 * Map InsuranceCoverageDTO array to form-compatible structure
 * Transforms ISO date strings to Date objects
 * @param dtos - Array of InsuranceCoverageDTO from snapshot
 * @returns Array with Date objects for form consumption
 */
function mapCoveragesToForm(dtos: Array<Record<string, unknown>>): Array<Record<string, unknown>> {
  if (!Array.isArray(dtos)) {
    return []
  }

  return dtos.map(dto => ({
    ...dto,
    // Transform date fields: ISO string → Date object
    subscriberDateOfBirth: parseDateFromISO(dto.subscriberDateOfBirth as string),
    effectiveDate: parseDateFromISO(dto.effectiveDate as string),
    expirationDate: parseDateFromISO(dto.expirationDate as string),
    verificationDate: parseDateFromISO(dto.verificationDate as string),
    preAuthExpiration: parseDateFromISO(dto.preAuthExpiration as string)
  }))
}

/**
 * Map InsuranceEligibilityOutputDTO to form defaultValues structure
 * Extracts nested data and transforms insuranceCoverages array
 * @param snapshot - InsuranceEligibilityOutputDTO from getInsuranceSnapshotAction
 * @returns Partial<InsuranceEligibility> ready for form.reset()
 */
function mapSnapshotToFormDefaults(snapshot: Record<string, unknown>): Partial<InsuranceEligibility> {
  if (!snapshot?.data) {
    return {}
  }

  const data = snapshot.data as Record<string, unknown>

  return {
    ...data,
    // Transform coverage array with date parsing
    insuranceCoverages: mapCoveragesToForm((data.insuranceCoverages ?? []) as Array<Record<string, unknown>>)
  }
}

/**
 * Step 2: Eligibility & Insurance
 * UI component for insurance and eligibility management
 * SoC: UI layer only - no business logic or API calls
 */
export function Step2EligibilityInsurance({}: Step2EligibilityInsuranceProps) {
  const pathname = usePathname()

  // Loading and error states for server actions
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Ref for error alert to manage focus
  const errorAlertRef = useRef<HTMLDivElement>(null)

  // Section expand/collapse state
  const [expandedSections, setExpandedSections] = useState({
    government: true,  // Government section
    eligibility: false,  // Eligibility Records section
    insurance: false,  // Insurance Records section
    authorizations: false  // Authorizations section
  })

  // Navigation actions from wizard store
  const { nextStep, prevStep } = useWizardProgressStore()

  // Initialize React Hook Form with Zod resolver
  const form = useForm<Partial<InsuranceEligibility>>({
    resolver: zodResolver(insuranceEligibilityDataSchema.partial()),
    mode: 'onBlur',
    defaultValues: {
      insuranceCoverages: [],
      isUninsured: false,
      uninsuredReason: undefined,
      eligibilityCriteria: {
        residesInServiceArea: 'unknown',
        ageGroup: 'adult',
        isEligibleByAge: false,
        hasDiagnosedMentalHealth: 'unknown',
        diagnosisVerified: false,
        impactsDaily: 'unknown',
        impactsWork: 'unknown',
        impactsRelationships: 'unknown',
        suicidalIdeation: 'unknown',
        substanceUse: 'unknown',
        domesticViolence: 'unknown',
        homelessness: 'unknown',
        isVeteran: false,
        isPregnantPostpartum: false,
        isFirstResponder: false,
        hasDisability: false,
        hasMinorChildren: false,
        involvedWithDCF: false,
        courtOrdered: false
      },
      financialInformation: {
        incomeVerified: false,
        medicaidEligible: false,
        medicareEligible: false,
        slidingFeeEligible: false,
        financialHardship: false,
        hardshipDocumented: false,
        assistanceRequested: false,
        assistanceApproved: false,
        billingPreference: 'insurance',
        paymentPlanRequested: false,
        paymentPlanApproved: false,
        documentsProvided: [],
        documentsNeeded: []
      }
    }
  })

  // Load existing insurance & eligibility data on mount using snapshot view
  // Guard: Skip preload if we're in /patients/new (no existing patient to load)
  useEffect(() => {
    // Check if we're in the "new" patient flow
    const isNewPatient = pathname?.includes('/patients/new')

    if (isNewPatient) {
      // Skip preload - use default empty form values
      return
    }

    const loadData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Call getInsuranceSnapshotAction with empty object (patientId auto-resolved)
        const result = await getInsuranceSnapshotAction({ patientId: '' })

        if (result.ok && result.data) {
          // Transform snapshot DTO to form structure (ISO dates → Date objects)
          const formData = mapSnapshotToFormDefaults(result.data)

          // Hydrate form with transformed data (RHF handles FieldArray initialization)
          form.reset(formData)
        } else if (!result.ok && result.error?.code !== 'NOT_FOUND') {
          // Show error for failures other than NOT_FOUND (no data is expected state)
          setError('Something went wrong while loading your information. Please refresh the page.')
        }
        // If NOT_FOUND or NOT_IMPLEMENTED, use defaults (already set in defaultValues)
      } catch {
        // Unexpected error - show generic message
        setError('Something went wrong while loading your information. Please refresh the page.')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [pathname])

  // Focus error alert when error is set
  useEffect(() => {
    if (error && errorAlertRef.current) {
      errorAlertRef.current.focus()
    }
  }, [error])

  // Handle form submission with server action
  const onSubmit = async (data: Partial<InsuranceEligibility>) => {
    setIsSaving(true)
    setError(null)

    try {
      const result = await upsertInsuranceEligibilityAction(data as Record<string, unknown>)

      if (result.ok) {
        // Success - navigate to next step
        nextStep()
      } else {
        // Show generic error message
        setError('Something went wrong. Please try again.')
      }
    } catch {
      // Generic error message for any exceptions
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-4 @container">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-[var(--foreground)]">
            Insurance & Eligibility
          </h1>
          <p className="text-sm text-[var(--muted-foreground)] mt-2">
            Manage insurance information, verify coverage, and handle authorizations
          </p>
        </header>

        {/* Error display with role=alert */}
        {error && (
          <div
            ref={errorAlertRef}
            role="alert"
            aria-live="polite"
            className="p-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            tabIndex={-1}
          >
            {error}
          </div>
        )}

        {/* Loading state with aria-busy */}
        <div aria-busy={isLoading} aria-live="polite" className="space-y-6">
          {isLoading && (
            <div className="p-4 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
              Loading insurance & eligibility information...
            </div>
          )}
          {/* Government programs - First section */}
          <GovernmentCoverageSection
            onSectionToggle={() => toggleSection('government')}
            isExpanded={expandedSections.government}
          />

          {/* Eligibility Records - Second section */}
          <EligibilityRecordsSection
            onSectionToggle={() => toggleSection('eligibility')}
            isExpanded={expandedSections.eligibility}
          />

          {/* Insurance Records - Third section */}
          <InsuranceRecordsSection
            onSectionToggle={() => toggleSection('insurance')}
            isExpanded={expandedSections.insurance}
          />

          {/* Authorizations - Fourth section */}
          <AuthorizationsSection
            onSectionToggle={() => toggleSection('authorizations')}
            isExpanded={expandedSections.authorizations}
          />
        </div>

        {/* Form actions */}
        <div className="flex justify-between pt-8 border-t border-[var(--border)]">
          <button
            type="button"
            onClick={prevStep}
            disabled={isSaving || isLoading}
            className="px-6 py-3 text-sm font-medium rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Go back to previous step"
          >
            Back
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => form.handleSubmit(onSubmit)()}
              disabled={isSaving || isLoading}
              aria-busy={isSaving}
              className="px-6 py-3 text-sm font-medium rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Save current progress"
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              type="submit"
              disabled={isSaving || isLoading}
              aria-busy={isSaving}
              className="px-6 py-3 text-sm font-medium rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Continue to next step"
            >
              {isSaving ? 'Saving...' : 'Continue'}
            </button>
          </div>
        </div>
      </form>
    </Form>
  )
}