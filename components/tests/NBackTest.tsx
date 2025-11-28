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
const PRE_STIMULUS = 400; // ms d'écran neutre avant chaque lettre
const STIMULUS_DURATION = 800; // ms (durée d'affichage de la lettre)
const ISI = 2500; // ms (intervalle un peu plus long entre les essais initiaux)
const DEMO_STEP_DURATION = 2500;

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
  const [demoStep, setDemoStep] = useState(0);
  const [isDemoRunning, setIsDemoRunning] = useState(true);

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
    if (phase !== "test") return;

    if (currentTrial >= TRIALS) {
      setPhase("complete");
      return;
    }

    if (sequence.length === 0 || waitingForResponse) return;

    let preTimer: NodeJS.Timeout | null = null;
    let stimTimer: NodeJS.Timeout | null = null;
    let nextTimer: NodeJS.Timeout | null = null;

    // 1) Écran neutre (~400 ms)
    preTimer = setTimeout(() => {
      // 2) Affichage de la lettre
      setCurrentStimulus(sequence[currentTrial]);
      setShowStimulus(true);

      stimTimer = setTimeout(() => {
        setShowStimulus(false);

        if (currentTrial >= N) {
          // 3) Phase de réponse ("+" vert jusqu'au clic)
          setWaitingForResponse(true);
        } else {
          // Pour les premiers essais de mémorisation, on enchaîne automatiquement
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
    if (!isDemoRunning || phase !== "instructions") return;

    const DEMO_STEPS = 6;
    const isLastStep = demoStep >= DEMO_STEPS - 1;

    const timer = setTimeout(() => {
      if (isLastStep) {
        setIsDemoRunning(false);
        setDemoStep(0);
      } else {
        setDemoStep((prev) => prev + 1);
      }
    }, DEMO_STEP_DURATION);

    return () => clearTimeout(timer);
  }, [isDemoRunning, demoStep, phase]);

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
    const demoConfig = (() => {
      if (demoStep === 0) {
        return {
          trialLabel: "1. A",
          display: "A",
          phase: "memorize",
          explanation: isFr
            ? "Étape 1 : mémorisez simplement la lettre A."
            : "Step 1: just memorize the letter A.",
        };
      }
      if (demoStep === 1) {
        return {
          trialLabel: "2. B",
          display: "B",
          phase: "memorize",
          explanation: isFr
            ? "Étape 2 : mémorisez maintenant la lettre B (vous gardez A et B en mémoire)."
            : "Step 2: now memorize letter B (you keep A and B in memory).",
        };
      }
      if (demoStep === 2) {
        return {
          trialLabel: isFr ? "3. A → MATCH (identique à #1)" : "3. A → MATCH (same as #1)",
          display: "+",
          phase: "respond",
          explanation: isFr
            ? "Étape 3 : le + apparaît sur fond vert. La lettre juste avant était A, identique à celle d'il y a 2 lettres (#1) → cliquez MATCH."
            : "Step 3: the + appears on a green background. The previous letter was A, the same as 2 positions ago (#1) → click MATCH.",
        };
      }
      if (demoStep === 3) {
        return {
          trialLabel: "4. C",
          display: "C",
          phase: "memorize",
          explanation: isFr
            ? "Étape 4 : nouvelle lettre C à mémoriser."
            : "Step 4: new letter C to memorize.",
        };
      }
      if (demoStep === 4) {
        return {
          trialLabel: isFr ? "5. B → MATCH (identique à #2)" : "5. B → MATCH (same as #2)",
          display: "+",
          phase: "respond",
          explanation: isFr
            ? "Étape 5 : le + est de nouveau sur fond vert. La lettre précédente était B, identique à celle d'il y a 2 lettres (#2) → cliquez MATCH."
            : "Step 5: the + is again on a green background. The previous letter was B, the same as 2 positions ago (#2) → click MATCH.",
        };
      }
      if (demoStep === 5) {
        return {
          trialLabel: isFr ? "6. D → NO MATCH" : "6. D → NO MATCH",
          display: "+",
          phase: "respond",
          explanation: isFr
            ? "Étape 6 : le + est sur fond vert mais la lettre précédente (D) est différente de celle d'il y a 2 lettres → cliquez NO MATCH."
            : "Step 6: the + is on a green background but the previous letter (D) is different from the one 2 positions ago → click NO MATCH.",
        };
      }
      return {
        trialLabel: "",
        display: "+",
        phase: "memorize",
        explanation: "",
      };
    })();

    const demoBgClass =
      demoConfig.phase === "respond" ? "bg-success-subtle" : "bg-muted/40";

    return (
      <Card className="mx-auto max-w-2xl p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">
              {isFr ? "Test N-Back" : "N-Back Task"}
            </h2>
            <div className="flex items-center gap-2 text-sm text-foreground/85">
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

          <div className="space-y-3 rounded-lg bg-muted/40 p-4">
            <div className="flex items-center justify-between text-xs text-foreground/85">
              <span>
                {isFr
                  ? "Exemple animé : suivez les étapes 1 → 6"
                  : "Animated example: follow steps 1 → 6"}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px]">
                  {demoStep + 1} / 6
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="h-7 px-2 text-[11px]"
                  onClick={() => {
                    setDemoStep(0);
                    setIsDemoRunning(true);
                  }}
                  disabled={isDemoRunning}
                >
                  {isFr ? "Rejouer" : "Replay"}
                </Button>
              </div>
            </div>

            <div className={`flex items-center justify-center rounded-xl py-6 ${demoBgClass}`}>
              <span className="text-5xl font-bold">
                {demoConfig.display}
              </span>
            </div>

            <div className="space-y-1 text-xs text-foreground/85">
              <p className="font-mono">{demoConfig.trialLabel}</p>
              <p>{demoConfig.explanation}</p>
            </div>
          </div>

          <Alert variant="default">
            <AlertDescription className="text-sm">
              {isFr
                ? "Chaque lettre apparaît brièvement, puis un signe + s'affiche. C'est pendant ce + que vous cliquez MATCH ou NO MATCH : le fond devient VERT quand vous devez répondre. 30 essais au total (~5 minutes)."
                : "Each letter appears briefly, then a + sign is shown. During this + you click MATCH or NO MATCH: the background turns GREEN when you should respond. 30 trials total (~5 minutes)."}
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
            <div className="flex justify-between text-sm text-foreground/85">
              <span>
                {isFr ? "Essai" : "Trial"} {currentTrial + 1} / {TRIALS}
              </span>
              <span>{Math.round(((currentTrial + 1) / TRIALS) * 100)}%</span>
            </div>
            <Progress value={((currentTrial + 1) / TRIALS) * 100} />
          </div>

          {/* Indicateur d'état du test */}
          <div className="text-center text-sm text-foreground/85">
            {currentTrial < N
              ? (isFr
                  ? `Phase de mémorisation (aucune réponse jusqu'à l'essai ${N + 1})`
                  : `Memorization phase (no response until trial ${N + 1})`)
              : showStimulus
                ? (isFr
                    ? "Nouvel essai : mémorisez la lettre"
                    : "New trial: memorize the letter")
                : waitingForResponse
                  ? (isFr
                      ? "Répondez maintenant : MATCH ou NO MATCH"
                      : "Respond now: MATCH or NO MATCH")
                  : (isFr
                      ? "Préparation du prochain essai..."
                      : "Preparing next trial...")}
          </div>

          {/* Stimulus avec code couleur */}
          <div
            className={`flex items-center justify-center py-20 rounded-2xl transition-colors ${
              currentTrial < N
                ? "bg-muted/40" // phase de mémorisation initiale
                : waitingForResponse
                  ? "bg-success-subtle" // phase de réponse (MATCH / NO MATCH)
                  : "bg-muted/20" // écran neutre entre les essais / pré-lettre
            }`}
          >
            <div
              className={
                showStimulus
                  ? "text-8xl font-bold"
                  : waitingForResponse
                    ? "text-8xl font-bold"
                    : "text-6xl font-bold opacity-60" // "+" neutre, plus petit et atténué
              }
            >
              {showStimulus
                ? currentStimulus
                : waitingForResponse
                  ? "+" // "+" de réponse (vert)
                  : "·" // point neutre avant/après
              }
            </div>
          </div>

          {/* Response buttons */}
          {currentTrial >= N ? (
            <div className="space-y-4">
              {waitingForResponse && (
                <div className="text-center text-sm text-foreground/85 animate-pulse">
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
            <div className="rounded-lg bg-muted/50 p-4 text-center text-sm text-foreground/85">
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
