import React from "react";
import { View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";
import { useColorScheme } from "~/hooks/useColorScheme";
import { Text } from "./text";

interface PieChartData {
  label: string;
  value: number;
  color?: string;
}

interface PieChartProps {
  data: PieChartData[];
  size?: number;
  title?: string;
  showLegend?: boolean;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  size = 150,
  title,
  showLegend = true,
}) => {
  const { isDarkColorScheme } = useColorScheme();

  const defaultColors = [
    "#3b82f6", // blue
    "#10b981", // green
    "#f59e0b", // amber
    "#ef4444", // red
    "#8b5cf6", // purple
    "#06b6d4", // cyan
    "#84cc16", // lime
    "#f97316", // orange
  ];

  if (!data || data.length === 0) {
    return (
      <View
        className="w-full items-center justify-center"
        style={{ height: size }}
      >
        <Text className="text-muted-foreground">No data available</Text>
      </View>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) {
    return (
      <View
        className="w-full items-center justify-center"
        style={{ height: size }}
      >
        <Text className="text-muted-foreground">No data available</Text>
      </View>
    );
  }

  const center = size / 2;
  const radius = (size * 0.8) / 2;
  let currentAngle = -90; // Start from top

  const paths = data.map((item, index) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const endAngle = currentAngle + angle;

    // Calculate arc coordinates
    const startRadians = (currentAngle * Math.PI) / 180;
    const endRadians = (endAngle * Math.PI) / 180;

    const x1 = center + radius * Math.cos(startRadians);
    const y1 = center + radius * Math.sin(startRadians);
    const x2 = center + radius * Math.cos(endRadians);
    const y2 = center + radius * Math.sin(endRadians);

    // Determine if arc is larger than 180 degrees
    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathData = [
      `M ${center} ${center}`,
      `L ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      "Z",
    ].join(" ");

    const color = item.color || defaultColors[index % defaultColors.length];

    currentAngle = endAngle;

    return {
      pathData,
      color,
      label: item.label,
      value: item.value,
      percentage: Math.round(percentage * 100),
    };
  });

  return (
    <View className="w-full items-center">
      {title && (
        <Text className="text-sm font-medium text-foreground mb-3">
          {title}
        </Text>
      )}

      <View className="relative">
        <Svg width={size} height={size}>
          {paths.map((path, index) => (
            <Path
              key={index}
              d={path.pathData}
              fill={path.color}
              stroke={isDarkColorScheme ? "#1f2937" : "#ffffff"}
              strokeWidth={2}
            />
          ))}

          {/* Center circle for donut effect */}
          <Circle
            cx={center}
            cy={center}
            r={radius * 0.3}
            fill={isDarkColorScheme ? "#1f2937" : "#ffffff"}
          />
        </Svg>

        {/* Center text */}
        <View className="absolute inset-0 items-center justify-center">
          <Text className="text-lg font-bold text-foreground">{total}</Text>
          <Text className="text-xs text-muted-foreground">Total</Text>
        </View>
      </View>

      {/* Legend */}
      {showLegend && (
        <View className="w-full mt-4">
          {paths.map((path, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <View
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: path.color }}
              />
              <Text className="text-sm text-foreground flex-1">
                {path.label}
              </Text>
              <Text className="text-sm text-muted-foreground">
                {path.value} ({path.percentage}%)
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
