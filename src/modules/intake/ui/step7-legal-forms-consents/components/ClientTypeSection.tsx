"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useIntakeFormStore } from "@/lib/store/intake-form-store"

export function ClientTypeSection() {
  const { consentInfo, setFormData } = useIntakeFormStore()

  return (
    <div className="flex items-center space-x-4 mb-6 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="isMinor"
          checked={consentInfo.isMinor}
          onCheckedChange={(checked) => setFormData('consentInfo', {
            ...consentInfo,
            isMinor: checked === true
          })}
        />
        <Label htmlFor="isMinor" className="font-normal">
          Client is a minor
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="authorizedToShareWithPCP"
          checked={consentInfo.authorizedToShareWithPCP}
          onCheckedChange={(checked) => {
            const updatedForms = consentInfo.legalForms.map((form) => {
              if (form.id === "roi") {
                return { ...form, isRequired: checked === true }
              }
              return form
            })
            setFormData('consentInfo', {
              ...consentInfo,
              authorizedToShareWithPCP: checked === true,
              legalForms: updatedForms
            })
          }}
        />
        <Label htmlFor="authorizedToShareWithPCP" className="font-normal">
          Authorized to share with PCP
        </Label>
      </div>
    </div>
  )
} 