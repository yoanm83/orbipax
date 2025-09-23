"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ChevronDown, ChevronUp, Check, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { type LegalForm } from "@/lib/store/intake-form-store"
import { SignatureSection } from "./SignatureSection"

interface LegalFormCardProps {
  form: LegalForm
  isMinor: boolean
  onToggleExpansion: () => void
  onMarkAsRead: (isRead: boolean) => void
  onSignatureChange: (signature: string) => void
  onGuardianSignatureChange: (signature: string) => void
  onViewDocument: () => void
}

export function LegalFormCard({
  form,
  isMinor,
  onToggleExpansion,
  onMarkAsRead,
  onSignatureChange,
  onGuardianSignatureChange,
  onViewDocument
}: LegalFormCardProps) {
  return (
    <div
      className={cn(
        "border rounded-lg overflow-hidden",
        form.isSigned ? "border-green-200 bg-green-50" : "border-gray-200",
        !form.isRequired && "opacity-70",
      )}
    >
      <div
        className="p-4 flex items-center justify-between cursor-pointer"
        onClick={onToggleExpansion}
      >
        <div className="flex items-center gap-3">
          {form.isSigned ? (
            <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="h-4 w-4 text-white" />
            </div>
          ) : (
            <div className="h-6 w-6 rounded-full border-2 border-gray-300" />
          )}
          <div>
            <h3 className="font-medium">
              {form.title}
              {form.isRequired && <span className="text-red-500 ml-1">*</span>}
            </h3>
            <p className="text-sm text-muted-foreground">{form.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={form.isSigned ? "default" : "outline"} className={cn(
            "min-w-[70px] justify-center",
            form.isSigned && "bg-green-100 text-green-800 border-green-200",
            !form.isSigned && form.isRequired && "border-amber-500 text-amber-600",
            !form.isRequired && !form.isSigned && "bg-indigo-50 text-indigo-700 border-indigo-200"
          )}>
            {form.isSigned ? "Signed" : form.isRequired ? "Required" : "Optional"}
          </Badge>
          {form.isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
      </div>

      {form.isExpanded && (
        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              onClick={onViewDocument}
            >
              <Eye className="h-4 w-4" /> View Document
            </Button>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`read-${form.id}`}
                checked={form.isRead}
                onCheckedChange={(checked) => onMarkAsRead(checked === true)}
              />
              <Label htmlFor={`read-${form.id}`} className="font-normal text-sm">
                I have read and understand this form
              </Label>
            </div>
          </div>

          <SignatureSection
            form={form}
            isMinor={isMinor}
            onSignatureChange={onSignatureChange}
            onGuardianSignatureChange={onGuardianSignatureChange}
          />
        </div>
      )}
    </div>
  )
} 