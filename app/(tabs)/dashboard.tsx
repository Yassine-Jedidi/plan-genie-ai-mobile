import { AlertTriangle, Calendar, Target } from "lucide-react-native";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart } from "~/components/ui/bar-chart";
import { Card } from "~/components/ui/card";
import { LineChart } from "~/components/ui/line-chart";
import { PieChart } from "~/components/ui/pie-chart";
import { Spinner } from "~/components/ui/spinner";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/hooks/useColorScheme";
import { useDashboard } from "~/hooks/useDashboard";
import { useTheme } from "~/hooks/useTheme";
import "~/lib/i18n";

export default function DashboardTab() {
  const { data, loading, error, refetch } = useDashboard();
  const { isDarkColorScheme } = useColorScheme();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return isDarkColorScheme ? "#f87171" : "#ef4444";
      case "medium":
        return isDarkColorScheme ? "#fbbf24" : "#f59e0b";
      case "low":
        return isDarkColorScheme ? "#34d399" : "#10b981";
      default:
        return isDarkColorScheme ? "#9ca3af" : "#6b7280";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "done":
        return isDarkColorScheme ? "#34d399" : "#10b981";
      case "in progress":
        return isDarkColorScheme ? "#fbbf24" : "#f59e0b";
      case "todo":
        return isDarkColorScheme ? "#60a5fa" : "#3b82f6";
      default:
        return isDarkColorScheme ? "#9ca3af" : "#6b7280";
    }
  };

  // Function to filter last 7 days of data
  const getLast7DaysData = (data: Array<{ name: string; count: number }>) => {
    if (!data || data.length === 0) return [];

    // Take only the last 7 items
    return data.slice(-7);
  };

  if (loading && !data) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <Spinner size="lg" />
          <Text className="text-muted-foreground mt-4">
            {t("loading_dashboard")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-4">
          <AlertTriangle
            size={48}
            color={isDarkColorScheme ? "#f87171" : "#ef4444"}
          />
          <Text className="text-destructive text-center mt-4 mb-4">
            {error}
          </Text>
          <TouchableOpacity
            onPress={refetch}
            className="bg-primary px-4 py-2 rounded-lg"
          >
            <Text className="text-primary-foreground">{t("retry")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted-foreground">{t("no_data")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Calculate completion percentage
  const totalTasks = data.completionData.reduce(
    (sum, item) => sum + item.count,
    0
  );
  const completedTasks =
    data.completionData.find((item) => item.name === "Done")?.count || 0;
  const completionPercentage =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Calculate total time spent
  const totalTimeSpent = data.timeByPriority.reduce(
    (sum, item) => sum + item.count,
    0
  );

  // Calculate total events
  const totalEvents = data.eventDistribution.reduce(
    (sum, item) => sum + item.count,
    0
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View className="px-4 pt-4 pb-6">
          <View className="mb-4">
            <Text
              className="text-2xl font-bold text-foreground"
              style={{ color: theme }}
            >
              {t("dashboard")}
            </Text>
            <Text className="text-muted-foreground">
              {t("productivity_overview")}
            </Text>
          </View>

          {/* Key Metrics */}
          <View className="flex-row space-x-3 mb-6">
            <Card className="flex-1 p-4">
              <View className="flex-row items-center mb-2">
                <Target
                  size={16}
                  color={isDarkColorScheme ? "#60a5fa" : "#3b82f6"}
                />
                <Text className="ml-2 text-sm text-muted-foreground">
                  {t("tasks")}
                </Text>
              </View>
              <Text className="text-2xl font-bold text-foreground">
                {totalTasks}
              </Text>
              <Text className="text-xs text-muted-foreground">
                {t("completed", { count: completedTasks })}
              </Text>
            </Card>

            <Card className="flex-1 p-4">
              <View className="flex-row items-center mb-2">
                <Calendar
                  size={16}
                  color={isDarkColorScheme ? "#f59e0b" : "#f59e0b"}
                />
                <Text className="ml-2 text-sm text-muted-foreground">
                  {t("events")}
                </Text>
              </View>
              <Text className="text-2xl font-bold text-foreground">
                {totalEvents}
              </Text>
              <Text className="text-xs text-muted-foreground">
                {t("scheduled")}
              </Text>
            </Card>
          </View>
        </View>

        {/* Task Status Distribution */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            {t("task_status_distribution")}
          </Text>
          <Card className="p-4">
            <PieChart
              data={data.tasksByStatus.map((item) => ({
                label: t(item.name.toLowerCase()),
                value: item.count,
                color: getStatusColor(item.name),
              }))}
              size={200}
              title={t("tasks_by_status")}
            />
          </Card>
        </View>

        {/* Task Deadline Status */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            {t("task_deadline_status")}
          </Text>
          <Card className="p-4">
            <BarChart
              data={data.tasksByDeadline.map((item) => ({
                label: t(item.name.toLowerCase().replace(/ /g, "_")),
                value: item.count,
                color:
                  item.name === "Completed On Time"
                    ? isDarkColorScheme
                      ? "#34d399"
                      : "#10b981"
                    : item.name === "Completed Late"
                    ? isDarkColorScheme
                      ? "#fbbf24"
                      : "#f59e0b"
                    : item.name === "Overdue"
                    ? isDarkColorScheme
                      ? "#f87171"
                      : "#ef4444"
                    : isDarkColorScheme
                    ? "#60a5fa"
                    : "#3b82f6",
              }))}
              height={200}
              title={t("tasks_by_deadline_status")}
            />
          </Card>
        </View>

        {/* Time Spent Per Day */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            {t("time_spent_per_day")}
          </Text>
          <Card className="p-4">
            <LineChart
              data={getLast7DaysData(data.timeSpentPerDay).map((item) => ({
                label: item.name,
                value: item.count,
              }))}
              height={200}
              width={350}
              title={t("minutes_spent_daily")}
            />
          </Card>
        </View>

        {/* Events Per Day */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            {t("events_per_day")}
          </Text>
          <Card className="p-4">
            <LineChart
              data={getLast7DaysData(data.eventsByDay).map((item) => ({
                label: item.name,
                value: item.count,
              }))}
              height={200}
              width={350}
              color={isDarkColorScheme ? "#f59e0b" : "#f59e0b"}
              title={t("events_daily")}
            />
          </Card>
        </View>

        {/* Event Distribution */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            {t("event_distribution")}
          </Text>
          <Card className="p-4">
            <PieChart
              data={data.eventDistribution.map((item) => ({
                label: t(item.name.toLowerCase()),
                value: item.count,
                color:
                  item.name === "Upcoming"
                    ? isDarkColorScheme
                      ? "#34d399"
                      : "#10b981"
                    : isDarkColorScheme
                    ? "#f59e0b"
                    : "#f59e0b",
              }))}
              size={200}
              title={t("events_by_status")}
            />
          </Card>
        </View>

        {/* Weekly Completion Rates */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            {t("weekly_completion_rates")}
          </Text>
          <Card className="p-4">
            <BarChart
              data={data.dailyCompletionRates.map((item) => ({
                label: item.day,
                value: item.total > 0 ? (item.completed / item.total) * 100 : 0,
                color: isDarkColorScheme ? "#60a5fa" : "#3b82f6",
              }))}
              height={200}
              title={t("completion_rate")}
            />
          </Card>
        </View>

        {/* Bottom padding */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
