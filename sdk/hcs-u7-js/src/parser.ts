import type { HCSProfile, ModalDistribution, CognitionScores, InteractionSettings } from "./types";

export class HCSCodeParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HCSCodeParseError";
  }
}

function parseSegments(code: string): Record<string, string> {
  const parts = code.split("|");
  if (parts.length < 2 || !parts[0].startsWith("HCS-U7")) {
    throw new HCSCodeParseError("Invalid HCS-U7 header");
  }

  const segments: Record<string, string> = {};
  for (const part of parts.slice(1)) {
    const idx = part.indexOf(":");
    if (idx === -1) continue;
    const key = part.slice(0, idx);
    const value = part.slice(idx + 1);
    segments[key] = value;
  }

  return segments;
}

function parseModal(value: string | undefined): ModalDistribution {
  const modal: ModalDistribution = { c: 0, f: 0, m: 0 };
  if (!value) return modal;

  const regex = /([cfm])(\d+)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(value)) !== null) {
    const [, key, num] = match;
    const n = parseInt(num, 10);
    if (key === "c") modal.c = n;
    if (key === "f") modal.f = n;
    if (key === "m") modal.m = n;
  }

  return modal;
}

function parseCognition(value: string | undefined): CognitionScores {
  const scores: CognitionScores = {
    form: 0,
    logic: 0,
    visual: 0,
    synthesis: 0,
    creative: 0,
  };

  if (!value) return scores;

  const regex = /([A-Z][a-z]?)(\d+)/g;
  const map: Record<string, keyof CognitionScores> = {
    F: "form",
    C: "logic",
    V: "visual",
    S: "synthesis",
    Cr: "creative",
  };

  let match: RegExpExecArray | null;
  while ((match = regex.exec(value)) !== null) {
    const [, code, num] = match;
    const n = parseInt(num, 10);
    const key = map[code];
    if (key) {
      scores[key] = n;
    }
  }

  return scores;
}

function parseInteraction(value: string | undefined): InteractionSettings {
  const interaction: InteractionSettings = {};
  if (!value) return interaction;

  for (const part of value.split(",")) {
    const [rawKey, rawVal] = part.split("=", 2);
    if (!rawKey || !rawVal) continue;
    interaction[rawKey.trim()] = rawVal.trim();
  }

  return interaction;
}

export function parseHCSCode(raw: string): HCSProfile {
  const code = raw.trim();
  if (!code) {
    throw new HCSCodeParseError("Empty HCS-U7 code");
  }

  const segments = parseSegments(code);

  const version = segments["V"] ?? "7.0";
  const algorithm = segments["ALG"] ?? "QS";
  const element = segments["E"] ?? "E";
  const modal = parseModal(segments["MOD"]);
  const cognition = parseCognition(segments["COG"]);
  const interaction = parseInteraction(segments["INT"]);
  const qsig = segments["QSIG"];
  const b3 = segments["B3"];

  return {
    rawCode: code,
    version,
    algorithm,
    element,
    modal,
    cognition,
    interaction,
    qsig,
    b3,
  };
}
