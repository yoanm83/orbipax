"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { format } from "date-fns"
import { CalendarIcon, ChevronDown, ChevronUp, ClipboardList, Plus, Trash2, Loader2, Lightbulb } from "lucide-react"
import { cn } from "@/lib/utils"
import { CustomCalendar } from "@/components/ui/custom-calendar"
import { useIntakeFormStore } from "@/lib/store/intake-form-store"

interface DiagnosisRecord {
  id: string
  code: string
  description: string
  onsetDate: Date | undefined
  diagnosisType: string
  severity: string
  verifiedBy: string
  diagnosisDate: Date | undefined
  isBillable: boolean
  notes: string
}

interface DiagnosisSuggestion {
  id: string
  code: string
  description: string
  confidence: number
  rationale: string
}

interface DiagnosesSectionProps {
  isExpanded: boolean
  onSectionToggle: () => void
  lastEditedStep: number
}

export function DiagnosesSection({ isExpanded, onSectionToggle, lastEditedStep }: DiagnosesSectionProps) {
  const { clinicalInfo, setFormData } = useIntakeFormStore()

  // Add new diagnosis record
  const addDiagnosisRecord = () => {
    const updatedRecords = [
      ...clinicalInfo.diagnosisRecords,
      {
        id: Date.now().toString(),
        code: "",
        description: "",
        onsetDate: undefined,
        diagnosisType: "",
        severity: "",
        verifiedBy: "",
        diagnosisDate: undefined,
        isBillable: false,
        notes: "",
      }
    ]

    setFormData('clinicalInfo', {
      ...clinicalInfo,
      diagnosisRecords: updatedRecords
    })
  }

  // Remove diagnosis record
  const removeDiagnosisRecord = (id: string) => {
    const updatedRecords = clinicalInfo.diagnosisRecords.filter((record) => record.id !== id)
    
    setFormData('clinicalInfo', {
      ...clinicalInfo,
      diagnosisRecords: updatedRecords
    })
  }

  // Update diagnosis record field
  const updateDiagnosisField = (id: string, field: keyof typeof clinicalInfo.diagnosisRecords[0], value: any) => {
    const updatedRecords = clinicalInfo.diagnosisRecords.map((record) => {
      if (record.id === id) {
        return { ...record, [field]: value }
      }
      return record
    })

    setFormData('clinicalInfo', {
      ...clinicalInfo,
      diagnosisRecords: updatedRecords
    })
  }

  // Generate AI diagnosis suggestions
  const generateDiagnosisSuggestions = () => {
    if (!clinicalInfo.symptomSummary.trim()) return

    setFormData('clinicalInfo', {
      ...clinicalInfo,
      isGeneratingSuggestions: true
    })

    // Simulate AI processing delay
    setTimeout(() => {
      // This is a mock implementation - in a real app, this would call an AI service
      const suggestions: Array<typeof clinicalInfo.suggestedDiagnoses[0]> = []

      // Simple keyword matching for demonstration purposes
      if (
        clinicalInfo.symptomSummary.toLowerCase().includes("sad") ||
        clinicalInfo.symptomSummary.toLowerCase().includes("depress") ||
        clinicalInfo.symptomSummary.toLowerCase().includes("low mood")
      ) {
        suggestions.push({
          id: "sugg-1",
          code: "F32.9",
          description: "Major Depressive Disorder, Unspecified",
          confidence: 0.85,
          rationale:
            "Patient reports symptoms consistent with depressive disorder including low mood, anhedonia, and changes in sleep patterns.",
        })
      }

      if (
        clinicalInfo.symptomSummary.toLowerCase().includes("worry") ||
        clinicalInfo.symptomSummary.toLowerCase().includes("anxious") ||
        clinicalInfo.symptomSummary.toLowerCase().includes("anxiety")
      ) {
        suggestions.push({
          id: "sugg-2",
          code: "F41.1",
          description: "Generalized Anxiety Disorder",
          confidence: 0.78,
          rationale:
            "Patient reports persistent worry, difficulty controlling anxiety, and associated physical symptoms.",
        })
      }

      if (
        clinicalInfo.symptomSummary.toLowerCase().includes("trauma") ||
        clinicalInfo.symptomSummary.toLowerCase().includes("flashback") ||
        clinicalInfo.symptomSummary.toLowerCase().includes("nightmare")
      ) {
        suggestions.push({
          id: "sugg-3",
          code: "F43.10",
          description: "Post-Traumatic Stress Disorder, Unspecified",
          confidence: 0.72,
          rationale:
            "Patient reports history of trauma with intrusive memories, avoidance behaviors, and hyperarousal symptoms.",
        })
      }

      if (
        clinicalInfo.symptomSummary.toLowerCase().includes("mood swing") ||
        clinicalInfo.symptomSummary.toLowerCase().includes("manic") ||
        clinicalInfo.symptomSummary.toLowerCase().includes("bipolar")
      ) {
        suggestions.push({
          id: "sugg-4",
          code: "F31.9",
          description: "Bipolar Disorder, Unspecified",
          confidence: 0.68,
          rationale:
            "Patient reports alternating periods of depression and elevated mood with increased energy and decreased need for sleep.",
        })
      }

      // If no matches found, provide a generic suggestion
      if (suggestions.length === 0) {
        suggestions.push({
          id: "sugg-default",
          code: "F99",
          description: "Mental Disorder, Not Otherwise Specified",
          confidence: 0.55,
          rationale:
            "Based on limited information, a specific diagnosis cannot be determined with confidence. Further assessment recommended.",
        })
      }

      // Limit to 3 suggestions maximum and update store
      setFormData('clinicalInfo', {
        ...clinicalInfo,
        suggestedDiagnoses: suggestions.slice(0, 3),
        isGeneratingSuggestions: false
      })
    }, 1500)
  }

  // Add suggested diagnosis to diagnosis records
  const addSuggestedDiagnosis = (suggestion: typeof clinicalInfo.suggestedDiagnoses[0]) => {
    // Find the first empty diagnosis record or create a new one
    const emptyRecordIndex = clinicalInfo.diagnosisRecords.findIndex((record) => !record.code)

    if (emptyRecordIndex >= 0) {
      // Update the empty record
      const updatedRecords = [...clinicalInfo.diagnosisRecords]
      updatedRecords[emptyRecordIndex] = {
        ...updatedRecords[emptyRecordIndex],
        code: suggestion.code,
        description: suggestion.description,
        notes: suggestion.rationale,
      }
      setFormData('clinicalInfo', {
        ...clinicalInfo,
        diagnosisRecords: updatedRecords
      })
    } else {
      // Add a new record
      setFormData('clinicalInfo', {
        ...clinicalInfo,
        diagnosisRecords: [
          ...clinicalInfo.diagnosisRecords,
          {
            id: Date.now().toString(),
            code: suggestion.code,
            description: suggestion.description,
            onsetDate: undefined,
            diagnosisType: "",
            severity: "",
            verifiedBy: "",
            diagnosisDate: undefined,
            isBillable: false,
            notes: suggestion.rationale,
          },
        ]
      })
    }
  }

  // Sample DSM-5 codes for dropdown
  const dsm5Codes = [
    { value: "F32.9", label: "F32.9 - Major Depressive Disorder, Unspecified" },
    { value: "F41.1", label: "F41.1 - Generalized Anxiety Disorder" },
    { value: "F43.10", label: "F43.10 - Post-Traumatic Stress Disorder, Unspecified" },
    { value: "F60.3", label: "F60.3 - Borderline Personality Disorder" },
    { value: "F20.9", label: "F20.9 - Schizophrenia, Unspecified" },
    { value: "F31.9", label: "F31.9 - Bipolar Disorder, Unspecified" },
    { value: "F90.9", label: "F90.9 - Attention-Deficit/Hyperactivity Disorder, Unspecified" },
    { value: "F42", label: "F42 - Obsessive-Compulsive Disorder" },
    { value: "F50.9", label: "F50.9 - Eating Disorder, Unspecified" },
    { value: "F10.20", label: "F10.20 - Alcohol Use Disorder, Moderate" },
  ]

  return (
    <Card className={cn(
      "w-full rounded-2xl shadow-md mb-6",
      lastEditedStep === 3 && "ring-2 ring-primary"
    )}>
      <div
        className="p-6 border-b flex justify-between items-center cursor-pointer"
        onClick={onSectionToggle}
      >
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Diagnoses (DSM-5)</h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardContent className="p-6">
          {/* AI-Assisted Diagnosis Suggestions */}
          <div className="mb-8 pb-8 border-b">
            <h3 className="text-lg font-medium mb-4">Suggested Diagnoses (AI-Assisted)</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="symptomSummary">Presenting Problem or Symptom Summary</Label>
                  <Textarea
                    id="symptomSummary"
                    placeholder="Describe the client's symptoms, behaviors, and presenting problems..."
                    value={clinicalInfo.symptomSummary}
                    onChange={(e) => setFormData('clinicalInfo', {
                      ...clinicalInfo,
                      symptomSummary: e.target.value
                    })}
                    className="min-h-[100px]"
                  />
                </div>
                <Button
                  onClick={generateDiagnosisSuggestions}
                  disabled={clinicalInfo.isGeneratingSuggestions || !clinicalInfo.symptomSummary.trim()}
                  className="flex items-center gap-2"
                >
                  {clinicalInfo.isGeneratingSuggestions ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generating Suggestions...
                    </>
                  ) : (
                    <>
                      <Lightbulb className="h-4 w-4" />
                      Generate Diagnosis Suggestions
                    </>
                  )}
                </Button>
              </div>

              {clinicalInfo.suggestedDiagnoses.length > 0 && (
                <div className="mt-4 space-y-3">
                  <h4 className="font-medium text-sm text-gray-700">Suggested Diagnoses:</h4>
                  {clinicalInfo.suggestedDiagnoses.map((suggestion) => (
                    <div key={suggestion.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <div className="font-medium">
                            {suggestion.code} - {suggestion.description}
                          </div>
                          <div className="text-sm text-gray-600 mt-1">
                            Confidence: {Math.round(suggestion.confidence * 100)}%
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                          onClick={() => addSuggestedDiagnosis(suggestion)}
                        >
                          <Plus className="h-3 w-3" /> Add to Diagnoses
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">{suggestion.rationale}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Manual Diagnosis Entry */}
          {clinicalInfo.diagnosisRecords.map((record, index) => (
            <div key={record.id} className="mb-8 pb-8 border-b last:border-b-0 last:mb-0 last:pb-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Diagnosis {index + 1}</h3>
                {clinicalInfo.diagnosisRecords.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive"
                    onClick={() => removeDiagnosisRecord(record.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" /> Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Diagnosis Code */}
                <div className="space-y-2">
                  <Label htmlFor={`diagnosisCode-${record.id}`}>Diagnosis Code *</Label>
                  <Select
                    value={record.code}
                    onValueChange={(value) => {
                      updateDiagnosisField(record.id, "code", value)
                      // Auto-fill description based on selected code
                      const selectedCode = dsm5Codes.find((code) => code.value === value)
                      if (selectedCode) {
                        updateDiagnosisField(record.id, "description", selectedCode.label.split(" - ")[1] || "")
                      }
                    }}
                  >
                    <SelectTrigger id={`diagnosisCode-${record.id}`}>
                      <SelectValue placeholder="Select diagnosis code" />
                    </SelectTrigger>
                    <SelectContent>
                      {dsm5Codes.map((code) => (
                        <SelectItem key={code.value} value={code.value}>
                          {code.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor={`description-${record.id}`}>Description</Label>
                  <Input
                    id={`description-${record.id}`}
                    placeholder="Diagnosis description"
                    value={record.description}
                    onChange={(e) => updateDiagnosisField(record.id, "description", e.target.value)}
                  />
                </div>

                {/* Onset Date */}
                <div className="space-y-2">
                  <Label htmlFor={`onsetDate-${record.id}`}>Onset Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !record.onsetDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {record.onsetDate ? format(record.onsetDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CustomCalendar mode="single" selected={record.onsetDate} onSelect={(date) => updateDiagnosisField(record.id, "onsetDate", date)} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Diagnosis Type */}
                <div className="space-y-2">
                  <Label htmlFor={`diagnosisType-${record.id}`}>Diagnosis Type *</Label>
                  <Select
                    value={record.diagnosisType}
                    onValueChange={(value) => updateDiagnosisField(record.id, "diagnosisType", value)}
                  >
                    <SelectTrigger id={`diagnosisType-${record.id}`}>
                      <SelectValue placeholder="Select diagnosis type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                      <SelectItem value="rule-out">Rule-Out</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Severity */}
                <div className="space-y-2">
                  <Label htmlFor={`severity-${record.id}`}>Severity</Label>
                  <Select
                    value={record.severity}
                    onValueChange={(value) => updateDiagnosisField(record.id, "severity", value)}
                  >
                    <SelectTrigger id={`severity-${record.id}`}>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mild">Mild</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="severe">Severe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Verified By */}
                <div className="space-y-2">
                  <Label htmlFor={`verifiedBy-${record.id}`}>Verified By</Label>
                  <Input
                    id={`verifiedBy-${record.id}`}
                    placeholder="Name of verifying clinician"
                    value={record.verifiedBy}
                    onChange={(e) => updateDiagnosisField(record.id, "verifiedBy", e.target.value)}
                  />
                </div>

                {/* Diagnosis Date */}
                <div className="space-y-2">
                  <Label htmlFor={`diagnosisDate-${record.id}`}>Diagnosis Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !record.diagnosisDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {record.diagnosisDate ? format(record.diagnosisDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CustomCalendar mode="single" selected={record.diagnosisDate} onSelect={(date) => updateDiagnosisField(record.id, "diagnosisDate", date)} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Billable */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor={`billable-${record.id}`}>Billable Diagnosis</Label>
                    <Switch
                      id={`billable-${record.id}`}
                      checked={record.isBillable}
                      onCheckedChange={(checked) => updateDiagnosisField(record.id, "isBillable", checked)}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`notes-${record.id}`}>Notes</Label>
                  <Textarea
                    id={`notes-${record.id}`}
                    placeholder="Additional notes about the diagnosis"
                    value={record.notes}
                    onChange={(e) => updateDiagnosisField(record.id, "notes", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={addDiagnosisRecord}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Diagnosis Record
          </Button>
        </CardContent>
      )}
    </Card>
  )
} 