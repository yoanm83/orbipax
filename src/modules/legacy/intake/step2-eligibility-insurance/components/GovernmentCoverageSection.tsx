'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, ChevronDown, ChevronUp, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { CustomCalendar } from "@/components/ui/custom-calendar"

interface GovernmentCoverageSectionProps {
  onToggle: () => void
  isExpanded: boolean
  lastEditedStep: number
  insuranceInfo: any
  updateInsuranceInfo: (data: any) => void
}

export function GovernmentCoverageSection({
  onToggle,
  isExpanded,
  lastEditedStep,
  insuranceInfo,
  updateInsuranceInfo
}: GovernmentCoverageSectionProps) {
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
          <Wallet className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Government Coverage</h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Medicaid ID */}
            <div className="space-y-2">
              <Label htmlFor="medicaidId">Medicaid ID</Label>
              <Input
                id="medicaidId"
                placeholder="Enter Medicaid ID"
                value={insuranceInfo.medicaidId || ''}
                onChange={(e) => updateInsuranceInfo({ medicaidId: e.target.value })}
              />
            </div>

            {/* Medicaid Effective Date */}
            <div className="space-y-2">
              <Label htmlFor="medicaidEffectiveDate">Medicaid Effective Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !insuranceInfo.medicaidEffectiveDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {insuranceInfo.medicaidEffectiveDate ? format(insuranceInfo.medicaidEffectiveDate, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CustomCalendar
                    mode="single"
                    selected={insuranceInfo.medicaidEffectiveDate}
                    onSelect={(date) => updateInsuranceInfo({ medicaidEffectiveDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Medicare ID */}
            <div className="space-y-2">
              <Label htmlFor="medicareId">Medicare ID</Label>
              <Input
                id="medicareId"
                placeholder="Enter Medicare ID"
                value={insuranceInfo.medicareId || ''}
                onChange={(e) => updateInsuranceInfo({ medicareId: e.target.value })}
              />
            </div>

            {/* Social Security Number */}
            <div className="space-y-2">
              <Label htmlFor="ssn">Social Security Number</Label>
              <Input
                id="ssn"
                type="password"
                placeholder="XXX-XX-XXXX"
                value={insuranceInfo.ssn || ''}
                onChange={(e) => updateInsuranceInfo({ ssn: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
} 