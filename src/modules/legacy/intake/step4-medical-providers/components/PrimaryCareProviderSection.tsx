"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp, UserRound } from "lucide-react"
import { useIntakeFormStore } from "@/lib/store/intake-form-store"

export function PrimaryCareProviderSection() {
  const {
    medicalProvidersInfo,
    setFormData,
    lastEditedStep
  } = useIntakeFormStore()

  const toggleSection = () => {
    setFormData('medicalProvidersInfo', {
      expandedSections: {
        ...medicalProvidersInfo.expandedSections,
        pcp: !medicalProvidersInfo.expandedSections.pcp,
      }
    })
  }

  return (
    <Card className={cn(
      "w-full rounded-2xl shadow-md mb-6",
      lastEditedStep === 4 && "ring-2 ring-primary"
    )}>
      <div
        className="p-6 border-b flex justify-between items-center cursor-pointer"
        onClick={toggleSection}
      >
        <div className="flex items-center gap-2">
          <UserRound className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Primary Care Provider (PCP)</h2>
        </div>
        {medicalProvidersInfo.expandedSections.pcp ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {medicalProvidersInfo.expandedSections.pcp && (
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Has PCP */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="hasPCP">Does the client have a Primary Care Provider?</Label>
              <Select
                value={medicalProvidersInfo.primaryCareProvider.hasPCP === undefined ? "" : medicalProvidersInfo.primaryCareProvider.hasPCP ? "yes" : "no"}
                onValueChange={(value) => setFormData('medicalProvidersInfo', {
                  primaryCareProvider: {
                    ...medicalProvidersInfo.primaryCareProvider,
                    hasPCP: value === "yes"
                  }
                })}
              >
                <SelectTrigger id="hasPCP">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {medicalProvidersInfo.primaryCareProvider.hasPCP === true && (
              <>
                {/* PCP Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="pcpName">PCP Full Name *</Label>
                  <Input
                    id="pcpName"
                    placeholder="Enter PCP's full name"
                    value={medicalProvidersInfo.primaryCareProvider.name}
                    onChange={(e) => setFormData('medicalProvidersInfo', {
                      primaryCareProvider: {
                        ...medicalProvidersInfo.primaryCareProvider,
                        name: e.target.value
                      }
                    })}
                    required
                  />
                </div>

                {/* Clinic / Facility Name */}
                <div className="space-y-2">
                  <Label htmlFor="pcpClinic">Clinic / Facility Name</Label>
                  <Input
                    id="pcpClinic"
                    placeholder="Enter clinic or facility name"
                    value={medicalProvidersInfo.primaryCareProvider.clinic}
                    onChange={(e) => setFormData('medicalProvidersInfo', {
                      primaryCareProvider: {
                        ...medicalProvidersInfo.primaryCareProvider,
                        clinic: e.target.value
                      }
                    })}
                  />
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <Label htmlFor="pcpPhone">Phone Number *</Label>
                  <Input
                    id="pcpPhone"
                    type="tel"
                    placeholder="(XXX) XXX-XXXX"
                    value={medicalProvidersInfo.primaryCareProvider.phone}
                    onChange={(e) => setFormData('medicalProvidersInfo', {
                      primaryCareProvider: {
                        ...medicalProvidersInfo.primaryCareProvider,
                        phone: e.target.value
                      }
                    })}
                    required
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="pcpAddress">Address</Label>
                  <Input
                    id="pcpAddress"
                    placeholder="Enter PCP's address"
                    value={medicalProvidersInfo.primaryCareProvider.address}
                    onChange={(e) => setFormData('medicalProvidersInfo', {
                      primaryCareProvider: {
                        ...medicalProvidersInfo.primaryCareProvider,
                        address: e.target.value
                      }
                    })}
                  />
                </div>

                {/* Authorized to share medical information */}
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="authorizedToShareWithPCP"
                      checked={medicalProvidersInfo.primaryCareProvider.authorizedToShare}
                      onCheckedChange={(checked) => setFormData('medicalProvidersInfo', {
                        primaryCareProvider: {
                          ...medicalProvidersInfo.primaryCareProvider,
                          authorizedToShare: checked === true
                        }
                      })}
                    />
                    <Label htmlFor="authorizedToShareWithPCP">
                      Authorized to share medical information with PCP
                    </Label>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
} 