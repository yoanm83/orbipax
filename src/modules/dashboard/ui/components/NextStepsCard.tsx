import type { NextStep } from '../../domain';

type NextStepsCardProps = {
  steps: NextStep[];
};

export function NextStepsCard({ steps }: NextStepsCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-primary rounded-full"></div>
        <h2 className="text-lg font-semibold text-fg">Próximos pasos</h2>
      </div>
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.id} className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-on-muted rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <p className="text-fg text-sm font-medium">{step.title}</p>
              <p className="text-on-muted text-xs">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}