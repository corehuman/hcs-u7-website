import { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Brain,
  Zap,
  Shield,
  TrendingUp,
  CheckCircle,
  XCircle,
  Info,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Comment Ça Marche | HCS-U7',
  description: 'Découvrez la science derrière la détection de bots par patterns cognitifs',
};

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-6xl">
      {/* Hero */}
      <div className="text-center mb-12">
        <Badge variant="outline" className="mb-4 gap-2">
          Science Comportementale
        </Badge>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Comment HCS-U7 Détecte les Bots
        </h1>
        <p className="text-lg text-foreground/70 max-w-3xl mx-auto">
          Les bots IA peuvent résoudre des puzzles visuels, mais ils ne peuvent 
          pas répliquer les patterns cognitifs humains uniques.
        </p>
      </div>

      {/* Core Concept */}
      <Card className="mb-12">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-6">
            3 Patterns Cognitifs Impossibles à Simuler
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Pattern 1 : RT Variability */}
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                <Brain className="h-6 w-6 text-purple-900 dark:text-purple-100" />
              </div>
              <h3 className="font-semibold">Variabilité du Temps de Réaction</h3>
              <p className="text-sm text-foreground/70">
                Les humains ont une variabilité naturelle de 50-100ms dans leurs 
                temps de réaction. Les bots sont trop consistants ({'<'}10ms) ou 
                trop aléatoires ({'>'}150ms).
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-emerald-600 text-emerald-50 dark:bg-emerald-500">
                  <span>✅ Humain:</span>
                  <code className="bg-transparent">SD = 65ms</code>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-red-600 text-red-50 dark:bg-red-500">
                  <span>❌ Bot:</span>
                  <code className="bg-transparent">SD = 3ms</code>
                </div>
              </div>
            </div>

            {/* Pattern 2 : Stroop Effect */}
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <Zap className="h-6 w-6 text-blue-900 dark:text-blue-100" />
              </div>
              <h3 className="font-semibold">Effet Stroop</h3>
              <p className="text-sm text-foreground/70">
                Quand le mot "ROUGE" est écrit en bleu, les humains ralentissent 
                de 50-150ms (interférence cognitive). Les bots n'ont pas cette 
                interférence.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-emerald-600 text-emerald-50 dark:bg-emerald-500">
                  <span>✅ Humain:</span>
                  <code className="bg-transparent">+80ms</code>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-red-600 text-red-50 dark:bg-red-500">
                  <span>❌ Bot:</span>
                  <code className="bg-transparent">+0ms</code>
                </div>
              </div>
            </div>

            {/* Pattern 3 : Learning Curve */}
            <div className="space-y-4">
              <div className="inline-flex p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <TrendingUp className="h-6 w-6 text-green-900 dark:text-green-100" />
              </div>
              <h3 className="font-semibold">Courbe d'Apprentissage</h3>
              <p className="text-sm text-foreground/70">
                Les humains s'améliorent graduellement sur plusieurs essais. 
                Les bots ont une performance plate ou erratique.
              </p>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-emerald-600 text-emerald-50 dark:bg-emerald-500">
                  <span>✅ Humain:</span>
                  <code className="bg-transparent">-15ms après 10 trials</code>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-red-600 text-red-50 dark:bg-red-500">
                  <span>❌ Bot:</span>
                  <code className="bg-transparent">Flat ou random</code>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bot Detection Algorithm */}
      <Card className="mb-12">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-6">
            Algorithme de Détection
          </h2>

          <pre className="p-4 bg-neutral-950 text-neutral-50 rounded-lg overflow-x-auto text-sm">
{`function detectBot(userPerformance) {
  // 1. Mesurer variabilité RT
  const rtVariability = calculateSD(reactionTimes);
  
  // 2. Détecter effet Stroop
  const stroopEffect = avgIncongruent - avgCongruent;
  
  // 3. Analyser courbe d'apprentissage
  const learningSlope = calculateLearning(trials);
  
  // 4. Pattern d'erreurs
  const errorPattern = analyzeErrors(mistakes);
  
  // RÈGLES DE DÉTECTION
  let botScore = 0;
  
  if (rtVariability < 40 || rtVariability > 150) {
    botScore += 40; // Trop consistant ou trop aléatoire
  }
  
  if (Math.abs(stroopEffect) < 20) {
    botScore += 30; // Pas d'interférence = bot
  }
  
  if (Math.abs(learningSlope) < 5) {
    botScore += 20; // Pas d'apprentissage = bot
  }
  
  if (errorPattern === 'random' || errorPattern === 'none') {
    botScore += 10; // Pattern non-humain
  }
  
  // VERDICT
  if (botScore >= 50) {
    return { isBot: true, confidence: botScore };
  }
  
  return { isBot: false, confidence: 100 - botScore };
}`}
          </pre>
        </CardContent>
      </Card>

      {/* Comparison: Humans vs Bots */}
      <Card className="mb-12">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-6">
            Humains vs Bots : Tableau Comparatif
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Métrique</th>
                  <th className="text-center py-2">
                    <Badge className="bg-green-600">Humain</Badge>
                  </th>
                  <th className="text-center py-2">
                    <Badge variant="destructive">Bot IA</Badge>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3">RT Variability (SD)</td>
                  <td className="text-center">
                    <code className="px-2 py-1 rounded text-xs bg-success-subtle text-green-900 dark:text-green-100">
                      50-100ms
                    </code>
                  </td>
                  <td className="text-center">
                    <code className="px-2 py-1 rounded text-xs bg-danger-subtle text-red-900 dark:text-red-100">
                      {'<'}10ms ou {'>'}150ms
                    </code>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Effet Stroop</td>
                  <td className="text-center">
                    <code className="px-2 py-1 rounded text-xs bg-success-subtle text-green-900 dark:text-green-100">
                      50-150ms
                    </code>
                  </td>
                  <td className="text-center">
                    <code className="px-2 py-1 rounded text-xs bg-danger-subtle text-red-900 dark:text-red-100">
                      0ms (absence)
                    </code>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Courbe Apprentissage</td>
                  <td className="text-center">
                    <code className="px-2 py-1 rounded text-xs bg-success-subtle text-green-900 dark:text-green-100">
                      Amélioration graduelle
                    </code>
                  </td>
                  <td className="text-center">
                    <code className="px-2 py-1 rounded text-xs bg-danger-subtle text-red-900 dark:text-red-100">
                      Flat ou erratique
                    </code>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Pattern Erreurs</td>
                  <td className="text-center">
                    <code className="px-2 py-1 rounded text-xs bg-success-subtle text-green-900 dark:text-green-100">
                      Clustered (fatigue)
                    </code>
                  </td>
                  <td className="text-center">
                    <code className="px-2 py-1 rounded text-xs bg-danger-subtle text-red-900 dark:text-red-100">
                      Random ou none
                    </code>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Précision</td>
                  <td className="text-center">
                    <code className="px-2 py-1 rounded text-xs bg-success-subtle text-green-900 dark:text-green-100">
                      85-95%
                    </code>
                  </td>
                  <td className="text-center">
                    <code className="px-2 py-1 rounded text-xs bg-danger-subtle text-red-900 dark:text-red-100">
                      100% (suspect) ou {'<'}70%
                    </code>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <Alert className="mt-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Résultat :</strong> En combinant ces 4-5 métriques, 
              HCS-U7 atteint <strong>97%+ de précision</strong> dans la détection de bots, 
              y compris GPT-4V et outils d'automation avancés.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Limitations (Honnêteté) */}
      <Card className="mb-12">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-6">
            Limitations & Use Cases Appropriés
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Ce que ça fait bien */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Excellent Pour
              </h3>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                  <span className="text-sm">Bot detection - 97%+ précision</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                  <span className="text-sm">CAPTCHA - AI-resistant, accessible</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                  <span className="text-sm">Risk scoring - Layer 2 de sécurité</span>
                </li>
                <li className="flex gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-1" />
                  <span className="text-sm">Recherche - Tests cognitifs validés</span>
                </li>
              </ul>
            </div>

            {/* Ce que ça ne fait pas (encore) */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <XCircle className="h-5 w-5 text-amber-600" />
                Pas Recommandé Pour
              </h3>
              <ul className="space-y-2">
                <li className="flex gap-2">
                  <XCircle className="h-4 w-4 text-amber-600 mt-1" />
                  <span className="text-sm">Auth primaire - Trop de faux rejets (15-20%)</span>
                </li>
                <li className="flex gap-2">
                  <XCircle className="h-4 w-4 text-amber-600 mt-1" />
                  <span className="text-sm">KYC réglementaire - Non certifié</span>
                </li>
                <li className="flex gap-2">
                  <XCircle className="h-4 w-4 text-amber-600 mt-1" />
                  <span className="text-sm">ID biométrique unique - Patterns se chevauchent</span>
                </li>
                <li className="flex gap-2">
                  <XCircle className="h-4 w-4 text-amber-600 mt-1" />
                  <span className="text-sm">Haute sécurité seul - Utiliser en combinaison</span>
                </li>
              </ul>
            </div>
          </div>

          <Alert className="mt-6" variant="default">
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Pourquoi cette honnêteté ?</strong> Nous croyons à la 
              transparence. HCS-U7 est excellent pour la détection de bots 
              (notre focus), mais nous ne survenderons pas des capacités que 
              nous n'avons pas prouvées à l'échelle.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Prêt à Tester ?
          </h2>
          <p className="text-foreground/70 mb-6 max-w-2xl mx-auto">
            Essayez notre CAPTCHA cognitif en 30 secondes et voyez comment 
            il détecte les patterns non-humains.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/security/captcha-demo">
                <Shield className="mr-2 h-4 w-4" />
                Try CAPTCHA Demo
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/docs">
                Read API Docs
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
