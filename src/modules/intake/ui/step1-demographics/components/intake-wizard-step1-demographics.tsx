'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from "@/shared/ui/primitives/Button"
import { Form } from "@/shared/ui/primitives/Form"
import { demographicsDataSchema, type DemographicsData } from "@/modules/intake/domain/schemas/demographics/demographics.schema"

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

  // Initialize React Hook Form with Zod resolver
  const form = useForm<Partial<DemographicsData>>({
    resolver: zodResolver(demographicsDataSchema.partial()),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      preferredName: '',
      dateOfBirth: undefined,
      genderIdentity: undefined,
      race: [],
      ethnicity: undefined,
      maritalStatus: undefined,
      veteranStatus: undefined,
      primaryLanguage: undefined,
      needsInterpreter: false,
      preferredCommunicationMethod: [],
      email: '',
      phoneNumbers: [
        { number: '', type: 'mobile', isPrimary: true }
      ],
      address: {
        street1: '',
        street2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US'
      },
      sameAsMailingAddress: true,
      mailingAddress: {
        street1: '',
        street2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US'
      },
      housingStatus: undefined,
      emergencyContact: {
        name: '',
        relationship: '',
        phoneNumber: '',
        alternatePhone: ''
      },
      socialSecurityNumber: '',
      hasLegalGuardian: false,
      legalGuardianInfo: undefined,
      hasPowerOfAttorney: false,
      powerOfAttorneyInfo: undefined
    }
  })

  // Handle form submission (UI validation only for now)
  const onSubmit = (data: Partial<DemographicsData>) => {
    console.log('Form data validated:', data)
    // TODO: Submit to server action
    nextStep()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 w-full">
        <div className="p-6 space-y-4">
          <PersonalInfoSection
            onSectionToggle={() => toggleSection('personal')}
            isExpanded={expandedSections.personal}
            onDOBChange={setDateOfBirth}
            form={form}
          />

          <AddressSection
            onSectionToggle={() => toggleSection('address')}
            isExpanded={expandedSections.address}
            form={form}
          />

          <ContactSection
            onSectionToggle={() => toggleSection('contact')}
            isExpanded={expandedSections.contact}
            form={form}
          />

          <LegalSection
            onSectionToggle={() => toggleSection('legal')}
            isExpanded={expandedSections.legal}
            dateOfBirth={dateOfBirth}
            form={form}
          />

          {/* Navigation buttons */}
          <div className="flex justify-between pt-6 mt-6 border-t border-[var(--border)]">
            <Button
              type="button"
              onClick={prevStep}
              variant="secondary"
              className="min-h-[44px]"
              aria-label="Go back to previous step"
            >
              Back
            </Button>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="min-h-[44px]"
                aria-label="Save current progress"
              >
                Save Draft
              </Button>
              <Button
                type="submit"
                variant="default"
                className="min-h-[44px]"
                aria-label="Continue to next step"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}