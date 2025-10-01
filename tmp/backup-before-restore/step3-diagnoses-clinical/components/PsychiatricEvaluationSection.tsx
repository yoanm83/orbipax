'use client'

import { Brain, ChevronUp, ChevronDown } from "lucide-react"
import { useState, useMemo } from "react"

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

interface PsychiatricEvaluationSectionProps {
  onSectionToggle: () => void
  isExpanded: boolean
}

/**
 * Psychiatric Evaluation Section
 * Handles psychiatric evaluation data with conditional fields
 * SoC: UI layer only - no business logic or API calls
 */
export function PsychiatricEvaluationSection({
  onSectionToggle,
  isExpanded
}: PsychiatricEvaluationSectionProps) {
  // Generate unique section ID for this instance
  const sectionUid = useMemo(() => `pe_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, [])

  // Local state for psychiatric evaluation
  const [hasPsychEval, setHasPsychEval] = useState<string>("")
  const [evaluationDate, setEvaluationDate] = useState<Date | undefined>()
  const [evaluatedBy, setEvaluatedBy] = useState("")
  const [evaluationSummary, setEvaluationSummary] = useState("")
  const [showDateError, setShowDateError] = useState(false)

  // Validate required fields when hasPsychEval is "Yes"
  const validateConditionalFields = () => {
    if (hasPsychEval === "Yes" && !evaluationDate) {
      setShowDateError(true)
      return false
    }
    setShowDateError(false)
    return true
  }

  // Clear conditional fields when switching to "No"
  const handleHasPsychEvalChange = (value: string) => {
    setHasPsychEval(value)
    if (value === "No") {
      // Clear conditional fields and errors
      setEvaluationDate(undefined)
      setEvaluatedBy("")
      setEvaluationSummary("")
      setShowDateError(false)
    }
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
          <Brain className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">
            Psychiatric Evaluation
          </h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardBody id={`${sectionUid}-panel`} aria-labelledby={`${sectionUid}-header`} className="p-6">
          <div className="space-y-6">
            {/* Has Psychiatric Evaluation */}
            <div className="space-y-2">
              <Label htmlFor="pe-has">
                Has the client completed a psychiatric evaluation?<span className="text-[var(--destructive)]">*</span>
              </Label>
              <Select
                value={hasPsychEval}
                onValueChange={handleHasPsychEvalChange}
              >
                <SelectTrigger
                  id="pe-has"
                  className="w-full md:w-[200px]"
                  aria-label="Has psychiatric evaluation"
                  aria-required="true"
                  aria-invalid={!hasPsychEval ? "true" : undefined}
                  aria-describedby={!hasPsychEval ? "pe-has-error" : undefined}
                >
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
              {!hasPsychEval && (
                <p id="pe-has-error" className="text-sm text-[var(--destructive)] mt-1">
                  This field is required
                </p>
              )}
            </div>

            {/* Conditional Fields - Only show when "Yes" is selected */}
            {hasPsychEval === "Yes" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--border)]">
                {/* Evaluation Date */}
                <div className="space-y-2">
                  <Label htmlFor="pe-date">
                    Evaluation Date<span className="text-[var(--destructive)]">*</span>
                  </Label>
                  <DatePicker
                    id="pe-date"
                    placeholder="Select date"
                    date={evaluationDate}
                    onSelect={(date: Date | undefined) => {
                      setEvaluationDate(date)
                      if (date) setShowDateError(false)
                    }}
                    className="w-full"
                  />
                  {showDateError && (
                    <p id="pe-date-error" className="text-sm text-[var(--destructive)] mt-1">
                      Evaluation date is required
                    </p>
                  )}
                </div>

                {/* Evaluated By */}
                <div className="space-y-2">
                  <Label htmlFor="pe-by">
                    Evaluated By
                  </Label>
                  <Input
                    id="pe-by"
                    type="text"
                    placeholder="Name of evaluating clinician"
                    value={evaluatedBy}
                    onChange={(e) => setEvaluatedBy(e.target.value)}
                    className="w-full"
                    aria-label="Evaluated By"
                  />
                </div>

                {/* Evaluation Summary */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="pe-summary">
                    Evaluation Summary
                  </Label>
                  <Textarea
                    id="pe-summary"
                    placeholder="Summary of psychiatric evaluation findings..."
                    value={evaluationSummary}
                    onChange={(e) => setEvaluationSummary(e.target.value)}
                    className="min-h-[120px] w-full"
                    rows={5}
                    aria-label="Evaluation Summary"
                  />
                </div>
              </div>
            )}
          </div>
        </CardBody>
      )}
    </Card>
  )
}