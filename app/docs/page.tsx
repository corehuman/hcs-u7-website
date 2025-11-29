"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/LanguageProvider";

const DOCS_URL = "https://documentation-hcs-u7.vercel.app";

export default function DocsIndexPage() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  return (
    <article className="mx-auto max-w-3xl space-y-8">
      <header className="space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {isFr ? "Documentation HCS-U7" : "HCS-U7 Documentation"}
        </h1>
        <p className="max-w-2xl text-sm text-foreground/85 sm:text-base">
          {isFr
            ? "La documentation complète HCS-U7 (format, algorithmes, API, licence MIT) est disponible sur un site dédié. Utilisez cette page comme point d'entrée depuis l'application de démonstration."
            : "The full HCS-U7 documentation (format, algorithms, APIs, MIT license) lives on a dedicated site. Use this page as an entry point from the demo application."}
        </p>
      </header>

      <section className="space-y-4">
        <p className="text-sm text-foreground/80">
          {isFr
            ? "Vous y trouverez la spécification HCS-U7, l'évolution U3→U7, les détails des algorithmes (B3, hash tree, QSIG post-quantique) et les guides d'intégration."
            : "There you will find the HCS-U7 specification, the U3→U7 evolution, detailed algorithms (B3, hash tree, post-quantum QSIG) and integration guides."}
        </p>

        <a href={DOCS_URL} target="_blank" rel="noreferrer" className="inline-flex">
          <Button size="lg" className="gap-2">
            {isFr ? "Ouvrir la documentation complète" : "Open full documentation"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </a>

        <p className="text-xs text-muted-foreground">
          {isFr
            ? "Le lien s'ouvre dans un nouvel onglet sur documentation-hcs-u7.vercel.app."
            : "The link opens in a new tab on documentation-hcs-u7.vercel.app."}
        </p>
      </section>
    </article>
  );
}
