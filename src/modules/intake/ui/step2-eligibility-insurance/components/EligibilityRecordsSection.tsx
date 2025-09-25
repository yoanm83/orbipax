'use client'

import { FileCheck, ChevronUp, ChevronDown } from "lucide-react"

import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { DatePicker } from "@/shared/ui/primitives/DatePicker"
import { Label } from "@/shared/ui/primitives/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shared/ui/primitives/Select"

interface EligibilityRecordsSectionProps {
  onSectionToggle: () => void
  isExpanded: boolean
}

/**
 * Eligibility Records Section
 * Handles eligibility date and program type selection
 * SoC: UI layer only - no business logic or API calls
 */
export function EligibilityRecordsSection({ onSectionToggle, isExpanded }: EligibilityRecordsSectionProps) {
  return (
    <Card className="w-full rounded-3xl shadow-md mb-6">
      <div
        id="header-eligibility"
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
        aria-controls="panel-eligibility"
      >
        <div className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">
            Eligibility Records
          </h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardBody id="panel-eligibility" aria-labelledby="header-eligibility" className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field 1: Eligibility Date */}
            <div>
              <Label htmlFor="eligibility-date">Eligibility Date</Label>
              <DatePicker
                id="eligibility-date"
                placeholder="Select date"
                className="mt-1"
                aria-label="Eligibility Date"
              />
            </div>

            {/* Field 2: Program Type */}
            <div>
              <Label htmlFor="eligibility-program-type">Program Type</Label>
              <Select>
                <SelectTrigger
                  id="eligibility-program-type"
                  className="mt-1"
                  aria-label="Program Type"
                >
                  <SelectValue placeholder="Select program type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medicaid">Medicaid</SelectItem>
                  <SelectItem value="medicare">Medicare</SelectItem>
                  <SelectItem value="private">Private Insurance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardBody>
      )}
    </Card>
  )
}