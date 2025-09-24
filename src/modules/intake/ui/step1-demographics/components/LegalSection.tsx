'use client'

import { useState } from 'react'
import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { Input } from "@/shared/ui/primitives/Input"
import { Label } from "@/shared/ui/primitives/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/primitives/Select"
import { Switch } from "@/shared/ui/primitives/Switch"
import { Shield, ChevronUp, ChevronDown } from "lucide-react"
import { differenceInYears } from "date-fns"
// Utility function for class names
function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

interface LegalSectionProps {
  onSectionToggle: () => void
  isExpanded: boolean
  dateOfBirth?: Date | null
}

export function LegalSection({ onSectionToggle, isExpanded, dateOfBirth }: LegalSectionProps) {
  // State for toggles
  const [hasLegalGuardian, setHasLegalGuardian] = useState(false)
  const [hasPowerOfAttorney, setHasPowerOfAttorney] = useState(false)

  // State for form fields
  const [guardianInfo, setGuardianInfo] = useState({
    name: '',
    relationship: '',
    phone: '',
    email: ''
  })

  const [poaInfo, setPoaInfo] = useState({
    name: '',
    phone: ''
  })

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

  // Calculate if patient is minor based on DOB
  const getAge = (dob: Date | null | undefined): number => {
    if (!dob) return 0
    return differenceInYears(new Date(), dob)
  }

  const age = getAge(dateOfBirth)
  const isMinor = age < 18 && age > 0

  return (
    <Card className="w-full rounded-3xl shadow-md mb-6 @container">
      <div
        id="header-legal"
        className="py-3 px-6 flex justify-between items-center cursor-pointer min-h-[44px]"
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
              <div className="flex items-center justify-between py-1">
                <Label htmlFor="hasGuardian" className="text-[var(--muted-foreground)]">
                  <span className="text-base leading-6">Has Legal Guardian</span>
                </Label>
                <Switch
                  id="hasGuardian"
                  checked={hasLegalGuardian}
                  onCheckedChange={(checked) => {
                    setHasLegalGuardian(checked)
                    if (!checked) {
                      setGuardianInfo({ name: '', relationship: '', phone: '', email: '' })
                    }
                  }}
                />
              </div>

              {hasLegalGuardian && (
                <div className="grid grid-cols-1 @lg:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="guardianName">Guardian Name *</Label>
                    <Input
                      id="guardianName"
                      placeholder="Enter guardian's name"
                      required
                      value={guardianInfo.name}
                      onChange={(e) => setGuardianInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="min-h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guardianRelationship">Relationship *</Label>
                    <Select
                      value={guardianInfo.relationship}
                      onValueChange={(value) => setGuardianInfo(prev => ({ ...prev, relationship: value }))}
                    >
                      <SelectTrigger id="guardianRelationship" className="min-h-11">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="legal_guardian">Legal Guardian</SelectItem>
                        <SelectItem value="grandparent">Grandparent</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guardianPhone">Phone Number *</Label>
                    <Input
                      id="guardianPhone"
                      type="tel"
                      placeholder="(XXX) XXX-XXXX"
                      required
                      value={formatPhoneForDisplay(guardianInfo.phone)}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value)
                        setGuardianInfo(prev => ({ ...prev, phone: formatted }))
                      }}
                      className="min-h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guardianEmail">Email *</Label>
                    <Input
                      id="guardianEmail"
                      type="email"
                      placeholder="Enter guardian's email"
                      required
                      value={guardianInfo.email}
                      onChange={(e) => setGuardianInfo(prev => ({ ...prev, email: e.target.value }))}
                      className="min-h-11"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Power of Attorney */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-1">
                <Label htmlFor="hasPOA" className="text-[var(--muted-foreground)]">
                  <span className="text-base leading-6">Has Power of Attorney</span>
                </Label>
                <Switch
                  id="hasPOA"
                  checked={hasPowerOfAttorney}
                  onCheckedChange={(checked) => {
                    setHasPowerOfAttorney(checked)
                    if (!checked) {
                      setPoaInfo({ name: '', phone: '' })
                    }
                  }}
                />
              </div>

              {hasPowerOfAttorney && (
                <div className="grid grid-cols-1 @lg:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="poaName">POA Name *</Label>
                    <Input
                      id="poaName"
                      placeholder="Enter POA's name"
                      required
                      value={poaInfo.name}
                      onChange={(e) => setPoaInfo(prev => ({ ...prev, name: e.target.value }))}
                      className="min-h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="poaPhone">Phone Number *</Label>
                    <Input
                      id="poaPhone"
                      type="tel"
                      placeholder="(XXX) XXX-XXXX"
                      required
                      value={formatPhoneForDisplay(poaInfo.phone)}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value)
                        setPoaInfo(prev => ({ ...prev, phone: formatted }))
                      }}
                      className="min-h-11"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      )}
    </Card>
  )
} 