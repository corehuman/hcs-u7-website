"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck, ShieldX, AlertCircle, Loader2, KeyRound } from "lucide-react";

const DEV_STORAGE_KEY = "hcs-u7-dev-api-key";

type Status = "idle" | "loading" | "success" | "blocked" | "missingKey" | "error";

interface ProtectionResult {
  confidence?: string;
  raw?: unknown;
}

function buildDemoToken() {
  return "HUMAN_TOKEN_" + Math.random().toString(36).slice(2, 10);
}

export function ProtectionTester() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<ProtectionResult | null>(null);

  const handleTest = async () => {
    setResult(null);

    const apiKey =
      typeof window !== "undefined" ? window.localStorage.getItem(DEV_STORAGE_KEY) : null;

    if (!apiKey) {
      setStatus("missingKey");
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/protected-demo", {
        method: "GET",
        headers: {
          "x-hcs-token": buildDemoToken(),
          "x-hcs-api-key": apiKey,
        },
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        const confidence =
          (data?.hcs?.confidence as string | undefined) ?? (data?.confidence as string | undefined);
        setResult({ confidence, raw: data });
        setStatus("success");
        return;
      }

      if (response.status === 403) {
        const confidence =
          (data?.details?.confidence as string | undefined) ?? (data?.confidence as string | undefined);
        setResult({ confidence, raw: data });
        setStatus("blocked");
        return;
      }

      setResult({ raw: data });
      setStatus("error");
    } catch (error) {
      setResult({ raw: String(error) });
      setStatus("error");
    }
  };

  const label = isFr ? "Tester la protection HCS-U7" : "Test HCS-U7 protection";

  return (
    <section className="mx-auto mb-10 mt-6 w-full max-w-4xl px-4 sm:px-6 lg:px-8">
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-4 w-4 text-primary" />
            {isFr ? "Pare-feu cognitif en action" : "Cognitive firewall in action"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-foreground/90">
          <p>
            {isFr
              ? "Ce bouton envoie une requête vers une route API protégée par le middleware HCS-U7. Sans jeton humain valide et clé API, l'accès est bloqué."
              : "This button sends a request to an API route protected by the HCS-U7 middleware. Without a valid human token and API key, access is blocked."}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" onClick={handleTest} disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isFr ? "Test en cours..." : "Testing..."}
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  {label}
                </>
              )}
            </Button>

            <p className="flex items-center gap-2 text-xs text-foreground/70">
              <KeyRound className="h-3 w-3" />
              {isFr
                ? "Utilise la clé stockée sur /developers/api-key (localStorage)."
                : "Uses the key stored on /developers/api-key (localStorage)."}
            </p>
          </div>

          {status === "missingKey" && (
            <Alert className="mt-2" variant="default">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs sm:text-sm">
                {isFr
                  ? "Aucune clé API trouvée. Générez-en une sur la page /developers/api-key, puis relancez le test."
                  : "No API key found. Generate one on the /developers/api-key page, then run the test again."}
              </AlertDescription>
            </Alert>
          )}

          {status === "success" && (
            <Alert className="mt-2" variant="default">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <AlertDescription className="text-xs sm:text-sm">
                {isFr
                  ? `Requête acceptée par le pare-feu HCS-U7. Confiance: ${
                      result?.confidence ?? "n/a"
                    }.`
                  : `Request allowed by the HCS-U7 firewall. Confidence: ${
                      result?.confidence ?? "n/a"
                    }.`}
              </AlertDescription>
            </Alert>
          )}

          {status === "blocked" && (
            <Alert className="mt-2" variant="destructive">
              <ShieldX className="h-4 w-4" />
              <AlertDescription className="text-xs sm:text-sm">
                {isFr
                  ? `Requête bloquée par le pare-feu HCS-U7. Confiance: ${
                      result?.confidence ?? "n/a"
                    }.`
                  : `Request blocked by the HCS-U7 firewall. Confidence: ${
                      result?.confidence ?? "n/a"
                    }.`}
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert className="mt-2" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs sm:text-sm">
                {isFr
                  ? "Erreur lors de l'appel de la route protégée. Vérifiez que le serveur de développement est lancé."
                  : "Error while calling the protected route. Make sure the dev server is running."}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
