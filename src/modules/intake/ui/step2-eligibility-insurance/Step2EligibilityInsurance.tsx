"use client"

import { useState } from "react"
import { useWizardProgressStore } from "@/modules/intake/state"
import { GovernmentCoverageSection } from "./components/GovernmentCoverageSection"
import { EligibilityRecordsSection } from "./components/EligibilityRecordsSection"
import { InsuranceRecordsSection } from "./components/InsuranceRecordsSection"
import { AuthorizationsSection } from "./components/AuthorizationsSection"

interface Step2EligibilityInsuranceProps {
  // TODO(ui-only): Define props after state design
}

/**
 * Step 2: Eligibility & Insurance
 * UI component for insurance and eligibility management
 * SoC: UI layer only - no business logic or API calls
 */
export function Step2EligibilityInsurance({}: Step2EligibilityInsuranceProps) {
  // TODO(ui-only): Replace with actual state management
  const [expandedSections, setExpandedSections] = useState({
    government: true,  // Government section
    eligibility: false,  // Eligibility Records section
    insurance: false,  // Insurance Records section
    authorizations: false  // Authorizations section
  })

  // Navigation actions from wizard store
  const { nextStep, prevStep } = useWizardProgressStore()

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

      <div className="space-y-6">
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
          className="px-6 py-3 text-sm font-medium rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] min-h-[44px]"
          aria-label="Go back to previous step"
        >
          Back
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            className="px-6 py-3 text-sm font-medium rounded-md border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] hover:bg-[var(--accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] min-h-[44px]"
            aria-label="Save current progress"
          >
            Save Draft
          </button>
          <button
            type="button"
            onClick={nextStep}
            className="px-6 py-3 text-sm font-medium rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary)]/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] min-h-[44px]"
            aria-label="Continue to next step"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}