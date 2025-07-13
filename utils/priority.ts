// Priority classification utility
// Standardizes priority text into consistent categories

export type PriorityLevel = "high" | "medium" | "low";

// Comprehensive keyword-based mapping for priority terms
const HIGH_PRIORITY_KEYWORDS = [
  // English terms
  "urgent",
  "critical",
  "high",
  "asap",
  "immediate",
  "emergency",
  "vital",
  "crucial",
  "essential",
  "pressing",
  "priority",
  "top priority",
  "highest priority",
  "severe",
  "major",
  "important",
  "deadline",
  "due",
  "soon",
  "rush",
  "hurry",
  "expedite",
  "expedited",
  "top",
  "at once",
  "without delay",
  "right away",
  "imperativ",
  "now",
  "quickly",
  "timely",
  "stat",
  "fast-track",
  "fast track",
  "as soon as possible",
  "time sensitive",
  "time-sensitive",
  "high importance",
  "highest",
  "extreme",
  "hot",
  "escalated",
  "cannot wait",
  "can't wait",
  "tomorrow",
  "today",
  "overdue",
  "past due",
  "drop everything",
  "mission critical",
  "blocking",

  // French terms
  "urgent",
  "urgente",
  "critique",
  "haute",
  "élevée",
  "prioritaire",
  "priorité élevée",
  "immédiat",
  "immédiate",
  "immédiatement",
  "crucial",
  "urgence",
  "essentiel",
  "essentielle",
  "pressant",
  "pressante",
  "importante",
  "primordial",
  "primordiale",
  "majeur",
  "majeure",
  "capital",
  "capitale",
  "priorité absolue",
  "au plus tôt",
  "au plus vite",
  "sans délai",
  "sans tarder",
  "date limite",
  "rapidement",
  "vite",
  "très important",
  "impératif",
  "impérative",
  "pressé",
  "pressée",
  "express",
  "tout de suite",
  "maintenant",
  "critique",
  "de toute urgence",
  "en urgence",
  "ne peut pas attendre",
  "brûlant",
  "cruciale",
  "vitale",
  "première priorité",
  "retardé",
  "retardée",
  "en retard",
  "échéance proche",
  "à faire aujourd'hui",
  "à traiter en priorité",
  "date butoir",
  "date critique",
  "échéance imminente",
  "critique pour l'activité",
  "bloquant",
  "bloquante",
];

const MEDIUM_PRIORITY_KEYWORDS = [
  // English terms
  "medium",
  "moderate",
  "normal",
  "average",
  "intermediate",
  "standard",
  "regular",
  "nominal",
  "typical",
  "neutral",
  "middle",
  "mid",
  "ordinary",
  "conventional",
  "usual",
  "routine",
  "common",
  "next week",
  "this week",
  "soon enough",
  "reasonably soon",
  "moderately important",
  "fairly important",
  "somewhat urgent",

  // French terms
  "moyenne",
  "modérée",
  "normale",
  "standard",
  "intermédiaire",
  "milieu",
  "ordinaire",
  "habituelle",
  "conventionnelle",
  "assez importante",
  "assez urgent",
  "moyennement urgent",
  "moyennement importante",
  "relativement",
  "dans la semaine",
  "cette semaine",
  "bientôt",
  "prochainement",
  "secondaire mais important",
  "priorité normale",
  "importance moyenne",
  "semi-urgent",
  "mi-urgent",
  "modérément important",
  "à faire cette semaine",
  "dans les jours qui viennent",
  "niveau intermédiaire",
];

const LOW_PRIORITY_KEYWORDS = [
  // English terms
  "low",
  "minor",
  "minimal",
  "slight",
  "not urgent",
  "not important",
  "whenever",
  "when possible",
  "when convenient",
  "someday",
  "eventually",
  "later",
  "can wait",
  "non-urgent",
  "non-critical",
  "unimportant",
  "least important",
  "lowest priority",
  "trivial",
  "marginal",
  "secondary",
  "tertiary",
  "optional",
  "at your convenience",
  "no rush",
  "no hurry",
  "take your time",
  "not a priority",
  "not pressing",
  "background",
  "back-burner",
  "back burner",
  "nice to have",
  "non-essential",
  "postponable",
  "deferrable",
  "negligible",
  "ignorable",
  "insignificant",
  "low importance",
  "low urgency",
  "next month",
  "in the future",
  "long-term",
  "when time permits",
  "whenever you get around to it",
  "at leisure",
  "P5",

  // French terms
  "faible",
  "basse",
  "peu",
  "peu importante",
  "peu urgent",
  "mineure",
  "mineur",
  "plus tard",
  "éventuel",
  "éventuelle",
  "quand possible",
  "non urgent",
  "secondaire",
  "tertiaire",
  "optionnel",
  "optionnelle",
  "à votre convenance",
  "sans empressement",
  "prenez votre temps",
  "pas une priorité",
  "non prioritaire",
  "non essentiel",
  "non essentielle",
  "reportable",
  "négligeable",
  "insignifiant",
  "insignifiante",
  "importance faible",
  "peut attendre",
  "différable",
  "sans importance",
  "à loisir",
  "quand vous aurez le temps",
  "ultérieurement",
  "sans urgence",
  "à reporter",
  "le mois prochain",
  "dans le futur",
  "à long terme",
  "quand vous voulez",
  "occasionnel",
  "occasionnelle",
  "accessoire",
  "annexe",
  "subsidiaire",
  "subordonné",
  "subordonnée",
  "pas pressé",
  "pas pressée",
  "à faire plus tard",
  "basse priorité",
  "dernière priorité",
  "en dernier lieu",
  "si le temps le permet",
];

