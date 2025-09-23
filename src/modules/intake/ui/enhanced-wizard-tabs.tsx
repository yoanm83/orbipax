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
  showProgress?: boolean
}

export function EnhancedWizardTabs({
  currentStep = "demographics",
  onStepClick,
  allowSkipAhead = false,
  showProgress = true,
}: EnhancedWizardTabsProps) {
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
      title: "Insurance",
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
  const progressPercentage = Math.max(Math.round(((currentIndex + 1) / steps.length) * 100), 10)

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

  const handleStepClick = (stepId: string, stepIndex: number) => {
    const currentIndex = steps.findIndex((s) => s.id === currentStep)

    if (stepIndex <= currentIndex || allowSkipAhead) {
      if (onStepClick) {
        onStepClick(stepId)
      }
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
      <div
        className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary rounded-lg transition-all duration-1000 ease-in-out"
        style={{
          background: `linear-gradient(to right, hsl(var(--primary) / 0.15) ${progressPercentage}%, transparent ${progressPercentage}%)`,
        }}
      />

      <div className="grid grid-cols-5 @lg:grid-cols-10 gap-1 @sm:gap-2 items-start relative z-10 py-4">
        {updatedSteps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative">
            <button
              ref={(el) => {
                buttonRefs.current[index] = el
              }}
              onClick={() => handleStepClick(step.id, index)}
              onKeyDown={(e) => handleKeyDown(e, step.id, index)}
              disabled={!allowSkipAhead && index > currentIndex}
              role="tab"
              aria-current={step.status === "current" ? "step" : undefined}
              aria-disabled={!allowSkipAhead && index > currentIndex}
              aria-describedby={`step-${step.id}-description`}
              aria-label={`Step ${index + 1} of ${steps.length}: ${step.title}${step.isOptional ? ' (optional)' : ''}`}
              tabIndex={step.status === "current" ? 0 : -1}
              className={cn(
                "rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 mb-2 min-h-11 min-w-11 @sm:min-h-12 @sm:min-w-12",
                "hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                step.status === "completed" && "bg-primary text-primary-foreground shadow-lg",
                step.status === "current" && "bg-primary text-primary-foreground shadow-lg ring-2 @sm:ring-4 ring-ring",
                step.status === "pending" && "bg-secondary text-muted-foreground",
                !allowSkipAhead && index > currentIndex && "opacity-50 cursor-not-allowed",
              )}
            >
              {step.status === "completed" ? (
                <CheckIcon className="h-2 w-2 @sm:h-3 @sm:w-3" />
              ) : (
                <span className="text-xs">{index + 1}</span>
              )}
            </button>

            <span
              id={`step-${step.id}-description`}
              className={cn(
                "text-xs text-center leading-tight px-1",
                step.status === "completed" && "text-primary font-medium",
                step.status === "current" && "text-primary font-semibold",
                step.status === "pending" && "text-muted-foreground",
                !allowSkipAhead && index > currentIndex && "opacity-50",
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
