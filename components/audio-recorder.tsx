import { Audio } from "expo-av";
import { Mic, MicOff } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import Toast from "react-native-toast-message";
import { Button } from "~/components/ui/button";
import { useColorScheme } from "~/hooks/useColorScheme";

interface AudioRecorderProps {
  onTranscriptionComplete: (transcription: string) => void;
  onTranscriptionError: (error: string) => void;
  disabled?: boolean;
}

export function AudioRecorder({
  onTranscriptionComplete,
  onTranscriptionError,
  disabled = false,
}: AudioRecorderProps) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingPermission, setRecordingPermission] = useState<
    boolean | null
  >(null);
  const [transcribing, setTranscribing] = useState(false);

  const { isDarkColorScheme } = useColorScheme();

  // Request recording permissions on component mount
  useEffect(() => {
    (async () => {
      try {
        const { status, canAskAgain, granted } =
          await Audio.requestPermissionsAsync();
        console.log(
          "[AudioRecorder] Microphone permission status:",
          status,
          "granted:",
          granted,
          "canAskAgain:",
          canAskAgain
        );
        setRecordingPermission(status === "granted");
        if (status !== "granted") {
          Alert.alert(
            "Microphone Permission",
            "Microphone permission is not granted. Please enable it in Settings."
          );
        }
      } catch (err) {
        console.error(
          "[AudioRecorder] Error requesting microphone permission:",
          err
        );
        Alert.alert(
          "Error",
          "Failed to request microphone permission. Please try again."
        );
      }
    })();
  }, []);

  const startRecording = async () => {
    try {
      if (recordingPermission !== true) {
        Alert.alert(
          "Permission Required",
          "Please grant microphone permission to record audio."
        );
        console.warn(
          "[AudioRecorder] Attempted to start recording without permission."
        );
        return;
      }

      // Configure audio mode
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      // Start recording
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      setRecording(recording);
      setIsRecording(true);

      Toast.show({
        type: "info",
        text1: "Recording started",
        text2: "Tap the microphone again to stop",
        position: "top",
      });
    } catch (err: any) {
      console.error("[AudioRecorder] Failed to start recording", err);
      Alert.alert("Error", `Failed to start recording. ${err?.message || ""}`);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;

    try {
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (uri) {
        await handleTranscription(uri);
      }
    } catch (err) {
      console.error("Failed to stop recording", err);
      Alert.alert("Error", "Failed to stop recording. Please try again.");
    }
  };

  const handleTranscription = async (audioUri: string) => {
    setTranscribing(true);

    try {
      // Create a file object from the audio URI
      console.log(
        "[AudioRecorder] handleTranscription called with URI:",
        audioUri
      );
      const audioFile = {
        uri: audioUri,
        type: "audio/x-wav",
        name: "recording.wav",
      };
      console.log("[AudioRecorder] Audio file object:", audioFile);

      // Import the API here to avoid circular dependencies
      const { fastapiAPI } = await import("~/services/api");

      // Send to transcription API
      const transcriptionResult = await fastapiAPI.transcribeAudio(audioFile);

      if (transcriptionResult.transcription) {
        onTranscriptionComplete(transcriptionResult.transcription);
        Toast.show({
          type: "success",
          text1: "Transcription complete",
          text2: "Your voice has been converted to text",
          position: "top",
        });
      } else {
        throw new Error("No transcription received");
      }
    } catch (err: any) {
      console.error("Transcription error:", err);
      const errorMessage = "Failed to transcribe audio. Please try again.";
      onTranscriptionError(errorMessage);
      Toast.show({
        type: "error",
        text1: "Transcription failed",
        text2: err.message || "Please try again",
        position: "top",
      });
    } finally {
      setTranscribing(false);
    }
  };

  const handleMicPress = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <Button
      size="icon"
      className={`rounded-full mr-2 ${
        isRecording ? "bg-red-500" : transcribing ? "bg-muted" : "bg-secondary"
      }`}
      onPress={handleMicPress}
      disabled={disabled || transcribing || recordingPermission === false}
    >
      {isRecording ? (
        <MicOff size={14} color="#fff" />
      ) : (
        <Mic size={14} color={isDarkColorScheme ? "#fff" : "#000"} />
      )}
    </Button>
  );
}
