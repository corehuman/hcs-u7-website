import { NextResponse } from "next/server";

import type { HCSProfile } from "@/lib/hcs-generator";
import { generateChatGPTPrompt, generateClaudePrompt } from "@/lib/prompt-generator";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { profile: HCSProfile | null };
    if (!body?.profile) {
      return NextResponse.json(
        { error: "Missing `profile` in request body" },
        { status: 400 },
      );
    }

    const chatgptPrompt = generateChatGPTPrompt(body.profile);
    const claudePrompt = generateClaudePrompt(body.profile);

    return NextResponse.json({ chatgptPrompt, claudePrompt });
  } catch (_error) {
    return NextResponse.json(
      { error: "Unable to generate prompts" },
      { status: 500 },
    );
  }
}
