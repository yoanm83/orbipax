'use client'

import { useIntakeFormStore } from '@/lib/store/intake-form-store'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { MultiSelect } from "@/components/multi-select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CustomCalendar } from "@/components/ui/custom-calendar"
import { analytics } from "@/lib/analytics"
import { useEffect, useState } from "react"
import { AddressSection } from "./AddressSection"
import { ContactSection } from "./ContactSection"
import { LegalSection } from "./LegalSection"

// Type definitions for select values
type GenderIdentity = 'male' | 'female' | 'other'
type SexAssignedAtBirth = 'male' | 'female' | 'unknown'
type Ethnicity = 'hispanic' | 'not-hispanic' | 'unknown'
type CommunicationMethod = 'phone' | 'email' | 'asl' | 'visual' | 'other'
type VeteranStatus = 'yes' | 'no' | 'unknown'
type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed' | 'separated' | 'other'

// Language options
const languageOptions = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "haitian_creole", label: "Haitian Creole" },
  { value: "portuguese", label: "Portuguese" },
  { value: "french", label: "French" },
  { value: "mandarin", label: "Mandarin" },
  { value: "cantonese", label: "Cantonese" },
  { value: "vietnamese", label: "Vietnamese" },
  { value: "arabic", label: "Arabic" },
  { value: "russian", label: "Russian" },
  { value: "asl", label: "American Sign Language" },
  { value: "other", label: "Other" },
]

