import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
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
