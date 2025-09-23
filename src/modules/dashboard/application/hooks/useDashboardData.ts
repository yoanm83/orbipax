import type { DashboardData } from '../../domain';

export function useDashboardData(): DashboardData {
  // TODO: Replace with real data aggregation from modules
  return {
    metrics: {
      patientsActive: null,
      appointmentsScheduled: null,
      notesPending: null,
    },
    nextSteps: [
      {
        id: 'setup-modules',
        title: 'Configure business modules',
        description: 'Connect patients, appointments and notes',
        completed: false,
      },
      {
        id: 'customize-dashboard',
        title: 'Customize dashboard',
        description: 'Specific widgets and metrics',
        completed: false,
      },
      {
        id: 'setup-notifications',
        title: 'Setup notifications',
        description: 'Alerts and reminders',
        completed: false,
      },
    ],
    quickActions: [
      {
        id: 'new-patient',
        label: 'New patient',
        ariaLabel: 'New patient - feature not available yet',
        enabled: false,
      },
      {
        id: 'schedule-appointment',
        label: 'Schedule appointment',
        ariaLabel: 'Schedule appointment - feature not available yet',
        enabled: false,
      },
      {
        id: 'new-note',
        label: 'New note',
        ariaLabel: 'New note - feature not available yet',
        enabled: false,
      },
    ],
    systemStatus: {
      isActive: true,
      statusText: 'System active',
    },
  };
}