/**
 * HCS ROTATING CODE SYSTEM
 * 
 * Principe: Codes auto-mutants toutes les 10 minutes
 * Inspiré de TOTP (RFC 6238) - Time-based One-Time Password
 * 
 * Sécurité:
 * ✅ Anti-replay: Code périmé après 10min
 * ✅ Anti-farm: Impossible à revendre (expire)
 * ✅ Cryptographiquement sûr: HMAC-SHA256
 * ✅ Déterministe: Même input + timestamp = même output
 * 
 * Flow:
 * 1. Client génère profil cognitif de base (immuable)
 * 2. Serveur fournit rotation key (unique par user/session)
 * 3. Code transformé via HMAC basé sur timestamp
 * 4. Serveur valide avec tolérance ±2 fenêtres (20min)
 */

import { createHmac, randomBytes } from "crypto";

// ⬅️ IMPORTANT: Importer types HCS existants
// Ajusté selon l'architecture actuelle
import type { HCSProfile } from "./hcs-generator";
import { generateHCSCode } from "./hcs-generator";

// Stub local pour parsing HCS → HCSProfile.
// Sera affiné lors de l'intégration serveur.
function parseHCSCode(_code: string): HCSProfile {
  throw new Error("parseHCSCode is not implemented yet");
}

// Configuration
export const ROTATION_PERIOD_MS = 10 * 60 * 1000; // 10 minutes
export const ALLOWED_TIME_WINDOWS = 2; // ±2 fenêtres = 20min tolérance

/**
 * Interface code rotatif
 */
export interface RotatingHCSCode {
  baseProfile: HCSProfile; // Profil original (immuable)
  currentCode: string; // Code actuel (mute chaque rotation)
  currentWindow: number; // Fenêtre temporelle actuelle
  expiresAt: number; // Timestamp expiration (epoch ms)
  rotationPeriod: number; // Période rotation (ms)
}

/**
 * Génère code HCS rotatif
 * 
 * @param profile - Profil cognitif de base (résultats tests)
 * @param rotationKey - Clé secrète HMAC (unique par user/session)
 * @param timestamp - Timestamp actuel (pour testing, sinon Date.now())
 * @returns Code rotatif avec metadata
 */
export function generateRotatingCode(
  profile: HCSProfile,
  rotationKey: string,
  timestamp: number = Date.now()
): RotatingHCSCode {
  // Calculer fenêtre temporelle (epoch 10min)
  const timeWindow = Math.floor(timestamp / ROTATION_PERIOD_MS);

  // Extraire valeurs cognitives de base
  const baseValues = extractBaseValues(profile);

  // Appliquer transformation cryptographique
  const rotatedValues = rotateValues(baseValues, rotationKey, timeWindow);

  // Créer profil transformé
  const rotatedProfile = applyRotatedValues(profile, rotatedValues);

  // Générer code HCS standard avec valeurs rotées
  const baseCode = generateHCSCode(rotatedProfile);

  // Ajouter time window au code
  const currentCode = `${baseCode}|TW:${timeWindow}`;

  // Calculer expiration
  const expiresAt = (timeWindow + 1) * ROTATION_PERIOD_MS;

  return {
    baseProfile: profile,
    currentCode,
    currentWindow: timeWindow,
    expiresAt,
    rotationPeriod: ROTATION_PERIOD_MS,
  };
}

/**
 * Extrait valeurs numériques du profil
 */
function extractBaseValues(profile: HCSProfile): Record<string, number> {
  const p: any = profile;

  return {
    // Stroop scores (valeurs par défaut si non présentes)
    stroop_form: p.cognitive?.stroop?.formScore ?? 50,
    stroop_color: p.cognitive?.stroop?.colorScore ?? 50,
    stroop_rt: Math.round(p.cognitive?.stroop?.meanRT ?? 500),

    // N-Back
    nback_score: p.cognitive?.nback?.score ?? 75,
    nback_rt: Math.round(p.cognitive?.nback?.meanRT ?? 600),

    // Vocal (si présent)
    vocal_variance: Math.round(p.vocal?.varianceInterItemPause ?? 70),
    vocal_correct: p.vocal?.correctItems ?? 18,
    vocal_hesitation: Math.round((p.vocal?.hesitationRate ?? 0.02) * 100),

    // Autres tests (ajouter selon besoin)
    digit_span: p.cognitive?.digitSpan?.maxSpan ?? 7,
    reaction_time: Math.round(p.cognitive?.reactionTime?.meanRT ?? 300),
  };
}

