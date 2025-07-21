import { Send } from "lucide-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useColorScheme } from "~/hooks/useColorScheme";
import { AudioRecorder } from "./audio-recorder";

interface InputBarProps {
  onSend: (text: string) => void;
  loading?: boolean;
  transcribing?: boolean;
}

export function InputBar({
  onSend,
  loading = false,
  transcribing = false,
}: InputBarProps) {
  const [input, setInput] = useState("");
  const { isDarkColorScheme } = useColorScheme();
  const { t } = useTranslation();

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const handleTranscriptionComplete = (transcription: string) => {
    setInput(transcription);
  };

  const handleTranscriptionError = (error: string) => {
    // Error is already handled in the AudioRecorder component
    console.log("Transcription error:", error);
  };

  return (
    <View className="flex-row items-center px-4 py-3 bg-background">
      <Input
        className="flex-1 rounded-full px-4 py-2 mr-2"
        placeholder={t("input_placeholder")}
        value={input}
        onChangeText={setInput}
        returnKeyType="send"
        onSubmitEditing={handleSend}
        editable={!loading && !transcribing}
      />
      <AudioRecorder
        onTranscriptionComplete={handleTranscriptionComplete}
        onTranscriptionError={handleTranscriptionError}
        disabled={loading || transcribing}
      />
      <Button
        size="icon"
        className="rounded-full bg-primary active:opacity-80"
        onPress={handleSend}
        disabled={loading || transcribing}
      >
        <Send size={14} color={isDarkColorScheme ? "#000" : "#fff"} />
      </Button>
    </View>
  );
}
