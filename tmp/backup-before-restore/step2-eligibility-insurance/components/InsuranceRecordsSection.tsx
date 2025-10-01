'use client'

import { Shield, ChevronUp, ChevronDown, Plus, Trash2 } from "lucide-react"
import { useMemo } from "react"
import { UseFormReturn, useFieldArray, Controller } from "react-hook-form"

import { Button } from "@/shared/ui/primitives/Button"
import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { DatePicker } from "@/shared/ui/primitives/DatePicker"
import { Input } from "@/shared/ui/primitives/Input"
import { Label } from "@/shared/ui/primitives/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shared/ui/primitives/Select"

interface InsuranceRecordsSectionProps {
  onSectionToggle: () => void
  isExpanded: boolean
  form: UseFormReturn<any> // Will be typed from parent
}

/**
 * Insurance Records Section
 * Handles multiple insurance records with add/remove functionality
 * SoC: UI layer only - no business logic or API calls
 */
export function InsuranceRecordsSection({ onSectionToggle, isExpanded, form }: InsuranceRecordsSectionProps) {
  // Generate unique section ID for this instance
  const sectionUid = useMemo(() => `ins_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, [])

  // Use RHF field array for dynamic list management
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "insuranceRecords"
  })

  function addRecord() {
    append({
      carrier: '',
      memberId: '',
      groupNumber: '',
      effectiveDate: new Date(),
      planType: '',
      planName: '',
      subscriberName: '',
      subscriberRelationship: ''
    })
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
            {fields.length > 0 && (
              <span className="ml-2 text-sm text-[var(--muted-foreground)]">
                ({fields.length} record{fields.length !== 1 ? 's' : ''})
              </span>
            )}
          </h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardBody id={`ins-${sectionUid}-panel`} aria-labelledby={`ins-${sectionUid}-header`} className="p-6 space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="p-4 border border-[var(--border)] rounded-lg space-y-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-medium text-[var(--foreground)]">
                  Insurance Record #{index + 1}
                </h3>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    variant="ghost"
                    size="sm"
                    aria-label={`Remove insurance record ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Carrier */}
                <div>
                  <Label htmlFor={`ins-carrier-${field.id}`}>Insurance Carrier</Label>
                  <Controller
                    name={`insuranceRecords.${index}.carrier`}
                    control={form.control}
                    render={({ field: selectField }) => (
                      <Select value={selectField.value} onValueChange={selectField.onChange}>
                        <SelectTrigger id={`ins-carrier-${field.id}`}>
                          <SelectValue placeholder="Select carrier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AETNA">Aetna</SelectItem>
                          <SelectItem value="BCBS">Blue Cross Blue Shield</SelectItem>
                          <SelectItem value="CIGNA">Cigna</SelectItem>
                          <SelectItem value="HUMANA">Humana</SelectItem>
                          <SelectItem value="UNITED">United Healthcare</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Member ID */}
                <div>
                  <Label htmlFor={`ins-member-${field.id}`}>Member ID</Label>
                  <Input
                    id={`ins-member-${field.id}`}
                    {...form.register(`insuranceRecords.${index}.memberId`)}
                    placeholder="Enter member ID"
                    className="mt-1"
                  />
                </div>

                {/* Group Number */}
                <div>
                  <Label htmlFor={`ins-group-${field.id}`}>Group Number</Label>
                  <Input
                    id={`ins-group-${field.id}`}
                    {...form.register(`insuranceRecords.${index}.groupNumber`)}
                    placeholder="Enter group number"
                    className="mt-1"
                  />
                </div>

                {/* Effective Date */}
                <div>
                  <Label htmlFor={`ins-effective-${field.id}`}>Effective Date</Label>
                  <Controller
                    name={`insuranceRecords.${index}.effectiveDate`}
                    control={form.control}
                    render={({ field: dateField }) => (
                      <DatePicker
                        id={`ins-effective-${field.id}`}
                        value={dateField.value}
                        onChange={dateField.onChange}
                        placeholder="Select date"
                        className="mt-1"
                      />
                    )}
                  />
                </div>

                {/* Plan Type */}
                <div>
                  <Label htmlFor={`ins-plan-type-${field.id}`}>Plan Type</Label>
                  <Controller
                    name={`insuranceRecords.${index}.planType`}
                    control={form.control}
                    render={({ field: selectField }) => (
                      <Select value={selectField.value} onValueChange={selectField.onChange}>
                        <SelectTrigger id={`ins-plan-type-${field.id}`}>
                          <SelectValue placeholder="Select plan type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="HMO">HMO</SelectItem>
                          <SelectItem value="PPO">PPO</SelectItem>
                          <SelectItem value="EPO">EPO</SelectItem>
                          <SelectItem value="POS">POS</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                {/* Plan Name */}
                <div>
                  <Label htmlFor={`ins-plan-name-${field.id}`}>Plan Name</Label>
                  <Input
                    id={`ins-plan-name-${field.id}`}
                    {...form.register(`insuranceRecords.${index}.planName`)}
                    placeholder="Enter plan name"
                    className="mt-1"
                  />
                </div>

                {/* Subscriber Name */}
                <div>
                  <Label htmlFor={`ins-subscriber-${field.id}`}>Subscriber Name</Label>
                  <Input
                    id={`ins-subscriber-${field.id}`}
                    {...form.register(`insuranceRecords.${index}.subscriberName`)}
                    placeholder="Enter subscriber name"
                    className="mt-1"
                  />
                </div>

                {/* Subscriber Relationship */}
                <div>
                  <Label htmlFor={`ins-relationship-${field.id}`}>Relationship to Patient</Label>
                  <Controller
                    name={`insuranceRecords.${index}.subscriberRelationship`}
                    control={form.control}
                    render={({ field: selectField }) => (
                      <Select value={selectField.value} onValueChange={selectField.onChange}>
                        <SelectTrigger id={`ins-relationship-${field.id}`}>
                          <SelectValue placeholder="Select relationship" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SELF">Self</SelectItem>
                          <SelectItem value="SPOUSE">Spouse</SelectItem>
                          <SelectItem value="CHILD">Child</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add Record Button */}
          <Button
            type="button"
            onClick={addRecord}
            variant="outline"
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Insurance Record
          </Button>

          {/* Show message if no records */}
          {fields.length === 0 && (
            <div className="text-center py-8 text-[var(--muted-foreground)]">
              No insurance records added. Click "Add Insurance Record" to begin.
            </div>
          )}
        </CardBody>
      )}
    </Card>
  )
}