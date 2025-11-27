'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, Shield, CheckCircle2, X, Info } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';

export function ProblemSolution() {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  const problems = [
    {
      stat: '81%',
      description: isFr 
        ? 'des violations de données impliquent des mots de passe faibles ou volés'
        : 'of data breaches involve weak or stolen passwords',
      source: 'Verizon DBIR 2024'
    },
    {
      stat: '$4.45M',
      description: isFr
        ? 'coût moyen d\'une violation de données en 2023'
        : 'average cost of a data breach in 2023',
      source: 'IBM Security'
    },
    {
      stat: '60%',
      description: isFr
        ? 'des utilisateurs réutilisent les mots de passe sur plusieurs sites'
        : 'of users reuse passwords across sites',
      source: 'Google Survey'
    }
  ];

  const limitations = [
    {
      method: isFr ? 'Mots de passe' : 'Passwords',
      issues: isFr 
        ? ['Facilement volés (hameçonnage)', 'Oubliés fréquemment', 'Réutilisés sur plusieurs sites', 'Faibles par défaut']
        : ['Easily stolen (phishing)', 'Forgotten frequently', 'Reused across sites', 'Weak by default']
    },
    {
      method: 'SMS 2FA',
      issues: isFr
        ? ['Attaques par échange de SIM', 'Interception possible', 'Pas respectueux de la vie privée', 'Nécessite un téléphone']
        : ['SIM swapping attacks', 'Interception possible', 'Not privacy-friendly', 'Requires phone']
    },
    {
      method: isFr ? 'Empreinte/Face ID' : 'Fingerprint/Face ID',
      issues: isFr
        ? ['Peut être usurpé (deepfakes)', 'Problèmes de confidentialité', 'Dépendant de l\'appareil', 'Laisse des traces permanentes']
        : ['Can be spoofed (deepfakes)', 'Privacy concerns', 'Device-dependent', 'Leaves permanent traces']
    }
  ];

  const advantages = isFr ? [
    'Intrinsèque à la personne (ne peut pas être volé)',
    'Impossible à deviner ou forcer',
    'Aucune vulnérabilité au phishing (rien à révéler)',
    'Préservation de la vie privée (tests locaux)',
    'Résistant à l\'IA (modèles humains trop complexes)',
    'Aucune dépendance à l\'appareil (fonctionne partout)'
  ] : [
    'Intrinsic to the person (cannot be stolen)',
    'Impossible to guess or brute-force',
    'No phishing vulnerability (nothing to reveal)',
    'Privacy-preserving (tests run locally)',
    'AI-resistant (human patterns too complex)',
    'No device dependency (works anywhere)'
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-primary/5">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2">
          
          {/* Problem: Current Security Failures */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center gap-3 text-destructive mb-4">
                  <AlertTriangle className="h-6 w-6" />
                  <span className="font-semibold uppercase tracking-wider text-sm">
                    {isFr ? 'Le Problème' : 'The Problem'}
                  </span>
                </div>
                <CardTitle className="text-2xl">
                  {isFr ? 'L\'authentification Traditionnelle est Cassée' : 'Traditional Authentication is Broken'}
                </CardTitle>
                <p className="text-muted-foreground">
                  {isFr
                    ? 'Les mots de passe et les méthodes 2FA actuelles ne protègent pas contre les menaces modernes'
                    : 'Passwords and current 2FA methods fail to protect against modern threats'}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Statistics */}
                <div className="grid grid-cols-3 gap-4">
                  {problems.map((problem, idx) => (
                    <div key={idx} className="text-center">
                      <div className="text-2xl font-bold text-destructive">
                        {problem.stat}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {problem.description}
                      </div>
                      <div className="text-[10px] text-muted-foreground/70 mt-1">
                        {problem.source}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Limitations Table */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">
                    {isFr ? 'Méthodes Actuelles & Leurs Limites' : 'Current Methods & Their Limitations'}
                  </h4>
                  <div className="space-y-2">
                    {limitations.map((item, idx) => (
                      <div key={idx} className="border rounded-lg p-3">
                        <div className="font-medium mb-2">{item.method}</div>
                        <ul className="space-y-1">
                          {item.issues.map((issue, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <X className="h-3 w-3 text-destructive mt-0.5 flex-shrink-0" />
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Solution: HCS-U7 Cognitive Security */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card className="h-full border-primary/20">
              <CardHeader>
                <div className="flex items-center gap-3 text-primary mb-4">
                  <Shield className="h-6 w-6" />
                  <span className="font-semibold uppercase tracking-wider text-sm">
                    {isFr ? 'La Solution' : 'The Solution'}
                  </span>
                </div>
                <CardTitle className="text-2xl">
                  {isFr ? 'Authentification Biométrique Cognitive' : 'Cognitive Biometric Authentication'}
                </CardTitle>
                <p className="text-muted-foreground">
                  {isFr
                    ? 'HCS-U7 utilise vos modèles cognitifs uniques comme signature d\'identité infalsifiable'
                    : 'HCS-U7 uses your unique cognitive patterns as an unforgeable identity signature'}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <Alert className="border-primary/50 bg-primary/5">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {isFr
                      ? 'Comment ça marche : Les utilisateurs effectuent des tests cognitifs rapides (Stroop, Temps de Réaction, etc.) qui mesurent des modèles intrinsèques comme la variabilité du temps de réaction, les effets d\'interférence et la vitesse de traitement. Ces modèles sont aussi uniques qu\'une empreinte digitale mais impossibles à voler ou falsifier.'
                      : 'How it works: Users complete quick cognitive tests (Stroop, Reaction Time, etc.) that measure intrinsic patterns like reaction time variability, interference effects, and processing speed. These patterns are as unique as a fingerprint but impossible to steal or fake.'}
                  </AlertDescription>
                </Alert>

                {/* Advantages Grid */}
                <div className="grid grid-cols-1 gap-2">
                  {advantages.map((advantage, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/5 transition-colors">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{advantage}</span>
                    </div>
                  ))}
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">99.9%</div>
                    <div className="text-xs text-muted-foreground">
                      {isFr ? 'Impossible à voler' : 'Unstealable'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">0%</div>
                    <div className="text-xs text-muted-foreground">
                      {isFr ? 'Risque de phishing' : 'Phishing risk'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">100%</div>
                    <div className="text-xs text-muted-foreground">
                      {isFr ? 'Vie privée' : 'Privacy'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
