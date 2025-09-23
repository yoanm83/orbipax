"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronDown, ChevronUp, Sparkles, Languages, Loader2, LightbulbIcon } from "lucide-react"
import { useIntakeFormStore } from "@/lib/store/intake-form-store"

interface AiGoalSuggestionsSectionProps {
  isExpanded: boolean
  onToggleExpand: () => void
}

interface SuggestedGoal {
  id: string
  text: string
  translatedText?: string
  showTranslation: boolean
}

export function AiGoalSuggestionsSection({ isExpanded, onToggleExpand }: AiGoalSuggestionsSectionProps) {
  const { treatmentInfo, setFormData } = useIntakeFormStore()
  const { treatmentGoals, isGeneratingSuggestions, suggestedGoals } = treatmentInfo
  const goalText = String(treatmentGoals || '')

  // Generate AI suggestions (simulated)
  const generateSuggestions = () => {
    if (!goalText.trim()) return

    setFormData('treatmentInfo', { isGeneratingSuggestions: true })

    // Simulate API call delay
    setTimeout(() => {
      const mightBeSpanish =
        /[áéíóúüñ¿¡]/i.test(goalText) ||
        /\b(el|la|los|las|y|o|pero|porque|como|si|cuando|donde|que|para|por|con|en|mi|tu|su)\b/i.test(goalText)

      const newSuggestions: SuggestedGoal[] = []

      if (
        goalText.toLowerCase().includes('depress') ||
        goalText.toLowerCase().includes('sad') ||
        goalText.toLowerCase().includes('mood') ||
        goalText.toLowerCase().includes('triste')
      ) {
        newSuggestions.push({
          id: 'goal1',
          text: 'Client will identify and implement 3 coping strategies to manage depressive symptoms, resulting in a 30% reduction in reported low mood episodes within 3 months.',
          translatedText: mightBeSpanish
            ? 'El cliente identificará e implementará 3 estrategias de afrontamiento para manejar los síntomas depresivos, resultando en una reducción del 30% en los episodios de bajo estado de ánimo reportados dentro de 3 meses.'
            : undefined,
          showTranslation: false,
        })
      }

      setFormData('treatmentInfo', {
        suggestedGoals: newSuggestions.slice(0, 3),
        isGeneratingSuggestions: false,
      })
    }, 1500)
  }

  // Toggle translation display
  const toggleTranslation = (id: string) => {
    setFormData('treatmentInfo', {
      suggestedGoals: suggestedGoals.map((goal) => {
        if (goal.id === id) {
          return { ...goal, showTranslation: !goal.showTranslation }
        }
        return goal
      }),
    })
  }

  return (
    <Card className="w-full rounded-2xl shadow-md mb-6">
      <div
        className="p-6 border-b flex justify-between items-center cursor-pointer"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">AI-Powered Goal Suggestions</h2>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </div>

      {isExpanded && (
        <CardContent className="p-6">
          <div className="space-y-4">
            <Button
              variant="default"
              className="flex items-center gap-2"
              onClick={generateSuggestions}
              disabled={!goalText.trim() || isGeneratingSuggestions}
            >
              {isGeneratingSuggestions ? (
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

            {!suggestedGoals.length && !isGeneratingSuggestions && (
              <div className="text-center py-8 text-muted-foreground">
                <LightbulbIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  Enter the client's concerns in the treatment goals section above, then click "Generate Suggested Treatment Goals" to receive AI-powered SMART goal suggestions.
                </p>
              </div>
            )}

            {suggestedGoals.length > 0 && (
              <div className="space-y-4">
                {suggestedGoals.map((goal) => (
                  <div key={goal.id} className="bg-muted/50 rounded-lg p-4 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <p className="text-sm">{goal.text}</p>
                      {goal.translatedText && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleTranslation(goal.id)}
                          className="shrink-0"
                        >
                          <Languages className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    {goal.showTranslation && goal.translatedText && (
                      <p className="text-sm text-muted-foreground">{goal.translatedText}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
} 