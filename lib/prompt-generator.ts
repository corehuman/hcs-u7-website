import type { HCSProfile, PaceCode, CognitionScores } from "./hcs-generator";

function getStructureGuidelines(cognition: CognitionScores): string {
  if (cognition.logic >= 70) {
    return "Prioritize logical frameworks, proofs and step-by-step reasoning.";
  }
  if (cognition.visual >= 70) {
    return "Use diagrams (ASCII if needed), spatial metaphors and visual summaries.";
  }
  if (cognition.creativity >= 70) {
    return "Explore multiple perspectives, propose alternatives and creative options.";
  }
  if (cognition.form >= 70) {
    return "Provide formal definitions, clear notation and explicit conditions.";
  }
  if (cognition.synthesis >= 70) {
    return "Focus on high-level synthesis with well-structured summaries.";
  }
  return "Use a balanced structure with headings, short paragraphs and bullet lists.";
}

function getDetailGuidelines(pace: PaceCode): string {
  if (pace === "S") {
    return "Use slower pacing with thorough explanations and intermediate steps.";
  }
  if (pace === "F") {
    return "Be concise. Go straight to the point, avoid redundant explanations.";
  }
  return "Adopt a balanced level of detail: neither too terse nor overwhelmingly detailed.";
}

function getExampleRatio(cognition: CognitionScores): string {
  if (cognition.form >= 60 || cognition.logic >= 60) {
    return "Use a few well-chosen examples to illustrate the underlying rules, not to replace them.";
  }
  if (cognition.visual >= 60) {
    return "Prefer examples that can be represented as diagrams, tables or timelines.";
  }
  if (cognition.creativity >= 60) {
    return "Provide multiple varied examples to stimulate exploration and idea generation.";
  }
  return "Mix theory and examples in roughly equal proportion.";
}

function getAvoidList(profile: HCSProfile): string {
  const { element, interaction } = profile;
  const items: string[] = [];

  if (interaction.pace === "F") {
    items.push("Overly long digressions or repeating the same idea in many ways.");
  } else if (interaction.pace === "S") {
    items.push("Skipping intermediate steps when the user explicitly asks for details.");
  }

  if (interaction.sensitivity === "H") {
    items.push("Harsh, sarcastic or dismissive tone, even if factually correct.");
  }

  if (interaction.tolerance === "L") {
    items.push("Speculative statements presented as facts or unqualified approximations.");
  }

  if (element === "E") {
    items.push("Overly emotional framing without clear logical structure.");
  }
  if (element === "F") {
    items.push("Paralysis by analysis: avoid excessive theory without clear actions.");
  }
  if (element === "W") {
    items.push("Detached, purely mechanical answers that ignore human context.");
  }
  if (element === "A") {
    items.push("Overly abstract discussions without concrete implications.");
  }

  return items.map((item) => `- ${item}`).join("\n");
}

function getPreferredApproach(profile: HCSProfile): string {
  const { element, cognition, interaction } = profile;

  const parts: string[] = [];

  if (element === "E") {
    parts.push(
      "Emphasize clear logical structure, definitions and explicit assumptions. Use precise technical vocabulary."
    );
  } else if (element === "F") {
    parts.push(
      "Emphasize decision-making, trade-offs and concrete action plans. Highlight what to do now versus later."
    );
  } else if (element === "W") {
    parts.push(
      "Emphasize empathy, context, narratives and how the information fits the user's broader goals."
    );
  } else if (element === "A") {
    parts.push(
      "Emphasize robust procedures, reliability and practical constraints. Show how to implement ideas in reality."
    );
  }

  parts.push(getStructureGuidelines(cognition));
  parts.push(getDetailGuidelines(interaction.pace));

  return parts.map((p) => `- ${p}`).join("\n");
}

export function generateChatGPTPrompt(profile: HCSProfile): string {
  const { element, cognition, interaction, code, interpretation } = profile;

  const elementDescriptions: Record<string, string> = {
    E: "analytical and conceptual",
    F: "action-oriented and direct",
    W: "empathetic and intuitive",
    A: "practical and methodical",
  };

  const paceDescriptions: Record<PaceCode, string> = {
    F: "Fast-paced with concise responses.",
    B: "Balanced pace with moderate detail.",
    S: "Slower pace with thorough explanations.",
  };

  const cognitionEntries = Object.entries(cognition) as [
    keyof CognitionScores,
    number,
  ][];
  const [dominantCogKey] = cognitionEntries.sort(([, a], [, b]) => b - a)[0] ?? [
    "logic",
    cognition.logic,
  ];

  return `# USER COGNITIVE PROFILE (HCS-U7)\n\nProfile code: ${code}\n\n## Interpretation\n\nPrimary cognitive style: ${elementDescriptions[element]}\nDominant cognition: ${dominantCogKey} (${cognition[dominantCogKey]}/100)\n\n${interpretation.summary.en}\n\n## Response Adaptation Guidelines\n\n1. **Structure**: ${getStructureGuidelines(cognition)}\n2. **Detail level**: ${getDetailGuidelines(interaction.pace)}\n3. **Communication style**: Prefer technical precision over vagueness. Adapt explanations to this cognitive profile.\n4. **Examples vs theory**: ${getExampleRatio(cognition)}\n5. **Pacing**: ${paceDescriptions[interaction.pace]}\n\n## What to AVOID\n${getAvoidList(profile)}\n\n## Preferred approach\n${getPreferredApproach(profile)}\n\nAlways adapt ALL answers to this profile, unless the user explicitly asks otherwise.`;
}

export function generateClaudePrompt(profile: HCSProfile): string {
  const base = generateChatGPTPrompt(profile);
  return `${base}\n\nYou are Claude. Interpret this HCS-U7 profile as persistent user preferences. Do not restate the profile unless asked. Instead, silently adapt your behavior, tone and pacing.`;
}
