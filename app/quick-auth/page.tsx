"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Brain, Zap, MoveRight, CheckCircle2, Shield, Timer } from "lucide-react";
import { useLanguage } from "@/components/LanguageProvider";
import { StroopQuick } from "@/components/tests/quick-variants/StroopQuick";
import { ReactionTimeQuick } from "@/components/tests/quick-variants/ReactionTimeQuick";
import { NBackQuick } from "@/components/tests/quick-variants/NBackQuick";
import {
  QUICK_AUTH_CONFIG,
  evaluateQuickAuth,
  type QuickAuthEvaluation,
  type QuickAuthInputs,
  type StroopQuickResult,
  type ReactionTimeQuickResult,
  type NBackQuickResult,
} from "@/lib/quick-auth";

 type Step = "intro" | "stroop" | "reaction" | "nback" | "summary";

export default function QuickAuthPage() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  const [step, setStep] = useState<Step>("intro");
  const [stroopResult, setStroopResult] = useState<StroopQuickResult | null>(null);
  const [rtResult, setRtResult] = useState<ReactionTimeQuickResult | null>(null);
  const [nbackResult, setNbackResult] = useState<NBackQuickResult | null>(null);
  const [evaluation, setEvaluation] = useState<QuickAuthEvaluation | null>(null);

  const stepIndex =
    step === "intro" ? 0 : step === "stroop" ? 1 : step === "reaction" ? 2 : step === "nback" ? 3 : 4;
  const totalSteps = 3; // tests seulement
  const progress = (Math.min(stepIndex, totalSteps) / totalSteps) * 100;

  const handleStart = () => {
    setStep("stroop");
  };

  const handleRestart = () => {
    setStep("intro");
    setStroopResult(null);
    setRtResult(null);
    setNbackResult(null);
    setEvaluation(null);
  };

  const handleStroopComplete = (result: StroopQuickResult) => {
    setStroopResult(result);
    setStep("reaction");
  };

  const handleReactionComplete = (result: ReactionTimeQuickResult) => {
    setRtResult(result);
    setStep("nback");
  };

  const handleNBackComplete = (result: NBackQuickResult) => {
    setNbackResult(result);

    if (!stroopResult || !rtResult) {
      // flux inattendu, mais on évite un crash
      setStep("summary");
      return;
    }

    const inputs: QuickAuthInputs = {
      stroop: stroopResult,
      reactionTime: rtResult,
      nback: result,
    };

    const evalResult = evaluateQuickAuth(inputs, QUICK_AUTH_CONFIG.mode);
    setEvaluation(evalResult);
    setStep("summary");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {isFr ? "Authentification cognitive rapide" : "Quick Cognitive Authentication"}
            </h1>
            <p className="mt-2 text-sm text-foreground/85 max-w-2xl">
              {isFr
                ? "Mode Quick Auth HCS-U7 : 3 mini-tests neurocognitifs en ~90s pour atteindre plus de 90% de confiance sans lancer toute la batterie."
                : "HCS-U7 Quick Auth mode: 3 mini neurocognitive tests in ~90s to reach 90%+ confidence without running the full battery."}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 text-right">
            <Badge variant="outline" className="text-xs">
              {isFr ? "Temps cible" : "Target time"}: {QUICK_AUTH_CONFIG.estimatedDuration}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {isFr ? "Confiance cible" : "Target confidence"}: ≥
              {" "}
              {Math.round(QUICK_AUTH_CONFIG.confidenceThreshold * 100)}%
            </Badge>
          </div>
        </div>

        {/* Timeline */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-2 text-xs font-medium text-foreground/80">
            <span>{isFr ? "Progression" : "Progress"}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} aria-label={isFr ? "Progression Quick Auth" : "Quick Auth progress"} />

          <div className="mt-4 grid grid-cols-3 gap-4 text-xs sm:text-sm">
            <StepItem
              index={1}
              activeStep={stepIndex}
              icon={Brain}
              label={isFr ? "Stroop rapide" : "Stroop quick"}
              duration="~30s"
            />
            <StepItem
              index={2}
              activeStep={stepIndex}
              icon={Zap}
              label={isFr ? "Temps de réaction" : "Reaction time"}
              duration="~30s"
            />
            <StepItem
              index={3}
              activeStep={stepIndex}
              icon={Brain}
              label={isFr ? "N-Back rapide" : "N-Back quick"}
              duration="~30s"
            />
          </div>
        </Card>
      </header>

      {/* Main content */}
      {step === "intro" && (
        <Card className="mx-auto max-w-3xl p-8">
          <div className="space-y-6">
            <Alert>
              <AlertDescription className="text-sm">
                {isFr
                  ? "Quick Auth est pensé pour l'authentification quotidienne (login, checkout) où l'on veut limiter la friction tout en gardant une détection bot forte. Pour les cas critiques (KYC, onboarding bancaire), utilisez la batterie complète."
                  : "Quick Auth is designed for everyday authentication (login, checkout) where we want low friction with strong bot detection. For critical flows (KYC, banking onboarding), use the full battery."}
              </AlertDescription>
            </Alert>

            <ul className="space-y-2 text-sm text-foreground/85">
              <li>
                <strong>{isFr ? "1. Stroop rapide" : "1. Quick Stroop"}</strong>
                {" "}
                – {isFr ? "contrôle inhibiteur & interférence" : "inhibitory control & interference"}
              </li>
              <li>
                <strong>{isFr ? "2. Temps de réaction" : "2. Reaction time"}</strong>
                {" "}
                – {isFr ? "vitesse de traitement simple + choix" : "simple + choice processing speed"}
              </li>
              <li>
                <strong>{isFr ? "3. N-Back rapide" : "3. Quick N-Back"}</strong>
                {" "}
                – {isFr ? "mémoire de travail (2-back)" : "working memory (2-back)"}
              </li>
            </ul>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-foreground/70">
                {isFr
                  ? "Préparez un environnement calme. Les 3 tests doivent être réalisés d'une traite pour une mesure fiable."
                  : "Use a quiet environment. All 3 tests should be completed in one go for reliable measurement."}
              </p>
              <Button size="lg" className="w-full sm:w-auto" onClick={handleStart}>
                <MoveRight className="mr-2 h-4 w-4" />
                {isFr ? "Commencer Quick Auth" : "Start Quick Auth"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {step === "stroop" && (
        <StroopQuick onComplete={handleStroopComplete} />
      )}

      {step === "reaction" && (
        <ReactionTimeQuick onComplete={handleReactionComplete} />
      )}

      {step === "nback" && (
        <NBackQuick onComplete={handleNBackComplete} />
      )}

      {step === "summary" && (
        <SummarySection
          evaluation={evaluation}
          stroop={stroopResult}
          rt={rtResult}
          nback={nbackResult}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

interface StepItemProps {
  index: number;
  activeStep: number;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  duration: string;
}

function StepItem({ index, activeStep, icon: Icon, label, duration }: StepItemProps) {
  const isDone = activeStep > index;
  const isActive = activeStep === index;

  return (
    <div className="flex items-center gap-3">
      <div
        className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold ${
          isDone
            ? "border-emerald-500 bg-emerald-500 text-white"
            : isActive
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-background text-foreground/60"
        }`}
      >
        {isDone ? <CheckCircle2 className="h-4 w-4" /> : index}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 text-xs sm:text-sm">
          <Icon className="h-3 w-3 text-primary" />
          <span className="font-medium">{label}</span>
        </div>
        <p className="mt-0.5 text-[11px] text-foreground/70 flex items-center gap-1">
          <Timer className="h-3 w-3" /> {duration}
        </p>
      </div>
    </div>
  );
}

interface SummarySectionProps {
  evaluation: QuickAuthEvaluation | null;
  stroop: StroopQuickResult | null;
  rt: ReactionTimeQuickResult | null;
  nback: NBackQuickResult | null;
  onRestart: () => void;
}

function SummarySection({ evaluation, stroop, rt, nback, onRestart }: SummarySectionProps) {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  const hasAll = evaluation && stroop && rt && nback;

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full ${
                evaluation?.isHuman ? "bg-emerald-500/10" : "bg-red-500/10"
              }`}
            >
              {evaluation?.isHuman ? (
                <Shield className="h-5 w-5 text-emerald-500" />
              ) : (
                <Shield className="h-5 w-5 text-red-500" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {evaluation?.isHuman
                  ? isFr
                    ? "Humain hautement probable"
                    : "Highly likely human"
                  : isFr
                  ? "Confiance insuffisante"
                  : "Insufficient confidence"}
              </h2>
              <p className="text-xs text-foreground/75">
                {isFr
                  ? "Score agrégé basé sur Stroop, temps de réaction et N-Back (mode rapide)."
                  : "Aggregated score based on quick Stroop, reaction time and N-Back."}
              </p>
            </div>
          </div>

          {evaluation && (
            <div className="text-right">
              <div className="text-sm text-foreground/70">
                {isFr ? "Confiance" : "Confidence"}
              </div>
              <div className="text-2xl font-bold">
                {Math.round(evaluation.confidence * 100)}%
              </div>
            </div>
          )}
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          title="Stroop"
          subtitle={isFr ? "Contrôle inhibiteur" : "Inhibitory control"}
          value={stroop?.score}
        />
        <MetricCard
          title={isFr ? "Temps de réaction" : "Reaction time"}
          subtitle={isFr ? "Vitesse de traitement" : "Processing speed"}
          value={rt?.score}
        />
        <MetricCard
          title="N-Back"
          subtitle={isFr ? "Mémoire de travail" : "Working memory"}
          value={nback?.score}
        />
      </div>

      <Card className="p-6 space-y-3">
        <p className="text-xs font-medium text-foreground/70 uppercase tracking-wide">
          {isFr ? "Token Quick Auth HCS-U7" : "HCS-U7 Quick Auth token"}
        </p>
        <div className="rounded-md bg-muted px-3 py-2 text-xs font-mono break-all">
          {hasAll ? evaluation!.token : isFr ? "Token indisponible (tests incomplets)." : "Token unavailable (tests incomplete)."}
        </div>
        <p className="text-[11px] text-foreground/70">
          {isFr
            ? "Les intégrations backend peuvent envoyer ce token à /api/verify-human avec la clé API HCS-U7 pour renforcer la protection des endpoints sensibles."
            : "Backend integrations can send this token to /api/verify-human together with the HCS-U7 API key to harden sensitive endpoints."}
        </p>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <Button variant="outline" onClick={onRestart} className="w-full sm:w-auto">
          {isFr ? "Rejouer Quick Auth" : "Run Quick Auth again"}
        </Button>
        <div className="flex flex-wrap gap-2 text-[11px] text-foreground/70">
          <span>
            {isFr
              ? "Pour une vérification maximale (≈5 minutes), utilisez la batterie complète via /cognitive-tests ou le générateur /generate."
              : "For maximum verification (~5 minutes), use the full battery via /cognitive-tests or the /generate flow."}
          </span>
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  title: string;
  subtitle: string;
  value: number | undefined | null;
}

function MetricCard({ title, subtitle, value }: MetricCardProps) {
  return (
    <Card className="p-4">
      <div className="space-y-1">
        <div className="text-xs font-medium text-foreground/70 uppercase tracking-wide">
          {title}
        </div>
        <div className="text-[11px] text-foreground/60">{subtitle}</div>
        <div className="mt-3 text-2xl font-semibold">
          {typeof value === "number" ? `${Math.round(value)} / 100` : "–"}
        </div>
      </div>
    </Card>
  );
}
