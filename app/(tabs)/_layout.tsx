import { Ionicons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { Image, TouchableOpacity, View } from "react-native";
import { ThemeToggle } from "~/components/ThemeToggle";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useColorScheme } from "~/hooks/useColorScheme";
import { useTheme } from "~/hooks/useTheme";
import "~/lib/i18n";
import { useAuth } from "../../contexts/AuthContext";

export default function TabsLayout() {
  const { signOut, user } = useAuth();
  const { isDarkColorScheme } = useColorScheme();
  const { theme } = useTheme();
  const { t } = useTranslation();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace("/");
    } catch (error) {
      // Optionally handle error (e.g., show a toast)
      console.error("Sign out failed", error);
    }
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: true,
        headerTitle: "",
        headerStyle: {
          height: 100, // Increased from default height
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;
          switch (route.name) {
            case "home":
              iconName = "home";
              break;
            case "tasks":
              iconName = "checkmark-done";
              break;
            case "events":
              iconName = "calendar";
              break;
            case "daily":
              iconName = "time-outline";
              break;
            case "analytics":
              iconName = "bar-chart-outline";
              break;
            case "dashboard":
              iconName = "grid-outline";
              break;
            default:
              iconName = "ellipse";
          }
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        headerLeft: () => (
          <View className="flex-row items-center ml-2">
            {user?.avatar_url && (
              <Image
                source={{ uri: user?.avatar_url }}
                className="w-8 h-8 rounded-full"
                alt="User avatar"
              />
            )}
            {user?.full_name && (
              <TouchableOpacity onPress={() => router.push("../profile")}>
                <Text className="text-sm text-foreground ml-3 font-medium">
                  {user.full_name}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ),
        headerRight: () => (
          <View className="flex-row items-center">
            <ThemeToggle />
            <Button
              variant="ghost"
              onPress={() => router.navigate("/settings")}
              className="flex-row items-center justify-center rounded-full mr-2"
            >
              <Ionicons
                name="settings-outline"
                size={20}
                color={isDarkColorScheme ? "white" : "black"}
              />
            </Button>
            <Button
              variant="destructive"
              onPress={handleSignOut}
              className="flex-row items-center justify-center rounded-full mr-3"
            >
              <Ionicons name="log-out-outline" size={18} color="white" />
            </Button>
          </View>
        ),
      })}
    >
      <Tabs.Screen
        name="home"
        options={{ title: t("home"), tabBarActiveTintColor: theme }}
      />
      <Tabs.Screen
        name="tasks"
        options={{ title: t("tasks"), tabBarActiveTintColor: theme }}
      />
      <Tabs.Screen
        name="events"
        options={{ title: t("events"), tabBarActiveTintColor: theme }}
      />
      <Tabs.Screen
        name="daily"
        options={{ title: t("daily_summary"), tabBarActiveTintColor: theme }}
      />
      <Tabs.Screen
        name="analytics"
        options={{ title: t("analytics"), tabBarActiveTintColor: theme }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{ title: t("dashboard"), tabBarActiveTintColor: theme }}
      />
    </Tabs>
  );
}
