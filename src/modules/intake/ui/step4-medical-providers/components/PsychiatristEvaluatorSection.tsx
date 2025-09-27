'use client'

import { Brain, ChevronUp, ChevronDown } from "lucide-react"
import { useMemo, useCallback } from "react"

import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { Label } from "@/shared/ui/primitives/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shared/ui/primitives/Select"
import { Input } from "@/shared/ui/primitives/Input"
import { Textarea } from "@/shared/ui/primitives/Textarea"
import { Switch } from "@/shared/ui/primitives/Switch"
import { DatePicker } from "@/shared/ui/primitives/DatePicker"

// Import store
import { usePsychiatristUIStore } from "@/modules/intake/state/slices/step4"
// Import validation from schema
import { validatePsychiatrist } from "@/modules/intake/domain/schemas/step4"

interface PsychiatristEvaluatorSectionProps {
  onSectionToggle?: () => void
  isExpanded?: boolean
}

// Export validation function type for parent components
export interface PsychiatristValidation {
  validate: () => boolean
  getPayload: () => Record<string, unknown>
}

/**
 * Psychiatrist / Clinical Evaluator Section
 * Handles psychiatrist evaluation information with conditional fields
 * Connected to Zustand store and validated with Zod schema
 * SoC: UI layer only - no business logic or API calls
 */
