'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Code, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';

export function SecurityCTA() {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  return (
    <section className="py-20 section-base">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Card className="card-base bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 border-primary/25">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {isFr
                  ? 'Créez votre sécurité avec un code HCS-U7 inviolable par un bot ou une IA'
                  : 'Create your security with an HCS-U7 code that bots and AI cannot brute-force'}
              </h2>
              <p className="text-lg text-foreground/85 mb-8 max-w-2xl mx-auto">
                {isFr
                  ? 'Votre code HCS-U7 est un secret cognitif unique, impraticable à deviner pour un bot ou une IA, et très difficile à rejouer exactement, même par vous-même. Essayez nos démos interactives ou intégrez HCS-U7 dans votre application aujourd\'hui.'
                  : 'Your HCS-U7 code is a unique cognitive secret, impractical for bots or AI to guess and extremely hard to replay exactly—even for you. Try our interactive demos or integrate HCS-U7 into your application today.'}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/security/auth-demo">
                  <Button size="lg" className="gap-2">
                    <Play className="h-4 w-4" />
                    {isFr ? 'Essayer la Démo d\'Authentification' : 'Try Authentication Demo'}
                  </Button>
                </Link>
                <Link href="/docs/security">
                  <Button size="lg" variant="outline" className="gap-2">
                    <Code className="h-4 w-4" />
                    {isFr ? 'Voir la Documentation' : 'View Developer Docs'}
                  </Button>
                </Link>
              </div>

              <div className="rounded-lg bg-muted/50 p-6 mb-12">
                <p className="text-sm text-foreground/85 mb-4">
                  {isFr
                    ? 'Besoins de sécurité d\'entreprise ? Intégration personnalisée requise ?'
                    : 'Enterprise security needs? Custom integration required?'}
                </p>
                <Link href="mailto:security@hcs-u7.com">
                  <Button variant="outline" className="gap-2">
                    <Mail className="h-4 w-4" />
                    {isFr ? 'Contacter l\'Équipe Sécurité' : 'Contact Security Team'}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Additional CTAs */}
          <div className="grid gap-6 md:grid-cols-3 mt-12">
            <Card className="card-base h-full section-base">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">
                  {isFr ? 'Pour les Développeurs' : 'For Developers'}
                </h3>
                <p className="text-sm text-foreground/85 mb-4">
                  {isFr ? 'Niveau gratuit : 100 auth/mois' : 'Free tier: 100 auths/month'}
                </p>
                <Link href="/developers/api-key">
                  <Button className="w-full" size="sm">
                    {isFr ? 'Obtenir une Clé API' : 'Get API Key'}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="card-base h-full">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">
                  {isFr ? 'Pour les Chercheurs' : 'For Researchers'}
                </h3>
                <p className="text-sm text-foreground/85 mb-4">
                  {isFr ? 'Accès académique & ensembles de données' : 'Academic access & datasets'}
                </p>
                <Link href="/research/program">
                  <Button className="w-full" size="sm">
                    {isFr ? 'Programme de Recherche' : 'Research Program'}
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">
                  {isFr ? 'Pour les Entreprises' : 'For Enterprises'}
                </h3>
                <p className="text-sm text-foreground/85 mb-4">
                  {isFr ? 'SLA personnalisés & support' : 'Custom SLAs & support'}
                </p>
                <Link href="/pricing">
                  <Button className="w-full" size="sm">
                    {isFr ? 'Voir les Tarifs' : 'View Pricing'}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
