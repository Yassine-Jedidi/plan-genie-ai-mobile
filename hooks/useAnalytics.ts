import { useEffect, useState } from 'react';
import { analyticsAPI } from '~/services/api';

export interface AnalyticsData {
  all: {
    done: number;
    undone: number;
    completionPercentage: number;
    priorityCounts: {
      low: number;
      medium: number;
      high: number;
    };
    donePriorityCounts: {
      low: number;
      medium: number;
      high: number;
    };
    undonePriorityCounts: {
      low: number;
      medium: number;
      high: number;
    };
    overdue: number;
    overdue1_3Days: number;
    overdue4_7Days: number;
    overdueMoreThan7Days: number;
    totalMinutesWorked: number;
    minutesSpentByPriority: {
      low: number;
      medium: number;
      high: number;
    };
    events: {
      totalEvents: number;
      upcomingEvents: number;
      pastEvents: number;
    };
  };
  today: {
    done: number;
    undone: number;
    completionPercentage: number;
    priorityCounts: {
      low: number;
      medium: number;
      high: number;
    };
    donePriorityCounts: {
      low: number;
      medium: number;
      high: number;
    };
    undonePriorityCounts: {
      low: number;
      medium: number;
      high: number;
    };
    overdue: number;
    overdue1_3Days: number;
    overdue4_7Days: number;
    overdueMoreThan7Days: number;
    totalMinutesWorked: number;
    minutesSpentByPriority: {
      low: number;
      medium: number;
      high: number;
    };
    events: {
      totalEvents: number;
      upcomingEvents: number;
      pastEvents: number;
    };
  };
  thisWeek: {
    done: number;
    undone: number;
    completionPercentage: number;
    priorityCounts: {
      low: number;
      medium: number;
      high: number;
    };
    donePriorityCounts: {
      low: number;
      medium: number;
      high: number;
    };
    undonePriorityCounts: {
      low: number;
      medium: number;
      high: number;
    };
    overdue: number;
    overdue1_3Days: number;
    overdue4_7Days: number;
    overdueMoreThan7Days: number;
    totalMinutesWorked: number;
    minutesSpentByPriority: {
      low: number;
      medium: number;
      high: number;
    };
    events: {
      totalEvents: number;
      upcomingEvents: number;
      pastEvents: number;
    };
  };
  thisMonth: {
    done: number;
    undone: number;
    completionPercentage: number;
    priorityCounts: {
      low: number;
      medium: number;
      high: number;
    };
    donePriorityCounts: {
      low: number;
      medium: number;
      high: number;
    };
    undonePriorityCounts: {
      low: number;
      medium: number;
      high: number;
    };
    overdue: number;
    overdue1_3Days: number;
    overdue4_7Days: number;
    overdueMoreThan7Days: number;
    totalMinutesWorked: number;
    minutesSpentByPriority: {
      low: number;
      medium: number;
      high: number;
    };
    events: {
      totalEvents: number;
      upcomingEvents: number;
      pastEvents: number;
    };
  };
}

export const useAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const analyticsData = await analyticsAPI.getOverallAnalytics();
      setData(analyticsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}; 