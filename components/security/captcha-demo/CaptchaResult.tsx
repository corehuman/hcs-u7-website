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
          <Alert className="mt-4 border-green-200 dark:border-green-900 bg-green-100 dark:bg-green-900/25 border border-green-200 dark:border-green-800/50">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Your cognitive patterns match expected human behavior. In a real system, 
              you would be verified and granted access.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mt-4 border-red-200 dark:border-red-900 bg-red-100 dark:bg-red-900/25 border border-red-200 dark:border-red-800/50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Your response patterns are inconsistent with human cognition. 
              This could indicate bot automation or intentional gaming of the system.
            </AlertDescription>
          </Alert>
        )}
      </Card>

      {/* Detection Flags */}
      {flags.length > 0 && (
        <Card className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            Detection Flags ({flags.length})
          </h3>

          <div className="space-y-3">
            {flags.map((flag, idx) => (
              <Alert key={idx} className="border-amber-200 dark:border-amber-900 bg-amber-100 dark:bg-amber-900/25 border border-amber-200 dark:border-amber-800/40">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
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
          Cognitive Metrics Analysis
        </h3>

        <div className="grid md:grid-cols-2 gap-4">
          {/* RT Variability */}
          <MetricCard
            title="RT Variability"
            value={`${Math.round(metrics.rtVariability)}ms SD`}
            description="Consistency of reaction times"
            expected="50-100ms"
            status={getMetricStatus(metrics.rtVariability, 50, 100)}
            importance="critical"
          >
            <div className="flex justify-between text-xs text-amber-800 dark:text-amber-200 mt-2">
              <span className="flex items-center gap-1">
                Too consistent (&lt;40ms):
                <Badge variant="outline" className="text-xs">Bot-like</Badge>
              </span>
              <span className="flex items-center gap-1">
                Normal (50-100ms):
                <Badge variant="default" className="text-xs">Human</Badge>
              </span>
              <span className="flex items-center gap-1">
                Too random (&gt;150ms):
                <Badge variant="destructive" className="text-xs">Suspicious</Badge>
              </span>
            </div>
          </MetricCard>

          {/* Stroop Effect */}
          <MetricCard
            title="Stroop Interference"
            value={`${Math.round(metrics.stroopEffect)}ms`}
            description="Cognitive interference from incongruent stimuli"
            expected="50-150ms"
            status={getMetricStatus(metrics.stroopEffect, 50, 150)}
            importance="critical"
          >
            <div className="flex justify-between text-xs text-green-800 dark:text-green-200 mt-2">
              <span className="flex items-center gap-1">
                No effect (&lt;20ms):
                <Badge variant="outline" className="text-xs">Bot-like</Badge>
              </span>
              <span className="flex items-center gap-1">
                Normal (50-150ms):
                <Badge variant="default" className="text-xs">Human</Badge>
              </span>
              <span className="flex items-center gap-1">
                Excessive (&gt;250ms):
                <Badge variant="destructive" className="text-xs">Unusual</Badge>
              </span>
            </div>
          </MetricCard>

          {/* Learning Curve */}
          <MetricCard
            title="Learning Curve"
            value={`${metrics.learningSlope >= 0 ? '+' : ''}${Math.round(metrics.learningSlope)}ms`}
            description="Performance improvement over trials"
            expected="Positive (improvement)"
            status={metrics.learningSlope > 5 ? 'good' : metrics.learningSlope < -5 ? 'bad' : 'warning'}
          >
            <div className="mt-2 text-xs text-red-800 dark:text-red-200">
              <p>
                {metrics.learningSlope > 5 ? (
                  <>✅ You improved over time (typical human pattern)</>
                ) : metrics.learningSlope < -5 ? (
                  <>⚠️ You got slower (fatigue or intentional)</>
                ) : (
                  <>⚠️ Flat performance (bot-like)</>
                )}
              </p>
            </div>
          </MetricCard>

          {/* Error Pattern */}
          <MetricCard
            title="Error Distribution"
            value={formatErrorPattern(metrics.errorPattern)}
            description="How mistakes were distributed"
            expected="Clustered (fatigue)"
            status={metrics.errorPattern === 'clustered' || metrics.errorPattern === 'distributed' ? 'good' : 'warning'}
          >
            <div className="flex justify-between text-xs text-foreground/80 mt-2">
              <span className="flex items-center gap-1">
                None/Perfect:
                <Badge variant="destructive" className="text-xs">Suspicious</Badge>
              </span>
              <span className="flex items-center gap-1">
                Clustered:
                <Badge variant="default" className="text-xs">Human (fatigue)</Badge>
              </span>
              <span className="flex items-center gap-1">
                Random:
                <Badge variant="outline" className="text-xs">Bot-like</Badge>
              </span>
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

  return (
    <Card className={`p-4 ${statusColors[status]}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-medium flex items-center gap-2">
            {title}
            {importance === 'critical' && (
              <Badge variant="secondary" className="text-xs">
                Key
              </Badge>
            )}
          </h4>
          <p className="text-xs text-amber-800 dark:text-amber-200">{description}</p>
        </div>
        {statusIcons[status]}
      </div>

      <div className="space-y-1">
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-green-800 dark:text-green-200">Expected: {expected}</p>
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

function formatErrorPattern(pattern: string): string {
  const formatted: Record<string, string> = {
    'none': 'Perfect (no errors)',
    'single': 'Single error',
    'clustered': 'Clustered (fatigue)',
    'distributed': 'Distributed',
    'random': 'Random'
  };
  return formatted[pattern] || pattern;
}

function getMetricStatus(value: number, min: number, max: number): 'good' | 'warning' | 'bad' {
  if (value >= min && value <= max) return 'good';
  if (value >= min * 0.7 && value <= max * 1.3) return 'warning';
  return 'bad';
}
