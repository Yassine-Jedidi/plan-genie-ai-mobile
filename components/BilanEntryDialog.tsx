import { Clock, Save, Trash2, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useColorScheme } from "../hooks/useColorScheme";
import { Button } from "./ui/button";

interface Task {
  id: string;
  title: string;
  priority: string | null;
  status: string | null;
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
    switch (priority) {
      case "High":
        return "text-red-500";
      case "Medium":
        return "text-yellow-500";
      case "Low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View
        className={`flex-1 ${isDarkColorScheme ? "bg-gray-900" : "bg-white"}`}
      >
        {/* Header */}
        <View
          className={`flex-row items-center justify-between p-4 border-b ${
            isDarkColorScheme ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <Text
            className={`text-lg font-semibold ${
              isDarkColorScheme ? "text-white" : "text-gray-900"
            }`}
          >
            {isEditing ? "Edit Time Entry" : "Add Time Entry"}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color={isDarkColorScheme ? "#ffffff" : "#000000"} />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Task Selection */}
          <View className="mb-6">
            <Text
              className={`text-sm font-medium mb-2 ${
                isDarkColorScheme ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Task *
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-2"
            >
              {tasks.map((task) => (
                <TouchableOpacity
                  key={task.id}
                  onPress={() => setSelectedTaskId(task.id)}
                  className={`mr-2 px-3 py-2 rounded-lg border ${
                    selectedTaskId === task.id
                      ? "bg-blue-500 border-blue-500"
                      : isDarkColorScheme
                      ? "border-gray-600 bg-gray-800"
                      : "border-gray-300 bg-gray-50"
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      selectedTaskId === task.id
                        ? "text-white"
                        : isDarkColorScheme
                        ? "text-white"
                        : "text-gray-900"
                    }`}
                  >
                    {task.title}
                  </Text>
                  {task.priority && (
                    <Text
                      className={`text-xs ${getPriorityColor(task.priority)}`}
                    >
                      {task.priority}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Time Spent */}
          <View className="mb-6">
            <Text
              className={`text-sm font-medium mb-2 ${
                isDarkColorScheme ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Time Spent (minutes) *
            </Text>
            <View
              className={`flex-row items-center border rounded-lg px-3 py-2 ${
                isDarkColorScheme
                  ? "border-gray-600 bg-gray-800"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <Clock
                size={20}
                color={isDarkColorScheme ? "#9ca3af" : "#6b7280"}
                className="mr-2"
              />
              <TextInput
                value={minutesSpent}
                onChangeText={setMinutesSpent}
                placeholder="Enter minutes spent"
                placeholderTextColor={isDarkColorScheme ? "#9ca3af" : "#6b7280"}
                keyboardType="numeric"
                className={`flex-1 ${
                  isDarkColorScheme ? "text-white" : "text-gray-900"
                }`}
              />
            </View>
          </View>

          {/* Notes */}
          <View className="mb-6">
            <Text
              className={`text-sm font-medium mb-2 ${
                isDarkColorScheme ? "text-gray-300" : "text-gray-700"
              }`}
            >
              Notes (optional)
            </Text>
            <View
              className={`border rounded-lg px-3 py-2 ${
                isDarkColorScheme
                  ? "border-gray-600 bg-gray-800"
                  : "border-gray-300 bg-gray-50"
              }`}
            >
              <TextInput
                value={notes}
                onChangeText={setNotes}
                placeholder="Add notes about what you worked on..."
                placeholderTextColor={isDarkColorScheme ? "#9ca3af" : "#6b7280"}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className={`${
                  isDarkColorScheme ? "text-white" : "text-gray-900"
                }`}
              />
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View
          className={`flex-row justify-between p-4 border-t ${
            isDarkColorScheme ? "border-gray-700" : "border-gray-200"
          }`}
        >
          {isEditing && onDelete && (
            <Button
              variant="destructive"
              onPress={handleDelete}
              disabled={loading}
              className="flex-1 mr-2"
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </Button>
          )}
          <Button
            onPress={handleSave}
            disabled={loading || !selectedTaskId || !minutesSpent}
            className={`${isEditing && onDelete ? "flex-1 ml-2" : "flex-1"}`}
          >
            <Save size={16} className="mr-2" />
            {loading ? "Saving..." : "Save"}
          </Button>
        </View>
      </View>
    </Modal>
  );
}
