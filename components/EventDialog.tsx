import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar, Clock, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
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
import { useColorScheme } from "~/hooks/useColorScheme";
import { Event } from "~/services/eventsService";

interface EventDialogProps {
  visible: boolean;
  onClose: () => void;
  onSave: (title: string, dateTime: string) => void;
  event?: Event | null;
  selectedDate?: Date;
}

export function EventDialog({
  visible,
  onClose,
  onSave,
  event,
  selectedDate,
}: EventDialogProps) {
  const [title, setTitle] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { isDarkColorScheme } = useColorScheme();

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDateTime(event.date_time ? new Date(event.date_time) : new Date());
    } else if (selectedDate) {
      setTitle("");
      setDateTime(selectedDate);
    } else {
      setTitle("");
      setDateTime(new Date());
    }
  }, [event, selectedDate, visible]);

  const handleSave = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter an event title");
      return;
    }

    onSave(title.trim(), dateTime.toISOString());
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setDateTime(new Date());
    setShowDatePicker(false);
    setShowTimePicker(false);
    onClose();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Do not hide the date picker automatically
    if (selectedDate) {
      const newDateTime = new Date(dateTime);
      newDateTime.setFullYear(selectedDate.getFullYear());
      newDateTime.setMonth(selectedDate.getMonth());
      newDateTime.setDate(selectedDate.getDate());
      setDateTime(newDateTime);
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    // Do not hide the time picker automatically
    if (selectedTime) {
      const newDateTime = new Date(dateTime);
      newDateTime.setHours(selectedTime.getHours());
      newDateTime.setMinutes(selectedTime.getMinutes());
      setDateTime(newDateTime);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableOpacity
          className="flex-1 justify-end bg-black/50"
          activeOpacity={1}
          onPress={handleClose}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
            className="bg-background rounded-t-3xl p-6 max-h-[80%]"
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Header */}
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-xl font-semibold text-foreground">
                  {event ? "Edit Event" : "Add Event"}
                </Text>
                <TouchableOpacity onPress={handleClose} className="p-2">
                  <X size={24} className="text-foreground" />
                </TouchableOpacity>
              </View>

              {/* Title Input */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-foreground mb-2">
                  Event Title
                </Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Enter event title"
                  className="bg-muted rounded-lg p-3 text-foreground border border-border"
                  placeholderTextColor="#6B7280"
                />
              </View>

              {/* Date Selection */}
              <View className="mb-6">
                <Text className="text-sm font-medium text-foreground mb-2">
                  Date
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(true)}
                  className="flex-row items-center bg-muted rounded-lg p-3 border border-border"
                >
                  <Calendar
                    size={20}
                    className="text-muted-foreground mr-3"
                    color={isDarkColorScheme ? "#fff" : "#000"}
                  />
                  <Text className="text-foreground flex-1 ml-3">
                    {formatDate(dateTime)}
                  </Text>
                </TouchableOpacity>

                {/* Date Picker */}
                {showDatePicker && (
                  <View className="mt-2">
                    <DateTimePicker
                      value={dateTime}
                      mode="date"
                      display="default"
                      onChange={handleDateChange}
                    />
                  </View>
                )}
              </View>

              {/* Time Selection */}
              <View className="mb-8">
                <Text className="text-sm font-medium text-foreground mb-2">
                  Time
                </Text>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(true)}
                  className="flex-row items-center bg-muted rounded-lg p-3 border border-border"
                >
                  <Clock
                    size={20}
                    className="text-muted-foreground mr-3"
                    color={isDarkColorScheme ? "#fff" : "#000"}
                  />
                  <Text className="text-foreground flex-1 ml-3">
                    {formatTime(dateTime)}
                  </Text>
                </TouchableOpacity>

                {/* Time Picker */}
                {showTimePicker && (
                  <View className="mt-2">
                    <DateTimePicker
                      value={dateTime}
                      mode="time"
                      display="default"
                      onChange={handleTimeChange}
                    />
                  </View>
                )}
              </View>

              {/* Action Buttons */}
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  onPress={handleClose}
                  className="flex-1 bg-muted rounded-lg p-3"
                >
                  <Text className="text-center font-medium text-foreground">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSave}
                  className="flex-1 bg-primary rounded-lg p-3"
                >
                  <Text className="text-center font-medium text-primary-foreground">
                    {event ? "Update" : "Create"}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </Modal>
  );
}
