import { router } from "expo-router";
import {
  BarChart3,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Plus,
  Trash2,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BilanEntryDialog } from "../../components/BilanEntryDialog";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Spinner } from "../../components/ui/spinner";
import { useAuth } from "../../contexts/AuthContext";
import { useColorScheme } from "../../hooks/useColorScheme";
import { bilanAPI, tasksAPI } from "../../services/api";

interface Task {
  id: string;
  title: string;
  priority: string | null;
  status: string | null;
  deadline: string | null;
}

interface BilanEntry {
  id: string;
  minutes_spent: number;
  notes: string | null;
  task: Task;
}

interface Bilan {
  id: string;
  date: string;
  entries: BilanEntry[];
}

export default function DailyTab() {
  const { user, loading: authLoading } = useAuth();
  const { isDarkColorScheme } = useColorScheme();

  // State
  const [currentBilan, setCurrentBilan] = useState<Bilan | null>(null);
  const [recentBilans, setRecentBilans] = useState<Bilan[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [editingEntry, setEditingEntry] = useState<BilanEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/sign-in");
    }
  }, [user, authLoading]);

  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [bilanData, recentData, tasksData] = await Promise.all([
        bilanAPI.getBilanByDate(selectedDate.toISOString().split("T")[0]),
        bilanAPI.getRecentBilans(6),
        tasksAPI.getTasks(),
      ]);

      setCurrentBilan(bilanData);
      setRecentBilans(recentData);
      setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching data:", error);
      Alert.alert("Error", "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [user, selectedDate]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, selectedDate]);

  const handleAddEntry = () => {
    setEditingEntry(null);
    setIsEditing(false);
    setDialogVisible(true);
  };

  const handleEditEntry = (entry: BilanEntry) => {
    setEditingEntry(entry);
    setIsEditing(true);
    setDialogVisible(true);
  };

  const handleSaveEntry = async (
    taskId: string,
    minutesSpent: number,
    notes: string
  ) => {
    if (!currentBilan) return;

    try {
      if (isEditing && editingEntry) {
        // Update existing entry
        await bilanAPI.addOrUpdateBilanEntry(
          currentBilan.id,
          taskId,
          minutesSpent,
          notes
        );
      } else {
        // Add new entry
        await bilanAPI.addOrUpdateBilanEntry(
          currentBilan.id,
          taskId,
          minutesSpent,
          notes
        );
      }

      // Refresh data
      await fetchData();
    } catch (error) {
      console.error("Error saving entry:", error);
      throw error;
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    try {
      await bilanAPI.deleteBilanEntry(entryId);
      await fetchData();
    } catch (error) {
      console.error("Error deleting entry:", error);
      throw error;
    }
  };

  const handleMarkTaskAsDone = async (task: Task) => {
    if (task.status === "Done") {
      Alert.alert(
        "Task Already Completed",
        "This task is already marked as done."
      );
      return;
    }

    Alert.alert(
      "Mark Task as Done",
      `Do you want to mark "${task.title}" as completed?\n\nThis will update the task status to "Done" and record the completion time.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Mark as Done",
          style: "default",
          onPress: async () => {
            try {
              await tasksAPI.updateTask(task.id, {
                title: task.title,
                deadline: task.deadline,
                priority: task.priority,
                status: "Done",
                completed_at: new Date().toISOString(),
              });

              // Refresh data to show updated task status
              await fetchData();

              Alert.alert("Success", "Task marked as completed!");
            } catch (error) {
              console.error("Error updating task:", error);
              Alert.alert(
                "Error",
                "Failed to mark task as completed. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    if (direction === "prev") {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getTotalTime = () => {
    if (!currentBilan) return 0;
    return currentBilan.entries.reduce(
      (total, entry) => total + entry.minutes_spent,
      0
    );
  };

  const getPriorityColor = (priority: string | null) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
    }
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "Done":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Planned":
      default:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
    }
  };

  const isToday = () => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Spinner size="lg" />
        <Text className="mt-4 text-foreground">Loading daily summary...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="p-4 border-b border-border">
        <Text className="text-2xl font-bold text-foreground mb-2">
          Daily Summary
        </Text>

        {/* Date Navigation */}
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={() => navigateDate("prev")}
            className="p-2 rounded-lg bg-muted"
          >
            <ChevronLeft
              size={20}
              color={isDarkColorScheme ? "#ffffff" : "#000000"}
            />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="text-lg font-semibold text-foreground">
              {formatDate(selectedDate)}
            </Text>
            {!isToday() && (
              <Text className="text-xs text-muted-foreground mt-1">
                Viewing past date
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={() => navigateDate("next")}
            className={`p-2 rounded-lg ${
              isToday() ? "bg-muted opacity-50" : "bg-muted"
            }`}
            disabled={isToday()}
          >
            <ChevronRight
              size={20}
              color={
                isToday()
                  ? isDarkColorScheme
                    ? "#6b7280"
                    : "#9ca3af"
                  : isDarkColorScheme
                  ? "#ffffff"
                  : "#000000"
              }
            />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View className="flex-row justify-between mt-4">
          <View className="flex-1 mr-2">
            <Card className="p-3">
              <View className="flex-row items-center">
                <Clock
                  size={16}
                  color={isDarkColorScheme ? "#9ca3af" : "#6b7280"}
                />
                <Text className="ml-2 text-sm text-muted-foreground">
                  Total Time
                </Text>
              </View>
              <Text className="text-lg font-bold text-foreground mt-1">
                {formatTime(getTotalTime())}
              </Text>
            </Card>
          </View>

          <View className="flex-1 ml-2">
            <Card className="p-3">
              <View className="flex-row items-center">
                <BarChart3
                  size={16}
                  color={isDarkColorScheme ? "#9ca3af" : "#6b7280"}
                />
                <Text className="ml-2 text-sm text-muted-foreground">
                  Tasks
                </Text>
              </View>
              <Text className="text-lg font-bold text-foreground mt-1">
                {currentBilan?.entries.length || 0}
              </Text>
            </Card>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Add Entry Button */}
        {isToday() && (
          <View className="p-4">
            <Button onPress={handleAddEntry} className="w-full">
              <View className="flex-row items-center justify-center">
                <Plus size={16} color={isDarkColorScheme ? "#000" : "#fff"} />
                <Text className="ml-2 text-primary-foreground font-medium">
                  Add Time Entry
                </Text>
              </View>
            </Button>
          </View>
        )}

        {/* Back to Today Button */}
        {!isToday() && (
          <View className="p-4">
            <Button onPress={goToToday} variant="outline" className="w-full">
              <View className="flex-row items-center justify-center">
                <Clock
                  size={16}
                  color={isDarkColorScheme ? "#9ca3af" : "#6b7280"}
                />
                <Text className="ml-2 text-foreground font-medium">
                  Back to Today
                </Text>
              </View>
            </Button>
          </View>
        )}

        {/* Time Entries */}
        <View className="px-4 pb-4 mt-4">
          <Text className="text-lg font-semibold text-foreground mb-3">
            Time Entries
          </Text>

          {currentBilan?.entries.length === 0 ? (
            <Card className="p-6">
              <View className="items-center">
                <Clock
                  size={48}
                  color={isDarkColorScheme ? "#9ca3af" : "#6b7280"}
                />
                <Text className="text-lg font-medium text-foreground mt-2">
                  No time entries yet
                </Text>
                <Text className="text-sm text-muted-foreground text-center mt-1">
                  {isToday()
                    ? "Start tracking your time by adding your first entry"
                    : "No entries recorded for this date"}
                </Text>
              </View>
            </Card>
          ) : (
            currentBilan?.entries.map((entry) => (
              <Card key={entry.id} className="p-4 mb-3">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <View className="flex-row items-center mb-2">
                      <Text className="text-lg font-semibold text-foreground">
                        {entry.task.title}
                      </Text>
                      {entry.task.priority && (
                        <Badge
                          className={`ml-2 ${getPriorityColor(
                            entry.task.priority
                          )}`}
                        >
                          {entry.task.priority}
                        </Badge>
                      )}
                      {entry.task.status && (
                        <Badge
                          className={`ml-2 ${getStatusColor(
                            entry.task.status
                          )}`}
                        >
                          {entry.task.status}
                        </Badge>
                      )}
                    </View>

                    <View className="flex-row items-center mb-2">
                      <Clock
                        size={16}
                        color={isDarkColorScheme ? "#9ca3af" : "#6b7280"}
                      />
                      <Text className="ml-1 text-foreground font-medium">
                        {formatTime(entry.minutes_spent)}
                      </Text>
                    </View>

                    {entry.notes && (
                      <Text className="text-sm text-muted-foreground">
                        {entry.notes}
                      </Text>
                    )}
                  </View>

                  <View className="flex-row">
                    {isToday() ? (
                      <>
                        <TouchableOpacity
                          onPress={() => handleEditEntry(entry)}
                          className="p-2 mr-1"
                        >
                          <Edit
                            size={16}
                            color={isDarkColorScheme ? "#9ca3af" : "#6b7280"}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => {
                            Alert.alert(
                              "Delete Entry",
                              "Are you sure you want to delete this entry?",
                              [
                                { text: "Cancel", style: "cancel" },
                                {
                                  text: "Delete",
                                  style: "destructive",
                                  onPress: () => handleDeleteEntry(entry.id),
                                },
                              ]
                            );
                          }}
                          className="p-2"
                        >
                          <Trash2 size={16} color="#ef4444" />
                        </TouchableOpacity>
                        {entry.task.status !== "Done" && (
                          <TouchableOpacity
                            onPress={() => handleMarkTaskAsDone(entry.task)}
                            className="p-2 ml-1 bg-green-100 dark:bg-green-900 rounded-full"
                          >
                            <CheckCircle size={16} color="#22c55e" />
                          </TouchableOpacity>
                        )}
                      </>
                    ) : (
                      <View className="flex-row items-center">
                        {entry.task.status === "Done" && (
                          <View className="flex-row items-center mr-2">
                            <CheckCircle size={16} color="#22c55e" />
                            <Text className="text-xs text-green-600 ml-1 font-medium">
                              Completed
                            </Text>
                          </View>
                        )}
                        <Text className="text-xs text-muted-foreground italic">
                          Read-only
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </Card>
            ))
          )}
        </View>

        {/* Recent Bilans */}
        {isToday() && recentBilans.length > 1 && (
          <View className="px-4 pb-4">
            <Text className="text-lg font-semibold text-foreground mb-3">
              Recent Days
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {recentBilans
                .filter((bilan) => bilan.id !== currentBilan?.id)
                .slice(0, 6)
                .map((bilan) => {
                  const bilanDate = new Date(bilan.date);
                  const totalTime = bilan.entries.reduce(
                    (sum, entry) => sum + entry.minutes_spent,
                    0
                  );

                  return (
                    <TouchableOpacity
                      key={bilan.id}
                      onPress={() => setSelectedDate(bilanDate)}
                      className="mr-3"
                    >
                      <Card className="p-3 min-w-[120px]">
                        <Text className="text-sm font-medium text-foreground">
                          {bilanDate.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </Text>
                        <Text className="text-xs text-muted-foreground mt-1">
                          {bilanDate.toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                        </Text>
                        <View className="flex-row items-center mt-2">
                          <Clock
                            size={12}
                            color={isDarkColorScheme ? "#9ca3af" : "#6b7280"}
                          />
                          <Text className="ml-1 text-xs text-foreground">
                            {formatTime(totalTime)}
                          </Text>
                        </View>
                      </Card>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      {/* Bilan Entry Dialog */}
      <BilanEntryDialog
        visible={dialogVisible}
        onClose={() => setDialogVisible(false)}
        onSave={handleSaveEntry}
        onDelete={handleDeleteEntry}
        tasks={tasks}
        entry={editingEntry}
        isEditing={isEditing}
        currentEntries={currentBilan?.entries || []}
      />
    </View>
  );
}
