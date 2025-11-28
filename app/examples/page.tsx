"use client";

import examplesJson from "@/data/examples.json";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ProfileChart } from "@/components/ProfileChart";
import { CodeBlock } from "@/components/CodeBlock";
import type { CognitionScores } from "@/lib/hcs-generator";

interface ExampleProfile {
  id: string;
  name: { fr: string; en: string };
  code: string;
  description: { fr: string; en: string };
  goodFor: { fr: string[]; en: string[] };
  dialogue: {
    before: { user: string; ai: string };
    after: { user: string; ai: string };
  };
}

const examples = examplesJson as ExampleProfile[];

function extractCognitionFromCode(code: string): CognitionScores | null {
  const match = /COG:F(\d+)C(\d+)V(\d+)S(\d+)Cr(\d+)/.exec(code);
  if (!match) return null;
  const [, f, c, v, s, cr] = match;
  return {
    form: Number(f),
    logic: Number(c),
    visual: Number(v),
    synthesis: Number(s),
    creativity: Number(cr),
  };
}

export default function ExamplesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          Example profiles
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          HCS-U7 profile examples
        </h1>
        <p className="max-w-2xl text-sm text-foreground/85 sm:text-base">
          A few archetypes illustrating how HCS-U7 impacts the response style of
          AI assistants. Each card opens a detailed before/after example once
          the profile is activated.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {examples.map((example) => {
          const cognition = extractCognitionFromCode(example.code);

          return (
            <Dialog key={example.id}>
              <DialogTrigger asChild>
                <button className="h-full w-full text-left">
                  <div className="flex h-full flex-col gap-3 rounded-2xl border bg-card/98 backdrop-blur-sm p-4 text-sm shadow-sm transition hover:border-primary/60 hover:bg-card">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-foreground/85">
                        Profile archetype
                      </p>
                      <h2 className="text-base font-semibold text-foreground">
                        {example.name.en}
                      </h2>
                    </div>
                    <p className="flex-1 text-xs text-foreground/85 sm:text-sm">
                      {example.description.en}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {example.goodFor.en.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-[11px]">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>{example.name.en}</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 text-sm text-foreground/85">
                  <section className="space-y-2">
                    <h3 className="text-sm font-semibold text-foreground">
                      Full HCS code
                    </h3>
                    <CodeBlock code={example.code} language="text" />
                  </section>

                  {cognition && (
                    <section className="space-y-2">
                      <h3 className="text-sm font-semibold text-foreground">
                        Cognitive profile (radar)
                      </h3>
                      <ProfileChart cognition={cognition} />
                    </section>
                  )}

                  <section className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 rounded-xl bg-muted p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-foreground/80">
                        Before HCS-U7
                      </p>
                      <p className="text-xs text-foreground">User:</p>
                      <p className="text-xs">{example.dialogue.before.user}</p>
                      <p className="mt-1 text-xs text-foreground">AI:</p>
                      <p className="text-xs whitespace-pre-line">
                        {example.dialogue.before.ai}
                      </p>
                    </div>
                    <div className="space-y-2 rounded-xl bg-primary/5 p-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        After HCS-U7
                      </p>
                      <p className="text-xs text-foreground">User:</p>
                      <p className="text-xs">{example.dialogue.after.user}</p>
                      <p className="mt-1 text-xs text-foreground">AI:</p>
                      <p className="text-xs whitespace-pre-line">
                        {example.dialogue.after.ai}
                      </p>
                    </div>
                  </section>

                  <section className="space-y-1">
                    <h3 className="text-sm font-semibold text-foreground">
                      Recommended prompt (approach)
                    </h3>
                    <p className="text-xs text-foreground/85">
                      Use the HCS-U7 generator to produce a full prompt adapted
                      to this profile, then paste it into your favourite AI
                      assistants (ChatGPT, Claude, etc.).
                    </p>
                  </section>
                </div>
              </DialogContent>
            </Dialog>
          );
        })}
      </div>
    </div>
  );
}
