"use client"

import { CheckIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"

// Utility function for class names
function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

interface WizardStep {
  id: string
  title: string
  shortTitle?: string
  status: "completed" | "current" | "pending"
  isOptional?: boolean
}

interface EnhancedWizardTabsProps {
  currentStep?: string
  onStepClick?: (stepId: string) => void
  allowSkipAhead?: boolean
}

export function EnhancedWizardTabs({
  currentStep = "demographics",
  onStepClick,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  allowSkipAhead = true,
}: EnhancedWizardTabsProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [announcement, setAnnouncement] = useState("")
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])
  const prevStepRef = useRef(currentStep)
  const steps: WizardStep[] = [
    {
      id: "welcome",
      title: "Welcome",
      shortTitle: "Welcome",
      status: "completed",
    },
    {
      id: "demographics",
      title: "Demographics",
      shortTitle: "Demographics",
      status: "current",
    },
    {
      id: "insurance",
      title: "Insurance & Eligibility",
      shortTitle: "Insurance",
      status: "pending",
    },
    {
      id: "diagnoses",
      title: "Clinical Information",
      shortTitle: "Clinical",
      status: "pending",
    },
    {
      id: "medical-providers",
      title: "Medical Providers",
      shortTitle: "Providers",
      status: "pending",
      isOptional: true,
    },
    {
      id: "medications",
      title: "Medications",
      shortTitle: "Meds",
      status: "pending",
    },
    {
      id: "referrals",
      title: "Referrals",
      shortTitle: "Referrals",
      status: "pending",
      isOptional: true,
    },
    {
      id: "legal-forms",
      title: "Legal Forms",
      shortTitle: "Legal",
      status: "pending",
    },
    {
      id: "goals",
      title: "Treatment Goals",
      shortTitle: "Goals",
      status: "pending",
    },
    {
      id: "review",
      title: "Review & Submit",
      shortTitle: "Review",
      status: "pending",
    },
  ]

  const updatedSteps = steps.map((step, index) => {
    const currentIndex = steps.findIndex((s) => s.id === currentStep)
    if (index < currentIndex) {
      return { ...step, status: "completed" as const }
    } else if (index === currentIndex) {
      return { ...step, status: "current" as const }
    } else {
      return { ...step, status: "pending" as const }
    }
  })

  const currentIndex = steps.findIndex((s) => s.id === currentStep)

  // Announce step changes for screen readers
  useEffect(() => {
    if (prevStepRef.current !== currentStep) {
      const stepInfo = steps.find(s => s.id === currentStep)
      if (stepInfo) {
        const stepNumber = steps.findIndex(s => s.id === currentStep) + 1
        const announcement = `Now on step ${stepNumber} of ${steps.length}: ${stepInfo.title}${stepInfo.isOptional ? ' (optional)' : ''}`
        setAnnouncement(announcement)
        prevStepRef.current = currentStep
      }
    }
  }, [currentStep, steps])

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
  const handleStepClick = (stepId: string, _stepIndex: number) => {
    // Free navigation: always allow clicking any step
    if (onStepClick) {
      onStepClick(stepId)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent, stepId: string, stepIndex: number) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault()
        if (stepIndex > 0) {
          setFocusedIndex(stepIndex - 1)
          buttonRefs.current[stepIndex - 1]?.focus()
        }
        break
      case 'ArrowRight':
        event.preventDefault()
        if (stepIndex < steps.length - 1) {
          setFocusedIndex(stepIndex + 1)
          buttonRefs.current[stepIndex + 1]?.focus()
        }
        break
      case 'Home':
        event.preventDefault()
        setFocusedIndex(0)
        buttonRefs.current[0]?.focus()
        break
      case 'End':
        event.preventDefault()
        const lastIndex = steps.length - 1
        setFocusedIndex(lastIndex)
        buttonRefs.current[lastIndex]?.focus()
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        handleStepClick(stepId, stepIndex)
        break
    }
  }

  return (
    <div className="w-full max-w-full overflow-hidden relative @container" role="tablist" aria-label="Intake wizard steps">
      <div className="grid grid-cols-5 @lg:grid-cols-10 gap-1 @sm:gap-2 items-start relative py-4">
        {updatedSteps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative">
            {/* eslint-disable-next-line no-restricted-syntax */}
            <button
              type="button"
              ref={(el) => {
                buttonRefs.current[index] = el
              }}
              onClick={() => handleStepClick(step.id, index)}
              onKeyDown={(e) => handleKeyDown(e, step.id, index)}
              disabled={false}
              role="tab"
              id={`tab-${step.id}`}
              aria-selected={step.status === "current"}
              aria-controls={`tabpanel-${step.id}`}
              aria-current={step.status === "current" ? "step" : undefined}
              aria-disabled={false}
              aria-describedby={`step-${step.id}-description`}
              aria-label={`Step ${index + 1} of ${steps.length}: ${step.title}${step.isOptional ? ' (optional)' : ''}`}
              tabIndex={step.status === "current" ? 0 : -1}
              className={cn(
                // Core layout
                "inline-flex items-center justify-center",
                // Perfect circle: aspect-square ensures 1:1 ratio, rounded-full makes it circular
                "aspect-square rounded-full",
                // Size: minimum 44x44px (11 * 4px), 48x48px on @sm
                "min-h-11 min-w-11 h-11 w-11",
                "@sm:min-h-12 @sm:min-w-12 @sm:h-12 @sm:w-12",
                // Typography
                "text-xs font-bold",
                // Transitions
                "transition-all duration-200",
                // Spacing
                "mb-2",
                // Interactive states
                "hover:scale-110",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
                "disabled:pointer-events-none disabled:opacity-50",
                // State-based colors with visual hierarchy
                // Completed: Green background (success token) with checkmark
                step.status === "completed" && "bg-green-500 text-white hover:bg-green-600 shadow-md",
                // Current: Blue background (primary) with ring and slightly larger via ring
                step.status === "current" && "bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 shadow-lg ring-2 @sm:ring-4 ring-[var(--ring)] scale-110",
                // Pending: Light gray background (secondary/muted)
                step.status === "pending" && "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]/90",
                // Free navigation: no disabled state
              )}
            >
              {step.status === "completed" ? (
                <CheckIcon className="h-4 w-4 @sm:h-5 @sm:w-5" />
              ) : (
                <span>{index + 1}</span>
              )}
            </button>

            <span
              id={`step-${step.id}-description`}
              className={cn(
                "text-xs text-center leading-tight px-1",
                step.status === "completed" && "text-primary font-medium",
                step.status === "current" && "text-primary font-semibold",
                step.status === "pending" && "text-muted-foreground",
                // Free navigation: no disabled state
              )}
            >
              <span className="hidden @sm:block text-xs">{step.shortTitle}</span>
              <span className="@sm:hidden text-xs">{step.shortTitle?.slice(0, 3)}</span>
              {step.isOptional && <span className="block text-xs text-muted-foreground">(opt)</span>}
            </span>

            {index < updatedSteps.length - 1 && (
              <div
                className={cn(
                  "absolute top-5 @sm:top-6 left-full w-full h-0.5 transition-all duration-300 z-0",
                  index < currentIndex ? "bg-primary" : "bg-border",
                )}
                style={{
                  width: "calc(100% - 0.5rem)",
                  transform: "translateX(0.25rem)",
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Live region for screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement}
      </div>
    </div>
  )
}
