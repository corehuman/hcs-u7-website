'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Bot, Fingerprint, AlertTriangle, ArrowRight, ExternalLink, Check } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';

export function UseCasesGrid() {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  const useCases = [
    {
      id: 'auth',
      icon: Shield,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      title: isFr ? 'Authentification Cognitive' : 'Cognitive Authentication',
      description: isFr
        ? 'Remplacez les mots de passe par des tests cognitifs de 2 minutes. Les utilisateurs s\'authentifient en prouvant leur signature cognitive.'
        : 'Replace passwords with 2-minute cognitive tests. Users authenticate by proving their cognitive signature.',
      features: isFr ? [
        'Aucun mot de passe à retenir',
        'Immunisé contre le phishing',
        'Multi-facteurs par conception',
        'Respectueux de la vie privée'
      ] : [
        'No passwords to remember',
        'Immune to phishing',
        'Multi-factor by design',
        'Privacy-preserving'
      ],
      demoLink: '/security/auth-demo',
      docsLink: '/docs/security/authentication',
      status: 'available'
    },
    {
      id: 'captcha',
      icon: Bot,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      title: isFr ? 'CAPTCHA Résistant à l\'IA' : 'AI-Resistant CAPTCHA',
      description: isFr
        ? 'Détectez les bots en utilisant des modèles cognitifs humains. GPT-4V et les outils d\'automatisation ne peuvent pas simuler la variabilité du temps de réaction.'
        : 'Detect bots using human cognitive patterns. GPT-4V and automation tools cannot fake reaction time variability.',
      features: isFr ? [
        'Défait les bots IA avancés',
        'Accessible (pas de vision requise)',
        'Rapide (30 secondes en moyenne)',
        'Respectueux de la vie privée'
      ] : [
        'Defeats advanced AI bots',
        'Accessible (no vision required)',
        'Fast (30 seconds avg)',
        'Privacy-first (no tracking)'
      ],
      demoLink: '/security/captcha-demo',
      docsLink: '/docs/security/captcha',
      status: 'available'
    },
    {
      id: 'verify',
      icon: Fingerprint,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      title: isFr ? 'Vérification de Profil' : 'Profile Verification',
      description: isFr
        ? 'Vérifiez si deux codes HCS appartiennent à la même personne. Détectez les comptes en double et la fraude d\'identité.'
        : 'Verify if two HCS codes belong to the same person. Detect duplicate accounts and identity fraud.',
      features: isFr ? [
        'Signatures cryptographiques',
        'Score de similarité (0-100%)',
        'Vérification instantanée',
        'Précision médico-légale'
      ] : [
        'Cryptographic signatures',
        'Similarity scoring (0-100%)',
        'Instant verification',
        'Forensic-grade accuracy'
      ],
      demoLink: '/security/verify',
      docsLink: '/docs/security/verification',
      status: 'available'
    },
    {
      id: 'fraud',
      icon: AlertTriangle,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30',
      title: isFr ? 'Détection de Fraude' : 'Fraud Detection',
      description: isFr
        ? 'Surveillez les sessions en temps réel. Détectez la prise de contrôle de compte lorsque les modèles cognitifs s\'écartent de la base.'
        : 'Monitor sessions in real-time. Detect account takeover when cognitive patterns deviate from baseline.',
      features: isFr ? [
        'Surveillance en temps réel',
        'Détection d\'anomalies comportementales',
        'Alertes de piratage de session',
        'Preuves à connaissance nulle'
      ] : [
        'Real-time monitoring',
        'Behavioral anomaly detection',
        'Session hijacking alerts',
        'Zero-knowledge proofs'
      ],
      demoLink: null,
      docsLink: '/docs/security/fraud-detection',
      status: 'coming-soon'
    }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-primary">
              {isFr ? 'Applications de Sécurité' : 'Security Applications'}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            {isFr
              ? 'Exploitez les signatures cognitives HCS-U7 dans plusieurs cas d\'utilisation de sécurité'
              : 'Leverage HCS-U7 cognitive signatures across multiple security use cases'}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            
            return (
              <motion.div
                key={useCase.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className={`rounded-lg p-3 ${useCase.bgColor}`}>
                        <Icon className={`h-6 w-6 ${useCase.iconColor}`} />
                      </div>
                      {useCase.status === 'coming-soon' && (
                        <Badge variant="secondary" className="text-xs">
                          {isFr ? 'Bientôt' : 'Coming Soon'}
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl mt-4">{useCase.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-2">
                      {useCase.description}
                    </p>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {useCase.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex gap-2">
                      {useCase.demoLink ? (
                        <Link href={useCase.demoLink} className="flex-1">
                          <Button className="w-full gap-2" size="sm">
                            {isFr ? 'Essayer la Démo' : 'Try Demo'}
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      ) : (
                        <Button disabled className="flex-1" size="sm">
                          {isFr ? 'Bientôt Disponible' : 'Coming Soon'}
                        </Button>
                      )}
                      <Link href={useCase.docsLink}>
                        <Button variant="outline" size="sm" className="gap-1">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
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
