'use client'

import { Card, CardBody } from "@/shared/ui/primitives/Card"
import { Input } from "@/shared/ui/primitives/Input"
import { Label } from "@/shared/ui/primitives/label"
import { Switch } from "@/shared/ui/primitives/Switch"
import { Shield, ChevronUp, ChevronDown } from "lucide-react"
// TODO: Replace with server-driven form state
import { differenceInYears } from "date-fns"
import React from "react"
// Utility function for class names
function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

interface LegalSectionProps {
  onSectionToggle: () => void
  isExpanded: boolean
}

export function LegalSection({ onSectionToggle, isExpanded }: LegalSectionProps) {
  // TODO: Replace with server-driven form state
  const legalInfo = {
    legalName: '',
    isMinor: false,
    guardianName: '',
    guardianPhone: '',
    guardianRelationship: '',
    consentToTreat: false,
    consentToShare: false,
    consentToContact: false
  }

  const personalInfo = {
    dateOfBirth: null
  }

  const handleLegalInfoChange = (data: any) => {
    // TODO: Replace with server-driven form handling
    console.log('Legal change:', data)
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

  // Calculate if member is minor based on DOB
  const isMinor = personalInfo.dateOfBirth 
    ? differenceInYears(new Date(), personalInfo.dateOfBirth) < 18 
    : false

  // Update legal info when minor status changes
  React.useEffect(() => {
    if (legalInfo.isMinor !== isMinor) {
      handleLegalInfoChange({ isMinor })
    }
  }, [isMinor, legalInfo.isMinor])

  return (
    <Card className="w-full rounded-2xl shadow-md mb-6 @container">
      <div
        className="p-6 flex justify-between items-center cursor-pointer"
        onClick={onSectionToggle}
      >
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Legal Information</h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardBody className="p-6">
          <div className="space-y-6">
            {/* Minor Status */}
            <div className="flex items-center justify-between">
              <Label className="text-base">
                Member is a minor (under 18 years old)
              </Label>
              <span className={cn(
                "px-3 py-1 rounded-full text-base font-medium",
                isMinor 
                  ? "bg-primary/10 text-primary" 
                  : "bg-muted text-muted-foreground"
              )}>
                {isMinor ? 'Yes' : 'No'}
              </span>
            </div>

            {/* Guardian Information */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="hasGuardian" className="text-base">Has Legal Guardian</Label>
                <Switch
                  id="hasGuardian"
                  checked={legalInfo.hasGuardian}
                  onCheckedChange={(checked) => handleLegalInfoChange({ hasGuardian: checked })}
                />
              </div>

              {legalInfo.hasGuardian && (
                <div className="grid grid-cols-1 @lg:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="guardianName">Guardian Name *</Label>
                    <Input
                      id="guardianName"
                      placeholder="Enter guardian's name"
                      required
                      value={legalInfo.guardianInfo?.name || ''}
                      onChange={(e) => handleLegalInfoChange({
                        guardianInfo: {
                          ...legalInfo.guardianInfo,
                          name: e.target.value
                        }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guardianRelationship">Relationship *</Label>
                    <Input
                      id="guardianRelationship"
                      placeholder="Enter relationship"
                      required
                      value={legalInfo.guardianInfo?.relationship || ''}
                      onChange={(e) => handleLegalInfoChange({
                        guardianInfo: {
                          ...legalInfo.guardianInfo,
                          relationship: e.target.value
                        }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guardianPhone">Phone Number *</Label>
                    <Input
                      id="guardianPhone"
                      placeholder="(XXX) XXX-XXXX"
                      required
                      value={formatPhoneForDisplay(legalInfo.guardianInfo?.phone || '')}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value)
                        handleLegalInfoChange({
                          guardianInfo: {
                            ...legalInfo.guardianInfo,
                            phone: formatted
                          }
                        })
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guardianEmail">Email *</Label>
                    <Input
                      id="guardianEmail"
                      type="email"
                      placeholder="Enter guardian's email"
                      required
                      value={legalInfo.guardianInfo?.email || ''}
                      onChange={(e) => handleLegalInfoChange({
                        guardianInfo: {
                          ...legalInfo.guardianInfo,
                          email: e.target.value
                        }
                      })}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Power of Attorney */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="hasPOA" className="text-base">Has Power of Attorney</Label>
                <Switch
                  id="hasPOA"
                  checked={legalInfo.hasPOA}
                  onCheckedChange={(checked) => handleLegalInfoChange({ hasPOA: checked })}
                />
              </div>

              {legalInfo.hasPOA && (
                <div className="grid grid-cols-1 @lg:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="poaName">POA Name *</Label>
                    <Input
                      id="poaName"
                      placeholder="Enter POA's name"
                      required
                      value={legalInfo.poaInfo?.name || ''}
                      onChange={(e) => handleLegalInfoChange({
                        poaInfo: {
                          ...legalInfo.poaInfo,
                          name: e.target.value
                        }
                      })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="poaPhone">Phone Number *</Label>
                    <Input
                      id="poaPhone"
                      placeholder="(XXX) XXX-XXXX"
                      required
                      value={formatPhoneForDisplay(legalInfo.poaInfo?.phone || '')}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value)
                        handleLegalInfoChange({
                          poaInfo: {
                            ...legalInfo.poaInfo,
                            phone: formatted
                          }
                        })
                      }}
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