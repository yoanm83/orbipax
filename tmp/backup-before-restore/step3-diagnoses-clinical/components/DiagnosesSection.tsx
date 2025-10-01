'use client'

import { ClipboardList, ChevronUp, ChevronDown, Plus, Trash2, Lightbulb, AlertCircle } from "lucide-react"
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
import { Switch } from "@/shared/ui/primitives/Switch"
import { Textarea } from "@/shared/ui/primitives/Textarea"

import { generateDiagnosisSuggestions, type DiagnosisSuggestion } from "@/modules/intake/actions/diagnoses.actions"
import { DIAGNOSIS_TYPE_OPTIONS, DIAGNOSIS_SEVERITY_OPTIONS } from "@/modules/intake/application/step3/diagnoses.enums"

interface DiagnosisRecord {
  uid: string
  index: number
  code: string
  description: string
  diagnosisType: string
  onsetDate: string
  diagnosisDate: string
  severity: string
  verifiedBy: string
  isBillable: boolean
  notes: string
}

interface UISuggestion extends DiagnosisSuggestion {
  uid: string
}

interface DiagnosesSectionProps {
  onSectionToggle: () => void
  isExpanded: boolean
}

/**
 * Diagnoses (DSM-5) Section
 * Handles diagnosis records with AI-assisted suggestions (UI-only mock)
 * SoC: UI layer only - no business logic or API calls
 */
