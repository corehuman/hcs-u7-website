import { NextRequest, NextResponse } from "next/server";
import { evaluateToken } from "@/lib/hcs-verify";

export async function middleware(request: NextRequest) {
  const token = request.headers.get("x-hcs-token");
  const apiKey = request.headers.get("x-hcs-api-key") || process.env.HCS_U7_API_KEY;

  if (!token) {
    return NextResponse.json(
      { error: "Missing x-hcs-token header for human verification" },
      { status: 401 },
    );
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing HCS-U7 API key", code: "missing_api_key" },
      { status: 401 },
    );
  }

  const { isHuman, confidence, reason } = evaluateToken(token);

  if (!isHuman || confidence < 0.9) {
    return NextResponse.json(
      {
        error: "Access blocked by HCS-U7 cognitive firewall",
        details: { isHuman, confidence, reason },
      },
      { status: 403 },
    );
  }

  const headers = new Headers(request.headers);
  headers.set("x-hcs-verified", "true");
  headers.set("x-hcs-confidence", confidence.toString());

  return NextResponse.next({
    request: {
      headers,
    },
  });
}

export const config = {
  matcher: ["/api/protected-demo/:path*", "/api/secure-login/:path*"],
};
