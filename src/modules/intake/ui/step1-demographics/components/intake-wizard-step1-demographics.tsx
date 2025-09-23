'use client'

import {
  useStep1ExpandedSections,
  useStep1UIStore
} from "@/modules/intake/state"
import { AddressSection } from "./AddressSection"
import { ContactSection } from "./ContactSection"
import { LegalSection } from "./LegalSection"
import { PersonalInfoSection } from "./PersonalInfoSection"
import { Step1SkinScope } from "./Step1SkinScope"

export function IntakeWizardStep1Demographics() {
  const expandedSections = useStep1ExpandedSections()
  const { toggleSection } = useStep1UIStore()

  return (
    <Step1SkinScope>
      <div className="flex-1 w-full p-6">
        {/* Header removed to match Legacy - sections have their own headers */}

        <div className="space-y-6">
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
      </div>
    </Step1SkinScope>
  )
}