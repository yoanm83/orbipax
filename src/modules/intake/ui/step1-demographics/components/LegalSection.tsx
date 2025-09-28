'use client'

import { differenceInYears } from "date-fns"
import { Shield, ChevronUp, ChevronDown } from "lucide-react"
import type { UseFormReturn } from "react-hook-form"

import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/shared/ui/primitives/Form"
import { Input } from "@/shared/ui/primitives/Input"
import { Label } from "@/shared/ui/primitives/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/primitives/Select"
import { Switch } from "@/shared/ui/primitives/Switch"
import type { DemographicsData } from "@/modules/intake/domain/schemas/demographics/demographics.schema"
// Utility function for class names
function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

interface LegalSectionProps {
  onSectionToggle: () => void
  isExpanded: boolean
  dateOfBirth?: Date | null
  form: UseFormReturn<Partial<DemographicsData>>
}

export function LegalSection({ onSectionToggle, isExpanded, dateOfBirth, form }: LegalSectionProps) {
  // Watch toggle states
  const hasLegalGuardian = form.watch('hasLegalGuardian')
  const hasPowerOfAttorney = form.watch('hasPowerOfAttorney')

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.slice(0, 10)
  }

  // Format phone for display
  const formatPhoneForDisplay = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length === 0) {return ''}
    if (numbers.length <= 3) {return numbers}
    if (numbers.length <= 6) {return `${numbers.slice(0, 3)}-${numbers.slice(3)}`}
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
  }

  // Calculate if patient is minor based on DOB
  const getAge = (dob: Date | null | undefined): number => {
    if (!dob) {return 0}
    return differenceInYears(new Date(), dob)
  }

  const age = getAge(dateOfBirth)
  const isMinor = age < 18 && age > 0

  return (
    <Card variant="elevated" className="w-full rounded-2xl @container">
      <div
        id="header-legal"
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
        aria-controls="panel-legal"
      >
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">Legal Information</h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardBody id="panel-legal" aria-labelledby="header-legal" className="p-6">
          <div className="space-y-6">
            {/* Minor Status */}
            <div className="flex items-center justify-between py-1">
              <Label className="text-[var(--muted-foreground)]">
                <span className="text-base leading-6">
                  Patient is a minor (under 18 years old)
                </span>
              </Label>
              <span className={cn(
                "px-3 py-1 rounded-full text-sm font-medium",
                "bg-[var(--muted)] text-[var(--muted-foreground)]"
              )}>
                {isMinor ? 'Yes' : 'No'}
              </span>
            </div>

            {/* Guardian Information */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="hasLegalGuardian"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between py-1">
                      <FormLabel htmlFor="hasGuardian" className="text-[var(--muted-foreground)] cursor-pointer">
                        <span className="text-base leading-6">Has Legal Guardian</span>
                      </FormLabel>
                      <FormControl>
                        <Switch
                          id="hasGuardian"
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked)
                            if (!checked) {
                              // Clear guardian info when unchecking
                              form.setValue('legalGuardianInfo', undefined)
                            }
                          }}
                          aria-invalid={!!form.formState.errors.hasLegalGuardian}
                          aria-describedby={form.formState.errors.hasLegalGuardian ? "has-guardian-error" : undefined}
                        />
                      </FormControl>
                    </div>
                    <FormMessage id="has-guardian-error" role="alert" />
                  </FormItem>
                )}
              />

              {hasLegalGuardian && (
                <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6 mt-4">
                  <FormField
                    control={form.control}
                    name="legalGuardianInfo.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Guardian Name *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter guardian's name"
                            className="min-h-11"
                            aria-invalid={!!form.formState.errors.legalGuardianInfo?.name}
                            aria-describedby={form.formState.errors.legalGuardianInfo?.name ? "guardian-name-error" : undefined}
                          />
                        </FormControl>
                        <FormMessage id="guardian-name-error" role="alert" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="legalGuardianInfo.relationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship *</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value || ''}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger
                              className="min-h-11"
                              aria-invalid={!!form.formState.errors.legalGuardianInfo?.relationship}
                              aria-describedby={form.formState.errors.legalGuardianInfo?.relationship ? "guardian-relationship-error" : undefined}
                            >
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="parent">Parent</SelectItem>
                              <SelectItem value="legal_guardian">Legal Guardian</SelectItem>
                              <SelectItem value="grandparent">Grandparent</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage id="guardian-relationship-error" role="alert" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="legalGuardianInfo.phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="(XXX) XXX-XXXX"
                            value={formatPhoneForDisplay(field.value || '')}
                            onChange={(e) => {
                              const formatted = formatPhoneNumber(e.target.value)
                              field.onChange(formatted)
                            }}
                            className="min-h-11"
                            aria-invalid={!!form.formState.errors.legalGuardianInfo?.phoneNumber}
                            aria-describedby={form.formState.errors.legalGuardianInfo?.phoneNumber ? "guardian-phone-error" : undefined}
                          />
                        </FormControl>
                        <FormMessage id="guardian-phone-error" role="alert" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="legalGuardianInfo.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Enter guardian's email"
                            className="min-h-11"
                            aria-invalid={!!form.formState.errors.legalGuardianInfo?.email}
                            aria-describedby={form.formState.errors.legalGuardianInfo?.email ? "guardian-email-error" : undefined}
                          />
                        </FormControl>
                        <FormMessage id="guardian-email-error" role="alert" />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            {/* Power of Attorney */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="hasPowerOfAttorney"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between py-1">
                      <FormLabel htmlFor="hasPOA" className="text-[var(--muted-foreground)] cursor-pointer">
                        <span className="text-base leading-6">Has Power of Attorney</span>
                      </FormLabel>
                      <FormControl>
                        <Switch
                          id="hasPOA"
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked)
                            if (!checked) {
                              // Clear POA info when unchecking
                              form.setValue('powerOfAttorneyInfo', undefined)
                            }
                          }}
                          aria-invalid={!!form.formState.errors.hasPowerOfAttorney}
                          aria-describedby={form.formState.errors.hasPowerOfAttorney ? "has-poa-error" : undefined}
                        />
                      </FormControl>
                    </div>
                    <FormMessage id="has-poa-error" role="alert" />
                  </FormItem>
                )}
              />

              {hasPowerOfAttorney && (
                <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6 mt-4">
                  <FormField
                    control={form.control}
                    name="powerOfAttorneyInfo.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>POA Name *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter POA's name"
                            className="min-h-11"
                            aria-invalid={!!form.formState.errors.powerOfAttorneyInfo?.name}
                            aria-describedby={form.formState.errors.powerOfAttorneyInfo?.name ? "poa-name-error" : undefined}
                          />
                        </FormControl>
                        <FormMessage id="poa-name-error" role="alert" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="powerOfAttorneyInfo.phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="(XXX) XXX-XXXX"
                            value={formatPhoneForDisplay(field.value || '')}
                            onChange={(e) => {
                              const formatted = formatPhoneNumber(e.target.value)
                              field.onChange(formatted)
                            }}
                            className="min-h-11"
                            aria-invalid={!!form.formState.errors.powerOfAttorneyInfo?.phoneNumber}
                            aria-describedby={form.formState.errors.powerOfAttorneyInfo?.phoneNumber ? "poa-phone-error" : undefined}
                          />
                        </FormControl>
                        <FormMessage id="poa-phone-error" role="alert" />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        </CardBody>
      )}
    </Card>
  )
} 