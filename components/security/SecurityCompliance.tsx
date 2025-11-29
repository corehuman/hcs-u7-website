'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useLanguage } from '@/components/LanguageProvider';
import { ShieldCheck, Scale, Globe2, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export function SecurityCompliance() {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  const cryptoItems = isFr
    ? [
        {
          label: 'Cryptographie post-quantique (QSIG)',
          status: 'Aligné NIST PQC',
          text: "Signatures lattice-inspirées conçues pour rester sûres même face aux ordinateurs quantiques (famille Kyber/Dilithium). Utilisé pour signer les profils HCS-U7 côté serveur.",
        },
        {
          label: 'Hash BLAKE3',
          status: '128 bits de sécurité',
          text: "Fonction de hash cryptographique moderne offrant 128 bits de sécurité classique. Combinée à QSIG pour une défense en profondeur.",
        },
        {
          label: 'Entropie biologique + compression avec perte',
          status: 'Sécurité informationnelle',
          text: "Les données cognitives brutes ne sont jamais stockées : elles sont compressées avec perte en une signature d\'environ 96 bits d\'entropie, rendant la reconstruction des temps de réaction originaux impossible même en cas de breach.",
        },
      ]
    : [
        {
          label: 'Post-quantum cryptography (QSIG)',
          status: 'NIST PQC aligned',
          text: 'Lattice-inspired signatures designed to remain secure even in the presence of quantum computers (Kyber/Dilithium family). Used to sign HCS-U7 profiles server-side.',
        },
        {
          label: 'BLAKE3 hash',
          status: '128-bit security',
          text: 'Modern cryptographic hash function providing 128 bits of classical security. Combined with QSIG for defense in depth.',
        },
        {
          label: 'Biological entropy + lossy compression',
          status: 'Information-theoretic angle',
          text: 'Raw cognitive data is never stored: it is compressed with controlled loss into a ~96-bit signature, making exact reconstruction of reaction times impossible even in case of breach.',
        },
      ];

  const regulatoryItems = isFr
    ? [
        {
          label: 'RGPD (GDPR)',
          status: 'Conçu compatible',
          text: "Tests exécutés côté client par défaut, aucune donnée biométrique brute ne quitte le navigateur. Seule la signature compressée peut être envoyée au backend, et elle est chiffrée.",
        },
        {
          label: 'PSD2 (Europe)',
          status: 'SCA compatible',
          text: "HCS-U7 peut être utilisé comme facteur d\'authentification fort, en complément d\'un device ou d\'un facteur de possession pour la Strong Customer Authentication (SCA).",
        },
        {
          label: 'CCPA (Californie)',
          status: 'Privacy by design',
          text: "Aucune vente ni monétisation des données. Les signatures HCS-U7 sont traitées comme des secrets techniques, minimisant la surface de données personnelles.",
        },
      ]
    : [
        {
          label: 'GDPR (EU)',
          status: 'Designed for compliance',
          text: 'Tests run client-side by default, no raw biometric data leaves the browser. Only the compressed signature may be sent to the backend, and it is encrypted.',
        },
        {
          label: 'PSD2 (Europe)',
          status: 'SCA compatible',
          text: 'HCS-U7 can act as a strong authentication factor, combined with a device or possession factor to satisfy Strong Customer Authentication (SCA).',
        },
        {
          label: 'CCPA (California)',
          status: 'Privacy-by-design',
          text: 'No selling or monetizing of user data. HCS-U7 signatures are treated as technical secrets, minimizing personal data exposure.',
        },
      ];

  const enterpriseItems = isFr
    ? [
        {
          label: 'SOC 2 Type II',
          status: 'En préparation',
          text: "Les contrôles de sécurité, disponibilité et confidentialité sont conçus pour être alignés sur SOC 2 Type II. Certification formelle prévue après industrialisation de la plateforme Cloud.",
        },
        {
          label: 'ANSSI / SecNumCloud (FR)',
          status: 'Cible 2026+',
          text: "Architecture pensée pour pouvoir être déployée sur des infrastructures éligibles SecNumCloud. Priorité donnée aux clients bancaires et sectoriels français.",
        },
        {
          label: 'ISO 27001 & FedRAMP',
          status: 'Sur la feuille de route',
          text: "Objectif : alignement progressif des pratiques de gestion de la sécurité de l\'information et des déploiements multi-région (UE/US) avec ISO 27001 et FedRAMP, en fonction des partenariats.",
        },
      ]
    : [
        {
          label: 'SOC 2 Type II',
          status: 'In preparation',
          text: 'Security, availability and confidentiality controls are designed to be SOC 2 Type II-aligned. Formal certification is planned as the managed Cloud offering matures.',
        },
        {
          label: 'ANSSI / SecNumCloud (FR)',
          status: 'Target 2026+',
          text: 'Architecture is designed to be deployable on SecNumCloud-eligible infrastructure, with priority for French banking and regulated-sector customers.',
        },
        {
          label: 'ISO 27001 & FedRAMP',
          status: 'On the roadmap',
          text: 'Goal: progressively align information security management and multi-region (EU/US) deployments with ISO 27001 and FedRAMP, depending on customer partnerships.',
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
            {isFr ? 'Conformité & standards' : 'Compliance & standards'}
          </p>
          <h2 className="mt-2 text-3xl font-bold md:text-4xl">
            {isFr
              ? 'Conçu pour les banques, la fintech et les environnements régulés'
              : 'Designed for banks, fintech and regulated environments'}
          </h2>
          <p className="mt-3 text-sm text-foreground/85 md:text-base max-w-3xl mx-auto">
            {isFr
              ? "HCS-U7 combine une cryptographie de nouvelle génération, une protection forte de la vie privée et une architecture alignée sur les cadres de conformité modernes (RGPD, PSD2, SOC 2, ISO 27001)."
              : 'HCS-U7 combines next-generation cryptography, strong privacy guarantees and an architecture aligned with modern compliance frameworks (GDPR, PSD2, SOC 2, ISO 27001).'}
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Crypto standards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="card-base h-full">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {isFr ? 'Standards cryptographiques' : 'Cryptographic standards'}
                    </p>
                    <p className="text-sm font-semibold">
                      {isFr ? 'Résistance quantique & intégrité' : 'Quantum resistance & integrity'}
                    </p>
                  </div>
                </div>
                <ul className="mt-2 space-y-2 text-xs text-foreground/85 md:text-sm">
                  {cryptoItems.map((item) => (
                    <li key={item.label} className="rounded-lg bg-muted/40 p-2">
                      <p className="text-xs font-semibold md:text-sm">
                        {item.label}
                        <span className="ml-1 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                          {item.status}
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-foreground/80 md:text-[13px]">
                        {item.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Privacy & regulation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            viewport={{ once: true }}
          >
            <Card className="card-base h-full">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Scale className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {isFr ? 'Réglementaire & vie privée' : 'Regulatory & privacy'}
                    </p>
                    <p className="text-sm font-semibold">
                      {isFr ? 'Protection des données dès la conception' : 'Data protection by design'}
                    </p>
                  </div>
                </div>
                <ul className="mt-2 space-y-2 text-xs text-foreground/85 md:text-sm">
                  {regulatoryItems.map((item) => (
                    <li key={item.label} className="rounded-lg bg-muted/40 p-2">
                      <p className="text-xs font-semibold md:text-sm">
                        {item.label}
                        <span className="ml-1 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                          {item.status}
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-foreground/80 md:text-[13px]">
                        {item.text}
                      </p>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enterprise & certifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="card-base h-full">
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <Globe2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                      {isFr ? 'Clients enterprise' : 'Enterprise clients'}
                    </p>
                    <p className="text-sm font-semibold">
                      {isFr ? 'Certifications & audits' : 'Certifications & audits'}
                    </p>
                  </div>
                </div>
                <ul className="mt-2 space-y-2 text-xs text-foreground/85 md:text-sm">
                  {enterpriseItems.map((item) => (
                    <li key={item.label} className="rounded-lg bg-muted/40 p-2">
                      <p className="text-xs font-semibold md:text-sm">
                        {item.label}
                        <span className="ml-1 inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                          {item.status}
                        </span>
                      </p>
                      <p className="mt-1 text-xs text-foreground/80 md:text-[13px]">
                        {item.text}
                      </p>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-[11px] text-foreground/70 flex items-start gap-1">
                  <Lock className="mt-0.5 h-3 w-3 text-primary" />
                  <span>
                    {isFr
                      ? "Statut indicatif : certaines certifications sont en cours de préparation ou planifiées. Les détails précis (audits, rapports) sont partagés dans le cadre des discussions enterprise."
                      : 'Status indication only: some certifications are in preparation or planned. Detailed reports and audits are shared as part of enterprise discussions.'}
                  </span>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
