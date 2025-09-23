"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp, Building } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIntakeFormStore } from "@/lib/store/intake-form-store"

export function PharmacySection() {
  const {
    medicationInfo,
    setFormData,
    lastEditedStep
  } = useIntakeFormStore()

  const toggleSection = () => {
    setFormData('medicationInfo', {
      expandedSections: {
        ...medicationInfo.expandedSections,
        pharmacy: !medicationInfo.expandedSections.pharmacy,
      }
    })
  }

  return (
    <Card className={cn(
      "w-full rounded-2xl shadow-md mb-6",
      lastEditedStep === 5 && "ring-2 ring-primary"
    )}>
      <div
        className="p-6 border-b flex justify-between items-center cursor-pointer"
        onClick={toggleSection}
      >
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Pharmacy Information</h2>
        </div>
        {medicationInfo.expandedSections.pharmacy ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {medicationInfo.expandedSections.pharmacy && (
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pharmacy Name */}
            <div className="space-y-2">
              <Label htmlFor="pharmacyName">Pharmacy Name *</Label>
              <Input
                id="pharmacyName"
                placeholder="Enter pharmacy name"
                value={medicationInfo.pharmacyInfo.name}
                onChange={(e) => setFormData('medicationInfo', {
                  pharmacyInfo: {
                    ...medicationInfo.pharmacyInfo,
                    name: e.target.value
                  }
                })}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="pharmacyPhone">Phone Number *</Label>
              <Input
                id="pharmacyPhone"
                type="tel"
                placeholder="(XXX) XXX-XXXX"
                value={medicationInfo.pharmacyInfo.phone}
                onChange={(e) => setFormData('medicationInfo', {
                  pharmacyInfo: {
                    ...medicationInfo.pharmacyInfo,
                    phone: e.target.value
                  }
                })}
                required
              />
            </div>

            {/* Address */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="pharmacyAddress">Address</Label>
              <Input
                id="pharmacyAddress"
                placeholder="Enter pharmacy address"
                value={medicationInfo.pharmacyInfo.address}
                onChange={(e) => setFormData('medicationInfo', {
                  pharmacyInfo: {
                    ...medicationInfo.pharmacyInfo,
                    address: e.target.value
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