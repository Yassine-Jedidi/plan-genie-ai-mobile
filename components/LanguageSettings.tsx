import React from "react";
import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { useTheme } from "~/hooks/useTheme";

export default function LanguageSettings() {
  const [selectedLanguage, setSelectedLanguage] = React.useState<"en" | "fr">(
    "en"
  );
  const { theme } = useTheme();

  return (
    <View className="flex-1 bg-background px-4 pt-8 items-center">
      <View className="w-full max-w-md rounded-2xl border border-border bg-card p-6 items-center">
        <Text className="text-2xl font-bold text-foreground mb-4">
          Language
        </Text>
        <Text className="text-muted-foreground mb-8 text-center">
          Choose your preferred language for the app interface.
        </Text>
        <View className="flex-row w-full justify-center space-x-4 mb-6">
          <Pressable
            onPress={() => setSelectedLanguage("en")}
            className={`flex-1 items-center py-4 rounded-xl border-2 ${
              selectedLanguage === "en"
                ? "border-primary bg-primary/10"
                : "border-border bg-background"
            }`}
            style={{ marginRight: 8 }}
          >
            <Text
              className={`text-lg font-semibold ${
                selectedLanguage === "en" ? "text-primary" : "text-foreground"
              }`}
            >
              🇬🇧 English
            </Text>
            {selectedLanguage === "en" && (
              <Text className="text-xs text-primary mt-1">Selected</Text>
            )}
          </Pressable>
          <Pressable
            onPress={() => setSelectedLanguage("fr")}
            className={`flex-1 items-center py-4 rounded-xl border-2 ${
              selectedLanguage === "fr"
                ? "border-primary bg-primary/10"
                : "border-border bg-background"
            }`}
          >
            <Text
              className={`text-lg font-semibold ${
                selectedLanguage === "fr" ? "text-primary" : "text-foreground"
              }`}
            >
              🇫🇷 Français
            </Text>
            {selectedLanguage === "fr" && (
              <Text className="text-xs text-primary mt-1">Sélectionné</Text>
            )}
          </Pressable>
        </View>
        <Text className="text-xs text-muted-foreground text-center">
          You can change the language at any time. This will affect all app
          screens.
        </Text>
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
}
