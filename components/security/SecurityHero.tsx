'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, ArrowRight, Play } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';

export function SecurityHero() {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <motion.div
          className="absolute top-20 left-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>
      
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center space-y-8">
          {/* Badge NEW */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block"
          >
            <Badge variant="outline" className="px-4 py-2 text-sm font-medium border-primary/50 bg-primary/10">
              <Shield className="h-3 w-3 mr-2" />
              {isFr ? 'NOUVEAU' : 'NEW'}
              <span className="mx-2">•</span>
              {isFr ? 'Solutions de Sécurité Cognitive' : 'Cognitive Security Solutions'}
            </Badge>
          </motion.div>
          
          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight"
          >
            {isFr ? 'Remplacez les Mots de Passe par la' : 'Replace Passwords with'}
            <span className="block text-primary mt-2">
              {isFr ? 'Biométrie Cognitive' : 'Cognitive Biometrics'}
            </span>
          </motion.h1>
          
          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-foreground/85 max-w-3xl mx-auto"
          >
            {isFr 
              ? 'Générez un code HCS-U7 à partir de profils cognitifs validés scientifiquement pour l\'authentification et la détection de fraude. Conçu pour résister aux bots et à l\'IA, impossible à voler ou deviner.'
              : 'Generate an HCS-U7 code from scientifically grounded cognitive profiles for authentication and fraud detection. Designed to resist bots and AI, impossible to steal or guess.'}
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-foreground/85 max-w-2xl mx-auto"
          >
            {isFr
              ? 'Utilisez votre code HCS-U7 comme profil cognitif pour l\'authentification, la détection de bots et la personnalisation d\'IA.'
              : 'Use your HCS-U7 code as a cognitive profile for authentication, bot detection, and AI personalization.'}
          </motion.p>
          
          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Link href="/security/auth-demo">
              <Button size="lg" className="gap-2 px-8">
                <Play className="h-4 w-4" />
                {isFr ? 'Essayer les Démos' : 'Try Interactive Demos'}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link href="/docs/security">
              <Button variant="outline" size="lg" className="gap-2 px-8">
                <Shield className="h-4 w-4" />
                {isFr ? 'Documentation Technique' : 'Technical Documentation'}
              </Button>
            </Link>
          </motion.div>
          
          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap gap-6 justify-center text-sm text-foreground/85 pt-8"
          >
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-green-600" />
              {isFr ? 'Signé cryptographiquement' : 'Cryptographically signed'}
            </span>
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-600" />
              {isFr ? 'Vie privée d\'abord (côté client)' : 'Privacy-first (client-side)'}
            </span>
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-purple-600" />
              {isFr ? 'Résistant à l\'IA' : 'AI-resistant'}
            </span>
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-orange-600" />
              {isFr ? 'Open source' : 'Open-source'}
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
