"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap, Timer, AlertTriangle, Check } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import type { ReactionTimeQuickResult } from "@/lib/quick-auth";

interface Trial {
  rt: number;
  valid: boolean;
  color?: "red" | "blue";
  response?: "red" | "blue";
}

interface ReactionTimeQuickProps {
  onComplete: (result: ReactionTimeQuickResult) => void;
}

const TRIALS_PER_PHASE = 5;

type TestPhase = "instructions" | "simple" | "choice" | "complete";
type TrialState = "waiting" | "ready" | "stimulus" | "tooEarly" | "responded";

export function ReactionTimeQuick({ onComplete }: ReactionTimeQuickProps) {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  const [phase, setPhase] = useState<TestPhase>("instructions");
  const [trialState, setTrialState] = useState<TrialState>("waiting");
  const [currentTrial, setCurrentTrial] = useState(0);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [stimulusTime, setStimulusTime] = useState(0);
  const [stimulusColor, setStimulusColor] = useState<"red" | "blue" | null>(null);
  const [lastReactionTime, setLastReactionTime] = useState<number | null>(null);
  const [showTrialFeedback, setShowTrialFeedback] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const keyPressedRef = useRef(false);

  const startTrial = () => {
    setTrialState("ready");
    setShowTrialFeedback(false);
    setLastReactionTime(null);
    keyPressedRef.current = false;

    setTimeout(() => {
      setTrialState("waiting");
      const delay = 800 + Math.random() * 1200;
      timeoutRef.current = setTimeout(() => {
        setTrialState("stimulus");
        setStimulusTime(performance.now());

        if (phase === "choice") {
          setStimulusColor(Math.random() < 0.5 ? "red" : "blue");
        }
      }, delay);
    }, 400);
  };

  useEffect(() => {
    if (phase === "simple") {
      setCurrentTrial(0);
      setTrials([]);
      startTrial();
    } else if (phase === "choice") {
      setCurrentTrial(0);
      startTrial();
    } else if (phase === "complete") {
      const result = calculateResults(trials);
      onComplete(result);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [phase]);

  const handleResponse = (response?: "red" | "blue") => {
    if (keyPressedRef.current) return;
    keyPressedRef.current = true;

    if (trialState === "waiting" || trialState === "ready") {
      setTrialState("tooEarly");
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setTimeout(() => moveToNextTrial(), 1000);
      return;
    }

    if (trialState === "stimulus") {
      const rt = performance.now() - stimulusTime;
      setLastReactionTime(rt);
      setTrialState("responded");
      setShowTrialFeedback(true);

      let valid = true;
      if (phase === "choice") {
        valid = response === stimulusColor;
      }

      const trial: Trial = {
        rt,
        valid,
        color: stimulusColor || undefined,
        response,
      };

      setTrials((prev) => [...prev, trial]);

      setTimeout(() => moveToNextTrial(), 800);
    }
  };

  const moveToNextTrial = () => {
    const nextTrial = currentTrial + 1;
    if (nextTrial >= TRIALS_PER_PHASE) {
      if (phase === "simple") {
        setPhase("choice");
      } else {
        setPhase("complete");
      }
    } else {
      setCurrentTrial(nextTrial);
      startTrial();
    }
  };

  const progress = ((currentTrial + 1) / TRIALS_PER_PHASE) * 100;

  if (phase === "instructions") {
    return (
      <Card className="mx-auto max-w-2xl p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">
              {isFr ? "Test de Temps de Réaction (rapide)" : "Reaction Time (quick)"}
            </h2>
            <p className="text-sm text-foreground/85">
              {isFr
                ? "Temps de réaction simple & choix en ~30 secondes (5 essais par phase)."
                : "Simple & choice reaction time in about 30 seconds (5 trials per phase)."}
            </p>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {isFr
                ? "Attendez le signal avant de répondre. Les réponses trop précoces sont comptées comme des erreurs."
                : "Wait for the signal before responding. Premature responses are counted as errors."}
            </AlertDescription>
          </Alert>

          <Button size="lg" className="w-full" onClick={() => setPhase("simple")}>
            <Brain className="mr-2 h-4 w-4" />
            {isFr ? "Commencer (≈30s)" : "Start (~30s)"}
          </Button>
        </div>
      </Card>
    );
  }

  if (phase === "simple" || phase === "choice") {
    const isChoice = phase === "choice";

    return (
      <Card className="mx-auto max-w-2xl p-8">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-foreground/85">
              <span className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                {isChoice ? "Choice Reaction" : "Simple Reaction"}
              </span>
              <span>
                Trial {currentTrial + 1} / {TRIALS_PER_PHASE}
              </span>
            </div>
            <Progress value={progress} />
          </div>

          <div className="flex justify-center">
            <div
              className={`w-64 h-64 rounded-2xl flex flex-col items-center justify-center text-3xl font-bold transition-all ${
                trialState === "ready"
                  ? "bg-gray-200 text-foreground/70"
                  : trialState === "waiting"
                  ? "bg-gray-300 text-gray-600"
                  : trialState === "stimulus" && !isChoice
                  ? "bg-green-500 text-white"
                  : trialState === "stimulus" && isChoice && stimulusColor === "red"
                  ? "bg-red-500 text-white"
                  : trialState === "stimulus" && isChoice && stimulusColor === "blue"
                  ? "bg-blue-500 text-white"
                  : trialState === "tooEarly"
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-foreground/70"
              }`}
            >
              {trialState === "ready" && (isFr ? "Préparez-vous" : "Get ready")}
              {trialState === "waiting" && (isFr ? "Attendez" : "Wait")}
              {trialState === "stimulus" && !isChoice && (isFr ? "GO" : "GO")}
              {trialState === "stimulus" && isChoice && (
                <>
                  <div className="text-4xl mb-2">
                    {stimulusColor === "red" ? "RED" : "BLUE"}
                  </div>
                  <div className="text-base opacity-80">
                    {isFr ? "Appuyez sur " : "Press "}
                    {stimulusColor === "red" ? "R" : "B"}
                  </div>
                </>
              )}
              {trialState === "tooEarly" && (isFr ? "Trop tôt" : "Too early")}
              {trialState === "responded" && showTrialFeedback && lastReactionTime && (
                <div className="flex flex-col items-center">
                  <Check className="h-10 w-10 mb-2 text-green-600" />
                  <div className="text-xl">{Math.round(lastReactionTime)} ms</div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center space-y-4">
            {!isChoice ? (
              <>
                <p className="text-sm text-foreground/85">
                  {isFr
                    ? "Appuyez sur le bouton dès que le carré devient vert."
                    : "Press the button as soon as the box turns green."}
                </p>
                <Button
                  size="lg"
                  onClick={() => handleResponse()}
                  disabled={trialState !== "stimulus"}
                  className="min-w-[200px]"
                >
                  {isFr ? "Appuyer" : "Press"}
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm text-foreground/85">
                  {isFr
                    ? "Appuyez sur R pour ROUGE ou B pour BLEU."
                    : "Press R for RED or B for BLUE."}
                </p>
                <div className="flex justify-center gap-4">
                  <Button
                    size="lg"
                    onClick={() => handleResponse("red")}
                    disabled={trialState !== "stimulus"}
                    className="min-w-[120px] bg-red-500 hover:bg-red-600"
                  >
                    {isFr ? "R - Rouge" : "R - Red"}
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => handleResponse("blue")}
                    disabled={trialState !== "stimulus"}
                    className="min-w-[120px] bg-blue-500 hover:bg-blue-600"
                  >
                    {isFr ? "B - Bleu" : "B - Blue"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return null;
}

function calculateResults(trials: Trial[]): ReactionTimeQuickResult {
  const simpleTrials = trials.slice(0, TRIALS_PER_PHASE).filter((t) => t.valid);
  const choiceTrials = trials.slice(TRIALS_PER_PHASE).filter((t) => t.valid);

  if (!simpleTrials.length || !choiceTrials.length) {
    return {
      simpleRT: 0,
      choiceRT: 0,
      consistency: 0,
      accuracy: 0,
      score: 0,
    };
  }

  const avgSimple =
    simpleTrials.reduce((sum, t) => sum + t.rt, 0) / simpleTrials.length;
  const avgChoice =
    choiceTrials.reduce((sum, t) => sum + t.rt, 0) / choiceTrials.length;

  const diff = avgChoice - avgSimple;

  const sdSimple = Math.sqrt(
    simpleTrials.reduce((sum, t) => sum + Math.pow(t.rt - avgSimple, 2), 0) /
      simpleTrials.length,
  );

  const choiceAccuracy = (choiceTrials.length / TRIALS_PER_PHASE) * 100;

  const normalized = Math.max(
    0,
    Math.min(100, 100 - ((avgSimple - 200) + (avgChoice - 300)) / 5),
  );

  return {
    simpleRT: Math.round(avgSimple),
    choiceRT: Math.round(avgChoice),
    consistency: Math.round(sdSimple),
    accuracy: Math.round(choiceAccuracy),
    score: Math.round(normalized),
  };
}
