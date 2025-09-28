'use client'

import {
  AlertTriangle,
  CheckCircle,
  ClipboardList,
  FileText,
  Network,
  Pill,
  Shield,
  Target,
  User,
  Users
} from 'lucide-react'
import { useState } from 'react'

import { Alert, AlertDescription } from '@/shared/ui/primitives/Alert'
import { Badge } from '@/shared/ui/primitives/Badge'
import { Button } from '@/shared/ui/primitives/Button'
import { Card, CardBody, CardHeader } from '@/shared/ui/primitives/Card'
import { Checkbox } from '@/shared/ui/primitives/Checkbox'
import { EmptyState } from '@/shared/ui/primitives/EmptyState'
import { Input } from '@/shared/ui/primitives/Input'
import { Label } from '@/shared/ui/primitives/Label'
import { Separator } from '@/shared/ui/primitives/Separator'

import { SummarySection } from './SummarySection'


/**
 * Step 10: Review & Submit
 * Displays summary of all intake information for review
 * UI-only implementation with EmptyState for sections awaiting data
 */
export function Step10Review() {
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [signature, setSignature] = useState('')

  // UI-only navigation stub
  const handleNavigateToStep = (_stepKey: string) => {
    // TODO: Wiring pending (router navigation)
    // In production, this would use router or wizard navigation
  }

  // UI-only submit stub
  const handleSubmit = () => {
    // TODO: Wiring pending (submit API)
    // In production, this would submit to API
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Review Status */}
      <Card className="w-full rounded-3xl shadow-md">
        <CardBody className="p-6">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-6 w-6 text-[var(--success)]" />
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">
                Review Your Information
              </h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Please review all sections below before submitting your intake form
              </p>
            </div>
            <Badge variant="secondary" className="text-sm">
              9 of 9 sections complete
            </Badge>
          </div>
        </CardBody>
      </Card>

      {/* Summary Sections */}
      <div className="space-y-4">
        {/* Demographics */}
        <SummarySection
          id="demographics"
          icon={<User className="h-5 w-5" />}
          title="Demographics"
          stepNumber={1}
          description="Personal and contact information"
          onEdit={handleNavigateToStep}
          defaultExpanded={true}
        >
          <EmptyState
            size="sm"
            variant="minimal"
            icon={<User className="h-5 w-5" />}
            title="No information available yet"
            description="This section has no data yet. Use Edit to provide details."
          />
        </SummarySection>

        {/* Insurance */}
        <SummarySection
          id="insurance"
          icon={<Shield className="h-5 w-5" />}
          title="Insurance & Eligibility"
          stepNumber={2}
          description="Coverage and authorization information"
          onEdit={handleNavigateToStep}
          defaultExpanded={false}
        >
          <EmptyState
            size="sm"
            variant="minimal"
            icon={<Shield className="h-5 w-5" />}
            title="No information available yet"
            description="This section has no data yet. Use Edit to provide details."
          />
        </SummarySection>

        {/* Clinical */}
        <SummarySection
          id="diagnoses"
          icon={<ClipboardList className="h-5 w-5" />}
          title="Clinical Information"
          stepNumber={3}
          description="Diagnoses and assessments"
          onEdit={handleNavigateToStep}
          defaultExpanded={false}
        >
          <EmptyState
            size="sm"
            variant="minimal"
            icon={<ClipboardList className="h-5 w-5" />}
            title="No information available yet"
            description="This section has no data yet. Use Edit to provide details."
          />
        </SummarySection>

        {/* Providers */}
        <SummarySection
          id="medical-providers"
          icon={<Users className="h-5 w-5" />}
          title="Medical Providers"
          stepNumber={4}
          description="Healthcare team information"
          onEdit={handleNavigateToStep}
          defaultExpanded={false}
        >
          <EmptyState
            size="sm"
            variant="minimal"
            icon={<Users className="h-5 w-5" />}
            title="No information available yet"
            description="This section has no data yet. Use Edit to provide details."
          />
        </SummarySection>

        {/* Medications */}
        <SummarySection
          id="medications"
          icon={<Pill className="h-5 w-5" />}
          title="Medications"
          stepNumber={5}
          description="Current medications and allergies"
          onEdit={handleNavigateToStep}
          defaultExpanded={false}
        >
          <EmptyState
            size="sm"
            variant="minimal"
            icon={<Pill className="h-5 w-5" />}
            title="No information available yet"
            description="This section has no data yet. Use Edit to provide details."
          />
        </SummarySection>

        {/* Referrals */}
        <SummarySection
          id="referrals"
          icon={<Network className="h-5 w-5" />}
          title="Referrals & Services"
          stepNumber={6}
          description="Service requests and referrals"
          onEdit={handleNavigateToStep}
          defaultExpanded={false}
        >
          <EmptyState
            size="sm"
            variant="minimal"
            icon={<Network className="h-5 w-5" />}
            title="No information available yet"
            description="This section has no data yet. Use Edit to provide details."
          />
        </SummarySection>

        {/* Goals */}
        <SummarySection
          id="goals"
          icon={<Target className="h-5 w-5" />}
          title="Treatment Goals"
          stepNumber={8}
          description="Treatment objectives and priorities"
          onEdit={handleNavigateToStep}
          defaultExpanded={false}
        >
          <EmptyState
            size="sm"
            variant="minimal"
            icon={<Target className="h-5 w-5" />}
            title="No information available yet"
            description="This section has no data yet. Use Edit to provide details."
          />
        </SummarySection>

        {/* Legal */}
        <SummarySection
          id="legal-forms"
          icon={<FileText className="h-5 w-5" />}
          title="Legal Forms & Consents"
          stepNumber={9}
          description="Agreements and authorizations"
          onEdit={handleNavigateToStep}
          defaultExpanded={false}
        >
          <EmptyState
            size="sm"
            variant="minimal"
            icon={<FileText className="h-5 w-5" />}
            title="No information available yet"
            description="This section has no data yet. Use Edit to provide details."
          />
        </SummarySection>
      </div>

      {/* Submission Section */}
      <Card className="w-full rounded-3xl shadow-md">
        <CardHeader className="px-6 py-4 border-b border-[var(--border)]">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">
            Submit Intake Form
          </h3>
        </CardHeader>
        <CardBody className="p-6 space-y-6">
          {/* Confirmation */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="confirm-accuracy"
              checked={isConfirmed}
              onCheckedChange={(checked) => setIsConfirmed(checked as boolean)}
              className="mt-1"
              aria-describedby="confirm-description"
            />
            <div className="flex-1">
              <Label
                htmlFor="confirm-accuracy"
                className="text-sm font-medium cursor-pointer"
              >
                I confirm that all information provided is accurate
              </Label>
              <p
                id="confirm-description"
                className="text-sm text-[var(--muted-foreground)] mt-1"
              >
                By checking this box, you certify that all information provided in this intake
                form is true and complete to the best of your knowledge.
              </p>
            </div>
          </div>

          {/* Signature */}
          <div className="space-y-2">
            <Label htmlFor="signature">
              Electronic Signature <span className="text-[var(--destructive)]">*</span>
            </Label>
            <Input
              id="signature"
              type="text"
              placeholder="Type your full legal name"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className="max-w-md"
              aria-required="true"
              aria-describedby="signature-help"
            />
            <p id="signature-help" className="text-sm text-[var(--muted-foreground)]">
              Your typed name serves as your electronic signature
            </p>
          </div>

          {/* Helper Alert */}
          <Alert className="border-[var(--warning)] bg-[var(--warning)]/10">
            <AlertTriangle className="h-4 w-4 text-[var(--warning)]" />
            <AlertDescription>
              <strong>Note:</strong> Form submission wiring is pending. This is a UI-only
              demonstration. In production, this will submit data securely to the backend.
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <Separator />

          <div className="grid gap-3 md:grid-cols-2">
            <Button
              variant="secondary"
              onClick={() => handleNavigateToStep('legal-forms')}
              className="w-full min-h-[44px]"
            >
              Back to Legal Forms
            </Button>
            <Button
              variant="default"
              onClick={handleSubmit}
              disabled={!isConfirmed || !signature.trim()}
              className="w-full min-h-[44px]"
              aria-label="Submit intake form"
            >
              Submit Intake
            </Button>
          </div>

          {/* Accessibility Note */}
          <div className="text-center">
            <p className="text-sm text-[var(--muted-foreground)]">
              Need assistance? Contact support
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}