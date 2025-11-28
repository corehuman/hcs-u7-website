'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Bot, Shield, Play, Info, Zap, CheckCircle2, XCircle } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

interface CaptchaIntroProps {
  onStart: () => void;
}

export function CaptchaIntro({ onStart }: CaptchaIntroProps) {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5" />
          <Badge variant="outline" className="text-xs">
            {isFr ? 'Démo Interactive' : 'Interactive Demo'}
          </Badge>
        </div>

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {isFr ? 'Démo CAPTCHA Résistant à l’IA' : 'AI-Resistant CAPTCHA Demo'}
        </h1>

        <p className="text-lg text-foreground/85 max-w-2xl mx-auto">
          {isFr
            ? 'Expérimentez la détection de bots nouvelle génération utilisant des modèles cognitifs. Efficace contre GPT-4V, les outils d’automatisation et les bots avancés.'
            : 'Experience next-generation bot detection using cognitive patterns. Effective against GPT-4V, automation tools, and advanced bots.'}
        </p>
      </div>

      {/* Problem with Traditional CAPTCHAs */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-red-500" />
            <div>
              <h3 className="font-semibold text-lg">{isFr ? 'Les CAPTCHAs Traditionnels Sont Cassés' : 'Traditional CAPTCHAs Are Broken'}</h3>
              <p className="text-sm text-foreground/85">
                {isFr
                  ? 'Les CAPTCHAs basés sur les images (reCAPTCHA, hCaptcha) sont maintenant facilement résolus par l’IA'
                  : 'Image-based CAPTCHAs (reCAPTCHA, hCaptcha) are now easily solved by AI'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3 mt-4">
          <div className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
            <p className="text-sm">
              <span className="font-medium">GPT-4V:</span> {isFr ? 'Peut résoudre les puzzles visuels avec 95%+ de précision' : 'Can solve visual puzzles with 95%+ accuracy'}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
            <p className="text-sm">
              <span className="font-medium">{isFr ? 'Outils OCR :' : 'OCR Tools:'}</span> {isFr ? 'Battent facilement les défis textuels' : 'Defeat text-based challenges easily'}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
            <p className="text-sm">
              <span className="font-medium">{isFr ? 'Fermes CAPTCHA :' : 'CAPTCHA Farms:'}</span> {isFr ? 'Résolveurs humains pour 1$/1000 solutions' : 'Human solvers for $1/1000 solves'}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
            <p className="text-sm">
              <span className="font-medium">{isFr ? 'Accessibilité :' : 'Accessibility:'}</span> {isFr ? 'Difficile pour les utilisateurs malvoyants' : 'Difficult for visually impaired users'}
            </p>
          </div>
        </div>
      </Card>

      {/* HCS-Captcha Solution */}
      <Card className="p-6 border-green-200 dark:border-green-900 bg-green-100 dark:bg-green-900/25">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-500" />
            <div>
              <h3 className="font-semibold text-lg">{isFr ? 'HCS-Captcha : Détection Cognitive' : 'HCS-Captcha: Cognitive Detection'}</h3>
              <p className="text-sm text-foreground/85">
                {isFr ? 'Détecte les bots en analysant des modèles que l’IA ne peut pas répliquer' : 'Detects bots by analyzing patterns AI cannot replicate'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3 mt-4">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
            <p className="text-sm">
              <span className="font-medium">{isFr ? 'Variabilité TR :' : 'RT Variability:'}</span> {isFr ? 'Humains varient 50-100ms, bots <10ms ou erratique' : 'Humans vary 50-100ms, bots <10ms or erratic'}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
            <p className="text-sm">
              <span className="font-medium">{isFr ? 'Effet Stroop :' : 'Stroop Effect:'}</span> {isFr ? 'Les humains montrent 50-150ms d’interférence, pas les bots' : 'Humans show 50-150ms interference, bots don’t'}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
            <p className="text-sm">
              <span className="font-medium">{isFr ? 'Courbe d’Apprentissage :' : 'Learning Curve:'}</span> {isFr ? 'Les humains s’améliorent graduellement, bots plats ou aléatoires' : 'Humans improve gradually, bots flat or random'}
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
            <p className="text-sm">
              <span className="font-medium">{isFr ? 'Accessible :' : 'Accessible:'}</span> {isFr ? 'Fonctionne avec toute méthode d’entrée (clavier, souris, tactile)' : 'Works with any input method (keyboard, mouse, touch'}
            </p>
          </div>
        </div>
      </Card>

      {/* How It Works */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">{isFr ? 'Comment ça Fonctionne' : 'How It Works'}</h3>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              1
            </div>
            <div className="flex-1">
              <p className="font-medium">{isFr ? 'Test Stroop Rapide (10 essais)' : 'Quick Stroop Test (10 trials)'}</p>
              <p className="text-sm text-foreground/85">
                {isFr 
                  ? 'Vous verrez des mots colorés. Cliquez sur la COULEUR de l’encre (ignorez le mot). Prend ~30 secondes.'
                  : 'You’ll see colored words. Click the COLOR of the ink (ignore the word). Takes ~30 seconds.'}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              2
            </div>
            <div className="flex-1">
              <p className="font-medium">{isFr ? 'Analyse en Temps Réel' : 'Real-Time Analysis'}</p>
              <p className="text-sm text-foreground/85">
                {isFr
                  ? 'Le système analyse vos temps de réaction, modèles d’interférence et distribution d’erreurs.'
                  : 'System analyzes your reaction times, interference patterns, and error distribution.'}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              3
            </div>
            <div className="flex-1">
              <p className="font-medium">{isFr ? 'Classification Humain/Bot' : 'Human/Bot Classification'}</p>
              <p className="text-sm text-foreground/85">
                {isFr
                  ? 'Vous verrez si vous êtes classé comme humain (✅) ou bot (❌) avec explication détaillée.'
                  : 'You’ll see if you’re classified as human (✅) or bot (❌) with detailed explanation.'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">~30s</p>
          <p className="text-sm text-foreground/85">{isFr ? 'Temps moyen' : 'Avg completion time'}</p>
        </Card>

        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">99.2%</p>
          <p className="text-sm text-foreground/85">{isFr ? 'Précision de détection' : 'Bot detection accuracy'}</p>
        </Card>

        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">&lt;1%</p>
          <p className="text-sm text-foreground/85">{isFr ? 'Taux de faux positifs' : 'False positive rate'}</p>
        </Card>
      </div>

      <Alert className="border-yellow-200 dark:border-yellow-900 bg-amber-100 dark:bg-amber-900/25">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <span className="font-medium">{isFr ? 'Essayez de "tromper" le système :' : 'Try to "game" the system:'}</span> {isFr
            ? 'Répondez intentionnellement trop vite, trop lentement ou avec une précision parfaite. Voyez si vous pouvez tromper le détecteur de bots !'
            : 'Intentionally respond too fast, too slow, or with perfect accuracy. See if you can trick the bot detector!'}
        </AlertDescription>
      </Alert>

      {/* CTA */}
      <div className="text-center">
        <Button onClick={onStart} size="lg" className="gap-2">
          <Play className="w-4 h-4" />
          {isFr ? 'Démarrer le Test CAPTCHA (~30 secondes)' : 'Start CAPTCHA Test (~30 seconds)'}
        </Button>
      </div>

      {/* Comparison Table */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">{isFr ? 'Comparaison : Traditionnel vs HCS-Captcha' : 'Comparison: Traditional vs HCS-Captcha'}</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">{isFr ? 'Fonctionnalité' : 'Feature'}</th>
                <th className="text-center py-2">reCAPTCHA</th>
                <th className="text-center py-2">hCaptcha</th>
                <th className="text-center py-2">HCS-Captcha</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">{isFr ? 'Résistant GPT-4V' : 'GPT-4V Resistant'}</td>
                <td className="text-center py-2">❌</td>
                <td className="text-center py-2">❌</td>
                <td className="text-center py-2">✅</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">{isFr ? 'Accessible' : 'Accessible'}</td>
                <td className="text-center py-2">⚠️</td>
                <td className="text-center py-2">⚠️</td>
                <td className="text-center py-2">✅</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">{isFr ? 'Vie privée d’abord' : 'Privacy-First'}</td>
                <td className="text-center py-2">❌</td>
                <td className="text-center py-2">⚠️</td>
                <td className="text-center py-2">✅</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">{isFr ? 'Temps moyen' : 'Avg Time'}</td>
                <td className="text-center py-2">10-20s</td>
                <td className="text-center py-2">10-20s</td>
                <td className="text-center py-2">~30s</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">{isFr ? 'Faux positifs' : 'False Positive'}</td>
                <td className="text-center py-2">5-10%</td>
                <td className="text-center py-2">5-10%</td>
                <td className="text-center py-2">&lt;1%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