export function DiagnosesSection({ onSectionToggle, isExpanded }: DiagnosesSectionProps) {
  // Generate unique section ID for this instance
  const sectionUid = useMemo(() => generateUid(), [])

  // Local state for UI-only functionality
  const [symptomSummary, setSymptomSummary] = useState("")
  const [suggestions, setSuggestions] = useState<UISuggestion[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [records, setRecords] = useState<DiagnosisRecord[]>([])

  function generateUid() {
    return `dx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Generate AI suggestions using OpenAI (server-side)
  async function handleGenerateSuggestions() {
    if (!symptomSummary.trim() || symptomSummary.length < 10) {
      setError("Please provide at least 10 characters describing the symptoms")
      return
    }

    setIsGenerating(true)
    setError(null)
    setSuggestions([])

    try {
      // Call server action (runs on server, uses OpenAI)
      const result = await generateDiagnosisSuggestions({
        presentingProblem: symptomSummary
      })

      if (result.ok) {
        // Add UIDs to suggestions for React keys
        const suggestionsWithIds: UISuggestion[] = result.suggestions.map(s => ({
          ...s,
          uid: generateUid(),
          note: s.note ?? ""
        }))
        setSuggestions(suggestionsWithIds)
      } else {
        setError(result.error ?? "Unable to generate suggestions. Please try again.")
      }
    } catch {
      setError("Connection error. Please check your internet and try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  // Add suggested diagnosis to records
  function addSuggestedDiagnosis(suggestion: UISuggestion) {
    const newRecord: DiagnosisRecord = {
      uid: generateUid(),
      index: records.length + 1,
      code: suggestion.code,
      description: suggestion.description,
      diagnosisType: suggestion.type ?? "",  // Use type from suggestion
      onsetDate: "",
      diagnosisDate: "",
      severity: suggestion.severity ?? "",    // Use severity from suggestion
      verifiedBy: "",
      isBillable: false,
      notes: suggestion.note ?? ""
    }

    setRecords(prev => [...prev, newRecord])
  }

  // Add empty diagnosis record
  function addRecord() {
    setRecords(prev => [
      ...prev,
      {
        uid: generateUid(),
        index: prev.length + 1,
        code: "",
        description: "",
        diagnosisType: "",
        onsetDate: "",
        diagnosisDate: "",
        severity: "",
        verifiedBy: "",
        isBillable: false,
        notes: ""
      }
    ])
  }

  // Remove diagnosis record
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

  // Validate ICD-10/DSM-5 code format
  function isValidDiagnosisCode(code: string): boolean {
    if (!code) return true // Empty is handled by required validation

    // ICD-10 pattern: Letter (except U) + 2 digits + optional (. + up to 4 alphanumeric)
    // DSM-5 pattern: F + 2 digits + optional (. + 1-2 digits)
    // Examples: F32.9, F90.0, F43.10, G47.33, M79.3
    const icd10Pattern = /^[A-TV-Z]\d{2}(?:\.\d{1,4})?$/
    const dsmPattern = /^F\d{2}(?:\.\d{1,2})?$/

    const normalizedCode = code.trim().toUpperCase()
    return icd10Pattern.test(normalizedCode) || dsmPattern.test(normalizedCode)
  }

  // Update record field
  function updateRecordField(uid: string, field: keyof DiagnosisRecord, value: string | boolean) {
    // Special handling for diagnosis code - normalize input
    if (field === 'code' && typeof value === 'string') {
      value = value.trim().toUpperCase()
    }

    setRecords(prev =>
      prev.map(record =>
        record.uid === uid ? { ...record, [field]: value } : record
      )
    )
  }

  return (
    <Card className="w-full rounded-3xl shadow-md mb-6">
      <div
        id={`dx-${sectionUid}-header`}
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
        aria-controls={`dx-${sectionUid}-panel`}
      >
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">
            Diagnoses (DSM-5)
          </h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardBody id={`dx-${sectionUid}-panel`} aria-labelledby={`dx-${sectionUid}-header`} className="p-6">
          <div className="space-y-6">

            {/* AI-Assisted Suggestions Block */}
            <h3 className="text-md font-medium text-[var(--foreground)]">
              AI-Assisted Diagnosis Suggestions
            </h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor={`dx-${sectionUid}-symptom-summary`}>
                  Presenting Problem or Symptom Summary
                </Label>
                <Textarea
                  id={`dx-${sectionUid}-symptom-summary`}
                  placeholder="Describe the client's symptoms, behaviors, and presenting problems..."
                  value={symptomSummary}
                  onChange={(e) => setSymptomSummary(e.target.value)}
                  className="mt-1 min-h-[100px]"
                  aria-label="Symptom Summary"
                />
              </div>

              <Button
                onClick={handleGenerateSuggestions}
                disabled={isGenerating || !symptomSummary.trim() || symptomSummary.length < 10}
                className="flex items-center gap-2 text-white"
              >
                <Lightbulb className="h-4 w-4 text-white" />
                {isGenerating ? "Generating Suggestions..." : "Generate Diagnosis Suggestions"}
              </Button>

              {/* Error message */}
              {error && (
                <div role="alert" className="flex items-start gap-2 p-3 rounded-lg bg-[var(--destructive)]/10 border border-[var(--destructive)]/20">
                  <AlertCircle className="h-5 w-5 text-[var(--destructive)] mt-0.5" />
                  <p className="text-sm text-[var(--foreground)]">{error}</p>
                </div>
              )}

              {/* Suggestions List */}
              {suggestions.length > 0 && (
                <div className="space-y-3 mt-4">
                  <h4 className="text-sm font-medium text-[var(--muted-foreground)]">
                    Suggested Diagnoses:
                  </h4>
                  {suggestions.map((suggestion) => (
                    <div
                      key={suggestion.uid}
                      className="bg-[var(--muted)]/30 p-3 rounded-lg border border-[var(--border)] shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium text-[var(--foreground)]">
                            {suggestion.code} — {suggestion.description}
                          </div>
                          <div className="text-sm text-[var(--muted-foreground)] mt-1">
                            Confidence: {suggestion.confidence}%
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => addSuggestedDiagnosis(suggestion)}
                          className="flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" />
                          Add to Diagnoses
                        </Button>
                      </div>
                      {suggestion.note && (
                        <p className="text-sm text-[var(--muted-foreground)]">
                          {suggestion.note}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="border-t border-[var(--border)]" />

            {/* Diagnosis Records */}
            <div className="space-y-6">
              <h3 className="text-md font-medium text-[var(--foreground)]">
                Diagnosis Records
              </h3>

              {records.map((record, idx) => (
                <div key={record.uid} className="space-y-4">
                  {/* Record header with title and remove button */}
                  <div className="flex justify-between items-center pb-2">
                    <h4
                      id={`dx-${record.uid}-heading`}
                      className="text-md font-medium text-[var(--foreground)]"
                    >
                      Diagnosis {record.index}
                    </h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRecord(record.uid)}
                      aria-label={`Remove diagnosis ${record.index}`}
                      className="text-[var(--destructive)]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Fields grid */}
                  <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    aria-labelledby={`dx-${record.uid}-heading`}
                  >
                    {/* Diagnosis Code (required) */}
                    <div>
                      <Label htmlFor={`dx-${record.uid}-code`}>
                        Diagnosis Code<span className="text-[var(--destructive)]">*</span>
                      </Label>
                      <Input
                        id={`dx-${record.uid}-code`}
                        type="text"
                        placeholder="e.g., F32.9"
                        value={record.code}
                        onChange={(e) => updateRecordField(record.uid, "code", e.target.value)}
                        className="mt-1"
                        aria-label="Diagnosis Code"
                        aria-required="true"
                        aria-invalid={(!record.code || (record.code && !isValidDiagnosisCode(record.code))) ? "true" : undefined}
                        aria-describedby={
                          !record.code ? `dx-${record.uid}-code-error` :
                          (record.code && !isValidDiagnosisCode(record.code)) ? `dx-${record.uid}-code-format-error` :
                          undefined
                        }
                      />
                      {!record.code && (
                        <p id={`dx-${record.uid}-code-error`} className="text-sm text-[var(--destructive)] mt-1">
                          Diagnosis code is required
                        </p>
                      )}
                      {record.code && !isValidDiagnosisCode(record.code) && (
                        <p id={`dx-${record.uid}-code-format-error`} className="text-sm text-[var(--destructive)] mt-1">
                          Invalid format. Use ICD-10 (e.g., F32.9, G47.33) or DSM-5 format
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <Label htmlFor={`dx-${record.uid}-description`}>
                        Description
                      </Label>
                      <Input
                        id={`dx-${record.uid}-description`}
                        placeholder="Diagnosis description"
                        value={record.description}
                        onChange={(e) => updateRecordField(record.uid, "description", e.target.value)}
                        className="mt-1"
                        aria-label="Description"
                      />
                    </div>

                    {/* Diagnosis Type (required) */}
                    <div>
                      <Label htmlFor={`dx-${record.uid}-type`}>
                        Diagnosis Type<span className="text-[var(--destructive)]">*</span>
                      </Label>
                      <Select
                        value={record.diagnosisType}
                        onValueChange={(value) => updateRecordField(record.uid, "diagnosisType", value)}
                      >
                        <SelectTrigger
                          id={`dx-${record.uid}-type`}
                          className="mt-1"
                          aria-label="Diagnosis Type"
                          aria-required="true"
                        >
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {DIAGNOSIS_TYPE_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Severity */}
                    <div>
                      <Label htmlFor={`dx-${record.uid}-severity`}>
                        Severity
                      </Label>
                      <Select
                        value={record.severity}
                        onValueChange={(value) => updateRecordField(record.uid, "severity", value)}
                      >
                        <SelectTrigger
                          id={`dx-${record.uid}-severity`}
                          className="mt-1"
                          aria-label="Severity"
                        >
                          <SelectValue placeholder="Select severity" />
                        </SelectTrigger>
                        <SelectContent>
                          {DIAGNOSIS_SEVERITY_OPTIONS.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Onset Date */}
                    <div>
                      <Label htmlFor={`dx-${record.uid}-onset`}>
                        Onset Date
                      </Label>
                      <DatePicker
                        id={`dx-${record.uid}-onset`}
                        placeholder="Select date"
                        className="mt-1"
                        aria-label="Onset Date"
                      />
                    </div>

                    {/* Diagnosis Date */}
                    <div>
                      <Label htmlFor={`dx-${record.uid}-date`}>
                        Diagnosis Date
                      </Label>
                      <DatePicker
                        id={`dx-${record.uid}-date`}
                        placeholder="Select date"
                        className="mt-1"
                        aria-label="Diagnosis Date"
                      />
                    </div>

                    {/* Verified By */}
                    <div>
                      <Label htmlFor={`dx-${record.uid}-verified`}>
                        Verified By
                      </Label>
                      <Input
                        id={`dx-${record.uid}-verified`}
                        placeholder="Name of verifying clinician"
                        value={record.verifiedBy}
                        onChange={(e) => updateRecordField(record.uid, "verifiedBy", e.target.value)}
                        className="mt-1"
                        aria-label="Verified By"
                      />
                    </div>

                    {/* Billable */}
                    <div>
                      <div className="flex items-center justify-between mt-6">
                        <Label htmlFor={`dx-${record.uid}-billable`}>
                          Billable Diagnosis
                        </Label>
                        <Switch
                          id={`dx-${record.uid}-billable`}
                          checked={record.isBillable}
                          onCheckedChange={(checked) => updateRecordField(record.uid, "isBillable", checked)}
                          aria-label="Billable Diagnosis"
                        />
                      </div>
                    </div>

                    {/* Notes - spans full width */}
                    <div className="md:col-span-2">
                      <Label htmlFor={`dx-${record.uid}-notes`}>
                        Notes
                      </Label>
                      <Textarea
                        id={`dx-${record.uid}-notes`}
                        placeholder="Additional notes about the diagnosis"
                        value={record.notes}
                        onChange={(e) => updateRecordField(record.uid, "notes", e.target.value)}
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

              {/* Add diagnosis record button */}
              <Button
                variant="ghost"
                onClick={addRecord}
                className="w-full bg-[var(--muted)] hover:bg-[var(--muted)]/80"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Diagnosis Record
              </Button>
            </div>
          </div>
        </CardBody>
      )}
    </Card>
  )
}