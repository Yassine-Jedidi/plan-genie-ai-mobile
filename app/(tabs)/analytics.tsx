import {
  Activity,
  AlertTriangle,
  BarChart3,
  Calendar,
  Clock,
  RefreshCw,
  TrendingUp,
} from "lucide-react-native";
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
import { ProgressRing } from "~/components/ui/progress-ring";
import { Spinner } from "~/components/ui/spinner";
import { StatsCard } from "~/components/ui/stats-card";
import { Text } from "~/components/ui/text";
import { useAnalytics } from "~/hooks/useAnalytics";
import { useColorScheme } from "~/hooks/useColorScheme";
import { useTheme } from "~/hooks/useTheme";
import "~/lib/i18n";

type TimeFrame = "today" | "thisWeek" | "thisMonth" | "all";

export default function AnalyticsTab() {
  const { data, loading, error, refetch } = useAnalytics();
  const { isDarkColorScheme } = useColorScheme();
  const { theme } = useTheme();
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("all");
  const [refreshing, setRefreshing] = useState(false);
  const { t } = useTranslation();

  const timeFrames = [
    { key: "today", label: t("today"), icon: Calendar },
    { key: "thisWeek", label: t("this_week"), icon: BarChart3 },
    { key: "thisMonth", label: t("this_month"), icon: TrendingUp },
    { key: "all", label: t("all_time"), icon: Activity },
  ] as const;

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

  if (loading && !data) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <Spinner size="lg" />
          <Text className="text-muted-foreground mt-4">
            {t("loading_analytics")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center px-4">
          <AlertTriangle size={48} color="#ef4444" />
          <Text className="text-destructive text-center mt-4 mb-4">
            {error}
          </Text>
          <TouchableOpacity
            onPress={refetch}
            className="flex-row items-center bg-primary px-4 py-2 rounded-lg"
          >
            <RefreshCw size={16} color="white" />
            <Text className="text-white ml-2">{t("retry")}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted-foreground">
            {t("no_analytics_data")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentData = data[selectedTimeFrame];

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
          <Text
            className="text-2xl font-bold text-foreground mb-2"
            style={{ color: theme }}
          >
            {t("analytics")}
          </Text>
          <Text className="text-muted-foreground">
            {t("track_productivity")}
          </Text>
        </View>

        {/* Time Frame Selector */}
        <View className="px-4 mb-6">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="flex-row space-x-2"
          >
            {timeFrames.map(({ key, label, icon: Icon }) => (
              <TouchableOpacity
                key={key}
                onPress={() => setSelectedTimeFrame(key)}
                className={`flex-row items-center px-4 py-2 rounded-full border ${
                  selectedTimeFrame === key
                    ? "bg-primary border-primary"
                    : "bg-card border-border"
                }`}
              >
                <Icon
                  size={16}
                  color={
                    selectedTimeFrame === key
                      ? isDarkColorScheme
                        ? "#000"
                        : "#fff"
                      : "#6b7280"
                  }
                />
                <Text
                  className={`ml-2 font-medium ${
                    selectedTimeFrame === key
                      ? isDarkColorScheme
                        ? "text-black"
                        : "text-white"
                      : "text-muted-foreground"
                  }`}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Completion Overview */}
        <View className="px-4 mb-6">
          <Card className="p-6">
            <View className="items-center mb-6">
              <ProgressRing
                progress={currentData.completionPercentage}
                size={140}
                strokeWidth={12}
                color={isDarkColorScheme ? "#60a5fa" : "#3b82f6"}
                backgroundColor={isDarkColorScheme ? "#374151" : "#e5e7eb"}
              />
            </View>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-2xl font-bold text-foreground">
                  {currentData.done}
                </Text>
                <Text className="text-sm text-muted-foreground">Completed</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-foreground">
                  {currentData.undone}
                </Text>
                <Text className="text-sm text-muted-foreground">Pending</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-foreground">
                  {currentData.done + currentData.undone}
                </Text>
                <Text className="text-sm text-muted-foreground">Total</Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Key Stats */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            {t("key_metrics")}
          </Text>
          <View className="space-y-3">
            <StatsCard
              title={t("time_worked")}
              value={formatTime(currentData.totalMinutesWorked)}
              subtitle={t("total_minutes_spent")}
              icon={Clock}
              iconColor={isDarkColorScheme ? "#60a5fa" : "#3b82f6"}
            />
            <StatsCard
              title={t("overdue_tasks")}
              value={currentData.overdue}
              subtitle={t("tasks_past_deadline")}
              icon={AlertTriangle}
              iconColor={isDarkColorScheme ? "#f87171" : "#ef4444"}
            />
            <StatsCard
              title={t("events")}
              value={currentData.events.totalEvents}
              subtitle={`${currentData.events.upcomingEvents} ${t(
                "upcoming"
              )}, ${currentData.events.pastEvents} ${t("past")}`}
              icon={Calendar}
              iconColor={isDarkColorScheme ? "#34d399" : "#10b981"}
            />
          </View>
        </View>

        {/* Priority Distribution */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            {t("priority_distribution")}
          </Text>
          <Card className="p-4">
            <BarChart
              data={[
                {
                  label: t("high"),
                  value: currentData.priorityCounts.high,
                  color: isDarkColorScheme ? "#f87171" : "#ef4444",
                },
                {
                  label: t("medium"),
                  value: currentData.priorityCounts.medium,
                  color: isDarkColorScheme ? "#fbbf24" : "#f59e0b",
                },
                {
                  label: t("low"),
                  value: currentData.priorityCounts.low,
                  color: isDarkColorScheme ? "#34d399" : "#10b981",
                },
              ]}
              height={100}
              title={t("tasks_by_priority")}
            />
          </Card>
        </View>

        {/* Time Spent by Priority */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            {t("time_spent_by_priority")}
          </Text>
          <Card className="p-4">
            <BarChart
              data={[
                {
                  label: t("high"),
                  value: currentData.minutesSpentByPriority.high,
                  color: isDarkColorScheme ? "#f87171" : "#ef4444",
                },
                {
                  label: t("medium"),
                  value: currentData.minutesSpentByPriority.medium,
                  color: isDarkColorScheme ? "#fbbf24" : "#f59e0b",
                },
                {
                  label: t("low"),
                  value: currentData.minutesSpentByPriority.low,
                  color: isDarkColorScheme ? "#34d399" : "#10b981",
                },
              ]}
              height={100}
              title={t("minutes_spent")}
            />
          </Card>
        </View>

        {/* Overdue Breakdown */}
        {currentData.overdue > 0 && (
          <View className="px-4 mb-6">
            <Text className="text-lg font-semibold text-foreground mb-4">
              {t("overdue_breakdown")}
            </Text>
            <Card className="p-4">
              <View className="space-y-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-muted-foreground">
                    {t("days_1_3")}
                  </Text>
                  <Text className="font-semibold text-foreground">
                    {currentData.overdue1_3Days}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-muted-foreground">
                    {t("days_4_7")}
                  </Text>
                  <Text className="font-semibold text-foreground">
                    {currentData.overdue4_7Days}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-muted-foreground">
                    {t("days_7_plus")}
                  </Text>
                  <Text className="font-semibold text-foreground">
                    {currentData.overdueMoreThan7Days}
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Completion by Priority */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            {t("completion_by_priority")}
          </Text>
          <Card className="p-4">
            <View className="space-y-4">
              {["high", "medium", "low"].map((priority) => {
                const total =
                  currentData.priorityCounts[
                    priority as keyof typeof currentData.priorityCounts
                  ];
                const done =
                  currentData.donePriorityCounts[
                    priority as keyof typeof currentData.donePriorityCounts
                  ];
                const percentage = total > 0 ? (done / total) * 100 : 0;

                return (
                  <View key={priority} className="space-y-2">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-sm font-medium text-foreground capitalize">
                        {t(priority)} {t("priority")}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        {done}/{total} ({Math.round(percentage)}%)
                      </Text>
                    </View>
                    <View className="h-2 bg-muted rounded-full overflow-hidden">
                      <View
                        style={{
                          width: `${percentage}%`,
                          backgroundColor: getPriorityColor(priority),
                        }}
                        className="h-full rounded-full"
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          </Card>
        </View>

        {/* Bottom spacing */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
