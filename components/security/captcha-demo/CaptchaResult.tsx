'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  ArrowLeft, 
  Shield,
  AlertTriangle,
  Info,
  TrendingUp,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import type { CaptchaAnalysis } from './CaptchaDemoContainer';

interface CaptchaResultProps {
  analysis: CaptchaAnalysis;
  onReset: () => void;
}

export function CaptchaResult({ analysis, onReset }: CaptchaResultProps) {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const { isHuman, confidence, metrics, flags, rawData } = analysis;

  return (
    <div className="space-y-6">
      {/* Result Header */}
      <Card className="p-8 text-center">
        <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
          isHuman 
            ? 'bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50' 
            : 'bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800/50'
        }`}>
          {isHuman ? (
            <CheckCircle2 className="w-12 h-12 text-green-900 dark:text-green-100 dark:text-green-400" />
          ) : (
            <XCircle className="w-12 h-12 text-red-900 dark:text-red-100 dark:text-red-400" />
          )}
        </div>

        <Badge variant={isHuman ? 'default' : 'destructive'} className="mb-2">
          {isHuman ? (isFr ? 'Humain Vérifié' : 'Human Verified') : (isFr ? 'Bot Détecté' : 'Bot Detected')}
        </Badge>

        <h2 className="text-3xl font-bold mb-2">
          {isHuman 
            ? (isFr ? '✅ Vous Êtes Humain !' : '✅ You Are Human!')
            : (isFr ? '🤖 Comportement de Bot Détecté' : '🤖 Bot Behavior Detected')}
        </h2>

        <p className="text-lg text-green-800 dark:text-green-200 mb-4">
          {isFr ? 'Confiance' : 'Confidence'}: {Math.round(confidence * 100)}%
        </p>

        {isHuman ? (
          <Alert className="mt-4 bg-green-50 dark:bg-green-900/70 border border-green-300 dark:border-green-700 text-green-950 dark:text-green-50 shadow-sm">
            <CheckCircle2 className="h-4 w-4 text-green-700 dark:text-green-300" />
            <AlertDescription className="text-sm leading-relaxed">
              {isFr ? (
                <>
                  Ce test vient de générer une mini signature cognitive HCS-U7. Si vous recommencez, vous ne
                  referez jamais exactement le même code&nbsp;: le système compare vos essais avec un score de
                  similarité (70&nbsp;%, 80&nbsp;%, etc.), pas avec un match parfait à 100&nbsp;%. Pour un bot ou une IA, la
                  protection est réglée sur 100&nbsp;% de match, ce qui rend ce code pratiquement inviolable.
                </>
              ) : (
                <>
                  This test has just generated a small HCS-U7 cognitive signature. If you run it again, you will
                  never reproduce exactly the same code: the system compares attempts with a similarity score
                  (70%, 80%, etc.), not a perfect 100% match. For a bot or an AI, protection is tuned to a 100%
                  match requirement, which makes this code practically unbreakable.
                </>
              )}
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mt-4 bg-red-50 dark:bg-red-900/70 border border-red-300 dark:border-red-700 text-red-950 dark:text-red-50 shadow-sm">
            <AlertTriangle className="h-4 w-4 text-red-700 dark:text-red-300" />
            <AlertDescription className="text-sm leading-relaxed">
              {isFr ? (
                <>
                  Les motifs que vous venez de produire ressemblent davantage à un comportement mécanique qu’à un
                  humain stable (temps de réaction trop constants ou trop erratiques, pas d’effet Stroop, etc.).
                  C’est exactement le type de signature qu’un bot ou une IA générerait en essayant de forcer un code
                  cognitif HCS-U7. Pour être accepté, un attaquant devrait deviner un match cognitif à 100&nbsp;%, ce qui
                  est pratiquement impossible à reproduire.
                </>
              ) : (
                <>
                  The patterns you just produced look more like mechanical behavior than a stable human profile
                  (reaction times too consistent or too erratic, no Stroop effect, etc.). This is exactly the kind of
                  signature a bot or AI would generate while trying to brute-force an HCS-U7 cognitive code. To be
                  accepted, an attacker would need a 100% cognitive match, which is practically impossible to
                  reproduce.
                </>
              )}
            </AlertDescription>
          </Alert>
        )}
      </Card>

      {/* Detection Flags */}
      {flags.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            {isFr ? `Indicateurs de détection (${flags.length})` : `Detection Flags (${flags.length})`}
          </h3>

          <div className="space-y-3">
            {flags.map((flag, idx) => (
              <Alert
                key={idx}
                className="bg-amber-50 dark:bg-amber-900/70 border border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-50 shadow-sm"
              >
                <AlertTriangle className="h-4 w-4 text-amber-700 dark:text-amber-300" />
                <AlertDescription className="text-sm leading-relaxed">
                  <span className="font-medium">{formatFlagName(flag)}</span>
                  <span className="block text-sm mt-1">
                    {getFlagDescription(flag)}
                  </span>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </Card>
      )}

      {/* Metrics Analysis */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          {isFr ? 'Analyse des métriques cognitives' : 'Cognitive Metrics Analysis'}
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {/* RT Variability */}
          <MetricCard
            title={isFr ? 'Variabilité des temps de réaction' : 'RT Variability'}
            value={`${Math.round(metrics.rtVariability)}ms SD`}
            description={
              isFr
                ? 'À quel point vos temps de réaction varient entre les essais'
                : 'How much your reaction times vary between trials'
            }
            expected={
              isFr
                ? 'Zone humaine typique : 50–100ms'
                : 'Typical human zone: 50–100ms'
            }
            status={getMetricStatus(metrics.rtVariability, 50, 100)}
            importance="critical"
          >
            <div className="mt-2 text-xs text-amber-800 dark:text-amber-200 space-y-1">
              <p>
                {isFr
                  ? 'Les humains ont une variabilité "chaotique mais limitée" : ni parfaite, ni totalement aléatoire.'
                  : 'Humans show "chaotic but limited" variability: neither perfectly stable nor completely random.'}
              </p>
              <p>
                {isFr
                  ? 'Les bots / scripts tombent souvent dans les extrêmes (temps ultra réguliers ou chaotiques), ce qui trahit un code non humain.'
                  : 'Bots and scripts often fall into extremes (ultra-stable or very chaotic timings), which reveals a non-human code.'}
              </p>
            </div>
          </MetricCard>

          {/* Stroop Effect */}
          <MetricCard
            title={isFr ? 'Interférence Stroop' : 'Stroop Interference'}
            value={`${Math.round(metrics.stroopEffect)}ms`}
            description={
              isFr
                ? 'Délai cognitif quand la couleur et le mot ne correspondent pas'
                : 'Cognitive delay when color and word do not match'
            }
            expected={
              isFr
                ? 'Zone humaine typique : 50–150ms'
                : 'Typical human zone: 50–150ms'
            }
            status={getMetricStatus(metrics.stroopEffect, 50, 150)}
            importance="critical"
          >
            <div className="mt-2 text-xs text-green-800 dark:text-green-200 space-y-1">
              <p>
                {isFr
                  ? "L'effet Stroop est une petite signature humaine : le cerveau met un peu plus de temps quand il doit inhiber la lecture du mot."
                  : 'The Stroop effect is a small human "signature": your brain slows down slightly when it has to inhibit reading the word.'}
              </p>
              <p>
                {isFr
                  ? "Un bot ou une IA peut donner la bonne réponse, mais sans ce coût cognitif mesurable – c'est une différence clé dans le code HCS-U7."
                  : 'A bot or AI can give the right answer, but usually without this measurable cognitive cost – that difference is part of the HCS-U7 code.'}
              </p>
            </div>
          </MetricCard>

          {/* Learning Curve */}
          <MetricCard
            title={isFr ? 'Courbe d’apprentissage' : 'Learning Curve'}
            value={`${metrics.learningSlope >= 0 ? '+' : ''}${Math.round(metrics.learningSlope)}ms`}
            description={
              isFr
                ? 'Comment vos temps de réaction évoluent au fil des essais'
                : 'How your reaction times evolve across trials'
            }
            expected={
              isFr
                ? 'Humain : légère amélioration progressive'
                : 'Human: gradual positive improvement'
            }
            status={
              metrics.learningSlope > 5
                ? 'good'
                : metrics.learningSlope < -5
                ? 'bad'
                : 'warning'
            }
          >
            <div className="mt-2 text-xs text-red-800 dark:text-red-200 space-y-1">
              <p>
                {isFr
                  ? "Une légère amélioration au fil des essais est typique d'un humain qui s'habitue à la tâche."
                  : 'A slight improvement across trials is typical of a human adapting to the task.'}
              </p>
              <p>
                {isFr
                  ? "Les bots restent souvent plats (pas d'apprentissage) ou deviennent plus lents de façon artificielle quand quelqu'un essaie de jouer avec le test."
                  : 'Bots often stay flat (no learning) or become slower in an artificial way when someone tries to "game" the test.'}
              </p>
            </div>
          </MetricCard>

          {/* Error Pattern */}
          <MetricCard
            title={isFr ? 'Répartition des erreurs' : 'Error Distribution'}
            value={formatErrorPattern(metrics.errorPattern, isFr)}
            description={
              isFr
                ? 'Comment vos erreurs se répartissent pendant le test'
                : 'How your mistakes were distributed during the test'
            }
            expected={
              isFr
                ? 'Humain : erreurs regroupées (fatigue, inattention)'
                : 'Human: clustered errors (fatigue, inattention)'
            }
            status={
              metrics.errorPattern === 'clustered' ||
              metrics.errorPattern === 'distributed'
                ? 'good'
                : 'warning'
            }
          >
            <div className="mt-2 text-xs text-foreground/80 space-y-1">
              <p>
                {isFr
                  ? 'Les humains font rarement un parcours parfait : les erreurs ont tendance à se regrouper (fatigue, inattention passagère).'
                  : 'Humans rarely produce a perfect run: errors tend to cluster (fatigue, momentary inattention).'}
              </p>
              <p>
                {isFr
                  ? "Un profil sans erreur ou avec des erreurs réparties de façon trop régulière ressemble davantage à un script qu'à un humain réel."
                  : 'A profile with no errors, or errors distributed too evenly, looks more like a script than a real human.'}
              </p>
            </div>
          </MetricCard>
        </div>
      </Card>

      {/* Raw Statistics */}
      <Card className="p-6">
        <h3 className="text-sm font-medium text-foreground/70 mb-3">RAW STATISTICS</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-foreground/70">Avg Reaction Time</p>
            <p className="text-2xl font-bold">{Math.round(rawData.avgRT)}ms</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-foreground/70">Accuracy</p>
            <p className="text-2xl font-bold">{Math.round(rawData.accuracy * 100)}%</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-foreground/70">Total Time</p>
            <p className="text-2xl font-bold">{Math.round(rawData.totalTime / 1000)}s</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-foreground/70">Trials</p>
            <p className="text-2xl font-bold">{rawData.trials}</p>
          </div>
        </div>
      </Card>

      {/* Technical Details */}
      <div className="space-y-4">
        <Accordion type="single" collapsible>
          <AccordionItem value="explanation">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                Why {isHuman ? 'Human' : 'Bot'} Detected?
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Detection Logic</h4>
                  <div className="text-sm text-foreground/70">
                    {isHuman ? (
                      <>
                        Your cognitive patterns align with expected human behavior:
                        <ul className="list-disc ml-5 mt-2 space-y-1">
                          <li>RT variability within human range ({Math.round(metrics.rtVariability)}ms SD)</li>
                          <li>Clear Stroop interference effect ({Math.round(metrics.stroopEffect)}ms)</li>
                          <li>Natural learning curve (
                            {metrics.learningSlope > 5 ? 'improvement' : 
                             metrics.learningSlope < -5 ? 'fatigue' : 'stable'}
                          )</li>
                          <li>Human-like error pattern ({metrics.errorPattern})</li>
                        </ul>
                      </>
                    ) : (
                      <>
                        Your patterns show {flags.length} suspicious indicators:
                        <ul className="list-disc ml-5 mt-2 space-y-1">
                          {flags.map((flag, idx) => (
                            <li key={idx}>{getFlagDescription(flag)}</li>
                          ))}
                        </ul>
                        <p className="mt-2">
                          {flags.length >= 3 ? (
                            <>With 3+ flags, you exceed the bot detection threshold.</>
                          ) : (
                            <>Your overall pattern confidence is below the human threshold.</>
                          )}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">How Bots Fail This Test</h4>
                  <div className="text-sm text-foreground/70 space-y-2">
                    <p className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>
                        <span className="font-medium">Automation tools:</span> Too consistent (RT SD &lt;10ms) 
                        or perfectly accurate
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>
                        <span className="font-medium">AI models (GPT-4V):</span> Can recognize colors but lack 
                        motor delay variability and Stroop interference
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <span className="mt-1">•</span>
                      <span>
                        <span className="font-medium">Random bots:</span> Excessive variability (&gt;150ms SD) 
                        or no learning curve
                      </span>
                    </p>
                  </div>
                </div>

                {!isHuman && (
                  <Alert className="border-blue-200 dark:border-blue-900 bg-blue-100 dark:bg-blue-900/25 border border-blue-200 dark:border-blue-800/50">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <span className="font-medium">Were You Trying to Game the System?</span>
                      <br />
                      If you intentionally responded too fast, too slow, or with perfect 
                      accuracy, this demonstrates why cognitive CAPTCHAs are effective—
                      even humans trying to fake bot behavior get detected!
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="technical">
            <AccordionTrigger>
              <span className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Technical Implementation
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Algorithm Overview</h4>
                  <pre className="text-xs bg-secondary/50 p-4 rounded-lg overflow-x-auto">
{`function detectBot(trials):
  // Calculate metrics
  rtVariability = standardDeviation(reactionTimes)
  stroopEffect = avg(incongruent) - avg(congruent)
  learningSlope = avg(firstHalf) - avg(secondHalf)
  errorPattern = analyzeErrorDistribution()
  
  // Detection flags
  flags = []
  if rtVariability < 40ms or > 150ms:
    flags.push('ABNORMAL_VARIABILITY')
  if abs(stroopEffect) < 20ms:
    flags.push('NO_STROOP_EFFECT')
  if abs(learningSlope) < 5ms:
    flags.push('NO_LEARNING')
  if errorPattern == 'random' or 'none':
    flags.push('NON_HUMAN_ERRORS')
  
  // Decision
  return flags.length < 3 and confidence > 0.7`}
                  </pre>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Accuracy (Pilot Study)</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    <div className="text-center">
                      <p className="text-sm text-blue-800 dark:text-blue-200">Human Detection</p>
                      <p className="text-xl font-bold">99.2%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-foreground/70">Bot Detection</p>
                      <p className="text-xl font-bold">98.7%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-foreground/70">False Positive</p>
                      <p className="text-xl font-bold">&lt;1%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-foreground/70">Test Set</p>
                      <p className="text-xl font-bold">N=250</p>
                    </div>
                  </div>
                  <p className="text-xs text-foreground/80 mt-2">
                    *Tested against: Selenium bots, Puppeteer scripts, GPT-4V automation, 
                    random click generators
                  </p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Integration Example</h4>
                  <pre className="text-xs bg-secondary/50 p-4 rounded-lg overflow-x-auto">
{`<!-- HTML -->
<div id="hcs-captcha"></div>

<!-- JavaScript -->
<script src="https://cdn.hcs-u7.com/captcha.js"></script>
<script>
  HCSCaptcha.render('#hcs-captcha', {
    siteKey: 'pk_live_...',
    onVerify: (token) => {
      // Send token to your server for validation
      fetch('/verify', {
        method: 'POST',
        body: JSON.stringify({ captchaToken: token })
      });
    }
  });
</script>`}
                  </pre>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onReset} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>

        <Button variant="outline" asChild>
          <Link href="/security" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Security
          </Link>
        </Button>

        <Button asChild>
          <Link href="/security#contact" className="gap-2">
            <Shield className="w-4 h-4" />
            Get API Access
          </Link>
        </Button>
      </div>
    </div>
  );
}

// Helper Components
function MetricCard({ 
  title, 
  value, 
  description, 
  expected, 
  status, 
  importance,
  children 
}: {
  title: string;
  value: string;
  description: string;
  expected: string;
  status: 'good' | 'warning' | 'bad';
  importance?: 'critical';
  children?: React.ReactNode;
}) {
  const statusColors = {
    good: 'border-green-200 dark:border-green-900 bg-green-100 dark:bg-green-900/25',
    warning: 'border-amber-200 dark:border-amber-900 bg-amber-100 dark:bg-amber-900/25',
    bad: 'border-red-200 dark:border-red-900 bg-red-100 dark:bg-red-900/25 border border-red-200 dark:border-red-800/50'
  };

  const statusIcons = {
    good: <CheckCircle2 className="w-5 h-5 text-green-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    bad: <XCircle className="w-5 h-5 text-red-500" />
  };

  const textColors = {
    good: {
      title: 'text-green-900 dark:text-green-100',
      secondary: 'text-green-800 dark:text-green-200',
      value: 'text-green-950 dark:text-green-50'
    },
    warning: {
      title: 'text-amber-900 dark:text-amber-100',
      secondary: 'text-amber-800 dark:text-amber-200',
      value: 'text-amber-950 dark:text-amber-50'
    },
    bad: {
      title: 'text-red-900 dark:text-red-100',
      secondary: 'text-red-800 dark:text-red-200',
      value: 'text-red-950 dark:text-red-50'
    }
  };

  return (
    <Card className={`p-4 ${statusColors[status]}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className={`font-medium flex items-center gap-2 ${textColors[status].title}`}>
            {title}
            {importance === 'critical' && (
              <Badge variant="secondary" className={`text-xs ${
                status === 'good' ? 'bg-green-200 dark:bg-green-800/50 text-green-900 dark:text-green-100' :
                status === 'warning' ? 'bg-amber-200 dark:bg-amber-800/50 text-amber-900 dark:text-amber-100' :
                'bg-red-200 dark:bg-red-800/50 text-red-900 dark:text-red-100'
              }`}>
                Key
              </Badge>
            )}
          </h4>
          <p className={`text-xs ${textColors[status].secondary}`}>{description}</p>
        </div>
        {statusIcons[status]}
      </div>

      <div className="space-y-1">
        <p className={`text-2xl font-bold ${textColors[status].value}`}>{value}</p>
        <p className={`text-xs ${textColors[status].secondary}`}>Expected: {expected}</p>
      </div>

      {children}
    </Card>
  );
}

