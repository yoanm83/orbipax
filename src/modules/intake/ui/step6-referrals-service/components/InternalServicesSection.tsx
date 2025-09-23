"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronUp, Network } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIntakeFormStore } from "@/lib/store/intake-form-store"
import { MultiSelect, type Option } from "@/components/multi-select"

interface InternalServicesSectionProps {
  onToggle: () => void
}

export function InternalServicesSection({ onToggle }: InternalServicesSectionProps) {
  const {
    referralInfo,
    setFormData,
    lastEditedStep
  } = useIntakeFormStore()

  // Options for internal services
  const internalServiceOptions: Option[] = [
    { value: "psychiatry", label: "Psychiatry" },
    { value: "therapy", label: "Therapy / Counseling" },
    { value: "case_management", label: "Case Management" },
    { value: "peer_support", label: "Peer Support" },
    { value: "crisis_services", label: "Crisis Services" },
    { value: "group_therapy", label: "Group Therapy" },
    { value: "other", label: "Other" },
  ]

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
          <h2 className="text-xl font-semibold">Internal Service Referrals</h2>
        </div>
        {referralInfo?.expandedSections?.internalServices ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {referralInfo?.expandedSections?.internalServices && (
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Internal Services */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="internalServices">Services Requested *</Label>
              <MultiSelect
                options={internalServiceOptions}
                selected={referralInfo?.internalServices?.services || []}
                onChange={(services) => setFormData('referralInfo', {
                  ...referralInfo,
                  internalServices: {
                    ...referralInfo?.internalServices,
                    services
                  }
                })}
                placeholder="Select services"
              />
            </div>

            {/* Other Internal Service */}
            {referralInfo?.internalServices?.services?.includes("other") && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="otherInternalService">Please specify other service *</Label>
                <Input
                  id="otherInternalService"
                  placeholder="Enter other service"
                  value={referralInfo?.internalServices?.otherService}
                  onChange={(e) => setFormData('referralInfo', {
                    ...referralInfo,
                    internalServices: {
                      ...referralInfo?.internalServices,
                      otherService: e.target.value
                    }
                  })}
                  required
                />
              </div>
            )}

            {/* Preferred Service Delivery */}
            <div className="space-y-2">
              <Label htmlFor="preferredServiceDelivery">Preferred Service Delivery Method *</Label>
              <Select
                value={referralInfo?.internalServices?.preferredDelivery}
                onValueChange={(value) => setFormData('referralInfo', {
                  ...referralInfo,
                  internalServices: {
                    ...referralInfo?.internalServices,
                    preferredDelivery: value
                  }
                })}
              >
                <SelectTrigger id="preferredServiceDelivery">
                  <SelectValue placeholder="Select preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="telehealth">Telehealth</SelectItem>
                  <SelectItem value="hybrid">Hybrid (Both)</SelectItem>
                  <SelectItem value="no-preference">No Preference</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Service Preference Notes */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="servicePreferenceNotes">Additional Notes or Preferences</Label>
              <Textarea
                id="servicePreferenceNotes"
                placeholder="Enter any additional notes about service preferences"
                value={referralInfo?.internalServices?.preferenceNotes}
                onChange={(e) => setFormData('referralInfo', {
                  ...referralInfo,
                  internalServices: {
                    ...referralInfo?.internalServices,
                    preferenceNotes: e.target.value
                  }
                })}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
} 