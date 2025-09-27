'use client'

import { Pill, ChevronUp, ChevronDown, Plus, Trash2, AlertTriangle } from "lucide-react"
import { useMemo, useCallback } from "react"

import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { Label } from "@/shared/ui/primitives/label"
import { Input } from "@/shared/ui/primitives/Input"
import { Button } from "@/shared/ui/primitives/Button"
import { Alert } from "@/shared/ui/primitives/Alert"
import { Textarea } from "@/shared/ui/primitives/Textarea"
import { DatePicker } from "@/shared/ui/primitives/DatePicker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shared/ui/primitives/Select"

// Import validation from schema
import { validateCurrentMedications, medicationItemSchema, allergyItemSchema } from "@/modules/intake/domain/schemas/step5/currentMedications.schema"
import { SeverityLevel } from "@/modules/intake/domain/types/common"
// Import store
import { useCurrentMedicationsUIStore } from "@/modules/intake/state/slices/step5/currentMedications.ui.slice"

interface CurrentMedicationsSectionProps {
  onSectionToggle?: () => void
  isExpanded?: boolean
}

/**
 * Current Medications & Allergies Section
 * Handles medication status with Yes/No/Unknown selection
 * Connected to Zustand store and validated with Zod schema
 * SoC: UI layer only - no business logic or API calls
 */
