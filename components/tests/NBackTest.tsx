"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Info, Brain, ChevronRight, X } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"];
const N = 2; // 2-back task
const TRIALS = 30;
const STIMULUS_DURATION = 500; // ms
const ISI = 2000; // inter-stimulus interval

interface NBackResult {
  accuracy: number;
  workingMemory: number;
  dPrime: string;
  hits: number;
  misses: number;
  falseAlarms: number;
}

interface NBackTestProps {
  onComplete: (result: NBackResult) => void;
}

export function NBackTest({ onComplete }: NBackTestProps) {
  const { lang } = useLanguage();
  const isFr = lang === "fr";
  const [phase, setPhase] = useState<"instructions" | "test" | "complete">("instructions");
  const [currentTrial, setCurrentTrial] = useState(0);
  const [sequence, setSequence] = useState<string[]>([]);
  const [currentStimulus, setCurrentStimulus] = useState<string | null>(null);
  const [results, setResults] = useState<{
    trial: number;
    response: boolean;
    actualMatch: boolean;
    correct: boolean;
  }[]>([]);
  const [showStimulus, setShowStimulus] = useState(false);
  const [waitingForResponse, setWaitingForResponse] = useState(false);

  const generateSequence = () => {
    const seq: string[] = [];
    for (let i = 0; i < TRIALS; i++) {
      // 30% matches
      if (i >= N && Math.random() < 0.3) {
        seq.push(seq[i - N]); // Match
      } else {
        // Non-match
        let letter;
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
  }, [phase]);

  useEffect(() => {
    if (phase === "test" && currentTrial < TRIALS && sequence.length > 0 && !waitingForResponse) {
      // Show stimulus
      setCurrentStimulus(sequence[currentTrial]);
      setShowStimulus(true);

      const hideTimer = setTimeout(() => {
        setShowStimulus(false);
        // If this trial needs a response, wait for it
        if (currentTrial >= N) {
          setWaitingForResponse(true);
        }
      }, STIMULUS_DURATION);

      // Only auto-advance if we don't need a response (first N trials)
      let nextTimer: NodeJS.Timeout | null = null;
      if (currentTrial < N) {
        nextTimer = setTimeout(() => {
          setCurrentTrial(currentTrial + 1);
        }, ISI);
      }

      return () => {
        clearTimeout(hideTimer);
        if (nextTimer) clearTimeout(nextTimer);
      };
    } else if (currentTrial >= TRIALS) {
      setPhase("complete");
    }
  }, [phase, currentTrial, sequence, waitingForResponse]);

  const handleResponse = (isMatch: boolean) => {
    if (currentTrial < N || !waitingForResponse) return; // Can't respond for first N trials or if not waiting

    const actualMatch = sequence[currentTrial] === sequence[currentTrial - N];
    const correct = isMatch === actualMatch;

    setResults([
      ...results,
      {
        trial: currentTrial,
        response: isMatch,
        actualMatch,
        correct,
      },
    ]);

    // Move to next trial
    setWaitingForResponse(false);
    setTimeout(() => {
      setCurrentTrial(currentTrial + 1);
    }, 500); // Small delay before next trial
  };

  const calculateScore = (): NBackResult => {
    const validTrials = results.filter((r) => r.trial >= N);
    const accuracy = validTrials.length > 0
      ? (validTrials.filter((r) => r.correct).length / validTrials.length) * 100
      : 0;

    const hits = validTrials.filter((r) => r.actualMatch && r.response).length;
    const misses = validTrials.filter((r) => r.actualMatch && !r.response).length;
    const falseAlarms = validTrials.filter((r) => !r.actualMatch && r.response).length;

    // d-prime (signal detection theory)
    const hitRate = Math.min(0.99, Math.max(0.01, hits / Math.max(1, hits + misses)));
    const faRate = Math.min(0.99, Math.max(0.01, falseAlarms / Math.max(1, validTrials.length)));

    const dPrime = z(hitRate) - z(faRate);

    // Normalize for 0-100
    const normalized = Math.max(0, Math.min(100, 50 + dPrime * 20));

    return {
      accuracy: Math.round(accuracy),
      workingMemory: Math.round(normalized),
      dPrime: dPrime.toFixed(2),
      hits,
      misses,
      falseAlarms,
    };
  };

  // Helper: inverse normal CDF (approximation)
  const z = (p: number) => {
    return Math.sqrt(2) * erfInv(2 * p - 1);
  };

  const erfInv = (x: number) => {
    const a = 0.147;
    const b = 2 / (Math.PI * a) + Math.log(1 - x * x) / 2;
    return Math.sign(x) * Math.sqrt(Math.sqrt(b * b - Math.log(1 - x * x) / a) - b);
  };

  useEffect(() => {
    if (phase === "complete") {
      onComplete(calculateScore());
    }
  }, [phase]);

  if (phase === "instructions") {
    return (
      <Card className="mx-auto max-w-2xl p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">
              {isFr ? "Test N-Back" : "N-Back Task"}
            </h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Brain className="h-4 w-4" />
              {isFr ? "Mesure : Capacité de mémoire de travail" : "Measures: Working memory capacity"}
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {isFr
                ? "Des lettres apparaîtront une à la fois. Appuyez sur MATCH si la lettre actuelle est la même que celle d'il y a DEUX lettres."
                : "Letters will appear one at a time. Press MATCH if the current letter is the same as the one TWO letters ago."}
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <h3 className="font-medium">{isFr ? "Exemple :" : "Example:"}</h3>
            <div className="space-y-2 rounded-lg bg-muted/50 p-4 font-mono text-sm">
              <div>1. A</div>
              <div>2. B</div>
              <div className="font-bold text-primary">
                3. A → MATCH {isFr ? "(identique à #1)" : "(same as #1)"}
              </div>
              <div>4. C</div>
              <div className="font-bold text-primary">
                5. B → MATCH {isFr ? "(identique à #2)" : "(same as #2)"}
              </div>
              <div>6. D → NO MATCH</div>
            </div>
          </div>

          <Alert variant="default">
            <AlertDescription className="text-sm">
              {isFr
                ? "Les lettres apparaissent brièvement. Répondez pendant l'intervalle vide. 30 essais au total (~5 minutes)."
                : "Letters appear briefly. Respond during the blank interval. 30 trials total (~5 minutes)."}
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

  if (phase === "test") {
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
          <div className="flex items-center justify-center py-20">
            <div className="text-8xl font-bold">
              {showStimulus ? currentStimulus : "+"}
            </div>
          </div>

          {/* Response buttons */}
          {currentTrial >= N ? (
            <div className="space-y-4">
              {waitingForResponse && (
                <div className="text-center text-sm text-muted-foreground animate-pulse">
                  {isFr ? "Cliquez sur votre réponse" : "Click your response"}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <Button
                onClick={() => handleResponse(true)}
                className="h-20 text-lg"
                variant="default"
                size="lg"
                disabled={!waitingForResponse}
              >
                <ChevronRight className="mr-2 h-5 w-5" />
                MATCH
              </Button>
              <Button
                onClick={() => handleResponse(false)}
                className="h-20 text-lg"
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
            <div className="rounded-lg bg-muted/50 p-4 text-center text-sm text-muted-foreground">
              {isFr
                ? `En mémorisation... (répondez à partir de l'essai ${N + 1})`
                : `Remembering... (respond starting from trial ${N + 1})`}
            </div>
          )}
        </div>
      </Card>
    );
  }

  return null;
}
