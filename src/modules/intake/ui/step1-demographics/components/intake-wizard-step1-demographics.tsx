'use client'

import {
  useStep1ExpandedSections,
  useStep1UIStore
} from "@/modules/intake/state"
import { AddressSection } from "./AddressSection"
import { ContactSection } from "./ContactSection"
import { LegalSection } from "./LegalSection"
import { PersonalInfoSection } from "./PersonalInfoSection"

export function IntakeWizardStep1Demographics() {
  const expandedSections = useStep1ExpandedSections()
  const { toggleSection } = useStep1UIStore()

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-fg mb-2">
          Demographics Information
        </h1>
        <p className="text-on-muted">
          Please provide your personal demographic information below.
        </p>
      </div>

      <PersonalInfoSection
        onSectionToggle={() => toggleSection('personal')}
        isExpanded={expandedSections.personal}
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
      />
    </div>
  )
}