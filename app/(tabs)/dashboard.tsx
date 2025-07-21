import { AlertTriangle, Calendar, Target } from "lucide-react-native";
import React, { useState } from "react";
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

export default function DashboardTab() {
  const { data, loading, error, refetch } = useDashboard();
  const { isDarkColorScheme } = useColorScheme();
  const { theme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

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
            Loading dashboard...
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
            <Text className="text-primary-foreground">Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!data) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        <View className="flex-1 items-center justify-center">
          <Text className="text-muted-foreground">No data available</Text>
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
              Dashboard
            </Text>
            <Text className="text-muted-foreground">
              Your productivity overview
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
                  Tasks
                </Text>
              </View>
              <Text className="text-2xl font-bold text-foreground">
                {totalTasks}
              </Text>
              <Text className="text-xs text-muted-foreground">
                {completedTasks} completed
              </Text>
            </Card>

            <Card className="flex-1 p-4">
              <View className="flex-row items-center mb-2">
                <Calendar
                  size={16}
                  color={isDarkColorScheme ? "#f59e0b" : "#f59e0b"}
                />
                <Text className="ml-2 text-sm text-muted-foreground">
                  Events
                </Text>
              </View>
              <Text className="text-2xl font-bold text-foreground">
                {totalEvents}
              </Text>
              <Text className="text-xs text-muted-foreground">Scheduled</Text>
            </Card>
          </View>
        </View>

        {/* Task Status Distribution */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Task Status Distribution
          </Text>
          <Card className="p-4">
            <PieChart
              data={data.tasksByStatus.map((item) => ({
                label: item.name,
                value: item.count,
                color: getStatusColor(item.name),
              }))}
              size={200}
              title="Tasks by Status"
            />
          </Card>
        </View>

        {/* Task Deadline Status */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Task Deadline Status
          </Text>
          <Card className="p-4">
            <BarChart
              data={data.tasksByDeadline.map((item) => ({
                label: item.name,
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
              title="Tasks by Deadline Status"
            />
          </Card>
        </View>

        {/* Time Spent Per Day */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Time Spent Per Day (Last 7 Days)
          </Text>
          <Card className="p-4">
            <LineChart
              data={getLast7DaysData(data.timeSpentPerDay).map((item) => ({
                label: item.name,
                value: item.count,
              }))}
              height={200}
              width={350}
              title="Minutes Spent Daily"
            />
          </Card>
        </View>

        {/* Events Per Day */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Events Per Day (Last 7 Days)
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
              title="Events Daily"
            />
          </Card>
        </View>

        {/* Event Distribution */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Event Distribution
          </Text>
          <Card className="p-4">
            <PieChart
              data={data.eventDistribution.map((item) => ({
                label: item.name,
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
              title="Events by Status"
            />
          </Card>
        </View>

        {/* Weekly Completion Rates */}
        <View className="px-4 mb-6">
          <Text className="text-lg font-semibold text-foreground mb-4">
            Weekly Completion Rates
          </Text>
          <Card className="p-4">
            <BarChart
              data={data.dailyCompletionRates.map((item) => ({
                label: item.day,
                value: item.total > 0 ? (item.completed / item.total) * 100 : 0,
                color: isDarkColorScheme ? "#60a5fa" : "#3b82f6",
              }))}
              height={200}
              title="Completion Rate (%)"
            />
          </Card>
        </View>

        {/* Bottom padding */}
        <View className="h-6" />
      </ScrollView>
    </SafeAreaView>
  );
}
