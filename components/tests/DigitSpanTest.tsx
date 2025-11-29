"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Brain, Hash, ArrowRight, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";

type TestPhase = "instructions" | "test" | "complete";
type TrialPhase = "display" | "input" | "feedback";

interface TrialResult {
  span: number;
  correct: boolean;
}

export interface DigitSpanResult {
  bestSpan: number;
  workingMemory: number;
  trials: TrialResult[];
}

interface DigitSpanTestProps {
  onComplete: (result: DigitSpanResult) => void;
}

const MIN_SPAN = 3;
const MAX_SPAN = 7;
const MAX_ATTEMPTS_PER_SPAN = 2;

export function DigitSpanTest({ onComplete }: DigitSpanTestProps) {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  const [phase, setPhase] = useState<TestPhase>("instructions");
  const [trialPhase, setTrialPhase] = useState<TrialPhase>("display");
  const [currentSpan, setCurrentSpan] = useState(MIN_SPAN);
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentDigitIndex, setCurrentDigitIndex] = useState(0);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [attemptForSpan, setAttemptForSpan] = useState(1);
  const [bestSpan, setBestSpan] = useState(0);
  const [trials, setTrials] = useState<TrialResult[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const displayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const generateSequence = (length: number): number[] => {
    return Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);
  };

  const startTrial = (span: number) => {
    setSequence(generateSequence(span));
    setUserInput([]);
    setTrialPhase("display");
    setCurrentDigitIndex(0);
    setShowFeedback(false);
  };

  // Control digit display timing
  useEffect(() => {
    if (phase !== "test" || trialPhase !== "display") return;
    if (sequence.length === 0) return;

    let timer: NodeJS.Timeout;

    if (currentDigitIndex < sequence.length) {
      timer = setTimeout(() => {
        setCurrentDigitIndex((prev) => prev + 1);
      }, 900);
    } else {
      // Small pause before letting the user answer
      timer = setTimeout(() => {
        setTrialPhase("input");
      }, 700);
    }

    displayTimeoutRef.current = timer;
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [phase, trialPhase, currentDigitIndex, sequence]);

  const handleDigitInput = (digit: number) => {
    if (trialPhase !== "input") return;
    if (userInput.length >= currentSpan) return;
    setUserInput((prev) => [...prev, digit]);
  };

  const handleBackspace = () => {
    if (trialPhase !== "input") return;
    setUserInput((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (trialPhase !== "input") return;
    setUserInput([]);
  };

  const handleSubmit = () => {
    if (trialPhase !== "input") return;
    if (userInput.length !== currentSpan) return;

    const correct = userInput.every((d, i) => d === sequence[i]);

    setIsCorrect(correct);
    setShowFeedback(true);
    setTrialPhase("feedback");
    setTrials((prev) => [...prev, { span: currentSpan, correct }]);

    setTimeout(() => {
      if (correct) {
        setBestSpan((prev) => Math.max(prev, currentSpan));
        const nextSpan = currentSpan + 1;

        if (nextSpan > MAX_SPAN) {
          setPhase("complete");
        } else {
          setCurrentSpan(nextSpan);
          setAttemptForSpan(1);
          startTrial(nextSpan);
        }
      } else {
        if (attemptForSpan >= MAX_ATTEMPTS_PER_SPAN) {
          setPhase("complete");
        } else {
          setAttemptForSpan((prev) => prev + 1);
          startTrial(currentSpan);
        }
      }
    }, 1400);
  };

  // Compute working memory score when complete
  useEffect(() => {
    if (phase !== "complete") return;

    // Map bestSpan from [MIN_SPAN, MAX_SPAN] -> [20, 100]
    const clamped = Math.max(MIN_SPAN, Math.min(MAX_SPAN, bestSpan || MIN_SPAN));
    const ratio = (clamped - MIN_SPAN) / (MAX_SPAN - MIN_SPAN || 1);
    const workingMemory = Math.round(20 + ratio * 80);

    onComplete({ bestSpan: bestSpan, workingMemory, trials });
  }, [phase, bestSpan, trials, onComplete]);

  if (phase === "instructions") {
    return (
      <Card className="mx-auto max-w-2xl p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Hash className="h-5 w-5 text-primary" />
              {isFr ? "Test d'Empan de Chiffres" : "Digit Span Test"}
            </h2>
            <div className="flex items-center gap-2 text-sm text-foreground/85">
              <Brain className="h-4 w-4" />
              {isFr
                ? "Mesure : mémoire à court terme & mémoire de travail"
                : "Measures: short-term memory & working memory"}
            </div>
          </div>

          <Alert>
            <ArrowRight className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {isFr
                ? "Des chiffres apparaîtront un par un. À la fin de la séquence, entrez-les dans le MÊME ordre. La longueur augmente progressivement jusqu'à ce que cela devienne trop difficile."
                : "Digits will appear one at a time. At the end of the sequence, type them in the SAME order. The length increases until it becomes too difficult."}
            </AlertDescription>
          </Alert>

          <div className="space-y-3 text-sm text-foreground/85">
            <p className="font-medium">{isFr ? "Exemple" : "Example"}</p>
            <div className="rounded-lg bg-muted/50 p-3 font-mono">
              <div>{isFr ? "Affichage :" : "Display:"} 3 → 7 → 4</div>
              <div>{isFr ? "Vous tapez :" : "You type:"} 3 → 7 → 4 ✓</div>
            </div>
            <p>
              {isFr
                ? "Deux essais par longueur. Après deux erreurs à la même longueur, le test s'arrête."
                : "Two attempts per length. After two errors at the same length, the test stops."}
            </p>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={() => {
              setPhase("test");
              setCurrentSpan(MIN_SPAN);
              setAttemptForSpan(1);
              startTrial(MIN_SPAN);
            }}
          >
            <Brain className="mr-2 h-4 w-4" />
            {isFr ? "Commencer le test" : "Start Test"}
          </Button>
        </div>
      </Card>
    );
  }

  if (phase === "test") {
    const isInputPhase = trialPhase === "input" || trialPhase === "feedback";

    return (
      <Card className="mx-auto max-w-2xl p-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between text-sm text-foreground/85">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-primary" />
              <span>
                {isFr ? "Longueur" : "Span"}: {currentSpan}
              </span>
            </div>
            <span>
              {isFr ? "Essai" : "Attempt"} {attemptForSpan} / {MAX_ATTEMPTS_PER_SPAN}
            </span>
          </div>

          {/* Display phase */}
          {trialPhase === "display" && (
            <div className="h-40 flex items-center justify-center">
              <AnimatePresence mode="wait">
                {currentDigitIndex < sequence.length ? (
                  <motion.div
                    key={currentDigitIndex}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="text-7xl font-bold text-primary"
                  >
                    {sequence[currentDigitIndex]}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-base text-foreground/85"
                  >
                    {isFr ? "Préparez votre réponse..." : "Get ready to answer..."}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Input & feedback */}
          {isInputPhase && (
            <div className="space-y-4">
              <p className="text-center text-sm text-foreground/85">
                {isFr
                  ? "Entrez les chiffres dans le même ordre"
                  : "Enter the digits in the same order"}
              </p>

              {/* User input boxes */}
              <div className="flex justify-center gap-2 min-h-[60px]">
                {Array.from({ length: currentSpan }).map((_, idx) => (
                  <div
                    key={idx}
                    className="w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold text-xl border-muted-foreground/30"
                  >
                    {userInput[idx] ?? ""}
                  </div>
                ))}
              </div>

              {/* Feedback */}
              {showFeedback && (
                <div className="text-center text-sm font-semibold flex items-center justify-center gap-2">
                  {isCorrect ? (
                    <span className="text-green-600 dark:text-green-400 flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      {isFr ? "Correct" : "Correct"}
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400 flex items-center gap-2">
                      <X className="h-4 w-4" />
                      {isFr ? "Incorrect" : "Incorrect"}
                    </span>
                  )}
                </div>
              )}

              {!showFeedback && (
                <>
                  {/* Keypad */}
                  <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
                      <Button
                        key={digit}
                        onClick={() => handleDigitInput(digit)}
                        disabled={userInput.length >= currentSpan}
                        className="h-12 text-xl font-semibold"
                        variant="outline"
                      >
                        {digit}
                      </Button>
                    ))}
                  </div>

                  <div className="flex gap-2 max-w-xs mx-auto">
                    <Button
                      onClick={handleBackspace}
                      disabled={userInput.length === 0}
                      variant="outline"
                      className="flex-1"
                    >
                      ← {isFr ? "Effacer" : "Backspace"}
                    </Button>
                    <Button
                      onClick={handleClear}
                      disabled={userInput.length === 0}
                      variant="outline"
                      className="flex-1"
                    >
                      {isFr ? "Réinitialiser" : "Clear"}
                    </Button>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={userInput.length !== currentSpan}
                    className="w-full max-w-xs mx-auto block"
                    size="lg"
                  >
                    {isFr ? "Valider" : "Submit"}
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </Card>
    );
  }

  return null;
}
