'use client'

import { Activity, ChevronUp, ChevronDown } from "lucide-react"
import { useState, useMemo } from "react"

import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { Label } from "@/shared/ui/primitives/label"
import { MultiSelect, type Option } from "@/shared/ui/primitives/MultiSelect"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shared/ui/primitives/Select"
import { Switch } from "@/shared/ui/primitives/Switch"
import { Textarea } from "@/shared/ui/primitives/Textarea"

interface FunctionalAssessmentSectionProps {
  onSectionToggle: () => void
  isExpanded: boolean
}

// Domain options for multiselect - WHODAS 2.0 aligned (excluding Cognition)
const AFFECTED_DOMAINS: Option[] = [
  { value: 'mobility', label: 'Mobility (moving & getting around)' },
  { value: 'self-care', label: 'Self-care (hygiene, dressing, eating)' },
  { value: 'getting-along', label: 'Getting along (interpersonal interactions)' },
  { value: 'life-activities', label: 'Life activities (domestic, work & school)' },
  { value: 'participation', label: 'Participation (community & social activities)' }
]

// Options for select fields
const INDEPENDENCE_OPTIONS = ['Yes', 'No', 'Partial', 'Unknown']
const COGNITIVE_OPTIONS = [
  'Intact',
  'Mild Impairment',
  'Moderate Impairment',
  'Severe Impairment',
  'Unknown'
]

/**
 * Functional Assessment Section
 * Handles functional assessment data with checkbox group and conditional validation
 * SoC: UI layer only - no business logic or API calls
 */
