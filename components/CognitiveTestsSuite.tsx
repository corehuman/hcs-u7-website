"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Clock, 
  AlertCircle, 
  ChevronRight,
  FlaskConical,
  Monitor,
  Volume2,
  Zap,
  Info
} from "lucide-react";
import { StroopTest } from "./tests/StroopTest";
import { DigitSpanTest } from "./tests/DigitSpanTest";
import { useLanguage } from "@/components/LanguageProvider";

interface Test {
  id: string;
  name: string;
  nameFr: string;
  component: React.ComponentType<{ onComplete: (result: any) => void }>;
  duration: string;
  measures: string;
  measuresFr: string;
  description: string;
  descriptionFr: string;
}

const tests: Test[] = [
  {
    id: "stroop",
    name: "Stroop Task",
    nameFr: "Test de Stroop",
    component: StroopTest,
    duration: "3 min",
    measures: "Inhibitory control & selective attention",
    measuresFr: "Contrôle inhibiteur & attention sélective",
    description: "Name the color of the ink, not the word itself",
    descriptionFr: "Nommez la couleur de l'encre, pas le mot lui-même",
  },
  {
    id: "digit",
    name: "Digit Span",
    nameFr: "Empan de chiffres",
    component: DigitSpanTest,
    duration: "4 min",
    measures: "Short-term & working memory",
    measuresFr: "Mémoire à court terme & mémoire de travail",
    description: "Recall digit sequences that gradually increase in length",
    descriptionFr: "Retenez des séquences de chiffres qui s'allongent progressivement",
  },
];

interface CognitiveTestsSuiteProps {
  onComplete: (results: any) => void;
  onSkip: () => void;
}

export function CognitiveTestsSuite({ onComplete, onSkip }: CognitiveTestsSuiteProps) {
  const { lang } = useLanguage();
  const isFr = lang === "fr";
  const [currentTestIndex, setCurrentTestIndex] = useState(-1);
  const [results, setResults] = useState<Record<string, any>>({});

  const isIntro = currentTestIndex === -1;
  const isComplete = currentTestIndex >= tests.length;

  // Trigger parent callback once when all tests are complete
  useEffect(() => {
    if (isComplete) {
      onComplete(results);
    }
  }, [isComplete, results, onComplete]);

  if (isIntro) {
    return (
      <Card className="mx-auto max-w-3xl p-8">
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-primary/10 p-3">
              <FlaskConical className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-semibold">
                {isFr ? "Tests Neurocognitifs" : "Neurocognitive Tests"}
              </h2>
              <p className="text-sm text-foreground/85">
                {isFr
                  ? "Complétez 5 tests validés pour mesurer objectivement vos capacités cognitives"
                  : "Complete 5 validated tests to objectively measure your cognitive abilities"}
              </p>
            </div>
          </div>

          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {isFr
                ? "Optionnel mais recommandé : Ces tests fournissent des mesures objectives qui complètent vos réponses au questionnaire, augmentant la précision de ~25%."
                : "Optional but recommended: These tests provide objective measures that complement your self-reported questionnaire responses, increasing accuracy by ~25%."}
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            {tests.map((test, index) => (
              <div
                key={test.id}
                className="flex items-center gap-4 rounded-lg border bg-card/50 p-4"
              >
                <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                  {index + 1}
                </Badge>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {isFr ? test.nameFr : test.name}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {test.duration}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground/85">
                    {isFr ? test.measuresFr : test.measures}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Alert variant="default" className="border-primary/20 bg-primary/5">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>{isFr ? "À prévoir :" : "What to expect:"}</strong>
              <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
                <li>{isFr ? "Durée totale : ~17 minutes" : "Total duration: ~17 minutes"}</li>
                <li>{isFr ? "Tests à compléter en une session" : "Tests must be completed in one session"}</li>
                <li>{isFr ? "Environnement calme sans distractions" : "Use a quiet environment without distractions"}</li>
                <li>{isFr ? "Ordinateur recommandé (pas mobile)" : "Desktop/laptop recommended (not mobile)"}</li>
                <li>{isFr ? "Résultats disponibles immédiatement" : "Results are immediately available"}</li>
              </ul>
            </AlertDescription>
          </Alert>

          <div className="flex gap-4">
            <Button size="lg" onClick={() => setCurrentTestIndex(0)} className="flex-1">
              <Brain className="mr-2 h-4 w-4" />
              {isFr ? "Commencer les tests (~17 min)" : "Start Tests (~17 min)"}
            </Button>
            <Button size="lg" variant="outline" onClick={onSkip}>
              {isFr ? "Passer les tests" : "Skip Tests"}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (isComplete) {
    return null;
  }

  const currentTest = tests[currentTestIndex];
  const TestComponent = currentTest.component;

  return (
    <TestComponent
      onComplete={(result: any) => {
        const newResults = { ...results, [currentTest.id]: result };
        setResults(newResults);
        setCurrentTestIndex(currentTestIndex + 1);
      }}
    />
  );
}
