import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { useTheme } from "~/hooks/useTheme";
import "~/lib/i18n";

export default function LanguageSettings() {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = React.useState<"en" | "fr">(
    (i18n.language as "en" | "fr") || "en"
  );
  const { theme } = useTheme();

  const handleLanguageChange = (lang: "en" | "fr") => {
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
  };

  return (
    <View className="flex-1 bg-background px-4 pt-8 items-center">
      <View className="w-full max-w-md rounded-2xl border border-border bg-card p-6 items-center">
        <Text className="text-2xl font-bold text-foreground mb-4">
          {t("language")}
        </Text>
        <Text className="text-muted-foreground mb-8 text-center">
          {t("choose_language")}
        </Text>
        <View className="flex-row w-full justify-center space-x-4 mb-6">
          <Pressable
            onPress={() => handleLanguageChange("en")}
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
              🇬🇧 {t("english")}
            </Text>
            {selectedLanguage === "en" && (
              <Text className="text-xs text-primary mt-1">{t("selected")}</Text>
            )}
          </Pressable>
          <Pressable
            onPress={() => handleLanguageChange("fr")}
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
              🇫🇷 {t("french")}
            </Text>
            {selectedLanguage === "fr" && (
              <Text className="text-xs text-primary mt-1">
                {t("selected_fr")}
              </Text>
            )}
          </Pressable>
        </View>
        <Text className="text-xs text-muted-foreground text-center">
          {t("change_anytime")}
        </Text>
      </View>
      <View style={{ flex: 1 }} />
    </View>
  );
}
