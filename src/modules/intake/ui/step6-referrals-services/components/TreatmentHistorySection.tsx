'use client'

import { History, ChevronUp, ChevronDown, Plus, Trash2 } from "lucide-react"
import { useState, useMemo } from "react"

import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { Label } from "@/shared/ui/primitives/label"
import { Input } from "@/shared/ui/primitives/Input"
import { Textarea } from "@/shared/ui/primitives/Textarea"
import { Button } from "@/shared/ui/primitives/Button"
import { DatePicker } from "@/shared/ui/primitives/DatePicker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/shared/ui/primitives/Select"

interface PreviousProvider {
  id: string
  // Provider Information
  providerName: string
  organization: string
  phone: string
  email: string
  city: string
  state: string
  // Treatment Details
  startDate?: Date
  endDate?: Date
  levelOfCare: string
  lastVisitDate?: Date
  // Reason/Diagnosis
  reasonForTreatment: string
  diagnosis: string
  // Care Coordination
  roiOnFile: string
  roiDate?: Date
}

interface Hospitalization {
  id: string
  facilityName: string
  city: string
  state: string
  admissionDate?: Date
  dischargeDate?: Date
  levelOfCare: string
  reason: string
  notes: string
}

interface PastDiagnosis {
  id: string
  diagnosisLabel: string
  clinicalStatus: string
  treated: string
  onsetDate?: Date
  resolutionDate?: Date
  notes: string
}

interface TreatmentHistorySectionProps {
  onSectionToggle?: () => void
  isExpanded?: boolean
}

/**
 * Treatment History Section
 * Collects structured information about past mental health treatment
 * UI Only - No validation or store connection yet
 */