export function FunctionalAssessmentSection({
  onSectionToggle,
  isExpanded
}: FunctionalAssessmentSectionProps) {
  // Generate unique section ID for this instance
  const sectionUid = useMemo(() => `fa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, [])

  // Local state for functional assessment
  const [affectedDomains, setAffectedDomains] = useState<string[]>([])
  const [adlsIndependence, setAdlsIndependence] = useState<string>("")
  const [iadlsIndependence, setIadlsIndependence] = useState<string>("")
  const [cognitiveFunctioning, setCognitiveFunctioning] = useState<string>("")
  const [hasSafetyConcerns, setHasSafetyConcerns] = useState(false)
  const [additionalNotes, setAdditionalNotes] = useState("")

  // Error states
  const [showDomainsError, setShowDomainsError] = useState(false)
  const [showAdlsError, setShowAdlsError] = useState(false)
  const [showIadlsError, setShowIadlsError] = useState(false)
  const [showCognitiveError, setShowCognitiveError] = useState(false)

  // Handle domain selection changes
  const handleDomainsChange = (selected: string[]) => {
    setAffectedDomains(selected)
    // Clear error if at least one domain is selected
    if (selected.length > 0) {
      setShowDomainsError(false)
    }
  }

  // Validate required fields
  const validateFields = () => {
    let hasErrors = false

    // Check affected domains (at least 1 required)
    if (affectedDomains.length === 0) {
      setShowDomainsError(true)
      hasErrors = true
    }

    // Check ADLs independence
    if (!adlsIndependence) {
      setShowAdlsError(true)
      hasErrors = true
    }

    // Check IADLs independence
    if (!iadlsIndependence) {
      setShowIadlsError(true)
      hasErrors = true
    }

    // Check cognitive functioning
    if (!cognitiveFunctioning) {
      setShowCognitiveError(true)
      hasErrors = true
    }

    return !hasErrors
  }

  return (
    <Card className="w-full rounded-3xl shadow-md mb-6">
      <div
        id={`${sectionUid}-header`}
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
        aria-controls={`${sectionUid}-panel`}
      >
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">
            Functional Assessment
          </h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardBody id={`${sectionUid}-panel`} aria-labelledby={`${sectionUid}-header`} className="p-6">
          <div className="space-y-6">
            {/* Affected Domains - MultiSelect */}
            <div className="space-y-2">
              <Label htmlFor="fa-domains" className="text-base">
                Affected Domains<span className="text-[var(--destructive)]">*</span>
              </Label>
              <MultiSelect
                id="fa-domains"
                options={AFFECTED_DOMAINS}
                selected={affectedDomains}
                onChange={handleDomainsChange}
                placeholder="Select affected domains..."
                aria-required="true"
                aria-invalid={showDomainsError ? "true" : undefined}
                aria-describedby={showDomainsError ? "fa-domains-error" : undefined}
                aria-label="Affected Domains"
              />
              {showDomainsError && (
                <p id="fa-domains-error" className="text-sm text-[var(--destructive)]">
                  Please select at least one affected domain
                </p>
              )}
            </div>

            {/* Independence in ADLs, IADLs and Cognitive Functioning */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ADLs Independence */}
              <div className="space-y-2">
                <Label htmlFor="fa-adls">
                  Is client independent in ADLs?<span className="text-[var(--destructive)]">*</span>
                </Label>
                <Select
                  value={adlsIndependence}
                  onValueChange={(value) => {
                    setAdlsIndependence(value)
                    if (value) setShowAdlsError(false)
                  }}
                >
                  <SelectTrigger
                    id="fa-adls"
                    className="w-full"
                    aria-label="Independence in ADLs"
                    aria-required="true"
                    aria-invalid={showAdlsError ? "true" : undefined}
                    aria-describedby={showAdlsError ? "fa-adls-error" : undefined}
                  >
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {INDEPENDENCE_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {showAdlsError && (
                  <p id="fa-adls-error" className="text-sm text-[var(--destructive)]">
                    This field is required
                  </p>
                )}
              </div>

              {/* IADLs Independence */}
              <div className="space-y-2">
                <Label htmlFor="fa-iadls">
                  Is client independent in IADLs?<span className="text-[var(--destructive)]">*</span>
                </Label>
                <Select
                  value={iadlsIndependence}
                  onValueChange={(value) => {
                    setIadlsIndependence(value)
                    if (value) setShowIadlsError(false)
                  }}
                >
                  <SelectTrigger
                    id="fa-iadls"
                    className="w-full"
                    aria-label="Independence in IADLs"
                    aria-required="true"
                    aria-invalid={showIadlsError ? "true" : undefined}
                    aria-describedby={showIadlsError ? "fa-iadls-error" : undefined}
                  >
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {INDEPENDENCE_OPTIONS.map(option => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {showIadlsError && (
                  <p id="fa-iadls-error" className="text-sm text-[var(--destructive)]">
                    This field is required
                  </p>
                )}
              </div>

              {/* Cognitive Functioning */}
              <div className="space-y-2">
              <Label htmlFor="fa-cog">
                Cognitive Functioning<span className="text-[var(--destructive)]">*</span>
              </Label>
              <Select
                value={cognitiveFunctioning}
                onValueChange={(value) => {
                  setCognitiveFunctioning(value)
                  if (value) setShowCognitiveError(false)
                }}
              >
                <SelectTrigger
                  id="fa-cog"
                  className="w-full"
                  aria-label="Cognitive Functioning"
                  aria-required="true"
                  aria-invalid={showCognitiveError ? "true" : undefined}
                  aria-describedby={showCognitiveError ? "fa-cog-error" : undefined}
                >
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {COGNITIVE_OPTIONS.map(option => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {showCognitiveError && (
                <p id="fa-cog-error" className="text-sm text-[var(--destructive)]">
                  This field is required
                </p>
              )}
              </div>
            </div>

            {/* Separator */}
            <div className="border-t border-[var(--border)]" />

            {/* Safety Concerns Toggle */}
            <div className="flex items-center justify-between">
              <Label htmlFor="fa-safety" className="text-base">
                Safety Concerns?
              </Label>
              <Switch
                id="fa-safety"
                checked={hasSafetyConcerns}
                onCheckedChange={setHasSafetyConcerns}
                aria-label="Safety Concerns"
              />
            </div>

            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="fa-notes">
                Additional Notes
              </Label>
              <Textarea
                id="fa-notes"
                placeholder="Enter any additional notes about the client's functional assessment..."
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                className="min-h-[120px] w-full"
                rows={5}
                aria-label="Additional Notes"
              />
            </div>
          </div>
        </CardBody>
      )}
    </Card>
  )
}