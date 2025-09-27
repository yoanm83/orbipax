'use client'

import { Loader2, Sparkles, Target, ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { useState } from 'react'

import { Alert, AlertDescription } from '@/shared/ui/primitives/Alert'
import { Label } from '@/shared/ui/primitives/label'
import { Button } from '@/shared/ui/primitives/Button'
import { Textarea } from '@/shared/ui/primitives/Textarea'
import { toast } from '@/shared/ui/primitives/Toast'
import { generateTreatmentGoalSuggestions } from '@/modules/intake/actions/goals.actions'

interface TreatmentGoalsSectionProps {
  isExpanded: boolean
  onToggleExpand: () => void
}

// Example goals that can be clicked to insert
const EXAMPLE_GOALS = [
  "Improve mood and daily functioning",
  "Manage anxiety symptoms",
  "Build healthy relationships",
  "Develop coping skills for stress",
  "Address trauma and its effects",
] as const

/**
 * Unified Treatment Goals Section
 * Contains textarea, example pills, and generate button in a single section
 */
export function TreatmentGoalsSection({ isExpanded, onToggleExpand }: TreatmentGoalsSectionProps) {
  const [goals, setGoals] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedSuggestion, setGeneratedSuggestion] = useState('')
  const [selectedExamples, setSelectedExamples] = useState<Set<string>>(new Set())
  const [rateLimitMessage, setRateLimitMessage] = useState('')

  // Handle example goal click - insert into textarea
  const handleExampleClick = (example: string) => {
    const currentGoals = goals.trim()
    const goalsArray = currentGoals ? currentGoals.split('; ') : []

    // Check if already added
    if (goalsArray.includes(example)) {
      // Remove from textarea
      const filteredGoals = goalsArray.filter(g => g !== example)
      setGoals(filteredGoals.join('; '))

      // Update selected state
      setSelectedExamples(prev => {
        const next = new Set(prev)
        next.delete(example)
        return next
      })
    } else {
      // Add to textarea
      const newGoals = currentGoals ? `${currentGoals}; ${example}` : example
      setGoals(newGoals)

      // Update selected state
      setSelectedExamples(prev => {
        const next = new Set(prev)
        next.add(example)
        return next
      })
    }
  }

  // Handle generate button click - use OpenAI via server action
  const handleGenerate = async () => {
    if (!goals.trim() || goals.length < 10) {
      toast.warning('Please provide at least 10 characters describing the treatment goals')
      return
    }

    setIsGenerating(true)
    setGeneratedSuggestion('')
    setRateLimitMessage('') // Clear previous rate limit message

    try {
      // Call server action (runs on server, uses OpenAI)
      const result = await generateTreatmentGoalSuggestions({
        clientConcerns: goals
      })

      if (result.ok) {
        const suggestion = result.suggestion
        setGeneratedSuggestion(suggestion)

        // Auto-append to textarea if not already present
        if (!goals.includes(suggestion)) {
          const currentGoals = goals.trim()
          const newGoals = currentGoals ? `${currentGoals}; ${suggestion}` : suggestion
          setGoals(newGoals)

          toast.success('AI-generated goal has been added to your treatment goals')
        }
        setRateLimitMessage('') // Clear rate limit message on success
      } else {
        // Check for rate limit error
        if (result.error?.includes('Too many requests')) {
          toast.warning("You've reached the suggestion limit. Please try again in a minute.")
          setRateLimitMessage("You've reached the suggestion limit. Please wait a minute before trying again.")

          // Clear the rate limit message after 60 seconds
          setTimeout(() => setRateLimitMessage(''), 60000)
        } else {
          toast.error(result.error || 'Unable to generate suggestions. Please try again.')
        }
      }
    } catch {
      toast.error('Connection error. Please check your internet and try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <>
      {/* Collapsible Header */}
      <div
        id="treatment-goals-header"
        className="py-3 px-6 flex justify-between items-center cursor-pointer min-h-[44px]"
        onClick={onToggleExpand}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onToggleExpand()
          }
        }}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-controls="treatment-goals-panel"
      >
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-[var(--primary)]" />
          <h2 className="text-lg font-medium text-[var(--foreground)]">Treatment Goals</h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {/* Collapsible Content */}
      {isExpanded && (
        <div id="treatment-goals-panel" className="p-6 space-y-6">
          {/* Textarea Field */}
          <div className="space-y-2">
            <Label htmlFor="treatment-goals-textarea">
              What would the client like to work on? <span className="text-[var(--destructive)]">*</span>
            </Label>
            <Textarea
              id="treatment-goals-textarea"
              placeholder="Enter treatment goals..."
              className="min-h-[120px]"
              value={goals}
              onChange={(e) => setGoals(e.target.value)}
              aria-required="true"
              aria-describedby="goals-help-text"
            />
            {!goals.trim() && (
              <p id="goals-help-text" className="text-sm text-[var(--warning)]">
                Please describe the treatment goals
              </p>
            )}
          </div>

          {/* Example Goals Pills */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-[var(--foreground-muted)]">Example Goals (click to add):</h3>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Example treatment goals">
              {EXAMPLE_GOALS.map((example) => (
                <Button
                  key={example}
                  type="button"
                  variant="ghost"
                  onClick={() => handleExampleClick(example)}
                  className={`
                    rounded-full px-4 py-2 min-h-[44px] text-sm font-normal
                    bg-[var(--surface-subtle)] text-[var(--foreground-muted)]
                    hover:bg-[var(--surface)] hover:text-[var(--foreground)]
                    focus-visible:outline-none focus-visible:ring-2
                    focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2
                    transition-all duration-200
                    ${selectedExamples.has(example)
                      ? 'bg-[var(--surface)] text-[var(--foreground)] shadow-sm'
                      : ''
                    }
                  `}
                  aria-pressed={selectedExamples.has(example)}
                  aria-label={`${selectedExamples.has(example) ? 'Remove' : 'Add'} goal: ${example}`}
                >
                  <Plus
                    className={`
                      h-3.5 w-3.5 mr-1.5 opacity-50
                      ${selectedExamples.has(example) ? 'rotate-45' : ''}
                      transition-transform duration-200
                    `}
                  />
                  {example}
                </Button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <div className="space-y-4">
            <Button
              variant="default"
              className="flex items-center gap-2 text-white"
              onClick={handleGenerate}
              disabled={!goals.trim() || isGenerating}
              aria-busy={isGenerating}
              aria-describedby={rateLimitMessage ? 'rate-limit-message' : undefined}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Suggested Treatment Goals
                </>
              )}
            </Button>

            {/* Rate Limit Helper Text */}
            {rateLimitMessage && (
              <p
                id="rate-limit-message"
                className="text-sm text-[var(--warning)] mt-2"
                role="status"
                aria-live="polite"
              >
                {rateLimitMessage}
              </p>
            )}

            {/* Generated Suggestion Display */}
            {generatedSuggestion && (
              <Alert
                className="border-[var(--info)] bg-[var(--info)]/10"
                role="region"
                aria-live="polite"
                aria-label="AI-generated treatment goal suggestion"
              >
                <Sparkles className="h-4 w-4 text-[var(--info)]" />
                <AlertDescription className="ml-2">
                  <strong>AI Suggestion:</strong> {generatedSuggestion}
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      )}
    </>
  )
}