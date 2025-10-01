'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { usePathname } from 'next/navigation'

import { Button } from "@/shared/ui/primitives/Button"
import { Form } from "@/shared/ui/primitives/Form"
import { demographicsSchema, type Demographics } from "@/modules/intake/domain/schemas/demographics/demographics.schema"

import {
  useStep1ExpandedSections,
  useStep1UIStore,
  useWizardProgressStore
} from "@/modules/intake/state"

import {
  loadDemographicsAction,
  saveDemographicsAction
} from "@/modules/intake/actions/step1"

import { AddressSection } from "./components/AddressSection"
import { ContactSection } from "./components/ContactSection"
import { LegalSection } from "./components/LegalSection"
import { PersonalInfoSection } from "./components/PersonalInfoSection"

export function IntakeWizardStep1Demographics() {
  const pathname = usePathname()
  const expandedSections = useStep1ExpandedSections()
  const { toggleSection } = useStep1UIStore()

  // Navigation actions from wizard store
  const { nextStep, prevStep } = useWizardProgressStore()

  // Shared DOB state for Legal Section to calculate minor status
  const [dateOfBirth, setDateOfBirth] = useState<Date | null>(null)

  // Loading and error states for server actions
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize React Hook Form with Zod resolver
  const form = useForm<Partial<Demographics>>({
    resolver: zodResolver(demographicsSchema.partial()),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      preferredName: '',
      dateOfBirth: undefined,
      gender: undefined,
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

  // Load existing demographics data on mount
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
        const result = await loadDemographicsAction()

        if (result.ok && result.data) {
          // Update form with loaded data
          form.reset(result.data as Partial<Demographics>)
        }
        // If no data exists, use defaults (already set)
      } catch (err) {
        // Silent fail for loading - defaults will be used
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  // Handle form submission with server action
  const onSubmit = async (data: Partial<Demographics>) => {
    setIsSaving(true)
    setError(null)

    try {
      const result = await saveDemographicsAction(data as any) // Type casting for DTO

      if (result.ok) {
        // Success - navigate to next step
        nextStep()
      } else {
        // Show generic error message
        setError('Could not save demographics. Please try again.')
      }
    } catch (err) {
      // Generic error message for any exceptions
      setError('An error occurred. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 w-full">
        <div className="p-6 space-y-4">
          {/* Error message display */}
          {error && (
            <div className="p-4 mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md" role="alert">
              {error}
            </div>
          )}

          {/* Show loading overlay */}
          {isLoading && (
            <div className="p-4 mb-4 text-sm text-blue-600 bg-blue-50 border border-blue-200 rounded-md">
              Loading existing information...
            </div>
          )}
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
              disabled={isLoading || isSaving}
              aria-label="Go back to previous step"
            >
              Back
            </Button>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="min-h-[44px]"
                disabled={isLoading || isSaving}
                aria-label="Save current progress"
                onClick={form.handleSubmit(onSubmit)}
              >
                {isSaving ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button
                type="submit"
                variant="default"
                className="min-h-[44px]"
                disabled={isLoading || isSaving}
                aria-label="Continue to next step"
              >
                {isSaving ? 'Saving...' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
