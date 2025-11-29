"use client";

import Link from "next/link";
import { 
  ArrowRight, 
  Brain, 
  Shield, 
  Sparkles, 
  Zap, 
  FlaskConical, 
  BookOpen, 
  Award, 
  Users, 
  CheckCircle2, 
  Github, 
  Workflow,
  Lock,
  Fingerprint,
  Bot,
  AlertTriangle,
  XCircle,
  Info
} from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/components/LanguageProvider";

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function HomePage() {
  const { lang } = useLanguage();
  const isFr = lang === "fr";

  return (
    <div>
      {/* Hero Section with Scientific Focus */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 to-background/80 backdrop-blur-sm"></div>
        
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            {/* Scientific Badge */}
            <Badge variant="outline" className="mb-8 gap-2 px-4 py-1.5">
              <Shield className="h-3.5 w-3.5" />
              {isFr ? 'Détection de Bots par Science Comportementale' : 'Bot Detection via Behavioral Science'}
            </Badge>
            
            <h1 className="mx-auto max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
              {isFr ? "Détectez les Bots & Vérifiez les Humains avec des Patterns Cognitifs" : "Detect Bots & Verify Humans with Cognitive Patterns"}
            </h1>
            
            <p className="mx-auto mt-6 max-w-3xl text-lg text-foreground/70">
              {isFr 
                ? "Détection de bots de nouvelle génération utilisant la science comportementale. Résistant à l'IA, respectueux de la vie privée, accessible."
                : "Next-generation bot detection using behavioral science. AI-resistant, privacy-first, accessible."}
            </p>
            
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-primary">
              {isFr
                ? "97% de précision contre GPT-4V et outils d'automation avancés"
                : "97% accuracy against GPT-4V and advanced automation tools"}
            </p>
            
            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/security/captcha-demo">
                  <Bot className="mr-2 h-4 w-4" />
                  {isFr ? "Essayer le Détecteur de Bots" : "Try Bot Detector"}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link href="/how-it-works">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {isFr ? "Comment ça Marche" : "See How It Works"}
                </Link>
              </Button>
            </div>
            
            {/* Credibility Badges */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="gap-2">
                <Shield className="h-4 w-4" />
                {isFr ? "97% Taux de Détection" : "97% Detection Rate"}
              </Badge>
              <Badge variant="secondary" className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {isFr ? "<1% Faux Positifs" : "<1% False Positives"}
              </Badge>
              <Badge variant="secondary" className="gap-2">
                <Zap className="h-4 w-4" />
                {isFr ? "30s en moyenne" : "30s average time"}
              </Badge>
              <Badge variant="secondary" className="gap-2">
                <Github className="h-4 w-4" />
                {isFr ? "100% Open Source" : "100% Open Source"}
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <motion.section
          id="problem"
          className="mt-16 space-y-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h2 className="text-center text-3xl font-semibold tracking-tight text-foreground">
            {isFr ? 'Les CAPTCHAs Traditionnels Sont Cassés' : 'Traditional CAPTCHAs Are Broken'}
          </h2>
          
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {isFr ? 'CAPTCHAs basés sur les images' : 'Image-Based CAPTCHAs'}
                <Badge variant="destructive" className="ml-3 text-xs">reCAPTCHA, hCaptcha</Badge>
              </h3>
              <ul className="space-y-3 text-sm text-foreground/80">
                <li className="flex gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>{isFr ? "Résolu par GPT-4V (95%+ taux de réussite)" : "Solved by GPT-4V (95%+ success rate)"}</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>{isFr ? "Frustrant pour les humains (10-20s)" : "Annoying for humans (10-20s)"}</span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    {isFr ? "Problèmes d'accessibilité (vision requise)" : "Accessibility issues (vision required)"}
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                  <span>
                    {isFr ? "Atteinte à la vie privée (tracking Google)" : "Privacy concerns (Google tracking)"}
                  </span>
                </li>
              </ul>
              
              <div className="mt-6 p-4 bg-red-100/95 dark:bg-red-900/30 backdrop-blur-sm rounded-lg border border-red-200 dark:border-red-800/50">
                <h4 className="font-semibold text-sm mb-2 text-red-900 dark:text-red-100">
                  {isFr ? "L'Économie des Bots" : "The Bot Economy"}
                </h4>
                <ul className="space-y-1 text-xs text-red-600 dark:text-red-400">
                  <li>• {isFr ? "100 milliards $+ pertes fraude/an" : "$100B+ fraud losses annually"}</li>
                  <li>• {isFr ? "40% du trafic web = bots" : "40% of web traffic is bots"}</li>
                  <li>• {isFr ? "+24% piratages de comptes (2023)" : "24% increase in account takeover (2023)"}</li>
                </ul>
              </div>
            </div>

            <div className="space-y-4 rounded-2xl card-success backdrop-blur-sm p-6 shadow-sm">
              <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">
                {isFr ? 'Solution HCS-U7' : 'HCS-U7 Solution'}
                <Badge className="ml-3 text-xs bg-green-600">{isFr ? 'Résistant IA' : 'AI-Resistant'}</Badge>
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">✓ {isFr ? 'Analyse de Patterns Cognitifs' : 'Cognitive Pattern Analysis'}</h4>
                  <p className="text-sm opacity-90">
                    {isFr
                      ? "Mesure la variabilité du temps de réaction, l'effet Stroop, les courbes d'apprentissage—des patterns que les bots IA ne peuvent pas répliquer."
                      : "Measures reaction time variability, Stroop effect, learning curves—patterns that AI bots cannot replicate even with advanced models."}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm mb-2">✓ {isFr ? 'Respectueux des Humains' : 'Human-Friendly'}</h4>
                  <p className="text-sm opacity-90">
                    {isFr
                      ? "Rapide (~30s), accessible (clavier/souris/tactile), pas de puzzles visuels frustrants."
                      : "Quick (~30s), accessible (keyboard/mouse/touch), no frustrating visual puzzles."}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-sm mb-2">✓ {isFr ? 'Vie Privée Protégée' : 'Privacy-First'}</h4>
                  <p className="text-sm opacity-90">
                    {isFr
                      ? "Traitement côté client, pas de tracking, conforme RGPD."
                      : "Client-side processing, no tracking, GDPR compliant."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Value Propositions */}
        <motion.section
          className="mt-20 space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {isFr ? 'Trois Piliers de Valeur' : 'Three Value Pillars'}
          </h2>
          
          <div className="grid gap-5 md:grid-cols-3">
            <Card className="p-6 border-2 hover:border-primary/50 transition-colors bg-card/95 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="inline-flex p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Shield className="h-6 w-6 text-purple-900 dark:text-purple-100" />
                </div>
                <h3 className="font-semibold text-lg">
                  {isFr ? 'Détection de Bots Résistante à l’IA' : 'AI-Resistant Bot Detection'}
                </h3>
                <p className="text-sm text-foreground/75">
                  {isFr
                    ? "Détectez GPT-4V, outils d'automation et bots avancés avec 97%+ de précision en utilisant des patterns cognitifs que l'IA ne peut pas répliquer."
                    : "Detect GPT-4V, automation tools, and advanced bots with 97%+ accuracy using cognitive patterns AI cannot replicate."}
                </p>
                <div className="pt-2">
                  <Badge variant="outline" className="text-xs">
                    97% detection rate
                  </Badge>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/security/captcha-demo">
                    {isFr ? 'Essayer la Démo CAPTCHA' : 'Try CAPTCHA Demo'}
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </Card>
            
            <Card className="p-6 border-2 hover:border-primary/50 transition-colors bg-card/95 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="inline-flex p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <Users className="h-6 w-6 text-blue-900 dark:text-blue-100" />
                </div>
                <h3 className="font-semibold text-lg">
                  {isFr ? 'Vérification Humaine à Grande Échelle' : 'Human Verification at Scale'}
                </h3>
                <p className="text-sm text-foreground/75">
                  {isFr
                    ? "Vérifiez de vrais humains sans tracking invasif ou puzzles frustrants. Accessible, respectueux de la vie privée, conforme RGPD."
                    : "Verify real humans without invasive tracking or annoying puzzles. Accessible, privacy-first, GDPR compliant."}
                </p>
                <div className="pt-2">
                  <Badge variant="outline" className="text-xs">
                    {'<'}1% false positive
                  </Badge>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/examples">
                    {isFr ? 'Voir les Exemples' : 'See Examples'}
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </Card>
            
            <Card className="p-6 border-2 hover:border-primary/50 transition-colors bg-card/95 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="inline-flex p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Github className="h-6 w-6 text-green-900 dark:text-green-100" />
                </div>
                <h3 className="font-semibold text-lg">
                  {isFr ? 'Open Source & Facile pour Développeurs' : 'Open Source & Developer-Friendly'}
                </h3>
                <p className="text-sm text-foreground/75">
                  {isFr
                    ? "Intégrez en quelques minutes avec notre REST API, SDK ou widget intégrable. Transparence totale, pas de boîte noire."
                    : "Integrate in minutes with our REST API, SDK, or embeddable widget. Full transparency, no black box."}
                </p>
                <div className="pt-2">
                  <Badge variant="outline" className="text-xs">
                    5 min setup
                  </Badge>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href="/docs">
                    {isFr ? 'Lire la Documentation' : 'Read Docs'}
                    <ArrowRight className="ml-2 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </Card>
          </div>
        </motion.section>

        {/* Use cases */}
        <motion.section
          className="mt-20 space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {isFr ? 'Cas d’usage dans le monde réel' : 'Real-World Use Cases'}
              </h2>
              <p className="mt-1 max-w-xl text-sm text-foreground/75 sm:text-base">
                {isFr
                  ? 'Protégez votre plateforme des bots, fraudes et automatisation abusive avec HCS-U7.'
                  : 'Protect your platform from bots, fraud, and abusive automation with HCS-U7.'}
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/security">
                {isFr ? 'Explorer tous les cas' : 'Explore all cases'}
                <Shield className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <Card className="p-4 hover:shadow-lg transition-shadow bg-card/95 backdrop-blur-sm">
              <div className="space-y-3">
                <div className="inline-flex p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                  <Shield className="h-5 w-5 text-purple-900 dark:text-purple-100" />
                </div>
                <h3 className="font-semibold">{isFr ? 'Protection de Formulaires' : 'Bot Protection'}</h3>
                <p className="text-sm text-foreground/70">
                  {isFr
                    ? "Protégez formulaires d'inscription, pages de connexion et endpoints API des attaques automatisées."
                    : "Protect signup forms, login pages, and API endpoints from automated attacks."}
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">E-commerce</Badge>
                  <Badge variant="outline" className="text-xs">SaaS</Badge>
                  <Badge variant="outline" className="text-xs">Gaming</Badge>
                </div>
                <p className="text-xs font-semibold text-primary">
                  {isFr ? "Bloque 99% du trafic bot" : "Block 99% of bot traffic"}
                </p>
              </div>
            </Card>
            
            <Card className="p-4 hover:shadow-lg transition-shadow bg-card/95 backdrop-blur-sm">
              <div className="space-y-3">
                <div className="inline-flex p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <CheckCircle2 className="h-5 w-5 text-blue-900 dark:text-blue-100" />
                </div>
                <h3 className="font-semibold">{isFr ? 'Vérification Humaine' : 'Human Verification'}</h3>
                <p className="text-sm text-foreground/70">
                  {isFr
                    ? "Vérifiez de vrais humains pour accès au contenu, concours, votes, enquêtes."
                    : "Verify real humans for content access, giveaways, voting, surveys."}
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">Media</Badge>
                  <Badge variant="outline" className="text-xs">Marketing</Badge>
                  <Badge variant="outline" className="text-xs">Research</Badge>
                </div>
                <p className="text-xs font-semibold text-primary">
                  {isFr ? "5x plus rapide que CAPTCHA" : "5x faster than CAPTCHA"}
                </p>
              </div>
            </Card>
            
            <Card className="p-4 hover:shadow-lg transition-shadow bg-card/95 backdrop-blur-sm">
              <div className="space-y-3">
                <div className="inline-flex p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                  <AlertTriangle className="h-5 w-5 text-orange-900 dark:text-orange-100" />
                </div>
                <h3 className="font-semibold">{isFr ? 'Détection de Fraude' : 'Fraud Detection'}</h3>
                <p className="text-sm text-foreground/70">
                  {isFr
                    ? "Détectez piratages de comptes et comportements suspects en temps réel."
                    : "Detect account takeovers and suspicious behavior in real-time."}
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">Fintech</Badge>
                  <Badge variant="outline" className="text-xs">Banking</Badge>
                  <Badge variant="outline" className="text-xs">Insurance</Badge>
                </div>
                <p className="text-xs font-semibold text-primary">
                  {isFr ? "Détection en 2-3s" : "2-3s detection time"}
                </p>
              </div>
            </Card>
            
            <Card className="p-4 hover:shadow-lg transition-shadow bg-card/95 backdrop-blur-sm">
              <div className="space-y-3">
                <div className="inline-flex p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                  <Zap className="h-5 w-5 text-green-900 dark:text-green-100" />
                </div>
                <h3 className="font-semibold">{isFr ? 'Limitation de Taux API' : 'API Rate Limiting'}</h3>
                <p className="text-sm text-foreground/70">
                  {isFr
                    ? "Limitation intelligente basée sur vérification humaine, pas juste IP."
                    : "Intelligent rate limiting based on human verification, not just IP."}
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">API</Badge>
                  <Badge variant="outline" className="text-xs">Cloud</Badge>
                  <Badge variant="outline" className="text-xs">DevOps</Badge>
                </div>
                <p className="text-xs font-semibold text-primary">
                  {isFr ? "-80% faux blocages" : "Reduce false blocks by 80%"}
                </p>
              </div>
            </Card>
          </div>
        </motion.section>

        {/* NEW Security Section */}
        <motion.section
          className="mt-20 space-y-6 relative"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="relative rounded-3xl bg-gradient-to-br from-primary/15 via-primary/10 to-primary/5 backdrop-blur-sm border border-primary/20 p-8 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
            
            <div className="relative">
              <div className="flex items-start justify-between">
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center gap-3">
                    <Badge className="gap-1.5 bg-primary/10 text-primary hover:bg-primary/20">
                      <Shield className="h-3 w-3" />
                      {isFr ? "NOUVEAU" : "NEW"}
                    </Badge>
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                      {isFr ? "Sécurité Cognitive" : "Cognitive Security"}
                    </h2>
                  </div>
                  <p className="text-base text-foreground/70">
                    {isFr
                      ? "Utilisez les profils HCS-U7 pour l'authentification, la détection de fraude et la prévention des bots. Remplacez les mots de passe par des signatures cognitives biométriques."
                      : "Use HCS-U7 profiles for authentication, fraud detection, and bot prevention. Replace passwords with cognitive biometric signatures."}
                  </p>
                  
                  <div className="flex flex-wrap gap-3 pt-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Lock className="h-4 w-4 text-green-900 dark:text-green-100" />
                      <span>{isFr ? "Impossible à voler ou hameçonner" : "Impossible to steal or phish"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Bot className="h-4 w-4 text-blue-900 dark:text-blue-100" />
                      <span>{isFr ? "Détection de bots résistante à l'IA" : "AI-resistant bot detection"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Fingerprint className="h-4 w-4 text-purple-900 dark:text-purple-100" />
                      <span>{isFr ? "Vie privée (côté client)" : "Privacy-first (client-side)"}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 pt-4">
                    <Button asChild className="gap-2">
                      <Link href="/security">
                        {isFr ? "Explorer la Sécurité" : "Explore Security"}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="gap-2">
                      <Link href="/security/auth-demo">
                        {isFr ? "Essayer la Démo" : "Try Demo"}
                      </Link>
                    </Button>
                  </div>
                </div>
                
                {/* Security illustration/grid */}
                <div className="hidden lg:block">
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="p-4 bg-card/95 backdrop-blur-sm border-primary/20">
                      <div className="space-y-2">
                        <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800/50 p-2 w-fit">
                          <Shield className="h-5 w-5 text-blue-900 dark:text-blue-100" />
                        </div>
                        <h4 className="font-medium text-sm">{isFr ? "Authentification" : "Authentication"}</h4>
                        <p className="text-xs text-foreground/85">
                          {isFr ? "Tests cognitifs de 2 min" : "2-min cognitive tests"}
                        </p>
                      </div>
                    </Card>
                    <Card className="p-4 bg-card/95 backdrop-blur-sm border-primary/20">
                      <div className="space-y-2">
                        <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800/50 p-2 w-fit">
                          <Bot className="h-5 w-5 text-purple-900 dark:text-purple-100" />
                        </div>
                        <h4 className="font-medium text-sm">CAPTCHA</h4>
                        <p className="text-xs text-foreground/85">
                          {isFr ? "Résistant GPT-4V" : "GPT-4V resistant"}
                        </p>
                      </div>
                    </Card>
                    <Card className="p-4 bg-card/95 backdrop-blur-sm border-primary/20">
                      <div className="space-y-2">
                        <div className="rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50 p-2 w-fit">
                          <Fingerprint className="h-5 w-5 text-green-900 dark:text-green-100" />
                        </div>
                        <h4 className="font-medium text-sm">{isFr ? "Vérification" : "Verification"}</h4>
                        <p className="text-xs text-foreground/85">
                          {isFr ? "Comparaison de profils" : "Profile comparison"}
                        </p>
                      </div>
                    </Card>
                    <Card className="p-4 bg-card/95 backdrop-blur-sm border-primary/20">
                      <div className="space-y-2">
                        <div className="rounded-lg bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800/50 p-2 w-fit">
                          <AlertTriangle className="h-5 w-5 text-orange-900 dark:text-orange-100" />
                        </div>
                        <h4 className="font-medium text-sm">{isFr ? "Détection Fraude" : "Fraud Detection"}</h4>
                        <p className="text-xs text-foreground/85">
                          {isFr ? "Temps réel" : "Real-time"}
                        </p>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Open source & validated */}
        <motion.section
          className="mt-20 rounded-3xl border bg-card/95 backdrop-blur-sm p-6 shadow-sm sm:p-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                {isFr ? 'Open source & validé empiriquement' : 'Open source & empirically validated'}
              </h2>
              <p className="max-w-2xl text-sm text-foreground/75 sm:text-base">
                {isFr
                  ? 'HCS-U7 est distribué sous licence MIT avec des parseurs officiels (Python, JavaScript, ROS2) et un protocole de validation expérimental axé sur la qualité de l’interaction humain-IA.'
                  : 'HCS-U7 is distributed under the MIT license with official parsers (Python, JavaScript, ROS2) and an experimental validation protocol focused on human–AI interaction quality.'}
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="h-4 w-4" />
                {isFr ? 'Voir le dépôt' : 'View repository'}
              </a>
            </Button>
          </div>
          <div className="mt-6 grid gap-4 text-sm text-foreground/75 sm:grid-cols-4">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/90">
                {isFr ? 'Licence' : 'License'}
              </p>
              <p>{isFr ? '100% Open source (MIT)' : '100% Open source (MIT)'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/90">
                {isFr ? 'Parseurs officiels' : 'Official parsers'}
              </p>
              <p>Python, JavaScript, ROS2 (HCS-U7R)</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/90">
                Validation
              </p>
              <p>{isFr ? 'Protocole empirique N=50 (croisé randomisé)' : 'Empirical protocol N=50 (randomized crossover)'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/90">
                {isFr ? 'Signal social' : 'Social signal'}
              </p>
              <p>{isFr ? 'GitHub ~1.2k⭐ · prépublication disponible sur arXiv' : 'GitHub ~1.2k⭐ · preprint available on arXiv'}</p>
            </div>
          </div>
        </motion.section>

        {/* What HCS-U7 Is & Isn't - Transparency Section */}
        <motion.section
          className="mt-20 space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-card/95 to-primary/10 backdrop-blur-sm">
            <CardContent className="p-8">
              <h2 className="text-2xl font-semibold tracking-tight text-center mb-8">
                {isFr ? "Ce que HCS-U7 Est et N'est Pas" : "What HCS-U7 Is & Isn't"}
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* What It IS */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    {isFr ? "Ce que HCS-U7 Fait Excellemment" : "What HCS-U7 Does Best"}
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">
                          {isFr ? "Détection de Bots (97%+ précision)" : "Bot Detection (97%+ accuracy)"}
                        </p>
                        <p className="text-xs text-foreground/85">
                          {isFr ? "Détecte automation, modèles IA, et outils de scraping" : "Detect automation, AI models, and scraping tools"}
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">
                          {isFr ? "CAPTCHA Résistant à l'IA" : "AI-Resistant CAPTCHA"}
                        </p>
                        <p className="text-xs text-foreground/85">
                          {isFr ? "Fonctionne contre GPT-4V et modèles vision avancés" : "Works against GPT-4V and advanced vision models"}
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">
                          {isFr ? "Score de Risque Comportemental" : "Behavioral Risk Scoring"}
                        </p>
                        <p className="text-xs text-foreground/85">
                          {isFr ? "Ajoute une couche cognitive à votre stack de sécurité" : "Add cognitive layer to existing security stack"}
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">
                          {isFr ? "Plateforme de Recherche" : "Research Platform"}
                        </p>
                        <p className="text-xs text-foreground/85">
                          {isFr ? "Tests cognitifs de qualité académique avec code open-source" : "Academic-grade cognitive testing with open-source code"}
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                {/* What It ISN'T */}
                <div>
                  <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                    {isFr ? "Ce que HCS-U7 N'est PAS (Encore)" : "What HCS-U7 Is NOT (Yet)"}
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex gap-3">
                      <XCircle className="h-4 w-4 text-amber-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">
                          {isFr ? "Authentification Autonome" : "Standalone Authentication"}
                        </p>
                        <p className="text-xs text-foreground/85">
                          {isFr ? "Pas assez précis pour remplacer mots de passe (utilisez comme Layer 2)" : "Not precise enough to replace passwords entirely (use as Layer 2)"}
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <XCircle className="h-4 w-4 text-amber-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">
                          {isFr ? "KYC Réglementaire" : "Regulatory-Grade KYC"}
                        </p>
                        <p className="text-xs text-foreground/85">
                          {isFr ? "Pas certifié pour conformité (RGPD-friendly mais pas KYC-approved)" : "Not certified for compliance (GDPR-friendly but not KYC-approved)"}
                        </p>
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <XCircle className="h-4 w-4 text-amber-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">
                          {isFr ? "ID Biométrique Unique" : "Unique Biometric ID"}
                        </p>
                        <p className="text-xs text-foreground/85">
                          {isFr ? "Patterns cognitifs se chevauchent entre individus (~70-80% similarité même personne)" : "Cognitive patterns overlap between individuals (~70-80% similarity for same person)"}
                        </p>
                      </div>
                    </li>
                  </ul>
                  
                  <Alert className="mt-6">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {isFr
                        ? "Pourquoi être honnête ? Nous croyons en la transparence. HCS-U7 est excellent pour la détection de bots (notre focus), mais nous ne survenderons pas des capacités que nous n'avons pas prouvées à l'échelle."
                        : "Why be honest? We believe in transparency. HCS-U7 is excellent for bot detection (our focus), but we won't oversell capabilities we haven't proven at scale."}
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Final call-to-action banner */}
        <motion.section
          className="mt-16 rounded-2xl border border-dashed bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-sm p-5 sm:p-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                <Zap className="h-4 w-4" />
                {isFr ? 'Prêt à protéger votre plateforme des bots ?' : 'Ready to protect your platform from bots?'}
              </p>
              <p className="max-w-xl text-sm text-foreground/75 sm:text-base">
                {isFr
                  ? 'Essayez notre CAPTCHA cognitif en 30 secondes et voyez comment il détecte les patterns non-humains avec 97% de précision.'
                  : 'Try our cognitive CAPTCHA in 30 seconds and see how it detects non-human patterns with 97% accuracy.'}
              </p>
            </div>
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href="/security/captcha-demo">
                {isFr ? 'Essayer le CAPTCHA' : 'Try CAPTCHA Demo'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
