'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Phone, ChevronUp, ChevronDown } from "lucide-react"
import { useIntakeFormStore } from '@/lib/store/intake-form-store'

interface ContactSectionProps {
  onSectionToggle: () => void
  isExpanded: boolean
}

type ContactPreference = 'phone' | 'text' | 'email'

export function ContactSection({ onSectionToggle, isExpanded }: ContactSectionProps) {
  const { contactInfo, setFormData } = useIntakeFormStore()

  const handleContactInfoChange = (data: Partial<typeof contactInfo>) => {
    setFormData('contactInfo', data)
  }

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.slice(0, 10)
  }

  // Format phone for display
  const formatPhoneForDisplay = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length === 0) return ''
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
  }

  return (
    <Card className="w-full rounded-2xl shadow-md mb-6">
      <div
        className="p-6 flex justify-between items-center cursor-pointer"
        onClick={onSectionToggle}
      >
        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Contact Information</h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary Phone */}
            <div className="space-y-2">
              <Label htmlFor="primaryPhone">Primary Phone *</Label>
              <Input
                id="primaryPhone"
                placeholder="(XXX) XXX-XXXX"
                required
                value={formatPhoneForDisplay(contactInfo.primaryPhone)}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value)
                  handleContactInfoChange({ primaryPhone: formatted })
                }}
              />
            </div>

            {/* Alternate Phone */}
            <div className="space-y-2">
              <Label htmlFor="alternatePhone">Alternate Phone</Label>
              <Input
                id="alternatePhone"
                placeholder="(XXX) XXX-XXXX"
                value={formatPhoneForDisplay(contactInfo.alternatePhone || '')}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value)
                  handleContactInfoChange({ alternatePhone: formatted })
                }}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                required
                value={contactInfo.email}
                onChange={(e) => handleContactInfoChange({ email: e.target.value })}
              />
            </div>

            {/* Contact Preference */}
            <div className="space-y-2">
              <Label htmlFor="contactPreference">Preferred Contact Method *</Label>
              <Select
                value={contactInfo.contactPreference}
                onValueChange={(value: ContactPreference) => handleContactInfoChange({ contactPreference: value })}
              >
                <SelectTrigger id="contactPreference">
                  <SelectValue placeholder="Select preferred method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="text">Text Message</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Emergency Contact */}
            <div className="space-y-2 md:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="emergencyName">Contact Name *</Label>
                  <Input
                    id="emergencyName"
                    placeholder="Enter emergency contact name"
                    required
                    value={contactInfo.emergencyContact.name}
                    onChange={(e) => handleContactInfoChange({
                      emergencyContact: {
                        ...contactInfo.emergencyContact,
                        name: e.target.value
                      }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyRelationship">Relationship *</Label>
                  <Input
                    id="emergencyRelationship"
                    placeholder="Enter relationship"
                    required
                    value={contactInfo.emergencyContact.relationship}
                    onChange={(e) => handleContactInfoChange({
                      emergencyContact: {
                        ...contactInfo.emergencyContact,
                        relationship: e.target.value
                      }
                    })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Phone Number *</Label>
                  <Input
                    id="emergencyPhone"
                    placeholder="(XXX) XXX-XXXX"
                    required
                    value={formatPhoneForDisplay(contactInfo.emergencyContact.phone)}
                    onChange={(e) => {
                      const formatted = formatPhoneNumber(e.target.value)
                      handleContactInfoChange({
                        emergencyContact: {
                          ...contactInfo.emergencyContact,
                          phone: formatted
                        }
                      })
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
} 