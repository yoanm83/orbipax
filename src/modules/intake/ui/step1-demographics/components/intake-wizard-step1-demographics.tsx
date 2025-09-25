'use client'

import { useState } from 'react'
import {
  useStep1ExpandedSections,
  useStep1UIStore,
  useWizardProgressStore
} from "@/modules/intake/state"
import { AddressSection } from "./AddressSection"
import { ContactSection } from "./ContactSection"
import { LegalSection } from "./LegalSection"
import { PersonalInfoSection } from "./PersonalInfoSection"

export function IntakeWizardStep1Demographics() {
  const expandedSections = useStep1ExpandedSections()
  const { toggleSection } = useStep1UIStore()

  // Navigation actions from wizard store
  const { nextStep, prevStep } = useWizardProgressStore()

  // Shared DOB state for Legal Section to calculate minor status
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null)

  return (
    <div className="flex-1 w-full p-6">
      {/* Header removed to match Legacy - sections have their own headers */}

      <div className="space-y-6">
        <PersonalInfoSection
          onSectionToggle={() => toggleSection('personal')}
          isExpanded={expandedSections.personal}
          onDOBChange={setDateOfBirth}
        />

        <AddressSection
          onSectionToggle={() => toggleSection('address')}
          isExpanded={expandedSections.address}
        />

        <ContactSection
          onSectionToggle={() => toggleSection('contact')}
          isExpanded={expandedSections.contact}
        />

        <LegalSection
          onSectionToggle={() => toggleSection('legal')}
          isExpanded={expandedSections.legal}
          dateOfBirth={dateOfBirth}
        />
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-8 mt-8 border-t border-[var(--border)]">
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