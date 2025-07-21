import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import React from "react";
import { useColorScheme } from "~/hooks/useColorScheme";
import { useTheme } from "~/hooks/useTheme";
import AppearanceSettings from "../components/AppearanceSettings";
import LanguageSettings from "../components/LanguageSettings";
import NotificationsSettings from "../components/NotificationsSettings";
import { Colors } from "../constants/Colors";

const Tab = createMaterialTopTabNavigator();

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
      <Tab.Screen name="Appearance" component={AppearanceSettings} />
      <Tab.Screen name="Notifications" component={NotificationsSettings} />
      <Tab.Screen name="Language" component={LanguageSettings} />
    </Tab.Navigator>
  );
}
