import * as React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showCloseButton?: boolean;
}

export function ModalDialog({
  visible,
  onClose,
  children,
  title,
  showCloseButton = true,
}: ModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 bg-black/50 justify-center items-center p-4"
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity
          className="bg-white rounded-xl w-full max-w-md shadow-xl"
          activeOpacity={1}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <View className="flex-row items-center justify-between p-4 border-b border-gray-200">
              {title && (
                <Text className="text-lg font-semibold text-gray-900">
                  {title}
                </Text>
              )}
              {showCloseButton && (
                <TouchableOpacity
                  onPress={onClose}
                  className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
                >
                  <Text className="text-gray-600 text-lg font-bold">×</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Content */}
          <View className="p-4">{children}</View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
