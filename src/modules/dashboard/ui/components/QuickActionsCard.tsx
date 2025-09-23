import { useRouter } from 'next/navigation';
import type { QuickAction } from '../../domain';

type QuickActionsCardProps = {
  actions: QuickAction[];
};

export function QuickActionsCard({ actions }: QuickActionsCardProps) {
  const router = useRouter();
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-primary rounded-full"></div>
        <h2 className="text-lg font-semibold text-fg">Quick Actions</h2>
      </div>
      <div className="space-y-3">
        {actions.map((action) => (
          <button
            key={action.id}
            disabled={action.id !== 'new-patient' && !action.enabled}
            onClick={() => {
              if (action.id === 'new-patient') {
                router.push('/patients/new');
              } else if (action.action) {
                action.action();
              }
            }}
            className="w-full min-h-[44px] px-4 py-2 bg-primary text-on-primary rounded-md
                       disabled:opacity-50 disabled:cursor-not-allowed
                       hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                       focus:ring-offset-bg transition-colors"
            aria-label={action.id === 'new-patient' ? 'New patient - navigate to patient creation' : action.ariaLabel}
          >
            {action.label}
          </button>
        ))}
      </div>
      <div className="pt-2 border-t border-border">
        <p className="text-xs text-on-muted">
          Features will be enabled progressively
        </p>
      </div>
    </div>
  );
}