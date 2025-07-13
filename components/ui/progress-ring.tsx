import React from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { useColorScheme } from "~/hooks/useColorScheme";
import { Text } from "./text";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  children?: React.ReactNode;
}

export const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color,
  backgroundColor,
  showPercentage = true,
  children,
}) => {
  const { isDarkColorScheme } = useColorScheme();

  // Default theme-aware colors using white and dark
  const defaultColor = isDarkColorScheme ? "#ffffff" : "#000000"; // white and dark
  const defaultBackgroundColor = isDarkColorScheme ? "#ffffff" : "#000000";

  const finalColor = color || defaultColor;
  const finalBackgroundColor = backgroundColor || defaultBackgroundColor;

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <View className="items-center justify-center">
      <View style={{ width: size, height: size }} className="relative">
        <Svg width={size} height={size} className="absolute">
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={finalBackgroundColor}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={finalColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>

        {/* Center content */}
        <View className="absolute inset-0 items-center justify-center">
          {children ||
            (showPercentage && (
              <View className="items-center">
                <Text className="text-2xl font-bold text-foreground">
                  {Math.round(progress)}%
                </Text>
                <Text className="text-xs text-muted-foreground">Complete</Text>
              </View>
            ))}
        </View>
      </View>
    </View>
  );
};
