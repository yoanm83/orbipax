'use client';

import { DashboardView, useDashboardData } from '@/modules/dashboard';

export default function DashboardPage() {
  const dashboardData = useDashboardData();

  return <DashboardView data={dashboardData} />;
}