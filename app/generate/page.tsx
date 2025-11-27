"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import questionsJson from "@/data/questions.json";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { QuestionCard, type QuestionItem } from "@/components/QuestionCard";
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
    saveProfile(profile);
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
    <div className="mx-auto max-w-4xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            {isFr ? "Générateur de profil HCS-U7" : "HCS-U7 Profile Generator"}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {isFr
              ? "Questionnaire cognitif (24 questions)"
              : "Cognitive questionnaire (24 questions)"}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            {isFr
              ? "Répondez en fonction de votre manière naturelle de réfléchir et d'interagir. Il n'y a pas de bonne ou de mauvaise réponse : l'objectif est de capturer votre signature cognitive."
              : "Answer according to your natural way of thinking and interacting. There are no right or wrong answers: the goal is to capture your cognitive signature."}
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
    </div>
  );
}
