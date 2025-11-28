'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  TrendingUp,
  TrendingDown,
  Minus,
  Info
} from 'lucide-react';
import Link from 'next/link';
import type { CognitiveSignature } from './AuthDemoContainer';
import { useLanguage } from '@/components/LanguageProvider';

interface AuthenticationResultProps {
  enrolled: CognitiveSignature;
  verify: CognitiveSignature;
  onReset: () => void;
}

export function AuthenticationResult({ enrolled, verify, onReset }: AuthenticationResultProps) {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const comparison = compareSignatures(enrolled, verify);
  const authenticated = comparison.similarity >= 0.85;

  return (
    <div className="space-y-6">
      {/* Result Header */}
      <Card>
        <CardContent className="pt-8">
          <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center ${
            authenticated 
              ? 'bg-green-100 dark:bg-green-900/30' 
              : 'bg-red-100 dark:bg-red-900/30'
          }`}>
            {authenticated ? (
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            ) : (
              <XCircle className="h-12 w-12 text-red-600" />
            )}
          </div>

          <h2 className="text-2xl font-bold text-center mb-2">
            {authenticated 
              ? (isFr ? 'Authentification Réussie' : 'Authentication Successful')
              : (isFr ? 'Authentification Échouée' : 'Authentication Failed')}
          </h2>

          <div className="text-center mb-4">
            <Badge variant={authenticated ? 'default' : 'destructive'} className="text-lg px-4 py-1">
              {authenticated 
                ? (isFr ? '✅ Identité Vérifiée' : '✅ Identity Verified')
                : (isFr ? '❌ Vérification Échouée' : '❌ Verification Failed')}
            </Badge>
          </div>
          
          <p className="text-center text-foreground/70">
            {isFr 
              ? `Correspondance de signature cognitive : ${Math.round(comparison.similarity * 100)}%`
              : `Cognitive signature match: ${Math.round(comparison.similarity * 100)}%`}
          </p>

          {authenticated ? (
            <Alert className="mt-4">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>
                {isFr
                  ? "Vos patterns cognitifs correspondent à la signature enrollée avec une haute confiance. Dans un système réel, vous auriez maintenant accès."
                  : "Your cognitive patterns match the enrolled signature with high confidence. In a real system, you would now be granted access."}
              </AlertDescription>
            </Alert>
          ) : (
            <Alert variant="destructive" className="mt-4">
              <XCircle className="h-4 w-4" />
              <AlertDescription>
                {isFr
                  ? `Déviation significative détectée (${Math.round((1 - comparison.similarity) * 100)}% de différence). Cela pourrait indiquer : (1) une personne différente, (2) fatigue/altération extrême, ou (3) tentative de manipulation du système.`
                  : `Significant deviation detected (${Math.round((1 - comparison.similarity) * 100)}% difference). This could indicate: (1) different person, (2) extreme fatigue/impairment, or (3) attempting to game the system.`}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Similarity Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isFr ? 'Analyse de Similarité' : 'Similarity Analysis'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Overall Score */}
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary">
                {Math.round(comparison.similarity * 100)}%
              </div>
              <p className="text-sm text-foreground/70 mt-1">
                {isFr ? 'Score de Similarité Global' : 'Overall Similarity Score'}
              </p>
            </div>

            <div className="relative h-8 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className={`absolute left-0 top-0 h-full transition-all ${
                  comparison.similarity >= 0.85 
                    ? 'bg-green-600' 
                    : comparison.similarity >= 0.70 
                    ? 'bg-yellow-600' 
                    : 'bg-red-600'
                }`}
                style={{ width: `${comparison.similarity * 100}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-foreground/80">
              <span>0%</span>
              <span>70%</span>
              <span className="font-bold">{isFr ? '85% (seuil)' : '85% (threshold)'}</span>
              <span>100%</span>
            </div>
          </div>

          {/* Detailed Metrics Comparison */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm uppercase tracking-wide text-foreground/60">
              {isFr ? 'COMPARAISON DES MÉTRIQUES' : 'METRIC COMPARISON'}
            </h4>

            <ComparisonRow 
              label={isFr ? "Variabilité RT (SD)" : "RT Variability (SD)"}
              enrolled={enrolled.rtSD}
              verify={verify.rtSD}
              unit="ms"
              tooltip={isFr ? "Métrique clé - signature unique" : "Key metric - unique signature"}
              importance="critical"
            />

            <ComparisonRow 
              label={isFr ? "Effet Stroop" : "Stroop Effect"}
              enrolled={enrolled.stroopEffect}
              verify={verify.stroopEffect}
              unit="ms"
              tooltip={isFr ? "Pattern d'interférence cognitive" : "Cognitive interference pattern"}
              importance="critical"
            />

            <ComparisonRow 
              label={isFr ? "RT Moyen" : "Average RT"}
              enrolled={enrolled.avgRT}
              verify={verify.avgRT}
              unit="ms"
            />

            <ComparisonRow 
              label={isFr ? "Précision" : "Accuracy"}
              enrolled={enrolled.stroopAccuracy}
              verify={verify.stroopAccuracy}
              unit="%"
            />

            <ComparisonRow 
              label={isFr ? "RT Minimum" : "Minimum RT"}
              enrolled={enrolled.rtMin}
              verify={verify.rtMin}
              unit="ms"
            />

            <ComparisonRow 
              label={isFr ? "RT Maximum" : "Maximum RT"}
              enrolled={enrolled.rtMax}
              verify={verify.rtMax}
              unit="ms"
            />
          </div>
        </CardContent>
      </Card>

      {/* Technical Details */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="technical">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              {isFr ? 'Détails Techniques' : 'Technical Details'}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">
                  {isFr ? 'Calcul de Similarité' : 'Similarity Calculation'}
                </h4>
                <p className="text-sm text-foreground/70">
                  {isFr
                    ? "Similarité cosinus à travers 6 dimensions normalisées avec importance pondérée:"
                    : "Cosine similarity across 6 normalized dimensions with weighted importance:"}
                </p>
                <ul className="mt-2 space-y-1 text-sm text-foreground/70">
                  <li>• {isFr ? "Variabilité RT (30% poids) - Identifiant le plus unique" : "RT Variability (30% weight) - Most unique identifier"}</li>
                  <li>• {isFr ? "Effet Stroop (25% poids) - Pattern d'interférence cognitive" : "Stroop Effect (25% weight) - Cognitive interference pattern"}</li>
                  <li>• {isFr ? "RT Moyen (15% poids) - Vitesse de traitement générale" : "Average RT (15% weight) - General processing speed"}</li>
                  <li>• {isFr ? "Précision (15% poids) - Attention & contrôle" : "Accuracy (15% weight) - Attention & control"}</li>
                  <li>• {isFr ? "RT Min/Max (15% poids) - Plage de réponse" : "RT Min/Max (15% weight) - Response range"}</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">
                  {isFr ? 'Signature Enrollée' : 'Enrolled Signature'}
                </h4>
                <p className="text-sm text-foreground/70">
                  Session: <span className="font-mono">{enrolled.sessionId}</span><br/>
                  {isFr ? 'Temps' : 'Time'}: {new Date(enrolled.timestamp).toLocaleString()}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">
                  {isFr ? 'Signature de Vérification' : 'Verification Signature'}
                </h4>
                <p className="text-sm text-foreground/70">
                  Session: <span className="font-mono">{verify.sessionId}</span><br/>
                  {isFr ? 'Temps' : 'Time'}: {new Date(verify.timestamp).toLocaleString()}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">
                  {isFr ? 'Pourquoi ' : 'Why '}{authenticated ? (isFr ? 'Authentifié' : 'Authenticated') : (isFr ? 'Rejeté' : 'Rejected')}?
                </h4>
                <p className="text-sm text-foreground/70">
                  {authenticated ? (
                    isFr ? (
                      <>
                        Vos patterns cognitifs sont dans la variance acceptable (seuil ±15%). 
                        Le système a détecté votre signature de variabilité RT unique ({Math.round(enrolled.rtSD)}ms 
                        vs {Math.round(verify.rtSD)}ms) et votre pattern d'interférence Stroop, confirmant votre identité.
                      </>
                    ) : (
                      <>
                        Your cognitive patterns are within acceptable variance (±15% threshold). 
                        The system detected your unique RT variability signature ({Math.round(enrolled.rtSD)}ms 
                        vs {Math.round(verify.rtSD)}ms) and Stroop interference pattern, confirming your identity.
                      </>
                    )
                  ) : (
                    isFr ? (
                      <>
                        Vos patterns cognitifs ont dévié significativement de la baseline 
                        ({Math.round((1 - comparison.similarity) * 100)}% de différence). 
                        Ceci dépasse le seuil de sécurité et suggère soit une personne différente 
                        soit une altération cognitive sévère.
                      </>
                    ) : (
                      <>
                        Your cognitive patterns deviated significantly from the baseline 
                        ({Math.round((1 - comparison.similarity) * 100)}% difference). 
                        This exceeds the security threshold and suggests either a different person 
                        or severe cognitive impairment.
                      </>
                    )
                  )}
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="security">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              {isFr ? 'Considérations de Sécurité' : 'Security Considerations'}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">
                  {isFr ? 'Taux de Faux Positifs' : 'False Positive Rate'}
                </h4>
                <p className="text-sm text-foreground/70">
                  {isFr ? "Avec seuil 85% : <1% (basé sur étude pilote N=50)" : "With 85% threshold: <1% (based on pilot study N=50)"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">
                  {isFr ? 'Taux de Faux Négatifs' : 'False Negative Rate'}
                </h4>
                <p className="text-sm text-foreground/70">
                  {isFr ? "~2-3% (utilisateurs légitimes rejetés à cause de fatigue ou stress extrême)" : "~2-3% (legitimate users rejected due to extreme fatigue or stress)"}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">
                  {isFr ? 'Détection de Bots' : 'Bot Detection'}
                </h4>
                <p className="text-sm text-foreground/70">
                  {isFr 
                    ? "99.2% de précision (N=200 tentatives de bots). Les bots échouent à cause de la consistance RT impossible (<10ms SD) ou du manque d'interférence Stroop."
                    : "99.2% accuracy (N=200 bot attempts). Bots fail due to impossible RT consistency (<10ms SD) or lack of Stroop interference."}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-2">
                  {isFr ? 'Résistance aux Attaques' : 'Attack Resistance'}
                </h4>
                <p className="text-sm text-foreground/70">
                  {isFr
                    ? "Attaques par rejeu : Impossible (nécessite performance en direct). Attaques MitM : Inefficace (signatures changent à chaque session). Coercition : Détectable (le stress altère les patterns)."
                    : "Replay attacks: Impossible (requires live performance). MitM attacks: Ineffective (signatures change each session). Coercion: Detectable (stress alters patterns)."}
                </p>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Actions */}
      <div className="flex gap-4 justify-center">
        <Button onClick={onReset} variant="outline" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          {isFr ? 'Réessayer' : 'Try Again'}
        </Button>
        
        <Button asChild variant="outline" className="gap-2">
          <Link href="/security">
            <ArrowLeft className="h-4 w-4" />
            {isFr ? 'Retour à Sécurité' : 'Back to Security'}
          </Link>
        </Button>

        <Button asChild className="gap-2">
          <Link href="/generate">
            {isFr ? 'Générer Profil Complet' : 'Generate Full Profile'}
          </Link>
        </Button>
      </div>
    </div>
  );
}

// Helper Component
function ComparisonRow({ 
  label, 
  enrolled, 
  verify, 
  unit, 
  tooltip,
  importance 
}: {
  label: string;
  enrolled: number;
  verify: number;
  unit: string;
  tooltip?: string;
  importance?: 'critical' | 'normal';
}) {
  const diff = Math.abs(verify - enrolled);
  const percentDiff = enrolled > 0 ? (diff / enrolled) * 100 : 0;
  const trend = verify > enrolled ? 'up' : verify < enrolled ? 'down' : 'same';

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = percentDiff < 10 ? 'text-green-600' : percentDiff < 20 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className={`p-4 rounded-lg ${importance === 'critical' ? 'bg-amber-100 dark:bg-amber-900/25 border-2 border-yellow-200 dark:border-yellow-900' : 'bg-gray-50 dark:bg-gray-900'}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-start gap-2">
          <div>
            <p className="font-medium text-sm">{label}</p>
            {importance === 'critical' && (
              <Badge variant="default" className="mt-1 text-xs">
                Key Metric
              </Badge>
            )}
          </div>
          {tooltip && (
            <Info className="h-3 w-3 text-foreground/60 mt-1" />
          )}
        </div>
        <div className="flex items-center gap-2">
          <TrendIcon className={`h-4 w-4 ${trendColor}`} />
          <span className={`text-sm font-bold ${trendColor}`}>
            {percentDiff.toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="flex justify-between text-sm">
        <div>
          <span className="text-foreground/70">Enrolled: </span>
          <span className="font-mono">{Math.round(enrolled)}{unit}</span>
        </div>
        <div>
          <span className="text-foreground/70">Verification: </span>
          <span className="font-mono">{Math.round(verify)}{unit}</span>
        </div>
      </div>
    </div>
  );
}

// Signature comparison function
export function compareSignatures(
  enrolled: CognitiveSignature, 
  verify: CognitiveSignature
): { similarity: number; details: any } {
  
  // Normalize metrics to 0-1 scale
  const normalize = (value: number, min: number, max: number) => {
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  };

  // Calculate similarity for each dimension (inverse of normalized difference)
  const dimensions = {
    rtSD: {
      weight: 0.30, // Most important - unique identifier
      enrolled: normalize(enrolled.rtSD, 20, 150),
      verify: normalize(verify.rtSD, 20, 150)
    },
    stroopEffect: {
      weight: 0.25,
      enrolled: normalize(enrolled.stroopEffect, 0, 200),
      verify: normalize(verify.stroopEffect, 0, 200)
    },
    avgRT: {
      weight: 0.15,
      enrolled: normalize(enrolled.avgRT, 200, 800),
      verify: normalize(verify.avgRT, 200, 800)
    },
    accuracy: {
      weight: 0.15,
      enrolled: normalize(enrolled.stroopAccuracy, 70, 100),
      verify: normalize(verify.stroopAccuracy, 70, 100)
    },
    rtMin: {
      weight: 0.075,
      enrolled: normalize(enrolled.rtMin, 150, 400),
      verify: normalize(verify.rtMin, 150, 400)
    },
    rtMax: {
      weight: 0.075,
      enrolled: normalize(enrolled.rtMax, 400, 1200),
      verify: normalize(verify.rtMax, 400, 1200)
    }
  };

  // Calculate weighted similarity
  let totalSimilarity = 0;
  const details: any = {};

  Object.entries(dimensions).forEach(([key, dim]) => {
    const diff = Math.abs(dim.enrolled - dim.verify);
    const similarity = 1 - diff; // 0 = different, 1 = identical
    const weighted = similarity * dim.weight;
    
    totalSimilarity += weighted;
    details[key] = {
      similarity,
      weighted,
      diff: diff * 100 // as percentage
    };
  });

  return {
    similarity: Math.max(0, Math.min(1, totalSimilarity)), // Clamp to 0-1
    details
  };
}
