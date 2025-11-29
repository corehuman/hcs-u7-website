"use client";

import Link from "next/link";
import { ArrowRight, Brain, Code, Plug } from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import { useLanguage } from "@/components/LanguageProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function IntegrationsPage() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  const widgetSnippet = `<!-- 1. Include the SDK -->
<script src="https://cdn.hcs-u7.com/v1.js"></script>

<!-- 2. CAPTCHA container -->
<div id="hcs-captcha"></div>

<!-- 3. Initialization -->
<script>
  HCSCaptcha.render('#hcs-captcha', {
    siteKey: 'YOUR_SITE_KEY_HERE',
    onVerify: function(token) {
      fetch('/api/verify-human', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hcsToken: token })
      });
    }
  });
</script>`;

  const backendSnippet = `// Node.js / Express example (Next.js API route or Express)
import fetch from 'node-fetch';

app.post('/api/verify-human', async (req, res) => {
  const { hcsToken } = req.body;

  const response = await fetch('https://api.hcs-u7.com/v1/verify', {
    method: 'POST',
    headers: {
      'Authorization': \
        'Bearer ' + (process.env.HCS_U7_API_KEY || 'YOUR_SECRET_KEY'),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token: hcsToken, userIP: req.ip }),
  });

  const result = await response.json();
  if (result.isHuman && result.confidence > 0.95) {
    return res.json({ success: true });
  }
  return res.status(403).json({ error: 'Bot detected', details: result });
});`;

  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="mb-10 space-y-4">
        <Badge variant="secondary" className="uppercase tracking-wide text-[10px]">
          {isFr ? "Intégrations" : "Integrations"}
        </Badge>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {isFr ? "Intégrez HCS-U7 dans vos systèmes" : "Integrate HCS-U7 into your systems"}
        </h1>
        <p className="max-w-2xl text-sm text-foreground/85 sm:text-base">
          {isFr
            ? "HCS-U7 se connecte à vos API, agents IA, backends et robots via une librairie open-core et une API SaaS. Cette page rassemble tout ce qu'il faut pour l'intégrer rapidement."
            : "HCS-U7 connects to your APIs, AI agents, backends and robots through an open-core library and a SaaS API. This page gathers everything you need to integrate it quickly."}
        </p>
      </div>

      {/* Developer Quickstart */}
      <section className="mb-12 grid gap-6 md:grid-cols-[2fr,3fr] items-start">
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Plug className="h-4 w-4 text-primary" />
              {isFr ? "Démarrage rapide développeur" : "Developer Quickstart"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3 text-sm text-foreground/90">
              <li className="flex gap-2">
                <span className="font-semibold">1.</span>
                <span>
                  {isFr ? "Créez un compte et obtenez une clé API gratuite sur " : "Create an account and get a free API key at "}
                  <Link href="/developers/api-key" className="underline underline-offset-2">
                    /developers/api-key
                  </Link>
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">2.</span>
                <span>
                  {isFr ? "Installez le SDK backend : " : "Install the backend SDK: "}
                  <code className="rounded bg-muted px-1 py-0.5 text-[11px]">
                    npm install @hcs-u7/auth
                  </code>
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">3.</span>
                <span>
                  {isFr
                    ? "Ajoutez le widget JavaScript HCS-U7 sur vos formulaires sensibles (inscription, connexion, paiement...)."
                    : "Add the HCS-U7 JavaScript widget to your sensitive forms (signup, login, payment, etc.)."}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold">4.</span>
                <span>
                  {isFr
                    ? "Validez le jeton côté serveur via /api/verify-human et protégez jusqu'à 1 000 vérifications par mois sur le niveau gratuit."
                    : "Validate the token on your backend via /api/verify-human and protect up to 1,000 verifications per month on the free tier."}
                </span>
              </li>
            </ol>

            <div className="mt-4 flex flex-wrap gap-3 text-xs text-foreground/80">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
                <Brain className="h-3 w-3" />
                {isFr ? "Profil cognitif en ~5 lignes de code" : "Cognitive profile in ~5 lines of code"}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
                <Code className="h-3 w-3" />
                {isFr ? "Open-core + API SaaS" : "Open-core + SaaS API"}
              </span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-wide text-foreground/70">
            {isFr ? "Exemple widget + backend" : "Widget + backend example"}
          </p>
          <CodeBlock language="html" code={widgetSnippet} />
          <CodeBlock language="ts" code={backendSnippet} />
        </div>
      </section>

      {/* LLMs, agents & robotics */}
      <section className="mb-12 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {isFr ? "Agents IA, frameworks et robots" : "AI agents, frameworks and robotics"}
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2 rounded-2xl border bg-card/95 backdrop-blur-sm p-4 text-sm shadow-sm">
            <h3 className="font-semibold text-foreground">OpenAI / ChatGPT</h3>
            <ul className="list-disc space-y-1 pl-4 text-xs text-foreground/85">
              <li>{isFr ? "Utilisation en system prompt pour contextualiser l'agent." : "Use as a system prompt to contextualize the agent."}</li>
              <li>{isFr ? "Wrapper TypeScript / Python pour parser les codes HCS-U7." : "TypeScript / Python wrapper to parse HCS-U7 codes."}</li>
              <li>{isFr ? "Compatible avec les assistants GPT et outils personnalisés." : "Compatible with GPT assistants and custom tools."}</li>
            </ul>
          </div>

          <div className="space-y-2 rounded-2xl border bg-card/95 backdrop-blur-sm p-4 text-sm shadow-sm">
            <h3 className="font-semibold text-foreground">Anthropic / Claude</h3>
            <ul className="list-disc space-y-1 pl-4 text-xs text-foreground/85">
              <li>{isFr ? "Instruction système persistante basée sur le profil HCS-U7." : "Persistent system instruction based on the HCS-U7 profile."}</li>
              <li>{isFr ? "Adaptation fine du ton, de la patience et du niveau de détail." : "Fine-grained adaptation of tone, patience and level of detail."}</li>
              <li>{isFr ? "Support via SDKs Python / JS." : "Support via Python / JS SDKs."}</li>
            </ul>
          </div>

          <div className="space-y-2 rounded-2xl border bg-card/95 backdrop-blur-sm p-4 text-sm shadow-sm">
            <h3 className="font-semibold text-foreground">LangChain</h3>
            <ul className="list-disc space-y-1 pl-4 text-xs text-foreground/85">
              <li>{isFr ? "Templates de prompts centrés sur le profil cognitif." : "Prompt templates centered on the cognitive profile."}</li>
              <li>{isFr ? "Agents avec mémoire aware du profil HCS-U7." : "Agents with memory aware of the HCS-U7 profile."}</li>
              <li>{isFr ? "Chaînes multi-modèles combinant HCS-U7 et LLMs." : "Multi-model chains combining HCS-U7 and LLMs."}</li>
            </ul>
          </div>

          <div className="space-y-2 rounded-2xl border bg-card/95 backdrop-blur-sm p-4 text-sm shadow-sm">
            <h3 className="font-semibold text-foreground">Robotics</h3>
            <ul className="list-disc space-y-1 pl-4 text-xs text-foreground/85">
              <li>{isFr ? "Extension HCS-U7R (v8.x) pour les robots sociaux." : "HCS-U7R extension (v8.x) for social robots."}</li>
              <li>{isFr ? "Nœuds ROS2 pour proxémie / trajectoires de mouvement." : "ROS2 nodes for proxemics and motion planning."}</li>
              <li>{isFr ? "Adaptation continue aux préférences humaines." : "Continuous adaptation to human preferences."}</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Parsers & SDKs */}
      <section className="space-y-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            {isFr ? "Parsers & SDKs" : "Parsers & SDKs"}
          </h2>
          <p className="text-xs text-foreground/70">
            {isFr
              ? "Utilisez la librairie open-core pour parser les codes HCS-U7 hors-ligne, ou le SDK SaaS pour la vérification en temps réel."
              : "Use the open-core library to parse HCS-U7 codes offline, or the SaaS SDK for real-time verification."}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              {isFr ? "Python (open-core)" : "Python (open-core)"}
            </h3>
            <CodeBlock
              language="bash"
              code={`# Install from GitHub (current)
