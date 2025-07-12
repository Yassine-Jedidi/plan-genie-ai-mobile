import {
  AlertCircle,
  Calendar,
  Clock,
  Save,
  Trash2,
  X,
} from "lucide-react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

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

interface BilanEntryDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (
    taskId: string,
    minutesSpent: number,
    notes: string
  ) => Promise<void>;
  onDelete?: (entryId: string) => Promise<void>;
  tasks: Task[];
  entry?: BilanEntry | null;
  isEditing?: boolean;
}

export function BilanEntryDialog({
  visible,
  onClose,
  onSave,
  onDelete,
  tasks,
  entry,
  isEditing = false,
}: BilanEntryDialogProps) {
  const { isDarkColorScheme } = useColorScheme();
  const [selectedTaskId, setSelectedTaskId] = useState<string>("");
  const [minutesSpent, setMinutesSpent] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Filter out overdue and completed tasks
  const availableTasks = useMemo(() => {
    const now = new Date();
    return tasks.filter((task) => {
      // Exclude completed tasks
      if (task.status === "Done") return false;

      // Exclude overdue tasks
      if (task.deadline && new Date(task.deadline) < now) return false;

      return true;
    });
  }, [tasks]);

  useEffect(() => {
    if (entry && isEditing) {
      setSelectedTaskId(entry.task.id);
      setMinutesSpent(entry.minutes_spent.toString());
      setNotes(entry.notes || "");
    } else {
      setSelectedTaskId("");
      setMinutesSpent("");
      setNotes("");
    }
  }, [entry, isEditing, visible]);

  const handleSave = async () => {
    if (!selectedTaskId) {
      Alert.alert("Error", "Please select a task");
      return;
    }

    const minutes = parseInt(minutesSpent);
    if (isNaN(minutes) || minutes <= 0) {
      Alert.alert("Error", "Please enter a valid number of minutes");
      return;
    }

    setLoading(true);
    try {
      await onSave(selectedTaskId, minutes, notes);
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to save entry");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!entry || !onDelete) return;

    Alert.alert("Delete Entry", "Are you sure you want to delete this entry?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setLoading(true);
          try {
            await onDelete(entry.id);
            onClose();
          } catch (error) {
            Alert.alert("Error", "Failed to delete entry");
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
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

  const getPriorityLabel = (priority: string | null) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "High";
      case "medium":
        return "Medium";
      case "low":
        return "Low";
      default:
        return "Medium";
    }
  };

  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return null;
    try {
      const date = new Date(deadline);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return null;
    }
  };

  const selectedTask = availableTasks.find(
    (task) => task.id === selectedTaskId
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <View className="flex-1 bg-background">
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-border">
            <View>
              <Text className="text-xl font-bold text-foreground">
                {isEditing ? "Edit Time Entry" : "Add Time Entry"}
              </Text>
              <Text className="text-sm mt-1 text-muted-foreground">
                Track your time spent on tasks
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 rounded-full items-center justify-center bg-muted"
            >
              <X size={20} color={isDarkColorScheme ? "#ffffff" : "#000000"} />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1 p-6"
            showsVerticalScrollIndicator={false}
          >
            {/* Task Selection */}
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <View className="w-8 h-8 rounded-full items-center justify-center mr-3 bg-primary/10">
                  <Calendar
                    size={16}
                    color={isDarkColorScheme ? "#ffffff" : "#000000"}
                  />
                </View>
                <View>
                  <Text className="text-lg font-semibold text-foreground">
                    Select Task
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Choose a task to track time for
                  </Text>
                </View>
              </View>

              {availableTasks.length === 0 ? (
                <View className="p-6 rounded-xl border-2 border-dashed border-border bg-card">
                  <View className="items-center">
                    <AlertCircle
                      size={48}
                      color={isDarkColorScheme ? "#9ca3af" : "#6b7280"}
                    />
                    <Text className="text-lg font-medium mt-3 text-foreground">
                      No Available Tasks
                    </Text>
                    <Text className="text-sm text-center mt-2 text-muted-foreground">
                      All your tasks are either completed or overdue. Create new
                      tasks to start tracking time.
                    </Text>
                  </View>
                </View>
              ) : (
                <View className="space-y-3">
                  {availableTasks.map((task) => (
                    <TouchableOpacity
                      key={task.id}
                      onPress={() => setSelectedTaskId(task.id)}
                      className={`p-4 rounded-xl border-2 ${
                        selectedTaskId === task.id
                          ? "border-primary bg-primary/10"
                          : "border-border bg-card"
                      }`}
                    >
                      <View className="flex-row items-start justify-between">
                        <View className="flex-1">
                          <Text
                            className={`text-base font-semibold mb-2 ${
                              selectedTaskId === task.id
                                ? "text-primary"
                                : "text-foreground"
                            }`}
                          >
                            {task.title}
                          </Text>
                          <View className="flex-row items-center gap-x-2">
                            <Badge className={getPriorityColor(task.priority)}>
                              {getPriorityLabel(task.priority)}
                            </Badge>
                            {task.deadline && (
                              <View className="flex-row items-center">
                                <Clock
                                  size={12}
                                  color={
                                    isDarkColorScheme ? "#9ca3af" : "#6b7280"
                                  }
                                />
                                <Text className="text-xs ml-1 text-muted-foreground">
                                  {formatDeadline(task.deadline)}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                        {selectedTaskId === task.id && (
                          <View className="w-6 h-6 rounded-full items-center justify-center bg-primary">
                            <Text className="text-primary-foreground text-sm font-bold">
                              ✓
                            </Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Time Input */}
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <View className="w-8 h-8 rounded-full items-center justify-center mr-3 bg-green-100 dark:bg-green-900">
                  <Clock
                    size={16}
                    color={isDarkColorScheme ? "#4ade80" : "#22c55e"}
                  />
                </View>
                <View>
                  <Text className="text-lg font-semibold text-foreground">
                    Time Spent
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    How long did you work on this task?
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center border-2 rounded-xl px-4 py-3 border-border bg-card">
                <TextInput
                  value={minutesSpent}
                  onChangeText={setMinutesSpent}
                  placeholder="Enter minutes (e.g., 30)"
                  placeholderTextColor={
                    isDarkColorScheme ? "#9ca3af" : "#6b7280"
                  }
                  keyboardType="numeric"
                  className="flex-1 text-base text-foreground"
                />
                <Text className="text-sm font-medium text-muted-foreground">
                  minutes
                </Text>
              </View>

              {minutesSpent && !isNaN(parseInt(minutesSpent)) && (
                <View className="mt-3 p-3 rounded-lg bg-primary/10">
                  <Text className="text-sm text-primary">
                    {parseInt(minutesSpent) >= 60
                      ? `${Math.floor(parseInt(minutesSpent) / 60)}h ${
                          parseInt(minutesSpent) % 60
                        }m`
                      : `${parseInt(minutesSpent)} minutes`}
                  </Text>
                </View>
              )}
            </View>

            {/* Notes */}
            <View className="mb-8">
              <View className="flex-row items-center mb-4">
                <View className="w-8 h-8 rounded-full items-center justify-center mr-3 bg-purple-100 dark:bg-purple-900">
                  <Text className="text-lg">📝</Text>
                </View>
                <View>
                  <Text className="text-lg font-semibold text-foreground">
                    Notes (Optional)
                  </Text>
                  <Text className="text-sm text-muted-foreground">
                    Add details about what you worked on
                  </Text>
                </View>
              </View>

              <View className="border-2 rounded-xl px-4 py-3 border-border bg-card">
                <TextInput
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="What did you accomplish? Any challenges or insights?"
                  placeholderTextColor={
                    isDarkColorScheme ? "#9ca3af" : "#6b7280"
                  }
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  className="text-base text-foreground"
                />
              </View>
            </View>

            {/* Selected Task Summary */}
            {selectedTask && (
              <View className="mb-6 p-4 rounded-xl bg-card border border-border">
                <Text className="text-sm font-medium mb-2 text-muted-foreground">
                  Selected Task Summary
                </Text>
                <Text className="text-base font-semibold mb-2 text-foreground">
                  {selectedTask.title}
                </Text>
                <View className="flex-row items-center space-x-2">
                  <Badge className={getPriorityColor(selectedTask.priority)}>
                    {getPriorityLabel(selectedTask.priority)} Priority
                  </Badge>
                  {selectedTask.deadline && (
                    <View className="flex-row items-center">
                      <Clock
                        size={12}
                        color={isDarkColorScheme ? "#9ca3af" : "#6b7280"}
                      />
                      <Text className="text-xs ml-1 text-muted-foreground">
                        Due: {formatDeadline(selectedTask.deadline)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Footer */}
          <View className="flex-row justify-between p-6 border-t border-border">
            {isEditing && onDelete && (
              <Button
                variant="destructive"
                onPress={handleDelete}
                disabled={loading}
                className="flex-1 mr-3"
              >
                <View className="flex-row items-center justify-center">
                  <Trash2 size={16} color="#ffffff" />
                  <Text className="ml-2 text-white font-medium">Delete</Text>
                </View>
              </Button>
            )}
            <Button
              onPress={handleSave}
              disabled={
                loading ||
                !selectedTaskId ||
                !minutesSpent ||
                availableTasks.length === 0
              }
              className={`${isEditing && onDelete ? "flex-1 ml-3" : "flex-1"}`}
            >
              <View className="flex-row items-center justify-center">
                <Save size={16} color={isDarkColorScheme ? "#000" : "#fff"} />
                <Text className="ml-2 font-medium text-primary-foreground">
                  {loading ? "Saving..." : "Save Entry"}
                </Text>
              </View>
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
