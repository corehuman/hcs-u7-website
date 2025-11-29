import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const verified = request.headers.get("x-hcs-verified") === "true";
  const confidence = request.headers.get("x-hcs-confidence");

  if (!verified) {
    return NextResponse.json(
      { error: "Request was not verified by HCS-U7 middleware" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "Access granted to protected resource",
    hcs: {
      verified,
      confidence,
    },
  });
}
