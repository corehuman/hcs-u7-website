"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Brain, Info, ChevronRight, X } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import type { NBackQuickResult } from "@/lib/quick-auth";

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const N = 2;
const TRIALS = 8;
const PRE_STIMULUS = 400;
const STIMULUS_DURATION = 800;
const ISI = 1800;

interface InternalResult {
  trial: number;
  response: boolean;
  actualMatch: boolean;
  correct: boolean;
}

interface NBackQuickProps {
  onComplete: (result: NBackQuickResult) => void;
}

export function NBackQuick({ onComplete }: NBackQuickProps) {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  const [phase, setPhase] = useState<"instructions" | "test" | "complete">("instructions");
  const [currentTrial, setCurrentTrial] = useState(0);
  const [sequence, setSequence] = useState<string[]>([]);
  const [currentStimulus, setCurrentStimulus] = useState<string | null>(null);
  const [results, setResults] = useState<InternalResult[]>([]);
  const [showStimulus, setShowStimulus] = useState(false);
  const [waitingForResponse, setWaitingForResponse] = useState(false);

  const generateSequence = () => {
    const seq: string[] = [];
    for (let i = 0; i < TRIALS; i += 1) {
      if (i >= N && Math.random() < 0.35) {
        seq.push(seq[i - N]);
      } else {
        let letter: string;
        do {
          letter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
        } while (i >= N && letter === seq[i - N]);
        seq.push(letter);
      }
    }
    return seq;
  };

  useEffect(() => {
    if (phase === "test" && sequence.length === 0) {
      setSequence(generateSequence());
    }
  }, [phase, sequence.length]);

  useEffect(() => {
    if (phase !== "test") return;
    if (currentTrial >= TRIALS) {
      setPhase("complete");
      return;
    }
    if (sequence.length === 0 || waitingForResponse) return;

    let preTimer: NodeJS.Timeout | null = null;
    let stimTimer: NodeJS.Timeout | null = null;
    let nextTimer: NodeJS.Timeout | null = null;

    preTimer = setTimeout(() => {
      setCurrentStimulus(sequence[currentTrial]);
      setShowStimulus(true);

      stimTimer = setTimeout(() => {
        setShowStimulus(false);

        if (currentTrial >= N) {
          setWaitingForResponse(true);
        } else {
          nextTimer = setTimeout(() => {
            setCurrentTrial((prev) => prev + 1);
          }, ISI);
        }
      }, STIMULUS_DURATION);
    }, PRE_STIMULUS);

    return () => {
      if (preTimer) clearTimeout(preTimer);
      if (stimTimer) clearTimeout(stimTimer);
      if (nextTimer) clearTimeout(nextTimer);
    };
  }, [phase, currentTrial, sequence, waitingForResponse]);

  useEffect(() => {
    if (phase === "complete") {
      const result = calculateScore(results);
      onComplete(result);
    }
  }, [phase, results, onComplete]);

  const handleResponse = (isMatch: boolean) => {
    if (currentTrial < N || !waitingForResponse) return;

    const actualMatch = sequence[currentTrial] === sequence[currentTrial - N];
    const correct = isMatch === actualMatch;

    setResults((prev) => [
      ...prev,
      {
        trial: currentTrial,
        response: isMatch,
        actualMatch,
        correct,
      },
    ]);

    setWaitingForResponse(false);
    setTimeout(() => {
      setCurrentTrial((prev) => prev + 1);
    }, 400);
  };

  const progress = ((currentTrial + 1) / TRIALS) * 100;

  if (phase === "instructions") {
    return (
      <Card className="mx-auto max-w-2xl p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">
              {isFr ? "N-Back (mode rapide)" : "N-Back Quick"}
            </h2>
            <div className="flex items-center gap-2 text-sm text-foreground/85">
              <Brain className="h-4 w-4" />
              {isFr
                ? "Mesure en ~30s : mémoire de travail (2-back, 8 essais)"
                : "Measures in ~30s: working memory (2-back, 8 trials)"}
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {isFr
                ? "Appuyez sur MATCH si la lettre actuelle est la même que celle d'il y a deux lettres, sinon NO MATCH."
                : "Press MATCH if the current letter is the same as two positions ago, otherwise NO MATCH."}
            </AlertDescription>
          </Alert>

          <Button size="lg" className="w-full" onClick={() => setPhase("test")}>
            <Brain className="mr-2 h-4 w-4" />
            {isFr ? "Commencer (≈30s)" : "Start (~30s)"}
          </Button>
        </div>
      </Card>
    );
  }

  if (phase === "test") {
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

          <div
            className={`flex items-center justify-center py-16 rounded-2xl transition-colors ${
              currentTrial < N
                ? "bg-muted/40"
                : waitingForResponse
                ? "bg-success-subtle"
                : "bg-muted/20"
            }`}
          >
            <div className="text-7xl font-bold">
              {showStimulus
                ? currentStimulus
                : waitingForResponse
                ? "+"
                : "·"}
            </div>
          </div>

          {currentTrial >= N ? (
            <div className="space-y-4">
              <div className="text-center text-sm text-foreground/85">
                {isFr
                  ? "MATCH = la même lettre qu'il y a deux positions, sinon NO MATCH."
                  : "MATCH = same letter as two positions ago, otherwise NO MATCH."}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  onClick={() => handleResponse(true)}
                  className="h-16 text-lg"
                  variant="default"
                  size="lg"
                  disabled={!waitingForResponse}
                >
                  <ChevronRight className="mr-2 h-5 w-5" />
                  MATCH
                </Button>
                <Button
                  onClick={() => handleResponse(false)}
                  className="h-16 text-lg"
                  variant="outline"
                  size="lg"
                  disabled={!waitingForResponse}
                >
                  <X className="mr-2 h-5 w-5" />
                  NO MATCH
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-lg bg-muted/50 p-4 text-center text-sm text-foreground/85">
              {isFr
                ? "Phase de mémorisation. Aucune réponse requise pour les premiers essais."
                : "Memorization phase. No response required for the first trials."}
            </div>
          )}
        </div>
      </Card>
    );
  }

  return null;
}

function calculateScore(results: InternalResult[]): NBackQuickResult {
  const validTrials = results.filter((r) => r.trial >= N);

  const accuracy =
    validTrials.length > 0
      ? (validTrials.filter((r) => r.correct).length / validTrials.length) * 100
      : 0;

  const hits = validTrials.filter((r) => r.actualMatch && r.response).length;
  const misses = validTrials.filter((r) => r.actualMatch && !r.response).length;
  const falseAlarms = validTrials.filter((r) => !r.actualMatch && r.response).length;

  const hitRate = Math.min(0.99, Math.max(0.01, hits / Math.max(1, hits + misses)));
  const faRate = Math.min(
    0.99,
    Math.max(0.01, falseAlarms / Math.max(1, validTrials.length)),
  );

  const dPrime = z(hitRate) - z(faRate);
  const workingMemory = Math.max(0, Math.min(100, 50 + dPrime * 20));

  return {
    accuracy: Math.round(accuracy),
    workingMemory: Math.round(workingMemory),
    dPrime: Number.isFinite(dPrime) ? parseFloat(dPrime.toFixed(2)) : 0,
    score: Math.round(workingMemory),
  };
}

function z(p: number): number {
  return Math.sqrt(2) * erfInv(2 * p - 1);
}

function erfInv(x: number): number {
  const a = 0.147;
  const b = 2 / (Math.PI * a) + Math.log(1 - x * x) / 2;
  return (
    Math.sign(x) *
    Math.sqrt(Math.sqrt(b * b - Math.log(1 - x * x) / a) - b)
  );
}
