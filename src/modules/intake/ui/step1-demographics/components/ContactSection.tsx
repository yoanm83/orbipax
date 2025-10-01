'use client'

import { Phone, ChevronUp, ChevronDown, Plus, X } from "lucide-react"
import { useFieldArray } from "react-hook-form"
import type { UseFormReturn } from "react-hook-form"

import { Button } from "@/shared/ui/primitives/Button"
import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { Checkbox } from "@/shared/ui/primitives/Checkbox"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/shared/ui/primitives/Form"
import { Input } from "@/shared/ui/primitives/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/primitives/Select"

import type { Demographics } from "@/modules/intake/domain/schemas/demographics/demographics.schema"

interface ContactSectionProps {
  onSectionToggle: () => void
  isExpanded: boolean
  form: UseFormReturn<Partial<Demographics>>
}

export function ContactSection({ onSectionToggle, isExpanded, form }: ContactSectionProps) {
  // Manage phone numbers array
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "phoneNumbers"
  })

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

  return (
    <Card variant="elevated" className="w-full rounded-2xl @container">
      <div
        id="header-contact"
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
        aria-controls="panel-contact"
      >
        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">Contact Information</h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardBody id="panel-contact" aria-labelledby="header-contact" className="p-6">
          <div className="space-y-6">
            {/* Phone Numbers Array */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Phone Numbers</h3>
                {fields.length < 3 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ number: '', type: 'mobile', isPrimary: fields.length === 0 })}
                    className="gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Phone
                  </Button>
                )}
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-1 @lg:grid-cols-3 gap-4 p-4 border border-border rounded-lg">
                  <FormField
                    control={form.control}
                    name={`phoneNumbers.${index}.number`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number {index === 0 ? '*' : ''}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="(XXX) XXX-XXXX"
                            value={formatPhoneForDisplay(field.value ?? '')}
                            onChange={(e) => {
                              const formatted = formatPhoneNumber(e.target.value)
                              field.onChange(formatted)
                            }}
                            aria-invalid={!!form.formState.errors.phoneNumbers?.[index]?.number}
                            aria-describedby={form.formState.errors.phoneNumbers?.[index]?.number ? `phone-${index}-error` : undefined}
                          />
                        </FormControl>
                        <FormMessage id={`phone-${index}-error`} role="alert" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`phoneNumbers.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger
                              aria-invalid={!!form.formState.errors.phoneNumbers?.[index]?.type}
                              aria-describedby={form.formState.errors.phoneNumbers?.[index]?.type ? `phone-type-${index}-error` : undefined}
                            >
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mobile">Mobile</SelectItem>
                            <SelectItem value="home">Home</SelectItem>
                            <SelectItem value="work">Work</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage id={`phone-type-${index}-error`} role="alert" />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-end gap-2">
                    <FormField
                      control={form.control}
                      name={`phoneNumbers.${index}.isPrimary`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={(checked) => {
                                // If setting as primary, unset others
                                if (checked) {
                                  fields.forEach((_, i) => {
                                    if (i !== index) {
                                      form.setValue(`phoneNumbers.${i}.isPrimary`, false)
                                    }
                                  })
                                }
                                field.onChange(checked)
                              }}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Primary</FormLabel>
                        </FormItem>
                      )}
                    />

                    {fields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        aria-label="Remove phone number"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Email */}
            <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email address"
                        aria-invalid={!!form.formState.errors.email}
                        aria-describedby={form.formState.errors.email ? "email-error" : undefined}
                      />
                    </FormControl>
                    <FormMessage id="email-error" role="alert" />
                  </FormItem>
                )}
              />

              {/* Contact Preference - TODO: Make multi-select */}
              <FormField
                control={form.control}
                name="preferredCommunicationMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Contact Method</FormLabel>
                    <FormControl>
                      <Select
                        value={Array.isArray(field.value) ? field.value[0] || '' : field.value || ''}
                        onValueChange={(value) => field.onChange([value])}
                      >
                        <SelectTrigger
                          aria-invalid={!!form.formState.errors.preferredCommunicationMethod}
                          aria-describedby={form.formState.errors.preferredCommunicationMethod ? "contact-method-error" : undefined}
                        >
                          <SelectValue placeholder="Select contact method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="phone">Phone</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="text-sms">Text/SMS</SelectItem>
                          <SelectItem value="mail">Mail</SelectItem>
                          <SelectItem value="secure-portal">Secure Portal</SelectItem>
                          <SelectItem value="in-person">In Person</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage id="contact-method-error" role="alert" />
                  </FormItem>
                )}
              />
            </div>

            {/* Emergency Contact */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Emergency Contact</h3>
              <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="emergencyContact.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter emergency contact name"
                          aria-invalid={!!form.formState.errors.emergencyContact?.name}
                          aria-describedby={form.formState.errors.emergencyContact?.name ? "emergency-name-error" : undefined}
                        />
                      </FormControl>
                      <FormMessage id="emergency-name-error" role="alert" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContact.relationship"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship *</FormLabel>
                      <Select
                        value={field.value || ''}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger
                            className="min-h-11"
                            aria-invalid={!!form.formState.errors.emergencyContact?.relationship}
                            aria-describedby={form.formState.errors.emergencyContact?.relationship ? "emergency-rel-error" : undefined}
                          >
                            <SelectValue placeholder="Select relationship" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="spouse">Spouse/Partner</SelectItem>
                          <SelectItem value="parent">Parent</SelectItem>
                          <SelectItem value="child">Child</SelectItem>
                          <SelectItem value="sibling">Sibling</SelectItem>
                          <SelectItem value="friend">Friend</SelectItem>
                          <SelectItem value="caregiver">Caregiver</SelectItem>
                          <SelectItem value="legal_guardian">Legal Guardian</SelectItem>
                          <SelectItem value="grandparent">Grandparent</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage id="emergency-rel-error" role="alert" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContact.phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="(XXX) XXX-XXXX"
                          value={formatPhoneForDisplay(field.value ?? '')}
                          onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value)
                            field.onChange(formatted)
                          }}
                          aria-invalid={!!form.formState.errors.emergencyContact?.phoneNumber}
                          aria-describedby={form.formState.errors.emergencyContact?.phoneNumber ? "emergency-phone-error" : undefined}
                        />
                      </FormControl>
                      <FormMessage id="emergency-phone-error" role="alert" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="emergencyContact.alternatePhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alternate Phone</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="(XXX) XXX-XXXX"
                          value={formatPhoneForDisplay(field.value ?? '')}
                          onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value)
                            field.onChange(formatted)
                          }}
                          aria-invalid={!!form.formState.errors.emergencyContact?.alternatePhone}
                          aria-describedby={form.formState.errors.emergencyContact?.alternatePhone ? "emergency-alt-phone-error" : undefined}
                        />
                      </FormControl>
                      <FormMessage id="emergency-alt-phone-error" role="alert" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </CardBody>
      )}
    </Card>
  )
} 