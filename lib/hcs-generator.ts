export type ElementKey = "E" | "F" | "W" | "A";

export type ModalKey = "cardinal" | "fixed" | "mutable";

export type PaceCode = "S" | "B" | "F"; // Slow / Balanced / Fast

export type LevelCode = "L" | "M" | "H"; // Low / Medium / High

export interface CognitionScores {
  form: number;
  logic: number;
  visual: number;
  synthesis: number;
  creativity: number;
}

export interface ModalScores {
  cardinal: number;
  fixed: number;
  mutable: number;
}

export interface HCSInteraction {
  pace: PaceCode;
  sensitivity: LevelCode;
  tolerance: LevelCode;
}

export interface HCSOptionInteraction {
  pace?: PaceCode;
  sensitivity?: LevelCode;
  tolerance?: LevelCode;
}

export interface HCSOptionScoring {
  element?: ElementKey;
  modal?: ModalKey;
  cognition?: Partial<CognitionScores>;
  interaction?: HCSOptionInteraction;
  weight?: number;
}

export interface HCSAnswer {
  questionId: number;
  scoring: HCSOptionScoring;
}

export interface HCSInterpretation {
  element: ElementKey;
  elementLabel: {
    fr: string;
    en: string;
  };
  summary: {
    fr: string;
    en: string;
  };
  cognitionSummary: {
    fr: string;
    en: string;
  };
  interactionSummary: {
    fr: string;
    en: string;
  };
}

export interface HCSProfile {
  code: string;
  version: string;
  algorithm: string;
  element: ElementKey;
  modal: ModalScores;
  cognition: CognitionScores;
  interaction: HCSInteraction;
  qsig: string;
  b3: string;
  interpretation: HCSInterpretation;
  chart: { dimension: string; value: number }[];
}

function pickMaxKey<T extends string>(scores: Record<T, number>): T {
  return (Object.keys(scores) as T[]).reduce((best, key) =>
    scores[key] > scores[best] ? key : best
  );
}

function normalizeToPercent<T extends string>(scores: Record<T, number>): Record<T, number> {
  const keys = Object.keys(scores) as T[];
  const total = keys.reduce((sum, key) => sum + scores[key], 0) || 1;
  const result = {} as Record<T, number>;
  keys.forEach((key) => {
    const value = scores[key] ?? 0;
    result[key] = Math.round((value / total) * 100);
  });
  return result;
}

function simpleHash(input: string, length = 8): string {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash.toString(36).padStart(length, "0").slice(0, length);
}

function formatHCSCode(params: {
  version: string;
  algorithm: string;
  element: ElementKey;
  modal: ModalScores;
  cognition: CognitionScores;
  interaction: HCSInteraction;
  qsig: string;
  b3: string;
}): string {
  const { version, algorithm, element, modal, cognition, interaction, qsig, b3 } = params;

  return [
    "HCS-U7",
    `V:${version}`,
    `ALG:${algorithm}`,
    `E:${element}`,
    `MOD:c${modal.cardinal}f${modal.fixed}m${modal.mutable}`,
    `COG:F${cognition.form}C${cognition.logic}V${cognition.visual}S${cognition.synthesis}Cr${cognition.creativity}`,
    `INT:PB=${interaction.pace},SM=${interaction.sensitivity},TN=${interaction.tolerance}`,
    `QSIG:${qsig}`,
    `B3:${b3}`,
  ].join("|");
}

