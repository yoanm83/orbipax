"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { type LegalForm } from "@/lib/store/intake-form-store"

interface SignatureSectionProps {
  form: LegalForm
  isMinor: boolean
  onSignatureChange: (signature: string) => void
  onGuardianSignatureChange: (signature: string) => void
}

export function SignatureSection({
  form,
  isMinor,
  onSignatureChange,
  onGuardianSignatureChange
}: SignatureSectionProps) {
  return (
    <div className="space-y-4">
      {/* Client Signature */}
      <div className="space-y-2">
        <Label htmlFor={`signature-${form.id}`}>
          {isMinor ? "Minor's Signature (if applicable)" : "Client Signature"}
          {!isMinor && <span className="text-destructive">*</span>}
        </Label>
        <Input
          id={`signature-${form.id}`}
          type="text"
          placeholder="Type your full name as signature"
          value={form.signature}
          onChange={(e) => onSignatureChange(e.target.value)}
          className="max-w-md"
          required={!isMinor}
        />
        <p className="text-sm text-muted-foreground">
          By typing your name, you agree to the terms of this form
        </p>
      </div>

      {/* Guardian Signature for minors */}
      {isMinor && (
        <div className="space-y-2">
          <Label htmlFor={`guardian-signature-${form.id}`}>
            Parent/Guardian Signature<span className="text-destructive">*</span>
          </Label>
          <Input
            id={`guardian-signature-${form.id}`}
            type="text"
            placeholder="Type parent/guardian full name as signature"
            value={form.guardianSignature || ''}
            onChange={(e) => onGuardianSignatureChange(e.target.value)}
            className="max-w-md"
            required
          />
          <p className="text-sm text-muted-foreground">
            By typing your name, you agree to the terms of this form on behalf of the minor
          </p>
        </div>
      )}

      {/* Date of signature */}
      <div className="text-sm text-muted-foreground">
        Date: {new Date().toLocaleDateString()}
      </div>
    </div>
  )
}