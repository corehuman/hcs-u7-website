"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";

interface QuestionOption {
  text: {
    fr: string;
    en: string;
  };
  scoring: unknown;
}

export interface QuestionItem {
  id: number;
  category: string;
  question: {
    fr: string;
    en: string;
  };
  options: QuestionOption[];
}

interface QuestionCardProps {
  question: QuestionItem;
  index: number;
  total: number;
  value: number | null;
  onChange: (optionIndex: number) => void;
  error?: string;
}

export function QuestionCard({
  question,
  index,
  total,
  value,
  onChange,
  error,
}: QuestionCardProps) {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  return (
    <section aria-labelledby={`question-${question.id}`} className="space-y-4">
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          Question {index + 1} / {total}
        </p>
        <h2
          id={`question-${question.id}`}
          className="text-lg font-semibold tracking-tight text-foreground sm:text-xl"
        >
          {isFr ? question.question.fr : question.question.en}
        </h2>
        <p className="text-xs text-muted-foreground">
          {isFr
            ? "Cette question contribue à votre profil cognitif HCS-U7."
            : "This question contributes to your HCS-U7 cognitive profile."}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {question.options.map((option, optionIndex) => {
          const selected = value === optionIndex;
          return (
            <button
              key={optionIndex}
              type="button"
              onClick={() => onChange(optionIndex)}
              className={cn(
                "text-left",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              )}
            >
              <Card
                className={cn(
                  "h-full cursor-pointer border transition-colors",
                  selected
                    ? "border-primary bg-primary/5"
                    : "hover:border-primary/60 hover:bg-muted/60",
                )}
              >
                <div className="flex items-start gap-3 p-3 sm:p-4">
                  <span
                    className={cn(
                      "mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full border text-[10px]",
                      selected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/40 text-muted-foreground",
                    )}
                    aria-hidden="true"
                  >
                    {selected ? "●" : ""}
                  </span>
                  <p className="text-sm leading-snug text-foreground">
                    {isFr ? option.text.fr : option.text.en}
                  </p>
                </div>
              </Card>
            </button>
          );
        })}
      </div>

      {error ? (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
