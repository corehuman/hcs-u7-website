import { NextRequest, NextResponse } from "next/server";

import { evaluateToken } from "@/lib/hcs-verify";
import {
  ROTATION_PERIOD_MS,
  ALLOWED_TIME_WINDOWS,
  generateRotatingCode,
} from "@/lib/hcs-rotating-code";
import { getUserProfile } from "@/lib/server-profile-store";
import { registerNonce } from "@/lib/rotating-nonce-store";

interface VerifyRotatingRequestBody {
  code?: string;
  userId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as VerifyRotatingRequestBody;

    if (!body?.code || typeof body.code !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid `code` in request body", isHuman: false },
        { status: 400 },
      );
    }

    if (!body?.userId || typeof body.userId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid `userId` in request body", isHuman: false },
        { status: 400 },
      );
    }

    const rawCode = body.code.trim();
    const userId = body.userId.trim();

    // Extraire TW (time window)
    const twMatch = rawCode.match(/TW:(\d+)/);
    if (!twMatch) {
      return NextResponse.json(
        { error: "Missing time window (TW:)", isHuman: false },
        { status: 400 },
      );
    }

    const codeTimeWindow = Number.parseInt(twMatch[1], 10);
    if (Number.isNaN(codeTimeWindow)) {
      return NextResponse.json(
        { error: "Invalid time window format", isHuman: false },
        { status: 400 },
      );
    }

    const now = Date.now();
    const currentTimeWindow = Math.floor(now / ROTATION_PERIOD_MS);

    // 1) Vérifier signature HMAC du code en recalculant depuis le profil stocké
    const stored = await getUserProfile(userId);
    if (!stored) {
      return NextResponse.json(
        { error: "Unknown user or profile not registered", isHuman: false },
        { status: 404 },
      );
    }

    const { profile, rotationKey } = stored;

    let matchedWindow: number | null = null;

    for (
      let window = currentTimeWindow - ALLOWED_TIME_WINDOWS;
      window <= currentTimeWindow + ALLOWED_TIME_WINDOWS;
      window += 1
    ) {
      if (window < 0) continue;
      const timestampForWindow = window * ROTATION_PERIOD_MS;
      const expected = generateRotatingCode(profile, rotationKey, timestampForWindow);
      if (expected.currentCode === rawCode) {
        matchedWindow = window;
        break;
      }
    }

    if (matchedWindow === null) {
      return NextResponse.json(
        { error: "Invalid rotating code signature", isHuman: false },
        { status: 401 },
      );
    }

    const windowDiff = Math.abs(currentTimeWindow - matchedWindow);
    const ageMinutes = windowDiff * (ROTATION_PERIOD_MS / 60000);

    // 2) Anti-replay fort (userId + timeWindow), basé sur Redis ou mémoire
    const nonceResult = await registerNonce(userId, codeTimeWindow);
    if (nonceResult === "replay") {
      return NextResponse.json(
        { error: "Replay attack detected", isHuman: false },
        { status: 403 },
      );
    }

    // 3) Décision "humain" basée sur le code HCS de base
    const { isHuman, confidence, reason } = evaluateToken(profile.code);

    return NextResponse.json(
      {
        isHuman,
        confidence,
        reason,
        decision: isHuman ? "allow" : "block",
        rotation: {
          codeAgeMinutes: ageMinutes,
          windowDiff,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[verify-rotating] Error while validating code:", error);
    return NextResponse.json(
      { error: "Unable to verify rotating HCS token", isHuman: false },
      { status: 500 },
    );
  }
}
