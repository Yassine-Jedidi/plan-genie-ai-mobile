import { Send, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  View,
} from "react-native";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { fastapiAPI, tasksAPI } from "~/services/authAPI";

export default function HomeTab() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<any>(null);
  const [editableResult, setEditableResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (result) {
      // Deep copy and normalize entity values to strings
      const normalized = JSON.parse(JSON.stringify(result));
      if (normalized.entities) {
        Object.keys(normalized.entities).forEach((key) => {
          const val = normalized.entities[key];
          if (Array.isArray(val)) {
            normalized.entities[key] = val.length > 0 ? val[0] : "";
          } else if (typeof val !== "string") {
            normalized.entities[key] = String(val ?? "");
          }
        });
      }
      setEditableResult(normalized);
    }
  }, [result]);

  // Ensure required entity fields are always present
  useEffect(() => {
    if (!editableResult) return;
    const type = editableResult.type;
    const required = REQUIRED_ENTITIES[type] || [];
    setEditableResult((prev: any) => {
      if (!prev) return prev;
      const updated = { ...prev, entities: { ...prev.entities } };
      required.forEach((key) => {
        if (!(key in updated.entities)) {
          updated.entities[key] = "";
        }
      });
      // Remove extra fields not in required
      Object.keys(updated.entities).forEach((key) => {
        if (!required.includes(key)) {
          delete updated.entities[key];
        }
      });
      return updated;
    });
  }, [editableResult?.type]);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setEditableResult(null);
    try {
      const res = await fastapiAPI.analyzeText(input);
      setResult(res);
      console.log("Analyze result:", res);
    } catch (err: any) {
      setError(err.message || "Failed to process input.");
    } finally {
      setLoading(false);
      setInput("");
    }
  };

  const handleEntityChange = (
    entityKey: string,
    value: string,
    idx: number
  ) => {
    setEditableResult((prev: any) => {
      if (!prev) return prev;
      const updated = { ...prev };
      if (Array.isArray(updated.entities[entityKey])) {
        updated.entities[entityKey] = [...updated.entities[entityKey]];
        updated.entities[entityKey][idx] = value;
      } else {
        updated.entities[entityKey] = value;
      }
      return updated;
    });
  };

  const handleSave = async () => {
    if (!editableResult) return;
    setSaveLoading(true);
    setSaveSuccess(null);
    setSaveError(null);
    try {
      const result = await tasksAPI.saveTask(
        editableResult.type,
        editableResult.entities
      );
      console.log("Save result:", result);
      setSaveSuccess("Task saved successfully!");
    } catch (err: any) {
      setSaveError(err.message || "Failed to save task.");
    } finally {
      setSaveLoading(false);
    }
  };

  // Entity label mapping
  const ENTITY_LABELS: Record<string, string> = {
    TITRE: "Title",
    DELAI: "Deadline",
    PRIORITE: "Priority",
    DATE_HEURE: "Date",
  };

  // Required entities per type
  const REQUIRED_ENTITIES: Record<string, string[]> = {
    Tâche: ["TITRE", "DELAI", "PRIORITE"],
    Événement: ["TITRE", "DATE_HEURE"],
  };

  return (
    <SafeAreaView style={{ flex: 1 }} className="bg-background">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <View className="flex-1 items-center justify-center">
          {editableResult ? null : ( // Results view is already rendered below, so render nothing here
            <Text className="text-2xl font-bold text-foreground">Home</Text>
          )}
        </View>
        {/* Show result above input */}
        {loading && (
          <View className="items-center mt-2">
            <Text className="text-base text-muted-foreground">
              Processing...
            </Text>
          </View>
        )}
        {error && (
          <View className="items-center mt-2">
            <Text className="text-base text-destructive">{error}</Text>
          </View>
        )}
        {editableResult && (
          <View className="px-4 mt-2 mb-2 relative">
            {/* X icon to clear results */}
            <Button
              size="icon"
              variant="destructive"
              className="absolute right-0 top-0 z-10"
              onPress={() => {
                setEditableResult(null);
                setResult(null);
                setSaveSuccess(null);
                setSaveError(null);
              }}
            >
              <X size={18} color="#888" />
            </Button>
            <Text className="text-base font-semibold text-foreground mb-1">
              Type:
            </Text>
            <View className="mb-2 border border-border rounded">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <View className="flex-row items-center justify-between px-3 py-2">
                    <Text className="text-base text-foreground">
                      {editableResult.type}
                    </Text>
                    <Text className="text-base text-foreground">▼</Text>
                  </View>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuRadioGroup
                    value={editableResult.type}
                    onValueChange={(itemValue) =>
                      setEditableResult((prev: any) => ({
                        ...prev,
                        type: itemValue,
                      }))
                    }
                  >
                    <DropdownMenuRadioItem value="Tâche">
                      <Text>Tâche</Text>
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="Événement">
                      <Text>Événement</Text>
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </View>
            {(REQUIRED_ENTITIES[editableResult.type] || []).map((key) => (
              <View key={key} className="flex-row items-center mb-1">
                <Text className="text-base text-foreground mr-2">
                  {ENTITY_LABELS[key] || key}:
                </Text>
                <Input
                  className="flex-1 rounded px-2 py-1 border border-border"
                  value={editableResult.entities[key] ?? ""}
                  onChangeText={(text) => handleEntityChange(key, text, 0)}
                />
              </View>
            ))}
            {/* Save button and status */}
            <View className="mt-3 flex-row items-center">
              <Button
                className="bg-primary px-4 py-2 rounded-full"
                onPress={handleSave}
                disabled={saveLoading}
              >
                <Text className="text-primary-foreground font-semibold">
                  {saveLoading ? "Saving..." : "Save"}
                </Text>
              </Button>
              {saveSuccess && (
                <Text className="ml-3 text-green-600 font-medium">
                  {saveSuccess}
                </Text>
              )}
              {saveError && (
                <Text className="ml-3 text-destructive font-medium">
                  {saveError}
                </Text>
              )}
            </View>
          </View>
        )}
        <View className="flex-row items-center px-4 py-3 bg-background">
          <Input
            className="flex-1 rounded-full px-4 py-2 mr-2"
            placeholder="Enter your task text here..."
            value={input}
            onChangeText={setInput}
            returnKeyType="send"
            onSubmitEditing={handleSend}
            editable={!loading}
          />
          <Button
            size="icon"
            className="rounded-full bg-primary active:opacity-80"
            onPress={handleSend}
            disabled={loading}
          >
            <Send size={14} color="#fff" />
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
