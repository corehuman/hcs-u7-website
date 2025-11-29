'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, ArrowRight, Shield, Info } from 'lucide-react';
import type { CognitiveSignature } from './AuthDemoContainer';
import { useLanguage } from '@/components/LanguageProvider';

interface SignatureDisplayProps {
  signature: CognitiveSignature;
  onProceed: () => void;
}

export function SignatureDisplay({ signature, onProceed }: SignatureDisplayProps) {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50 p-3 w-fit">
            <CheckCircle2 className="h-8 w-8 text-green-900 dark:text-green-100" />
          </div>
          <Badge variant="default" className="mb-2 w-fit mx-auto">
            {isFr ? 'Enrollment Complété' : 'Enrollment Complete'}
          </Badge>
          <CardTitle className="text-2xl">
            {isFr ? 'Signature Cognitive Créée' : 'Cognitive Signature Created'}
          </CardTitle>
          <CardDescription>
            {isFr 
              ? 'Votre profil cognitif unique a été généré'
              : 'Your unique cognitive profile has been generated'}
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Signature Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isFr ? 'Votre Signature Cognitive' : 'Your Cognitive Signature'}
          </CardTitle>
          <CardDescription className="text-sm text-foreground/80 mt-1">
            {isFr
              ? "Ces mesures forment un petit code HCS-U7 de référence. Lors de la vérification, nous comparerons une nouvelle signature à celle-ci avec un score de similarité (en %, pas un match parfait à 100 %)."
              : 'These measures form a small reference HCS-U7 code. During verification, we will compare a new signature to this one using a similarity score (in %, not a perfect 100% match).'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Stroop Metrics */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Shield className="h-3 w-3" />
                {isFr ? 'TEST STROOP' : 'STROOP TEST'}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MetricRow 
                label={isFr ? "Effet Stroop" : "Stroop Effect"} 
                value={`${Math.round(signature.stroopEffect)}ms`}
                description={isFr ? "Différence congruent/incongruent" : "Congruent/incongruent difference"}
              />
              <MetricRow 
                label={isFr ? "Précision" : "Accuracy"} 
                value={`${Math.round(signature.stroopAccuracy)}%`}
                description={isFr ? "Réponses correctes" : "Correct responses"}
              />
              <MetricRow 
                label={isFr ? "RT Congruent" : "Congruent RT"} 
                value={`${Math.round(signature.stroopAvgCongruent)}ms`}
                description={isFr ? "Temps moyen quand mot=couleur" : "Average when word=color"}
              />
              <MetricRow 
                label={isFr ? "RT Incongruent" : "Incongruent RT"} 
                value={`${Math.round(signature.stroopAvgIncongruent)}ms`}
                description={isFr ? "Temps moyen quand mot≠couleur" : "Average when word≠color"}
              />
            </div>
          </div>

          {/* Reaction Time Metrics */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Shield className="h-3 w-3" />
                {isFr ? 'TEMPS DE RÉACTION' : 'REACTION TIME'}
              </Badge>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <MetricRow 
                label={isFr ? "RT Moyen" : "Average RT"} 
                value={`${Math.round(signature.avgRT)}ms`}
                description={isFr ? "Temps de réaction moyen" : "Mean reaction time"}
              />
              <MetricRow 
                label={isFr ? 'Variabilité (SD)' : 'Variability (SD)'} 
                value={`${Math.round(signature.rtSD)}ms`}
                description={isFr 
                  ? "Paramètre clé de votre code HCS-U7 : variabilité de vos temps de réaction, quasi impossible à rejouer exactement."
                  : 'Key parameter of your HCS-U7 code: the variability of your reaction times, almost impossible to replay exactly.'}
                highlight={true}
              />
              <MetricRow 
                label={isFr ? "RT Minimum" : "Minimum RT"} 
                value={`${Math.round(signature.rtMin)}ms`}
                description={isFr ? "Réponse la plus rapide" : "Fastest response"}
              />
              <MetricRow 
                label={isFr ? "RT Maximum" : "Maximum RT"} 
                value={`${Math.round(signature.rtMax)}ms`}
                description={isFr ? "Réponse la plus lente" : "Slowest response"}
              />
            </div>
          </div>

          {/* Session Info */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-green-800 dark:text-green-200">{isFr ? "ID Session:" : "Session ID:"}</span>
                <p className="font-mono text-xs mt-1 text-foreground/80">{signature.sessionId}</p>
              </div>
              <div>
                <span className="text-foreground/70">{isFr ? "Horodatage:" : "Timestamp:"}</span>
                <p className="text-xs mt-1 text-foreground/80">
                  {new Date(signature.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          {isFr 
            ? `Ce qui rend ceci sécurisé : Votre variabilité de temps de réaction (SD = ${Math.round(signature.rtSD)}ms) est une propriété biologique aussi unique qu'une empreinte digitale. Les bots IA montrent typiquement <10ms de variabilité ou du bruit aléatoire—tous deux facilement détectables.`
            : `What makes this secure: Your reaction time variability (SD = ${Math.round(signature.rtSD)}ms) is a biological property as unique as a fingerprint. AI bots typically show <10ms variability or random noise—both easily detectable.`}
        </AlertDescription>
      </Alert>

      {/* Why This Works */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {isFr ? 'Pourquoi ceci ne peut être falsifié' : 'Why This Cannot Be Faked'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-900 dark:text-green-100 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/85">
              {isFr
                ? "Patterns intrinsèques : Votre variabilité RT et effet Stroop sont des propriétés biologiques qui n'existent que lors d'une performance en direct"
                : "Intrinsic patterns: Your RT variability and Stroop effect are biological properties that exist only during live performance"}
            </p>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-900 dark:text-green-100 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/85">
              {isFr
                ? "Ne peut être volé : Contrairement aux mots de passe, ces patterns ne peuvent être extraits d'une base de données ou interceptés"
                : "Cannot be stolen: Unlike passwords, these patterns cannot be extracted from a database or intercepted"}
            </p>
          </div>
          <div className="flex gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-900 dark:text-green-100 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground/85">
              {isFr
                ? "Résistant à l'IA : Les bots actuels n'ont pas la variabilité motrice et les effets d'interférence inhérents à la cognition humaine"
                : "AI-resistant: Current bots lack the motor variability and interference effects inherent to human cognition"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <Card>
        <CardContent className="pt-6 text-center space-y-4">
          <p className="text-sm text-foreground/85">
            {isFr
              ? "Maintenant, vérifions votre identité en répétant les mêmes tests"
              : "Now let's verify your identity by repeating the same tests"}
          </p>
          <Button onClick={onProceed} size="lg" className="gap-2">
            {isFr ? 'Procéder à la Vérification' : 'Proceed to Verification'}
            <ArrowRight className="h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Component
function MetricRow({ 
  label, 
  value, 
  description, 
  highlight 
}: { 
  label: string; 
  value: string; 
  description: string; 
  highlight?: boolean;
}) {
  return (
    <div className={highlight ? 'bg-amber-100 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 p-3 rounded-lg' : ''}>
      <div className="flex justify-between items-center mb-1">
        <span className={`text-sm font-medium ${highlight ? 'text-amber-900 dark:text-amber-100' : ''}`}>{label}</span>
        <span className={`font-mono font-bold ${highlight ? 'text-amber-950 dark:text-amber-50' : ''}`}>{value}</span>
      </div>
      <p className={`text-xs ${highlight ? 'text-amber-800 dark:text-amber-200' : 'text-foreground/85'}`}>{description}</p>
    </div>
  );
}
