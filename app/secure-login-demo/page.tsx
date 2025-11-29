"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck, ShieldX, AlertCircle, Lock, KeyRound } from "lucide-react";

const STORAGE_KEY = "hcs-u7-dev-api-key";

type Status =
  | "idle"
  | "widgetReady"
  | "submitting"
  | "success"
  | "blocked"
  | "missingKey"
  | "error";

function buildDemoToken() {
  return "HUMAN_TOKEN_" + Math.random().toString(36).slice(2, 10);
}

export default function SecureLoginDemoPage() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hcsToken, setHcsToken] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [confidence, setConfidence] = useState<string | null>(null);

  const handleSolveWidget = () => {
    setHcsToken(buildDemoToken());
    setStatus("widgetReady");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setConfidence(null);

    if (!hcsToken) {
      setStatus("idle");
      return;
    }

    const apiKey =
      typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;

    if (!apiKey) {
      setStatus("missingKey");
      return;
    }

    setStatus("submitting");

    try {
      const response = await fetch("/api/secure-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hcs-token": hcsToken,
          "x-hcs-api-key": apiKey,
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json().catch(() => ({}));
      const conf =
        (data?.hcs?.confidence as string | undefined) ??
        (data?.details?.confidence as string | undefined) ??
        (data?.confidence as string | undefined) ??
        null;

      setConfidence(conf);

      if (response.ok) {
        setStatus("success");
      } else if (response.status === 403) {
        setStatus("blocked");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-primary/80">
          {isFr ? "Démonstration" : "Demonstration"}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {isFr ? "Login bancaire protégé par HCS-U7" : "Bank login protected by HCS-U7"}
        </h1>
        <p className="max-w-2xl text-sm text-foreground/85 sm:text-base">
          {isFr
            ? "Cette page simule un formulaire de connexion bancaire où chaque tentative passe par le pare-feu cognitif HCS-U7 avant d'être acceptée."
            : "This page simulates a banking login form where each attempt goes through the HCS-U7 cognitive firewall before being accepted."}
        </p>
      </div>

      <Card className="border-primary/20 bg-card/95">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-4 w-4 text-primary" />
            {isFr ? "1. Défi HCS-U7 (widget)" : "1. HCS-U7 challenge (widget)"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-foreground/90">
          <p>
            {isFr
              ? "Dans un environnement bancaire réel, le client résout un défi cognitif HCS-U7. Ici, nous simulons ce widget en générant un jeton humain de démo."
              : "In a real banking environment, the customer solves an HCS-U7 cognitive challenge. Here we simulate this widget by generating a demo human token."}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" onClick={handleSolveWidget}>
              <Lock className="mr-2 h-4 w-4" />
              {isFr ? "Je suis humain (simuler le widget)" : "I'm human (simulate widget)"}
            </Button>
            {hcsToken && (
              <p className="font-mono text-xs text-foreground/70">
                hcsToken = {hcsToken.slice(0, 18)}...
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-card/95">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Lock className="h-4 w-4 text-primary" />
            {isFr ? "2. Formulaire de connexion sécurisé" : "2. Secure login form"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-foreground/90">
          <p>
            {isFr
              ? "Le formulaire est protégé par le middleware HCS-U7. Sans jeton HCS-U7 et clé API valides, la route /api/secure-login renverra une erreur."
              : "The form is protected by the HCS-U7 middleware. Without a valid HCS-U7 token and API key, the /api/secure-login route will return an error."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground/80">
                {isFr ? "Identifiant (IBAN ou e-mail)" : "Identifier (IBAN or email)"}
              </label>
              <Input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={!hcsToken || status === "submitting"}
                className="text-sm"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-foreground/80">
                {isFr ? "Mot de passe" : "Password"}
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={!hcsToken || status === "submitting"}
                className="text-sm"
              />
            </div>

            <Button
              type="submit"
              disabled={!hcsToken || status === "submitting"}
              className="inline-flex items-center gap-2"
            >
              {status === "submitting" ? (
                <>
                  <ShieldCheck className="h-4 w-4 animate-pulse" />
                  {isFr ? "Vérification en cours..." : "Verifying..."}
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" />
                  {isFr ? "Se connecter (protégé par HCS-U7)" : "Log in (HCS-U7 protected)"}
                </>
              )}
            </Button>
          </form>

          <p className="flex items-center gap-2 text-xs text-foreground/70">
            <KeyRound className="h-3 w-3" />
            {isFr ? (
              <>
                Clé utilisée : clé de développement stockée sur la page{" "}
                <Link href="/developers/api-key" className="underline underline-offset-2">
                  /developers/api-key
                </Link>
                .
              </>
            ) : (
              <>
                Key used: development key stored on the{" "}
                <Link href="/developers/api-key" className="underline underline-offset-2">
                  /developers/api-key
                </Link>
                {" "}
                page.
              </>
            )}
          </p>

          {status === "missingKey" && (
            <Alert className="mt-2" variant="default">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs sm:text-sm">
                {isFr ? (
                  <>
                    Aucune clé API trouvée. Générez-en une sur la page{" "}
                    <Link href="/developers/api-key" className="underline underline-offset-2">
                      /developers/api-key
                    </Link>
                    , puis réessayez.
                  </>
                ) : (
                  <>
                    No API key found. Generate one on the{" "}
                    <Link href="/developers/api-key" className="underline underline-offset-2">
                      /developers/api-key
                    </Link>
                    , then try again.
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          {status === "success" && (
            <Alert className="mt-2" variant="default">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <AlertDescription className="text-xs sm:text-sm">
                {isFr
                  ? `Connexion acceptée par le pare-feu HCS-U7. Confiance: ${confidence ?? "n/a"}.`
                  : `Login allowed by the HCS-U7 firewall. Confidence: ${confidence ?? "n/a"}.`}
              </AlertDescription>
            </Alert>
          )}

          {status === "blocked" && (
            <Alert className="mt-2" variant="destructive">
              <ShieldX className="h-4 w-4" />
              <AlertDescription className="text-xs sm:text-sm">
                {isFr
                  ? `Connexion bloquée par le pare-feu HCS-U7. Confiance: ${confidence ?? "n/a"}.`
                  : `Login blocked by the HCS-U7 firewall. Confidence: ${confidence ?? "n/a"}.`}
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert className="mt-2" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs sm:text-sm">
                {isFr
                  ? "Erreur lors de l'appel de /api/secure-login. Vérifiez que le serveur de développement est lancé."
                  : "Error while calling /api/secure-login. Make sure the dev server is running."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
