import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";
import { tasksAPI } from "../services/api";
import { Button } from "./ui/button";
import { ModalDialog } from "./ui/modal";

interface Task {
  id: string;
  title: string;
  deadline: string | null;
  priority: string | null;
  status: string | null;
}

interface EditTaskDialogProps {
  visible: boolean;
  onClose: () => void;
  task: Task | null;
  onTaskUpdated: () => void;
}

export function EditTaskDialog({
  visible,
  onClose,
  task,
  onTaskUpdated,
}: EditTaskDialogProps) {
  const { isDarkColorScheme } = useColorScheme();
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("Planned");
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const priorityOptions = ["low", "medium", "high"];
  const statusOptions = ["Planned", "In Progress", "Done"];

  // Update form when task changes
  React.useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDeadline(task.deadline || "");
      // Convert task priority to lowercase for comparison
      const taskPriority = task.priority?.toLowerCase() || "medium";
      setPriority(taskPriority);
      setStatus(task.status || "Planned");

      // Set selected date if task has deadline
      if (task.deadline) {
        setSelectedDate(new Date(task.deadline));
      }
    }
  }, [task]);

  const getPriorityColor = (priorityLevel: string) => {
    switch (priorityLevel) {
      case "high":
        return "bg-red-500 border-red-500";
      case "medium":
        return "bg-orange-500 border-orange-500";
      case "low":
        return "bg-green-500 border-green-500";
      default:
        return "bg-secondary border-border";
    }
  };

  const getStatusColor = (statusLevel: string) => {
    switch (statusLevel) {
      case "Planned":
        return "bg-orange-500 border-orange-500";
      case "In Progress":
        return "bg-blue-500 border-blue-500";
      case "Done":
        return "bg-green-500 border-green-500";
      default:
        return "bg-secondary border-border";
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      setDeadline(date.toISOString());
    }
  };

  const formatSelectedDate = (date: Date) => {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSave = async () => {
    if (!task || !title.trim()) {
      Alert.alert("Error", "Please enter a task title");
      return;
    }

    setLoading(true);
    try {
      await tasksAPI.updateTask(task.id, {
        title: title.trim(),
        deadline: deadline || null,
        priority: priority,
        status: status,
        completed_at: status === "Done" ? new Date().toISOString() : null,
      });

      Alert.alert("Success", "Task updated successfully", [
        {
          text: "OK",
          onPress: () => {
            onClose();
            onTaskUpdated();
          },
        },
      ]);
    } catch (error) {
      Alert.alert("Error", "Failed to update task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <ModalDialog
      visible={visible}
      onClose={handleCancel}
      title="Edit Task"
      showCloseButton={true}
    >
      <ScrollView className="max-h-[500px]">
        {/* Title */}
        <View className="mb-5">
          <Text className="text-sm font-medium text-primary mb-2">
            Task Title
          </Text>
          <TextInput
            className="border border-border rounded-lg px-4 py-3 text-foreground bg-primary-foreground  "
            value={title}
            onChangeText={setTitle}
            placeholder="Enter task title"
            placeholderTextColor={isDarkColorScheme ? "#9ca3af" : "#6b7280"}
          />
        </View>

        {/* Deadline */}
        <View className="mb-5">
          <Text className="text-sm font-medium text-foreground mb-2">
            Deadline
          </Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(!showDatePicker)}
            className="flex-row items-center border border-border rounded-lg px-4 py-3 bg-background"
          >
            <Calendar
              size={20}
              color={isDarkColorScheme ? "#9ca3af" : "#6b7280"}
            />
            <Text className="flex-1 ml-3 text-foreground">
              {deadline ? formatSelectedDate(selectedDate) : "Select deadline"}
            </Text>
          </TouchableOpacity>

          {/* Inline Date Time Picker */}
          {showDatePicker && (
            <View className="mt-2 border border-border rounded-lg p-3 bg-secondary">
              <DateTimePicker
                value={selectedDate}
                mode="datetime"
                display="default"
                onChange={handleDateChange}
              />
            </View>
          )}
        </View>

        {/* Priority */}
        <View className="mb-5">
          <Text className="text-sm font-medium text-foreground mb-2">
            Priority
          </Text>
          <View className="flex-row space-x-2">
            {priorityOptions.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setPriority(option)}
                className={`px-4 py-2 rounded-full border ${
                  priority === option
                    ? getPriorityColor(option)
                    : "bg-secondary border-border"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    priority === option ? "text-white" : "text-foreground"
                  }`}
                >
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Status */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-foreground mb-2">
            Status
          </Text>
          <View className="flex-row space-x-2">
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setStatus(option)}
                className={`px-4 py-2 rounded-full border ${
                  status === option
                    ? getStatusColor(option)
                    : "bg-secondary border-border"
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    status === option ? "text-white" : "text-foreground"
                  }`}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="flex-row gap-x-4">
          <Button
            onPress={handleCancel}
            className="flex-1 bg-secondary"
            disabled={loading}
          >
            <Text className="text-foreground font-medium">Cancel</Text>
          </Button>
          <Button
            onPress={handleSave}
            className="flex-1 bg-primary"
            disabled={loading}
          >
            <Text className="text-primary-foreground font-medium">
              {loading ? "Saving..." : "Save Changes"}
            </Text>
          </Button>
        </View>
      </ScrollView>
    </ModalDialog>
  );
}
