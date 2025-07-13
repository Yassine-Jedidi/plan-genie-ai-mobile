import { useCallback, useEffect, useState } from 'react';
import { dashboardAPI } from '~/services/api';

export interface DashboardData {
  tasksByStatus: Array<{ name: string; count: number }>;
  tasksByPriority: Array<{ name: string; count: number }>;
  tasksByDeadline: Array<{ name: string; count: number }>;
  completionData: Array<{ name: string; count: number }>;
  timeByPriority: Array<{ name: string; count: number }>;
  timeSpentPerDay: Array<{ name: string; count: number }>;
  eventsByDay: Array<{ name: string; count: number }>;
  eventDistribution: Array<{ name: string; count: number }>;
  dailyCompletionRates: Array<{ day: string; completed: number; total: number }>;
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardData = await dashboardAPI.getOverallDashboard();
      setData(dashboardData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refetch = useCallback(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    data,
    loading,
    error,
    refetch,
  };
} 