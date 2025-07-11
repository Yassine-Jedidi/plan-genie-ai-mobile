import React from "react";
import { Text, View } from "react-native";
import { cn } from "../../lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "secondary"
    | "destructive"
    | "outline"
    | "high"
    | "medium"
    | "low"
    | "done"
    | "planned"
    | "in-progress";
  className?: string;
}

export const Badge = ({
  children,
  variant = "default",
  className,
}: BadgeProps) => {
  const variantStyles = {
    default: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    outline: "border border-input bg-background",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    medium: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
    low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    done: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    planned: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    "in-progress":
      "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  };

  return (
    <View
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantStyles[variant],
        className
      )}
    >
      <Text
        className={cn(
          "text-xs font-medium",
          variant === "outline" ? "text-foreground" : "",
          variant === "high" ? "text-red-800 dark:text-red-200" : "",
          variant === "medium" ? "text-amber-800 dark:text-amber-200" : "",
          variant === "low" ? "text-green-800 dark:text-green-200" : "",
          variant === "done" ? "text-green-800 dark:text-green-200" : "",
          variant === "planned" ? "text-blue-800 dark:text-blue-200" : "",
          variant === "in-progress"
            ? "text-orange-800 dark:text-orange-200"
            : ""
        )}
      >
        {children}
      </Text>
    </View>
  );
};
