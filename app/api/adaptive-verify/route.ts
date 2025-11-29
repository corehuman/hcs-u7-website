import { NextRequest, NextResponse } from "next/server";
import { evaluateToken } from "@/lib/hcs-verify";
import {
  ADAPTIVE_STRATEGIES,
  type RiskLevel,
  type TestType,
} from "@/lib/adaptive-testing";

interface AdaptiveVerifyBody {
  riskLevel: RiskLevel;
  hcsToken?: string;
  testResults?: Partial<Record<TestType, unknown>>;
}

function isRiskLevel(value: unknown): value is RiskLevel {
  return value === "low" || value === "medium" || value === "high";
}

export async function POST(req: NextRequest) {
  let body: AdaptiveVerifyBody;

  try {
    body = (await req.json()) as AdaptiveVerifyBody;
  } catch {
    return NextResponse.json(
      {
        error: "invalid_payload",
        message: "Unable to parse request body as JSON.",
      },
      { status: 400 },
    );
  }

  if (!isRiskLevel(body.riskLevel)) {
    return NextResponse.json(
      {
        error: "invalid_risk_level",
        message: "Expected riskLevel to be one of: low, medium, high.",
      },
      { status: 400 },
    );
  }

  const strategy = ADAPTIVE_STRATEGIES[body.riskLevel];

  // Validate that required tests are present when testResults are provided
  if (strategy.tests.required.length > 0) {
    const tests = body.testResults ?? {};
    const missing = strategy.tests.required.filter((test) => tests[test] === undefined);

    if (missing.length > 0) {
      return NextResponse.json(
        {
          error: "missing_required_tests",
          message: "Missing required cognitive tests for this risk level.",
          missing,
        },
        { status: 400 },
      );
    }
  }

  // Reuse existing token evaluation logic (no new scoring algorithm)
  let baseConfidence = 0.5;
  let reason = "no_token";
  let baseIsHuman = false;

  if (body.hcsToken && typeof body.hcsToken === "string") {
    const evalResult = evaluateToken(body.hcsToken);
    baseConfidence = evalResult.confidence;
    reason = evalResult.reason;
    baseIsHuman = evalResult.isHuman;
  }

  const confidenceTarget = strategy.confidenceTarget;
  const isHuman = baseConfidence >= confidenceTarget;

  return NextResponse.json({
    riskLevel: body.riskLevel,
    strategy,
    tokenEvaluation: {
      isHuman: baseIsHuman,
      confidence: baseConfidence,
      reason,
    },
    decision: isHuman ? "allow" : "challenge",
    isHuman,
    confidenceTarget,
  });
}
