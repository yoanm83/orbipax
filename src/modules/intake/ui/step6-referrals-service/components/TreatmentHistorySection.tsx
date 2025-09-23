"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronUp, History } from "lucide-react"
import { cn } from "@/lib/utils"
import { useIntakeFormStore } from "@/lib/store/intake-form-store"

interface TreatmentHistorySectionProps {
  onToggle: () => void
}

export function TreatmentHistorySection({ onToggle }: TreatmentHistorySectionProps) {
  const {
    referralInfo,
    setFormData,
    lastEditedStep
  } = useIntakeFormStore()

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
          <History className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Treatment History</h2>
        </div>
        {referralInfo?.expandedSections?.treatmentHistory ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </div>

      {referralInfo?.expandedSections?.treatmentHistory && (
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Has Previous Treatment */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="hasPreviousTreatment">
                Has the client received mental health treatment in the past?
              </Label>
              <Select
                value={referralInfo?.treatmentHistory?.hasPreviousTreatment === undefined ? "" : referralInfo?.treatmentHistory?.hasPreviousTreatment ? "yes" : "no"}
                onValueChange={(value) => setFormData('referralInfo', {
                  ...referralInfo,
                  treatmentHistory: {
                    ...referralInfo?.treatmentHistory,
                    hasPreviousTreatment: value === "yes"
                  }
                })}
              >
                <SelectTrigger id="hasPreviousTreatment">
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {referralInfo?.treatmentHistory?.hasPreviousTreatment === true && (
              <>
                {/* Previous Providers */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="previousProviders">Previous Providers *</Label>
                  <Textarea
                    id="previousProviders"
                    placeholder="Enter names, dates, or facilities"
                    value={referralInfo?.treatmentHistory?.previousProviders}
                    onChange={(e) => setFormData('referralInfo', {
                      ...referralInfo,
                      treatmentHistory: {
                        ...referralInfo?.treatmentHistory,
                        previousProviders: e.target.value
                      }
                    })}
                    required
                  />
                </div>

                {/* Was Hospitalized */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="wasHospitalized">
                    Was the client ever hospitalized for mental health reasons?
                  </Label>
                  <Select
                    value={referralInfo?.treatmentHistory?.wasHospitalized === undefined ? "" : referralInfo?.treatmentHistory?.wasHospitalized ? "yes" : "no"}
                    onValueChange={(value) => setFormData('referralInfo', {
                      ...referralInfo,
                      treatmentHistory: {
                        ...referralInfo?.treatmentHistory,
                        wasHospitalized: value === "yes"
                      }
                    })}
                  >
                    <SelectTrigger id="wasHospitalized">
                      <SelectValue placeholder="Select an option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Hospitalization Details */}
                {referralInfo?.treatmentHistory?.wasHospitalized === true && (
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="hospitalizationDetails">Dates and locations of hospitalization</Label>
                    <Textarea
                      id="hospitalizationDetails"
                      placeholder="Enter dates and locations"
                      value={referralInfo?.treatmentHistory?.hospitalizationDetails}
                      onChange={(e) => setFormData('referralInfo', {
                        ...referralInfo,
                        treatmentHistory: {
                          ...referralInfo?.treatmentHistory,
                          hospitalizationDetails: e.target.value
                        }
                      })}
                    />
                  </div>
                )}

                {/* Past Diagnoses */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="pastDiagnoses">Past Diagnoses</Label>
                  <Textarea
                    id="pastDiagnoses"
                    placeholder="Enter any past diagnoses"
                    value={referralInfo?.treatmentHistory?.pastDiagnoses}
                    onChange={(e) => setFormData('referralInfo', {
                      ...referralInfo,
                      treatmentHistory: {
                        ...referralInfo?.treatmentHistory,
                        pastDiagnoses: e.target.value
                      }
                    })}
                  />
                </div>
              </>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
} 