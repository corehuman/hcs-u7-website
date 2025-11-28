'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Bot, Shield, Play, Info, Zap, CheckCircle2, XCircle } from 'lucide-react';

interface CaptchaIntroProps {
  onStart: () => void;
}

export function CaptchaIntro({ onStart }: CaptchaIntroProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5" />
          <Badge variant="outline" className="text-xs">
            Interactive Demo
          </Badge>
        </div>

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          AI-Resistant CAPTCHA Demo
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Experience next-generation bot detection using cognitive patterns. 
          Effective against GPT-4V, automation tools, and advanced bots.
        </p>
      </div>

      {/* Problem with Traditional CAPTCHAs */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-red-500" />
            <div>
              <h3 className="font-semibold text-lg">Traditional CAPTCHAs Are Broken</h3>
              <p className="text-sm text-muted-foreground">
                Image-based CAPTCHAs (reCAPTCHA, hCaptcha) are now easily solved by AI
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3 mt-4">
          <div className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
            <p className="text-sm">
              <span className="font-medium">GPT-4V:</span> Can solve visual puzzles with 95%+ accuracy
            </p>
          </div>
          <div className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
            <p className="text-sm">
              <span className="font-medium">OCR Tools:</span> Defeat text-based challenges easily
            </p>
          </div>
          <div className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
            <p className="text-sm">
              <span className="font-medium">CAPTCHA Farms:</span> Human solvers for $1/1000 solves
            </p>
          </div>
          <div className="flex items-start gap-2">
            <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
            <p className="text-sm">
              <span className="font-medium">Accessibility:</span> Difficult for visually impaired users
            </p>
          </div>
        </div>
      </Card>

      {/* HCS-Captcha Solution */}
      <Card className="p-6 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-500" />
            <div>
              <h3 className="font-semibold text-lg">HCS-Captcha: Cognitive Detection</h3>
              <p className="text-sm text-muted-foreground">
                Detects bots by analyzing patterns AI cannot replicate
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-3 mt-4">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
            <p className="text-sm">
              <span className="font-medium">RT Variability:</span> Humans vary 50-100ms, bots &lt;10ms or erratic
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
            <p className="text-sm">
              <span className="font-medium">Stroop Effect:</span> Humans show 50-150ms interference, bots don't
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
            <p className="text-sm">
              <span className="font-medium">Learning Curve:</span> Humans improve gradually, bots flat or random
            </p>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
            <p className="text-sm">
              <span className="font-medium">Accessible:</span> Works with any input method (keyboard, mouse, touch)
            </p>
          </div>
        </div>
      </Card>

      {/* How It Works */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">How It Works</h3>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              1
            </div>
            <div className="flex-1">
              <p className="font-medium">Quick Stroop Test (10 trials)</p>
              <p className="text-sm text-muted-foreground">
                You'll see colored words. Click the COLOR of the ink (ignore the word). 
                Takes ~30 seconds.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              2
            </div>
            <div className="flex-1">
              <p className="font-medium">Real-Time Analysis</p>
              <p className="text-sm text-muted-foreground">
                System analyzes your reaction times, interference patterns, and error distribution.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              3
            </div>
            <div className="flex-1">
              <p className="font-medium">Human/Bot Classification</p>
              <p className="text-sm text-muted-foreground">
                You'll see if you're classified as human (✅) or bot (❌) with detailed explanation.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">~30s</p>
          <p className="text-sm text-muted-foreground">Avg completion time</p>
        </Card>

        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">99.2%</p>
          <p className="text-sm text-muted-foreground">Bot detection accuracy</p>
        </Card>

        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">&lt;1%</p>
          <p className="text-sm text-muted-foreground">False positive rate</p>
        </Card>
      </div>

      <Alert className="border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-950/30">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <span className="font-medium">Try to "game" the system:</span> Intentionally respond too fast, 
          too slow, or with perfect accuracy. See if you can trick the bot detector!
        </AlertDescription>
      </Alert>

      {/* CTA */}
      <div className="text-center">
        <Button onClick={onStart} size="lg" className="gap-2">
          <Play className="w-4 h-4" />
          Start CAPTCHA Test (~30 seconds)
        </Button>
      </div>

      {/* Comparison Table */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Comparison: Traditional vs HCS-Captcha</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Feature</th>
                <th className="text-center py-2">reCAPTCHA</th>
                <th className="text-center py-2">hCaptcha</th>
                <th className="text-center py-2">HCS-Captcha</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">GPT-4V Resistant</td>
                <td className="text-center py-2">❌</td>
                <td className="text-center py-2">❌</td>
                <td className="text-center py-2">✅</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Accessible</td>
                <td className="text-center py-2">⚠️</td>
                <td className="text-center py-2">⚠️</td>
                <td className="text-center py-2">✅</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Privacy-First</td>
                <td className="text-center py-2">❌</td>
                <td className="text-center py-2">⚠️</td>
                <td className="text-center py-2">✅</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Avg Time</td>
                <td className="text-center py-2">10-20s</td>
                <td className="text-center py-2">10-20s</td>
                <td className="text-center py-2">~30s</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">False Positive</td>
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
