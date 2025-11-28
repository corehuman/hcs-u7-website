'use client';

import { useState } from 'react';
import { CaptchaIntro } from './CaptchaIntro';
import { CaptchaWidget } from './CaptchaWidget';
import { CaptchaResult } from './CaptchaResult';

type Phase = 'intro' | 'testing' | 'result';

export interface CaptchaAnalysis {
  isHuman: boolean;
  confidence: number;
  metrics: {
    rtVariability: number;
    stroopEffect: number;
    learningSlope: number;
    errorPattern: string;
  };
  flags: string[];
  rawData: any;
}

export function CaptchaDemoContainer() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [analysis, setAnalysis] = useState<CaptchaAnalysis | null>(null);

  const handleStart = () => {
    setPhase('testing');
  };

  const handleComplete = (results: any) => {
    const analysisResult = analyzeCaptcha(results);
    setAnalysis(analysisResult);
    setPhase('result');
  };

  const handleReset = () => {
    setAnalysis(null);
    setPhase('intro');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {phase === 'intro' && (
          <CaptchaIntro onStart={handleStart} />
        )}

        {phase === 'testing' && (
          <CaptchaWidget onComplete={handleComplete} />
        )}

        {phase === 'result' && analysis && (
          <CaptchaResult analysis={analysis} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}

// Bot Detection Algorithm
function analyzeCaptcha(results: any): CaptchaAnalysis {
  const { trials, totalTime } = results;

  // Extract metrics
  const reactionTimes = trials.map((t: any) => t.responseTime);
  const avgRT = reactionTimes.reduce((sum: number, rt: number) => sum + rt, 0) / reactionTimes.length;
  
  // RT Variability (critical metric)
  const variance = reactionTimes.reduce((sum: number, rt: number) => 
    sum + Math.pow(rt - avgRT, 2), 0) / reactionTimes.length;
  const rtVariability = Math.sqrt(variance);

  // Stroop Effect
  const congruent = trials.filter((t: any) => t.congruent);
  const incongruent = trials.filter((t: any) => !t.congruent);
  const avgCongruent = congruent.reduce((sum: number, t: any) => sum + t.responseTime, 0) / congruent.length;
  const avgIncongruent = incongruent.reduce((sum: number, t: any) => sum + t.responseTime, 0) / incongruent.length;
  const stroopEffect = avgIncongruent - avgCongruent;

  // Learning Curve
  const firstHalf = trials.slice(0, 5);
  const secondHalf = trials.slice(5);
  const avgFirstHalf = firstHalf.reduce((sum: number, t: any) => sum + t.responseTime, 0) / firstHalf.length;
  const avgSecondHalf = secondHalf.reduce((sum: number, t: any) => sum + t.responseTime, 0) / secondHalf.length;
  const learningSlope = avgFirstHalf - avgSecondHalf; // Positive = improvement

  // Error Pattern Analysis
  const errors = trials.map((t: any, idx: number) => ({ idx, correct: t.correct }));
  const errorIndices = errors.filter((e: any) => !e.correct).map((e: any) => e.idx);
  const errorPattern = analyzeErrorPattern(errorIndices);

  // Bot Detection Logic
  const flags: string[] = [];
  let isHuman = true;
  let confidence = 1.0;

  // Flag 1: RT Variability too low (bot)
  if (rtVariability < 40) {
    flags.push('RT_VARIABILITY_TOO_LOW');
    isHuman = false;
    confidence -= 0.4;
  }

  // Flag 2: RT Variability too high (random bot)
  if (rtVariability > 150) {
    flags.push('RT_VARIABILITY_TOO_HIGH');
    isHuman = false;
    confidence -= 0.3;
  }

  // Flag 3: No Stroop effect (bot)
  if (Math.abs(stroopEffect) < 20) {
    flags.push('NO_STROOP_EFFECT');
    isHuman = false;
    confidence -= 0.3;
  }

  // Flag 4: Excessive Stroop effect (fake)
  if (stroopEffect > 250) {
    flags.push('EXCESSIVE_STROOP_EFFECT');
    confidence -= 0.2;
  }

  // Flag 5: No learning (bot)
  if (Math.abs(learningSlope) < 5) {
    flags.push('NO_LEARNING_CURVE');
    confidence -= 0.2;
  }

  // Flag 6: Perfect accuracy (suspicious)
  const accuracy = trials.filter((t: any) => t.correct).length / trials.length;
  if (accuracy === 1.0) {
    flags.push('PERFECT_ACCURACY');
    confidence -= 0.15;
  }

  // Flag 7: Error pattern non-human
  if (errorPattern === 'random' || errorPattern === 'none') {
    flags.push('NON_HUMAN_ERROR_PATTERN');
    confidence -= 0.15;
  }

  // Overall decision
  if (flags.length >= 3) {
    isHuman = false;
  }

  // Clamp confidence
  confidence = Math.max(0, Math.min(1, confidence));

  return {
    isHuman,
    confidence,
    metrics: {
      rtVariability,
      stroopEffect,
      learningSlope,
      errorPattern
    },
    flags,
    rawData: {
      avgRT,
      accuracy,
      totalTime,
      trials: trials.length
    }
  };
}

function analyzeErrorPattern(errorIndices: number[]): string {
  if (errorIndices.length === 0) return 'none';
  if (errorIndices.length === 1) return 'single';
  
  // Check if errors are clustered (fatigue pattern - human)
  const gaps = [];
  for (let i = 1; i < errorIndices.length; i++) {
    gaps.push(errorIndices[i] - errorIndices[i - 1]);
  }
  const avgGap = gaps.reduce((sum, g) => sum + g, 0) / gaps.length;
  
  if (avgGap < 2) return 'clustered'; // Human fatigue
  if (avgGap > 5) return 'distributed'; // Human occasional errors
  return 'random'; // Bot-like
}
