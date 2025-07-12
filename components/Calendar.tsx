import { ChevronLeft, ChevronRight, Plus } from "lucide-react-native";
import React, { useMemo, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useColorScheme } from "~/hooks/useColorScheme";
import { Event } from "~/services/eventsService";

interface CalendarProps {
  events: Event[];
  onDatePress: (date: Date) => void;
  onAddEvent: () => void;
  selectedDate?: Date;
}

export function Calendar({
  events,
  onDatePress,
  onAddEvent,
  selectedDate,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { isDarkColorScheme } = useColorScheme();

  // Generate calendar data for current month
  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [currentDate]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped: Record<string, Event[]> = {};
    events.forEach((event) => {
      if (event.date_time) {
        const eventDate = new Date(event.date_time);
        // Use local date string to avoid timezone issues
        const dateKey = `${eventDate.getFullYear()}-${String(
          eventDate.getMonth() + 1
        ).padStart(2, "0")}-${String(eventDate.getDate()).padStart(2, "0")}`;
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(event);
      }
    });
    return grouped;
  }, [events]);

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const hasEvents = (date: Date) => {
    // Use local date string to avoid timezone issues
    const dateKey = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return eventsByDate[dateKey] && eventsByDate[dateKey].length > 0;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <View className="bg-card rounded-lg p-4">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity
          onPress={() => navigateMonth("prev")}
          className="p-2 rounded-full bg-muted"
        >
          <ChevronLeft
            size={20}
            color={isDarkColorScheme ? "#ffffff" : "#000000"}
          />
        </TouchableOpacity>

        <Text className="text-lg font-semibold text-foreground">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>

        <TouchableOpacity
          onPress={() => navigateMonth("next")}
          className="p-2 rounded-full bg-muted"
        >
          <ChevronRight
            size={20}
            color={isDarkColorScheme ? "#ffffff" : "#000000"}
          />
        </TouchableOpacity>
      </View>

      {/* Day names */}
      <View className="flex-row mb-2">
        {dayNames.map((day) => (
          <View key={day} className="flex-1 items-center">
            <Text className="text-sm font-medium text-muted-foreground">
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <View className="flex-row flex-wrap">
        {calendarData.map((date, index) => {
          const dateKey = date.toISOString().split("T")[0];
          const dayEvents = eventsByDate[dateKey] || [];

          return (
            <TouchableOpacity
              key={index}
              onPress={() => onDatePress(date)}
              className={`w-[14.28%] h-12 items-center justify-center border border-border m-0.5 ${
                isToday(date) ? "bg-primary" : ""
              } ${isSelected(date) ? "bg-accent" : ""} ${
                !isCurrentMonth(date) ? "opacity-30" : ""
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  isToday(date) ? "text-primary-foreground" : "text-foreground"
                } ${!isCurrentMonth(date) ? "text-muted-foreground" : ""}`}
              >
                {date.getDate()}
              </Text>

              {/* Event indicator */}
              {hasEvents(date) && (
                <View className="absolute bottom-1">
                  <View className="w-2 h-2 rounded-full bg-primary" />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Add event button */}
      <TouchableOpacity
        onPress={onAddEvent}
        className="flex-row items-center justify-center mt-4 p-3 bg-primary rounded-lg"
      >
        <Plus size={20} color={isDarkColorScheme ? "#000" : "#fff"} />
        <Text className="text-primary-foreground font-medium">Add Event</Text>
      </TouchableOpacity>
    </View>
  );
}
