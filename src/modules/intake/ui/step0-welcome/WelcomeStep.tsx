'use client'

import {
  CheckCircle,
  CreditCard,
  FileText,
  Heart,
  Pill,
  Shield,
  Store,
  Users
} from 'lucide-react'

import { Button } from '@/shared/ui/primitives/Button'
import { Card, CardBody, CardHeader } from '@/shared/ui/primitives/Card'

import { useWizardProgressStore } from '@/modules/intake/state'

/**
 * Step 0: Welcome
 * Introduction to the intake process with preparation checklist
 * UI-only implementation with navigation stub
 */
export function WelcomeStep() {
  // Use the same navigation hook as the wizard stepper
  const goToStep = useWizardProgressStore(state => state.goToStep)

  const handleGetStarted = () => {
    // Navigate to demographics (first step after welcome) using wizard's goToStep
    goToStep('demographics')
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Welcome Header Card */}
      <Card className="w-full rounded-3xl shadow-md">
        <CardBody className="p-6">
          <div className="flex items-center gap-3">
            <Heart className="h-6 w-6 text-[var(--primary)]" />
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-[var(--foreground)]">
                Welcome to Your Intake Process
              </h1>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                We're here to help you get the care you need. This process should take about 15-20 minutes.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* What You'll Need Card */}
      <section aria-labelledby="needlist-heading">
        <Card className="w-full rounded-3xl shadow-md">
          <CardHeader className="px-6 py-4 border-b border-[var(--border)]">
            <h2 id="needlist-heading" className="text-lg font-semibold text-[var(--foreground)]">
              What you'll need
            </h2>
            <p className="text-sm text-[var(--muted-foreground)] mt-1">
              Please have these items ready before you begin
            </p>
          </CardHeader>
          <CardBody className="p-6">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
              <li className="flex items-start gap-3">
                <CreditCard className="h-5 w-5 text-[var(--primary)] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm text-[var(--foreground)]">
                  Government-issued ID (driver's license or state ID)
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-[var(--primary)] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm text-[var(--foreground)]">
                  Insurance card with Member ID and Group Number
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Pill className="h-5 w-5 text-[var(--primary)] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm text-[var(--foreground)]">
                  List of current medications and dosages
                </span>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-[var(--primary)] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm text-[var(--foreground)]">
                  Medical history and current conditions
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Users className="h-5 w-5 text-[var(--primary)] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm text-[var(--foreground)]">
                  Primary Care Provider contact information
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Store className="h-5 w-5 text-[var(--primary)] mt-0.5 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm text-[var(--foreground)]">
                  Preferred pharmacy name and location
                </span>
              </li>
            </ul>
          </CardBody>
        </Card>
      </section>

      {/* Important Information Card */}
      <Card className="w-full rounded-3xl shadow-md">
        <CardHeader className="px-6 py-4 border-b border-[var(--border)]">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">
            Important Information
          </h2>
        </CardHeader>
        <CardBody className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-[var(--success)] mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">
                Your information is secure
              </p>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                All data is encrypted and protected in compliance with HIPAA regulations.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-[var(--success)] mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">
                Save your progress
              </p>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                Your information is automatically saved as you complete each step.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-[var(--success)] mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">
                Take your time
              </p>
              <p className="text-sm text-[var(--muted-foreground)] mt-1">
                You can return to any section to review or update your information before submitting.
              </p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Get Started Action */}
      <div className="w-full pt-4">
        <Button
          onClick={handleGetStarted}
          size="lg"
          className="w-full min-h-[48px] text-white"
          aria-label="Start intake"
        >
          Get Started
        </Button>
      </div>
    </div>
  )
}