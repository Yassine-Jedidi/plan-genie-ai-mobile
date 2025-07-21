import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Bell } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Switch,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/hooks/useColorScheme";
import { useTheme } from "~/hooks/useTheme";
import notificationsAPI from "~/services/notificationsAPI";
import themeAPI from "~/services/themeAPI";
import { Colors } from "../constants/Colors";
import { useAuth } from "../contexts/AuthContext";

const Tab = createMaterialTopTabNavigator();

function AppearanceScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const colorTheme = user?.user_metadata?.colorTheme;
  const [selected, setSelected] = React.useState(
    colorTheme
      ? colorTheme.charAt(0).toUpperCase() + colorTheme.slice(1)
      : "Default"
  );
  const { theme } = useTheme();

  const themes = [
    { key: "Default", color: isDarkColorScheme ? "#232b36" : "#334155" },
    { key: "Red", color: "#ef4444" },
    { key: "Blue", color: "#3b82f6" },
    { key: "Green", color: "#10b981" },
    { key: "Purple", color: "#a78bfa" },
    { key: "Orange", color: "#f59e42" },
    { key: "Pink", color: "#ec4899" },
    { key: "Teal", color: "#14b8a6" },
  ];

  const handleSelect = async (themeKey: string) => {
    if (selected === themeKey) return;
    setLoading(true);
    setSelected(themeKey);
    try {
      await themeAPI.updateTheme(
        user?.user_metadata?.theme || "system",
        themeKey.toLowerCase()
      );
      Toast.show({
        type: "success",
        text1: `Color theme changed`,
        text2: `${themeKey} theme applied successfully!`,
        position: "top",
      });
      await refreshUser();
    } catch (err) {
      Alert.alert(
        "Theme Update Failed",
        "Could not update color theme on server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center px-2 bg-background">
      <View className="w-full max-w-xl rounded-2xl border border-border bg-card p-4">
        <Text
          className="text-xl font-bold text-foreground mb-1"
          style={{ color: theme }}
        >
          Color Theme
        </Text>
        <Text className="text-muted-foreground mb-5">
          Choose your preferred color theme
        </Text>
        <View className="flex-row flex-wrap justify-between">
          {themes.map((theme) => (
            <View
              key={theme.key}
              className="w-1/2 md:w-1/4 p-2"
              style={{ maxWidth: 180 }}
            >
              <Pressable
                onPress={() => handleSelect(theme.key)}
                className={`rounded-xl border-2 ${
                  selected === theme.key ? "border-primary" : "border-border"
                } items-center p-4 bg-background`}
              >
                <View
                  className="mb-3 items-center justify-center"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: theme.color,
                  }}
                >
                  {selected === theme.key && (
                    <Text className="text-white text-lg">✓</Text>
                  )}
                </View>
                <Text
                  className={`text-base font-medium ${
                    selected === theme.key ? "text-primary" : "text-foreground"
                  }`}
                >
                  {theme.key}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
        {loading && (
          <View className="items-center mt-4">
            <ActivityIndicator size="small" color="#888" />
          </View>
        )}
        <Text className="text-xs text-muted-foreground mt-6">
          Your theme preferences are saved to your account and synchronized
          across devices.
        </Text>
      </View>
    </View>
  );
}

function NotificationsScreen() {
  const { user, refreshUser } = useAuth();
  const { isDarkColorScheme } = useColorScheme();
  const { theme } = useTheme();

  // Initialize from user_metadata, fallback to true
  const [taskNotifications, setTaskNotifications] = React.useState(
    user?.user_metadata?.taskNotifications ?? true
  );
  const [eventNotifications, setEventNotifications] = React.useState(
    user?.user_metadata?.eventNotifications ?? true
  );
  const [loading, setLoading] = React.useState(false);

  const gray = isDarkColorScheme ? "#22223b" : "#e5e7eb";

  // Update backend and refresh user
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

  return (
    <View className="px-2 pt-6 bg-background min-h-full">
      <View
        className="w-full max-w-xl rounded-3xl border border-border bg-card p-0 shadow-lg self-center"
        style={{ elevation: 4 }}
      >
        {/* Card Header */}
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
        {/* Task Notifications */}
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
        {/* Divider */}
        <View className="h-px bg-border mx-6" />
        {/* Event Notifications */}
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

function LanguageScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Text className="text-2xl font-bold text-foreground">Language</Text>
    </View>
  );
}

export default function SettingsScreen() {
  const { isDarkColorScheme } = useColorScheme();
  const indicatorColor = isDarkColorScheme
    ? Colors.dark.tint
    : Colors.light.tint;
  const labelColor = isDarkColorScheme ? Colors.dark.text : Colors.light.text;

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontWeight: "bold", color: labelColor },
        tabBarIndicatorStyle: { backgroundColor: useTheme().theme },
        tabBarStyle: { backgroundColor: "transparent" },
      }}
    >
      <Tab.Screen name="Appearance" component={AppearanceScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Language" component={LanguageScreen} />
    </Tab.Navigator>
  );
}
