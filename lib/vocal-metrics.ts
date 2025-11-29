/**
 * VOCAL METRICS - Test RAN (Rapid Automatized Naming)
 * 
 * Mesure les patterns vocaux humains impossibles à simuler par bots:
 * - Variance timing inter-items (humains: 50-150ms, bots: <20ms)
 * - Hésitations naturelles (humains: 2-5%, bots: 0%)
 * - Effet fatigue (humains: +20-50ms, bots: 0ms)
 * - Pauses respiratoires (humains: présentes, bots: absentes)
 */

export interface VocalMetrics {
  // Métadonnées test
  test: 'ran';
  totalItems: number;             // Toujours 20
  correctItems: number;           // 0-20 (nombre correct)
  
  // Timings (ms)
  meanInterItemPause: number;     // Moyenne temps entre items
  varianceInterItemPause: number; // Écart-type (SD)
  
  // Patterns humains
  hesitationRate: number;         // 0-1 (proportion "euh", "hmm")
  fatigueEffect: number;          // ms (ralentissement fin vs début)
  breathingPauses: number;        // Nombre pauses >500ms
  prosodyScore: number;           // 0-100 (naturalité intonation)
  
  // Détection bot
  isLikelyBot: boolean;
  confidence: number;             // 0-1
  flags: string[];                // ['low-variance', 'no-hesitation', etc.]
}

/**
 * Analyse patterns pour détecter bots
 */
export function analyzeVocalPatterns(
  timings: number[],
  hesitations: number,
  totalItems: number
): Pick<VocalMetrics, 'isLikelyBot' | 'confidence' | 'flags' | 'fatigueEffect' | 'prosodyScore'> {
  
  const flags: string[] = [];
  let botScore = 0;
  
  // Calcul variance
  const mean = timings.reduce((a, b) => a + b, 0) / timings.length;
  const variance = Math.sqrt(
    timings.map(t => Math.pow(t - mean, 2)).reduce((a, b) => a + b, 0) / timings.length
  );
  
  // Signal 1: Variance trop faible (bot)
  if (variance < 30) {
    flags.push('low-variance');
    botScore += 0.4;
  }
  
  // Signal 2: Zéro hésitation (bot)
  const hesitationRate = hesitations / totalItems;
  if (hesitationRate < 0.01) {
    flags.push('no-hesitation');
    botScore += 0.3;
  }
  
  // Signal 3: Pas de fatigue (bot)
  const firstThird = timings.slice(0, Math.floor(timings.length / 3));
  const lastThird = timings.slice(-Math.floor(timings.length / 3));
  const fatigueEffect = 
    (lastThird.reduce((a, b) => a + b, 0) / lastThird.length) -
    (firstThird.reduce((a, b) => a + b, 0) / firstThird.length);
  
  if (Math.abs(fatigueEffect) < 10) {
    flags.push('no-fatigue');
    botScore += 0.2;
  }
  
  // Signal 4: Timings trop réguliers (multiples de 10ms = suspect)
  const regularTimings = timings.filter(t => t % 10 === 0).length;
  if (regularTimings / timings.length > 0.8) {
    flags.push('machine-timings');
    botScore += 0.1;
  }
  
  // Score prosody (variance = naturalité)
  const prosodyScore = Math.min(100, variance * 1.5);
  
  return {
    isLikelyBot: botScore >= 0.6,
    confidence: botScore >= 0.6 ? botScore : (1 - botScore),
    flags,
    fatigueEffect,
    prosodyScore
  };
}

/**
 * Encode vocal metrics en format compact pour code HCS
 * Format: VOC:R{correct}v{variance}h{hesitation}f{fatigue}
 * Exemple: VOC:R18v72h2f22
 */
export function encodeVocalMetrics(vocal: VocalMetrics): string {
  const R = vocal.correctItems.toString().padStart(2, '0');
  const v = Math.round(vocal.varianceInterItemPause).toString().padStart(2, '0');
  const h = Math.round(vocal.hesitationRate * 100).toString();
  const f = Math.round(vocal.fatigueEffect).toString().padStart(2, '0');
  
  return `VOC:R${R}v${v}h${h}f${f}`;
}

/**
 * Decode vocal metrics depuis code HCS
 */
export function decodeVocalMetrics(vocalCode: string): Partial<VocalMetrics> | null {
  // Format attendu: VOC:R18v72h2f22
  const match = vocalCode.match(/VOC:R(\d+)v(\d+)h(\d+)f(-?\d+)/);
  
  if (!match) return null;
  
  const [, correctItems, variance, hesitation, fatigue] = match;
  
  return {
    test: 'ran',
    totalItems: 20,
    correctItems: parseInt(correctItems),
    varianceInterItemPause: parseInt(variance),
    hesitationRate: parseInt(hesitation) / 100,
    fatigueEffect: parseInt(fatigue),
    prosodyScore: parseInt(variance) * 1.5,
    isLikelyBot: parseInt(variance) < 30,
    confidence: parseInt(variance) > 50 ? 0.9 : 0.5,
    flags: [],
    meanInterItemPause: 0,
    breathingPauses: 0
  };
}
