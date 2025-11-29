'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/components/LanguageProvider';
import { Calendar, Rocket, Shield, Network } from 'lucide-react';
import { motion } from 'framer-motion';

export function SecurityRoadmap() {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  const phases = [
    {
      id: 'v7',
      badge: '2024',
      icon: Shield,
      titleFr: 'Version actuelle v7.0',
      titleEn: 'Current version v7.0',
      periodFr: 'Q4 2024',
      periodEn: 'Q4 2024',
      pointsFr: [
        'Détection de bots basée sur Stroop + temps de réaction',
        'Format HCS-U7 standardisé et signatures cryptographiques (QSIG + BLAKE3)',
        'API REST, widget JavaScript et parsers open source',
        'Dashboard analytics basique et documentation complète',
      ],
      pointsEn: [
        'Bot detection based on Stroop + reaction time',
        'Standardized HCS-U7 format and cryptographic signatures (QSIG + BLAKE3)',
        'REST API, JavaScript widget and open-source parsers',
        'Basic analytics dashboard and full documentation',
      ],
    },
    {
      id: 'q1',
      badge: 'Q1 2025',
      icon: Rocket,
      titleFr: 'Sécurité renforcée',
      titleEn: 'Enhanced security',
      periodFr: 'Q1 2025',
      periodEn: 'Q1 2025',
      pointsFr: [
        'Biométrie cognitive multi-modale (ajout de tests type N-Back)',
        'Authentification continue avec micro-tests discrets en session',
        'Modèles ML de détection de fraude temps réel',
        'SDK mobiles (React Native, Flutter) et webhooks d\'événements',
      ],
      pointsEn: [
        'Multi-modal cognitive biometrics (including N-Back-style tests)',
        'Continuous authentication with discrete in-session micro-tests',
        'Real-time fraud detection ML models',
        'Mobile SDKs (React Native, Flutter) and event webhooks',
      ],
    },
    {
      id: 'q2',
      badge: 'Q2 2025',
      icon: Calendar,
      titleFr: 'Fonctionnalités Enterprise',
      titleEn: 'Enterprise features',
      periodFr: 'Q2 2025',
      periodEn: 'Q2 2025',
      pointsFr: [
        'Intégration SSO / SAML avec les providers d\'identité',
        'Option de déploiement on-premise et VPC isolé',
        'Dashboard analytics avancé (fraude, bots, conformité)',
        'Support multi-région (UE, US, APAC) et options de souveraineté',
      ],
      pointsEn: [
        'SSO / SAML integration with major identity providers',
        'On-premise and isolated VPC deployment options',
        'Advanced analytics dashboard (fraud, bots, compliance)',
        'Multi-region support (EU, US, APAC) and data sovereignty options',
      ],
    },
    {
      id: 'q3q4',
      badge: 'Q3–Q4 2025',
      icon: Shield,
      titleFr: 'Résistance IA & tests adaptatifs',
      titleEn: 'AI resistance & adaptive testing',
      periodFr: 'Q3–Q4 2025',
      periodEn: 'Q3–Q4 2025',
      pointsFr: [
        'Tests cognitifs adaptatifs qui changent dynamiquement à chaque session',
        'Modèles anti-IA spécialisés pour détecter GPT-5/6 et automatisations avancées',
        'Empreinte comportementale enrichie (fingerprinting cognitif longitudinal)',
        'Intégration optionnelle de biométrie vocale et liveness renforcé',
      ],
      pointsEn: [
        'Adaptive cognitive tests that change dynamically on each session',
        'Dedicated anti-AI models to detect GPT-5/6 and advanced automation',
        'Richer behavioral fingerprinting (longitudinal cognitive patterns)',
        'Optional voice biometrics integration and stronger liveness checks',
      ],
    },
    {
      id: '2026',
      badge: '2026',
      icon: Network,
      titleFr: 'Écosystème & plateforme',
      titleEn: 'Ecosystem & platform',
      periodFr: '2026',
      periodEn: '2026',
      pointsFr: [
        'Marketplace d\'intégrations (Shopify, WordPress, Auth0, Okta, etc.)',
        'API partenaires pour s\'intégrer aux plateformes d\'identité existantes',
        'Outils communautaires pour développeurs et programmes de certification',
        'Partenariats recherche académiques et certifications de sécurité (ANSSI, ISO 27001, FedRAMP selon région)',
      ],
      pointsEn: [
        'Integration marketplace (Shopify, WordPress, Auth0, Okta, etc.)',
        'Partner APIs to plug into existing identity and security platforms',
        'Developer community tools and certification programs',
        'Academic research partnerships and security certifications (ANSSI, ISO 27001, FedRAMP by region)',
      ],
    },
  ];

  return (
    <section className="py-20 section-base">
      <div className="container mx-auto max-w-6xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-10 text-center"
        >
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {isFr ? 'Feuille de route' : 'Roadmap'}
          </p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">
            {isFr
              ? 'Roadmap HCS-U7 : 2024–2026'
              : 'HCS-U7 Roadmap: 2024–2026'}
          </h2>
          <p className="mt-3 text-sm text-foreground/85 md:text-base max-w-2xl mx-auto">
            {isFr
              ? 'Vision claire de l\'évolution du système : de la détection de bots à la plateforme complète de sécurité cognitive pour banques, gouvernements et écosystèmes développeurs.'
              : 'A clear view of how the system evolves—from bot detection to a full cognitive security platform for banks, governments and developer ecosystems.'}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {phases.map((phase, index) => {
            const Icon = phase.icon;
            const title = isFr ? phase.titleFr : phase.titleEn;
            const points = isFr ? phase.pointsFr : phase.pointsEn;
            const period = isFr ? phase.periodFr : phase.periodEn;

            return (
              <motion.div
                key={phase.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="card-base h-full">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        <Calendar className="mr-1 h-3 w-3" />
                        {phase.badge}
                      </div>
                      <span className="text-xs text-foreground/70">{period}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="text-sm font-semibold md:text-base">{title}</h3>
                    </div>
                    <ul className="mt-2 space-y-1.5 text-xs text-foreground/85 md:text-sm">
                      {points.map((item, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
