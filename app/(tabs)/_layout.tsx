import { Ionicons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import * as React from "react";
import { Button } from "~/components/ui/button";
import { useAuth } from "../../contexts/AuthContext";

export default function TabsLayout() {
  const { signOut } = useAuth();

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
        headerRight: () => (
          <Button
            variant="destructive"
            onPress={handleSignOut}
            className="flex-row items-center justify-center mr-3 rounded-full p-2"
          >
            <Ionicons name="log-out-outline" size={18} color="white" />
          </Button>
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
