"use client";

import { useEffect, useMemo, useState } from "react";
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
import HCSCodeDisplay from "@/components/HCSCodeDisplay";
import type { RotatingHCSCode } from "@/lib/hcs-rotating-code";
import { loadProfile, clearProfile } from "@/lib/profile-storage";
import {
  generateChatGPTPrompt,
  generateClaudePrompt,
} from "@/lib/prompt-generator";
import { useLanguage } from "@/components/LanguageProvider";
import { getClientId } from "@/lib/client-id";

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
  const clientId = getClientId();
  const [rotatingCode, setRotatingCode] = useState<RotatingHCSCode | null>(null);

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

  useEffect(() => {
    if (!profile) return;

    const userId = clientId;

    const syncProfileAndCode = async () => {
      try {
        await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, profile }),
        });

        const response = await fetch("/api/issue-rotating-code", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) return;

        const data = (await response.json()) as {
          currentCode: string;
          currentWindow: number;
          expiresAt: number;
          rotationPeriod: number;
        };

        setRotatingCode({
          baseProfile: profile,
          currentCode: data.currentCode,
          currentWindow: data.currentWindow,
          expiresAt: data.expiresAt,
          rotationPeriod: data.rotationPeriod,
        });
      } catch (error) {
        console.error("[GenerateResultPage] Failed to sync profile / rotating code:", error);
      }
    };

    void syncProfileAndCode();
  }, [profile, clientId]);

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
              ? "Ce code est votre signature cognitive HCS-U7. Il sert à la fois de profil pour vos IA et de secret extrêmement difficile à deviner pour un bot ou une IA (voir la page Sécurité)."
              : "This code is your HCS-U7 cognitive signature. It acts both as a profile for AI systems and as a secret that is extremely hard for bots or AI to guess (see the Security page)."}
          </p>
        </div>

        <section className="space-y-4 rounded-2xl card-base p-6">
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

        {rotatingCode && (
          <section className="space-y-4 rounded-2xl card-base p-6">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {isFr
                ? "Code HCS-U7 rotatif (anti-replay)"
                : "Rotating HCS-U7 code (anti-replay)"}
            </h2>
            <p className="text-sm text-foreground/70">
              {isFr
                ? "Ce code ajoute une fenêtre temporelle (TW) de 10 minutes pour rendre les attaques par rejeu et la revente de codes beaucoup plus coûteuses."
                : "This code adds a 10-minute time window (TW) to make replay attacks and code resale economically unattractive."}
            </p>
            <HCSCodeDisplay
              rotatingCode={rotatingCode}
              onRefresh={async () => {
                const response = await fetch("/api/issue-rotating-code", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ userId: clientId }),
                });

                if (!response.ok) {
                  return rotatingCode;
                }

                const data = (await response.json()) as {
                  currentCode: string;
                  currentWindow: number;
                  expiresAt: number;
                  rotationPeriod: number;
                };

                const next: RotatingHCSCode = {
                  baseProfile: profile,
                  currentCode: data.currentCode,
                  currentWindow: data.currentWindow,
                  expiresAt: data.expiresAt,
                  rotationPeriod: data.rotationPeriod,
                };

                setRotatingCode(next);
                return next;
              }}
            />
          </section>
        )}

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
          <div className="space-y-3 rounded-2xl card-base p-4 text-sm">
            <h3 className="font-semibold text-foreground">
              {isFr ? "Profil cognitif (radar)" : "Cognitive profile (radar)"}
            </h3>
            <ProfileChart cognition={profile.cognition} />
          </div>
        </section>

        <section className="space-y-3 rounded-2xl card-base p-6">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {isFr
              ? "À quoi sert votre code HCS-U7 ?"
              : "What can you do with your HCS-U7 code?"}
          </h2>
          <p className="text-sm text-foreground/70">
            {isFr
              ? "Voici quelques usages concrets possibles de votre code :"
              : "Here are a few concrete ways you can use your code:"}
          </p>
          <ul className="list-disc space-y-1 pl-5 text-sm text-foreground/80">
            <li>
              {isFr
                ? "Renforcer l'authentification : l'utiliser côté serveur comme secret ou clé d'accès supplémentaire, très difficile à deviner pour des bots ou des scripts."
                : "Strengthen authentication: use it server-side as an additional secret or access key, extremely hard for bots or scripts to guess."}
            </li>
            <li>
              {isFr
                ? "Personnaliser vos IA : coller le code dans vos prompts (ChatGPT, Claude, etc.) pour adapter le style, le rythme et le niveau d'abstraction à votre profil cognitif."
                : "Personalize your AIs: paste the code into your prompts (ChatGPT, Claude, etc.) to adapt style, pacing and abstraction level to your cognitive profile."}
            </li>
            <li>
              {isFr
                ? "Gérer plusieurs contextes : générer plusieurs codes HCS-U7 (travail, apprentissage, création) et les utiliser selon le contexte."
                : "Manage multiple contexts: generate multiple HCS-U7 codes (work, learning, creativity) and use them depending on the context."}
            </li>
            <li>
              {isFr
                ? "Préparer des intégrations futures : lier ce code à des comptes ou services qui souhaitent un identifiant humain résistant aux bots."
                : "Prepare future integrations: link this code to accounts or services that want a human, bot-resistant identifier."}
            </li>
          </ul>
        </section>

        <section className="space-y-4 rounded-2xl card-base p-6">
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

        <section className="space-y-4 rounded-2xl card-base p-6">
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
