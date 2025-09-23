import type { DashboardMetrics } from '../../domain';

type StatusCardProps = {
  metrics: DashboardMetrics;
};

export function StatusCard({ metrics }: StatusCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 bg-primary rounded-full"></div>
        <h2 className="text-lg font-semibold text-fg">Estado</h2>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-on-muted">Pacientes activos</span>
          <span className="text-fg font-medium">
            {metrics.patientsActive ?? '---'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-on-muted">Citas programadas</span>
          <span className="text-fg font-medium">
            {metrics.appointmentsScheduled ?? '---'}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-on-muted">Notas pendientes</span>
          <span className="text-fg font-medium">
            {metrics.notesPending ?? '---'}
          </span>
        </div>
      </div>
      <div className="pt-2 border-t border-border">
        <p className="text-xs text-on-muted">
          Datos se cargarán cuando se conecten los módulos
        </p>
      </div>
    </div>
  );
}