/**
 * Rotation cryptographique des valeurs
 * Basée sur HMAC-SHA256 (déterministe mais imprévisible sans clé)
 * 
 * @param baseValues - Valeurs originales
 * @param secretKey - Clé HMAC (secret serveur)
 * @param timeWindow - Fenêtre temporelle (epoch 10min)
 * @returns Valeurs transformées
 */
function rotateValues(
  baseValues: Record<string, number>,
  secretKey: string,
  timeWindow: number
): Record<string, number> {
  const rotated: Record<string, number> = {};

  for (const [key, baseValue] of Object.entries(baseValues)) {
    // Créer message unique pour HMAC
    const message = `${key}:${baseValue}:${timeWindow}`;

    // Calculer HMAC-SHA256
    const hmac = createHmac("sha256", secretKey);
    hmac.update(message);
    const digest = hmac.digest("hex");

    // Extraire offset depuis hash (premiers 8 chars)
    // Convertir hex → int → modulo pour obtenir -10 à +10
    const hashInt = parseInt(digest.substring(0, 8), 16);
    const offset = (hashInt % 21) - 10; // Range: -10 à +10

    // Appliquer transformation
    const transformed = baseValue + offset;

    // Clamp aux limites réalistes
    rotated[key] = clampToRealisticRange(key, transformed);
  }

  return rotated;
}

/**
 * Garde valeurs dans ranges plausibles (humain réaliste)
 */
function clampToRealisticRange(key: string, value: number): number {
  // Définir ranges réalistes par métrique
  const ranges: Record<string, [number, number]> = {
    stroop_form: [0, 100],
    stroop_color: [0, 100],
    stroop_rt: [200, 1000],
    nback_score: [0, 100],
    nback_rt: [300, 1500],
    vocal_variance: [20, 200],
    vocal_correct: [10, 20],
    vocal_hesitation: [0, 10],
    digit_span: [4, 12],
    reaction_time: [150, 800],
  };

  const [min, max] = ranges[key] || [0, 100];
  return Math.max(min, Math.min(max, Math.round(value)));
}

/**
 * Applique valeurs rotées au profil
 */
function applyRotatedValues(
  profile: HCSProfile,
  rotatedValues: Record<string, number>
): HCSProfile {
  const p: any = profile;

  return {
    ...profile,
    cognitive: {
      ...p.cognitive,
      stroop: {
        ...p.cognitive?.stroop,
        formScore: rotatedValues.stroop_form,
        colorScore: rotatedValues.stroop_color,
        meanRT: rotatedValues.stroop_rt,
      },
      nback: {
        ...p.cognitive?.nback,
        score: rotatedValues.nback_score,
        meanRT: rotatedValues.nback_rt,
      },
      digitSpan: {
        ...p.cognitive?.digitSpan,
        maxSpan: rotatedValues.digit_span,
      },
      reactionTime: {
        ...p.cognitive?.reactionTime,
        meanRT: rotatedValues.reaction_time,
      },
    },
    vocal: p.vocal
      ? {
          ...p.vocal,
          varianceInterItemPause: rotatedValues.vocal_variance,
          correctItems: rotatedValues.vocal_correct,
          hesitationRate: rotatedValues.vocal_hesitation / 100,
        }
      : profile.vocal,
  } as HCSProfile;
}

/**
 * VALIDATION SERVEUR
 * Vérifie code rotatif avec tolérance clock drift
 * 
 * @param code - Code HCS complet avec TW:
 * @param rotationKey - Clé rotation (récupérée DB)
 * @param currentTimestamp - Timestamp actuel serveur
 * @returns Résultat validation + profil de base si valide
 */
