import { NextRequest, NextResponse } from "next/server";

import type { HCSProfile } from "@/lib/hcs-generator";
import { setUserProfile } from "@/lib/server-profile-store";

interface ProfileRequestBody {
  userId?: string;
  profile?: HCSProfile;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ProfileRequestBody;

    if (!body?.userId || typeof body.userId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid `userId`", ok: false },
        { status: 400 },
      );
    }

    if (!body.profile || typeof body.profile !== "object") {
      return NextResponse.json(
        { error: "Missing or invalid `profile`", ok: false },
        { status: 400 },
      );
    }

    const entry = await setUserProfile(body.userId, body.profile);

    return NextResponse.json({ ok: true, rotationKeyCreated: Boolean(entry.rotationKey) });
  } catch (error) {
    console.error("[/api/profile] Error while storing profile:", error);
    return NextResponse.json(
      { error: "Unable to store profile", ok: false },
      { status: 500 },
    );
  }
}
