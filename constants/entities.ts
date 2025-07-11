// Entity label mapping
export const ENTITY_LABELS: Record<string, string> = {
  TITRE: "Title",
  DELAI: "Deadline",
  PRIORITE: "Priority",
  DATE_HEURE: "Date",
};

// Required entities per type
export const REQUIRED_ENTITIES: Record<string, string[]> = {
  Tâche: ["TITRE", "DELAI", "PRIORITE"],
  Événement: ["TITRE", "DATE_HEURE"],
}; 