function generateInterpretation(
  element: ElementKey,
  cognition: CognitionScores,
  interaction: HCSInteraction
): HCSInterpretation {
  const elementLabels: Record<
    ElementKey,
    { fr: string; en: string; descriptionFr: string; descriptionEn: string }
  > = {
    E: {
      fr: "Analytique (Air)",
      en: "Analytical (Air)",
      descriptionFr:
        "Vous privilégiez les cadres conceptuels, les schémas logiques et les explications structurées.",
      descriptionEn:
        "You prioritize conceptual frameworks, logical structures and well-organized explanations.",
    },
    F: {
      fr: "Orienté Action (Feu)",
      en: "Action-Oriented (Fire)",
      descriptionFr:
        "Vous aimez les recommandations concrètes, les décisions rapides et les plans d'action clairs.",
      descriptionEn:
        "You like concrete recommendations, fast decisions and clear action plans.",
    },
    W: {
      fr: "Intuitif (Eau)",
      en: "Intuitive (Water)",
      descriptionFr:
        "Vous êtes sensible au contexte, aux nuances humaines et aux métaphores.",
      descriptionEn:
        "You are sensitive to context, human nuances and metaphors.",
    },
    A: {
      fr: "Pragmatique (Terre)",
      en: "Pragmatic (Earth)",
      descriptionFr:
        "Vous privilégiez les résultats concrets, les procédures fiables et la stabilité.",
      descriptionEn:
        "You prioritize concrete results, reliable procedures and stability.",
    },
  };

  const label = elementLabels[element];

  const cognitionSorted = Object.entries(cognition).sort(([, a], [, b]) => b - a);
  const [topKey, topValue] = cognitionSorted[0];

  const cogLabelMap: Record<string, { fr: string; en: string }> = {
    form: { fr: "Formel", en: "Formal" },
    logic: { fr: "Logique", en: "Logical" },
    visual: { fr: "Visuel", en: "Visual" },
    synthesis: { fr: "Synthétique", en: "Synthetic" },
    creativity: { fr: "Créatif", en: "Creative" },
  };

  const topCogLabel = cogLabelMap[topKey] ?? { fr: topKey, en: topKey };

  const cognitionSummary = {
    fr: `Cognition dominante : ${topCogLabel.fr} (${topValue}/100).`,
    en: `Dominant cognition: ${topCogLabel.en} (${topValue}/100).`,
  };

  const paceText: Record<PaceCode, { fr: string; en: string }> = {
    S: {
      fr: "Rythme plutôt lent, explications détaillées privilégiées.",
      en: "Rather slow pace, detailed explanations preferred.",
    },
    B: {
      fr: "Rythme équilibré, entre concision et détail.",
      en: "Balanced pace between concision and detail.",
    },
    F: {
      fr: "Rythme rapide, réponses condensées et directes.",
      en: "Fast pace, condensed and direct answers.",
    },
  };

  const sensitivityText: Record<LevelCode, { fr: string; en: string }> = {
    L: {
      fr: "Faible sensibilité au ton : priorité à la clarté.",
      en: "Low sensitivity to tone: clarity has priority.",
    },
    M: {
      fr: "Sensibilité moyenne au ton : équilibre entre forme et fond.",
      en: "Medium sensitivity to tone: balance between form and content.",
    },
    H: {
      fr: "Sensibilité élevée au ton : importance de la bienveillance et des nuances.",
      en: "High sensitivity to tone: kindness and nuance matter a lot.",
    },
  };

  const toleranceText: Record<LevelCode, { fr: string; en: string }> = {
    L: {
      fr: "Tolérance faible aux imprécisions : la rigueur est essentielle.",
      en: "Low tolerance to inaccuracies: rigor is essential.",
    },
    M: {
      fr: "Tolérance moyenne : quelques approximations sont acceptables.",
      en: "Medium tolerance: some approximations are acceptable.",
    },
    H: {
      fr: "Tolérance élevée : priorité à la vision globale et au flux.",
      en: "High tolerance: priority to the global picture and flow.",
    },
  };

  return {
    element,
    elementLabel: { fr: label.fr, en: label.en },
    summary: {
      fr: label.descriptionFr,
      en: label.descriptionEn,
    },
    cognitionSummary,
    interactionSummary: {
      fr: `${paceText[interaction.pace].fr} ${sensitivityText[interaction.sensitivity].fr} ${toleranceText[interaction.tolerance].fr}`,
      en: `${paceText[interaction.pace].en} ${sensitivityText[interaction.sensitivity].en} ${toleranceText[interaction.tolerance].en}`,
    },
  };
}

