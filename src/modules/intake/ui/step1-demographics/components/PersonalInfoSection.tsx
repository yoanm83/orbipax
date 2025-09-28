'use client'

import { User, ChevronUp, ChevronDown } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { DatePicker } from "@/shared/ui/primitives/DatePicker"
import { Input } from "@/shared/ui/primitives/Input"
import { Label } from "@/shared/ui/primitives/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/primitives/Select"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/shared/ui/primitives/Form"
import type { DemographicsData } from "@/modules/intake/domain/schemas/demographics/demographics.schema"

interface PersonalInfoSectionProps {
  onSectionToggle: () => void
  isExpanded: boolean
  onDOBChange?: (date: Date | null) => void
  form: UseFormReturn<Partial<DemographicsData>>
}

export function PersonalInfoSection({ onSectionToggle, isExpanded, onDOBChange, form }: PersonalInfoSectionProps) {
  // Watch firstName and lastName for avatar initials
  const firstName = form.watch('firstName')
  const lastName = form.watch('lastName')
  const fullName = `${firstName || ''} ${lastName || ''}`.trim()

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
    if (!name.trim()) {return ""}
    const names = name.trim().split(" ")
    if (names.length >= 2) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase()
    }
    return names[0][0].toUpperCase()
  }

  // Placeholder for photo (not in schema)
  const photoPreview = null

  return (
    <Card variant="elevated" className="w-full rounded-2xl @container">
      <div
        id="header-personal"
        className="py-3 px-6 flex justify-between items-center cursor-pointer min-h-[44px] hover:bg-[var(--accent)]/8 active:bg-[var(--accent)]/12 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--ring-offset-background)]"
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
        aria-controls="panel-personal"
      >
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">Personal Information</h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardBody id="panel-personal" aria-labelledby="header-personal" className="p-6">
          {/* Photo Upload */}
          <div className="flex flex-col items-center mb-8 pb-6 border-b border-border">
            <div className="relative group">
              <div
                className={`w-36 h-36 rounded-full overflow-hidden transition-all duration-300 ${
                  photoPreview
                    ? "ring-4 ring-[var(--ring)] ring-offset-4"
                    : fullName.trim()
                      ? "bg-[var(--primary)]"
                      : "border-2 border-dashed border-[var(--border)] bg-[var(--secondary)]/50"
                }`}
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Member photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full">
                    {fullName.trim() ? (
                      <span className="text-[var(--primary-foreground)] text-2xl font-bold">
                        {getInitials(fullName)}
                      </span>
                    ) : (
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-[var(--muted-foreground)]">Click to add photo</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Fields - All 12 fields as per Legacy */}
          <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
            {/* Field 1: First Name */}
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your first name"
                      aria-invalid={!!form.formState.errors.firstName}
                      aria-describedby={form.formState.errors.firstName ? "firstName-error" : undefined}
                    />
                  </FormControl>
                  <FormMessage id="firstName-error" role="alert" />
                </FormItem>
              )}
            />

            {/* Field 2: Last Name */}
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your last name"
                      aria-invalid={!!form.formState.errors.lastName}
                      aria-describedby={form.formState.errors.lastName ? "lastName-error" : undefined}
                    />
                  </FormControl>
                  <FormMessage id="lastName-error" role="alert" />
                </FormItem>
              )}
            />

            {/* Field 3: Date of Birth */}
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth *</FormLabel>
                  <FormControl>
                    <DatePicker
                      date={field.value || undefined}
                      onSelect={(date) => {
                        field.onChange(date || null)
                        onDOBChange?.(date || null)
                      }}
                      placeholder="Select date"
                      maxDate={(() => {
                        const today = new Date();
                        today.setHours(23, 59, 59, 999);
                        return today;
                      })()}
                      minDate={new Date('1900-01-01')}
                      aria-invalid={!!form.formState.errors.dateOfBirth}
                      aria-describedby={form.formState.errors.dateOfBirth ? "dob-error" : undefined}
                    />
                  </FormControl>
                  <FormMessage id="dob-error" role="alert" />
                </FormItem>
              )}
            />

            {/* Field 4: Gender */}
            <FormField
              control={form.control}
              name="genderIdentity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender *</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ''}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        aria-invalid={!!form.formState.errors.genderIdentity}
                        aria-describedby={form.formState.errors.genderIdentity ? "gender-error" : undefined}
                      >
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage id="gender-error" role="alert" />
                </FormItem>
              )}
            />

            {/* Field 5: Race - TODO: Make multi-select */}
            <FormField
              control={form.control}
              name="race"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Race</FormLabel>
                  <FormControl>
                    <Select
                      value={Array.isArray(field.value) ? field.value[0] || '' : field.value || ''}
                      onValueChange={(value) => field.onChange([value])}
                    >
                      <SelectTrigger
                        aria-invalid={!!form.formState.errors.race}
                        aria-describedby={form.formState.errors.race ? "race-error" : undefined}
                      >
                        <SelectValue placeholder="Select race" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="black-african-american">Black or African American</SelectItem>
                        <SelectItem value="asian">Asian</SelectItem>
                        <SelectItem value="american-indian-alaska-native">American Indian or Alaska Native</SelectItem>
                        <SelectItem value="native-hawaiian-pacific-islander">Native Hawaiian or Pacific Islander</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage id="race-error" role="alert" />
                </FormItem>
              )}
            />

            {/* Field 6: Ethnicity */}
            <FormField
              control={form.control}
              name="ethnicity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ethnicity</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ''}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        aria-invalid={!!form.formState.errors.ethnicity}
                        aria-describedby={form.formState.errors.ethnicity ? "ethnicity-error" : undefined}
                      >
                        <SelectValue placeholder="Select ethnicity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hispanic-latino">Hispanic or Latino</SelectItem>
                        <SelectItem value="not-hispanic-latino">Not Hispanic or Latino</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage id="ethnicity-error" role="alert" />
                </FormItem>
              )}
            />

            {/* Field 7: Primary Language */}
            <FormField
              control={form.control}
              name="primaryLanguage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Language</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ''}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        aria-invalid={!!form.formState.errors.primaryLanguage}
                        aria-describedby={form.formState.errors.primaryLanguage ? "language-error" : undefined}
                      >
                        <SelectValue placeholder="Select primary language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="pt">Portuguese</SelectItem>
                        <SelectItem value="zh">Mandarin</SelectItem>
                        <SelectItem value="ar">Arabic</SelectItem>
                        <SelectItem value="vi">Vietnamese</SelectItem>
                        <SelectItem value="tl">Tagalog</SelectItem>
                        <SelectItem value="ko">Korean</SelectItem>
                        <SelectItem value="ru">Russian</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage id="language-error" role="alert" />
                </FormItem>
              )}
            />


            {/* Field 9: Veteran Status */}
            <FormField
              control={form.control}
              name="veteranStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Veteran Status</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ''}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        aria-invalid={!!form.formState.errors.veteranStatus}
                        aria-describedby={form.formState.errors.veteranStatus ? "veteran-error" : undefined}
                      >
                        <SelectValue placeholder="Select veteran status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="veteran">Veteran</SelectItem>
                        <SelectItem value="not-veteran">Not Veteran</SelectItem>
                        <SelectItem value="active-duty">Active Duty</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage id="veteran-error" role="alert" />
                </FormItem>
              )}
            />

            {/* Field 10: Marital Status */}
            <FormField
              control={form.control}
              name="maritalStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Marital Status</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ''}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        aria-invalid={!!form.formState.errors.maritalStatus}
                        aria-describedby={form.formState.errors.maritalStatus ? "marital-error" : undefined}
                      >
                        <SelectValue placeholder="Select marital status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single</SelectItem>
                        <SelectItem value="married">Married</SelectItem>
                        <SelectItem value="divorced">Divorced</SelectItem>
                        <SelectItem value="widowed">Widowed</SelectItem>
                        <SelectItem value="separated">Separated</SelectItem>
                        <SelectItem value="domestic-partner">Domestic Partner</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage id="marital-error" role="alert" />
                </FormItem>
              )}
            />

          </div>
        </CardBody>
      )}
    </Card>
  )
} 