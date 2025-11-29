import { decodeVocalMetrics } from "./vocal-metrics";
import type { VocalMetrics } from "./vocal-metrics";

export interface HCSProfile {
  version: string;
  algorithm: string;
  element: string;
  modalities: {
    cardinal: number;
    fixed: number;
    mutable: number;
  };
  cognition: {
    fluid: number;
    crystallized: number;
    verbal: number;
    strategic: number;
    creative: number;
  };
  interaction: {
    pace: string;
    structure: string;
    tone: string;
  };
  signatures: {
    QSIG: string;
    B3: string;
  };
  vocal?: (Partial<VocalMetrics> & { code: string }) | null;
  raw: string;
}

export function parseHCS(code: string): HCSProfile | null {
  try {
    // Clean input
    const cleaned = code.trim();
    
    // Validate format
    if (!cleaned.startsWith('HCS-U7|')) {
      throw new Error('Invalid HCS-U7 code format');
    }

    // Split by pipe
    const parts = cleaned.split('|');
    
    // Extract version
    const versionPart = parts.find(p => p.startsWith('V:'));
    const version = versionPart ? versionPart.split(':')[1] : '';

    // Extract algorithm
    const algPart = parts.find(p => p.startsWith('ALG:'));
    const algorithm = algPart ? algPart.split(':')[1] : '';

    // Extract element
    const elementPart = parts.find(p => p.startsWith('E:'));
    const element = elementPart ? elementPart.split(':')[1] : '';

    // Extract modalities (MOD:c50f0m50)
    const modPart = parts.find(p => p.startsWith('MOD:'));
    let modalities = { cardinal: 0, fixed: 0, mutable: 0 };
    if (modPart) {
      const modStr = modPart.split(':')[1];
      const cMatch = modStr.match(/c(\d+)/);
      const fMatch = modStr.match(/f(\d+)/);
      const mMatch = modStr.match(/m(\d+)/);
      
      modalities = {
        cardinal: cMatch ? parseInt(cMatch[1]) : 0,
        fixed: fMatch ? parseInt(fMatch[1]) : 0,
        mutable: mMatch ? parseInt(mMatch[1]) : 0
      };
    }

    // Extract cognition (COG:F34C42V0S17Cr8)
    const cogPart = parts.find(p => p.startsWith('COG:'));
    let cognition = { fluid: 0, crystallized: 0, verbal: 0, strategic: 0, creative: 0 };
    if (cogPart) {
      const cogStr = cogPart.split(':')[1];
      const fMatch = cogStr.match(/F(\d+)/);
      const cMatch = cogStr.match(/C(\d+)/);
      const vMatch = cogStr.match(/V(\d+)/);
      const sMatch = cogStr.match(/S(\d+)/);
      const crMatch = cogStr.match(/Cr(\d+)/);
      
      cognition = {
        fluid: fMatch ? parseInt(fMatch[1]) : 0,
        crystallized: cMatch ? parseInt(cMatch[1]) : 0,
        verbal: vMatch ? parseInt(vMatch[1]) : 0,
        strategic: sMatch ? parseInt(sMatch[1]) : 0,
        creative: crMatch ? parseInt(crMatch[1]) : 0
      };
    }

    // Extract interaction (INT:PB=F,SM=H,TN=L)
    const intPart = parts.find(p => p.startsWith('INT:'));
    let interaction = { pace: '', structure: '', tone: '' };
    if (intPart) {
      const intStr = intPart.split(':')[1];
      const pbMatch = intStr.match(/PB=([A-Z])/);
      const smMatch = intStr.match(/SM=([A-Z])/);
      const tnMatch = intStr.match(/TN=([A-Z])/);
      
      interaction = {
        pace: pbMatch ? pbMatch[1] : '',
        structure: smMatch ? smMatch[1] : '',
        tone: tnMatch ? tnMatch[1] : ''
      };
    }

    // Extract signatures
    const qsigPart = parts.find(p => p.startsWith('QSIG:'));
    const b3Part = parts.find(p => p.startsWith('B3:'));
    
    const signatures = {
      QSIG: qsigPart ? qsigPart.split(':')[1] : '',
      B3: b3Part ? b3Part.split(':')[1] : ''
    };

    const vocalPart = parts.find((p) => p.startsWith('VOC:'));
    const decodedVocal = vocalPart ? decodeVocalMetrics(vocalPart) : null;
    const vocal = decodedVocal
      ? { code: vocalPart as string, ...decodedVocal }
      : null;

    return {
      version,
      algorithm,
      element,
      modalities,
      cognition,
      interaction,
      signatures,
      vocal,
      raw: cleaned
    };

  } catch (error) {
    console.error('Error parsing HCS code:', error);
    return null;
  }
}

