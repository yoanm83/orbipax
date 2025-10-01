const fs = require('fs');

const filePath = 'D:/ORBIPAX-PROJECT/src/modules/intake/ui/step2-eligibility-insurance/components/InsuranceRecordsSection.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update imports - Add Save icon
content = content.replace(
  'import { Shield, ChevronUp, ChevronDown, Plus, Trash2 } from "lucide-react"',
  'import { Shield, ChevronUp, ChevronDown, Plus, Trash2, Save } from "lucide-react"'
);

// 2. Add useState import
content = content.replace(
  'import { useMemo } from "react"',
  'import { useMemo, useState } from "react"'
);

// 3. Add useToast import
content = content.replace(
  '} from "@/shared/ui/primitives/Select"\n\nimport type { InsuranceEligibility }',
  '} from "@/shared/ui/primitives/Select"\nimport { useToast } from "@/shared/ui/primitives/Toast"\n\nimport type { InsuranceEligibility }'
);

// 4. Add saveInsuranceCoverageAction import
content = content.replace(
  'import type { InsuranceEligibility } from "@/modules/intake/domain/schemas/insurance-eligibility"',
  'import type { InsuranceEligibility } from "@/modules/intake/domain/schemas/insurance-eligibility"\nimport { saveInsuranceCoverageAction } from "@/modules/intake/actions/step2/insurance.actions"'
);

// 5. Add state and getValues
content = content.replace(
  'export function InsuranceRecordsSection({ onSectionToggle, isExpanded }: InsuranceRecordsSectionProps) {\n  // Get form context from parent FormProvider\n  const { control, register, formState: { errors } } = useFormContext<Partial<InsuranceEligibility>>()',
  'export function InsuranceRecordsSection({ onSectionToggle, isExpanded }: InsuranceRecordsSectionProps) {\n  // Toast notifications\n  const { toast } = useToast()\n\n  // Loading states per card (indexed by field.id)\n  const [savingStates, setSavingStates] = useState<Record<string, boolean>>({})\n\n  // Get form context from parent FormProvider\n  const { control, register, getValues, formState: { errors } } = useFormContext<Partial<InsuranceEligibility>>()'
);

// 6. Add handler function
const handlerCode = `
  /**
   * Save individual insurance coverage record
   * Calls server action with patientId and coverage data from form
   */
  async function handleSaveCoverage(index: number, fieldId: string) {
    // Mark this card as saving
    setSavingStates(prev => ({ ...prev, [fieldId]: true }))

    try {
      // Get coverage data from form (RHF state)
      const coverage = getValues(\`insuranceCoverages.\${index}\`)

      // TODO: Get actual patientId from context/session
      // For now using a placeholder - this should come from auth or route params
      const patientId = 'temp-patient-id-placeholder'

      // Call server action
      const result = await saveInsuranceCoverageAction({
        patientId,
        coverage
      })

      // Handle response
      if (result.ok) {
        toast({
          title: 'Success',
          description: 'Insurance coverage saved successfully',
          variant: 'success'
        })
      } else {
        // Show generic error message (no PII, no DB details)
        toast({
          title: 'Error',
          description: result.error?.message || 'Could not save insurance record',
          variant: 'destructive'
        })
      }
    } catch (error) {
      // Unexpected error - show generic message
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive'
      })
    } finally {
      // Clear loading state
      setSavingStates(prev => ({ ...prev, [fieldId]: false }))
    }
  }
`;

content = content.replace(
  '  // Generate unique section ID for this instance\n  const sectionUid = useMemo(() => `ins_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, [])\n\n  function addRecord() {',
  `  // Generate unique section ID for this instance\n  const sectionUid = useMemo(() => \`ins_\${Date.now()}_\${Math.random().toString(36).substr(2, 9)}\`, [])\n${handlerCode}\n  function addRecord() {`
);

// 7. Add save button before closing </div> of grid and separator
const saveButtonCode = `
                {/* Save button for this coverage */}
                <div className="flex justify-end mt-4">
                  <Button
                    type="button"
                    variant="solid"
                    size="md"
                    onClick={() => handleSaveCoverage(index, field.id)}
                    disabled={savingStates[field.id]}
                    aria-busy={savingStates[field.id]}
                    aria-label={\`Save insurance record \${index + 1}\`}
                    className="min-w-[120px]"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {savingStates[field.id] ? 'Saving...' : 'Save Coverage'}
                  </Button>
                </div>
`;

content = content.replace(
  '                </div>\n\n                {/* Separator between records */',
  `                </div>\n${saveButtonCode}\n                {/* Separator between records */`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('InsuranceRecordsSection updated successfully');
