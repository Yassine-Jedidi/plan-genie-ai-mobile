import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, RefreshControl, ScrollView, Text, View } from "react-native";
import { Calendar } from "~/components/Calendar";
import { EventDialog } from "~/components/EventDialog";
import { EventList } from "~/components/EventList";
import { Spinner } from "~/components/ui/spinner";
import { useAuth } from "~/contexts/AuthContext";
import { useTheme } from "~/hooks/useTheme";
import "~/lib/i18n";
import { Event, eventsService } from "~/services/eventsService";

export default function EventsTab() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  ); // Default to today
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [dialogSelectedDate, setDialogSelectedDate] = useState<
    Date | undefined
  >(undefined);
  const { t } = useTranslation();

  // Load events
  const loadEvents = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const fetchedEvents = await eventsService.getEvents(user.id);
      setEvents(fetchedEvents);
    } catch (error) {
      console.error("Error loading events:", error);
      Alert.alert(t("error"), t("event_load_failed"));
    } finally {
      setLoading(false);
    }
  }, [user?.id, t]);

  // Refresh events
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  }, [loadEvents]);

  // Load events on mount and when user changes
  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Handle date selection from calendar
  const handleDatePress = (date: Date) => {
    setSelectedDate(date);
  };

  // Handle add event
  const handleAddEvent = () => {
    setEditingEvent(null);
    setDialogSelectedDate(selectedDate);
    setShowEventDialog(true);
  };

  // Handle edit event
  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setDialogSelectedDate(undefined);
    setShowEventDialog(true);
  };

  // Handle delete event
  const handleDeleteEvent = async (eventId: string) => {
    Alert.alert(t("delete_event"), t("delete_event_confirm"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await eventsService.deleteEvent(eventId);
            await loadEvents(); // Reload events
            Alert.alert(t("success"), t("event_deleted"));
          } catch (error) {
            console.error("Error deleting event:", error);
            Alert.alert(t("error"), t("event_delete_failed"));
          }
        },
      },
    ]);
  };

  // Handle save event (create or update)
  const handleSaveEvent = async (title: string, dateTime: string) => {
    try {
      if (editingEvent) {
        // Update existing event
        await eventsService.updateEvent(editingEvent.id, title, dateTime);
        Alert.alert(t("success"), t("event_updated"));
      } else {
        // Create new event
        await eventsService.createEvent(title, dateTime);
        Alert.alert(t("success"), t("event_created"));
      }
      await loadEvents(); // Reload events
    } catch (error) {
      console.error("Error saving event:", error);
      Alert.alert(t("error"), t("event_save_failed"));
    }
  };

  // Close event dialog
  const handleCloseEventDialog = () => {
    setShowEventDialog(false);
    setEditingEvent(null);
    setDialogSelectedDate(undefined);
  };

  if (loading && !refreshing) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Spinner size="lg" className="mb-4" />
        <Text className="text-lg text-muted-foreground">
          {t("loading_events")}
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View className="p-4 space-y-6">
          {/* Header */}
          <View>
            <Text
              className="text-2xl font-bold text-foreground mb-2"
              style={{ color: theme }}
            >
              {t("events")}
            </Text>
            <Text className="text-muted-foreground">{t("manage_events")}</Text>
          </View>

          {/* Calendar */}
          <Calendar
            events={events}
            onDatePress={handleDatePress}
            onAddEvent={handleAddEvent}
            selectedDate={selectedDate}
          />

          {/* Selected Date Header */}
          {selectedDate && (
            <View className="bg-muted rounded-lg p-4">
              <Text className="text-lg font-semibold text-foreground">
                {selectedDate.toDateString() === new Date().toDateString()
                  ? t("todays_events")
                  : t("events_for", {
                      date: selectedDate.toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }),
                    })}
              </Text>
            </View>
          )}

          {/* Event List */}
          <EventList
            events={events}
            selectedDate={selectedDate}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
          />
        </View>
      </ScrollView>

      {/* Event Dialog */}
      <EventDialog
        visible={showEventDialog}
        onClose={handleCloseEventDialog}
        onSave={handleSaveEvent}
        event={editingEvent}
        selectedDate={dialogSelectedDate}
      />
    </View>
  );
}
