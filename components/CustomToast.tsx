import React from "react";
import { View } from "react-native";
import { useColorScheme } from "~/hooks/useColorScheme";
import { Text } from "./ui/text";

export default function CustomToast({ text1, text2, ...rest }: any) {
  const { isDarkColorScheme } = useColorScheme();

  return (
    <View
      className={`bg-card border border-border px-4 py-3 rounded-2xl shadow-lg mx-4${
        isDarkColorScheme ? " dark" : ""
      }`}
      style={{ elevation: 4 }}
    >
      <Text className="text-card-foreground font-bold text-base mb-0.5">
        {text1}
      </Text>
      {!!text2 && (
        <Text className="text-muted-foreground text-sm">{text2}</Text>
      )}
    </View>
  );
}
