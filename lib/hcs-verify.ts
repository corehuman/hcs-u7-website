export interface HumanVerificationResult {
  isHuman: boolean;
  confidence: number;
  reason: string;
}

export function evaluateToken(token: string): HumanVerificationResult {
  const value = token.trim();

  if (!value || value.length < 16) {
    return {
      isHuman: false,
      confidence: 0.1,
      reason: "token_too_short",
    };
  }

  const lower = value.toLowerCase();
  if (lower.startsWith("bot_") || lower.includes("bot")) {
    return {
      isHuman: false,
      confidence: 0.05,
      reason: "explicit_bot_marker",
    };
  }

  const uniqueChars = new Set(value).size;
  const entropyRatio = uniqueChars / value.length;

  const confidence = Math.max(0.5, Math.min(0.99, 0.5 + entropyRatio * 0.5));
  const isHuman = confidence > 0.85;

  return {
    isHuman,
    confidence,
    reason: isHuman ? "accepted" : "low_confidence",
  };
}
