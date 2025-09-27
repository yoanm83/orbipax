'use client'

import { ExternalLink, ChevronUp, ChevronDown } from "lucide-react"
import { useState, useMemo } from "react"

import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { Label } from "@/shared/ui/primitives/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shared/ui/primitives/Select"
import { MultiSelect, type Option } from "@/shared/ui/primitives/MultiSelect"

// Referral type options for multiselect
const REFERRAL_TYPES: Option[] = [
  { value: 'detox', label: 'Detox Services' },
  { value: 'housing', label: 'Housing Services' },
  { value: 'residential', label: 'Residential Treatment' },
  { value: 'medical', label: 'Medical Services' },
  { value: 'other', label: 'Other' }
]

interface ExternalReferralsSectionProps {
  onSectionToggle?: () => void
  isExpanded?: boolean
}

/**
 * External Referrals Section
 * Collects information about external service referrals
 * UI Only - No validation or store connection yet
 */
export function ExternalReferralsSection({
  onSectionToggle,
  isExpanded: externalIsExpanded
}: ExternalReferralsSectionProps) {
  // Generate unique section ID for ARIA
  const sectionUid = useMemo(() => `external_referrals_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, [])

  // Local state for form fields (will be moved to store later)
  const [hasExternalReferrals, setHasExternalReferrals] = useState<string>('')
  const [referralTypes, setReferralTypes] = useState<string[]>([])

  // Use external expanded state if provided, otherwise manage locally
  const [localIsExpanded, setLocalIsExpanded] = useState(true)
  const isExpanded = externalIsExpanded ?? localIsExpanded
  const handleToggle = onSectionToggle ?? (() => setLocalIsExpanded(!localIsExpanded))

  // Handle referral types change
  const handleReferralTypesChange = (selected: string[]) => {
    setReferralTypes(selected)
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
          <ExternalLink className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">
            External Referrals
          </h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardBody id={`${sectionUid}-panel`} aria-labelledby={`${sectionUid}-header`} className="p-6">
          <div className="space-y-6">
            {/* Primary Question */}
            <div className="space-y-2">
              <Label htmlFor={`${sectionUid}-has-referrals`}>
                Has the client been referred to services outside of this agency?
              </Label>
              <Select
                value={hasExternalReferrals}
                onValueChange={setHasExternalReferrals}
              >
                <SelectTrigger
                  id={`${sectionUid}-has-referrals`}
                  className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                  aria-label="External referrals status"
                >
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditional Fields - shown when hasExternalReferrals === 'Yes' */}
            {hasExternalReferrals === 'Yes' && (
              <div className="border-t border-[var(--border)] pt-6 mt-6">
                {/* Referral Types - MultiSelect */}
                <div className="space-y-2">
                  <Label htmlFor={`${sectionUid}-referral-types`} className="text-base">
                    Referral Type (select all that apply)<span className="text-[var(--destructive)]">*</span>
                  </Label>
                  <MultiSelect
                    id={`${sectionUid}-referral-types`}
                    options={REFERRAL_TYPES}
                    selected={referralTypes}
                    onChange={handleReferralTypesChange}
                    placeholder="Select all external services the client has been referred to"
                    aria-required="true"
                    aria-label="Referral Types"
                  />
                </div>
              </div>
            )}

            {/* Helper text for No/Unknown selection */}
            {(hasExternalReferrals === 'No' || hasExternalReferrals === 'Unknown') && (
              <div className="p-4 bg-[var(--muted)] rounded-lg">
                <p className="text-sm text-[var(--muted-foreground)]">
                  {hasExternalReferrals === 'No'
                    ? "No external referrals have been made at this time."
                    : "External referral status is unknown. Additional assessment may be needed."}
                </p>
              </div>
            )}
          </div>
        </CardBody>
      )}
    </Card>
  )
}