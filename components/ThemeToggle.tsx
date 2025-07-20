import React from "react";
import { ActivityIndicator, Alert, Pressable, View } from "react-native";
import { useColorScheme } from "~/hooks/useColorScheme";
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar";
import { MoonStar } from "~/lib/icons/MoonStar";
import { Sun } from "~/lib/icons/Sun";
import { authAPI } from "~/services/authAPI";
import { useAuth } from "../contexts/AuthContext";

export function ThemeToggle() {
  const { isDarkColorScheme, setColorScheme } = useColorScheme();
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = React.useState(false);

  // Use user.user_metadata.theme if available, otherwise fallback to local color scheme
  const userTheme =
    user?.user_metadata?.theme === "dark" ||
    user?.user_metadata?.theme === "light"
      ? user.user_metadata.theme
      : null;
  const effectiveIsDark = userTheme ? userTheme === "dark" : isDarkColorScheme;

  async function toggleColorScheme() {
    const newTheme = effectiveIsDark ? "light" : "dark";
    setColorScheme(newTheme);
    setAndroidNavigationBar(newTheme);
    if (user) {
      setLoading(true);
      try {
        await authAPI.updateTheme(newTheme, user.user_metadata?.colorTheme!);
        await refreshUser();
      } catch (err) {
        Alert.alert("Theme Update Failed", "Could not update theme on server.");
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <Pressable
      onPress={toggleColorScheme}
      disabled={loading}
      className="web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 active:opacity-70"
    >
      <View className="aspect-square pt-0.5 justify-center items-start web:px-5 px-10">
        {loading ? (
          <ActivityIndicator size={23} color="#888" />
        ) : effectiveIsDark ? (
          <MoonStar className="text-foreground" size={23} strokeWidth={1.25} />
        ) : (
          <Sun className="text-foreground" size={24} strokeWidth={1.25} />
        )}
      </View>
    </Pressable>
  );
}
