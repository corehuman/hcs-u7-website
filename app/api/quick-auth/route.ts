import { NextRequest, NextResponse } from "next/server";
import {
  QUICK_AUTH_CONFIG,
  evaluateQuickAuth,
  type QuickAuthInputs,
  type QuickAuthMode,
} from "@/lib/quick-auth";

export async function GET() {
  return NextResponse.json({ config: QUICK_AUTH_CONFIG });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { mode, inputs } = body as {
      mode?: QuickAuthMode;
      inputs?: QuickAuthInputs;
    };

    if (!inputs || !inputs.stroop || !inputs.reactionTime || !inputs.nback) {
      return NextResponse.json(
        {
          error: "missing_inputs",
          message:
            "Expected inputs.stroop, inputs.reactionTime and inputs.nback in the request body.",
        },
        { status: 400 },
      );
    }

    const safeMode: QuickAuthMode = mode ?? QUICK_AUTH_CONFIG.mode;
    const evaluation = evaluateQuickAuth(inputs, safeMode);

    return NextResponse.json({
      mode: safeMode,
      evaluation,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "invalid_payload",
        message: "Unable to parse request body as Quick Auth payload.",
      },
      { status: 400 },
    );
  }
}
