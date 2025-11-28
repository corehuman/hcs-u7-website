'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';

export function SecurityAdvantages() {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  const comparison = [
    {
      feature: isFr ? 'Immunisé au phishing' : 'Immune to phishing',
      password: false,
      sms2fa: false,
      biometric: true,
      hcs: true
    },
    {
      feature: isFr ? 'Ne peut pas être volé' : 'Cannot be stolen',
      password: false,
      sms2fa: false,
      biometric: false,
      hcs: true
    },
    {
      feature: isFr ? 'Ne peut pas être deviné' : 'Cannot be guessed',
      password: false,
      sms2fa: true,
      biometric: true,
      hcs: true
    },
    {
      feature: isFr ? 'Aucune dépendance à l\'appareil' : 'No device dependency',
      password: true,
      sms2fa: false,
      biometric: false,
      hcs: true
    },
    {
      feature: isFr ? 'Respectueux de la vie privée' : 'Privacy-preserving',
      password: true,
      sms2fa: false,
      biometric: false,
      hcs: true
    },
    {
      feature: isFr ? 'Résistant à l\'IA' : 'AI-resistant',
      password: false,
      sms2fa: false,
      biometric: false,
      hcs: true
    },
    {
      feature: isFr ? 'Aucune trace permanente' : 'No permanent traces',
      password: true,
      sms2fa: true,
      biometric: false,
      hcs: true
    },
    {
      feature: isFr ? 'Fonctionne hors ligne (inscription)' : 'Works offline (enrollment)',
      password: true,
      sms2fa: false,
      biometric: true,
      hcs: true
    },
    {
      feature: isFr ? 'Multi-facteurs par conception' : 'Multi-factor by design',
      password: false,
      sms2fa: false,
      biometric: false,
      hcs: true
    },
    {
      feature: isFr ? 'Accessible' : 'Accessible',
      password: true,
      sms2fa: true,
      biometric: false,
      hcs: true
    }
  ];

  const StatusIcon = ({ status }: { status: boolean | 'partial' }) => {
    if (status === true) return <CheckCircle2 className="h-5 w-5 text-green-600" />;
    if (status === 'partial') return <AlertCircle className="h-5 w-5 text-yellow-600" />;
    return <XCircle className="h-5 w-5 text-destructive" />;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-primary/5">
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
                {isFr ? 'Pourquoi HCS-U7 est Supérieur' : 'Why HCS-U7 is Superior'}
              </span>
            </h2>
            <p className="text-lg text-foreground/85 max-w-3xl mx-auto">
              {isFr
                ? 'Comparaison complète avec les méthodes d\'authentification traditionnelles'
                : 'Comprehensive comparison with traditional authentication methods'}
            </p>
          </div>

          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 border-b">
                      <th className="text-left p-4 font-semibold">
                        {isFr ? 'Fonctionnalité de Sécurité' : 'Security Feature'}
                      </th>
                      <th className="text-center p-4 font-semibold">
                        {isFr ? 'Mots de passe' : 'Passwords'}
                      </th>
                      <th className="text-center p-4 font-semibold">SMS 2FA</th>
                      <th className="text-center p-4 font-semibold">
                        {isFr ? 'Biométrie' : 'Biometric'}
                      </th>
                      <th className="text-center p-4 font-semibold bg-primary/10">
                        HCS-U7
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted/30 transition-colors">
                        <td className="p-4">{row.feature}</td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center">
                            <StatusIcon status={row.password} />
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center">
                            <StatusIcon status={row.sms2fa} />
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center">
                            <StatusIcon status={row.biometric} />
                          </div>
                        </td>
                        <td className="p-4 text-center bg-primary/10">
                          <div className="flex justify-center">
                            <StatusIcon status={row.hcs} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="border-primary/50 bg-primary/5">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-primary">10/10</div>
                <p className="text-sm text-foreground/85 mt-2">
                  {isFr ? 'Score de Sécurité HCS-U7' : 'HCS-U7 Security Score'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-foreground/85">4/10</div>
                <p className="text-sm text-foreground/85 mt-2">
                  {isFr ? 'Moyenne Mots de passe' : 'Passwords Average'}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-foreground/85">6/10</div>
                <p className="text-sm text-foreground/85 mt-2">
                  {isFr ? 'Moyenne Biométrie' : 'Biometric Average'}
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
