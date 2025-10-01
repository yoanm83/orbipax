'use client'

import { FileText, ChevronUp, ChevronDown, Plus, Trash2 } from "lucide-react"
import { useState, useMemo } from "react"

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
import { Textarea } from "@/shared/ui/primitives/Textarea"

interface AuthorizationRecord {
  uid: string
  index: number
}

interface AuthorizationsSectionProps {
  onSectionToggle: () => void
  isExpanded: boolean
}

/**
 * Authorizations Section
 * Handles multiple authorization records with add/remove functionality
 * SoC: UI layer only - no business logic or API calls
 */
export function AuthorizationsSection({ onSectionToggle, isExpanded }: AuthorizationsSectionProps) {
  // Generate unique section ID for this instance
  const sectionUid = useMemo(() => generateUid(), [])

  // Local state for dynamic list management
  const [records, setRecords] = useState<AuthorizationRecord[]>([
    { uid: generateUid(), index: 1 }
  ])

  function generateUid() {
    return `auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  function addRecord() {
    setRecords(prev => [
      ...prev,
      { uid: generateUid(), index: prev.length + 1 }
    ])
  }

  function removeRecord(uid: string) {
    setRecords(prev => {
      const filtered = prev.filter(r => r.uid !== uid)
      // Reindex records after removal
      return filtered.map((record, idx) => ({
        ...record,
        index: idx + 1
      }))
    })
  }

  return (
    <Card className="w-full rounded-3xl shadow-md mb-6">
      <div
        id={`auth-${sectionUid}-header`}
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
        aria-controls={`auth-${sectionUid}-panel`}
      >
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">
            Authorizations
          </h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardBody id={`auth-${sectionUid}-panel`} aria-labelledby={`auth-${sectionUid}-header`} className="p-6">
          <div className="space-y-6">
            {/* Dynamic authorization records */}
            {records.map((record, idx) => (
              <div key={record.uid} className="space-y-4">
                {/* Record header with title and remove button */}
                {(records.length > 1 || idx > 0) && (
                  <div className="flex justify-between items-center pb-2">
                    <h3
                      id={`auth-${record.uid}-heading`}
                      className="text-md font-medium text-[var(--foreground)]"
                    >
                      Authorization Record {record.index}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeRecord(record.uid)
                      }}
                      aria-label={`Remove authorization record ${record.index}`}
                      className="text-[var(--destructive)]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Fields grid - same pattern as other sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-labelledby={records.length > 1 ? `auth-${record.uid}-heading` : undefined}>
                  {/* Authorization Type (required) */}
                  <div>
                    <Label htmlFor={`auth-${record.uid}-type`}>
                      Authorization Type<span className="text-[var(--destructive)]">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger
                        id={`auth-${record.uid}-type`}
                        className="mt-1"
                        aria-label="Authorization Type"
                        aria-required="true"
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="prior">Prior Authorization</SelectItem>
                        <SelectItem value="concurrent">Concurrent Review</SelectItem>
                        <SelectItem value="referral">Referral</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Authorization Number (required) */}
                  <div>
                    <Label htmlFor={`auth-${record.uid}-number`}>
                      Authorization Number<span className="text-[var(--destructive)]">*</span>
                    </Label>
                    <Input
                      id={`auth-${record.uid}-number`}
                      placeholder="Enter authorization number"
                      className="mt-1"
                      aria-label="Authorization Number"
                      aria-required="true"
                    />
                  </div>

                  {/* Start Date (required) */}
                  <div>
                    <Label htmlFor={`auth-${record.uid}-startDate`}>
                      Start Date<span className="text-[var(--destructive)]">*</span>
                    </Label>
                    <DatePicker
                      id={`auth-${record.uid}-startDate`}
                      placeholder="Select date"
                      className="mt-1"
                      aria-label="Start Date"
                      aria-required={true}
                    />
                  </div>

                  {/* End Date */}
                  <div>
                    <Label htmlFor={`auth-${record.uid}-endDate`}>
                      End Date
                    </Label>
                    <DatePicker
                      id={`auth-${record.uid}-endDate`}
                      placeholder="Select date"
                      className="mt-1"
                      aria-label="End Date"
                    />
                  </div>

                  {/* Units */}
                  <div>
                    <Label htmlFor={`auth-${record.uid}-units`}>
                      Units
                    </Label>
                    <Input
                      id={`auth-${record.uid}-units`}
                      type="number"
                      inputMode="numeric"
                      placeholder="Enter number of units"
                      className="mt-1"
                      aria-label="Units"
                    />
                  </div>

                  {/* Notes - spans full width */}
                  <div className="md:col-span-2">
                    <Label htmlFor={`auth-${record.uid}-notes`}>
                      Notes
                    </Label>
                    <Textarea
                      id={`auth-${record.uid}-notes`}
                      placeholder="Enter any additional notes"
                      className="mt-1 min-h-[100px]"
                      rows={4}
                      aria-label="Notes"
                    />
                  </div>
                </div>

                {/* Separator between records */}
                {idx < records.length - 1 && (
                  <div className="border-t border-[var(--border)] mt-6" />
                )}
              </div>
            ))}

            {/* Add authorization record button */}
            <Button
              variant="ghost"
              onClick={addRecord}
              className="w-full bg-[var(--muted)] hover:bg-[var(--muted)]/80"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Authorization Record
            </Button>
          </div>
        </CardBody>
      )}
    </Card>
  )
}