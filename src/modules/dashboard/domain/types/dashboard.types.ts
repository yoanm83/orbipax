export type DashboardMetrics = {
  patientsActive: number | null;
  appointmentsScheduled: number | null;
  notesPending: number | null;
};

export type NextStep = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

export type QuickAction = {
  id: string;
  label: string;
  ariaLabel: string;
  enabled: boolean;
  action?: () => void;
};

export type DashboardData = {
  metrics: DashboardMetrics;
  nextSteps: NextStep[];
  quickActions: QuickAction[];
  systemStatus: {
    isActive: boolean;
    statusText: string;
  };
};