'use client'

import { useState } from "react"
import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { Input } from "@/shared/ui/primitives/Input"
import { Label } from "@/shared/ui/primitives/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/primitives/Select"
import { DatePicker } from "@/shared/ui/primitives/DatePicker"
import { User, ChevronUp, ChevronDown } from "lucide-react"
// TODO: Replace with server-driven form state

interface PersonalInfoSectionProps {
  onSectionToggle: () => void
  isExpanded: boolean
}

export function PersonalInfoSection({ onSectionToggle, isExpanded }: PersonalInfoSectionProps) {
  // TODO: Replace with server-driven form state
  const [personalInfo, setPersonalInfo] = useState<{
    fullName: string;
    firstName: string;
    lastName: string;
    preferredName: string;
    dateOfBirth: Date | null;
    genderIdentity: string;
    sexAssignedAtBirth: string;
    race: string;
    races: string[];
    ethnicity: string;
    primaryLanguage: string;
    preferredCommunication: string;
    veteranStatus: string;
    maritalStatus: string;
    ssn: string;
    photoPreview: string;
  }>({
    fullName: '',
    firstName: '',
    lastName: '',
    preferredName: '',
    dateOfBirth: null,
    genderIdentity: '',
    sexAssignedAtBirth: '',
    race: '',
    races: [],
    ethnicity: '',
    primaryLanguage: '',
    preferredCommunication: '',
    veteranStatus: '',
    maritalStatus: '',
    ssn: '',
    photoPreview: ''
  })

  const handlePersonalInfoChange = (data: any) => {
    // TODO: Replace with server-driven form handling
    setPersonalInfo(prev => ({ ...prev, ...data }))
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
    <Card className="w-full rounded-2xl shadow-md mb-6">
      <div
        className="p-6 flex justify-between items-center cursor-pointer"
        onClick={onSectionToggle}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
      >
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-primary" style={{ color: 'var(--legacy-primary)' }} />
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

          {/* Form Fields - All 12 fields as per Legacy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Field 1: First Name */}
            <div>
              <Label htmlFor="firstName" required>First Name</Label>
              <Input
                id="firstName"
                value={personalInfo.firstName}
                onChange={(e) => handlePersonalInfoChange({ firstName: e.target.value })}
                placeholder="Enter your first name"
                className="mt-1"
                required
              />
            </div>

            {/* Field 2: Last Name */}
            <div>
              <Label htmlFor="lastName" required>Last Name</Label>
              <Input
                id="lastName"
                value={personalInfo.lastName}
                onChange={(e) => handlePersonalInfoChange({ lastName: e.target.value })}
                placeholder="Enter your last name"
                className="mt-1"
                required
              />
            </div>

            {/* Field 3: Date of Birth */}
            <div>
              <Label htmlFor="dob" required>Date of Birth</Label>
              <DatePicker
                id="dob"
                date={personalInfo.dateOfBirth || undefined}
                onSelect={(date) => handlePersonalInfoChange({ dateOfBirth: date || null })}
                placeholder="Select date"
                className="mt-1"
                required
                maxDate={(() => {
                  const today = new Date();
                  today.setHours(23, 59, 59, 999);
                  return today;
                })()}
                minDate={new Date('1900-01-01')}
              />
            </div>

            {/* Field 4: Gender */}
            <div>
              <Label htmlFor="genderIdentity" required>Gender</Label>
              <Select
                value={personalInfo.genderIdentity}
                onValueChange={(value) => handlePersonalInfoChange({ genderIdentity: value })}
              >
                <SelectTrigger id="genderIdentity" className="mt-1">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-binary</SelectItem>
                  <SelectItem value="transgender-male">Transgender Male</SelectItem>
                  <SelectItem value="transgender-female">Transgender Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Field 5: Race */}
            <div>
              <Label htmlFor="race" required>Race</Label>
              <Select
                value={personalInfo.race}
                onValueChange={(value) => handlePersonalInfoChange({ race: value })}
              >
                <SelectTrigger id="race" className="mt-1">
                  <SelectValue placeholder="Select race" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="white">White</SelectItem>
                  <SelectItem value="black">Black or African American</SelectItem>
                  <SelectItem value="asian">Asian</SelectItem>
                  <SelectItem value="native">American Indian or Alaska Native</SelectItem>
                  <SelectItem value="pacific_islander">Native Hawaiian or Pacific Islander</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Field 6: Ethnicity */}
            <div>
              <Label htmlFor="ethnicity" required>Ethnicity</Label>
              <Select
                value={personalInfo.ethnicity}
                onValueChange={(value) => handlePersonalInfoChange({ ethnicity: value })}
              >
                <SelectTrigger id="ethnicity" className="mt-1">
                  <SelectValue placeholder="Select ethnicity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hispanic">Hispanic or Latino</SelectItem>
                  <SelectItem value="not-hispanic">Not Hispanic or Latino</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Field 7: Primary Language */}
            <div>
              <Label htmlFor="language" required>Primary Language</Label>
              <Select
                value={personalInfo.primaryLanguage}
                onValueChange={(value) => handlePersonalInfoChange({ primaryLanguage: value })}
              >
                <SelectTrigger id="language" className="mt-1">
                  <SelectValue placeholder="Select primary language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="spanish">Spanish</SelectItem>
                  <SelectItem value="haitian_creole">Haitian Creole</SelectItem>
                  <SelectItem value="portuguese">Portuguese</SelectItem>
                  <SelectItem value="french">French</SelectItem>
                  <SelectItem value="mandarin">Mandarin</SelectItem>
                  <SelectItem value="cantonese">Cantonese</SelectItem>
                  <SelectItem value="vietnamese">Vietnamese</SelectItem>
                  <SelectItem value="arabic">Arabic</SelectItem>
                  <SelectItem value="russian">Russian</SelectItem>
                  <SelectItem value="asl">American Sign Language</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Field 8: Preferred Communication Method */}
            <div>
              <Label htmlFor="preferredCommunication" required>Preferred Communication Method</Label>
              <Select
                value={personalInfo.preferredCommunication}
                onValueChange={(value) => handlePersonalInfoChange({ preferredCommunication: value })}
              >
                <SelectTrigger id="preferredCommunication" className="mt-1">
                  <SelectValue placeholder="Select preferred method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="text">Text Message</SelectItem>
                  <SelectItem value="mail">Mail</SelectItem>
                  <SelectItem value="in-person">In Person</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Field 9: Veteran Status */}
            <div>
              <Label htmlFor="veteranStatus">Veteran Status</Label>
              <Select
                value={personalInfo.veteranStatus}
                onValueChange={(value) => handlePersonalInfoChange({ veteranStatus: value })}
              >
                <SelectTrigger id="veteranStatus" className="mt-1">
                  <SelectValue placeholder="Select veteran status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Field 10: Marital Status */}
            <div>
              <Label htmlFor="maritalStatus">Marital Status</Label>
              <Select
                value={personalInfo.maritalStatus}
                onValueChange={(value) => handlePersonalInfoChange({ maritalStatus: value })}
              >
                <SelectTrigger id="maritalStatus" className="mt-1">
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

            {/* Field 11: Social Security Number */}
            <div>
              <Label htmlFor="ssn" required>Social Security Number</Label>
              <Input
                id="ssn"
                type="password"
                value={personalInfo.ssn}
                onChange={(e) => handlePersonalInfoChange({ ssn: e.target.value })}
                placeholder="XXX-XX-XXXX"
                className="mt-1"
                required
                maxLength={11}
              />
            </div>
          </div>
        </CardBody>
      )}
    </Card>
  )
} 