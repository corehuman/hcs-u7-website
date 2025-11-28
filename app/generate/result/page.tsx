"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { ProfileChart } from "@/components/ProfileChart";
import { CodeBlock } from "@/components/CodeBlock";
import type { HCSProfile } from "@/lib/hcs-generator";
import { loadProfile, clearProfile } from "@/lib/profile-storage";
import {
  generateChatGPTPrompt,
  generateClaudePrompt,
} from "@/lib/prompt-generator";
import { useLanguage } from "@/components/LanguageProvider";

function downloadTextFile(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function GenerateResultPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const isFr = lang === "fr";
  const profile = loadProfile();

  useEffect(() => {
    if (!profile) {
      router.replace("/generate");
    }
  }, [profile, router]);

  const chatGPTPrompt = useMemo(
    () => (profile ? generateChatGPTPrompt(profile) : ""),
    [profile],
  );
  const claudePrompt = useMemo(
    () => (profile ? generateClaudePrompt(profile) : ""),
    [profile],
  );

  if (!profile) {
    return (
      <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <p className="text-sm text-foreground/70">
          {isFr
            ? "Chargement de votre profil HCS-U7…"
            : "Loading your HCS-U7 profile…"}
        </p>
      </div>
    );
  }

  const { interpretation } = profile;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            {isFr ? "Résultat" : "Result"}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {isFr
              ? "Votre profil HCS-U7 est prêt"
              : "Your HCS-U7 profile is ready"}
          </h1>
          <p className="max-w-2xl text-sm text-foreground/70 sm:text-base">
            {isFr
              ? "Ce code représente votre signature cognitive. Conservez-le et réutilisez-le dans toutes vos interactions avec l'IA."
              : "This code encodes your cognitive signature. Keep it and reuse it in all your AI interactions."}
          </p>
        </div>

        <section className="space-y-4 rounded-2xl border bg-white/70 p-5 shadow-sm dark:bg-neutral-950/70">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/60">
                {isFr ? "Code HCS-U7" : "HCS-U7 code"}
              </p>
              <p className="break-all font-mono text-[11px] leading-relaxed text-foreground">
                {profile.code}
              </p>
            </div>
            <div className="flex gap-2 pt-2 sm:pt-0">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(profile.code)}
              >
                {isFr ? "Copier le code" : "Copy code"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => downloadTextFile("hcs-u7-profile.txt", profile.code)}
              >
                {isFr ? "Télécharger (.txt)" : "Download (.txt)"}
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {isFr ? "Interprétation du profil" : "Profile interpretation"}
            </h2>
            <div className="space-y-2 text-sm text-foreground/70">
              <p>
                <span className="font-medium text-foreground">
                  {isFr
                    ? "Style cognitif dominant : "
                    : "Dominant cognitive style: "}
                  {interpretation.elementLabel[isFr ? "fr" : "en"]}.
                </span>
              </p>
              <p>{interpretation.summary[isFr ? "fr" : "en"]}</p>
              <p>{interpretation.cognitionSummary[isFr ? "fr" : "en"]}</p>
              <p>{interpretation.interactionSummary[isFr ? "fr" : "en"]}</p>
            </div>
          </div>
          <div className="space-y-3 rounded-2xl border bg-white/70 p-4 text-sm shadow-sm dark:bg-neutral-950/70">
            <h3 className="font-semibold text-foreground">
              {isFr ? "Profil cognitif (radar)" : "Cognitive profile (radar)"}
            </h3>
            <ProfileChart cognition={profile.cognition} />
          </div>
        </section>

        <section className="space-y-4 rounded-2xl border bg-white/70 p-5 shadow-sm dark:bg-neutral-950/70">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {isFr ? "Utiliser votre profil" : "Use your profile"}
              </h2>
              <p className="text-sm text-foreground/70">
                {isFr
                  ? "Choisissez une intégration et copiez le prompt recommandé."
                  : "Select an integration and copy the recommended prompt."}
              </p>
            </div>
          </div>

          <Tabs defaultValue="chatgpt" className="mt-2 space-y-4">
            <TabsList className="grid w-full grid-cols-3 sm:max-w-md">
              <TabsTrigger value="chatgpt">ChatGPT</TabsTrigger>
              <TabsTrigger value="claude">Claude</TabsTrigger>
              <TabsTrigger value="api">API</TabsTrigger>
            </TabsList>

            <TabsContent value="chatgpt" className="space-y-3">
              <p className="text-sm text-foreground/70">
                {isFr
                  ? "1. Copiez ce prompt dans ChatGPT (en message système ou premier message)."
                  : "1. Copy this prompt into ChatGPT (as a system message or first message)."}
              </p>
              <CodeBlock code={chatGPTPrompt} language="markdown" />
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(chatGPTPrompt)}
                >
                  {isFr ? "Copier le prompt ChatGPT" : "Copy ChatGPT prompt"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    downloadTextFile("hcs-u7-chatgpt-prompt.txt", chatGPTPrompt)
                  }
                >
                  {isFr ? "Télécharger le prompt (.txt)" : "Download prompt (.txt)"}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="claude" className="space-y-3">
              <p className="text-sm text-foreground/70">
                {isFr
                  ? "Utilisez ce texte comme instruction système persistante pour Claude."
                  : "Use this text as a persistent system instruction for Claude."}
              </p>
              <CodeBlock code={claudePrompt} language="markdown" />
              <Button
                type="button"
                size="sm"
                onClick={() => navigator.clipboard.writeText(claudePrompt)}
              >
                {isFr ? "Copier le prompt Claude" : "Copy Claude prompt"}
              </Button>
            </TabsContent>

            <TabsContent value="api" className="space-y-4">
              <p className="text-sm text-foreground/70">
                {isFr
                  ? "Exemple d'intégration côté serveur avec le point de terminaison "
                  : "Example of a server-side integration with the endpoint "}
                <code className="mx-1 rounded bg-muted px-1 py-0.5 text-xs">
                  /api/generate-prompt
                </code>
                .
              </p>
              <CodeBlock
                language="ts"
                code={`// TypeScript / Next.js route example
const res = await fetch("/api/generate-prompt", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ profile: ${"JSON.stringify(profile.code)"} }),
});
const data = await res.json();
console.log(data.chatgptPrompt);
`}
              />
            </TabsContent>
          </Tabs>
        </section>

        <section className="space-y-4 rounded-2xl border bg-white/70 p-5 shadow-sm dark:bg-neutral-950/70">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {isFr ? "Enregistrer votre profil" : "Save your profile"}
          </h2>
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <div className="space-y-2">
              <p className="text-sm text-foreground/70">
                {isFr
                  ? "Vous pouvez stocker ce code où vous le souhaitez (gestionnaire de mots de passe, notes, outil de documentation). À l'avenir, un espace compte vous permettra de gérer plusieurs profils."
                  : "You can store this code wherever you want (password manager, notes, documentation tool). In the future, an account space will allow you to manage multiple profiles."}
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  type="email"
                  placeholder={
                    isFr
                      ? "Votre email (optionnel, non utilisé côté serveur)"
                      : "Your email (optional, not used server-side)"
                  }
                  className="sm:max-w-xs"
                  aria-label={
                    isFr
                      ? "Email pour enregistrer votre profil"
                      : "Email to save your profile"
                  }
                />
                <Button type="button" variant="outline">
                  {isFr ? "Simuler l'envoi du profil" : "Simulate profile send"}
                </Button>
              </div>
            </div>
            <div className="space-y-3 rounded-xl bg-muted p-4 text-sm text-foreground/70">
              <p className="font-medium text-foreground">
                {isFr ? "Repasser le test" : "Retake the test"}
              </p>
              <p>
                {isFr
                  ? "Si vous sentez que vos préférences ont changé ou si vous voulez tester un autre contexte d'usage, vous pouvez repasser le questionnaire."
                  : "If you feel that your preferences have changed or if you want to test another usage context, you can retake the questionnaire."}
              </p>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  clearProfile();
                  router.push("/generate");
                }}
              >
                {isFr ? "Relancer le questionnaire" : "Restart questionnaire"}
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