function generateChartData(cognition: CognitionScores): { dimension: string; value: number }[] {
  return [
    { dimension: "Form", value: cognition.form },
    { dimension: "Logic", value: cognition.logic },
    { dimension: "Visual", value: cognition.visual },
    { dimension: "Synthesis", value: cognition.synthesis },
    { dimension: "Creativity", value: cognition.creativity },
  ];
}

export function calculateHCSProfile(answers: HCSAnswer[]): HCSProfile {
  const elementScores: Record<ElementKey, number> = {
    E: 0,
    F: 0,
    W: 0,
    A: 0,
  };

  const rawCognition: CognitionScores = {
    form: 0,
    logic: 0,
    visual: 0,
    synthesis: 0,
    creativity: 0,
  };

  const rawModal: ModalScores = {
    cardinal: 0,
    fixed: 0,
    mutable: 0,
  };

  const paceScores: Record<PaceCode, number> = { S: 0, B: 0, F: 0 };
  const sensitivityScores: Record<LevelCode, number> = { L: 0, M: 0, H: 0 };
  const toleranceScores: Record<LevelCode, number> = { L: 0, M: 0, H: 0 };

  answers.forEach((answer) => {
    const { scoring } = answer;
    const weight = scoring.weight ?? 1;

    if (scoring.element) {
      elementScores[scoring.element] += weight;
    }

    if (scoring.modal) {
      rawModal[scoring.modal] += weight;
    }

    if (scoring.cognition) {
      (Object.keys(scoring.cognition) as (keyof CognitionScores)[]).forEach((key) => {
        const value = scoring.cognition?.[key] ?? 0;
        rawCognition[key] += value * weight;
      });
    }

    if (scoring.interaction) {
      const { pace, sensitivity, tolerance } = scoring.interaction;
      if (pace) paceScores[pace] += weight;
      if (sensitivity) sensitivityScores[sensitivity] += weight;
      if (tolerance) toleranceScores[tolerance] += weight;
    }
  });

  const dominantElement = pickMaxKey(elementScores);

  const cognitionPercent = normalizeToPercent<keyof CognitionScores>(
    rawCognition as Record<keyof CognitionScores, number>
  ) as CognitionScores;

  const modalPercent = normalizeToPercent<keyof ModalScores>(rawModal);

  const interaction: HCSInteraction = {
    pace: pickMaxKey(paceScores),
    sensitivity: pickMaxKey(sensitivityScores),
    tolerance: pickMaxKey(toleranceScores),
  };

  const baseForSignature = {
    element: dominantElement,
    cognition: cognitionPercent,
    modal: modalPercent,
    interaction,
  };

  const qsig = simpleHash(JSON.stringify(baseForSignature), 10);
  const b3 = simpleHash(`${dominantElement}-${qsig}`, 8);

  const cognitionNormalized: CognitionScores = {
    form: cognitionPercent.form,
    logic: cognitionPercent.logic,
    visual: cognitionPercent.visual,
    synthesis: cognitionPercent.synthesis,
    creativity: cognitionPercent.creativity,
  };

  const modalNormalized: ModalScores = {
    cardinal: modalPercent.cardinal,
    fixed: modalPercent.fixed,
    mutable: modalPercent.mutable,
  };

  const interpretation = generateInterpretation(dominantElement, cognitionNormalized, interaction);

  const profile: HCSProfile = {
    code: formatHCSCode({
      version: "7.0",
      algorithm: "QS",
      element: dominantElement,
      modal: modalNormalized,
      cognition: cognitionNormalized,
      interaction,
      qsig,
      b3,
    }),
    version: "7.0",
    algorithm: "QS",
    element: dominantElement,
    modal: modalNormalized,
    cognition: cognitionNormalized,
    interaction,
    qsig,
    b3,
    interpretation,
    chart: generateChartData(cognitionNormalized),
  };

  return profile;
}