export function TreatmentHistorySection({
  onSectionToggle,
  isExpanded: externalIsExpanded
}: TreatmentHistorySectionProps) {
  // Generate unique section ID for ARIA
  const sectionUid = useMemo(() => `treatment_history_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, [])

  // Local state for form fields (will be moved to store later)
  const [hasPreviousTreatment, setHasPreviousTreatment] = useState<string>('')
  const [previousProviders, setPreviousProviders] = useState<PreviousProvider[]>([])
  const [wasHospitalized, setWasHospitalized] = useState<string>('')
  const [hospitalizations, setHospitalizations] = useState<Hospitalization[]>([])
  const [pastDiagnosesList, setPastDiagnosesList] = useState<PastDiagnosis[]>([])

  // Use external expanded state if provided, otherwise manage locally
  const [localIsExpanded, setLocalIsExpanded] = useState(true)
  const isExpanded = externalIsExpanded ?? localIsExpanded
  const handleToggle = onSectionToggle ?? (() => setLocalIsExpanded(!localIsExpanded))

  // Add a new provider
  const addProvider = () => {
    const newProvider: PreviousProvider = {
      id: `provider_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      providerName: '',
      organization: '',
      phone: '',
      email: '',
      city: '',
      state: '',
      levelOfCare: '',
      reasonForTreatment: '',
      diagnosis: '',
      roiOnFile: '',
    }
    setPreviousProviders([...previousProviders, newProvider])
  }

  // Remove a provider
  const removeProvider = (id: string) => {
    setPreviousProviders(previousProviders.filter(p => p.id !== id))
  }

  // Update a provider field
  const updateProvider = (id: string, field: keyof PreviousProvider, value: any) => {
    setPreviousProviders(previousProviders.map(provider =>
      provider.id === id ? { ...provider, [field]: value } : provider
    ))
  }

  // Add a new hospitalization
  const addHospitalization = () => {
    const newHospitalization: Hospitalization = {
      id: `hosp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      facilityName: '',
      city: '',
      state: '',
      levelOfCare: '',
      reason: '',
      notes: ''
    }
    setHospitalizations([...hospitalizations, newHospitalization])
  }

  // Remove a hospitalization
  const removeHospitalization = (id: string) => {
    setHospitalizations(hospitalizations.filter(h => h.id !== id))
  }

  // Update a hospitalization field
  const updateHospitalization = (id: string, field: keyof Hospitalization, value: any) => {
    setHospitalizations(hospitalizations.map(hosp =>
      hosp.id === id ? { ...hosp, [field]: value } : hosp
    ))
  }

  // Add a new past diagnosis
  const addPastDiagnosis = () => {
    const newDiagnosis: PastDiagnosis = {
      id: `diagnosis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      diagnosisLabel: '',
      clinicalStatus: '',
      treated: '',
      notes: ''
    }
    setPastDiagnosesList([...pastDiagnosesList, newDiagnosis])
  }

  // Remove a past diagnosis
  const removePastDiagnosis = (id: string) => {
    setPastDiagnosesList(pastDiagnosesList.filter(d => d.id !== id))
  }

  // Update a past diagnosis field
  const updatePastDiagnosis = (id: string, field: keyof PastDiagnosis, value: any) => {
    setPastDiagnosesList(pastDiagnosesList.map(diagnosis =>
      diagnosis.id === id ? { ...diagnosis, [field]: value } : diagnosis
    ))
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
          <History className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">
            Treatment History
          </h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardBody id={`${sectionUid}-panel`} aria-labelledby={`${sectionUid}-header`} className="p-6">
          <div className="space-y-6">
            {/* Primary Question */}
            <div className="space-y-2">
              <Label htmlFor={`${sectionUid}-has-treatment`}>
                Has the client received mental health treatment in the past?
              </Label>
              <Select
                value={hasPreviousTreatment}
                onValueChange={setHasPreviousTreatment}
              >
                <SelectTrigger
                  id={`${sectionUid}-has-treatment`}
                  className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                  aria-label="Previous treatment status"
                >
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="Unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Conditional Fields - shown when hasPreviousTreatment === 'Yes' */}
            {hasPreviousTreatment === 'Yes' && (
              <>
                <div className="border-t border-[var(--border)] pt-6 mt-6">
                  <h3 className="text-md font-medium text-[var(--foreground)] mb-4">
                    Previous Treatment Details
                  </h3>

                  <div className="space-y-6">
                    {/* Previous Providers FieldArray */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label>
                          Previous Providers<span className="text-[var(--destructive)]">*</span>
                        </Label>
                      </div>

                      {/* Providers List */}
                      {previousProviders.map((provider, index) => (
                        <div key={provider.id} className="space-y-4">
                          {/* Provider Header with Remove button */}
                          {(previousProviders.length > 1 || index > 0) && (
                            <div className="flex justify-between items-center pb-2">
                              <h4
                                id={`provider-${provider.id}-heading`}
                                className="text-md font-medium text-[var(--foreground)]"
                              >
                                Provider {index + 1}
                              </h4>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeProvider(provider.id)
                                }}
                                aria-label={`Remove provider ${index + 1}`}
                                className="text-[var(--destructive)]"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}

                          {/* Provider Fields Grid */}
                          <div className="space-y-4 p-4 bg-[var(--muted)]/10 rounded-lg">
                            {/* Provider Information Section */}
                            <div>
                              <h5 className="text-sm font-medium text-[var(--muted-foreground)] mb-3">Provider Information</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Provider Name */}
                                <div className="space-y-2">
                                  <Label htmlFor={`provider-name-${provider.id}`}>
                                    Provider Name
                                  </Label>
                                  <Input
                                    id={`provider-name-${provider.id}`}
                                    type="text"
                                    value={provider.providerName}
                                    onChange={(e) => updateProvider(provider.id, 'providerName', e.target.value)}
                                    placeholder="Enter provider name"
                                    className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                                  />
                                </div>

                                {/* Organization */}
                                <div className="space-y-2">
                                  <Label htmlFor={`organization-${provider.id}`}>
                                    Organization
                                  </Label>
                                  <Input
                                    id={`organization-${provider.id}`}
                                    type="text"
                                    value={provider.organization}
                                    onChange={(e) => updateProvider(provider.id, 'organization', e.target.value)}
                                    placeholder="Enter organization name"
                                    className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                                  />
                                </div>

                                {/* Phone */}
                                <div className="space-y-2">
                                  <Label htmlFor={`phone-${provider.id}`}>
                                    Phone
                                  </Label>
                                  <Input
                                    id={`phone-${provider.id}`}
                                    type="tel"
                                    value={provider.phone}
                                    onChange={(e) => updateProvider(provider.id, 'phone', e.target.value)}
                                    placeholder="(XXX) XXX-XXXX"
                                    className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                                  />
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                  <Label htmlFor={`email-${provider.id}`}>
                                    Email
                                  </Label>
                                  <Input
                                    id={`email-${provider.id}`}
                                    type="email"
                                    value={provider.email}
                                    onChange={(e) => updateProvider(provider.id, 'email', e.target.value)}
                                    placeholder="email@example.com"
                                    className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                                  />
                                </div>

                                {/* City */}
                                <div className="space-y-2">
                                  <Label htmlFor={`city-${provider.id}`}>
                                    City
                                  </Label>
                                  <Input
                                    id={`city-${provider.id}`}
                                    type="text"
                                    value={provider.city}
                                    onChange={(e) => updateProvider(provider.id, 'city', e.target.value)}
                                    placeholder="Enter city"
                                    className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                                  />
                                </div>

                                {/* State */}
                                <div className="space-y-2">
                                  <Label htmlFor={`state-${provider.id}`}>
                                    State
                                  </Label>
                                  <Input
                                    id={`state-${provider.id}`}
                                    type="text"
                                    value={provider.state}
                                    onChange={(e) => updateProvider(provider.id, 'state', e.target.value)}
                                    placeholder="Enter state"
                                    className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Treatment Details Section */}
                            <div>
                              <h5 className="text-sm font-medium text-[var(--muted-foreground)] mb-3">Treatment Details</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Start Date */}
                                <div className="space-y-2">
                                  <Label htmlFor={`start-date-${provider.id}`}>
                                    Start Date
                                  </Label>
                                  <DatePicker
                                    id={`start-date-${provider.id}`}
                                    value={provider.startDate}
                                    onChange={(date) => updateProvider(provider.id, 'startDate', date)}
                                    placeholder="MM/DD/YYYY"
                                    className="w-full"
                                    maxDate={new Date()}
                                  />
                                </div>

                                {/* End Date */}
                                <div className="space-y-2">
                                  <Label htmlFor={`end-date-${provider.id}`}>
                                    End Date
                                  </Label>
                                  <DatePicker
                                    id={`end-date-${provider.id}`}
                                    value={provider.endDate}
                                    onChange={(date) => updateProvider(provider.id, 'endDate', date)}
                                    placeholder="MM/DD/YYYY"
                                    className="w-full"
                                    maxDate={new Date()}
                                  />
                                </div>

                                {/* Level of Care */}
                                <div className="space-y-2">
                                  <Label htmlFor={`level-care-${provider.id}`}>
                                    Level of Care
                                  </Label>
                                  <Select
                                    value={provider.levelOfCare}
                                    onValueChange={(value) => updateProvider(provider.id, 'levelOfCare', value)}
                                  >
                                    <SelectTrigger
                                      id={`level-care-${provider.id}`}
                                      className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                                    >
                                      <SelectValue placeholder="Select level of care" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="outpatient">Outpatient</SelectItem>
                                      <SelectItem value="inpatient">Inpatient</SelectItem>
                                      <SelectItem value="iop-php">IOP/PHP</SelectItem>
                                      <SelectItem value="telehealth">Telehealth</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Last Visit Date */}
                                <div className="space-y-2">
                                  <Label htmlFor={`last-visit-${provider.id}`}>
                                    Last Visit Date
                                  </Label>
                                  <DatePicker
                                    id={`last-visit-${provider.id}`}
                                    value={provider.lastVisitDate}
                                    onChange={(date) => updateProvider(provider.id, 'lastVisitDate', date)}
                                    placeholder="MM/DD/YYYY"
                                    className="w-full"
                                    maxDate={new Date()}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Reason/Diagnosis Section */}
                            <div>
                              <h5 className="text-sm font-medium text-[var(--muted-foreground)] mb-3">Reason & Diagnosis</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Reason for Treatment */}
                                <div className="space-y-2">
                                  <Label htmlFor={`reason-${provider.id}`}>
                                    Reason for Treatment
                                  </Label>
                                  <Select
                                    value={provider.reasonForTreatment}
                                    onValueChange={(value) => updateProvider(provider.id, 'reasonForTreatment', value)}
                                  >
                                    <SelectTrigger
                                      id={`reason-${provider.id}`}
                                      className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                                    >
                                      <SelectValue placeholder="Select reason" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="depression">Depression</SelectItem>
                                      <SelectItem value="anxiety">Anxiety</SelectItem>
                                      <SelectItem value="trauma">Trauma/PTSD</SelectItem>
                                      <SelectItem value="substance">Substance Use</SelectItem>
                                      <SelectItem value="behavioral">Behavioral Issues</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* Diagnosis */}
                                <div className="space-y-2">
                                  <Label htmlFor={`diagnosis-${provider.id}`}>
                                    Diagnosis (Optional)
                                  </Label>
                                  <Input
                                    id={`diagnosis-${provider.id}`}
                                    type="text"
                                    value={provider.diagnosis}
                                    onChange={(e) => updateProvider(provider.id, 'diagnosis', e.target.value)}
                                    placeholder="Enter diagnosis"
                                    className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Care Coordination Section */}
                            <div>
                              <h5 className="text-sm font-medium text-[var(--muted-foreground)] mb-3">Care Coordination</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* ROI on File */}
                                <div className="space-y-2">
                                  <Label htmlFor={`roi-${provider.id}`}>
                                    ROI on File?
                                  </Label>
                                  <Select
                                    value={provider.roiOnFile}
                                    onValueChange={(value) => updateProvider(provider.id, 'roiOnFile', value)}
                                  >
                                    <SelectTrigger
                                      id={`roi-${provider.id}`}
                                      className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                                    >
                                      <SelectValue placeholder="Select option" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Yes">Yes</SelectItem>
                                      <SelectItem value="No">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {/* ROI Date - conditional */}
                                {provider.roiOnFile === 'Yes' && (
                                  <div className="space-y-2">
                                    <Label htmlFor={`roi-date-${provider.id}`}>
                                      ROI Date
                                    </Label>
                                    <DatePicker
                                      id={`roi-date-${provider.id}`}
                                      value={provider.roiDate}
                                      onChange={(date) => updateProvider(provider.id, 'roiDate', date)}
                                      placeholder="MM/DD/YYYY"
                                      className="w-full"
                                      maxDate={new Date()}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Separator between providers */}
                          {index < previousProviders.length - 1 && (
                            <div className="border-t border-[var(--border)] mt-6" />
                          )}
                        </div>
                      ))}

                      {/* Add Previous Provider Button */}
                      <Button
                        variant="ghost"
                        onClick={() => {
                          addProvider()
                          // Focus the first input of the new provider after DOM update
                          setTimeout(() => {
                            const newProviderIndex = previousProviders.length
                            const newProviderId = previousProviders[newProviderIndex - 1]?.id
                            if (newProviderId) {
                              const firstInput = document.getElementById(`provider-name-${newProviderId}`)
                              if (firstInput) {
                                firstInput.focus()
                                firstInput.scrollIntoView({ behavior: 'smooth', block: 'center' })
                              }
                            }
                          }, 100)
                        }}
                        className="w-full bg-[var(--muted)] hover:bg-[var(--muted)]/80"
                        aria-label="Add previous provider record"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Previous Provider
                      </Button>
                    </div>

                    {/* Was Hospitalized */}
                    <div className="space-y-2">
                      <Label htmlFor={`${sectionUid}-hospitalized`}>
                        Was the client ever hospitalized for mental health reasons?
                      </Label>
                      <Select
                        value={wasHospitalized}
                        onValueChange={setWasHospitalized}
                      >
                        <SelectTrigger
                          id={`${sectionUid}-hospitalized`}
                          className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                          aria-label="Hospitalization status"
                        >
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                          <SelectItem value="Unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Hospitalizations FieldArray - shown when wasHospitalized === 'Yes' */}
                    {wasHospitalized === 'Yes' && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <Label>
                            Hospitalizations
                          </Label>
                        </div>

                        {/* Hospitalizations List */}
                        {hospitalizations.map((hosp, index) => (
                          <div key={hosp.id} className="space-y-4">
                            {/* Hospitalization Header with Remove button */}
                            <div className="flex justify-between items-center pb-2">
                              <h4
                                id={`hosp-${hosp.id}-heading`}
                                className="text-md font-medium text-[var(--foreground)]"
                              >
                                Hospitalization {index + 1}
                              </h4>
                              {(hospitalizations.length > 1 || index > 0) && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    removeHospitalization(hosp.id)
                                  }}
                                  aria-label={`Remove hospitalization ${index + 1}`}
                                  className="hover:bg-[var(--destructive)]/10"
                                >
                                  <Trash2 className="h-4 w-4 text-[var(--destructive)]" />
                                </Button>
                              )}
                            </div>

                            {/* Hospitalization Fields Grid */}
                            <div className="space-y-4 p-4 bg-[var(--muted)]/10 rounded-lg" role="group" aria-labelledby={`hosp-${hosp.id}-heading`}>
                              {/* Facility Information */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Facility Name */}
                                <div className="space-y-2">
                                  <Label htmlFor={`facility-name-${hosp.id}`}>
                                    Facility Name
                                  </Label>
                                  <Input
                                    id={`facility-name-${hosp.id}`}
                                    type="text"
                                    value={hosp.facilityName}
                                    onChange={(e) => updateHospitalization(hosp.id, 'facilityName', e.target.value)}
                                    placeholder="Enter facility name"
                                    className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                                  />
                                </div>

                                {/* City */}
                                <div className="space-y-2">
                                  <Label htmlFor={`hosp-city-${hosp.id}`}>
                                    City
                                  </Label>
                                  <Input
                                    id={`hosp-city-${hosp.id}`}
                                    type="text"
                                    value={hosp.city}
                                    onChange={(e) => updateHospitalization(hosp.id, 'city', e.target.value)}
                                    placeholder="Enter city"
                                    className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                                  />
                                </div>

                                {/* State */}
                                <div className="space-y-2">
                                  <Label htmlFor={`hosp-state-${hosp.id}`}>
                                    State
                                  </Label>
                                  <Input
                                    id={`hosp-state-${hosp.id}`}
                                    type="text"
                                    value={hosp.state}
                                    onChange={(e) => {
                                      const value = e.target.value.toUpperCase()
                                      if (value.length <= 2) {
                                        updateHospitalization(hosp.id, 'state', value)
                                      }
                                    }}
                                    placeholder="XX"
                                    maxLength={2}
                                    className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                                  />
                                </div>

                                {/* Level of Care */}
                                <div className="space-y-2">
                                  <Label htmlFor={`hosp-level-care-${hosp.id}`}>
                                    Level of Care
                                  </Label>
                                  <Select
                                    value={hosp.levelOfCare}
                                    onValueChange={(value) => updateHospitalization(hosp.id, 'levelOfCare', value)}
                                  >
                                    <SelectTrigger
                                      id={`hosp-level-care-${hosp.id}`}
                                      className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                                    >
                                      <SelectValue placeholder="Select level of care" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="inpatient">Inpatient</SelectItem>
                                      <SelectItem value="emergency">Emergency</SelectItem>
                                      <SelectItem value="iop-php">IOP/PHP</SelectItem>
                                      <SelectItem value="telehealth">Telehealth</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {/* Dates and Reason */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Admission Date */}
                                <div className="space-y-2">
                                  <Label htmlFor={`admission-date-${hosp.id}`}>
                                    Admission Date
                                  </Label>
                                  <DatePicker
                                    id={`admission-date-${hosp.id}`}
                                    value={hosp.admissionDate}
                                    onChange={(date) => updateHospitalization(hosp.id, 'admissionDate', date)}
                                    placeholder="MM/DD/YYYY"
                                    className="w-full"
                                    maxDate={new Date()}
                                  />
                                </div>

                                {/* Discharge Date */}
                                <div className="space-y-2">
                                  <Label htmlFor={`discharge-date-${hosp.id}`}>
                                    Discharge Date
                                  </Label>
                                  <DatePicker
                                    id={`discharge-date-${hosp.id}`}
                                    value={hosp.dischargeDate}
                                    onChange={(date) => updateHospitalization(hosp.id, 'dischargeDate', date)}
                                    placeholder="MM/DD/YYYY"
                                    className="w-full"
                                    maxDate={new Date()}
                                  />
                                </div>

                                {/* Reason for Hospitalization */}
                                <div className="space-y-2 md:col-span-2">
                                  <Label htmlFor={`hosp-reason-${hosp.id}`}>
                                    Reason for Hospitalization
                                  </Label>
                                  <Input
                                    id={`hosp-reason-${hosp.id}`}
                                    type="text"
                                    value={hosp.reason}
                                    onChange={(e) => updateHospitalization(hosp.id, 'reason', e.target.value)}
                                    placeholder="Enter reason for hospitalization"
                                    className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                                  />
                                </div>
                              </div>

                              {/* Notes */}
                              <div className="space-y-2">
                                <Label htmlFor={`hosp-notes-${hosp.id}`}>
                                  Additional Notes
                                </Label>
                                <Textarea
                                  id={`hosp-notes-${hosp.id}`}
                                  value={hosp.notes}
                                  onChange={(e) => {
                                    const value = e.target.value
                                    if (value.length <= 300) {
                                      updateHospitalization(hosp.id, 'notes', value)
                                    }
                                  }}
                                  placeholder="Any additional information"
                                  rows={2}
                                  maxLength={300}
                                  className="w-full resize-none focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                                />
                                <p className="text-sm text-[var(--muted-foreground)]">
                                  {hosp.notes.length}/300 characters
                                </p>
                              </div>
                            </div>

                            {/* Separator between hospitalizations */}
                            {index < hospitalizations.length - 1 && (
                              <div className="border-t border-[var(--border)] mt-4" />
                            )}
                          </div>
                        ))}

                        {/* Add Hospitalization Button */}
                        <Button
                          variant="ghost"
                          onClick={() => {
                            addHospitalization()
                            // Focus the first input of the new hospitalization after DOM update
                            setTimeout(() => {
                              const newHospIndex = hospitalizations.length
                              const newHospId = hospitalizations[newHospIndex - 1]?.id
                              if (newHospId) {
                                const firstInput = document.getElementById(`facility-name-${newHospId}`)
                                if (firstInput) {
                                  firstInput.focus()
                                  firstInput.scrollIntoView({ behavior: 'smooth', block: 'center' })
                                }
                              }
                            }, 100)
                          }}
                          className="w-full justify-start text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                          aria-label="Add hospitalization record"
                        >
                          <Plus className="h-4 w-4 mr-2 text-[var(--primary)]" />
                          Add Hospitalization
                        </Button>
                      </div>
                    )}

                    {/* Past Diagnoses FieldArray */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Label>
                          Past Diagnoses
                        </Label>
                      </div>

                      {/* Past Diagnoses List */}
                      {pastDiagnosesList.map((diagnosis, index) => (
                        <div key={diagnosis.id} className="space-y-4">
                          {/* Diagnosis Header with Remove button */}
                          <div className="flex justify-between items-center pb-2">
                            <h4
                              id={`diagnosis-${diagnosis.id}-heading`}
                              className="text-md font-medium text-[var(--foreground)]"
                            >
                              Diagnosis {index + 1}
                            </h4>
                            {(pastDiagnosesList.length > 1 || index > 0) && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removePastDiagnosis(diagnosis.id)
                                }}
                                aria-label={`Remove diagnosis ${index + 1}`}
                                className="hover:bg-[var(--destructive)]/10"
                              >
                                <Trash2 className="h-4 w-4 text-[var(--destructive)]" />
                              </Button>
                            )}
                          </div>

                          {/* Diagnosis Fields Grid */}
                          <div className="space-y-4 p-4 bg-[var(--muted)]/10 rounded-lg" role="group" aria-labelledby={`diagnosis-${diagnosis.id}-heading`}>
                            {/* First Row - Diagnosis and Status */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Diagnosis Label */}
                              <div className="space-y-2">
                                <Label htmlFor={`diagnosis-label-${diagnosis.id}`}>
                                  Diagnosis
                                </Label>
                                <Input
                                  id={`diagnosis-label-${diagnosis.id}`}
                                  type="text"
                                  value={diagnosis.diagnosisLabel}
                                  onChange={(e) => updatePastDiagnosis(diagnosis.id, 'diagnosisLabel', e.target.value)}
                                  placeholder="e.g., Major Depressive Disorder"
                                  className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                                />
                              </div>

                              {/* Clinical Status */}
                              <div className="space-y-2">
                                <Label htmlFor={`clinical-status-${diagnosis.id}`}>
                                  Clinical Status
                                </Label>
                                <Select
                                  value={diagnosis.clinicalStatus}
                                  onValueChange={(value) => updatePastDiagnosis(diagnosis.id, 'clinicalStatus', value)}
                                >
                                  <SelectTrigger
                                    id={`clinical-status-${diagnosis.id}`}
                                    className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                                  >
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="recurrence">Recurrence</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {/* Second Row - Treatment Status and Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Treated */}
                              <div className="space-y-2">
                                <Label htmlFor={`treated-${diagnosis.id}`}>
                                  Treated
                                </Label>
                                <Select
                                  value={diagnosis.treated}
                                  onValueChange={(value) => updatePastDiagnosis(diagnosis.id, 'treated', value)}
                                >
                                  <SelectTrigger
                                    id={`treated-${diagnosis.id}`}
                                    className="w-full focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                                  >
                                    <SelectValue placeholder="Select option" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Yes">Yes</SelectItem>
                                    <SelectItem value="No">No</SelectItem>
                                    <SelectItem value="Unknown">Unknown</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {/* Onset Date */}
                              <div className="space-y-2">
                                <Label htmlFor={`onset-date-${diagnosis.id}`}>
                                  Onset Date
                                </Label>
                                <DatePicker
                                  id={`onset-date-${diagnosis.id}`}
                                  value={diagnosis.onsetDate}
                                  onChange={(date) => updatePastDiagnosis(diagnosis.id, 'onsetDate', date)}
                                  placeholder="MM/DD/YYYY"
                                  className="w-full"
                                  maxDate={new Date()}
                                />
                              </div>
                            </div>

                            {/* Third Row - Resolution Date and Notes */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* Resolution Date */}
                              <div className="space-y-2">
                                <Label htmlFor={`resolution-date-${diagnosis.id}`}>
                                  Resolution Date (Optional)
                                </Label>
                                <DatePicker
                                  id={`resolution-date-${diagnosis.id}`}
                                  value={diagnosis.resolutionDate}
                                  onChange={(date) => updatePastDiagnosis(diagnosis.id, 'resolutionDate', date)}
                                  placeholder="MM/DD/YYYY"
                                  className="w-full"
                                  maxDate={new Date()}
                                />
                              </div>

                              {/* Notes */}
                              <div className="space-y-2">
                                <Label htmlFor={`diagnosis-notes-${diagnosis.id}`}>
                                  Notes
                                </Label>
                                <Textarea
                                  id={`diagnosis-notes-${diagnosis.id}`}
                                  value={diagnosis.notes}
                                  onChange={(e) => {
                                    const value = e.target.value
                                    if (value.length <= 200) {
                                      updatePastDiagnosis(diagnosis.id, 'notes', value)
                                    }
                                  }}
                                  placeholder="Additional information"
                                  rows={2}
                                  maxLength={200}
                                  className="w-full resize-none focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:outline-none"
                                />
                                <p className="text-sm text-[var(--muted-foreground)]">
                                  {diagnosis.notes.length}/200 characters
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Separator between diagnoses */}
                          {index < pastDiagnosesList.length - 1 && (
                            <div className="border-t border-[var(--border)] mt-4" />
                          )}
                        </div>
                      ))}

                      {/* Add Diagnosis Button */}
                      <Button
                        variant="ghost"
                        onClick={() => {
                          addPastDiagnosis()
                          // Focus the first input of the new diagnosis after DOM update
                          setTimeout(() => {
                            const newDiagnosisIndex = pastDiagnosesList.length
                            const newDiagnosisId = pastDiagnosesList[newDiagnosisIndex - 1]?.id
                            if (newDiagnosisId) {
                              const firstInput = document.getElementById(`diagnosis-label-${newDiagnosisId}`)
                              if (firstInput) {
                                firstInput.focus()
                                firstInput.scrollIntoView({ behavior: 'smooth', block: 'center' })
                              }
                            }
                          }, 100)
                        }}
                        className="w-full justify-start text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)]/50"
                        aria-label="Add past diagnosis record"
                      >
                        <Plus className="h-4 w-4 mr-2 text-[var(--primary)]" />
                        Add Diagnosis
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Helper text for No/Unknown selection */}
            {(hasPreviousTreatment === 'No' || hasPreviousTreatment === 'Unknown') && (
              <div className="p-4 bg-[var(--muted)] rounded-lg">
                <p className="text-sm text-[var(--muted-foreground)]">
                  {hasPreviousTreatment === 'No'
                    ? "No previous treatment history recorded. You can proceed to the next section."
                    : "Treatment history is unknown. Additional assessment may be needed."}
                </p>
              </div>
            )}
          </div>
        </CardBody>
      )}
    </Card>
  )
}