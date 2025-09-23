'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, ChevronUp, ChevronDown } from "lucide-react"
import { MultiSelect } from "@/components/multi-select"
import { CustomCalendar } from "@/components/ui/custom-calendar"
import { useIntakeFormStore } from "@/lib/store/intake-form-store"

interface PersonalInfoSectionProps {
  onSectionToggle: () => void
  isExpanded: boolean
}

export function PersonalInfoSection({ onSectionToggle, isExpanded }: PersonalInfoSectionProps) {
  const { personalInfo, setFormData } = useIntakeFormStore()

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
        <CardContent className="p-6">
          {/* Photo Upload */}
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
                      <span className="text-white text-4xl font-bold">
                        {getInitials(personalInfo.fullName)}
                      </span>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-sm text-gray-500">Click to add photo</span>
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
                onChange={(e) => setFormData('personalInfo', { fullName: e.target.value })}
                placeholder="Enter full name"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Date of Birth</Label>
              <CustomCalendar
                selected={personalInfo.dateOfBirth}
                onSelect={(date) => setFormData('personalInfo', { dateOfBirth: date })}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Race/Ethnicity</Label>
              <MultiSelect
                options={raceOptions}
                selected={personalInfo.races}
                onChange={(values) => setFormData('personalInfo', { races: values })}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Languages</Label>
              <MultiSelect
                options={languageOptions}
                selected={personalInfo.languages}
                onChange={(values) => setFormData('personalInfo', { languages: values })}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
} 