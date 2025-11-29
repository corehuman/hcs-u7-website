"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { KeyRound, RefreshCw, Copy, CheckCircle2, AlertCircle } from "lucide-react";

const STORAGE_KEY = "hcs-u7-dev-api-key";
const STORAGE_DATE_KEY = "hcs-u7-dev-api-key-created-at";

function generateApiKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    const raw = crypto.randomUUID().replace(/-/g, "");
    return `hcs_live_${raw.slice(0, 24)}`;
  }
  const random = Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
  return `hcs_live_${random.slice(0, 24)}`;
}

export default function ApiKeyPage() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  const [apiKey, setApiKey] = useState("");
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const storedKey = window.localStorage.getItem(STORAGE_KEY);
    const storedDate = window.localStorage.getItem(STORAGE_DATE_KEY);
    if (storedKey) {
      setApiKey(storedKey);
      if (storedDate) setCreatedAt(storedDate);
    }
  }, []);

  const handleGenerate = () => {
    const key = generateApiKey();
    const now = new Date().toISOString();
    setApiKey(key);
    setCreatedAt(now);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, key);
      window.localStorage.setItem(STORAGE_DATE_KEY, now);
    }
  };

  const handleCopy = async () => {
    if (!apiKey) return;
    try {
      await navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <Badge variant="secondary" className="uppercase tracking-wide text-[10px]">
          {isFr ? "Développeurs" : "Developers"}
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {isFr ? "Clé API HCS-U7" : "HCS-U7 API Key"}
        </h1>
        <p className="max-w-xl text-sm text-foreground/85 sm:text-base">
          {isFr
            ? "Générez une clé API de développement pour tester l'intégration HCS-U7 (widget, endpoint de vérification, SDK). Cette clé est stockée localement dans votre navigateur."
            : "Generate a development API key to test HCS-U7 integration (widget, verification endpoint, SDK). This key is stored locally in your browser."}
        </p>
      </div>

      <Card className="border-primary/20 bg-card/95">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <KeyRound className="h-4 w-4 text-primary" />
            {isFr ? "Votre clé API de développement" : "Your development API key"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Input
              type="text"
              value={apiKey || (isFr ? "Aucune clé générée pour l'instant" : "No key generated yet")}
              readOnly
              className={apiKey ? "font-mono text-xs" : "text-xs text-foreground/60"}
            />
            <div className="flex gap-2 sm:flex-none">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopy}
                disabled={!apiKey}
                className="shrink-0"
                aria-label={isFr ? "Copier la clé" : "Copy key"}
              >
                {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button
                type="button"
                onClick={handleGenerate}
                className="inline-flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                {apiKey ? (isFr ? "Regénérer" : "Regenerate") : (isFr ? "Générer" : "Generate")}
              </Button>
            </div>
          </div>

          {createdAt && (
            <p className="text-xs text-foreground/70">
              {isFr ? "Créée le : " : "Created at: "}
              <span className="font-mono">
                {new Date(createdAt).toLocaleString()}
              </span>
            </p>
          )}

          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs sm:text-sm">
              {isFr
                ? "Cette clé est une clé de développement locale : elle n'est pas encore liée à un compte SaaS côté serveur. Copiez-la ensuite dans la configuration de votre backend (par exemple variable d'environnement HCS_U7_API_KEY) pour sécuriser vos appels /verify en production."
                : "This key is a local development key: it is not yet bound to a SaaS account on the server side. Copy it into your backend configuration (for example environment variable HCS_U7_API_KEY) to secure your /verify calls in production."}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
