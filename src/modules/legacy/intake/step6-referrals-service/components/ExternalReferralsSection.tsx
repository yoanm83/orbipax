"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronDown, ChevronUp, Network } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIntakeFormStore } from "@/lib/store/intake-form-store"

interface ExternalReferralsSectionProps {
  onToggle: () => void
}

export function ExternalReferralsSection({ onToggle }: ExternalReferralsSectionProps) {
  const {
    referralInfo,
    setFormData,
    lastEditedStep
  } = useIntakeFormStore()

  // Toggle external referral type
  const toggleExternalReferralType = (type: string) => {
    const currentTypes = referralInfo.externalReferrals.referralTypes
    const newTypes = currentTypes.includes(type) 
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type]
    
    setFormData('referralInfo', {
      ...referralInfo,
      externalReferrals: {
        ...referralInfo.externalReferrals,
        referralTypes: newTypes
      }
    })
  }

  return (
    <Card className={cn(
      "w-full rounded-2xl shadow-md mb-6",
      lastEditedStep === 6 && "ring-2 ring-primary"
    )}>
      <div
        className="p-6 border-b flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <Network className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">External Referrals</h2>
        </div>
        {referralInfo?.expandedSections?.externalReferrals ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </div>

      {referralInfo?.expandedSections?.externalReferrals && (
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Has External Referrals */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="hasExternalReferrals">
                Has the client been referred to services outside of this agency?
              </Label>
              <Select
                value={referralInfo?.externalReferrals?.hasExternalReferrals === undefined ? "" : referralInfo?.externalReferrals?.hasExternalReferrals ? "yes" : "no"}
                onValueChange={(value) => setFormData('referralInfo', {
                  ...referralInfo,
                  externalReferrals: {
                    ...referralInfo?.externalReferrals,
                    hasExternalReferrals: value === "yes"
                  }
                })}
              >
                <SelectTrigger id="hasExternalReferrals">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {referralInfo?.externalReferrals?.hasExternalReferrals === true && (
              <>
                {/* Referral Types */}
                <div className="space-y-4 md:col-span-2">
                  <Label>Referral Type (select all that apply) *</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="referral-detox"
                        checked={referralInfo?.externalReferrals?.referralTypes?.includes("detox")}
                        onCheckedChange={() => toggleExternalReferralType("detox")}
                      />
                      <Label htmlFor="referral-detox" className="font-normal">
                        Detox Services
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="referral-residential"
                        checked={referralInfo?.externalReferrals?.referralTypes?.includes("residential")}
                        onCheckedChange={() => toggleExternalReferralType("residential")}
                      />
                      <Label htmlFor="referral-residential" className="font-normal">
                        Residential Treatment
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="referral-housing"
                        checked={referralInfo?.externalReferrals?.referralTypes?.includes("housing")}
                        onCheckedChange={() => toggleExternalReferralType("housing")}
                      />
                      <Label htmlFor="referral-housing" className="font-normal">
                        Housing Services
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="referral-medical"
                        checked={referralInfo?.externalReferrals?.referralTypes?.includes("medical")}
                        onCheckedChange={() => toggleExternalReferralType("medical")}
                      />
                      <Label htmlFor="referral-medical" className="font-normal">
                        Medical Services
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="referral-other"
                        checked={referralInfo?.externalReferrals?.referralTypes?.includes("other")}
                        onCheckedChange={() => toggleExternalReferralType("other")}
                      />
                      <Label htmlFor="referral-other" className="font-normal">
                        Other
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Other External Referral */}
                {referralInfo?.externalReferrals?.referralTypes?.includes("other") && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="otherExternalReferral">Please specify other referral type *</Label>
                    <Input
                      id="otherExternalReferral"
                      placeholder="Enter other referral type"
                      value={referralInfo?.externalReferrals?.otherReferral}
                      onChange={(e) => setFormData('referralInfo', {
                        ...referralInfo,
                        externalReferrals: {
                          ...referralInfo?.externalReferrals,
                          otherReferral: e.target.value
                        }
                      })}
                      required
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
} 