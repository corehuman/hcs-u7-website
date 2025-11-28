'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Info } from 'lucide-react';
import { MiniStroopTest } from './MiniStroopTest';
import { MiniReactionTimeTest } from './MiniReactionTimeTest';
import type { CognitiveSignature } from './AuthDemoContainer';
import { useLanguage } from '@/components/LanguageProvider';

interface VerificationFlowProps {
  enrolledSignature: CognitiveSignature;
  onComplete: (signature: CognitiveSignature) => void;
}

type TestPhase = 'intro' | 'stroop' | 'reaction-time' | 'comparing';

export function VerificationFlow({ enrolledSignature, onComplete }: VerificationFlowProps) {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const [phase, setPhase] = useState<TestPhase>('intro');
  const [stroopResults, setStroopResults] = useState<any>(null);
  const [rtResults, setRtResults] = useState<any>(null);
  const [countdown, setCountdown] = useState(3);

  // Intro countdown
  useEffect(() => {
    if (phase === 'intro' && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (phase === 'intro' && countdown === 0) {
      setPhase('stroop');
    }
  }, [phase, countdown]);

  const handleStroopComplete = (results: any) => {
    setStroopResults(results);
    setPhase('reaction-time');
  };

  const handleRTComplete = (results: any) => {
    setRtResults(results);
    setPhase('comparing');
    
    // Generate verification signature
    setTimeout(() => {
      const signature: CognitiveSignature = {
        stroopEffect: stroopResults?.stroopEffect || 0,
        stroopAccuracy: stroopResults?.accuracy || 0,
        stroopAvgCongruent: stroopResults?.avgCongruent || 0,
        stroopAvgIncongruent: stroopResults?.avgIncongruent || 0,
        avgRT: results.avgRT || 0,
        rtSD: results.rtSD || 0,
        rtMin: results.rtMin || 0,
        rtMax: results.rtMax || 0,
        timestamp: Date.now(),
        sessionId: `verify_${Date.now()}` 
      };
      
      onComplete(signature);
    }, 2000);
  };

  const progress = 
    phase === 'intro' ? 0 : 
    phase === 'stroop' ? 25 : 
    phase === 'reaction-time' ? 75 : 
    100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">
              {isFr ? 'Étape 2' : 'Step 2'}
            </Badge>
            <CardTitle>{isFr ? 'Vérification' : 'Verification'}</CardTitle>
          </div>
          <CardDescription>
            {isFr ? 'Authentifiez votre identité' : 'Authenticate Your Identity'}
          </CardDescription>
          <p className="text-sm text-foreground/85 mt-2">
            {isFr
              ? "Répétez les mêmes tests. Nous comparerons votre performance en direct avec la signature enrollée."
              : "Repeat the same tests. We'll compare your live performance with the enrolled signature."}
          </p>
        </CardHeader>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-medium">
                  {isFr ? 'Progrès de Vérification' : 'Verification Progress'}
                </span>
              </div>
              <span className="text-sm text-foreground/85">
                {phase === 'intro' && (isFr ? 'Démarrage...' : 'Starting...')}
                {phase === 'stroop' && (isFr ? 'Test Stroop' : 'Stroop Test')}
                {phase === 'reaction-time' && (isFr ? 'Temps de Réaction' : 'Reaction Time')}
                {phase === 'comparing' && (isFr ? 'Comparaison...' : 'Comparing...')}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Intro countdown */}
      {phase === 'intro' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              {isFr ? 'Préparez-vous' : 'Get Ready'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-sm text-foreground/85">
              {isFr
                ? "Vous allez maintenant répéter les mêmes tests. Essayez de performer naturellement—ne réfléchissez pas trop ou n'essayez pas de correspondre à vos résultats précédents."
                : "You'll now repeat the same tests. Try to perform naturally—don't overthink or try to match your previous results."}
            </p>
            
            <div className="text-center">
              <div className="text-6xl font-bold text-primary animate-pulse">
                {countdown}
              </div>
            </div>
            
            <p className="text-center text-sm text-foreground/85">
              {isFr 
                ? `Début dans ${countdown} seconde${countdown !== 1 ? 's' : ''}...`
                : `Starting in ${countdown} second${countdown !== 1 ? 's' : ''}...`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Alert */}
      {(phase === 'stroop' || phase === 'reaction-time') && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {isFr
              ? "Soyez vous-même : Performez naturellement. Le système tient compte de la variation normale au jour le jour (±10%). Seules des déviations majeures ou une personne complètement différente échoueraient l'authentification."
              : "Just be yourself: Perform naturally. The system accounts for normal day-to-day variation (±10%). Only major deviations or a completely different person would fail authentication."}
          </AlertDescription>
        </Alert>
      )}

      {/* Test Components */}
      {phase === 'stroop' && (
        <MiniStroopTest onComplete={handleStroopComplete} />
      )}

      {phase === 'reaction-time' && (
        <MiniReactionTimeTest onComplete={handleRTComplete} />
      )}

      {phase === 'comparing' && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-primary/20 animate-ping absolute"></div>
                  <div className="w-20 h-20 rounded-full bg-primary/30 flex items-center justify-center">
                    <Shield className="h-10 w-10 text-primary" />
                  </div>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold">
                {isFr ? 'Comparaison des Signatures...' : 'Comparing Signatures...'}
              </h3>
              <p className="text-sm text-foreground/85">
                {isFr
                  ? 'Analyse des patterns cognitifs et calcul du score de similarité'
                  : 'Analyzing cognitive patterns and calculating similarity score'}
              </p>
              
              <div className="flex justify-center gap-6 mt-4">
                <div className="text-center">
                  <div className="text-xs text-foreground/85 mb-1">
                    {isFr ? 'Variabilité RT' : 'RT variability'}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-900 dark:text-green-100" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-green-800 dark:text-green-200 mb-1">
                    {isFr ? 'Effet Stroop' : 'Stroop effect'}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-900 dark:text-green-100" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-green-800 dark:text-green-200 mb-1">
                    {isFr ? 'Précision' : 'Accuracy'}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800/50 flex items-center justify-center">
                    <CheckCircle2 className="h-6 w-6 text-green-900 dark:text-green-100" />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Add missing import
import { CheckCircle2 } from 'lucide-react';
