'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from "react"
import { useForm } from 'react-hook-form'

import { Button } from "@/shared/ui/primitives/Button"
import { Checkbox } from "@/shared/ui/primitives/Checkbox"
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

import { loadStep3Action, upsertDiagnosesAction } from '@/modules/intake/actions/step3'
import { step3DataPartialSchema, type Step3DataPartial } from '@/modules/intake/domain/schemas/diagnoses-clinical.schema'

// Components will be updated to work with React Hook Form
// For now, we'll use simple form fields directly

/**
 * Step 3: Diagnoses & Clinical Evaluation
 * Container for clinical assessment sections with unified validation
 * SoC: UI layer only - orchestrates sections and handles submit
 */
interface Step3DiagnosesClinicalProps {
  onSubmit?: (data: Record<string, unknown>) => void
  onNext?: () => void
}

export function Step3DiagnosesClinical({
  onSubmit,
  onNext
}: Step3DiagnosesClinicalProps = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // React Hook Form setup
  const form = useForm<Step3DataPartial>({
    resolver: zodResolver(step3DataPartialSchema),
    defaultValues: {
      diagnoses: {
        primaryDiagnosis: '',
        substanceUseDisorder: undefined,
        mentalHealthHistory: ''
      },
      psychiatricEvaluation: {
        severityLevel: undefined,
        medicationCompliance: undefined,
        suicidalIdeation: false,
        homicidalIdeation: false,
        psychoticSymptoms: false,
        treatmentHistory: ''
      },
      functionalAssessment: {
        globalFunctioningGAFScore: undefined,
        socialFunctioning: undefined,
        occupationalFunctioning: undefined,
        cognitiveStatus: undefined,
        adaptiveBehavior: ''
      }
    }
  })

  // Load initial data
  useEffect(() => {
    async function loadData() {
      try {
        const result = await loadStep3Action()
        if (result.ok && result.data) {
          form.reset({
            diagnoses: result.data.data.diagnoses ?? {},
            psychiatricEvaluation: result.data.data.psychiatricEvaluation ?? {},
            functionalAssessment: result.data.data.functionalAssessment ?? {}
          })
        }
      } catch {
        // Silent fail for initial load
      }
    }
    loadData()
  }, [form])

  // Error messages (generic, no PHI)
  const ERROR_MESSAGES: Record<string, string> = {
    UNAUTHORIZED: 'Please sign in to continue',
    VALIDATION_FAILED: 'Please check the form for errors',
    NOT_FOUND: 'Clinical assessment information not found',
    SAVE_FAILED: 'Unable to save clinical assessment data',
    UNKNOWN: 'An error occurred. Please try again'
  }

  /**
   * Handle unified submit with validation using React Hook Form
   */
  const handleSubmit = form.handleSubmit(async (values: Step3DataPartial) => {
    setIsSubmitting(true)
    setSaveError(null)

    try {
      // Submit to server action
      const result = await upsertDiagnosesAction(values)

      if (result.ok) {
        // Call onSubmit callback if provided
        if (onSubmit) {
          await onSubmit(values)
        }

        // Navigate to next step if callback provided
        if (onNext) {
          onNext()
        }
      } else {
        // Handle error with generic message
        const errorCode = result.error?.code ?? 'UNKNOWN'
        setSaveError(ERROR_MESSAGES[errorCode] ?? ERROR_MESSAGES.UNKNOWN)

        // Show validation errors if any
        if (errorCode === 'VALIDATION_FAILED') {
          // Errors will be shown inline with form fields
        }
      }
    } catch {
      // Handle unexpected errors gracefully
      setSaveError(ERROR_MESSAGES.UNKNOWN)
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <div className="flex-1 w-full">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Error Alert */}
        {saveError && (
          <div className="bg-[var(--destructive)]/10 border border-[var(--destructive)] text-[var(--destructive)] px-4 py-3 rounded" role="alert">
            <span className="font-medium">Error: </span>
            <span>{saveError}</span>
          </div>
        )}

        {/* Diagnoses (DSM-5) Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Diagnoses (DSM-5/ICD-10)</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="primary-diagnosis">
                Primary Diagnosis
              </Label>
              <Input
                id="primary-diagnosis"
                {...form.register('diagnoses.primaryDiagnosis')}
                aria-label="Primary Diagnosis"
                aria-invalid={!!form.formState.errors.diagnoses?.primaryDiagnosis}
              />
              {form.formState.errors.diagnoses?.primaryDiagnosis && (
                <p className="mt-1 text-sm text-[var(--destructive)]" role="alert">
                  {form.formState.errors.diagnoses.primaryDiagnosis.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="substance-use">Substance Use Disorder</Label>
              <Select
                value={form.watch('diagnoses.substanceUseDisorder') ?? ''}
                onValueChange={(value) => form.setValue('diagnoses.substanceUseDisorder', value)}
              >
                <SelectTrigger id="substance-use">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="mental-health-history">
                Mental Health History
              </Label>
              <Textarea
                id="mental-health-history"
                {...form.register('diagnoses.mentalHealthHistory')}
                aria-label="Mental Health History"
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>

        {/* Psychiatric Evaluation Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Psychiatric Evaluation</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="severity-level">Severity Level</Label>
              <Select
                value={form.watch('psychiatricEvaluation.severityLevel') ?? ''}
                onValueChange={(value) => form.setValue('psychiatricEvaluation.severityLevel', value)}
              >
                <SelectTrigger id="severity-level">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mild">Mild</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="severe">Severe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="medication-compliance">Medication Compliance</Label>
              <Select
                value={form.watch('psychiatricEvaluation.medicationCompliance') ?? ''}
                onValueChange={(value) => form.setValue('psychiatricEvaluation.medicationCompliance', value)}
              >
                <SelectTrigger id="medication-compliance">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="adherent">Adherent</SelectItem>
                  <SelectItem value="partially_adherent">Partially Adherent</SelectItem>
                  <SelectItem value="non_adherent">Non-Adherent</SelectItem>
                  <SelectItem value="not_applicable">Not Applicable</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="suicidal-ideation"
                  checked={form.watch('psychiatricEvaluation.suicidalIdeation') ?? false}
                  onCheckedChange={(checked) => form.setValue('psychiatricEvaluation.suicidalIdeation', checked as boolean)}
                />
                <Label htmlFor="suicidal-ideation">Suicidal Ideation</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="homicidal-ideation"
                  checked={form.watch('psychiatricEvaluation.homicidalIdeation') ?? false}
                  onCheckedChange={(checked) => form.setValue('psychiatricEvaluation.homicidalIdeation', checked as boolean)}
                />
                <Label htmlFor="homicidal-ideation">Homicidal Ideation</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="psychotic-symptoms"
                  checked={form.watch('psychiatricEvaluation.psychoticSymptoms') ?? false}
                  onCheckedChange={(checked) => form.setValue('psychiatricEvaluation.psychoticSymptoms', checked as boolean)}
                />
                <Label htmlFor="psychotic-symptoms">Psychotic Symptoms</Label>
              </div>
            </div>

            <div>
              <Label htmlFor="treatment-history">Treatment History</Label>
              <Textarea
                id="treatment-history"
                {...form.register('psychiatricEvaluation.treatmentHistory')}
                aria-label="Treatment History"
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>

        {/* Functional Assessment Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Functional Assessment (WHODAS 2.0)</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="gaf-score">Global Functioning GAF Score (0-100)</Label>
              <Input
                id="gaf-score"
                type="number"
                {...form.register('functionalAssessment.globalFunctioningGAFScore', { valueAsNumber: true })}
                aria-label="Global Functioning GAF Score"
                min="0"
                max="100"
              />
            </div>

            <div>
              <Label htmlFor="social-functioning">Social Functioning</Label>
              <Select
                value={form.watch('functionalAssessment.socialFunctioning') ?? ''}
                onValueChange={(value) => form.setValue('functionalAssessment.socialFunctioning', value)}
              >
                <SelectTrigger id="social-functioning">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="independent">Independent</SelectItem>
                  <SelectItem value="minimal_assistance">Minimal Assistance</SelectItem>
                  <SelectItem value="moderate_assistance">Moderate Assistance</SelectItem>
                  <SelectItem value="maximal_assistance">Maximal Assistance</SelectItem>
                  <SelectItem value="total_assistance">Total Assistance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="occupational-functioning">Occupational Functioning</Label>
              <Select
                value={form.watch('functionalAssessment.occupationalFunctioning') ?? ''}
                onValueChange={(value) => form.setValue('functionalAssessment.occupationalFunctioning', value)}
              >
                <SelectTrigger id="occupational-functioning">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed_full_time">Employed Full-Time</SelectItem>
                  <SelectItem value="employed_part_time">Employed Part-Time</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="disabled">Disabled</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="cognitive-status">Cognitive Status</Label>
              <Select
                value={form.watch('functionalAssessment.cognitiveStatus') ?? ''}
                onValueChange={(value) => form.setValue('functionalAssessment.cognitiveStatus', value)}
              >
                <SelectTrigger id="cognitive-status">
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="intact">Intact</SelectItem>
                  <SelectItem value="mild_impairment">Mild Impairment</SelectItem>
                  <SelectItem value="moderate_impairment">Moderate Impairment</SelectItem>
                  <SelectItem value="severe_impairment">Severe Impairment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="adaptive-behavior">Adaptive Behavior</Label>
              <Textarea
                id="adaptive-behavior"
                {...form.register('functionalAssessment.adaptiveBehavior')}
                aria-label="Adaptive Behavior"
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6 border-t border-[var(--border)]">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[120px]"
            variant="primary"
          >
            {isSubmitting ? 'Saving...' : 'Save & Continue'}
          </Button>
        </div>
      </form>
    </div>
  )
}