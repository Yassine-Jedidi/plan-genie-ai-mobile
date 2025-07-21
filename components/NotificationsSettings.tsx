import { Bell } from "lucide-react-native";
import React, { useEffect } from "react";
import { Alert, Switch, View } from "react-native";
import Toast from "react-native-toast-message";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/contexts/AuthContext";
import { useColorScheme } from "~/hooks/useColorScheme";
import { useTheme } from "~/hooks/useTheme";
import notificationsAPI from "~/services/notificationsAPI";

export default function NotificationsSettings() {
  const { user, refreshUser } = useAuth();
  const { isDarkColorScheme } = useColorScheme();
  const { theme } = useTheme();

  const [taskNotifications, setTaskNotifications] = React.useState(true);
  const [eventNotifications, setEventNotifications] = React.useState(true);
  const [loading, setLoading] = React.useState(false);

  const gray = isDarkColorScheme ? "#22223b" : "#e5e7eb";

  const handleUpdatePreference = async (key: string, value: boolean) => {
    setLoading(true);
    try {
      let payload: any = {};
      if (key === "taskNotifications") {
        payload = {
          receive_task_notifications: value,
          receive_event_notifications: eventNotifications,
        };
      } else if (key === "eventNotifications") {
        payload = {
          receive_task_notifications: taskNotifications,
          receive_event_notifications: value,
        };
      }
      await notificationsAPI.updateNotifications(payload);
      await refreshUser();
      Toast.show({
        type: "success",
        text1: "Preferences updated",
        position: "top",
      });
    } catch (err) {
      Alert.alert("Update Failed", "Could not update preferences.");
    } finally {
      setLoading(false);
    }
  };

  const getNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationsAPI.getNotifications();
      setTaskNotifications(response.receive_task_notifications);
      setEventNotifications(response.receive_event_notifications);
    } catch (err) {
      Alert.alert("Fetch Failed", "Could not fetch notification settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <View className="px-2 pt-6 bg-background min-h-full">
      <View
        className="w-full max-w-xl rounded-3xl border border-border bg-card p-0  self-center"
        style={{ elevation: 4 }}
      >
        <View className="flex-row items-center px-6 pt-6 pb-2 border-b border-border bg-background rounded-t-3xl">
          <Bell size={24} color={theme} style={{ marginRight: 10 }} />
          <Text className="text-xl font-bold text-foreground">
            Notification Settings
          </Text>
        </View>
        <Text className="text-muted-foreground px-6 pt-2 pb-4">
          Manage your notification preferences. Enable or disable notifications
          for tasks and events below.
        </Text>
        <View className="flex-row items-center justify-between px-6 py-4">
          <View className="flex-1 pr-4">
            <Text className="text-lg font-medium text-foreground mb-1">
              Task Notifications
            </Text>
            <Text className="text-sm text-muted-foreground">
              Get notified about new and updated tasks.
            </Text>
          </View>
          <Switch
            value={taskNotifications}
            onValueChange={async (val) => {
              setTaskNotifications(val);
              await handleUpdatePreference("taskNotifications", val);
            }}
            trackColor={{ false: gray, true: theme }}
            thumbColor={taskNotifications ? "#fff" : "#000"}
            disabled={loading}
          />
        </View>
        <View className="h-px bg-border mx-6" />
        <View className="flex-row items-center justify-between px-6 py-4">
          <View className="flex-1 pr-4">
            <Text className="text-lg font-medium text-foreground mb-1">
              Event Notifications
            </Text>
            <Text className="text-sm text-muted-foreground">
              Stay updated on upcoming events and reminders.
            </Text>
          </View>
          <Switch
            value={eventNotifications}
            onValueChange={async (val) => {
              setEventNotifications(val);
              await handleUpdatePreference("eventNotifications", val);
            }}
            trackColor={{ false: gray, true: theme }}
            thumbColor={eventNotifications ? "#fff" : "#000"}
            disabled={loading}
          />
        </View>
      </View>
    </View>
  );
}
