'use client'

import { Wallet, ChevronUp, ChevronDown } from "lucide-react"
import { useMemo, useEffect } from "react"
import { useFormContext, Controller, useFieldArray } from "react-hook-form"

import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { DatePicker } from "@/shared/ui/primitives/DatePicker"
import { Input } from "@/shared/ui/primitives/Input"
import { Label } from "@/shared/ui/primitives/label"

import type { InsuranceEligibility } from "@/modules/intake/domain/schemas/insurance-eligibility"

interface GovernmentCoverageSectionProps {
  onSectionToggle: () => void
  isExpanded: boolean
}

/**
 * Government Coverage Section
 * Handles Medicare, Medicaid, and other government insurance programs
 * SoC: UI layer only - no business logic or API calls
 */
export function GovernmentCoverageSection({ onSectionToggle, isExpanded }: GovernmentCoverageSectionProps) {
  // Get form context from parent FormProvider
  const { control, formState: { errors } } = useFormContext<Partial<InsuranceEligibility>>()

  // Manage insurance coverages array
  const { fields, append } = useFieldArray({
    control,
    name: 'insuranceCoverages'
  })

  // Find or create indices for Medicaid and Medicare entries
  const medicaidIndex = useMemo(() => {
    return fields.findIndex(field => field.type === 'medicaid')
  }, [fields])

  const medicareIndex = useMemo(() => {
    return fields.findIndex(field => field.type === 'medicare')
  }, [fields])

  // Create missing coverage entries on mount only
  useEffect(() => {
    if (medicaidIndex === -1) {
      append({
        type: 'medicaid',
        carrierName: 'Medicaid',
        policyNumber: '',
        subscriberName: '',
        subscriberDateOfBirth: new Date(),
        subscriberRelationship: 'self',
        effectiveDate: new Date(),
        isPrimary: false,
        isVerified: false,
        hasMentalHealthCoverage: 'unknown',
        requiresPreAuth: 'unknown'
      })
    }
  }, [medicaidIndex, append])

  useEffect(() => {
    if (medicareIndex === -1) {
      append({
        type: 'medicare',
        carrierName: 'Medicare',
        policyNumber: '',
        subscriberName: '',
        subscriberDateOfBirth: new Date(),
        subscriberRelationship: 'self',
        effectiveDate: new Date(),
        isPrimary: false,
        isVerified: false,
        hasMentalHealthCoverage: 'unknown',
        requiresPreAuth: 'unknown'
      })
    }
  }, [medicareIndex, append])

  // Generate unique section ID for this instance
  const sectionUid = useMemo(() => `gov_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, [])

  // Get final indices after effects have run
  const finalMedicaidIndex = fields.findIndex(field => field.type === 'medicaid')
  const finalMedicareIndex = fields.findIndex(field => field.type === 'medicare')

  return (
    <Card className="w-full rounded-3xl shadow-md mb-6">
      <div
        id={`gov-${sectionUid}-header`}
        className="py-3 px-6 flex justify-between items-center cursor-pointer min-h-[44px]"
        onClick={onSectionToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onSectionToggle()
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={`gov-${sectionUid}-panel`}
      >
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">
            Government Coverage
          </h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardBody id={`gov-${sectionUid}-panel`} aria-labelledby={`gov-${sectionUid}-header`} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field 1: Medicaid ID - mapped to insuranceCoverages[medicaid].policyNumber */}
            {finalMedicaidIndex >= 0 && (
              <div>
                <Label htmlFor="gov-medicaid-id">Medicaid ID</Label>
                <Controller
                  name={`insuranceCoverages.${finalMedicaidIndex}.policyNumber`} // sentinel: mapped to insuranceCoverages[].policyNumber
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        {...field}
                        id="gov-medicaid-id"
                        placeholder="Enter Medicaid ID"
                        className="mt-1"
                        aria-label="Medicaid ID"
                        aria-invalid={!!errors?.insuranceCoverages?.[finalMedicaidIndex]?.policyNumber}
                        aria-describedby={errors?.insuranceCoverages?.[finalMedicaidIndex]?.policyNumber ? "gov-medicaid-id-error" : undefined}
                      />
                      {errors?.insuranceCoverages?.[finalMedicaidIndex]?.policyNumber && (
                        <p id="gov-medicaid-id-error" role="alert" className="text-sm text-[var(--destructive)] mt-1">
                          {errors.insuranceCoverages[finalMedicaidIndex].policyNumber.message ?? "Invalid Medicaid ID"}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            )}

            {/* Field 2: Medicaid Effective Date - mapped to insuranceCoverages[medicaid].effectiveDate */}
            {finalMedicaidIndex >= 0 && (
              <div>
                <Label htmlFor="gov-medicaid-effective-date">Medicaid Effective Date</Label>
                <Controller
                  name={`insuranceCoverages.${finalMedicaidIndex}.effectiveDate`} // sentinel: mapped to insuranceCoverages[].effectiveDate
                  control={control}
                  render={({ field }) => (
                    <>
                      <DatePicker
                        {...field}
                        id="gov-medicaid-effective-date"
                        placeholder="Select date"
                        className="mt-1"
                        aria-invalid={!!errors?.insuranceCoverages?.[finalMedicaidIndex]?.effectiveDate}
                        aria-describedby={errors?.insuranceCoverages?.[finalMedicaidIndex]?.effectiveDate ? "gov-medicaid-date-error" : undefined}
                      />
                      {errors?.insuranceCoverages?.[finalMedicaidIndex]?.effectiveDate && (
                        <p id="gov-medicaid-date-error" role="alert" className="text-sm text-[var(--destructive)] mt-1">
                          {errors.insuranceCoverages[finalMedicaidIndex].effectiveDate.message ?? "Invalid date"}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            )}

            {/* Field 3: Medicare ID - mapped to insuranceCoverages[medicare].policyNumber */}
            {finalMedicareIndex >= 0 && (
              <div>
                <Label htmlFor="gov-medicare-id">Medicare ID</Label>
                <Controller
                  name={`insuranceCoverages.${finalMedicareIndex}.policyNumber`} // sentinel: mapped to insuranceCoverages[].policyNumber
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        {...field}
                        id="gov-medicare-id"
                        placeholder="Enter Medicare ID"
                        className="mt-1"
                        aria-label="Medicare ID"
                        aria-invalid={!!errors?.insuranceCoverages?.[finalMedicareIndex]?.policyNumber}
                        aria-describedby={errors?.insuranceCoverages?.[finalMedicareIndex]?.policyNumber ? "gov-medicare-id-error" : undefined}
                      />
                      {errors?.insuranceCoverages?.[finalMedicareIndex]?.policyNumber && (
                        <p id="gov-medicare-id-error" role="alert" className="text-sm text-[var(--destructive)] mt-1">
                          {errors.insuranceCoverages[finalMedicareIndex].policyNumber.message ?? "Invalid Medicare ID"}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            )}

            {/* Field 4: Social Security Number - mapped to insuranceCoverages[medicaid].subscriberSSN */}
            {finalMedicaidIndex >= 0 && (
              <div>
                <Label htmlFor="gov-ssn">Social Security Number</Label>
                <Controller
                  name={`insuranceCoverages.${finalMedicaidIndex}.subscriberSSN`} // sentinel: mapped to insuranceCoverages[].subscriberSSN (using Medicaid entry)
                  control={control}
                  render={({ field }) => (
                    <>
                      <Input
                        {...field}
                        id="gov-ssn"
                        type="password"
                        placeholder="XXX-XX-XXXX"
                        className="mt-1"
                        aria-label="Social Security Number"
                        aria-describedby="gov-ssn-hint"
                        aria-invalid={!!errors?.insuranceCoverages?.[finalMedicaidIndex]?.subscriberSSN}
                      />
                      <span id="gov-ssn-hint" className="text-xs text-[var(--muted-foreground)] mt-1 block">
                        Format: XXX-XX-XXXX (last 4 digits visible)
                      </span>
                      {errors?.insuranceCoverages?.[finalMedicaidIndex]?.subscriberSSN && (
                        <p id="gov-ssn-error" role="alert" className="text-sm text-[var(--destructive)] mt-1">
                          {errors.insuranceCoverages[finalMedicaidIndex].subscriberSSN.message ?? "Invalid SSN"}
                        </p>
                      )}
                    </>
                  )}
                />
              </div>
            )}
          </div>
        </CardBody>
      )}
    </Card>
  )
}