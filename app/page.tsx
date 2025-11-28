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
  AlertTriangle
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
    <div className="bg-background">
      {/* Hero Section with Scientific Focus */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-50/50 to-background">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            {/* Scientific Badge */}
            <Badge variant="outline" className="mb-8 gap-2 px-4 py-1.5">
              <FlaskConical className="h-3.5 w-3.5" />
              {isFr ? 'Profilage cognitif basé sur la recherche' : 'Research-based cognitive profiling'}
            </Badge>
            
            <h1 className="mx-auto max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
              {isFr ? "Système de Profil Cognitif HCS-U7" : "HCS-U7: Cognitive Profile System"}
            </h1>
            
            <p className="mx-auto mt-6 max-w-3xl text-lg text-foreground/70">
              {isFr 
                ? "Générez votre profil cognitif scientifiquement fondé à travers des questionnaires psychométriques validés et des tests neurocognitifs objectifs"
                : "Generate your scientifically-grounded cognitive profile through validated psychometric questionnaires and objective neurocognitive tests"}
            </p>
            
            <p className="mx-auto mt-4 max-w-2xl text-base font-medium text-primary">
              {isFr
                ? "Optimisez vos interactions IA avec des signatures cognitives personnalisées"
                : "Optimize your AI interactions with personalized cognitive signatures"}
            </p>
            
            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-8">
                <Link href="/generate">
                  <Brain className="mr-2 h-4 w-4" />
                  {isFr ? "Générer mon profil" : "Generate My Profile"}
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8">
                <Link href="/docs">
                  <BookOpen className="mr-2 h-4 w-4" />
                  {isFr ? "Documentation scientifique" : "Scientific Documentation"}
                </Link>
              </Button>
            </div>
            
            {/* Credibility Badges */}
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="gap-2">
                <CheckCircle2 className="h-4 w-4" />
                {isFr ? "Empiriquement fondé" : "Empirically grounded"}
              </Badge>
              <Badge variant="secondary" className="gap-2">
                <Users className="h-4 w-4" />
                {isFr ? "Étude de validation (N=50)" : "Validation study (N=50)"}
              </Badge>
              <Badge variant="secondary" className="gap-2">
                <Github className="h-4 w-4" />
                {isFr ? "Open source (GPL v3)" : "Open source (GPL v3)"}
              </Badge>
              <Badge variant="secondary" className="gap-2">
                <BookOpen className="h-4 w-4" />
                {isFr ? "Références académiques" : "Academic references"}
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
        <motion.section
          id="problem"
          className="mt-16 grid gap-8 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {isFr ? 'Avant HCS-U7' : 'Before HCS-U7'}
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              {isFr 
                ? "Chaque nouvelle conversation avec l'IA est comme recommencer à zéro : vous devez expliquer, reconfigurer et affiner votre style encore et encore. Résultat : friction, perte de temps et frustration."
                : "Every new AI conversation feels like starting over: you must explain, reconfigure and refine your style again. Result: friction, wasted time and frustration."}
            </p>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li className="flex gap-2">
                <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                <span>{isFr ? "L'IA donne trop de détails… ou pas assez." : "The AI gives too many details… or not enough."}</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                <span>{isFr ? "Le rythme ne correspond pas à votre style cognitif." : "The pace does not match your cognitive style."}</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 text-red-600 dark:text-red-400">✕</span>
                <span>
                  {isFr ? "Vous devez répéter vos préférences à chaque nouvelle session." : "You must repeat your preferences in every new session."}
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 rounded-2xl border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {isFr ? 'Avec HCS-U7' : 'With HCS-U7'}
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              {isFr
                ? "Un seul code compact décrit comment vous apprenez, raisonnez et interagissez. Les IA peuvent alors adapter automatiquement leur comportement."
                : "A single compact code describes how you learn, reason and interact. AIs can then automatically adapt their behaviour."}
            </p>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li className="flex gap-2">
                <span className="mt-1 text-green-600 dark:text-green-400">✔</span>
                <span>
                  {isFr ? "L'IA adapte son style de réponse à votre profil cognitif." : "The AI adapts its response style to your cognitive profile."}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 text-green-600 dark:text-green-400">✔</span>
                <span>
                  {isFr 
                    ? "Les réponses sont alignées avec votre besoin de structure, de visuels, de synthèse ou de créativité."
                    : "Responses are aligned with your need for structure, visuals, synthesis or creativity."}
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 text-green-600 dark:text-green-400">✔</span>
                <span>
                  {isFr
                    ? "Configurez une fois, réutilisez avec ChatGPT, Claude, LangChain, robots physiques, etc."
                    : "Configure once, reuse across ChatGPT, Claude, LangChain, physical robots, etc."}
                </span>
              </li>
            </ul>
          </div>
        </motion.section>

        {/* How it works */}
        <motion.section
          id="how-it-works"
          className="mt-20 space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="space-y-3">
            <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {isFr ? 'Comment ça fonctionne ?' : 'How does it work?'}
            </h2>
            <p className="mx-auto max-w-2xl text-center text-sm text-foreground/70 sm:text-base">
              {isFr
                ? 'Trois étapes simples : un questionnaire de 24 questions, un code HCS-U7 généré automatiquement, puis l’intégration directe dans vos outils IA.'
                : 'Three simple steps: a 24-question survey, an automatically generated HCS-U7 code, then direct integration into your AI tools.'}
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                1
              </div>
              <h3 className="text-sm font-semibold text-foreground sm:text-base">
                {isFr ? 'Questionnaire (10 min)' : 'Questionnaire (10 min)'}
              </h3>
              <p className="text-sm text-foreground/70">
                {isFr
                  ? 'Répondez à 24 questions sur votre style cognitif, votre rythme préféré, votre sensibilité au ton et votre tolérance aux inexactitudes.'
                  : 'Answer 24 questions about your cognitive style, preferred pace, tone sensitivity and tolerance to inaccuracies.'}
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary/10 text-xs font-semibold text-secondary">
                2
              </div>
              <h3 className="text-sm font-semibold text-foreground sm:text-base">
                {isFr ? 'Génération du code' : 'Code generation'}
              </h3>
              <p className="text-sm text-foreground/70">
                {isFr ? 'Obtenez un code HCS-U7 unique tel que :' : 'Get a unique HCS-U7 code such as:'}
              </p>
              <p className="rounded-xl bg-neutral-950 px-3 py-2 font-mono text-[11px] text-neutral-50 overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-neutral-900">
                HCS-U7|V:7.0|ALG:QS|E:E|MOD:c30f40m30|COG:F15C70V20S25Cr20|INT:PB=B,SM=M,TN=L|QSIG:...
              </p>
              <p className="text-xs text-muted-foreground">
                {isFr
                  ? 'Ce code encode votre élément dominant, modalité, profil cognitif et préférences d’interaction.'
                  : 'This code encodes your dominant element, modality, cognitive profile and interaction preferences.'}
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                3
              </div>
              <h3 className="text-sm font-semibold text-foreground sm:text-base">
                {isFr ? 'Utilisation immédiate' : 'Immediate use'}
              </h3>
              <p className="text-sm text-foreground/70">
                {isFr
                  ? 'Injectez votre code HCS-U7 dans vos prompts système (ChatGPT, Claude, API) ou applications. Les réponses sont automatiquement adaptées.'
                  : 'Inject your HCS-U7 code into your system prompts (ChatGPT, Claude, API) or applications. Responses are automatically adapted.'}
              </p>
            </div>
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
                {isFr ? 'Cas d’usage' : 'Use cases'}
              </h2>
              <p className="mt-1 max-w-xl text-sm text-foreground/70 sm:text-base">
                {isFr
                  ? 'HCS-U7 est conçu pour couvrir tout le spectre : de la R&D aux applications grand public, incluant l’éducation et la robotique.'
                  : 'HCS-U7 is designed to cover the full spectrum: from R&D to consumer apps, including education and robotics.'}
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/examples">
                {isFr ? 'Parcourir les profils exemples' : 'Browse example profiles'}
                <Workflow className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-2 rounded-2xl border bg-card p-4 text-sm shadow-sm">
              <h3 className="font-semibold text-foreground">🧑‍💻 {isFr ? 'Développeurs IA' : 'AI developers'}</h3>
              <p className="text-foreground/70">
                {isFr
                  ? 'Intégrez HCS-U7 dans vos agents, assistants et copilotes pour adapter dynamiquement le style de réponse à chaque utilisateur.'
                  : 'Integrate HCS-U7 into your agents, assistants and copilots to dynamically adapt the response style to each user.'}
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl border bg-card p-4 text-sm shadow-sm">
              <h3 className="font-semibold text-foreground">📚 {isFr ? 'Étudiants & mentors' : 'Students & mentors'}</h3>
              <p className="text-foreground/70">
                {isFr
                  ? 'Ajustez le niveau de détail, le rythme et les supports (texte, diagrammes, exemples) à chaque style d’apprentissage.'
                  : 'Adjust the level of detail, pace and supports (text, diagrams, examples) to each learning style.'}
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl border bg-card p-4 text-sm shadow-sm">
              <h3 className="font-semibold text-foreground">💼 {isFr ? 'Professionnels' : 'Professionals'}</h3>
              <p className="text-foreground/70">
                {isFr
                  ? 'Optimisez les revues de code, notes de réunion, analyses et résumés selon votre façon de décider et prioriser.'
                  : 'Optimize code reviews, meeting notes, analyses and summaries to your way of deciding and prioritizing.'}
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl border bg-card p-4 text-sm shadow-sm">
              <h3 className="font-semibold text-foreground">🤖 {isFr ? 'Robotique & IHR' : 'Robotics & HRI'}</h3>
              <p className="text-foreground/70">
                {isFr
                  ? 'Couplé avec HCS-U7R (v8.0), adaptez la proxémie, le mouvement et le feedback des robots à la signature cognitive humaine.'
                  : 'Coupled with HCS-U7R (v8.0), adapt proxemics, motion and feedback of robots to the human cognitive signature.'}
              </p>
            </div>
          </div>
        </motion.section>

        {/* NEW Security Section */}
        <motion.section
          className="mt-20 space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="relative rounded-3xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 p-8 overflow-hidden">
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
                      <Lock className="h-4 w-4 text-green-600" />
                      <span>{isFr ? "Impossible à voler ou hameçonner" : "Impossible to steal or phish"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Bot className="h-4 w-4 text-blue-600" />
                      <span>{isFr ? "Détection de bots résistante à l'IA" : "AI-resistant bot detection"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Fingerprint className="h-4 w-4 text-purple-600" />
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
                    <Card className="p-4 bg-card/90 border-primary/20">
                      <div className="space-y-2">
                        <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2 w-fit">
                          <Shield className="h-5 w-5 text-blue-600" />
                        </div>
                        <h4 className="font-medium text-sm">{isFr ? "Authentification" : "Authentication"}</h4>
                        <p className="text-xs text-foreground/70">
                          {isFr ? "Tests cognitifs de 2 min" : "2-min cognitive tests"}
                        </p>
                      </div>
                    </Card>
                    <Card className="p-4 bg-card/90 border-primary/20">
                      <div className="space-y-2">
                        <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2 w-fit">
                          <Bot className="h-5 w-5 text-purple-600" />
                        </div>
                        <h4 className="font-medium text-sm">CAPTCHA</h4>
                        <p className="text-xs text-foreground/70">
                          {isFr ? "Résistant GPT-4V" : "GPT-4V resistant"}
                        </p>
                      </div>
                    </Card>
                    <Card className="p-4 bg-card/90 border-primary/20">
                      <div className="space-y-2">
                        <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-2 w-fit">
                          <Fingerprint className="h-5 w-5 text-green-600" />
                        </div>
                        <h4 className="font-medium text-sm">{isFr ? "Vérification" : "Verification"}</h4>
                        <p className="text-xs text-foreground/70">
                          {isFr ? "Comparaison de profils" : "Profile comparison"}
                        </p>
                      </div>
                    </Card>
                    <Card className="p-4 bg-card/90 border-primary/20">
                      <div className="space-y-2">
                        <div className="rounded-lg bg-orange-100 dark:bg-orange-900/30 p-2 w-fit">
                          <AlertTriangle className="h-5 w-5 text-orange-600" />
                        </div>
                        <h4 className="font-medium text-sm">{isFr ? "Détection Fraude" : "Fraud Detection"}</h4>
                        <p className="text-xs text-foreground/70">
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
          className="mt-20 rounded-3xl border bg-card p-6 shadow-sm sm:p-8"
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
              <p className="max-w-2xl text-sm text-foreground/70 sm:text-base">
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
          <div className="mt-6 grid gap-4 text-sm text-foreground/70 sm:grid-cols-4">
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

        {/* Final call-to-action banner */}
        <motion.section
          className="mt-16 rounded-2xl border border-dashed bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 p-5 sm:p-6"
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
                {isFr ? 'Prêt à personnaliser vos interactions IA ?' : 'Ready to personalize your AI interactions?'}
              </p>
              <p className="max-w-xl text-sm text-foreground/70 sm:text-base">
                {isFr
                  ? 'Démarrez le générateur HCS-U7, obtenez votre code cognitif en quelques minutes et commencez à adapter vos prompts immédiatement.'
                  : 'Start the HCS-U7 generator, get your cognitive code in a few minutes and begin tailoring your prompts right away.'}
              </p>
            </div>
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href="/generate">
                {isFr ? 'Commencer le questionnaire' : 'Start questionnaire'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
