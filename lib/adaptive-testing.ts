export type RiskLevel = "low" | "medium" | "high";

export type TestType =
  | "stroop-mini"
  | "reaction-time"
  | "nback-mini"
  | "quick-auth"
  | "full-battery";

export interface AdaptiveStrategy {
  riskLevel: RiskLevel;
  tests: {
    required: TestType[];
    optional: TestType[];
  };
  estimatedDuration: string;
  confidenceTarget: number;
  description: {
    fr: string;
    en: string;
  };
}

export const ADAPTIVE_STRATEGIES: Record<RiskLevel, AdaptiveStrategy> = {
  low: {
    riskLevel: "low",
    tests: {
      required: ["stroop-mini"],
      optional: ["reaction-time", "quick-auth"],
    },
    estimatedDuration: "30-60s",
    confidenceTarget: 0.85,
    description: {
      fr: "Contexte faible risque (session connue, faible montant). Tests minimum pour filtrer les bots évidents.",
      en: "Low-risk context (known session, low amount). Minimal tests to filter obvious bots.",
    },
  },
  medium: {
    riskLevel: "medium",
    tests: {
      required: ["stroop-mini", "reaction-time"],
      optional: ["nback-mini", "quick-auth"],
    },
    estimatedDuration: "60-120s",
    confidenceTarget: 0.9,
    description: {
      fr: "Risque moyen (nouvel appareil, changement de pays, transaction significative). Combine plusieurs signaux.",
      en: "Medium risk (new device, country change, significant transaction). Combines multiple signals.",
    },
  },
  high: {
    riskLevel: "high",
    tests: {
      required: ["full-battery"],
      optional: ["quick-auth"],
    },
    estimatedDuration: "4-6min",
    confidenceTarget: 0.99,
    description: {
      fr: "Risque élevé (onboarding bancaire, transaction >10k, suspicion de fraude). Nécessite la batterie complète.",
      en: "High risk (bank onboarding, >10k transaction, suspected fraud). Requires full battery.",
    },
  },
};

export function getAdaptiveStrategy(riskLevel: RiskLevel): AdaptiveStrategy {
  return ADAPTIVE_STRATEGIES[riskLevel];
}