// Negation words/phrases that can flip the meaning of priority keywords
const NEGATION_WORDS = [
  // English
  "not",
  "no",
  "never",
  "none",
  "isn't",
  "isnt",
  "doesn't",
  "doesnt",
  "don't",
  "dont",
  "won't",
  "wont",
  "wouldn't",
  "wouldnt",
  "can't",
  "cant",
  "cannot",
  "shouldn't",
  "shouldnt",
  "without",
  "lacking",
  "lack of",
  "absence of",
  "zero",

  // French
  "pas",
  "non",
  "jamais",
  "aucun",
  "aucune",
  "n'est pas",
  "nest pas",
  "ne sont pas",
  "ne sera pas",
  "n'était pas",
  "netait pas",
  "sans",
  "manque de",
  "absence de",
  "n'a pas",
  "na pas",
  "n'ont pas",
  "nont pas",
  "ni",
  "nullement",
];

export const priorityService = {
  /**
   * Classify priority text into standard levels (high, medium, low)
   * @param priorityText Raw priority text from NLP extraction
   * @returns Standardized priority level
   */
  classifyPriority(priorityText: string | null | undefined): PriorityLevel {
    // Default to medium if no priority text is provided
    if (!priorityText) return "medium";

    const text = priorityText.toLowerCase().trim();

    // First check for exact low priority phrases (including negated high priority phrases)
    if (LOW_PRIORITY_KEYWORDS.some((keyword) => text.includes(keyword))) {
      return "low";
    }

    // Check for negated high priority terms
    const containsNegatedHighPriority = HIGH_PRIORITY_KEYWORDS.some(
      (highKeyword) => {
        // Check if the high priority keyword exists in the text
        if (text.includes(highKeyword)) {
          // If it does, check if it's preceded by a negation within a reasonable distance
          const keywordIndex = text.indexOf(highKeyword);
          const textBeforeKeyword = text.substring(
            Math.max(0, keywordIndex - 15),
            keywordIndex
          );

          // If any negation word appears before the high priority keyword, it's negated
          return NEGATION_WORDS.some((negation) =>
            textBeforeKeyword.includes(negation)
          );
        }
        return false;
      }
    );

    // If we found a negated high priority term, classify as low priority
    if (containsNegatedHighPriority) {
      return "low";
    }

    // Check for non-negated high priority keywords
    const containsHighPriority = HIGH_PRIORITY_KEYWORDS.some((keyword) => {
      // Check if keyword exists in text
      if (text.includes(keyword)) {
        // Get position of keyword
        const keywordIndex = text.indexOf(keyword);
        // Get text before the keyword (limited to reasonable context)
        const textBeforeKeyword = text.substring(
          Math.max(0, keywordIndex - 15),
          keywordIndex
        );

        // Ensure no negation word appears before the keyword
        return !NEGATION_WORDS.some((negation) =>
          textBeforeKeyword.includes(negation)
        );
      }
      return false;
    });

    if (containsHighPriority) {
      return "high";
    }

    // Check for medium priority keywords (after checking for negated high priority)
    if (MEDIUM_PRIORITY_KEYWORDS.some((keyword) => text.includes(keyword))) {
      return "medium";
    }

    // Default to medium for anything not matching other patterns
    return "medium";
  },

  /**
   * Get a display-friendly label for a priority level
   */
  getPriorityLabel(priority: PriorityLevel): string {
    const labels: Record<PriorityLevel, string> = {
      high: "High",
      medium: "Medium",
      low: "Low",
    };
    return labels[priority] || "Medium";
  },

  /**
   * Get a color for a priority level
   */
  getPriorityColor(priority: PriorityLevel): string {
    const colors: Record<PriorityLevel, string> = {
      high: "text-red-500",
      medium: "text-amber-500",
      low: "text-green-500",
    };
    return colors[priority] || "text-amber-500";
  },
}; 