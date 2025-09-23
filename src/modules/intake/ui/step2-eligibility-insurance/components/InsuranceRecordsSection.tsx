'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, ChevronDown, ChevronUp, CreditCard, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { CustomCalendar } from "@/components/ui/custom-calendar"

interface InsuranceRecord {
  id: string
  carrier: string
  memberId: string
  groupNumber: string
  effectiveDate: Date | undefined
  expirationDate: Date | undefined
  planType: string
  planName: string
  subscriberName: string
  relationship: string
}

interface InsuranceRecordsSectionProps {
  onToggle: () => void
  isExpanded: boolean
  lastEditedStep: number
  insuranceInfo: any
  updateInsuranceInfo: (data: any) => void
  onAddRecord: () => void
  onRemoveRecord: (id: string) => void
  onUpdateRecord: (id: string, field: keyof InsuranceRecord, value: any) => void
}

export function InsuranceRecordsSection({
  onToggle,
  isExpanded,
  lastEditedStep,
  insuranceInfo,
  updateInsuranceInfo,
  onAddRecord,
  onRemoveRecord,
  onUpdateRecord
}: InsuranceRecordsSectionProps) {
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
          <CreditCard className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Insurance Records</h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardContent className="p-6">
          {insuranceInfo.insuranceRecords.map((record: InsuranceRecord, index: number) => (
            <div key={record.id} className="mb-8 pb-8 border-b last:border-b-0 last:mb-0 last:pb-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Insurance Record {index + 1}</h3>
                {insuranceInfo.insuranceRecords.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRemoveRecord(record.id)}
                  >
                    <X className="h-4 w-4 mr-1" /> Remove
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Insurance Carrier */}
                <div className="space-y-2">
                  <Label htmlFor={`carrier-${record.id}`}>Insurance Carrier *</Label>
                  <Select
                    value={record.carrier}
                    onValueChange={(value) => onUpdateRecord(record.id, "carrier", value)}
                  >
                    <SelectTrigger id={`carrier-${record.id}`}>
                      <SelectValue placeholder="Select carrier" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aetna">Aetna</SelectItem>
                      <SelectItem value="bcbs">Blue Cross Blue Shield</SelectItem>
                      <SelectItem value="cigna">Cigna</SelectItem>
                      <SelectItem value="humana">Humana</SelectItem>
                      <SelectItem value="uhc">United Healthcare</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Member ID */}
                <div className="space-y-2">
                  <Label htmlFor={`memberId-${record.id}`}>Member ID *</Label>
                  <Input
                    id={`memberId-${record.id}`}
                    placeholder="Enter member ID"
                    value={record.memberId}
                    onChange={(e) => onUpdateRecord(record.id, "memberId", e.target.value)}
                    required
                  />
                </div>

                {/* Group Number */}
                <div className="space-y-2">
                  <Label htmlFor={`groupNumber-${record.id}`}>Group Number</Label>
                  <Input
                    id={`groupNumber-${record.id}`}
                    placeholder="Enter group number"
                    value={record.groupNumber}
                    onChange={(e) => onUpdateRecord(record.id, "groupNumber", e.target.value)}
                  />
                </div>

                {/* Effective Date */}
                <div className="space-y-2">
                  <Label htmlFor={`effectiveDate-${record.id}`}>Effective Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !record.effectiveDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {record.effectiveDate ? format(record.effectiveDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CustomCalendar
                        mode="single"
                        selected={record.effectiveDate}
                        onSelect={(date) => onUpdateRecord(record.id, "effectiveDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Expiration Date */}
                <div className="space-y-2">
                  <Label htmlFor={`expirationDate-${record.id}`}>Expiration Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !record.expirationDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {record.expirationDate ? format(record.expirationDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CustomCalendar
                        mode="single"
                        selected={record.expirationDate}
                        onSelect={(date) => onUpdateRecord(record.id, "expirationDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Plan Type */}
                <div className="space-y-2">
                  <Label htmlFor={`planType-${record.id}`}>Plan Type</Label>
                  <Select
                    value={record.planType}
                    onValueChange={(value) => onUpdateRecord(record.id, "planType", value)}
                  >
                    <SelectTrigger id={`planType-${record.id}`}>
                      <SelectValue placeholder="Select plan type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hmo">HMO</SelectItem>
                      <SelectItem value="ppo">PPO</SelectItem>
                      <SelectItem value="epo">EPO</SelectItem>
                      <SelectItem value="pos">POS</SelectItem>
                      <SelectItem value="hdhp">HDHP</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Plan Name */}
                <div className="space-y-2">
                  <Label htmlFor={`planName-${record.id}`}>Plan Name</Label>
                  <Input
                    id={`planName-${record.id}`}
                    placeholder="Enter coverage plan name"
                    value={record.planName}
                    onChange={(e) => onUpdateRecord(record.id, "planName", e.target.value)}
                  />
                </div>

                {/* Subscriber Name */}
                <div className="space-y-2">
                  <Label htmlFor={`subscriberName-${record.id}`}>Subscriber Name</Label>
                  <Input
                    id={`subscriberName-${record.id}`}
                    placeholder="Enter subscriber name"
                    value={record.subscriberName}
                    onChange={(e) => onUpdateRecord(record.id, "subscriberName", e.target.value)}
                  />
                </div>

                {/* Relationship to Subscriber */}
                <div className="space-y-2">
                  <Label htmlFor={`relationship-${record.id}`}>Relationship to Subscriber</Label>
                  <Select
                    value={record.relationship}
                    onValueChange={(value) => onUpdateRecord(record.id, "relationship", value)}
                  >
                    <SelectTrigger id={`relationship-${record.id}`}>
                      <SelectValue placeholder="Select relationship" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="self">Self</SelectItem>
                      <SelectItem value="spouse">Spouse</SelectItem>
                      <SelectItem value="child">Child</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={onAddRecord}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Insurance Record
          </Button>
        </CardContent>
      )}
    </Card>
  )
} 