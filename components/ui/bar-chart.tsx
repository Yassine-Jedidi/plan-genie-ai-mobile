import React from "react";
import { View } from "react-native";
import { Text } from "./text";

interface BarChartData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarChartData[];
  maxValue?: number;
  height?: number;
  showValues?: boolean;
  title?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  maxValue,
  height = 120,
  showValues = true,
  title,
}) => {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);
  const defaultColors = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <View className="w-full">
      {title && (
        <Text className="text-sm font-medium text-foreground mb-3">
          {title}
        </Text>
      )}
      <View
        style={{ height }}
        className="flex-row items-end justify-between space-x-2"
      >
        {data.map((item, index) => {
          const barHeight = (item.value / max) * height;
          const color =
            item.color || defaultColors[index % defaultColors.length];

          return (
            <View key={item.label} className="flex-1 items-center">
              <View className="w-full items-center">
                {showValues && (
                  <Text className="text-xs text-muted-foreground mb-1">
                    {item.value}
                  </Text>
                )}
                <View
                  style={{
                    height: barHeight,
                    backgroundColor: color,
                    minHeight: 4,
                  }}
                  className="w-full rounded-t-sm"
                />
                <Text className="text-xs text-muted-foreground mt-2 text-center">
                  {item.label}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};
