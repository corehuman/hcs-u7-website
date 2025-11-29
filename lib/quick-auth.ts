export type QuickAuthMode = "quick" | "standard" | "high-security";

export interface QuickAuthConfig {
  mode: QuickAuthMode;
  tests: {
    stroop: { trials: number };
    reactionTime: { trials: number };
    nback: { trials: number };
  };
  estimatedDuration: string;
  confidenceThreshold: number;
}

export interface StroopQuickResult {
  score: number; // 0-100
  stroopEffect: number;
  inhibitoryControl: number;
  accuracy: number;
}

export interface ReactionTimeQuickResult {
  score: number; // 0-100 processing speed
  simpleRT: number; // ms
  choiceRT: number; // ms
  consistency: number; // SD ms
  accuracy: number; // % choice trials correct
}

export interface NBackQuickResult {
  score: number; // 0-100 working memory
  workingMemory: number;
  accuracy: number;
  dPrime: number;
}

export interface QuickAuthInputs {
  stroop: StroopQuickResult;
  reactionTime: ReactionTimeQuickResult;
  nback: NBackQuickResult;
}

export interface QuickAuthBreakdown {
  stroop: number;
  reactionTime: number;
  nback: number;
}

export interface QuickAuthEvaluation {
  isHuman: boolean;
  confidence: number;
  token: string;
  breakdown: QuickAuthBreakdown;
}

export const QUICK_AUTH_CONFIG: QuickAuthConfig = {
  mode: "quick",
  tests: {
    stroop: { trials: 10 },
    reactionTime: { trials: 5 },
    nback: { trials: 8 },
  },
  estimatedDuration: "45-90s",
  confidenceThreshold: 0.9,
};

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
}

export function evaluateQuickAuth(inputs: QuickAuthInputs, mode: QuickAuthMode = "quick"): QuickAuthEvaluation {
  const stroopNorm = clamp01(inputs.stroop.score / 100);
  const rtNorm = clamp01(inputs.reactionTime.score / 100);
  const nbackNorm = clamp01(inputs.nback.score / 100);

  const weights =
    mode === "high-security"
      ? { stroop: 0.35, reactionTime: 0.35, nback: 0.3 }
      : mode === "standard"
      ? { stroop: 0.33, reactionTime: 0.33, nback: 0.34 }
      : { stroop: 0.4, reactionTime: 0.35, nback: 0.25 };

  const stroopScore = stroopNorm * weights.stroop;
  const rtScore = rtNorm * weights.reactionTime;
  const nbackScore = nbackNorm * weights.nback;

  const confidence = clamp01(stroopScore + rtScore + nbackScore);
  const isHuman = confidence >= QUICK_AUTH_CONFIG.confidenceThreshold;

  const tokenParts = [
    "HCS-U7-QUICK",
    `M:${mode}`,
    `C:${Math.round(confidence * 100)}`,
    `S:${Math.round(stroopNorm * 100)}`,
    `RT:${Math.round(rtNorm * 100)}`,
    `NB:${Math.round(nbackNorm * 100)}`,
  ];

  const token = tokenParts.join("|");

  return {
    isHuman,
    confidence,
    token,
    breakdown: {
      stroop: stroopNorm,
      reactionTime: rtNorm,
      nback: nbackNorm,
    },
  };
}
