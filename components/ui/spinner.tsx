import * as React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useColorScheme } from "~/hooks/useColorScheme";
import { cn } from "~/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
};

export function Spinner({ className, size = "md", color }: SpinnerProps) {
  const rotation = useSharedValue(0);
  const { isDarkColorScheme } = useColorScheme();

  React.useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 1000 }), -1, false);
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  // Use theme colors from CSS custom properties
  // Light mode: primary is hsl(240 5.9% 10%) - dark gray
  // Dark mode: primary is hsl(0 0% 98%) - light gray
  const defaultColor = isDarkColorScheme
    ? "hsl(0 0% 98%)" // primary in dark mode
    : "hsl(240 5.9% 10%)"; // primary in light mode

  const borderColor = color || "transparent";
  const borderTopColor = color || defaultColor;

  return (
    <View className={cn("items-center justify-center", className)}>
      <Animated.View
        style={[
          {
            width: size === "sm" ? 16 : size === "md" ? 24 : 32,
            height: size === "sm" ? 16 : size === "md" ? 24 : 32,
            borderWidth: 2,
            borderColor: borderColor,
            borderTopColor: borderTopColor,
            borderRadius: 50,
          },
          animatedStyle,
        ]}
      />
    </View>
  );
}
