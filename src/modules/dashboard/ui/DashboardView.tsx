import type { DashboardData } from '../domain';
import { StatusCard } from './components/StatusCard';
import { NextStepsCard } from './components/NextStepsCard';
import { QuickActionsCard } from './components/QuickActionsCard';

type DashboardViewProps = {
  data: DashboardData;
};

export function DashboardView({ data }: DashboardViewProps) {
  return (
    <main className="max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-fg">Dashboard</h1>
        <p className="text-on-muted">
          Overview of current status and next steps
        </p>
      </header>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatusCard metrics={data.metrics} />
        <NextStepsCard steps={data.nextSteps} />
        <QuickActionsCard actions={data.quickActions} />
      </div>

      {/* Status Footer */}
      <footer className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm text-fg">{data.systemStatus.statusText}</span>
          </div>
          <span className="text-xs text-on-muted">
            Placeholder dashboard - In development
          </span>
        </div>
      </footer>
    </main>
  );
}