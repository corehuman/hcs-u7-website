"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ShieldCheck, ShieldX, AlertCircle, Loader2, KeyRound } from "lucide-react";
import { getClientId } from "@/lib/client-id";

 type Status =
  | "idle"
  | "loading"
  | "success"
  | "blocked"
  | "error";

interface VerifyResponse {
  isHuman?: boolean;
  confidence?: number;
  reason?: string;
  rotation?: {
    codeAgeMinutes?: number;
    windowDiff?: number;
  };
  error?: string;
}

export function RotatingCodeTester() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  const [code, setCode] = useState("");
  const [userId, setUserId] = useState<string>(() => getClientId());
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<VerifyResponse | null>(null);

  const handleVerify = async () => {
    setResult(null);

    if (!code.trim()) {
      setStatus("error");
      setResult({ error: isFr ? "Veuillez coller un code HCS rotatif" : "Please paste a rotating HCS code" });
      return;
    }

    if (!userId.trim()) {
      setStatus("error");
      setResult({ error: isFr ? "Aucun userId n'est défini" : "No userId is defined" });
      return;
    }

    setStatus("loading");

    try {
      const response = await fetch("/api/verify-rotating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, userId }),
      });

      const data = (await response.json().catch(() => ({}))) as VerifyResponse;

      if (!response.ok) {
        setStatus("blocked");
        setResult(data);
        return;
      }

      setResult(data);
      setStatus(data.isHuman ? "success" : "blocked");
    } catch (error) {
      setStatus("error");
      setResult({ error: String(error) });
    }
  };

  const headerLabel = isFr
    ? "Vérificateur de code HCS-U7 rotatif"
    : "Rotating HCS-U7 code verifier";

  const buttonLabel = isFr ? "Vérifier le code rotatif" : "Verify rotating code";

  return (
    <section className="mx-auto mb-10 mt-6 w-full max-w-4xl px-4 sm:px-6 lg:px-8">
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-4 w-4 text-primary" />
            {headerLabel}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-foreground/90">
          <p>
            {isFr
              ? "Collez un code HCS-U7 rotatif (avec TW:...) et le userId associé pour vérifier la signature HMAC, la fenêtre temporelle et les protections anti-replay."
              : "Paste a rotating HCS-U7 code (with TW:...) and its associated userId to verify HMAC signature, time window and anti-replay protections."}
          </p>

          <div className="space-y-3">
            <label className="flex flex-col gap-1 text-xs">
              <span className="font-medium text-foreground/80">
                {isFr ? "Code HCS-U7 rotatif" : "Rotating HCS-U7 code"}
              </span>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder={
                  isFr
                    ? "HCS-U7|V:8.0|...|TW:123456"
                    : "HCS-U7|V:8.0|...|TW:123456"
                }
              />
            </label>

            <label className="flex flex-col gap-1 text-xs">
              <span className="font-medium text-foreground/80 flex items-center gap-2">
                {isFr ? "User ID (client)" : "Client userId"}
                <span className="inline-flex items-center gap-1 text-[10px] text-foreground/60">
                  <KeyRound className="h-3 w-3" />
                  {isFr
                    ? "Généré localement via localStorage (client-id)"
                    : "Generated locally via localStorage (client-id)"}
                </span>
              </span>
              <Input
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder={isFr ? "Identifiant du client" : "Client identifier"}
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button type="button" onClick={handleVerify} disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isFr ? "Vérification..." : "Verifying..."}
                </>
              ) : (
                <>
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  {buttonLabel}
                </>
              )}
            </Button>
          </div>

          {status === "success" && result && (
            <Alert className="mt-2" variant="default">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <AlertDescription className="text-xs sm:text-sm">
                {isFr
                  ? `Code valide. Décision: autorisé. Confiance: ${
                      result.confidence?.toFixed(2) ?? "n/a"
                    }. Fenêtre: diff=${result.rotation?.windowDiff ?? 0}, âge ~${
                      result.rotation?.codeAgeMinutes?.toFixed(1) ?? "0.0"
                    } min.`
                  : `Valid code. Decision: allow. Confidence: ${
                      result.confidence?.toFixed(2) ?? "n/a"
                    }. Window diff=${result.rotation?.windowDiff ?? 0}, age ~${
                      result.rotation?.codeAgeMinutes?.toFixed(1) ?? "0.0"
                    } min.`}
              </AlertDescription>
            </Alert>
          )}

          {status === "blocked" && result && (
            <Alert className="mt-2" variant="destructive">
              <ShieldX className="h-4 w-4" />
              <AlertDescription className="text-xs sm:text-sm">
                {isFr
                  ? `Code rejeté. Raison: ${result.error ?? result.reason ?? "inconnue"}.`
                  : `Code rejected. Reason: ${result.error ?? result.reason ?? "unknown"}.`}
              </AlertDescription>
            </Alert>
          )}

          {status === "error" && result && (
            <Alert className="mt-2" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs sm:text-sm">
                {isFr
                  ? `Erreur pendant la vérification: ${result.error ?? "inconnue"}`
                  : `Error while verifying: ${result.error ?? "unknown"}`}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
