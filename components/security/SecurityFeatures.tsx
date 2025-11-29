'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Zap, Eye, Users, Code, Fingerprint } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';

export function SecurityFeatures() {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  const features = [
    {
      icon: Shield,
      title: isFr ? 'Sécurité Intrinsèque' : 'Intrinsic Security',
      description: isFr
        ? 'Les modèles cognitifs vous sont intrinsèques—ils ne peuvent pas être volés, copiés ou transférés comme des mots de passe ou des jetons.'
        : 'Cognitive patterns are intrinsic to you—they cannot be stolen, copied, or transferred like passwords or tokens.'
    },
    {
      icon: Fingerprint,
      title: isFr ? 'Code HCS-U7 unique' : 'Unique HCS-U7 Code',
      description: isFr
        ? "Chaque session de tests génère un code HCS-U7 non reproductible, même par l'auteur. Il peut être stocké comme secret, servir de bouclier anti-bot et de profil cognitif portable entre vos applications."
        : 'Each test session generates an HCS-U7 code that is not reproducible, even by its author. It can be stored as a secret, used as an anti-bot shield and as a portable cognitive profile across your applications.'
    },
    {
      icon: Lock,
      title: isFr ? 'Preuve Cryptographique' : 'Cryptographic Proof',
      description: isFr
        ? 'Chaque profil inclut une double signature : QSIG post-quantique (lattice) + hash BLAKE3. L\'intégrité et la non-répudiation sont garanties, et toute altération est immédiatement détectée.'
        : 'Every profile includes a dual signature: post-quantum QSIG (lattice-inspired) plus a BLAKE3 hash. Integrity and non-repudiation are guaranteed, and any tampering is immediately detected.'
    },
    {
      icon: Zap,
      title: isFr ? 'Détection en Temps Réel' : 'Real-Time Detection',
      description: isFr
        ? 'Surveillez les sessions en continu. Détectez la prise de contrôle de compte en secondes quand les modèles comportementaux dévient.'
        : 'Monitor sessions continuously. Detect account takeover within seconds when behavioral patterns deviate.'
    },
    {
      icon: Eye,
      title: isFr ? 'Vie Privée d\'Abord' : 'Privacy-First',
      description: isFr
        ? 'Les tests s\'exécutent côté client par défaut. Aucune collecte de données, aucun suivi. Vous contrôlez votre signature cognitive.'
        : 'Tests run client-side by default. No data collection, no tracking. You control your cognitive signature.'
    },
    {
      icon: Users,
      title: isFr ? 'Anti-Coercition' : 'Anti-Coercion',
      description: isFr
        ? 'Les tests sous contrainte produisent des modèles détectables. Le système alerte sur les marqueurs de stress inhabituels.'
        : 'Tests under duress produce detectable patterns. System alerts on unusual stress markers or performance drops.'
    },
    {
      icon: Code,
      title: 'Open Source',
      description: isFr
        ? 'Transparence complète. Auditez le code, vérifiez les algorithmes, contribuez aux améliorations. Pas de sécurité par obscurité.'
        : 'Complete transparency. Audit the code, verify the algorithms, contribute improvements. No security through obscurity.'
    }
  ];

  return (
    <section className="py-20 section-base">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-primary">
                {isFr ? 'Fonctionnalités de Sécurité' : 'Security Features'}
              </span>
            </h2>
            <p className="text-lg text-foreground/85 max-w-3xl mx-auto">
              {isFr
                ? 'Protections intégrées que les méthodes traditionnelles ne peuvent pas fournir'
                : 'Built-in protections that traditional methods cannot provide'}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="card-interactive h-full hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="rounded-lg bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-sm text-foreground/85">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
