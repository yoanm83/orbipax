"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"
import { format } from "date-fns"

interface SubmissionSectionProps {
  isConfirmed: boolean
  signature: string
  isSubmissionValid: boolean
  onConfirmChange: (checked: boolean) => void
  onSignatureChange: (value: string) => void
  onSubmit: () => void
}

export function SubmissionSection({
  isConfirmed,
  signature,
  isSubmissionValid,
  onConfirmChange,
  onSignatureChange,
  onSubmit
}: SubmissionSectionProps) {
  const today = new Date()

  return (
    <Card className="w-full rounded-2xl shadow-md mb-6">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Submit Intake</h2>

        <div className="space-y-6">
          {/* Confirmation Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="confirmation"
              checked={isConfirmed}
              onCheckedChange={(checked) => onConfirmChange(checked === true)}
            />
            <Label htmlFor="confirmation" className="font-medium">
              I confirm that all information entered is accurate and complete
            </Label>
          </div>

          {/* Digital Signature */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="signature">Full Name (Signature) *</Label>
              <Input
                id="signature"
                placeholder="Type your full name"
                value={signature}
                onChange={(e) => onSignatureChange(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" value={format(today, "PPP")} disabled className="bg-muted" />
            </div>
          </div>

          {/* Validation Alert */}
          {!isSubmissionValid && (
            <Alert className="border-amber-500 bg-amber-50 text-amber-900">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please confirm the accuracy of the information and provide your signature before submitting.
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button className="w-full" size="lg" onClick={onSubmit} disabled={!isSubmissionValid}>
            Submit Intake
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 