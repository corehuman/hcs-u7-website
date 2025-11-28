'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Brain, Zap, Shield } from 'lucide-react';
import { MiniStroopTest } from './MiniStroopTest';
import { MiniReactionTimeTest } from './MiniReactionTimeTest';
import type { CognitiveSignature } from './AuthDemoContainer';
import { useLanguage } from '@/components/LanguageProvider';

interface EnrollmentFlowProps {
  onComplete: (signature: CognitiveSignature) => void;
}

type TestPhase = 'stroop' | 'reaction-time' | 'generating';

export function EnrollmentFlow({ onComplete }: EnrollmentFlowProps) {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const [phase, setPhase] = useState<TestPhase>('stroop');
  const [stroopResults, setStroopResults] = useState<any>(null);
  const [rtResults, setRtResults] = useState<any>(null);

  const handleStroopComplete = (results: any) => {
    setStroopResults(results);
    setPhase('reaction-time');
  };

  const handleRTComplete = (results: any) => {
    setRtResults(results);
    setPhase('generating');
    
    // Generate signature
    setTimeout(() => {
      const signature: CognitiveSignature = {
        stroopEffect: results.stroopEffect || 0,
        stroopAccuracy: results.accuracy || 0,
        stroopAvgCongruent: stroopResults?.avgCongruent || 0,
        stroopAvgIncongruent: stroopResults?.avgIncongruent || 0,
        avgRT: results.avgRT || 0,
        rtSD: results.rtSD || 0,
        rtMin: results.rtMin || 0,
        rtMax: results.rtMax || 0,
        timestamp: Date.now(),
        sessionId: generateSessionId()
      };
      
      onComplete(signature);
    }, 1500);
  };

  const progress = phase === 'stroop' ? 0 : phase === 'reaction-time' ? 50 : 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline">
              {isFr ? 'Étape 1' : 'Step 1'}
            </Badge>
            <CardTitle>{isFr ? 'Enrollment' : 'Enrollment'}</CardTitle>
          </div>
          <CardDescription>
            {isFr 
              ? 'Créez votre signature cognitive'
              : 'Create Your Cognitive Signature'}
          </CardDescription>
          <p className="text-sm text-foreground/85 mt-2">
            {isFr
              ? 'Complétez deux tests rapides pour établir votre profil cognitif de base'
              : 'Complete two quick tests to establish your baseline cognitive profile'}
          </p>
        </CardHeader>
      </Card>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  phase === 'stroop' || stroopResults 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  {stroopResults ? '✓' : '1'}
                </div>
                <div>
                  <p className="font-medium">{isFr ? 'Test Stroop' : 'Stroop Test'}</p>
                  <p className="text-xs text-foreground/85">
                    {isFr ? 'Contrôle inhibiteur' : 'Inhibitory control'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  phase === 'reaction-time' || rtResults 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  {rtResults ? '✓' : '2'}
                </div>
                <div>
                  <p className="font-medium">
                    {isFr ? 'Temps de Réaction' : 'Reaction Time'}
                  </p>
                  <p className="text-xs text-foreground/85">
                    {isFr ? 'Vitesse de traitement' : 'Processing speed'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  phase === 'generating' 
                    ? 'bg-purple-600 text-white animate-pulse' 
                    : 'bg-gray-200 dark:bg-gray-700'
                }`}>
                  {phase === 'generating' ? '⚙' : '3'}
                </div>
                <div>
                  <p className="font-medium">{isFr ? 'Génération' : 'Generation'}</p>
                  <p className="text-xs text-foreground/85">
                    {isFr ? 'Création signature' : 'Creating signature'}
                  </p>
                </div>
              </div>
            </div>

            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Test Components */}
      {phase === 'stroop' && (
        <MiniStroopTest onComplete={handleStroopComplete} />
      )}

      {phase === 'reaction-time' && (
        <MiniReactionTimeTest onComplete={handleRTComplete} />
      )}

      {phase === 'generating' && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800/50 flex items-center justify-center animate-pulse">
                <Shield className="h-8 w-8 text-purple-900 dark:text-purple-100" />
              </div>
              <h3 className="text-lg font-semibold">
                {isFr 
                  ? 'Génération de votre signature cognitive...'
                  : 'Generating Your Cognitive Signature...'}
              </h3>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                {isFr
                  ? 'Analyse des patterns de réaction et effets d\'interférence'
                  : 'Analyzing reaction patterns and interference effects'}
              </p>
              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '200ms' }}></div>
                <div className="w-2 h-2 rounded-full bg-purple-600 animate-bounce" style={{ animationDelay: '400ms' }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}
