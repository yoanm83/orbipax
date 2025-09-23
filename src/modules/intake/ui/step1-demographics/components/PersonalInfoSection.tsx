'use client'

import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { Input } from "@/shared/ui/primitives/Input"
import { Label } from "@/shared/ui/primitives/label"
import { User, ChevronUp, ChevronDown } from "lucide-react"
// TODO: Replace with proper multi-select from our primitives
// TODO: Replace with proper calendar from our primitives
// TODO: Replace with server-driven form state

interface PersonalInfoSectionProps {
  onSectionToggle: () => void
  isExpanded: boolean
}

export function PersonalInfoSection({ onSectionToggle, isExpanded }: PersonalInfoSectionProps) {
  // TODO: Replace with server-driven form state
  const personalInfo = {
    fullName: '',
    dateOfBirth: null,
    gender: '',
    pronouns: '',
    languages: [],
    race: []
  }

  const handlePersonalInfoChange = (data: any) => {
    // TODO: Replace with server-driven form handling
    console.log('Personal info change:', data)
  }

  // Options for dropdowns
  const raceOptions = [
    { value: "white", label: "White" },
    { value: "black", label: "Black or African American" },
    { value: "asian", label: "Asian" },
    { value: "native", label: "American Indian or Alaska Native" },
    { value: "pacific_islander", label: "Native Hawaiian or Pacific Islander" },
    { value: "other", label: "Other" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
  ]

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
    <Card className="w-full mb-6">
      <div
        className="p-6 flex justify-between items-center cursor-pointer"
        onClick={onSectionToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Personal Information</h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardBody className="p-6">
          {/* Photo Upload */}
          <div className="flex flex-col items-center mb-8 pb-6 border-b border-border">
            <div className="relative group">
              <div
                className={`w-36 h-36 rounded-full overflow-hidden transition-all duration-300 shadow-lg hover:shadow-xl ${
                  personalInfo.photoPreview
                    ? "ring-4 ring-ring ring-offset-4 shadow-primary/20"
                    : personalInfo.fullName.trim()
                      ? "bg-primary shadow-primary/20"
                      : "border-2 border-dashed border-border bg-gradient-to-br from-secondary/50 to-secondary hover:from-secondary/70 hover:to-secondary/90 shadow-foreground/10"
                }`}
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
                      <span className="text-primary-foreground text-4xl font-bold">
                        {getInitials(personalInfo.fullName)}
                      </span>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-sm text-muted-foreground">Click to add photo</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={personalInfo.fullName}
                onChange={(e) => handlePersonalInfoChange({ fullName: e.target.value })}
                placeholder="Enter full name"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={personalInfo.dateOfBirth || ''}
                onChange={(e) => handlePersonalInfoChange({ dateOfBirth: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="race">Race/Ethnicity</Label>
              <Input
                id="race"
                placeholder="Enter race/ethnicity (TODO: Replace with multi-select)"
                value={personalInfo.race.join(', ')}
                onChange={(e) => handlePersonalInfoChange({ race: e.target.value.split(', ') })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="languages">Languages</Label>
              <Input
                id="languages"
                placeholder="Enter languages spoken (TODO: Replace with multi-select)"
                value={personalInfo.languages.join(', ')}
                onChange={(e) => handlePersonalInfoChange({ languages: e.target.value.split(', ') })}
                className="mt-1"
              />
            </div>
          </div>
        </CardBody>
      )}
    </Card>
  )
} 