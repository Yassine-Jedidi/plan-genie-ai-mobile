import { LucideIcon } from "lucide-react-native";
import React from "react";
import { View } from "react-native";
import { Card } from "./card";
import { Text } from "./text";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "#3b82f6",
  trend,
  className = "",
}) => {
  return (
    <Card className={`p-4 ${className}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </Text>
          <Text className="text-2xl font-bold text-foreground">{value}</Text>
          {subtitle && (
            <Text className="text-xs text-muted-foreground mt-1">
              {subtitle}
            </Text>
          )}
          {trend && (
            <View className="flex-row items-center mt-1">
              <Text
                className={`text-xs font-medium ${
                  trend.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {trend.isPositive ? "+" : ""}
                {trend.value}%
              </Text>
              <Text className="text-xs text-muted-foreground ml-1">
                from last period
              </Text>
            </View>
          )}
        </View>
        {Icon && (
          <View
            style={{ backgroundColor: `${iconColor}20` }}
            className="w-12 h-12 rounded-full items-center justify-center"
          >
            <Icon size={24} color={iconColor} />
          </View>
        )}
      </View>
    </Card>
  );
};