pip install "git+https://github.com/corehuman/hcs-u7-python.git"

# PyPI package (coming soon)
# pip install hcs-u7`}
            />
            <CodeBlock
              language="python"
              code={`from hcs_u7 import parse_hcs_code

code = "HCS-U7|V:7.0|..."
profile = parse_hcs_code(code)
print(profile.element, profile.cognition.logic)`}
            />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">
              JavaScript / TypeScript
            </h3>
            <CodeBlock language="bash" code={`npm install hcs-u7`} />
            <CodeBlock
              language="ts"
              code={`import { parseHCSCode } from "hcs-u7";

const profile = parseHCSCode("HCS-U7|V:7.0|...");
console.log(profile.element, profile.cognition.logic);`}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-xs text-foreground/80">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1 rounded-full border border-border/60 px-3 py-1 hover:bg-muted/60"
          >
            {isFr ? "Voir les plans et limites" : "View plans and limits"}
            <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/security/hcs-code"
            className="inline-flex items-center gap-1 rounded-full border border-border/60 px-3 py-1 hover:bg-muted/60"
          >
            {isFr ? "Plongée technique (HCS-U7 Code)" : "Technical deep dive (HCS-U7 Code)"}
            <ArrowRight className="h-3 w-3" />
          </Link>
          <Link
            href="/docs/security"
            className="inline-flex items-center gap-1 rounded-full border border-border/60 px-3 py-1 hover:bg-muted/60"
          >
            {isFr ? "Documentation développeur" : "Developer docs"}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </section>
    </div>
  );
}
