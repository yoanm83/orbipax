'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, ChevronDown, ChevronUp, FileText, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { CustomCalendar } from "@/components/ui/custom-calendar"

interface AuthorizationRecord {
  id: string
  type: string
  authNumber: string
  startDate: Date | undefined
  endDate: Date | undefined
  units: string
  notes: string
}

interface AuthorizationsSectionProps {
  onToggle: () => void
  isExpanded: boolean
  lastEditedStep: number
  insuranceInfo: any
  updateInsuranceInfo: (data: any) => void
  onAddRecord: () => void
  onRemoveRecord: (id: string) => void
  onUpdateRecord: (id: string, field: keyof AuthorizationRecord, value: any) => void
}

export function AuthorizationsSection({
  onToggle,
  isExpanded,
  lastEditedStep,
  insuranceInfo,
  updateInsuranceInfo,
  onAddRecord,
  onRemoveRecord,
  onUpdateRecord
}: AuthorizationsSectionProps) {
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
          <FileText className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Authorizations</h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardContent className="p-6">
          {insuranceInfo.authorizationRecords.map((record: AuthorizationRecord, index: number) => (
            <div key={record.id} className="mb-8 pb-8 border-b last:border-b-0 last:mb-0 last:pb-0">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Authorization Record {index + 1}</h3>
                {insuranceInfo.authorizationRecords.length > 1 && (
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
                {/* Authorization Type */}
                <div className="space-y-2">
                  <Label htmlFor={`type-${record.id}`}>Authorization Type *</Label>
                  <Select
                    value={record.type}
                    onValueChange={(value) => onUpdateRecord(record.id, "type", value)}
                  >
                    <SelectTrigger id={`type-${record.id}`}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prior">Prior Authorization</SelectItem>
                      <SelectItem value="concurrent">Concurrent Review</SelectItem>
                      <SelectItem value="referral">Referral</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Authorization Number */}
                <div className="space-y-2">
                  <Label htmlFor={`authNumber-${record.id}`}>Authorization Number *</Label>
                  <Input
                    id={`authNumber-${record.id}`}
                    placeholder="Enter authorization number"
                    value={record.authNumber}
                    onChange={(e) => onUpdateRecord(record.id, "authNumber", e.target.value)}
                    required
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <Label htmlFor={`startDate-${record.id}`}>Start Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !record.startDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {record.startDate ? format(record.startDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CustomCalendar
                        mode="single"
                        selected={record.startDate}
                        onSelect={(date) => onUpdateRecord(record.id, "startDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <Label htmlFor={`endDate-${record.id}`}>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !record.endDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {record.endDate ? format(record.endDate, "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CustomCalendar
                        mode="single"
                        selected={record.endDate}
                        onSelect={(date) => onUpdateRecord(record.id, "endDate", date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Units */}
                <div className="space-y-2">
                  <Label htmlFor={`units-${record.id}`}>Units</Label>
                  <Input
                    id={`units-${record.id}`}
                    placeholder="Enter number of units"
                    value={record.units}
                    onChange={(e) => onUpdateRecord(record.id, "units", e.target.value)}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor={`notes-${record.id}`}>Notes</Label>
                  <Textarea
                    id={`notes-${record.id}`}
                    placeholder="Enter any additional notes"
                    value={record.notes}
                    onChange={(e) => onUpdateRecord(record.id, "notes", e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={onAddRecord}
          >
            <Plus className="h-4 w-4 mr-2" /> Add Authorization Record
          </Button>
        </CardContent>
      )}
    </Card>
  )
} 