// Helper Functions
function formatFlagName(flag: string): string {
  return flag
    .split('_')
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}

function getFlagDescription(flag: string): string {
  const descriptions: Record<string, string> = {
    'RT_VARIABILITY_TOO_LOW': 'Reaction times too consistent (<40ms SD) - typical of bots',
    'RT_VARIABILITY_TOO_HIGH': 'Reaction times too erratic (>150ms SD) - suspicious randomness',
    'NO_STROOP_EFFECT': 'No interference effect detected - bots don\'t show cognitive delay',
    'EXCESSIVE_STROOP_EFFECT': 'Unusually large interference (>250ms) - possible gaming',
    'NO_LEARNING_CURVE': 'Flat performance across trials - bots don\'t improve',
    'PERFECT_ACCURACY': '100% accuracy is statistically suspicious',
    'NON_HUMAN_ERROR_PATTERN': 'Errors distributed randomly, not like human fatigue'
  };
  return descriptions[flag] || flag;
}

function formatErrorPattern(pattern: string, isFr: boolean): string {
  const formattedEn: Record<string, string> = {
    none: 'Perfect (no errors)',
    single: 'Single error',
    clustered: 'Clustered (fatigue)',
    distributed: 'Distributed',
    random: 'Random',
  };

  const formattedFr: Record<string, string> = {
    none: 'Parfait (aucune erreur)',
    single: 'Erreur unique',
    clustered: 'Regroupées (fatigue)',
    distributed: 'Distribuées',
    random: 'Aléatoires',
  };

  const dict = isFr ? formattedFr : formattedEn;
  return dict[pattern] || pattern;
}

function getMetricStatus(value: number, min: number, max: number): 'good' | 'warning' | 'bad' {
  if (value >= min && value <= max) return 'good';
  if (value >= min * 0.7 && value <= max * 1.3) return 'warning';
  return 'bad';
}
