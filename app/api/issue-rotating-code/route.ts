import { NextRequest, NextResponse } from "next/server";

import { generateRotatingCode } from "@/lib/hcs-rotating-code";
import { getUserProfile } from "@/lib/server-profile-store";

interface IssueRotatingCodeBody {
  userId?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as IssueRotatingCodeBody;

    if (!body?.userId || typeof body.userId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid `userId`", ok: false },
        { status: 400 },
      );
    }

    const userId = body.userId.trim();
    const stored = await getUserProfile(userId);

    if (!stored) {
      return NextResponse.json(
        { error: "Profile not found for this userId", ok: false },
        { status: 404 },
      );
    }

    const { profile, rotationKey } = stored;
    const rotating = generateRotatingCode(profile, rotationKey);

    return NextResponse.json({
      ok: true,
      currentCode: rotating.currentCode,
      currentWindow: rotating.currentWindow,
      expiresAt: rotating.expiresAt,
      rotationPeriod: rotating.rotationPeriod,
    });
  } catch (error) {
    console.error("[/api/issue-rotating-code] Error while issuing code:", error);
    return NextResponse.json(
      { error: "Unable to issue rotating code", ok: false },
      { status: 500 },
    );
  }
}