export function IntakeWizardStep1Demographics() {
  const { personalInfo, setFormData, currentStep } = useIntakeFormStore()
  const [expandedSections, setExpandedSections] = useState({
    personal: true,
    address: false,
    contact: false,
    legal: false
  })
  const [formState, setFormState] = useState({
    error: null as string | null,
    isValid: true,
    isLoading: false
  })

  const handleSectionToggle = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handlePersonalInfoChange = (data: Partial<typeof personalInfo>) => {
    setFormData('personalInfo', data)
  }

  // Track form errors
  useEffect(() => {
    if (formState.error) {
      analytics.trackError({
        message: formState.error,
        metadata: {
          component: 'DemographicsForm',
          formState: {
            expandedSections,
            isValid: formState.isValid,
            isLoading: formState.isLoading
          }
        }
      })
    }
  }, [formState, expandedSections])

  // Helper for photo preview
  const getInitials = (name: string) => {
    if (!name.trim()) return ""
    const names = name.trim().split(" ")
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase()
    }
    return names[0][0].toUpperCase()
  }

  return (
    <div className="flex-1 w-full p-6">
      {/* Personal Information Section */}
      <Card className="w-full rounded-2xl shadow-md mb-6">
        <div
          className="p-6 flex justify-between items-center cursor-pointer"
          onClick={() => handleSectionToggle("personal")}
        >
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Personal Information</h2>
          </div>
          {expandedSections.personal ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>

        {expandedSections.personal && (
          <CardContent className="p-6">
            {/* Member Photo Upload - Modern Version */}
            <div className="flex flex-col items-center mb-8 pb-6 border-b border-gray-100">
              <div className="relative group">
                <div
                  className={`w-36 h-36 rounded-full overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl ${
                    personalInfo.photoPreview
                      ? "ring-4 ring-blue-500 ring-offset-4 shadow-blue-200/50"
                      : personalInfo.fullName.trim()
                        ? "bg-blue-500 shadow-blue-200/50"
                        : "border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 shadow-gray-200/50"
                  }`}
                  style={{
                    boxShadow: personalInfo.photoPreview
                      ? "0 10px 25px -5px rgba(59, 130, 246, 0.3), 0 4px 6px -2px rgba(59, 130, 246, 0.1)"
                      : "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                >
                  {personalInfo.photoPreview ? (
                    <img
                      src={personalInfo.photoPreview}
                      alt="Member photo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full w-full">
                      {personalInfo.fullName.trim() ? (
                        <span className="text-white text-4xl font-bold">{getInitials(personalInfo.fullName)}</span>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                            <svg
                              className="w-6 h-6 text-blue-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-600 font-medium">Add Photo</p>
                        </div>
                      )}
                    </div>
                  )}
                  <div
                    className={`absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center transition-opacity duration-300 ${
                      personalInfo.photoPreview ? "opacity-0 group-hover:opacity-100" : "opacity-0"
                    }`}
                  >
                    <div className="text-white text-sm font-medium">Change Photo</div>
                  </div>
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handlePersonalInfoChange({ photoPreview: URL.createObjectURL(e.target.files[0]) })
                    }
                  }}
                />
              </div>

              {/* Delete button when photo is present */}
              {personalInfo.photoPreview && (
                <>
                  <button
                    type="button"
                    className="mt-2 px-4 py-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors duration-200 hover:underline"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handlePersonalInfoChange({ photoPreview: null })
                    }}
                  >
                    Remove
                  </button>
                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-xs text-gray-500">JPG, PNG (max 5MB)</p>
                  </div>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Legal Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Legal Name *</Label>
                <Input
                  id="fullName"
                  placeholder="Enter your full legal name"
                  required
                  value={personalInfo.fullName}
                  onChange={(e) => handlePersonalInfoChange({ fullName: e.target.value })}
                />
              </div>

              {/* Preferred Name */}
              <div className="space-y-2">
                <Label htmlFor="preferredName">Preferred Name or Alias</Label>
                <Input 
                  id="preferredName" 
                  placeholder="Enter your preferred name"
                  value={personalInfo.preferredName || ''}
                  onChange={(e) => handlePersonalInfoChange({ preferredName: e.target.value })}
                />
              </div>

              {/* Date of Birth */}
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !personalInfo.dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {personalInfo.dateOfBirth ? format(personalInfo.dateOfBirth, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CustomCalendar
                      mode="single"
                      selected={personalInfo.dateOfBirth}
                      onSelect={(date) => {
                        if (date) {
                          handlePersonalInfoChange({ dateOfBirth: date })
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Gender Identity */}
              <div className="space-y-2">
                <Label htmlFor="genderIdentity">Gender Identity *</Label>
                <Select
                  value={personalInfo.genderIdentity}
                  onValueChange={(value: GenderIdentity) => handlePersonalInfoChange({ genderIdentity: value })}
                >
                  <SelectTrigger id="genderIdentity">
                    <SelectValue placeholder="Select gender identity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {personalInfo.genderIdentity === "other" && (
                  <Input
                    placeholder="Please specify"
                    className="mt-2"
                    value={personalInfo.genderIdentityOther || ''}
                    onChange={(e) => handlePersonalInfoChange({ genderIdentityOther: e.target.value })}
                  />
                )}
              </div>

              {/* Sex Assigned at Birth */}
              <div className="space-y-2">
                <Label htmlFor="sexAssigned">Sex Assigned at Birth *</Label>
                <Select
                  value={personalInfo.sexAssignedAtBirth}
                  onValueChange={(value: SexAssignedAtBirth) => handlePersonalInfoChange({ sexAssignedAtBirth: value })}
                >
                  <SelectTrigger id="sexAssigned">
                    <SelectValue placeholder="Select sex assigned at birth" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Race */}
              <div className="space-y-2">
                <Label htmlFor="race">Race *</Label>
                <MultiSelect
                  options={[
                    { value: "white", label: "White" },
                    { value: "black", label: "Black or African American" },
                    { value: "asian", label: "Asian" },
                    { value: "native", label: "American Indian or Alaska Native" },
                    { value: "pacific_islander", label: "Native Hawaiian or Pacific Islander" },
                    { value: "other", label: "Other" },
                    { value: "prefer_not_to_say", label: "Prefer not to say" },
                  ]}
                  selected={personalInfo.races}
                  onChange={(values) => handlePersonalInfoChange({ races: values })}
                  placeholder="Select race(s)"
                />
              </div>

              {/* Ethnicity */}
              <div className="space-y-2">
                <Label htmlFor="ethnicity">Ethnicity *</Label>
                <Select
                  value={personalInfo.ethnicity}
                  onValueChange={(value: Ethnicity) => handlePersonalInfoChange({ ethnicity: value })}
                >
                  <SelectTrigger id="ethnicity">
                    <SelectValue placeholder="Select ethnicity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hispanic">Hispanic or Latino</SelectItem>
                    <SelectItem value="not-hispanic">Not Hispanic or Latino</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Primary Language */}
              <div className="space-y-2">
                <Label htmlFor="language">Primary Language *</Label>
                <Select
                  value={personalInfo.primaryLanguage}
                  onValueChange={(value) => handlePersonalInfoChange({ primaryLanguage: value })}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select primary language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preferred Communication Method */}
              <div className="space-y-2">
                <Label htmlFor="preferredCommunication">Preferred Communication Method *</Label>
                <Select
                  value={personalInfo.preferredCommunicationMethod}
                  onValueChange={(value: CommunicationMethod) => handlePersonalInfoChange({ preferredCommunicationMethod: value })}
                >
                  <SelectTrigger id="preferredCommunication">
                    <SelectValue placeholder="Select preferred method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="asl">ASL</SelectItem>
                    <SelectItem value="visual">Visual Aids</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {personalInfo.preferredCommunicationMethod === "other" && (
                  <Input
                    placeholder="Please specify"
                    className="mt-2"
                    value={personalInfo.preferredCommunicationOther || ''}
                    onChange={(e) => handlePersonalInfoChange({ preferredCommunicationOther: e.target.value })}
                  />
                )}
              </div>

              {/* Veteran Status */}
              <div className="space-y-2">
                <Label htmlFor="veteranStatus">Veteran Status</Label>
                <Select
                  value={personalInfo.veteranStatus}
                  onValueChange={(value: VeteranStatus) => handlePersonalInfoChange({ veteranStatus: value })}
                >
                  <SelectTrigger id="veteranStatus">
                    <SelectValue placeholder="Select veteran status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="yes">Yes</SelectItem>
                    <SelectItem value="no">No</SelectItem>
                    <SelectItem value="unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Marital Status */}
              <div className="space-y-2">
                <Label htmlFor="maritalStatus">Marital Status</Label>
                <Select
                  value={personalInfo.maritalStatus}
                  onValueChange={(value: MaritalStatus) => handlePersonalInfoChange({ maritalStatus: value })}
                >
                  <SelectTrigger id="maritalStatus">
                    <SelectValue placeholder="Select marital status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single</SelectItem>
                    <SelectItem value="married">Married</SelectItem>
                    <SelectItem value="divorced">Divorced</SelectItem>
                    <SelectItem value="widowed">Widowed</SelectItem>
                    <SelectItem value="separated">Separated</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* SSN */}
              <div className="space-y-2">
                <Label htmlFor="ssn">Social Security Number *</Label>
                <Input
                  id="ssn"
                  placeholder="XXX-XX-XXXX"
                  type="password"
                  required
                  value={personalInfo.ssn || ''}
                  onChange={(e) => handlePersonalInfoChange({ ssn: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">Your SSN is securely stored and encrypted</p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Address Section */}
      <AddressSection
        onSectionToggle={() => handleSectionToggle("address")}
        isExpanded={expandedSections.address}
      />

      {/* Contact Section */}
      <ContactSection
        onSectionToggle={() => handleSectionToggle("contact")}
        isExpanded={expandedSections.contact}
      />

      {/* Legal Section */}
      <LegalSection
        onSectionToggle={() => handleSectionToggle("legal")}
        isExpanded={expandedSections.legal}
      />

      {/* Error Display */}
      {formState.error && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>{formState.error}</AlertDescription>
        </Alert>
      )}
    </div>
  )
} 