'use client'

import { Shield, ChevronUp, ChevronDown, Plus, Trash2, Save } from "lucide-react"
import { useMemo, useState } from "react"
import { useFormContext, Controller, useFieldArray } from "react-hook-form"

import { Button } from "@/shared/ui/primitives/Button"
import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { Checkbox } from "@/shared/ui/primitives/Checkbox"
import { DatePicker } from "@/shared/ui/primitives/DatePicker"
import { EmptyState } from "@/shared/ui/primitives/EmptyState"
import { Input } from "@/shared/ui/primitives/Input"
import { Label } from "@/shared/ui/primitives/Label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shared/ui/primitives/Select"
import { toast } from "@/shared/ui/primitives/Toast"

import { saveInsuranceCoverageAction } from "@/modules/intake/actions/step2/insurance.actions"
import type { InsuranceEligibility } from "@/modules/intake/domain/schemas/insurance-eligibility"

interface InsuranceRecordsSectionProps {
  onSectionToggle: () => void
  isExpanded: boolean
}

/**
 * Insurance Records Section
 * Handles multiple insurance records with add/remove functionality
 * SoC: UI layer only - no business logic or API calls
 */
export function InsuranceRecordsSection({ onSectionToggle, isExpanded }: InsuranceRecordsSectionProps) {
  // Toast notifications (using sonner directly)

  // Loading states per card (indexed by field.id)
  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({})

  // Error states per card (indexed by field.id)
  const [errorStates, setErrorStates] = useState<Record<string, string>>({})

  // Get form context from parent FormProvider
  const { control, register, getValues, formState: { errors } } = useFormContext<Partial<InsuranceEligibility>>()

  // Manage insurance coverages array
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'insuranceCoverages'
  })

  // Generate unique section ID for this instance
  const sectionUid = useMemo(() => `ins_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, [])

  /**
   * Save individual insurance coverage record
   * Calls server action with coverage data from form
   * PatientId is auto-generated in the action using session-based identifier
   */
  async function handleSaveCoverage(index: number, fieldId: string) {
    // Mark this card as saving and clear any previous error
    setSavingStates(prev => ({ ...prev, [fieldId]: true }))
    setErrorStates(prev => {
      const newErrors = { ...prev }
      delete newErrors[fieldId]
      return newErrors
    })

    try {
      // Get coverage data from form (RHF state)
      const coverage = getValues(`insuranceCoverages.${index}`)

      // Call server action without patientId - will be auto-generated from session
      // See insurance.actions.ts:248-250 for patientId resolution logic
      const result = await saveInsuranceCoverageAction({ coverage })

      // Handle response
      if (result.ok) {
        toast({
          title: 'Success',
          description: 'Insurance coverage saved successfully',
          variant: 'success'
        })
      } else {
        // Show generic error message (no PII, no DB details)
        const errorMessage = result.error?.message ?? 'Something went wrong. Please try again.'
        setErrorStates(prev => ({ ...prev, [fieldId]: errorMessage }))
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive'
        })
      }
    } catch {
      // Unexpected error - show generic message
      const errorMessage = 'Something went wrong. Please try again.'
      setErrorStates(prev => ({ ...prev, [fieldId]: errorMessage }))
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      // Clear loading state
      setSavingStates(prev => ({ ...prev, [fieldId]: false }))
    }
  }

  function addRecord() {
    append({
      type: 'private', // Default to private insurance
      carrierName: '',
      policyNumber: '',
      groupNumber: '',
      planKind: undefined, // Let user select plan type
      planName: null, // Nullable field, user can enter
      subscriberName: '',
      subscriberDateOfBirth: undefined, // Let validation require it
      subscriberRelationship: 'self',
      effectiveDate: new Date(),
      expirationDate: undefined,
      isPrimary: false // Don't force primary, let user decide
    })
  }

  function removeRecord(index: number) {
    remove(index)
  }

  return (
    <Card className="w-full rounded-3xl shadow-md mb-6">
      <div
        id={`ins-${sectionUid}-header`}
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
        aria-controls={`ins-${sectionUid}-panel`}
      >
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">
            Insurance Records
          </h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardBody id={`ins-${sectionUid}-panel`} aria-labelledby={`ins-${sectionUid}-header`} className="p-6">
          <div className="space-y-6">
            {/* Empty state when no insurance records */}
            {fields.length === 0 && (
              <EmptyState
                size="md"
                variant="minimal"
                icon={<Shield className="w-full h-full" />}
                title="No insurance records"
                description="Add insurance coverage information to continue with the intake process."
                actions={
                  <Button
                    variant="default"
                    onClick={addRecord}
                    className="min-h-[44px]"
                    aria-label="Add your first insurance record"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Insurance Record
                  </Button>
                }
              />
            )}

            {/* Dynamic insurance records */}
            {fields.map((field, index) => (
              <div key={field.id} className="space-y-4" aria-busy={savingStates[field.id]}>
                {/* Record header with title and remove button */}
                {(fields.length > 1 || index > 0) && (
                  <div className="flex justify-between items-center pb-2">
                    <h3
                      id={`ins-${field.id}-heading`}
                      className="text-md font-medium text-[var(--foreground)]"
                    >
                      Insurance Record {index + 1}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeRecord(index)
                      }}
                      aria-label={`Remove insurance record ${index + 1}`}
                      className="text-[var(--destructive)]"
                      disabled={savingStates[field.id]}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Error alert for this card */}
                {errorStates[field.id] && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm"
                  >
                    {errorStates[field.id]}
                  </div>
                )}

                {/* Fields grid - same pattern as other sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-labelledby={fields.length > 1 ? `ins-${field.id}-heading` : undefined}>
                  {/* Insurance Type (required) - mapped to type */}
                  <div>
                    <Label htmlFor={`ins-${field.id}-type`}>
                      Insurance Type<span className="text-[var(--destructive)]">*</span>
                    </Label>
                    <Controller
                      name={`insuranceCoverages.${index}.type`} // sentinel: mapped to insuranceCoverages[].type
                      control={control}
                      render={({ field: controllerField }) => (
                        <>
                          <Select
                            value={controllerField.value}
                            onValueChange={controllerField.onChange}
                          >
                            <SelectTrigger
                              id={`ins-${field.id}-type`}
                              className="mt-1"
                              aria-label="Insurance Type"
                              aria-required="true"
                              aria-invalid={!!errors?.insuranceCoverages?.[index]?.type}
                              aria-describedby={errors?.insuranceCoverages?.[index]?.type ? `ins-${field.id}-type-error` : undefined}
                            >
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="medicaid">Medicaid</SelectItem>
                              <SelectItem value="medicare">Medicare</SelectItem>
                              <SelectItem value="private">Private</SelectItem>
                              <SelectItem value="tricare">TRICARE</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors?.insuranceCoverages?.[index]?.type && (
                            <p id={`ins-${field.id}-type-error`} role="alert" className="text-sm text-[var(--destructive)] mt-1">
                              {errors.insuranceCoverages[index].type.message ?? "Insurance type is required"}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  {/* Insurance Carrier (required) - mapped to carrierName */}
                  <div>
                    <Label htmlFor={`ins-${field.id}-carrier`}>
                      Insurance Carrier<span className="text-[var(--destructive)]">*</span>
                    </Label>
                    <Controller
                      name={`insuranceCoverages.${index}.carrierName`} // sentinel: mapped to insuranceCoverages[].carrierName
                      control={control}
                      render={({ field: controllerField }) => (
                        <>
                          <Select
                            value={controllerField.value}
                            onValueChange={controllerField.onChange}
                          >
                            <SelectTrigger
                              id={`ins-${field.id}-carrier`}
                              className="mt-1"
                              aria-label="Insurance Carrier"
                              aria-required="true"
                              aria-invalid={!!errors?.insuranceCoverages?.[index]?.carrierName}
                              aria-describedby={errors?.insuranceCoverages?.[index]?.carrierName ? `ins-${field.id}-carrier-error` : undefined}
                            >
                              <SelectValue placeholder="Select carrier" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Aetna">Aetna</SelectItem>
                              <SelectItem value="Blue Cross Blue Shield">Blue Cross Blue Shield</SelectItem>
                              <SelectItem value="Cigna">Cigna</SelectItem>
                              <SelectItem value="Humana">Humana</SelectItem>
                              <SelectItem value="United Healthcare">United Healthcare</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors?.insuranceCoverages?.[index]?.carrierName && (
                            <p id={`ins-${field.id}-carrier-error`} role="alert" className="text-sm text-[var(--destructive)] mt-1">
                              {errors.insuranceCoverages[index].carrierName.message ?? "Carrier is required"}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  {/* Member ID (required) - mapped to policyNumber */}
                  <div>
                    <Label htmlFor={`ins-${field.id}-memberId`}>
                      Member ID<span className="text-[var(--destructive)]">*</span>
                    </Label>
                    <Input
                      {...register(`insuranceCoverages.${index}.policyNumber`)} // sentinel: mapped to insuranceCoverages[].policyNumber
                      id={`ins-${field.id}-memberId`}
                      placeholder="Enter member ID"
                      className="mt-1"
                      aria-label="Member ID"
                      aria-required="true"
                      aria-invalid={!!errors?.insuranceCoverages?.[index]?.policyNumber}
                      aria-describedby={errors?.insuranceCoverages?.[index]?.policyNumber ? `ins-${field.id}-memberId-error` : undefined}
                    />
                    {errors?.insuranceCoverages?.[index]?.policyNumber && (
                      <p id={`ins-${field.id}-memberId-error`} role="alert" className="text-sm text-[var(--destructive)] mt-1">
                        {errors.insuranceCoverages[index].policyNumber.message ?? "Member ID is required"}
                      </p>
                    )}
                  </div>

                  {/* Group Number - mapped to groupNumber */}
                  <div>
                    <Label htmlFor={`ins-${field.id}-groupNumber`}>
                      Group Number
                    </Label>
                    <Input
                      {...register(`insuranceCoverages.${index}.groupNumber`)} // sentinel: mapped to insuranceCoverages[].groupNumber
                      id={`ins-${field.id}-groupNumber`}
                      placeholder="Enter group number"
                      className="mt-1"
                      aria-label="Group Number"
                      aria-invalid={!!errors?.insuranceCoverages?.[index]?.groupNumber}
                      aria-describedby={errors?.insuranceCoverages?.[index]?.groupNumber ? `ins-${field.id}-groupNumber-error` : undefined}
                    />
                    {errors?.insuranceCoverages?.[index]?.groupNumber && (
                      <p id={`ins-${field.id}-groupNumber-error`} role="alert" className="text-sm text-[var(--destructive)] mt-1">
                        {errors.insuranceCoverages[index].groupNumber.message ?? "Invalid group number"}
                      </p>
                    )}
                  </div>

                  {/* Effective Date (required) - mapped to effectiveDate */}
                  <div>
                    <Label htmlFor={`ins-${field.id}-effectiveDate`}>
                      Effective Date<span className="text-[var(--destructive)]">*</span>
                    </Label>
                    <Controller
                      name={`insuranceCoverages.${index}.effectiveDate`} // sentinel: mapped to insuranceCoverages[].effectiveDate
                      control={control}
                      render={({ field: controllerField }) => (
                        <>
                          <DatePicker
                            {...controllerField}
                            id={`ins-${field.id}-effectiveDate`}
                            placeholder="Select date"
                            className="mt-1"
                            aria-label="Effective Date"
                            aria-required={true}
                            aria-invalid={!!errors?.insuranceCoverages?.[index]?.effectiveDate}
                            aria-describedby={errors?.insuranceCoverages?.[index]?.effectiveDate ? `ins-${field.id}-effectiveDate-error` : undefined}
                          />
                          {errors?.insuranceCoverages?.[index]?.effectiveDate && (
                            <p id={`ins-${field.id}-effectiveDate-error`} role="alert" className="text-sm text-[var(--destructive)] mt-1">
                              {errors.insuranceCoverages[index].effectiveDate.message ?? "Effective date is required"}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  {/* Expiration Date - mapped to expirationDate */}
                  <div>
                    <Label htmlFor={`ins-${field.id}-expirationDate`}>
                      Expiration Date
                    </Label>
                    <Controller
                      name={`insuranceCoverages.${index}.expirationDate`} // sentinel: mapped to insuranceCoverages[].expirationDate
                      control={control}
                      render={({ field: controllerField }) => (
                        <>
                          <DatePicker
                            {...controllerField}
                            id={`ins-${field.id}-expirationDate`}
                            placeholder="Select date"
                            className="mt-1"
                            aria-label="Expiration Date"
                            aria-invalid={!!errors?.insuranceCoverages?.[index]?.expirationDate}
                            aria-describedby={errors?.insuranceCoverages?.[index]?.expirationDate ? `ins-${field.id}-expirationDate-error` : undefined}
                          />
                          {errors?.insuranceCoverages?.[index]?.expirationDate && (
                            <p id={`ins-${field.id}-expirationDate-error`} role="alert" className="text-sm text-[var(--destructive)] mt-1">
                              {errors.insuranceCoverages[index].expirationDate.message ?? "Invalid date"}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  {/* Plan Type - mapped to planKind */}
                  <div>
                    <Label htmlFor={`ins-${field.id}-planKind`}>
                      Plan Type
                    </Label>
                    <Controller
                      name={`insuranceCoverages.${index}.planKind`}
                      control={control}
                      render={({ field: controllerField }) => (
                        <>
                          <Select
                            value={controllerField.value}
                            onValueChange={controllerField.onChange}
                          >
                            <SelectTrigger
                              id={`ins-${field.id}-planKind`}
                              className="mt-1"
                              aria-label="Plan Type"
                              aria-invalid={!!errors?.insuranceCoverages?.[index]?.planKind}
                              aria-describedby={errors?.insuranceCoverages?.[index]?.planKind ? `ins-${field.id}-planKind-error` : undefined}
                            >
                              <SelectValue placeholder="Select plan type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hmo">HMO</SelectItem>
                              <SelectItem value="ppo">PPO</SelectItem>
                              <SelectItem value="epo">EPO</SelectItem>
                              <SelectItem value="pos">POS</SelectItem>
                              <SelectItem value="hdhp">HDHP</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors?.insuranceCoverages?.[index]?.planKind && (
                            <p id={`ins-${field.id}-planKind-error`} role="alert" className="text-sm text-[var(--destructive)] mt-1">
                              {errors.insuranceCoverages[index].planKind.message ?? "Invalid plan type"}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  {/* Plan Name - mapped to planName */}
                  <div>
                    <Label htmlFor={`ins-${field.id}-planName`}>
                      Plan Name
                    </Label>
                    <Input
                      {...register(`insuranceCoverages.${index}.planName`)}
                      id={`ins-${field.id}-planName`}
                      placeholder="Enter plan name"
                      className="mt-1"
                      aria-label="Plan Name"
                      aria-invalid={!!errors?.insuranceCoverages?.[index]?.planName}
                      aria-describedby={errors?.insuranceCoverages?.[index]?.planName ? `ins-${field.id}-planName-error` : undefined}
                    />
                    {errors?.insuranceCoverages?.[index]?.planName && (
                      <p id={`ins-${field.id}-planName-error`} role="alert" className="text-sm text-[var(--destructive)] mt-1">
                        {errors.insuranceCoverages[index].planName.message ?? "Invalid plan name"}
                      </p>
                    )}
                  </div>

                  {/* Subscriber Name - mapped to subscriberName */}
                  <div>
                    <Label htmlFor={`ins-${field.id}-subscriberName`}>
                      Subscriber Name
                    </Label>
                    <Input
                      {...register(`insuranceCoverages.${index}.subscriberName`)} // sentinel: mapped to insuranceCoverages[].subscriberName
                      id={`ins-${field.id}-subscriberName`}
                      placeholder="Enter subscriber name"
                      className="mt-1"
                      aria-label="Subscriber Name"
                      aria-invalid={!!errors?.insuranceCoverages?.[index]?.subscriberName}
                      aria-describedby={errors?.insuranceCoverages?.[index]?.subscriberName ? `ins-${field.id}-subscriberName-error` : undefined}
                    />
                    {errors?.insuranceCoverages?.[index]?.subscriberName && (
                      <p id={`ins-${field.id}-subscriberName-error`} role="alert" className="text-sm text-[var(--destructive)] mt-1">
                        {errors.insuranceCoverages[index].subscriberName.message ?? "Invalid subscriber name"}
                      </p>
                    )}
                  </div>

                  {/* Subscriber Date of Birth (required) - mapped to subscriberDateOfBirth */}
                  <div>
                    <Label htmlFor={`ins-${field.id}-subscriberDOB`}>
                      Subscriber Date of Birth<span className="text-[var(--destructive)]">*</span>
                    </Label>
                    <Controller
                      name={`insuranceCoverages.${index}.subscriberDateOfBirth`} // sentinel: mapped to insuranceCoverages[].subscriberDateOfBirth
                      control={control}
                      render={({ field: controllerField }) => (
                        <>
                          <DatePicker
                            {...controllerField}
                            id={`ins-${field.id}-subscriberDOB`}
                            placeholder="Select date"
                            className="mt-1"
                            maxDate={new Date()} // Prevent future dates
                            aria-label="Subscriber Date of Birth"
                            aria-required="true"
                            aria-invalid={!!errors?.insuranceCoverages?.[index]?.subscriberDateOfBirth}
                            aria-describedby={errors?.insuranceCoverages?.[index]?.subscriberDateOfBirth ? `ins-${field.id}-subscriberDOB-error` : undefined}
                          />
                          {errors?.insuranceCoverages?.[index]?.subscriberDateOfBirth && (
                            <p id={`ins-${field.id}-subscriberDOB-error`} role="alert" className="text-sm text-[var(--destructive)] mt-1">
                              {errors.insuranceCoverages[index].subscriberDateOfBirth.message ?? "Subscriber date of birth is required"}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  {/* Relationship to Subscriber - mapped to subscriberRelationship */}
                  <div>
                    <Label htmlFor={`ins-${field.id}-relationship`}>
                      Relationship to Subscriber
                    </Label>
                    <Controller
                      name={`insuranceCoverages.${index}.subscriberRelationship`} // sentinel: mapped to insuranceCoverages[].subscriberRelationship
                      control={control}
                      render={({ field: controllerField }) => (
                        <>
                          <Select
                            value={controllerField.value}
                            onValueChange={controllerField.onChange}
                          >
                            <SelectTrigger
                              id={`ins-${field.id}-relationship`}
                              className="mt-1"
                              aria-label="Relationship to Subscriber"
                              aria-invalid={!!errors?.insuranceCoverages?.[index]?.subscriberRelationship}
                              aria-describedby={errors?.insuranceCoverages?.[index]?.subscriberRelationship ? `ins-${field.id}-relationship-error` : undefined}
                            >
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="self">Self</SelectItem>
                              <SelectItem value="spouse">Spouse</SelectItem>
                              <SelectItem value="child">Child</SelectItem>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors?.insuranceCoverages?.[index]?.subscriberRelationship && (
                            <p id={`ins-${field.id}-relationship-error`} role="alert" className="text-sm text-[var(--destructive)] mt-1">
                              {errors.insuranceCoverages[index].subscriberRelationship.message ?? "Invalid relationship"}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>

                  {/* Primary Insurance - mapped to isPrimary */}
                  <div>
                    <Label htmlFor={`ins-${field.id}-isPrimary`}>
                      Primary Insurance
                    </Label>
                    <Controller
                      name={`insuranceCoverages.${index}.isPrimary`} // sentinel: mapped to insuranceCoverages[].isPrimary
                      control={control}
                      render={({ field: controllerField }) => (
                        <>
                          <div className="flex items-center space-x-2 mt-1">
                            <Checkbox
                              id={`ins-${field.id}-isPrimary`}
                              checked={controllerField.value || false}
                              onCheckedChange={controllerField.onChange}
                              aria-label="Primary Insurance"
                              aria-invalid={!!errors?.insuranceCoverages?.[index]?.isPrimary}
                              aria-describedby={errors?.insuranceCoverages?.[index]?.isPrimary ? `ins-${field.id}-isPrimary-error` : undefined}
                            />
                            <Label
                              htmlFor={`ins-${field.id}-isPrimary`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              This is the primary insurance
                            </Label>
                          </div>
                          {errors?.insuranceCoverages?.[index]?.isPrimary && (
                            <p id={`ins-${field.id}-isPrimary-error`} role="alert" className="text-sm text-[var(--destructive)] mt-1">
                              {errors.insuranceCoverages[index].isPrimary.message ?? "Primary insurance selection is invalid"}
                            </p>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>

                {/* Save button for this coverage */}
                <div className="flex justify-end mt-4">
                  <Button
                    type="button"
                    variant="default"
                    size="default"
                    onClick={() => handleSaveCoverage(index, field.id)}
                    disabled={savingStates[field.id]}
                    aria-busy={savingStates[field.id]}
                    aria-label={`Save insurance record ${index + 1}`}
                    className="min-w-[120px] min-h-[44px]"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {savingStates[field.id] ? 'Saving...' : 'Save Coverage'}
                  </Button>
                </div>

                {/* Separator between records */}
                {index < fields.length - 1 && (
                  <div className="border-t border-[var(--border)] mt-6" />
                )}
              </div>
            ))}

            {/* Add insurance record button - only show if records exist */}
            {fields.length > 0 && (
              <Button
                variant="ghost"
                onClick={addRecord}
                className="w-full bg-[var(--muted)] hover:bg-[var(--muted)]/80 min-h-[44px]"
                aria-label="Add another insurance record"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Insurance Record
              </Button>
            )}
          </div>
        </CardBody>
      )}
    </Card>
  )
}