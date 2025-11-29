'use client';

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/LanguageProvider";

export default function PricingPage() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <header className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            {isFr ? "Tarifs" : "Pricing"}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {isFr
              ? "Modèle Open-Core : Open Source + Cloud Géré"
              : "Open-Core Model: Open Source + Managed Cloud"}
          </h1>
          <p className="max-w-3xl text-sm text-foreground/85 sm:text-base">
            {isFr
              ? "Le cœur HCS-U7 (format de code, parseurs, documentation) est open source sous licence MIT et peut être auto-hébergé gratuitement. Pour les équipes produit qui veulent une solution prête à l'emploi avec SLA, analytics et détection de fraude temps réel, nous proposons des plans Cloud gérés."
              : "The HCS-U7 core (code format, parsers, documentation) is open source under the MIT license and can be self-hosted for free. For product teams who want a production-ready service with SLAs, analytics and real-time fraud detection, we provide managed Cloud plans."}
          </p>
        </header>

        <section className="space-y-4 rounded-2xl card-base p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-foreground sm:text-xl">
            {isFr ? "Cœur Open Source (MIT)" : "Open-Source Core (MIT)"}
          </h2>
          <p className="text-sm text-foreground/85 sm:text-base">
            {isFr
              ? "Toujours gratuit pour un usage individuel, la recherche et les prototypes. Vous contrôlez entièrement l'hébergement, la confidentialité et l'intégration."
              : "Always free for individual, research and prototype use. You fully control hosting, privacy and integration."}
          </p>
          <div className="grid gap-6 text-sm sm:grid-cols-2">
            <div className="space-y-1">
              <p className="font-medium text-foreground">
                {isFr ? "Inclus" : "Includes"}
              </p>
              <ul className="list-disc space-y-1 pl-5 text-foreground/85">
                <li>{isFr ? "Génération illimitée de profils HCS-U7" : "Unlimited HCS-U7 profile generation"}</li>
                <li>{isFr ? "Parseurs open source (Python, JavaScript, ROS2)" : "Open-source parsers (Python, JavaScript, ROS2)"}</li>
                <li>{isFr ? "Spécification complète du format et validation empirique" : "Full format specification and empirical validation"}</li>
                <li>{isFr ? "Support communautaire (Discord, GitHub)" : "Community support (Discord, GitHub)"}</li>
              </ul>
            </div>
            <div className="space-y-1">
              <p className="font-medium text-foreground">
                {isFr ? "Idéal pour" : "Best for"}
              </p>
              <ul className="list-disc space-y-1 pl-5 text-foreground/85">
                <li>{isFr ? "Chercheurs et laboratoires" : "Researchers and labs"}</li>
                <li>{isFr ? "Prototypes internes et POC" : "Internal prototypes and POCs"}</li>
                <li>{isFr ? "Intégrations custom/self-hosted" : "Custom / self-hosted integrations"}</li>
              </ul>
            </div>
          </div>
          <Button asChild className="mt-2 rounded-full">
            <a href="/docs">{isFr ? "Voir la documentation" : "View documentation"}</a>
          </Button>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground sm:text-xl">
              {isFr ? "Plans Cloud gérés" : "Managed Cloud Plans"}
            </h2>
            <p className="text-sm text-foreground/85 sm:text-base">
              {isFr
                ? "Tous les plans incluent l'API REST, le widget JavaScript, la conformité RGPD et l'infrastructure sécurisée. Les prix ci-dessous sont indicatifs et peuvent être ajustés pendant la phase de pilote."
                : "All plans include the REST API, JavaScript widget, GDPR-friendly data handling and secure infrastructure. Prices below are indicative and can be adjusted during pilot phases."}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {/* Free */}
            <div className="card-base flex h-full flex-col rounded-2xl p-6">
              <div className="mb-4 flex items-baseline justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {isFr ? "Free Tier" : "Free Tier"}
                  </p>
                  <h3 className="text-lg font-semibold text-foreground">
                    {isFr ? "Gratuit" : "Free"}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">
                    0€
                  </p>
                  <p className="text-xs text-foreground/80">
                    {isFr ? "/ mois" : "/ month"}
                  </p>
                </div>
              </div>
              <p className="mb-3 text-sm text-foreground/85">
                {isFr
                  ? "Pour commencer avec HCS-U7 sur des projets personnels, des POC ou des petits sites."
                  : "Get started with HCS-U7 for personal projects, POCs or small sites."}
              </p>
              <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-foreground/85">
                <li>{isFr ? "1 000 vérifications humaines / mois" : "1,000 human verifications / month"}</li>
                <li>{isFr ? "Widget JavaScript et API REST" : "JavaScript widget and REST API"}</li>
                <li>{isFr ? "Documentation complète" : "Full documentation"}</li>
                <li>{isFr ? "Support communautaire" : "Community support"}</li>
                <li>{isFr ? "Analytics de base" : "Basic analytics"}</li>
              </ul>
              <Button asChild size="sm" className="mt-auto rounded-full">
                <a href="mailto:contact@hcs-u7.com?subject=HCS-U7%20Free%20Tier">
                  {isFr ? "Activer le Free Tier" : "Activate Free Tier"}
                </a>
              </Button>
            </div>

            {/* Starter */}
            <div className="card-base flex h-full flex-col rounded-2xl border-primary/60 p-6">
              <div className="mb-4 flex items-baseline justify-between">
                <div>
                  <p className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                    {isFr ? "Recommandé" : "Recommended"}
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">
                    Starter
                  </h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">
                    29€
                  </p>
                  <p className="text-xs text-foreground/80">
                    {isFr ? "/ mois" : "/ month"}
                  </p>
                </div>
              </div>
              <p className="mb-3 text-sm text-foreground/85">
                {isFr
                  ? "Pour les startups et produits en phase beta qui ont besoin d'un CAPTCHA cognitif robuste."
                  : "For startups and beta products that need a robust cognitive CAPTCHA."}
              </p>
              <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-foreground/85">
                <li>{isFr ? "5 000 vérifications / mois incluses" : "5,000 verifications / month included"}</li>
                <li>{isFr ? "Overage : 0,004 € / vérification" : "Overage: €0.004 / verification"}</li>
                <li>{isFr ? "Support email (réponse sous 48 h)" : "Email support (48h response)"}</li>
                <li>{isFr ? "Dashboard analytics" : "Analytics dashboard"}</li>
                <li>{isFr ? "Branding personnalisable" : "Custom branding"}</li>
                <li>{isFr ? "Webhooks d'événements" : "Event webhooks"}</li>
              </ul>
              <Button asChild size="sm" className="mt-auto rounded-full">
                <a href="mailto:contact@hcs-u7.com?subject=HCS-U7%20Starter">
                  {isFr ? "Parler au sales" : "Talk to sales"}
                </a>
              </Button>
            </div>

            {/* Pro */}
            <div className="card-base flex h-full flex-col rounded-2xl p-6">
              <div className="mb-4 flex items-baseline justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Pro</h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">
                    99€
                  </p>
                  <p className="text-xs text-foreground/80">
                    {isFr ? "/ mois" : "/ month"}
                  </p>
                </div>
              </div>
              <p className="mb-3 text-sm text-foreground/85">
                {isFr
                  ? "Pour les produits en production avec un trafic significatif et des exigences de fraude plus avancées."
                  : "For production products with significant traffic and more advanced fraud requirements."}
              </p>
              <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-foreground/85">
                <li>{isFr ? "25 000 vérifications / mois incluses" : "25,000 verifications / month included"}</li>
                <li>{isFr ? "Overage : 0,003 € / vérification" : "Overage: €0.003 / verification"}</li>
                <li>{isFr ? "Support prioritaire (24 h)" : "Priority support (24h)"}</li>
                <li>{isFr ? "Plusieurs projets" : "Multiple projects"}</li>
                <li>{isFr ? "Analytics avancés" : "Advanced analytics"}</li>
                <li>{isFr ? "Détection de fraude (beta)" : "Fraud detection (beta)"}</li>
                <li>{isFr ? "Règles personnalisées" : "Custom rules"}</li>
                <li>{isFr ? "SLA 99,5 %" : "99.5% SLA"}</li>
              </ul>
              <Button asChild size="sm" className="mt-auto rounded-full">
                <a href="mailto:contact@hcs-u7.com?subject=HCS-U7%20Pro">
                  {isFr ? "Plan Pro" : "Discuss Pro plan"}
                </a>
              </Button>
            </div>

            {/* Business */}
            <div className="card-base flex h-full flex-col rounded-2xl p-6">
              <div className="mb-4 flex items-baseline justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Business</h3>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-foreground">
                    299€
                  </p>
                  <p className="text-xs text-foreground/80">
                    {isFr ? "/ mois" : "/ month"}
                  </p>
                </div>
              </div>
              <p className="mb-3 text-sm text-foreground/85">
                {isFr
                  ? "Pour les équipes produit et plateformes B2B avec des volumes élevés et des exigences de conformité."
                  : "For product teams and B2B platforms with higher volumes and compliance needs."}
              </p>
              <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-foreground/85">
                <li>{isFr ? "100 000 vérifications / mois incluses" : "100,000 verifications / month included"}</li>
                <li>{isFr ? "Overage : 0,002 € / vérification" : "Overage: €0.002 / verification"}</li>
                <li>{isFr ? "Support téléphone (SLA 4 h)" : "Phone support (4h SLA)"}</li>
                <li>{isFr ? "Canal Slack dédié" : "Dedicated Slack channel"}</li>
                <li>{isFr ? "Intégrations personnalisées" : "Custom integrations"}</li>
                <li>{isFr ? "Option white-label" : "White-label option"}</li>
                <li>{isFr ? "SSO / SAML" : "SSO / SAML"}</li>
                <li>{isFr ? "SLA 99,9 %" : "99.9% SLA"}</li>
              </ul>
              <Button asChild size="sm" className="mt-auto rounded-full">
                <a href="mailto:contact@hcs-u7.com?subject=HCS-U7%20Business">
                  {isFr ? "Plan Business" : "Discuss Business plan"}
                </a>
              </Button>
            </div>

            {/* Enterprise */}
            <div className="card-base flex h-full flex-col rounded-2xl p-6 md:col-span-2 xl:col-span-1">
              <div className="mb-4 flex items-baseline justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Enterprise</h3>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-foreground">
                    {isFr ? "Sur devis" : "Custom"}
                  </p>
                  <p className="text-xs text-foreground/80">
                    {isFr ? "Banques, gouvernements, grands groupes" : "Banks, governments, large orgs"}
                  </p>
                </div>
              </div>
              <p className="mb-3 text-sm text-foreground/85">
                {isFr
                  ? "Pour les volumes multi-millions, les exigences fortes de souveraineté (on-premise, multi-région) et les intégrations sur mesure."
                  : "For multi-million volumes, strong sovereignty requirements (on-prem, multi-region) and fully custom integrations."}
              </p>
              <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-foreground/85">
                <li>{isFr ? "Déploiement on-premise ou VPC" : "On-premise or VPC deployment"}</li>
                <li>{isFr ? "SLA personnalisé jusqu'à 99,99 %" : "Custom SLAs up to 99.99%"}</li>
                <li>{isFr ? "Account manager dédié" : "Dedicated account manager"}</li>
                <li>{isFr ? "Modèles ML sur mesure" : "Custom ML models"}</li>
                <li>{isFr ? "Multi-région (UE, US, APAC)" : "Multi-region (EU, US, APAC)"}</li>
                <li>{isFr ? "Pen tests & audits de sécurité" : "Pen testing & security audits"}</li>
                <li>{isFr ? "Formations & accompagnement" : "Training & consulting"}</li>
                <li>{isFr ? "Accès au code source sous escrow" : "Source code access via escrow"}</li>
              </ul>
              <Button asChild size="sm" className="mt-auto rounded-full">
                <a href="mailto:contact@hcs-u7.com?subject=HCS-U7%20Enterprise">
                  {isFr ? "Planifier un call" : "Schedule a call"}
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
