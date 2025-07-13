import { Ionicons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import * as React from "react";
import { Image, View } from "react-native";
import { ThemeToggle } from "~/components/themeToggle";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useAuth } from "../../contexts/AuthContext";

export default function TabsLayout() {
  const { signOut, user } = useAuth();

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
              iconName = "sunny-outline";
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
              <Text className="text-sm text-foreground ml-3 font-medium">
                {user.full_name}
              </Text>
            )}
          </View>
        ),
        headerRight: () => (
          <View className="flex-row items-center">
            <ThemeToggle />
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
      <Tabs.Screen name="home" options={{ title: "Home" }} />
      <Tabs.Screen name="tasks" options={{ title: "Tasks" }} />
      <Tabs.Screen name="events" options={{ title: "Events" }} />
      <Tabs.Screen name="daily" options={{ title: "Daily" }} />
      <Tabs.Screen name="analytics" options={{ title: "Analytics" }} />
      <Tabs.Screen name="dashboard" options={{ title: "Dashboard" }} />
    </Tabs>
  );
}
