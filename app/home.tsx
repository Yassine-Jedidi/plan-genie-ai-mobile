import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center">
      <View className="w-full max-w-md rounded-2xl p-6 items-center">
        <Text className="text-3xl font-bold mb-4 text-foreground">
          Welcome Home!
        </Text>
        <Text className="text-base text-muted-foreground mb-8 text-center">
          You have successfully signed in. This is your home page.
        </Text>
      </View>
    </SafeAreaView>
  );
}