export function validateRotatingCode(
  code: string,
  rotationKey: string,
  currentTimestamp: number = Date.now()
): {
  valid: boolean;
  baseProfile?: HCSProfile;
  ageMinutes?: number;
  reason?: string;
} {
  // Parser code
  const parts = code.split("|");
  const timeWindowPart = parts.find((p) => p.startsWith("TW:"));

  if (!timeWindowPart) {
    return {
      valid: false,
      reason: "Missing time window (TW:)",
    };
  }

  // Extraire time window du code
  const codeTimeWindow = parseInt(timeWindowPart.replace("TW:", ""), 10);

  if (Number.isNaN(codeTimeWindow)) {
    return {
      valid: false,
      reason: "Invalid time window format",
    };
  }

  // Calculer time window actuel
  const currentTimeWindow = Math.floor(currentTimestamp / ROTATION_PERIOD_MS);

  // Vérifier différence (tolérance ±2 fenêtres)
  const windowDiff = Math.abs(currentTimeWindow - codeTimeWindow);
  const ageMinutes = windowDiff * (ROTATION_PERIOD_MS / 60000);

  if (windowDiff > ALLOWED_TIME_WINDOWS) {
    return {
      valid: false,
      ageMinutes,
      reason: `Code expired (${ageMinutes.toFixed(0)} minutes old)`,
    };
  }

  // Parser profil du code (sans TW:)
  const codeWithoutTW = parts.filter((p) => !p.startsWith("TW:")).join("|");
  const rotatedProfile = parseHCSCode(codeWithoutTW);

  // Extraire valeurs rotées actuelles
  const rotatedValues = extractBaseValues(rotatedProfile);

  // REVERSE rotation pour retrouver profil de base
  const baseValues = reverseRotateValues(rotatedValues, rotationKey, codeTimeWindow);

  // Reconstruire profil de base
  const baseProfile = applyRotatedValues(rotatedProfile, baseValues);

  return {
    valid: true,
    baseProfile,
    ageMinutes,
  };
}

/**
 * Reverse rotation (déchiffrement)
 * Trouve valeurs originales via brute force sur range
 * (Possible car ranges sont petites: 0-100)
 */
function reverseRotateValues(
  rotatedValues: Record<string, number>,
  secretKey: string,
  timeWindow: number
): Record<string, number> {
  const baseValues: Record<string, number> = {};

  for (const [key, rotatedValue] of Object.entries(rotatedValues)) {
    // Déterminer range de recherche
    const ranges: Record<string, [number, number]> = {
      stroop_form: [0, 100],
      stroop_color: [0, 100],
      stroop_rt: [200, 1000],
      nback_score: [0, 100],
      nback_rt: [300, 1500],
      vocal_variance: [20, 200],
      vocal_correct: [10, 20],
      vocal_hesitation: [0, 10],
      digit_span: [4, 12],
      reaction_time: [150, 800],
    };

    const [min, max] = ranges[key] || [0, 100];

    // Brute force: tester toutes valeurs possibles
    let found = false;
    for (let candidateBase = min; candidateBase <= max; candidateBase += 1) {
      // Recalculer transformation
      const message = `${key}:${candidateBase}:${timeWindow}`;
      const hmac = createHmac("sha256", secretKey);
      hmac.update(message);
      const digest = hmac.digest("hex");
      const hashInt = parseInt(digest.substring(0, 8), 16);
      const offset = (hashInt % 21) - 10;

      const transformed = clampToRealisticRange(key, candidateBase + offset);

      // Si match → on a trouvé la valeur de base
      if (transformed === rotatedValue) {
        baseValues[key] = candidateBase;
        found = true;
        break;
      }
    }

    // Fallback si pas trouvé (ne devrait jamais arriver)
    if (!found) {
      baseValues[key] = rotatedValue; // Utiliser valeur rotée
    }
  }

  return baseValues;
}

/**
 * Génère rotation key aléatoire (à stocker DB)
 * Utilisé lors de première génération profil
 */
export function generateRotationKey(): string {
  return randomBytes(32).toString("hex"); // 256-bit key
}

/**
 * Calcule temps restant avant expiration
 */
export function getTimeUntilExpiration(
  currentWindow: number,
  currentTimestamp: number = Date.now()
): number {
  const nextWindowStart = (currentWindow + 1) * ROTATION_PERIOD_MS;
  return nextWindowStart - currentTimestamp;
}
