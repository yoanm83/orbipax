'use client'

import { Wallet, ChevronUp, ChevronDown } from "lucide-react"
import { useMemo } from "react"

import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { DatePicker } from "@/shared/ui/primitives/DatePicker"
import { Input } from "@/shared/ui/primitives/Input"
import { Label } from "@/shared/ui/primitives/label"

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
  // Generate unique section ID for this instance
  const sectionUid = useMemo(() => `gov_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, [])
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
            {/* Field 1: Medicaid ID */}
            <div>
              <Label htmlFor="gov-medicaid-id">Medicaid ID</Label>
              <Input
                id="gov-medicaid-id"
                placeholder="Enter Medicaid ID"
                className="mt-1"
                aria-label="Medicaid ID"
              />
            </div>

            {/* Field 2: Medicaid Effective Date */}
            <div>
              <Label htmlFor="gov-medicaid-effective-date">Medicaid Effective Date</Label>
              <DatePicker
                id="gov-medicaid-effective-date"
                placeholder="Select date"
                className="mt-1"
              />
            </div>

            {/* Field 3: Medicare ID */}
            <div>
              <Label htmlFor="gov-medicare-id">Medicare ID</Label>
              <Input
                id="gov-medicare-id"
                placeholder="Enter Medicare ID"
                className="mt-1"
                aria-label="Medicare ID"
              />
            </div>

            {/* Field 4: Social Security Number */}
            <div>
              <Label htmlFor="gov-ssn">Social Security Number</Label>
              <Input
                id="gov-ssn"
                type="password"
                placeholder="XXX-XX-XXXX"
                className="mt-1"
                aria-label="Social Security Number"
                aria-describedby="gov-ssn-hint"
              />
              <span id="gov-ssn-hint" className="text-xs text-[var(--muted-foreground)] mt-1 block">
                Format: XXX-XX-XXXX (last 4 digits visible)
              </span>
            </div>
          </div>
        </CardBody>
      )}
    </Card>
  )
}