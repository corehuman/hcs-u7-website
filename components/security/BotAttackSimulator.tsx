"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/LanguageProvider";
import { Bot, ShieldAlert } from "lucide-react";

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generateFakeCode(length: number): string {
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000_000) {
    return (n / 1_000_000_000).toFixed(1) + "B";
  }
  if (n >= 1_000_000) {
    return (n / 1_000_000).toFixed(1) + "M";
  }
  if (n >= 1_000) {
    return (n / 1_000).toFixed(1) + "k";
  }
  return n.toString();
}

export function BotAttackSimulator() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  const [running, setRunning] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [logLines, setLogLines] = useState<string[]>([]);

  useEffect(() => {
    if (!running) return;

    const interval = setInterval(() => {
      setAttempts((prev) => prev + 50_000); // 500k essais / s (100ms * 50k)
      setElapsedSeconds((prev) => prev + 0.1);

      const fake = `HCS-${generateFakeCode(4)}-${generateFakeCode(4)}-${generateFakeCode(4)}-${generateFakeCode(4)}`;
      setLogLines((prev) => {
        const next = [`[bot] try ${fake} → FAIL`, ...prev];
        return next.slice(0, 5);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [running]);

  const attemptsPerSecondApprox = 500_000;

  const secondsPerYear = 31_536_000; // 365 jours
  const estimatedKeyspaceExp = 40; // ~10^40 codes possibles
  const log10AttemptsPerYear = Math.log10(attemptsPerSecondApprox * secondsPerYear);
  const yearsExp = Math.max(0, estimatedKeyspaceExp - log10AttemptsPerYear);

  const yearsExpRounded = Math.round(yearsExp);

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="space-y-6 rounded-2xl card-base p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-foreground/70">
                <Bot className="h-4 w-4 text-red-500" />
                <span>
                  {isFr ? "Simulateur d'attaque par bot" : "Bot attack simulator"}
                </span>
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-foreground">
                {isFr
                  ? "Brute force sur un code HCS-U7 (démonstration)"
                  : "Brute forcing an HCS-U7 code (demo)"}
              </h2>
              <p className="text-sm text-foreground/70 max-w-2xl">
                {isFr
                  ? "Ce simulateur montre à quelle vitesse un bot peut tester des codes… et à quel point l'espace de recherche reste gigantesque. Même en attaquant en continu, la probabilité de trouver un code HCS valide reste virtuellement nulle."
                  : "This simulator shows how fast a bot can try codes… and how huge the search space remains. Even attacking continuously, the probability of guessing a valid HCS code stays essentially zero."}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2 text-right text-xs text-foreground/70">
              <span>
                {isFr
                  ? "Espace de recherche estimé : ≈ 10^40 codes possibles"
                  : "Estimated search space: ≈ 10^40 possible codes"}
              </span>
              <span>
                {isFr
                  ? "Même à 500k essais/s : &gt; 10^" + yearsExpRounded + " années pour tout parcourir"
                  : "Even at 500k guesses/s: &gt; 10^" + yearsExpRounded + " years to exhaust the space"}
              </span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1 text-sm">
                  <p className="text-foreground/70">
                    {isFr
                      ? "Attaque en temps réel (front-end uniquement, sans vrai accès au code)."
                      : "Real-time attack (front-end only, no real access to the code)."}
                  </p>
                  <p className="text-xs text-foreground/60">
                    {isFr
                      ? "Objectif : illustrer la difficulté pour un bot/IA de deviner un code HCS généré par des tests humains."
                      : "Goal: illustrate how hard it is for a bot/AI to guess an HCS code generated from human tests."}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    setRunning((prev) => !prev);
                    if (!running) {
                      setAttempts(0);
                      setElapsedSeconds(0);
                      setLogLines([]);
                    }
                  }}
                >
                  {running
                    ? isFr
                      ? "Arrêter l'attaque"
                      : "Stop attack"
                    : isFr
                    ? "Lancer l'attaque bot"
                    : "Start bot attack"}
                </Button>
              </div>

              <div className="rounded-xl bg-black/80 p-4 font-mono text-xs text-green-400 border border-green-500/40 shadow-inner">
                <div className="mb-2 flex items-center justify-between text-[11px] text-green-300/80">
                  <span>&gt; bot_hcs_u7 --mode brute-force</span>
                  <span>
                    {isFr ? "status : échec garanti" : "status: guaranteed failure"}
                  </span>
                </div>
                <div className="h-24 space-y-1 overflow-hidden">
                  {logLines.length === 0 ? (
                    <p className="text-green-500/80">
                      {isFr
                        ? "[bot] en attente… cliquez sur \"Lancer l'attaque bot\""
                        : "[bot] idle… click \"Start bot attack\""}
                    </p>
                  ) : (
                    logLines.map((line, idx) => (
                      <p
                        key={idx}
                        className={idx === 0 ? "text-green-200" : "text-green-500/80"}
                      >
                        {line}
                      </p>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4 rounded-xl bg-muted/60 p-4 text-sm">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-amber-500" />
                <p className="font-semibold">
                  {isFr
                    ? "Pourquoi les bots échouent ici ?"
                    : "Why do bots fail here?"}
                </p>
              </div>

              <dl className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-foreground/70">
                    {isFr ? "Tentatives simulées" : "Simulated attempts"}
                  </dt>
                  <dd className="font-mono text-foreground">
                    {formatNumber(attempts)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-foreground/70">
                    {isFr
                      ? "Vitesse approximative"
                      : "Approx. speed"}
                  </dt>
                  <dd className="font-mono text-foreground">
                    {formatNumber(attemptsPerSecondApprox)} {isFr ? "/s" : "/s"}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-foreground/70">
                    {isFr
                      ? "Temps écoulé (simulé)"
                      : "Elapsed time (simulated)"}
                  </dt>
                  <dd className="font-mono text-foreground">
                    {elapsedSeconds.toFixed(1)}s
                  </dd>
                </div>
              </dl>

              <p className="text-xs text-foreground/70">
                {isFr
                  ? "Un code HCS réel est généré à partir de véritables performances humaines aux tests cognitifs. Le bot ici n'a accès à rien de tout cela : il ne fait que deviner dans un espace astronomique."
                  : "A real HCS code is generated from actual human performance on cognitive tests. The bot here has access to none of that: it only guesses blindly in an astronomical search space."}
              </p>

              <p className="text-[11px] text-foreground/60">
                {isFr
                  ? "Démonstration pédagogique : ce simulateur ne représente pas un algorithme cryptographique complet, mais illustre l'ordre de grandeur du problème pour un bot/IA."
                  : "Educational demo: this simulator is not a full cryptographic algorithm, but illustrates the order of magnitude of the problem for a bot/AI."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
