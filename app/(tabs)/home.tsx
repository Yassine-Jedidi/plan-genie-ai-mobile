import { Send } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View,
} from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";

export default function HomeTab() {
  const [input, setInput] = useState("");

  const handleSend = () => {
    // Handle send action here
    setInput("");
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-background">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <View className="flex-1 items-center justify-center">
          <Text className="text-2xl font-bold text-foreground">Home</Text>
        </View>
        <View className="flex-row items-center px-4 py-3 bg-background">
          <Input
            className="flex-1 rounded-full px-4 py-2 mr-2"
            placeholder="Enter your task text here..."
            value={input}
            onChangeText={setInput}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <Button
            size="icon"
            className="rounded-full bg-primary active:opacity-80"
            onPress={handleSend}
          >
            <Send size={14} color="#fff" />
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
