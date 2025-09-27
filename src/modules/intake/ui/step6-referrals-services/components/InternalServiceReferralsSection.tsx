'use client'

import { Building2, ChevronUp, ChevronDown } from "lucide-react"
import { useState, useMemo } from "react"

import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { Label } from "@/shared/ui/primitives/label"
import { Textarea } from "@/shared/ui/primitives/Textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shared/ui/primitives/Select"
import { MultiSelect, type Option } from "@/shared/ui/primitives/MultiSelect"

// Service options for multiselect
const SERVICE_OPTIONS: Option[] = [
  { value: 'individual-therapy', label: 'Individual Therapy' },
  { value: 'group-therapy', label: 'Group Therapy' },
  { value: 'medication-management', label: 'Medication Management' },
  { value: 'case-management', label: 'Case Management' },
  { value: 'crisis-services', label: 'Crisis Services' },
  { value: 'peer-support', label: 'Peer Support' },
  { value: 'family-therapy', label: 'Family Therapy' },
  { value: 'skills-training', label: 'Skills Training' },
  { value: 'other', label: 'Other' }
]

// Delivery method options
const DELIVERY_METHODS = [
  { value: 'in-person', label: 'In-Person' },
  { value: 'telehealth', label: 'Telehealth' },
  { value: 'hybrid', label: 'Hybrid (Both)' },
  { value: 'no-preference', label: 'No Preference' }
]

interface InternalServiceReferralsSectionProps {
  onSectionToggle?: () => void
  isExpanded?: boolean
}

/**
 * Internal Service Referrals Section
 * Collects information about internal service referrals and preferences
 * UI Only - No validation or store connection yet
 */
export function InternalServiceReferralsSection({
  onSectionToggle,
  isExpanded: externalIsExpanded
}: InternalServiceReferralsSectionProps) {
  // Generate unique section ID for ARIA
  const sectionUid = useMemo(() => `internal_service_referrals_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, [])

  // Local state for form fields (will be moved to store later)
  const [servicesRequested, setServicesRequested] = useState<string[]>([])
  const [deliveryMethod, setDeliveryMethod] = useState<string>('')
  const [additionalNotes, setAdditionalNotes] = useState('')

  // Use external expanded state if provided, otherwise manage locally
  const [localIsExpanded, setLocalIsExpanded] = useState(false)
  const isExpanded = externalIsExpanded ?? localIsExpanded
  const handleToggle = onSectionToggle ?? (() => setLocalIsExpanded(!localIsExpanded))

  // Handle services requested change
  const handleServicesChange = (selected: string[]) => {
    setServicesRequested(selected)
  }

  return (
    <Card className="w-full rounded-3xl shadow-md mb-6">
      <div
        id={`${sectionUid}-header`}
        className="py-3 px-6 flex justify-between items-center cursor-pointer min-h-[44px]"
        onClick={handleToggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleToggle()
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls={`${sectionUid}-panel`}
      >
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">
            Internal Service Referrals
          </h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardBody id={`${sectionUid}-panel`} aria-labelledby={`${sectionUid}-header`} className="p-6">
          <div className="space-y-6">
            {/* Services Requested - MultiSelect */}
            <div className="space-y-2">
              <Label htmlFor={`${sectionUid}-services`} className="text-base">
                Services Requested<span className="text-[var(--destructive)]">*</span>
              </Label>
              <MultiSelect
                id={`${sectionUid}-services`}
                options={SERVICE_OPTIONS}
                selected={servicesRequested}
                onChange={handleServicesChange}
                placeholder="Select all services requested"
                aria-required="true"
                aria-label="Services Requested"
              />
              <p className="text-sm text-[var(--muted-foreground)]">
                Select all that apply
              </p>
            </div>

            {/* Preferred Service Delivery Method */}
            <div className="space-y-2">
              <Label htmlFor={`${sectionUid}-delivery-method`}>
                Preferred Service Delivery Method<span className="text-[var(--destructive)]">*</span>
              </Label>
              <Select
                value={deliveryMethod}
                onValueChange={setDeliveryMethod}
              >
                <SelectTrigger
                  id={`${sectionUid}-delivery-method`}
                  className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                  aria-label="Service delivery method"
                  aria-required="true"
                >
                  <SelectValue placeholder="Select delivery method" />
                </SelectTrigger>
                <SelectContent>
                  {DELIVERY_METHODS.map(method => (
                    <SelectItem key={method.value} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Additional Notes or Preferences */}
            <div className="space-y-2">
              <Label htmlFor={`${sectionUid}-notes`}>
                Additional Notes or Preferences
              </Label>
              <Textarea
                id={`${sectionUid}-notes`}
                value={additionalNotes}
                onChange={(e) => {
                  const value = e.target.value
                  if (value.length <= 500) {
                    setAdditionalNotes(value)
                  }
                }}
                placeholder="Enter any additional information about service preferences or special considerations"
                rows={4}
                maxLength={500}
                className="w-full resize-none focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
              />
              <p className="text-sm text-[var(--muted-foreground)]">
                {additionalNotes.length}/500 characters
              </p>
            </div>
          </div>
        </CardBody>
      )}
    </Card>
  )
}