export function CurrentMedicationsSection({
  onSectionToggle,
  isExpanded: externalIsExpanded
}: CurrentMedicationsSectionProps) {
  // Generate unique section ID for this instance
  const sectionUid = useMemo(() => `medications_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, [])

  // Connect to store
  const store = useCurrentMedicationsUIStore()
  const {
    hasMedications,
    medications,
    allergies,
    isExpanded: storeIsExpanded,
    validationErrors,
    medicationErrors,
    allergyErrors,
    setHasMedications,
    addMedication,
    removeMedication,
    updateMedication,
    addAllergy,
    removeAllergy,
    updateAllergy,
    toggleExpanded,
    setValidationErrors,
    clearValidationError,
    setMedicationErrors,
    setAllergyErrors,
    clearConditionalFields
  } = store

  // Use external isExpanded if provided, otherwise use store
  const isExpanded = externalIsExpanded ?? storeIsExpanded
  const handleToggle = onSectionToggle ?? toggleExpanded

  // Generate payload for submission
  const getPayload = useCallback(() => {
    const payload = {
      hasMedications: hasMedications ?? undefined,
      medications: hasMedications === 'Yes' ? medications : [],
      allergies: hasMedications === 'Yes' ? allergies : []
    }

    // Remove undefined values for cleaner payload
    return Object.fromEntries(
      Object.entries(payload).filter(([, v]) => v !== undefined)
    )
  }, [hasMedications, medications, allergies])

  // Validate using Zod schema
  const validateFields = useCallback(() => {
    const payload = getPayload()
    const result = validateCurrentMedications(payload)

    if (!result.success) {
      const errors: Record<string, string> = {}
      result.error.issues.forEach(issue => {
        const field = issue.path[0] as string
        errors[field] = issue.message
      })
      setValidationErrors(errors)
      return false
    }

    setValidationErrors({})
    return true
  }, [getPayload, setValidationErrors])


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
          <Pill className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">
            Current Medications & Allergies
          </h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardBody id={`${sectionUid}-panel`} aria-labelledby={`${sectionUid}-header`} className="p-6">
          <div className="space-y-6">
            {/* Has Medications Selection */}
            <div className="space-y-2">
              <Label htmlFor="medications-has" className="text-base">
                Are you currently taking any medications?<span className="text-[var(--destructive)]">*</span>
              </Label>
              <Select
                value={hasMedications ?? ''}
                onValueChange={(value) => {
                  setHasMedications(value as 'Yes' | 'No' | 'Unknown')
                  if (value) {
                    clearValidationError('hasMedications')
                  }
                  // Clear conditional fields when not "Yes"
                  if (value !== 'Yes') {
                    clearConditionalFields()
                  } else if (medications.length === 0) {
                    // Add first medication when selecting Yes
                    addMedication()
                  }
                }}
              >
                <SelectTrigger
                  id="medications-has"
                  className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                  aria-label="Has Medications"
                  aria-required="true"
                  aria-invalid={!!validationErrors['hasMedications'] ? "true" : undefined}
                  aria-describedby={validationErrors['hasMedications'] ? "medications-has-error" : undefined}
                >
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
              {validationErrors['hasMedications'] && (
                <p id="medications-has-error" className="text-sm text-[var(--destructive)]" role="alert">
                  {validationErrors['hasMedications']}
                </p>
              )}
            </div>

            {/* Conditional Fields - Only show if hasMedications === "Yes" */}
            {hasMedications === "Yes" && (
              <>
                <div className="space-y-6">
                  <h3 className="text-base font-medium text-[var(--foreground)]">Medication List</h3>

                  {medications.map((medication, index) => (
                    <div key={medication.id} className="space-y-4">
                      {/* Medication Header with title and remove button - matching Insurance pattern */}
                      {(medications.length > 1 || index > 0) && (
                        <div className="flex justify-between items-center pb-2">
                          <h3
                            id={`med-${medication.id}-heading`}
                            className="text-md font-medium text-[var(--foreground)]"
                          >
                            Medication {index + 1}
                          </h3>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeMedication(medication.id)
                            }}
                            aria-label={`Remove medication ${index + 1}`}
                            className="text-[var(--destructive)]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      {/* Medication Fields Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-labelledby={medications.length > 1 ? `med-${medication.id}-heading` : undefined}>
                        {/* Column 1 */}
                        {/* Medication Name */}
                        <div className="space-y-2">
                          <Label htmlFor={`med-name-${medication.id}`}>
                            Medication Name<span className="text-[var(--destructive)]">*</span>
                          </Label>
                          <Input
                            id={`med-name-${medication.id}`}
                            type="text"
                            value={medication.name}
                            onChange={(e) => {
                              const value = e.target.value
                              if (value.length <= 200) {
                                updateMedication(medication.id, 'name', value)
                              }
                            }}
                            maxLength={200}
                            placeholder="Enter medication name"
                            className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                            aria-required="true"
                            aria-invalid={!!medicationErrors[medication.id]?.name}
                            aria-describedby={medicationErrors[medication.id]?.name ? `med-name-error-${medication.id}` : undefined}
                          />
                          {medicationErrors[medication.id]?.name && (
                            <p id={`med-name-error-${medication.id}`} className="text-sm text-[var(--destructive)]" role="alert">
                              {medicationErrors[medication.id].name}
                            </p>
                          )}
                        </div>

                        {/* Column 2 */}
                        {/* Dosage */}
                        <div className="space-y-2">
                          <Label htmlFor={`med-dosage-${medication.id}`}>
                            Dosage<span className="text-[var(--destructive)]">*</span>
                          </Label>
                          <Input
                            id={`med-dosage-${medication.id}`}
                            type="text"
                            value={medication.dosage}
                            onChange={(e) => {
                              const value = e.target.value
                              if (value.length <= 100) {
                                updateMedication(medication.id, 'dosage', value)
                              }
                            }}
                            maxLength={100}
                            placeholder="e.g., 10mg"
                            className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                            aria-required="true"
                            aria-invalid={!!medicationErrors[medication.id]?.dosage}
                            aria-describedby={medicationErrors[medication.id]?.dosage ? `med-dosage-error-${medication.id}` : undefined}
                          />
                          {medicationErrors[medication.id]?.dosage && (
                            <p id={`med-dosage-error-${medication.id}`} className="text-sm text-[var(--destructive)]" role="alert">
                              {medicationErrors[medication.id].dosage}
                            </p>
                          )}
                        </div>

                        {/* Frequency */}
                        <div className="space-y-2">
                          <Label htmlFor={`med-frequency-${medication.id}`}>
                            Frequency<span className="text-[var(--destructive)]">*</span>
                          </Label>
                          <Input
                            id={`med-frequency-${medication.id}`}
                            type="text"
                            value={medication.frequency}
                            onChange={(e) => {
                              const value = e.target.value
                              if (value.length <= 100) {
                                updateMedication(medication.id, 'frequency', value)
                              }
                            }}
                            maxLength={100}
                            placeholder="e.g., Twice daily"
                            className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                            aria-required="true"
                            aria-invalid={!!medicationErrors[medication.id]?.frequency}
                            aria-describedby={medicationErrors[medication.id]?.frequency ? `med-frequency-error-${medication.id}` : undefined}
                          />
                          {medicationErrors[medication.id]?.frequency && (
                            <p id={`med-frequency-error-${medication.id}`} className="text-sm text-[var(--destructive)]" role="alert">
                              {medicationErrors[medication.id].frequency}
                            </p>
                          )}
                        </div>

                        {/* Route */}
                        <div className="space-y-2">
                          <Label htmlFor={`med-route-${medication.id}`}>Route</Label>
                          <Select
                            value={medication.route ?? ''}
                            onValueChange={(value) => updateMedication(medication.id, 'route', value)}
                          >
                            <SelectTrigger
                              id={`med-route-${medication.id}`}
                              className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                              aria-label="Route of administration"
                            >
                              <SelectValue placeholder="Select route" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="oral">Oral</SelectItem>
                              <SelectItem value="injection">Injection</SelectItem>
                              <SelectItem value="topical">Topical</SelectItem>
                              <SelectItem value="sublingual">Sublingual</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Prescribed By */}
                        <div className="space-y-2">
                          <Label htmlFor={`med-prescriber-${medication.id}`}>Prescribed By</Label>
                          <Input
                            id={`med-prescriber-${medication.id}`}
                            type="text"
                            value={medication.prescribedBy ?? ''}
                            onChange={(e) => {
                              const value = e.target.value
                              if (value.length <= 120) {
                                updateMedication(medication.id, 'prescribedBy', value)
                              }
                            }}
                            maxLength={120}
                            placeholder="Enter prescriber's name"
                            className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                            aria-label="Prescribed by"
                          />
                        </div>

                        {/* Start Date */}
                        <div className="space-y-2">
                          <Label htmlFor={`med-date-${medication.id}`}>Start Date</Label>
                          <DatePicker
                            id={`med-date-${medication.id}`}
                            value={medication.startDate}
                            onChange={(date) => updateMedication(medication.id, 'startDate', date)}
                            placeholder="Select date"
                            className="w-full"
                          />
                        </div>

                        {/* Notes - Full width */}
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`med-notes-${medication.id}`}>Notes</Label>
                          <Textarea
                            id={`med-notes-${medication.id}`}
                            value={medication.notes ?? ''}
                            onChange={(e) => {
                              const value = e.target.value
                              if (value.length <= 500) {
                                updateMedication(medication.id, 'notes', value)
                              }
                            }}
                            maxLength={500}
                            rows={3}
                            placeholder="Additional notes about this medication"
                            className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none resize-none"
                            aria-label="Notes"
                          />
                        </div>
                      </div>

                      {/* Inline validation alert for this medication */}
                      {(medication.name.trim() === '' || medication.dosage.trim() === '' || medication.frequency.trim() === '') && (
                        <Alert className="mt-4 border-amber-200 bg-amber-50" variant="warning">
                          <AlertTriangle className="h-4 w-4 text-amber-600" />
                          <div className="text-sm text-amber-800">
                            Medication name, dosage, and frequency are required fields.
                          </div>
                        </Alert>
                      )}

                      {/* Separator between records - matching Insurance pattern */}
                      {index < medications.length - 1 && (
                        <div className="border-t border-[var(--border)] mt-6" />
                      )}
                    </div>
                  ))}

                  {/* Add Another Medication Button - matching Insurance pattern */}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      addMedication()
                      // Focus the first input of the new medication after DOM update
                      setTimeout(() => {
                        const newMedIndex = medications.length
                        const newMedId = medications[newMedIndex - 1]?.id
                        if (newMedId) {
                          const firstInput = document.getElementById(`med-name-${newMedId}`)
                          if (firstInput) {
                            firstInput.focus()
                            // Scroll the new medication into view
                            firstInput.scrollIntoView({ behavior: 'smooth', block: 'center' })
                          }
                        }
                      }, 100)
                    }}
                    className="w-full bg-[var(--muted)] hover:bg-[var(--muted)]/80"
                    aria-label="Add another medication record"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Medication
                  </Button>

                  {/* Allergies & Reactions Section - shown when hasMedications === 'Yes' */}
                  {allergies.length > 0 && (
                    <>
                      <div className="mt-8 mb-4">
                        <h3 className="text-lg font-medium text-[var(--foreground)]">
                          Allergies & Reactions
                        </h3>
                        <p className="text-sm text-[var(--muted-foreground)] mt-1">
                          Document any known allergies and their reactions
                        </p>
                      </div>

                      {/* Allergies List */}
                      {allergies.map((allergy, index) => (
                        <div key={allergy.id} className="space-y-4">
                          {/* Allergy Header with title and remove button */}
                          {(allergies.length > 1 || index > 0) && (
                            <div className="flex justify-between items-center pb-2">
                              <h4
                                id={`allergy-${allergy.id}-heading`}
                                className="text-md font-medium text-[var(--foreground)]"
                              >
                                Allergy {index + 1}
                              </h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeAllergy(allergy.id)
                                }}
                                aria-label={`Remove allergy ${index + 1}`}
                                className="text-[var(--destructive)]"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}

                          {/* Allergy Fields Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-labelledby={allergies.length > 1 ? `allergy-${allergy.id}-heading` : undefined}>
                            {/* Column 1 */}
                            {/* Allergen */}
                            <div className="space-y-2">
                              <Label htmlFor={`allergy-allergen-${allergy.id}`}>
                                Allergen<span className="text-[var(--destructive)]">*</span>
                              </Label>
                              <Input
                                id={`allergy-allergen-${allergy.id}`}
                                type="text"
                                value={allergy.allergen}
                                onChange={(e) => {
                                  const value = e.target.value
                                  if (value.length <= 200) {
                                    updateAllergy(allergy.id, 'allergen', value)
                                  }
                                }}
                                maxLength={200}
                                placeholder="e.g., Penicillin, Peanuts"
                                className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                                aria-required="true"
                                aria-invalid={!!allergyErrors[allergy.id]?.allergen}
                                aria-describedby={allergyErrors[allergy.id]?.allergen ? `allergy-allergen-error-${allergy.id}` : undefined}
                              />
                              {allergyErrors[allergy.id]?.allergen && (
                                <p id={`allergy-allergen-error-${allergy.id}`} className="text-sm text-[var(--destructive)]" role="alert">
                                  {allergyErrors[allergy.id].allergen}
                                </p>
                              )}
                            </div>

                            {/* Column 2 */}
                            {/* Reaction */}
                            <div className="space-y-2">
                              <Label htmlFor={`allergy-reaction-${allergy.id}`}>
                                Reaction<span className="text-[var(--destructive)]">*</span>
                              </Label>
                              <Input
                                id={`allergy-reaction-${allergy.id}`}
                                type="text"
                                value={allergy.reaction}
                                onChange={(e) => {
                                  const value = e.target.value
                                  if (value.length <= 200) {
                                    updateAllergy(allergy.id, 'reaction', value)
                                  }
                                }}
                                maxLength={200}
                                placeholder="e.g., Hives, Difficulty breathing"
                                className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                                aria-required="true"
                                aria-invalid={!!allergyErrors[allergy.id]?.reaction}
                                aria-describedby={allergyErrors[allergy.id]?.reaction ? `allergy-reaction-error-${allergy.id}` : undefined}
                              />
                              {allergyErrors[allergy.id]?.reaction && (
                                <p id={`allergy-reaction-error-${allergy.id}`} className="text-sm text-[var(--destructive)]" role="alert">
                                  {allergyErrors[allergy.id].reaction}
                                </p>
                              )}
                            </div>

                            {/* Severity */}
                            <div className="space-y-2">
                              <Label htmlFor={`allergy-severity-${allergy.id}`}>
                                Severity
                              </Label>
                              <Select
                                value={allergy.severity || ''}
                                onValueChange={(value) => {
                                  updateAllergy(allergy.id, 'severity', value as SeverityLevel)
                                }}
                              >
                                <SelectTrigger
                                  id={`allergy-severity-${allergy.id}`}
                                  className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                                >
                                  <SelectValue placeholder="Select severity" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value={SeverityLevel.MILD}>Mild</SelectItem>
                                  <SelectItem value={SeverityLevel.MODERATE}>Moderate</SelectItem>
                                  <SelectItem value={SeverityLevel.SEVERE}>Severe</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            {/* Onset Date */}
                            <div className="space-y-2">
                              <Label htmlFor={`allergy-onset-${allergy.id}`}>
                                Onset Date
                              </Label>
                              <DatePicker
                                id={`allergy-onset-${allergy.id}`}
                                value={allergy.onsetDate}
                                onChange={(date) => updateAllergy(allergy.id, 'onsetDate', date)}
                                placeholder="MM/DD/YYYY"
                                className="w-full"
                                maxDate={new Date()}
                              />
                            </div>

                            {/* Notes - full width */}
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor={`allergy-notes-${allergy.id}`}>
                                Additional Notes
                              </Label>
                              <Textarea
                                id={`allergy-notes-${allergy.id}`}
                                value={allergy.notes || ''}
                                onChange={(e) => {
                                  const value = e.target.value
                                  if (value.length <= 500) {
                                    updateAllergy(allergy.id, 'notes', value)
                                  }
                                }}
                                maxLength={500}
                                rows={2}
                                placeholder="Any additional information..."
                                className="w-full resize-none focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                              />
                            </div>
                          </div>

                          {/* Separator between allergy records */}
                          {index < allergies.length - 1 && (
                            <div className="border-t border-[var(--border)] mt-6" />
                          )}
                        </div>
                      ))}
                    </>
                  )}

                  {/* Add Allergy Button */}
                  <Button
                    variant="ghost"
                    onClick={() => {
                      addAllergy()
                      // Focus the first input of the new allergy after DOM update
                      setTimeout(() => {
                        const newAllergyIndex = allergies.length
                        const newAllergyId = allergies[newAllergyIndex - 1]?.id
                        if (newAllergyId) {
                          const firstInput = document.getElementById(`allergy-allergen-${newAllergyId}`)
                          if (firstInput) {
                            firstInput.focus()
                            firstInput.scrollIntoView({ behavior: 'smooth', block: 'center' })
                          }
                        }
                      }, 100)
                    }}
                    className="w-full bg-[var(--muted)] hover:bg-[var(--muted)]/80 mt-4"
                    aria-label="Add allergy record"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Allergy
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardBody>
      )}
    </Card>
  )
}

// Export validation function type for parent components
export interface CurrentMedicationsValidation {
  validate: () => boolean
  getPayload: () => Record<string, unknown>
}