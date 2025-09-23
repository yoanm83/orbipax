"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface FormStatusAlertProps {
  isMinor: boolean
  areAllRequiredFormsSigned: boolean
}

export function FormStatusAlert({ isMinor, areAllRequiredFormsSigned }: FormStatusAlertProps) {
  if (areAllRequiredFormsSigned) return null

  return (
    <Alert className="mt-6 border-amber-500 bg-amber-50">
      <AlertTriangle className="h-4 w-4 text-amber-600" />
      <AlertDescription className="text-amber-900">
        All required forms must be read and signed before proceeding to the next step.
        {isMinor && " Each form must be signed by both the client and guardian."}
      </AlertDescription>
    </Alert>
  )
} 