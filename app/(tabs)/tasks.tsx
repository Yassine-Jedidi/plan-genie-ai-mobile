import { router } from "expo-router";
import {
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  Edit,
  Trash2,
} from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import { useTheme } from "~/hooks/useTheme";
import "~/lib/i18n";
import { EditTaskDialog } from "../../components/EditTaskDialog";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Spinner } from "../../components/ui/spinner";
import { useAuth } from "../../contexts/AuthContext";
import { useColorScheme } from "../../hooks/useColorScheme";
import { tasksAPI } from "../../services/api";
import { priorityService } from "../../utils/priority";

interface Task {
  id: string;
  title: string;
  deadline: string | null;
  deadline_text: string | null;
  priority: string | null;
  status: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

type DateFilter =
  | "all"
  | "today"
  | "tomorrow"
  | "this-week"
  | "overdue"
  | "completed";

export default function TasksTab() {
  const { user, loading: authLoading } = useAuth();
  const { isDarkColorScheme } = useColorScheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<DateFilter>("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const { theme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/sign-in");
    }
  }, [user, authLoading]);

  const fetchTasks = async () => {
    if (!user) return;
    try {
      setError(null);
      const data = await tasksAPI.getTasks();
      setTasks(data);
    } catch (err) {
      setError(t("failed_to_load_data"));
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Filter tasks based on selected date filter
  useEffect(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    let filtered = tasks;

    switch (selectedFilter) {
      case "today":
        filtered = tasks.filter((task) => {
          if (!task.deadline) return false;
          const taskDate = new Date(task.deadline);
          const taskDay = new Date(
            taskDate.getFullYear(),
            taskDate.getMonth(),
            taskDate.getDate()
          );
          return taskDay.getTime() === today.getTime();
        });
        break;
      case "tomorrow":
        filtered = tasks.filter((task) => {
          if (!task.deadline) return false;
          const taskDate = new Date(task.deadline);
          const taskDay = new Date(
            taskDate.getFullYear(),
            taskDate.getMonth(),
            taskDate.getDate()
          );
          return taskDay.getTime() === tomorrow.getTime();
        });
        break;
      case "this-week":
        filtered = tasks.filter((task) => {
          if (!task.deadline) return false;
          const taskDate = new Date(task.deadline);
          return taskDate >= today && taskDate < nextWeek;
        });
        break;
      case "overdue":
        filtered = tasks.filter((task) => {
          if (!task.deadline || task.status === "Done") return false;
          return new Date(task.deadline) < today;
        });
        break;
      case "completed":
        filtered = tasks.filter((task) => task.status === "Done");
        break;
      case "all":
      default:
        filtered = tasks;
        break;
    }

    setFilteredTasks(filtered);
  }, [tasks, selectedFilter]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No deadline";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  const getDueIn = (deadline: string | null) => {
    if (!deadline) return "No deadline";
    try {
      const deadlineDate = new Date(deadline);
      const now = new Date();
      const diffTime = deadlineDate.getTime() - now.getTime();

      if (diffTime < 0) {
        // Overdue
        const diffDays = Math.ceil(Math.abs(diffTime) / (1000 * 60 * 60 * 24));
        if (diffDays >= 30) {
          const months = Math.floor(diffDays / 30);
          return `${months} month${months !== 1 ? "s" : ""} overdue`;
        } else if (diffDays >= 1) {
          return `${diffDays} day${diffDays !== 1 ? "s" : ""} overdue`;
        } else {
          const diffHours = Math.ceil(Math.abs(diffTime) / (1000 * 60 * 60));
          return `${diffHours} hour${diffHours !== 1 ? "s" : ""} overdue`;
        }
      } else if (diffTime === 0) {
        return "Due now";
      } else {
        // Future deadline
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));

        if (diffDays >= 30) {
          const months = Math.floor(diffDays / 30);
          return `Due in ${months} month${months !== 1 ? "s" : ""}`;
        } else if (diffDays >= 1) {
          return `Due in ${diffDays} day${diffDays !== 1 ? "s" : ""}`;
        } else if (diffHours >= 1) {
          return `Due in ${diffHours} hour${diffHours !== 1 ? "s" : ""}`;
        } else {
          const diffMinutes = Math.ceil(diffTime / (1000 * 60));
          return `Due in ${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""}`;
        }
      }
    } catch {
      return "Invalid date";
    }
  };

  const getPriorityVariant = (priority: string | null) => {
    if (!priority) return "medium";
    const classifiedPriority = priorityService.classifyPriority(priority);
    return classifiedPriority as "high" | "medium" | "low";
  };

  const getStatusVariant = (status: string | null) => {
    if (!status) return "planned";
    const statusLower = status.toLowerCase();
    if (statusLower.includes("done") || statusLower.includes("completed"))
      return "done";
    if (statusLower.includes("progress")) return "in-progress";
    return "planned";
  };

  const handleDeleteTask = async (taskId: string) => {
    Alert.alert(t("delete_task"), t("delete_task_confirm"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await tasksAPI.deleteTask(taskId);
            setTasks(tasks.filter((task) => task.id !== taskId));
          } catch (err) {
            Alert.alert(t("error"), t("failed_to_delete_task"));
          }
        },
      },
    ]);
  };

  const handleStatusToggle = async (task: Task) => {
    let newStatus: string;
    let newCompletedAt: string | null = null;
    let confirmMessage: string;

    // Determine what the next status will be
    switch (task.status) {
      case "Done":
        newStatus = "Planned";
        newCompletedAt = null;
        confirmMessage = `Do you want to change "${task.title}" status to Planned?`;
        break;
      case "In Progress":
        newStatus = "Done";
        newCompletedAt = new Date().toISOString();
        confirmMessage = `Do you want to mark "${task.title}" as Done?`;
        break;
      case "Planned":
      default:
        newStatus = "In Progress";
        newCompletedAt = null;
        confirmMessage = `Do you want to change "${task.title}" status to In Progress?`;
        break;
    }

    // Show confirmation dialog
    Alert.alert(t("change_status"), confirmMessage, [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("yes"),
        onPress: async () => {
          try {
            await tasksAPI.updateTask(task.id, {
              title: task.title,
              deadline: task.deadline,
              priority: task.priority,
              status: newStatus,
              completed_at: newCompletedAt,
            });
            setTasks(
              tasks.map((t) =>
                t.id === task.id
                  ? { ...t, status: newStatus, completed_at: newCompletedAt }
                  : t
              )
            );
          } catch (err) {
            Alert.alert(t("error"), t("failed_to_update_task"));
          }
        },
      },
    ]);
  };

  const handleEditTask = (task: Task) => {
    setSelectedTask(task);
    setEditDialogVisible(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogVisible(false);
    setSelectedTask(null);
  };

  const handleTaskUpdated = () => {
    fetchTasks(); // Refresh the tasks list
  };

  const renderItem = useCallback(
    ({ item }: { item: Task }) => {
      const isOverdue =
        item.deadline &&
        new Date(item.deadline) < new Date() &&
        item.status !== "Done";
      return (
        <View
          className={`flex-row items-center border-b border-border py-4 px-5 ${
            isOverdue ? "border-l-4 border-l-red-500 bg-card" : "bg-card"
          }`}
        >
          <View className="flex-1">
            <Text
              className="text-base font-semibold text-foreground mb-1"
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <View className="flex-row items-center mt-1 mb-1 gap-1">
              <Badge variant={getPriorityVariant(item.priority)}>
                {item.priority
                  ? priorityService.getPriorityLabel(
                      getPriorityVariant(item.priority)
                    )
                  : "Medium"}
              </Badge>
              <Badge variant={getStatusVariant(item.status)}>
                {item.status || "Planned"}
              </Badge>
            </View>
            <View className="flex-row items-center mt-1 space-x-2">
              <Calendar
                size={16}
                color={isDarkColorScheme ? "#9ca3af" : "#6b7280"}
              />
              <Text className="text-sm text-muted-foreground ml-1">
                {formatDate(item.deadline)}
              </Text>
            </View>
            <View className="flex-row items-center mt-1 space-x-2">
              <Clock
                size={16}
                color={isDarkColorScheme ? "#9ca3af" : "#6b7280"}
              />
              <Text className="text-sm text-muted-foreground ml-1">
                {getDueIn(item.deadline)}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => handleStatusToggle(item)}
            className="ml-3"
          >
            {item.status === "Done" ? (
              <CheckCircle size={28} color="#22c55e" />
            ) : item.status === "In Progress" ? (
              <View className="w-7 h-7 rounded-full border-2 border-blue-500 bg-blue-100 items-center justify-center">
                <View className="w-2 h-2 rounded-full bg-blue-500" />
              </View>
            ) : (
              <Circle size={28} color="#f97316" />
            )}
          </TouchableOpacity>
        </View>
      );
    },
    [tasks, isDarkColorScheme]
  );

  const renderHiddenItem = useCallback(
    ({ item }: { item: Task }) => (
      <View className="items-center flex-1 flex-row justify-end border-b border-border">
        <TouchableOpacity
          className="items-center justify-center w-16 h-full bg-orange-500"
          onPress={() => handleEditTask(item)}
        >
          <Edit size={20} color="#fff" />
          <Text className="text-white text-xs mt-1">{t("edit")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center justify-center w-16 h-full bg-red-500"
          onPress={() => handleDeleteTask(item.id)}
        >
          <Trash2 size={20} color="#fff" />
          <Text className="text-white text-xs mt-1">{t("delete")}</Text>
        </TouchableOpacity>
      </View>
    ),
    [tasks]
  );

  const FilterChip = ({
    filter,
    label,
    count,
  }: {
    filter: DateFilter;
    label: string;
    count: number;
  }) => (
    <TouchableOpacity
      className={`px-4 py-2.5 rounded-full border mr-2 ${
        selectedFilter === filter
          ? "bg-primary border-primary shadow-sm"
          : "bg-secondary border-border"
      }`}
      onPress={() => setSelectedFilter(filter)}
      activeOpacity={0.7}
    >
      <Text
        className={`text-sm font-medium ${
          selectedFilter === filter
            ? "text-primary-foreground"
            : "text-foreground"
        }`}
      >
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  const getFilterCount = (filter: DateFilter) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    switch (filter) {
      case "today":
        return tasks.filter((task) => {
          if (!task.deadline) return false;
          const taskDate = new Date(task.deadline);
          const taskDay = new Date(
            taskDate.getFullYear(),
            taskDate.getMonth(),
            taskDate.getDate()
          );
          return taskDay.getTime() === today.getTime();
        }).length;
      case "tomorrow":
        return tasks.filter((task) => {
          if (!task.deadline) return false;
          const taskDate = new Date(task.deadline);
          const taskDay = new Date(
            taskDate.getFullYear(),
            taskDate.getMonth(),
            taskDate.getDate()
          );
          return taskDay.getTime() === tomorrow.getTime();
        }).length;
      case "this-week":
        return tasks.filter((task) => {
          if (!task.deadline) return false;
          const taskDate = new Date(task.deadline);
          return taskDate >= today && taskDate < nextWeek;
        }).length;
      case "overdue":
        return tasks.filter((task) => {
          if (!task.deadline || task.status === "Done") return false;
          return new Date(task.deadline) < today;
        }).length;
      case "completed":
        return tasks.filter((task) => task.status === "Done").length;
      case "all":
      default:
        return tasks.length;
    }
  };

  if (authLoading || loading) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Spinner size="lg" className="mb-4" />
        <Text className="text-lg text-muted-foreground">Loading tasks...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background p-6">
        <Text className="text-base text-destructive mb-4">{error}</Text>
        <Button onPress={fetchTasks}>
          <Text className="text-primary-foreground">Retry</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <View className="flex-row justify-between items-center px-5 pt-6 pb-3 bg-background">
        <Text
          className="text-2xl font-bold text-foreground"
          style={{ color: theme }}
        >
          {t("tasks")}
        </Text>
        <Text className="text-sm text-muted-foreground">
          {filteredTasks.length}{" "}
          {filteredTasks.length === 1
            ? t("task_label")
            : t("tasks_label_plural")}
        </Text>
      </View>

      {/* Filter Chips */}
      <View className="bg-background border-b border-border">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-5 py-3"
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <FilterChip
            filter="all"
            label={t("all")}
            count={getFilterCount("all")}
          />
          <FilterChip
            filter="today"
            label={t("today")}
            count={getFilterCount("today")}
          />
          <FilterChip
            filter="tomorrow"
            label={t("tomorrow")}
            count={getFilterCount("tomorrow")}
          />
          <FilterChip
            filter="this-week"
            label={t("this_week_label")}
            count={getFilterCount("this-week")}
          />
          <FilterChip
            filter="overdue"
            label={t("overdue")}
            count={getFilterCount("overdue")}
          />
          <FilterChip
            filter="completed"
            label={t("completed_filter")}
            count={getFilterCount("completed")}
          />
        </ScrollView>
      </View>

      <SwipeListView
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-128}
        disableRightSwipe={true}
        leftOpenValue={90}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 0 }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center bg-background p-6">
            <Text className="text-lg text-muted-foreground mb-2 text-center">
              {t("no_tasks_found")}
            </Text>
            <Text className="text-sm text-muted-foreground text-center">
              {selectedFilter === "all"
                ? t("create_first_task")
                : t("no_tasks_for_filter", { filter: t(selectedFilter) })}
            </Text>
          </View>
        }
      />

      {/* Edit Task Dialog */}
      <EditTaskDialog
        visible={editDialogVisible}
        onClose={handleEditDialogClose}
        task={selectedTask}
        onTaskUpdated={handleTaskUpdated}
      />
    </View>
  );
}