export function PsychiatristEvaluatorSection({
  onSectionToggle,
  isExpanded: externalIsExpanded
}: PsychiatristEvaluatorSectionProps) {
  // Generate unique section ID for this instance
  const sectionUid = useMemo(() => `psy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, [])

  // Connect to store
  const store = usePsychiatristUIStore()
  const {
    hasBeenEvaluated,
    psychiatristName,
    evaluationDate,
    clinicName,
    notes,
    differentEvaluator,
    evaluatorName,
    evaluatorClinic,
    isExpanded: storeIsExpanded,
    validationErrors,
    setHasBeenEvaluated,
    setPsychiatristField,
    toggleDifferentEvaluator,
    setDifferentEvaluator,
    setEvaluatorField,
    toggleExpanded,
    setValidationErrors,
    clearValidationError,
    resetConditionalFields
  } = store

  // Use external isExpanded if provided, otherwise use store
  const isExpanded = externalIsExpanded ?? storeIsExpanded
  const handleToggle = onSectionToggle ?? toggleExpanded

  // Generate payload for submission
  const getPayload = useCallback(() => {
    const payload = {
      hasBeenEvaluated: hasBeenEvaluated ?? undefined,
      psychiatristName: hasBeenEvaluated === 'Yes' ? psychiatristName?.trim() : undefined,
      evaluationDate: hasBeenEvaluated === 'Yes' ? evaluationDate : undefined,
      clinicName: hasBeenEvaluated === 'Yes' && clinicName?.trim() ? clinicName.trim() : undefined,
      notes: hasBeenEvaluated === 'Yes' && notes?.trim() ? notes.trim() : undefined,
      differentEvaluator: hasBeenEvaluated === 'Yes' ? differentEvaluator : undefined,
      evaluatorName: hasBeenEvaluated === 'Yes' && differentEvaluator && evaluatorName?.trim() ? evaluatorName.trim() : undefined,
      evaluatorClinic: hasBeenEvaluated === 'Yes' && differentEvaluator && evaluatorClinic?.trim() ? evaluatorClinic.trim() : undefined
    }

    // Remove undefined values for cleaner payload
    return Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== undefined)
    ) as Record<string, unknown>
  }, [hasBeenEvaluated, psychiatristName, evaluationDate, clinicName, notes, differentEvaluator, evaluatorName, evaluatorClinic])

  // Validate using Zod schema
  const validateFields = useCallback(() => {
    const payload = getPayload()
    const result = validatePsychiatrist(payload)

    if (!result.success) {
      const errors: Record<string, string> = {}

      // Map Zod errors to field-specific messages
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as string

        if (field === 'hasBeenEvaluated') {
          errors['hasBeenEvaluated'] = 'This field is required'
        } else if (field === 'psychiatristName') {
          if (!psychiatristName?.trim()) {
            errors['psychiatristName'] = 'Psychiatrist name is required'
          } else if (psychiatristName.trim().length > 120) {
            errors['psychiatristName'] = 'Maximum 120 characters allowed'
          } else {
            errors['psychiatristName'] = 'Psychiatrist name is required when evaluated'
          }
        } else if (field === 'evaluationDate') {
          errors['evaluationDate'] = 'Evaluation date is required'
        } else if (field === 'clinicName') {
          errors['clinicName'] = 'Maximum 120 characters allowed'
        } else if (field === 'notes') {
          errors['notes'] = 'Maximum 300 characters allowed'
        } else if (field === 'evaluatorName') {
          errors['evaluatorName'] = 'Maximum 120 characters allowed'
        } else if (field === 'evaluatorClinic') {
          errors['evaluatorClinic'] = 'Maximum 120 characters allowed'
        }
      })

      setValidationErrors(errors)
      return false
    }

    // Clear all errors on successful validation
    setValidationErrors({})
    return true
  }, [getPayload, psychiatristName, setValidationErrors])

  // Expose validation interface via window
  if (typeof window !== 'undefined') {
    (window as Window & { psychiatristValidation?: PsychiatristValidation }).psychiatristValidation = {
      validate: validateFields,
      getPayload
    }
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
          <Brain className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">
            Psychiatrist / Clinical Evaluator
          </h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardBody id={`${sectionUid}-panel`} aria-labelledby={`${sectionUid}-header`} className="p-6">
          <div className="space-y-6">
            {/* Has Been Evaluated Selection */}
            <div className="space-y-2">
              <Label htmlFor="psy-has" className="text-base">
                Has the client been evaluated by a psychiatrist?<span className="text-[var(--destructive)]">*</span>
              </Label>
              <Select
                value={hasBeenEvaluated ?? ''}
                onValueChange={(value) => {
                  setHasBeenEvaluated(value as 'Yes' | 'No')
                  if (value) {
                    clearValidationError('hasBeenEvaluated')
                  }
                  // Clear conditional fields when not "Yes"
                  if (value !== 'Yes') {
                    resetConditionalFields()
                  }
                }}
              >
                <SelectTrigger
                  id="psy-has"
                  className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                  aria-label="Has been evaluated by psychiatrist"
                  aria-required="true"
                  aria-invalid={!!validationErrors['hasBeenEvaluated'] ? "true" : undefined}
                  aria-describedby={validationErrors['hasBeenEvaluated'] ? "psy-has-error" : undefined}
                >
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors['hasBeenEvaluated'] && (
                <p id="psy-has-error" className="text-sm text-[var(--destructive)]" role="alert">
                  {validationErrors['hasBeenEvaluated']}
                </p>
              )}
            </div>

            {/* Conditional Fields - Only show if hasBeenEvaluated === "Yes" */}
            {hasBeenEvaluated === "Yes" && (
              <>
                {/* Psychiatrist Name and Evaluation Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Psychiatrist Full Name */}
                  <div className="space-y-2">
                    <Label htmlFor="psy-name">
                      Psychiatrist Full Name<span className="text-[var(--destructive)]">*</span>
                    </Label>
                    <Input
                      id="psy-name"
                      type="text"
                      value={psychiatristName ?? ''}
                      onChange={(e) => {
                        const value = e.target.value
                        if (value.length <= 120) {
                          setPsychiatristField('psychiatristName', value)
                          // Clear error if valid
                          if (value.trim()) {
                            clearValidationError('psychiatristName')
                          }
                        }
                      }}
                      maxLength={120}
                      placeholder="Enter psychiatrist's full name"
                      className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                      aria-required="true"
                      aria-invalid={!!validationErrors['psychiatristName'] ? "true" : undefined}
                      aria-describedby={validationErrors['psychiatristName'] ? "psy-name-error" : undefined}
                      aria-label="Psychiatrist Full Name"
                    />
                    {validationErrors['psychiatristName'] && (
                      <p id="psy-name-error" className="text-sm text-[var(--destructive)]" role="alert">
                        {validationErrors['psychiatristName']}
                      </p>
                    )}
                  </div>

                  {/* Evaluation Date */}
                  <div className="space-y-2">
                    <Label htmlFor="psy-date">
                      Evaluation Date<span className="text-[var(--destructive)]">*</span>
                    </Label>
                    <DatePicker
                      id="psy-date"
                      date={evaluationDate}
                      onSelect={(date) => {
                        setPsychiatristField('evaluationDate', date)
                        if (date) {
                          clearValidationError('evaluationDate')
                        }
                      }}
                      placeholder="Select evaluation date"
                      className="w-full"
                      aria-required="true"
                      aria-invalid={!!validationErrors['evaluationDate'] ? "true" : undefined}
                      {...(validationErrors['evaluationDate'] && { 'aria-describedby': "psy-date-error" })}
                    />
                    {validationErrors['evaluationDate'] && (
                      <p id="psy-date-error" className="text-sm text-[var(--destructive)]" role="alert">
                        {validationErrors['evaluationDate']}
                      </p>
                    )}
                  </div>
                </div>

                {/* Clinic Name */}
                <div className="space-y-2">
                  <Label htmlFor="psy-clinic">
                    Clinic / Facility Name
                  </Label>
                  <Input
                    id="psy-clinic"
                    type="text"
                    value={clinicName ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value.length <= 120) {
                        setPsychiatristField('clinicName', value)
                        clearValidationError('clinicName')
                      }
                    }}
                    maxLength={120}
                    placeholder="Enter clinic or facility name"
                    className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                    aria-label="Clinic or Facility Name"
                    aria-invalid={!!validationErrors['clinicName'] ? "true" : undefined}
                    aria-describedby={validationErrors['clinicName'] ? "psy-clinic-error" : undefined}
                  />
                  {validationErrors['clinicName'] && (
                    <p id="psy-clinic-error" className="text-sm text-[var(--destructive)]" role="alert">
                      {validationErrors['clinicName']}
                    </p>
                  )}
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="psy-notes">
                    Notes
                  </Label>
                  <Textarea
                    id="psy-notes"
                    value={notes ?? ''}
                    onChange={(e) => {
                      const value = e.target.value
                      if (value.length <= 300) {
                        setPsychiatristField('notes', value)
                        clearValidationError('notes')
                      }
                    }}
                    maxLength={300}
                    placeholder="Enter any additional notes about the evaluation..."
                    className="min-h-[100px] w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                    rows={4}
                    aria-label="Evaluation Notes"
                    aria-invalid={!!validationErrors['notes'] ? "true" : undefined}
                    aria-describedby={validationErrors['notes'] ? "psy-notes-error" : undefined}
                  />
                  {validationErrors['notes'] && (
                    <p id="psy-notes-error" className="text-sm text-[var(--destructive)]" role="alert">
                      {validationErrors['notes']}
                    </p>
                  )}
                </div>

                {/* Different Clinical Evaluator */}
                <div className="flex items-center justify-between">
                  <Label htmlFor="psy-diff" className="text-base cursor-pointer">
                    Different Clinical Evaluator?
                  </Label>
                  <Switch
                    id="psy-diff"
                    checked={differentEvaluator ?? false}
                    onCheckedChange={(checked) => {
                      setDifferentEvaluator(checked)
                      if (!checked) {
                        // Clear evaluator fields when toggling off
                        setEvaluatorField('evaluatorName', '')
                        setEvaluatorField('evaluatorClinic', '')
                        clearValidationError('evaluatorName')
                        clearValidationError('evaluatorClinic')
                      }
                    }}
                    aria-label="Different Clinical Evaluator"
                  />
                </div>

                {/* Conditional fields for Different Evaluator */}
                {differentEvaluator && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {/* Evaluator Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="psy-eval-name">
                        Evaluator Full Name
                      </Label>
                      <Input
                        id="psy-eval-name"
                        type="text"
                        value={evaluatorName ?? ''}
                        onChange={(e) => {
                          const value = e.target.value
                          if (value.length <= 120) {
                            setEvaluatorField('evaluatorName', value)
                            clearValidationError('evaluatorName')
                          }
                        }}
                        maxLength={120}
                        placeholder="Enter evaluator's full name"
                        className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                        aria-label="Evaluator Full Name"
                        aria-invalid={!!validationErrors['evaluatorName'] ? "true" : undefined}
                        aria-describedby={validationErrors['evaluatorName'] ? "psy-eval-name-error" : undefined}
                      />
                      {validationErrors['evaluatorName'] && (
                        <p id="psy-eval-name-error" className="text-sm text-[var(--destructive)]" role="alert">
                          {validationErrors['evaluatorName']}
                        </p>
                      )}
                    </div>

                    {/* Evaluator Clinic / Facility */}
                    <div className="space-y-2">
                      <Label htmlFor="psy-eval-clinic">
                        Evaluator Clinic / Facility
                      </Label>
                      <Input
                        id="psy-eval-clinic"
                        type="text"
                        value={evaluatorClinic ?? ''}
                        onChange={(e) => {
                          const value = e.target.value
                          if (value.length <= 120) {
                            setEvaluatorField('evaluatorClinic', value)
                            clearValidationError('evaluatorClinic')
                          }
                        }}
                        maxLength={120}
                        placeholder="Enter evaluator's clinic or facility"
                        className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                        aria-label="Evaluator Clinic or Facility"
                        aria-invalid={!!validationErrors['evaluatorClinic'] ? "true" : undefined}
                        aria-describedby={validationErrors['evaluatorClinic'] ? "psy-eval-clinic-error" : undefined}
                      />
                      {validationErrors['evaluatorClinic'] && (
                        <p id="psy-eval-clinic-error" className="text-sm text-[var(--destructive)]" role="alert">
                          {validationErrors['evaluatorClinic']}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardBody>
      )}
    </Card>
  )
}