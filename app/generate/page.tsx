"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, FlaskConical, Brain, FileText } from "lucide-react";

import questionsJson from "@/data/questions.json";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuestionCard, type QuestionItem } from "@/components/QuestionCard";
import { CognitiveTestsSuite } from "@/components/CognitiveTestsSuite";
import {
  calculateHCSProfile,
  type HCSAnswer,
  type HCSOptionScoring,
} from "@/lib/hcs-generator";
import { saveProfile } from "@/lib/profile-storage";
import { useLanguage } from "@/components/LanguageProvider";

const questions = questionsJson as QuestionItem[];
const TOTAL_QUESTIONS = questions.length;

const formSchema = z
  .object({
    answers: z
      .array(z.number().int().min(-1).max(3))
      .length(TOTAL_QUESTIONS),
  })
  .refine(
    (value) => value.answers.every((answer) => answer >= 0),
    {
      message: "Please answer all questions before submitting.",
      path: ["answers"],
    },
  );

type FormValues = z.infer<typeof formSchema>;

export default function GeneratePage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const isFr = lang === "fr";
  const [activeTab, setActiveTab] = useState("questionnaire");
  const [questionnaireProfile, setQuestionnaireProfile] = useState<any>(null);
  const [cognitiveTestResults, setCognitiveTestResults] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localError, setLocalError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: Array(TOTAL_QUESTIONS).fill(-1),
    },
    mode: "onSubmit",
  });

  const answers = form.watch("answers");

  function goToQuestion(index: number) {
    setCurrentIndex(Math.min(Math.max(index, 0), TOTAL_QUESTIONS - 1));
  }

  function handleNext() {
    const currentAnswer = form.getValues("answers")[currentIndex];
    if (currentAnswer < 0) {
      setLocalError(
        isFr
          ? "Merci de choisir une option pour continuer."
          : "Please choose an option to continue.",
      );
      return;
    }
    setLocalError(null);

    if (currentIndex < TOTAL_QUESTIONS - 1) {
      goToQuestion(currentIndex + 1);
      return;
    }

    void form.handleSubmit(onSubmit)();
  }

  function handlePrevious() {
    if (currentIndex > 0) {
      goToQuestion(currentIndex - 1);
    }
  }

  function onSubmit(values: FormValues) {
    const hcsAnswers: HCSAnswer[] = values.answers.map((answerIndex, idx) => {
      const question = questions[idx];
      const option = question.options[answerIndex];
      const scoring = option.scoring as HCSOptionScoring;
      return {
        questionId: question.id,
        scoring,
      };
    });

    const profile = calculateHCSProfile(hcsAnswers);
    setQuestionnaireProfile(profile);
    setActiveTab("tests"); // Move to cognitive tests tab
  }

  function handleTestsComplete(results: any) {
    setCognitiveTestResults(results);
    setActiveTab("result");
  }

  function handleSkipTests() {
    setActiveTab("result");
  }

  function finalizeProfile() {
    const finalProfile = cognitiveTestResults
      ? { ...questionnaireProfile, cognitiveTests: cognitiveTestResults }
      : questionnaireProfile;
    saveProfile(finalProfile);
    router.push("/generate/result");
  }

  const globalError = form.formState.errors.answers?.message;

  const progressValue = ((currentIndex + 1) / TOTAL_QUESTIONS) * 100;
  const currentQuestion = questions[currentIndex];
  const currentValue = answers?.[currentIndex] ?? -1;
  const displayedGlobalError = form.formState.errors.answers?.message
    ? isFr
      ? "Merci de répondre à toutes les questions avant de valider."
      : form.formState.errors.answers.message
    : null;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-4">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {isFr ? "Générateur de Profil Cognitif" : "Generate Your Cognitive Profile"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isFr
              ? "Complétez l'évaluation en deux étapes pour une précision maximale"
              : "Complete the assessment in two stages for maximum accuracy"}
          </p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="questionnaire" className="gap-2">
            <FileText className="h-4 w-4" />
            {isFr ? "1. Questionnaire" : "1. Questionnaire"}
          </TabsTrigger>
          <TabsTrigger 
            value="tests" 
            disabled={!questionnaireProfile}
            className="gap-2"
          >
            <FlaskConical className="h-4 w-4" />
            {isFr ? "2. Tests Cognitifs" : "2. Cognitive Tests"}
            {!questionnaireProfile && (
              <Badge variant="secondary" className="ml-1">
                {isFr ? "Verrouillé" : "Locked"}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="result" 
            disabled={!questionnaireProfile}
            className="gap-2"
          >
            <CheckCircle2 className="h-4 w-4" />
            {isFr ? "3. Votre Profil" : "3. Your Profile"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="questionnaire" className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">
                  {isFr ? "Questionnaire Psychométrique" : "Psychometric Questionnaire"}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {isFr
                  ? "24 questions basées sur des modèles de personnalité établis (Big Five, HEXACO)"
                  : "24 questions based on established personality models (Big Five, HEXACO)"}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {isFr ? "Progression" : "Progress"}: {currentIndex + 1} / {TOTAL_QUESTIONS} questions
                </span>
                <span>{Math.round(progressValue)}%</span>
              </div>
              <Progress
                value={progressValue}
                aria-label={
                  isFr ? "Progression du questionnaire" : "Questionnaire progress"
                }
              />
            </div>
          </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8"
        noValidate
      >
        <QuestionCard
          question={currentQuestion}
          index={currentIndex}
          total={TOTAL_QUESTIONS}
          value={currentValue}
          onChange={(optionIndex) => {
            form.setValue(`answers.${currentIndex}`, optionIndex, {
              shouldDirty: true,
            });
            setLocalError(null);
          }}
          error={localError ?? undefined}
        />

        {displayedGlobalError ? (
          <p className="text-sm font-medium text-destructive" role="alert">
            {displayedGlobalError}
          </p>
        ) : null}

        <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              {isFr ? "Catégorie" : "Category"}: {" "}
              <span className="font-medium">{currentQuestion.category}</span>
            </span>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              {isFr ? "Précédent" : "Previous"}
            </Button>
            <Button type="button" onClick={handleNext}>
              {currentIndex === TOTAL_QUESTIONS - 1
                ? isFr
                  ? "Valider mon profil"
                  : "Submit my profile"
                : isFr
                  ? "Suivant"
                  : "Next"}
            </Button>
          </div>
        </div>
      </form>
        </TabsContent>

        <TabsContent value="tests" className="space-y-6">
          {questionnaireProfile ? (
            <CognitiveTestsSuite
              onComplete={handleTestsComplete}
              onSkip={handleSkipTests}
            />
          ) : (
            <Alert>
              <AlertDescription>
                {isFr
                  ? "Veuillez d'abord compléter le questionnaire."
                  : "Please complete the questionnaire first."}
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>

        <TabsContent value="result" className="space-y-6">
          {questionnaireProfile ? (
            <div className="space-y-6">
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  {isFr
                    ? "Profil prêt ! Cliquez ci-dessous pour finaliser et voir votre code HCS-U7."
                    : "Profile ready! Click below to finalize and see your HCS-U7 code."}
                </AlertDescription>
              </Alert>
              {cognitiveTestResults && (
                <Alert>
                  <FlaskConical className="h-4 w-4" />
                  <AlertDescription>
                    {isFr
                      ? "Tests cognitifs complétés. Votre profil inclut des mesures objectives."
                      : "Cognitive tests completed. Your profile includes objective measures."}
                  </AlertDescription>
                </Alert>
              )}
              <Button onClick={finalizeProfile} size="lg" className="w-full">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {isFr ? "Voir mon profil HCS-U7" : "View My HCS-U7 Profile"}
              </Button>
            </div>
          ) : (
            <Alert>
              <AlertDescription>
                {isFr
                  ? "Veuillez d'abord compléter le questionnaire."
                  : "Please complete the questionnaire first."}
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
