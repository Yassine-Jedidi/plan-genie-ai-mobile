import {
  Calendar as CalendarIcon,
  Clock,
  Edit,
  Trash2,
} from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Event } from "~/services/eventsService";

interface EventListProps {
  events: Event[];
  selectedDate?: Date;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (eventId: string) => void;
}

export function EventList({
  events,
  selectedDate,
  onEditEvent,
  onDeleteEvent,
}: EventListProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getEventsForDate = (date: Date) => {
    const dateKey = date.toISOString().split("T")[0];
    return events
      .filter((event) => {
        if (!event.date_time) return false;
        const eventDate = new Date(event.date_time);
        return eventDate.toISOString().split("T")[0] === dateKey;
      })
      .sort((a, b) => {
        if (!a.date_time || !b.date_time) return 0;
        return (
          new Date(a.date_time).getTime() - new Date(b.date_time).getTime()
        );
      });
  };

  const displayEvents = selectedDate ? getEventsForDate(selectedDate) : events;

  if (displayEvents.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <CalendarIcon size={48} className="text-muted-foreground mb-4" />
        <Text className="text-lg font-medium text-muted-foreground text-center mb-2">
          {selectedDate ? "No events for this date" : "No events yet"}
        </Text>
        <Text className="text-sm text-muted-foreground text-center">
          {selectedDate
            ? "Tap the + button to add an event"
            : "Create your first event to get started"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      <View className="space-y-3">
        {displayEvents.map((event) => (
          <View
            key={event.id}
            className="bg-card rounded-lg p-4 border border-border"
          >
            <View className="flex-row items-start justify-between">
              <View className="flex-1 mr-3">
                <Text className="text-lg font-semibold text-foreground mb-2">
                  {event.title}
                </Text>

                {event.date_time && (
                  <View className="flex-row items-center mb-1">
                    <Clock size={16} className="text-muted-foreground mr-2" />
                    <Text className="text-sm text-muted-foreground">
                      {formatTime(event.date_time)}
                    </Text>
                  </View>
                )}

                {event.date_time && (
                  <View className="flex-row items-center">
                    <CalendarIcon
                      size={16}
                      className="text-muted-foreground mr-2"
                    />
                    <Text className="text-sm text-muted-foreground">
                      {formatDate(event.date_time)}
                    </Text>
                  </View>
                )}
              </View>

              <View className="flex-row space-x-2">
                <TouchableOpacity
                  onPress={() => onEditEvent(event)}
                  className="p-2 rounded-full bg-muted"
                >
                  <Edit size={16} className="text-foreground" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onDeleteEvent(event.id)}
                  className="p-2 rounded-full bg-destructive"
                >
                  <Trash2 size={16} className="text-destructive-foreground" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