export function compareProfiles(profile1: HCSProfile, profile2: HCSProfile): ComparisonResult {
  // Calculate similarity across all dimensions
  
  // 1. Element similarity (exact match or related)
  const elementSimilarity = calculateElementSimilarity(profile1.element, profile2.element);

  // 2. Modalities similarity (normalized distance)
  const modalitiesSimilarity = calculateModalitiesSimilarity(
    profile1.modalities, 
    profile2.modalities
  );

  // 3. Cognition similarity (weighted cosine similarity)
  const cognitionSimilarity = calculateCognitionSimilarity(
    profile1.cognition, 
    profile2.cognition
  );

  // 4. Interaction similarity
  const interactionSimilarity = calculateInteractionSimilarity(
    profile1.interaction, 
    profile2.interaction
  );

  // 5. Cryptographic signature match (exact)
  const signatureMatch = profile1.signatures.B3 === profile2.signatures.B3;

  // Weighted overall similarity
  const overallSimilarity = (
    elementSimilarity * 0.15 +
    modalitiesSimilarity * 0.20 +
    cognitionSimilarity * 0.45 +
    interactionSimilarity * 0.20
  );

  return {
    overallSimilarity,
    match: overallSimilarity >= 0.75, // Seuil vérification identité : 75%
    dimensions: {
      element: elementSimilarity,
      modalities: modalitiesSimilarity,
      cognition: cognitionSimilarity,
      interaction: interactionSimilarity
    },
    signatureMatch,
    details: {
      elementComparison: compareElements(profile1.element, profile2.element),
      modalitiesComparison: compareModalities(profile1.modalities, profile2.modalities),
      cognitionComparison: compareCognition(profile1.cognition, profile2.cognition),
      interactionComparison: compareInteraction(profile1.interaction, profile2.interaction)
    }
  };
}

// Helper functions
function calculateElementSimilarity(e1: string, e2: string): number {
  if (e1 === e2) return 1.0;
  
  // Element relationships (some are more similar than others)
  const relationships: Record<string, string[]> = {
    'F': ['A'],  // Fire-Air (both yang)
    'A': ['F'],
    'W': ['E'],  // Water-Earth (both yin)
    'E': ['W']
  };
  
  if (relationships[e1]?.includes(e2)) return 0.5;
  return 0.0;
}

function calculateModalitiesSimilarity(m1: any, m2: any): number {
  // Euclidean distance normalized to 0-1
  const maxDistance = Math.sqrt(3 * 100 * 100); // Max possible distance
  
  const distance = Math.sqrt(
    Math.pow(m1.cardinal - m2.cardinal, 2) +
    Math.pow(m1.fixed - m2.fixed, 2) +
    Math.pow(m1.mutable - m2.mutable, 2)
  );
  
  return 1 - (distance / maxDistance);
}

function calculateCognitionSimilarity(c1: any, c2: any): number {
  // Cosine similarity with normalized vectors
  const vec1 = [c1.fluid, c1.crystallized, c1.verbal, c1.strategic, c1.creative];
  const vec2 = [c2.fluid, c2.crystallized, c2.verbal, c2.strategic, c2.creative];
  
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const mag1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const mag2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
  
  if (mag1 === 0 || mag2 === 0) return 0;
  
  return dotProduct / (mag1 * mag2);
}

function calculateInteractionSimilarity(i1: any, i2: any): number {
  let matches = 0;
  if (i1.pace === i2.pace) matches++;
  if (i1.structure === i2.structure) matches++;
  if (i1.tone === i2.tone) matches++;
  return matches / 3;
}

function compareElements(e1: string, e2: string): any {
  return {
    profile1: e1,
    profile2: e2,
    match: e1 === e2,
    similarity: calculateElementSimilarity(e1, e2),
    interpretation: e1 === e2 
      ? 'Identical cognitive style' 
      : `Different styles: ${e1} vs ${e2}` 
  };
}

function compareModalities(m1: any, m2: any): any {
  return {
    profile1: m1,
    profile2: m2,
    differences: {
      cardinal: Math.abs(m1.cardinal - m2.cardinal),
      fixed: Math.abs(m1.fixed - m2.fixed),
      mutable: Math.abs(m1.mutable - m2.mutable)
    },
    interpretation: getModalitiesInterpretation(m1, m2)
  };
}

function compareCognition(c1: any, c2: any): any {
  return {
    profile1: c1,
    profile2: c2,
    differences: {
      fluid: Math.abs(c1.fluid - c2.fluid),
      crystallized: Math.abs(c1.crystallized - c2.crystallized),
      verbal: Math.abs(c1.verbal - c2.verbal),
      strategic: Math.abs(c1.strategic - c2.strategic),
      creative: Math.abs(c1.creative - c2.creative)
    },
    largestDifference: getLargestDifference(c1, c2)
  };
}

function compareInteraction(i1: any, i2: any): any {
  return {
    profile1: i1,
    profile2: i2,
    matches: {
      pace: i1.pace === i2.pace,
      structure: i1.structure === i2.structure,
      tone: i1.tone === i2.tone
    }
  };
}

function getModalitiesInterpretation(m1: any, m2: any): string {
  const totalDiff = Math.abs(m1.cardinal - m2.cardinal) + 
                    Math.abs(m1.fixed - m2.fixed) + 
                    Math.abs(m1.mutable - m2.mutable);
  
  if (totalDiff < 30) return 'Very similar behavioral patterns';
  if (totalDiff < 60) return 'Moderately similar patterns';
  return 'Distinctly different patterns';
}

function getLargestDifference(c1: any, c2: any): { dimension: string; diff: number } {
  const diffs = [
    { dimension: 'Fluid', diff: Math.abs(c1.fluid - c2.fluid) },
    { dimension: 'Crystallized', diff: Math.abs(c1.crystallized - c2.crystallized) },
    { dimension: 'Verbal', diff: Math.abs(c1.verbal - c2.verbal) },
    { dimension: 'Strategic', diff: Math.abs(c1.strategic - c2.strategic) },
    { dimension: 'Creative', diff: Math.abs(c1.creative - c2.creative) }
  ];
  
  return diffs.reduce((max, curr) => curr.diff > max.diff ? curr : max);
}

export interface ComparisonResult {
  overallSimilarity: number;
  match: boolean;
  dimensions: {
    element: number;
    modalities: number;
    cognition: number;
    interaction: number;
  };
  signatureMatch: boolean;
  details: any;
}
