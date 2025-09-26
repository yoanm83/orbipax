'use client'

import { Shield, ChevronUp, ChevronDown, Plus, Trash2 } from "lucide-react"
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

interface InsuranceRecord {
  uid: string
  index: number
}

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
  // Generate unique section ID for this instance
  const sectionUid = useMemo(() => generateUid(), [])

  // Local state for dynamic list management
  const [records, setRecords] = useState<InsuranceRecord[]>([
    { uid: generateUid(), index: 1 }
  ])

  function generateUid() {
    return `ins_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
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
            {/* Dynamic insurance records */}
            {records.map((record, idx) => (
              <div key={record.uid} className="space-y-4">
                {/* Record header with title and remove button */}
                {(records.length > 1 || idx > 0) && (
                  <div className="flex justify-between items-center pb-2">
                    <h3
                      id={`ins-${record.uid}-heading`}
                      className="text-md font-medium text-[var(--foreground)]"
                    >
                      Insurance Record {record.index}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeRecord(record.uid)
                      }}
                      aria-label={`Remove insurance record ${record.index}`}
                      className="text-[var(--destructive)]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Fields grid - same pattern as other sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-labelledby={records.length > 1 ? `ins-${record.uid}-heading` : undefined}>
                  {/* Insurance Carrier (required) */}
                  <div>
                    <Label htmlFor={`ins-${record.uid}-carrier`}>
                      Insurance Carrier<span className="text-[var(--destructive)]">*</span>
                    </Label>
                    <Select>
                      <SelectTrigger
                        id={`ins-${record.uid}-carrier`}
                        className="mt-1"
                        aria-label="Insurance Carrier"
                        aria-required="true"
                      >
                        <SelectValue placeholder="Select carrier" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aetna">Aetna</SelectItem>
                        <SelectItem value="bcbs">Blue Cross Blue Shield</SelectItem>
                        <SelectItem value="cigna">Cigna</SelectItem>
                        <SelectItem value="humana">Humana</SelectItem>
                        <SelectItem value="united">United Healthcare</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Member ID (required) */}
                  <div>
                    <Label htmlFor={`ins-${record.uid}-memberId`}>
                      Member ID<span className="text-[var(--destructive)]">*</span>
                    </Label>
                    <Input
                      id={`ins-${record.uid}-memberId`}
                      placeholder="Enter member ID"
                      className="mt-1"
                      aria-label="Member ID"
                      aria-required="true"
                    />
                  </div>

                  {/* Group Number */}
                  <div>
                    <Label htmlFor={`ins-${record.uid}-groupNumber`}>
                      Group Number
                    </Label>
                    <Input
                      id={`ins-${record.uid}-groupNumber`}
                      placeholder="Enter group number"
                      className="mt-1"
                      aria-label="Group Number"
                    />
                  </div>

                  {/* Effective Date (required) */}
                  <div>
                    <Label htmlFor={`ins-${record.uid}-effectiveDate`}>
                      Effective Date<span className="text-[var(--destructive)]">*</span>
                    </Label>
                    <DatePicker
                      id={`ins-${record.uid}-effectiveDate`}
                      placeholder="Select date"
                      className="mt-1"
                      aria-label="Effective Date"
                      aria-required={true}
                    />
                  </div>

                  {/* Expiration Date */}
                  <div>
                    <Label htmlFor={`ins-${record.uid}-expirationDate`}>
                      Expiration Date
                    </Label>
                    <DatePicker
                      id={`ins-${record.uid}-expirationDate`}
                      placeholder="Select date"
                      className="mt-1"
                      aria-label="Expiration Date"
                    />
                  </div>

                  {/* Plan Type */}
                  <div>
                    <Label htmlFor={`ins-${record.uid}-planType`}>
                      Plan Type
                    </Label>
                    <Select>
                      <SelectTrigger
                        id={`ins-${record.uid}-planType`}
                        className="mt-1"
                        aria-label="Plan Type"
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
                  </div>

                  {/* Plan Name */}
                  <div>
                    <Label htmlFor={`ins-${record.uid}-planName`}>
                      Plan Name
                    </Label>
                    <Input
                      id={`ins-${record.uid}-planName`}
                      placeholder="Enter plan name"
                      className="mt-1"
                      aria-label="Plan Name"
                    />
                  </div>

                  {/* Subscriber Name */}
                  <div>
                    <Label htmlFor={`ins-${record.uid}-subscriberName`}>
                      Subscriber Name
                    </Label>
                    <Input
                      id={`ins-${record.uid}-subscriberName`}
                      placeholder="Enter subscriber name"
                      className="mt-1"
                      aria-label="Subscriber Name"
                    />
                  </div>

                  {/* Relationship to Subscriber */}
                  <div>
                    <Label htmlFor={`ins-${record.uid}-relationship`}>
                      Relationship to Subscriber
                    </Label>
                    <Select>
                      <SelectTrigger
                        id={`ins-${record.uid}-relationship`}
                        className="mt-1"
                        aria-label="Relationship to Subscriber"
                      >
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="self">Self</SelectItem>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Separator between records */}
                {idx < records.length - 1 && (
                  <div className="border-t border-[var(--border)] mt-6" />
                )}
              </div>
            ))}

            {/* Add insurance record button */}
            <Button
              variant="ghost"
              onClick={addRecord}
              className="w-full bg-[var(--muted)] hover:bg-[var(--muted)]/80"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Insurance Record
            </Button>
          </div>
        </CardBody>
      )}
    </Card>
  )
}