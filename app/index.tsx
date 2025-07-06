import * as React from "react";
import { View } from "react-native";
import { Hero } from "~/components/hero";

export default function Screen() {
  return (
    <View className="flex-1 bg-background">
      <Hero />
    </View>
  );
}
