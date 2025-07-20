import React from "react";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

export default function SettingsScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-background">
      <Text className="text-2xl font-bold text-foreground mb-4">Settings</Text>
      <Text className="text-base text-muted-foreground">
        Settings options will appear here.
      </Text>
    </View>
  );
}
