import React from "react";
import { ActivityIndicator, Alert, Pressable, View } from "react-native";
import Toast from "react-native-toast-message";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/contexts/AuthContext";
import { useColorScheme } from "~/hooks/useColorScheme";
import { useTheme } from "~/hooks/useTheme";
import themeAPI from "~/services/themeAPI";

export default function AppearanceSettings() {
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
