"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Brain, Info } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import type { StroopQuickResult } from "@/lib/quick-auth";

const COLORS = ["red", "blue", "green", "yellow"] as const;
const WORDS = ["RED", "BLUE", "GREEN", "YELLOW"] as const;
const TRIALS = 10;

interface TrialResult {
  trial: number;
  congruent: boolean;
  correct: boolean;
  responseTime: number;
}

interface StroopQuickProps {
  onComplete: (result: StroopQuickResult) => void;
}

export function StroopQuick({ onComplete }: StroopQuickProps) {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  const [phase, setPhase] = useState<"instructions" | "test">("instructions");
  const [currentTrial, setCurrentTrial] = useState(0);
  const [trial, setTrial] = useState<{ word: string; color: string; congruent: boolean } | null>(
    null,
  );
  const [results, setResults] = useState<TrialResult[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);

  const generateTrial = () => {
    const wordIndex = Math.floor(Math.random() * WORDS.length);
    const colorIndex = Math.floor(Math.random() * COLORS.length);

    return {
      word: WORDS[wordIndex],
      color: COLORS[colorIndex],
      congruent: wordIndex === colorIndex,
    };
  };

  useEffect(() => {
    if (phase === "test" && currentTrial < TRIALS) {
      setTrial(generateTrial());
      setStartTime(performance.now());
    }

    if (phase === "test" && currentTrial >= TRIALS) {
      const result = calculateScore(results);
      onComplete(result);
    }
  }, [phase, currentTrial]);

  const handleResponse = (selectedColor: string) => {
    if (!startTime || !trial) return;

    const responseTime = performance.now() - startTime;
    const correct = selectedColor === trial.color;

    setResults((prev) => [
      ...prev,
      {
        trial: currentTrial,
        congruent: trial.congruent,
        correct,
        responseTime,
      },
    ]);

    setCurrentTrial((prev) => prev + 1);
  };

  const progress = ((currentTrial + 1) / TRIALS) * 100;

  if (phase === "instructions") {
    return (
      <Card className="mx-auto max-w-2xl p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">
              {isFr ? "Stroop (mode rapide)" : "Stroop Quick"}
            </h2>
            <div className="flex items-center gap-2 text-sm text-foreground/85">
              <Brain className="h-4 w-4" />
              {isFr
                ? "Mesure en ~30s : contrôle inhibiteur & interférence"
                : "Measures in ~30s: inhibitory control & interference"}
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {isFr
                ? "Cliquez sur la COULEUR de l'encre (pas le mot). 10 essais seulement pour ce mode rapide."
                : "Click the COLOR of the ink (not the word). Only 10 trials in this quick mode."}
            </AlertDescription>
          </Alert>

          <Button size="lg" className="w-full" onClick={() => setPhase("test")}
          >
            <Brain className="mr-2 h-4 w-4" />
            {isFr ? "Commencer (≈30s)" : "Start (~30s)"}
          </Button>
        </div>
      </Card>
    );
  }

  if (phase === "test" && trial) {
    return (
      <Card className="mx-auto max-w-2xl p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-foreground/85">
              <span>
                {isFr ? "Essai" : "Trial"} {currentTrial + 1} / {TRIALS}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>

          <div className="flex flex-col items-center space-y-8 py-10">
            <div className="text-5xl font-bold" style={{ color: trial.color }}>
              {trial.word}
            </div>
            <p className="text-sm text-foreground/85">
              {isFr
                ? "Cliquez sur la COULEUR de l'encre (pas le mot)"
                : "Click the COLOR of the ink (not the word)"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {COLORS.map((color) => (
              <Button
                key={color}
                onClick={() => handleResponse(color)}
                className="h-16 text-lg font-bold text-white"
                style={{ backgroundColor: color }}
              >
                {color.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return null;
}

function calculateScore(results: TrialResult[]): StroopQuickResult {
  const congruent = results.filter((r) => r.congruent);
  const incongruent = results.filter((r) => !r.congruent);

  const avgCongruent =
    congruent.length > 0
      ? congruent.reduce((sum, r) => sum + r.responseTime, 0) / congruent.length
      : 0;
  const avgIncongruent =
    incongruent.length > 0
      ? incongruent.reduce((sum, r) => sum + r.responseTime, 0) / incongruent.length
      : 0;

  const stroopEffect = avgIncongruent - avgCongruent;
  const accuracy =
    results.length > 0
      ? (results.filter((r) => r.correct).length / results.length) * 100
      : 0;

  const normalized = Math.max(0, Math.min(100, 50 + (100 - stroopEffect) / 2));

  return {
    stroopEffect: Math.round(stroopEffect),
    inhibitoryControl: Math.round(normalized),
    accuracy: Math.round(accuracy),
    score: Math.round(normalized),
  };
}
