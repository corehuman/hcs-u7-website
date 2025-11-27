"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Info, Brain } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const COLORS = ["red", "blue", "green", "yellow"];
const WORDS = ["RED", "BLUE", "GREEN", "YELLOW"];
const TRIALS = 40;

interface StroopResult {
  stroopEffect: number;
  inhibitoryControl: number;
  accuracy: number;
  avgCongruent: number;
  avgIncongruent: number;
}

interface TrialResult {
  trial: number;
  congruent: boolean;
  correct: boolean;
  responseTime: number;
}

interface StroopTestProps {
  onComplete: (result: StroopResult) => void;
}

export function StroopTest({ onComplete }: StroopTestProps) {
  const { lang } = useLanguage();
  const isFr = lang === "fr";
  const [phase, setPhase] = useState<"instructions" | "practice" | "test" | "complete">("instructions");
  const [currentTrial, setCurrentTrial] = useState(0);
  const [trial, setTrial] = useState<{ word: string; color: string; congruent: boolean } | null>(null);
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
    } else if (phase === "test" && currentTrial >= TRIALS) {
      setPhase("complete");
    }
  }, [phase, currentTrial]);

  const handleResponse = (selectedColor: string) => {
    if (!startTime || !trial) return;

    const responseTime = performance.now() - startTime;
    const correct = selectedColor === trial.color;

    setResults([
      ...results,
      {
        trial: currentTrial,
        congruent: trial.congruent,
        correct,
        responseTime,
      },
    ]);

    setCurrentTrial(currentTrial + 1);
  };

  const calculateScore = (): StroopResult => {
    const congruent = results.filter((r) => r.congruent);
    const incongruent = results.filter((r) => !r.congruent);

    const avgCongruent = congruent.length > 0 
      ? congruent.reduce((sum, r) => sum + r.responseTime, 0) / congruent.length 
      : 0;
    const avgIncongruent = incongruent.length > 0
      ? incongruent.reduce((sum, r) => sum + r.responseTime, 0) / incongruent.length
      : 0;

    const stroopEffect = avgIncongruent - avgCongruent;
    const accuracy = (results.filter((r) => r.correct).length / results.length) * 100;

    // Normalize (population norms: 50-150ms)
    const normalized = Math.max(0, Math.min(100, 50 + (100 - stroopEffect) / 2));

    return {
      stroopEffect: Math.round(stroopEffect),
      inhibitoryControl: Math.round(normalized),
      accuracy: Math.round(accuracy),
      avgCongruent: Math.round(avgCongruent),
      avgIncongruent: Math.round(avgIncongruent),
    };
  };

  useEffect(() => {
    if (phase === "complete") {
      const score = calculateScore();
      onComplete(score);
    }
  }, [phase]);

  if (phase === "instructions") {
    return (
      <Card className="mx-auto max-w-2xl p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">
              {isFr ? "Test de Stroop" : "Stroop Task"}
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Brain className="h-4 w-4" />
              {isFr ? "Mesure : Contrôle inhibiteur & attention sélective" : "Measures: Inhibitory control & selective attention"}
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {isFr 
                ? "Vous verrez des mots affichés dans différentes couleurs. Votre tâche est d'identifier la COULEUR de l'encre, pas le mot lui-même."
                : "You will see words displayed in different colors. Your task is to identify the COLOR of the ink, not the word itself."}
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="font-medium">{isFr ? "Exemples :" : "Examples:"}</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-blue-600">RED</span>
                <span className="text-sm text-muted-foreground">
                  → {isFr ? "Cliquez BLEU (ignorez le mot)" : "Click BLUE (ignore the word)"}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-green-600">GREEN</span>
                <span className="text-sm text-muted-foreground">
                  → {isFr ? "Cliquez VERT (mot et couleur correspondent)" : "Click GREEN (word matches color)"}
                </span>
              </div>
            </div>
          </div>

          <Alert variant="default">
            <AlertDescription className="text-sm">
              {isFr
                ? "Répondez aussi vite que possible tout en maintenant la précision. Vous effectuerez 40 essais (~3 minutes)."
                : "Respond as quickly as possible while maintaining accuracy. You will complete 40 trials (~3 minutes)."}
            </AlertDescription>
          </Alert>

          <Button size="lg" onClick={() => setPhase("test")} className="w-full">
            <Brain className="mr-2 h-4 w-4" />
            {isFr ? "Commencer le test" : "Start Test"}
          </Button>
        </div>
      </Card>
    );
  }

  if (phase === "test" && trial) {
    return (
      <Card className="mx-auto max-w-2xl p-8">
        <div className="space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {isFr ? "Essai" : "Trial"} {currentTrial + 1} / {TRIALS}
              </span>
              <span>{Math.round(((currentTrial + 1) / TRIALS) * 100)}%</span>
            </div>
            <Progress value={((currentTrial + 1) / TRIALS) * 100} />
          </div>

          {/* Stimulus */}
          <div className="flex flex-col items-center space-y-8 py-12">
            <div
              className="text-6xl font-bold"
              style={{ color: trial.color }}
            >
              {trial.word}
            </div>
            <p className="text-sm text-muted-foreground">
              {isFr 
                ? "Cliquez sur la COULEUR de l'encre (pas le mot)"
                : "Click the COLOR of the ink (not the word)"}
            </p>
          </div>

          {/* Response buttons */}
          <div className="grid grid-cols-2 gap-4">
            {COLORS.map((color) => (
              <Button
                key={color}
                onClick={() => handleResponse(color)}
                className="h-20 text-lg font-bold text-white"
                style={{
                  backgroundColor: color,
                }}
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
