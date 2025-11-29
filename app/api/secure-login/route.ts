import { NextResponse } from "next/server";

interface SecureLoginRequest {
  username?: string;
  password?: string;
}

export async function POST(request: Request) {
  const verified = request.headers.get("x-hcs-verified") === "true";
  const confidence = request.headers.get("x-hcs-confidence");

  if (!verified) {
    return NextResponse.json(
      {
        error: "HCS-U7 verification required",
        code: "hcs_verification_required",
      },
      { status: 403 },
    );
  }

  let body: SecureLoginRequest;
  try {
    body = (await request.json()) as SecureLoginRequest;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  if (!body.username) {
    return NextResponse.json(
      { error: "Missing username", code: "missing_username" },
      { status: 400 },
    );
  }

  // Demo only: in a real app, you would verify the password and session here.
  return NextResponse.json({
    status: "ok",
    message: "Secure login allowed by HCS-U7",
    user: {
      username: body.username,
    },
    hcs: {
      verified,
      confidence,
    },
  });
}
