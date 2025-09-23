'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, ChevronDown, ChevronUp, FileCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import { CustomCalendar } from "@/components/ui/custom-calendar"

interface EligibilityRecordsSectionProps {
  onToggle: () => void
  isExpanded: boolean
  lastEditedStep: number
  insuranceInfo: any
  updateInsuranceInfo: (data: any) => void
}

export function EligibilityRecordsSection({
  onToggle,
  isExpanded,
  lastEditedStep,
  insuranceInfo,
  updateInsuranceInfo
}: EligibilityRecordsSectionProps) {
  return (
    <Card className={cn(
      "w-full rounded-2xl shadow-md mb-6",
      lastEditedStep === 2 && "ring-2 ring-primary"
    )}>
      <div
        className="p-6 border-b flex justify-between items-center cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Eligibility Records</h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Eligibility Date */}
            <div className="space-y-2">
              <Label htmlFor="eligibilityDate">Eligibility Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !insuranceInfo.eligibilityDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {insuranceInfo.eligibilityDate ? format(insuranceInfo.eligibilityDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CustomCalendar
                    mode="single"
                    selected={insuranceInfo.eligibilityDate}
                    onSelect={(date) => updateInsuranceInfo({ eligibilityDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Program Type */}
            <div className="space-y-2">
              <Label htmlFor="programType">Program Type</Label>
              <Select
                value={insuranceInfo.programType}
                onValueChange={(value) => updateInsuranceInfo({ programType: value })}
              >
                <SelectTrigger id="programType">
                  <SelectValue placeholder="Select program type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medicaid">Medicaid</SelectItem>
                  <SelectItem value="medicare">Medicare</SelectItem>
                  <SelectItem value="private">Private Insurance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
} 