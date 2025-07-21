import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View,
} from "react-native";
import { InputBar } from "~/components/input-bar";
import { ResultEditor } from "~/components/result-editor";
import { Text } from "~/components/ui/text";
import { useTextAnalysis } from "~/hooks/useTextAnalysis";
import { useTheme } from "~/hooks/useTheme";

export default function HomeTab() {
  const { result, loading, error, analyzeText, clearResult } =
    useTextAnalysis();
  const [transcribing, setTranscribing] = useState(false);
  const { theme } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-background">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <View className="flex-1 justify-center px-4">
          {!result && (
            <Text
              style={{ color: theme }}
              className="text-2xl font-bold text-center"
            >
              Home
            </Text>
          )}

          {/* Show result in center */}
          {loading && (
            <View className="items-center mb-4">
              <Text className="text-base text-muted-foreground">
                Processing...
              </Text>
            </View>
          )}
          {error && (
            <View className="items-center mb-4">
              <Text className="text-base text-destructive">{error}</Text>
            </View>
          )}
          {transcribing && (
            <View className="items-center mb-4">
              <Text className="text-base text-muted-foreground">
                Transcribing your voice...
              </Text>
            </View>
          )}
          {result && <ResultEditor result={result} onClear={clearResult} />}
        </View>
        <InputBar
          onSend={analyzeText}
          loading={loading}
          transcribing={transcribing}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
