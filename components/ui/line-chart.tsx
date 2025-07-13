import React from "react";
import { View } from "react-native";
import Svg, { Circle, Line, Path } from "react-native-svg";
import { useColorScheme } from "~/hooks/useColorScheme";
import { Text } from "./text";

interface LineChartData {
  label: string;
  value: number;
}

interface LineChartProps {
  data: LineChartData[];
  height?: number;
  width?: number;
  color?: string;
  showGrid?: boolean;
  title?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  height = 120,
  width = 300,
  color,
  showGrid = true,
  title,
}) => {
  const { isDarkColorScheme } = useColorScheme();

  const defaultColor = isDarkColorScheme ? "#60a5fa" : "#3b82f6";
  const chartColor = color || defaultColor;
  const gridColor = isDarkColorScheme ? "#374151" : "#e5e7eb";

  if (!data || data.length === 0) {
    return (
      <View className="w-full items-center justify-center" style={{ height }}>
        <Text className="text-muted-foreground">No data available</Text>
      </View>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value), 1);
  const minValue = Math.min(...data.map((d) => d.value), 0);
  const valueRange = maxValue - minValue;

  const padding = 20;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;
  const xStep = chartWidth / (data.length - 1);

  const points = data.map((item, index) => {
    const x = padding + index * xStep;
    const y =
      padding +
      chartHeight -
      ((item.value - minValue) / valueRange) * chartHeight;
    return { x, y, label: item.label, value: item.value };
  });

  const pathData = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`)
    .join(" ");

  return (
    <View className="w-full">
      {title && (
        <Text className="text-sm font-medium text-foreground mb-3">
          {title}
        </Text>
      )}
      <View className="items-center">
        <Svg width={width} height={height}>
          {/* Grid lines */}
          {showGrid && (
            <>
              {/* Horizontal grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
                const y = padding + ratio * chartHeight;
                return (
                  <Line
                    key={`h-${index}`}
                    x1={padding}
                    y1={y}
                    x2={width - padding}
                    y2={y}
                    stroke={gridColor}
                    strokeWidth={0.5}
                    opacity={0.3}
                  />
                );
              })}
              {/* Vertical grid lines */}
              {data.map((_, index) => {
                const x = padding + index * xStep;
                return (
                  <Line
                    key={`v-${index}`}
                    x1={x}
                    y1={padding}
                    x2={x}
                    y2={height - padding}
                    stroke={gridColor}
                    strokeWidth={0.5}
                    opacity={0.3}
                  />
                );
              })}
            </>
          )}

          {/* Line */}
          <Path
            d={pathData}
            stroke={chartColor}
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points */}
          {points.map((point, index) => (
            <Circle
              key={index}
              cx={point.x}
              cy={point.y}
              r={4}
              fill={chartColor}
              stroke={isDarkColorScheme ? "#1f2937" : "#ffffff"}
              strokeWidth={2}
            />
          ))}
        </Svg>

        {/* Value labels above data points */}
        <View
          className="absolute top-0 left-0 right-0"
          style={{ height: padding }}
        >
          {points.map((point, index) => (
            <View
              key={index}
              className="absolute items-center"
              style={{
                left: point.x - 15,
                top: point.y - 25,
              }}
            >
              <Text className="text-xs font-medium text-foreground bg-background px-1 rounded">
                {point.value}
              </Text>
            </View>
          ))}
        </View>

        {/* X-axis labels */}
        <View className="flex-row justify-between w-full mt-2">
          {data.map((item, index) => (
            <Text
              key={index}
              className="text-xs text-muted-foreground text-center flex-1"
            >
              {item.label}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};
