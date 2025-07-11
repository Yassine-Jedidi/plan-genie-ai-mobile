import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { cn } from "../../lib/utils";

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
  onPress?: () => void;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
}

export const Table = ({ children, className }: TableProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={cn("flex-1", className)}
    >
      <View className="min-w-full">{children}</View>
    </ScrollView>
  );
};

export const TableHeader = ({ children, className }: TableHeaderProps) => {
  return (
    <View
      className={cn("flex-row bg-muted/50 border-b border-border", className)}
    >
      {children}
    </View>
  );
};

export const TableRow = ({ children, className, onPress }: TableRowProps) => {
  const RowComponent = onPress ? TouchableOpacity : View;

  return (
    <RowComponent
      className={cn("flex-row border-b border-border/50", className)}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </RowComponent>
  );
};

export const TableCell = ({ children, className }: TableCellProps) => {
  return (
    <View className={cn("flex-1 p-3 justify-center", className)}>
      {children}
    </View>
  );
};

export const TableHeaderCell = ({ children, className }: TableCellProps) => {
  return (
    <View className={cn("flex-1 p-3 justify-center", className)}>
      <Text className="text-sm font-semibold text-foreground">{children}</Text>
    </View>
  );
};
