import { NextResponse } from "next/server";

interface VerifyRequestBody {
  hcsToken?: string;
}

function evaluateToken(token: string) {
  const value = token.trim();

  if (!value || value.length < 16) {
    return {
      isHuman: false,
      confidence: 0.1,
      reason: "token_too_short",
    } as const;
  }

  const lower = value.toLowerCase();
  if (lower.startsWith("bot_") || lower.includes("bot")) {
    return {
      isHuman: false,
      confidence: 0.05,
      reason: "explicit_bot_marker",
    } as const;
  }

  // Simple entropy heuristic
  const uniqueChars = new Set(value).size;
  const entropyRatio = uniqueChars / value.length; // 0–1

  // Map entropy ratio to confidence [0.5, 0.99]
  const confidence = Math.max(0.5, Math.min(0.99, 0.5 + entropyRatio * 0.5));
  const isHuman = confidence > 0.85;

  return {
    isHuman,
    confidence,
    reason: isHuman ? "accepted" : "low_confidence",
  } as const;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VerifyRequestBody;

    if (!body?.hcsToken || typeof body.hcsToken !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid `hcsToken` in request body" },
        { status: 400 },
      );
    }

    const { isHuman, confidence, reason } = evaluateToken(body.hcsToken);

    const apiKeyHeader = request.headers.get("x-hcs-api-key");
    const hasApiKey = Boolean(apiKeyHeader);

    return NextResponse.json(
      {
        isHuman,
        confidence,
        reason,
        decision: isHuman ? "allow" : "block",
        apiKeyMode: hasApiKey ? "api_key_provided" : "demo_no_api_key",
      },
      { status: 200 },
    );
  } catch (_error) {
    return NextResponse.json(
      { error: "Unable to verify human token" },
      { status: 500 },
    );
  }
}
