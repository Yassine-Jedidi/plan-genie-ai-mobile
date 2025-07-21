import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Image, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import "~/lib/i18n";
import { useAuth } from "../contexts/AuthContext";
import { authAPI } from "../services/authAPI";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || "");
  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleSave = async () => {
    setLoading(true);
    try {
      await authAPI.updateProfile({
        full_name: fullName,
        avatar_url: avatarUrl,
      });
      await refreshUser();
      Toast.show({
        type: "success",
        text1: t("profile_updated"),
      });
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-background p-6  items-center">
      <Text className="text-2xl font-bold mb-6">{t("edit_profile")}</Text>
      <Image
        source={
          avatarUrl
            ? { uri: avatarUrl }
            : require("../assets/images/avatar-placeholder.png")
        }
        style={{ width: 96, height: 96, borderRadius: 48, marginBottom: 24 }}
        resizeMode="cover"
      />
      <Text className="mb-2">{t("full_name")}</Text>
      <TextInput
        className="border border-border rounded-md px-4 py-3 mb-4 w-72 text-foreground bg-background text-center"
        value={fullName}
        onChangeText={setFullName}
        placeholder={t("full_name")}
      />
      <Text className="mb-2">{t("email")}</Text>
      <TextInput
        className="border border-border rounded-md px-4 py-3 mb-2 w-72 text-foreground bg-background text-center"
        value={email}
        placeholder={t("email")}
        editable={false}
        autoCapitalize="none"
      />
      <Text className="text-xs text-muted-foreground mb-4">
        {t("email_cannot_be_changed")}
      </Text>
      <Button onPress={handleSave} disabled={loading}>
        <Text className="text-base text-primary-foreground">
          {loading ? t("saving") : t("save_changes")}
        </Text>
      </Button>
    </View>
  );
}
