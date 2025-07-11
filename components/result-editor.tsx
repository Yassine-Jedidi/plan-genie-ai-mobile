import * as chrono from "chrono-node";
import { X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
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
import { ENTITY_LABELS, REQUIRED_ENTITIES } from "~/constants/entities";
import { eventsAPI, tasksAPI } from "~/services/api";
import { PriorityLevel, priorityService } from "~/services/priority";

interface ResultEditorProps {
  result: any;
  onClear: () => void;
}

export function ResultEditor({ result, onClear }: ResultEditorProps) {
  const [editableResult, setEditableResult] = useState<any>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [parsedDate, setParsedDate] = useState<string | null>(null);
  const [parsedDateObject, setParsedDateObject] = useState<Date | null>(null);
  const [classifiedPriority, setClassifiedPriority] =
    useState<PriorityLevel>("medium");

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

      // Classify priority if it's a task
      if (normalized.type === "Tâche" && normalized.entities?.PRIORITE) {
        const priority = priorityService.classifyPriority(
          normalized.entities.PRIORITE
        );
        setClassifiedPriority(priority);
      }
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

  // Reset classified priority when result is cleared
  useEffect(() => {
    if (!editableResult) {
      setClassifiedPriority("medium");
    }
  }, [editableResult]);

  useEffect(() => {
    if (!editableResult) {
      setParsedDate(null);
      setParsedDateObject(null);
      return;
    }
    const type = editableResult.type;
    let dateStr: string | null = null;
    let dateObj: Date | null = null;
    if (type === "Tâche") {
      const delai = editableResult.entities.DELAI;
      if (typeof delai === "string" && delai.trim()) {
        let date: Date | null = chrono.fr.parseDate(delai);
        if (!date) date = chrono.parseDate(delai) as Date | null;
        if (date !== null) {
          dateObj = date;
          const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          };
          dateStr = `Interpreted as: ${date.toLocaleDateString(
            "en-US",
            options
          )}`;
        }
      }
    } else if (type === "Événement") {
      const dateHeure = editableResult.entities.DATE_HEURE;
      if (typeof dateHeure === "string" && dateHeure.trim()) {
        let date: Date | null = chrono.fr.parseDate(dateHeure);
        if (!date) date = chrono.parseDate(dateHeure) as Date | null;
        if (date !== null) {
          dateObj = date;
          const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          };
          dateStr = `Interpreted as: ${date.toLocaleDateString(
            "en-US",
            options
          )}`;
        }
      }
    }
    setParsedDate(dateStr);
    setParsedDateObject(dateObj);
  }, [editableResult]);

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
        // If it's not an array, just set the value directly
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
      // Create a copy of entities and convert back to array format for backend
      const entitiesToSave: any = {};
      Object.keys(editableResult.entities).forEach((key) => {
        const value = editableResult.entities[key];
        // Convert string values back to arrays as expected by backend
        entitiesToSave[key] = Array.isArray(value) ? value : [value];
      });

      // Use classified priority for tasks
      if (editableResult.type === "Tâche" && entitiesToSave.PRIORITE) {
        // Convert priority level to database format: "Low", "Medium", "High"
        const priorityMap: Record<PriorityLevel, string> = {
          low: "Low",
          medium: "Medium",
          high: "High",
        };
        entitiesToSave.PRIORITE = [priorityMap[classifiedPriority]];
      }

      if (
        editableResult.type === "Tâche" &&
        parsedDateObject &&
        entitiesToSave.DELAI
      ) {
        // Preserve the original text as DELAI_TEXT for deadline_text
        entitiesToSave.DELAI_TEXT = entitiesToSave.DELAI;
        // Set the parsed date as DELAI for the actual deadline
        entitiesToSave.DELAI = [parsedDateObject.toISOString()];
      } else if (
        editableResult.type === "Événement" &&
        parsedDateObject &&
        entitiesToSave.DATE_HEURE
      ) {
        // For events: DATE_HEURE contains original text, DATE_HEURE_PARSED contains parsed date
        // The backend expects DATE_HEURE[0] for date_time_text and DATE_HEURE_PARSED[0] for date_time
        entitiesToSave.DATE_HEURE_PARSED = [parsedDateObject.toISOString()];
        // Keep DATE_HEURE as the original text for date_time_text
      }

      const result =
        editableResult.type === "Tâche"
          ? await tasksAPI.saveTask(editableResult.type, entitiesToSave)
          : await eventsAPI.saveEvent(editableResult.type, entitiesToSave);
      console.log("Save result:", result);
      setSaveSuccess("Task saved successfully!");
      onClear();
      Toast.show({
        type: "success",
        text1: `Your ${
          editableResult.type === "Tâche" ? "task" : "event"
        } has been saved.`,
        text2: "You can now view it in your task list.",
        position: "top",
      });
    } catch (err: any) {
      setSaveError(err.message || "Failed to save task.");
      Toast.show({
        type: "error",
        text1: "Save failed",
        text2:
          err.message ||
          `Failed to save ${
            editableResult.type === "Tâche" ? "task" : "event"
          }.`,
        position: "top",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  if (!editableResult) return null;

  return (
    <View className="w-full max-w-md mx-auto">
      <View
        className="relative rounded-2xl bg-card shadow-lg p-5 border border-border"
        style={{ elevation: 4 }}
      >
        {/* X icon to clear results */}
        <Button
          size="icon"
          variant="ghost"
          className="absolute right-3 top-3 z-10 bg-white/80 border border-border shadow-sm"
          onPress={onClear}
        >
          <X size={18} color="#888" />
        </Button>
        {/* Type with icon */}
        <View className="flex-row items-center mb-3">
          <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-3">
            <Text className="text-lg">
              {editableResult.type === "Tâche" ? "📝" : "📅"}
            </Text>
          </View>
          <Text className="text-lg font-bold text-foreground">
            {editableResult.type}
          </Text>
        </View>
        <View className="mb-2 border border-border rounded overflow-hidden">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <View className="flex-row items-center justify-between px-3 py-2 bg-muted">
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
        {/* Entity fields with dividers */}
        {(REQUIRED_ENTITIES[editableResult.type] || []).map((key, idx, arr) => (
          <View key={key}>
            <View className="flex-row items-center py-2">
              <Text className="text-base text-foreground mr-2 min-w-[80px]">
                {ENTITY_LABELS[key] || key}:
              </Text>
              {key === "PRIORITE" ? (
                <View className="flex-1 border border-border rounded overflow-hidden">
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <View className="flex-row items-center justify-between px-3 py-2 bg-background">
                        <Text
                          className={`text-base ${priorityService.getPriorityColor(
                            classifiedPriority
                          )}`}
                        >
                          {priorityService.getPriorityLabel(classifiedPriority)}
                        </Text>
                        <Text className="text-base text-foreground">▼</Text>
                      </View>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuRadioGroup
                        value={classifiedPriority}
                        onValueChange={(value: string) => {
                          const priorityValue = value as PriorityLevel;
                          setClassifiedPriority(priorityValue);
                          handleEntityChange(key, value, 0);
                        }}
                      >
                        <DropdownMenuRadioItem value="high">
                          <Text className="text-red-500">High</Text>
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="medium">
                          <Text className="text-amber-500">Medium</Text>
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="low">
                          <Text className="text-green-500">Low</Text>
                        </DropdownMenuRadioItem>
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {/* Show original extracted priority text */}
                  {editableResult.entities[key] && (
                    <View className="ml-2 mb-1">
                      <Text className="text-xs text-muted-foreground">
                        Extracted: "{editableResult.entities[key]}"
                      </Text>
                    </View>
                  )}
                </View>
              ) : (
                <Input
                  className="flex-1 rounded px-2 py-1 border border-border bg-background"
                  value={String(editableResult.entities[key] ?? "")}
                  onChangeText={(text) => handleEntityChange(key, text, 0)}
                />
              )}
            </View>
            {/* Show parsed date for DELAI or DATE_HEURE */}
            {((key === "DELAI" && editableResult.type === "Tâche") ||
              (key === "DATE_HEURE" && editableResult.type === "Événement")) &&
              parsedDate && (
                <View className="ml-2 mb-1">
                  <Text className="text-xs text-muted-foreground">
                    {parsedDate}
                  </Text>
                </View>
              )}
            {idx < arr.length - 1 && (
              <View className="h-px bg-border opacity-60 mx-1" />
            )}
          </View>
        ))}
        {/* Save button and status */}
        <View className="mt-4 flex-row items-center justify-end">
          <Button
            className="bg-primary px-4 py-2 rounded-full shadow-md"
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
    </View>
  );
}
