'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, Zap } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

const COLORS = ['red', 'blue', 'green', 'yellow'];
const WORDS_FR = ['ROUGE', 'BLEU', 'VERT', 'JAUNE'];
const WORDS_EN = ['RED', 'BLUE', 'GREEN', 'YELLOW'];
const TRIALS = 15; // Plus court pour la démo

interface BaselineEstablishmentProps {
  onComplete: (profile: any) => void;
}

type TestPhase = 'stroop' | 'reaction-time' | 'generating';

export function BaselineEstablishment({ onComplete }: BaselineEstablishmentProps) {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const [phase, setPhase] = useState<TestPhase>('stroop');
  const [currentTrial, setCurrentTrial] = useState(0);
  const [trial, setTrial] = useState<{word: string; color: string; congruent: boolean} | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [results, setResults] = useState<any[]>([]);
  const [rtState, setRtState] = useState<'waiting' | 'ready' | 'tooEarly'>('waiting');

  // Stroop Test
  useEffect(() => {
    if (phase === 'stroop' && currentTrial < TRIALS) {
      const WORDS = isFr ? WORDS_FR : WORDS_EN;
      const wordIndex = Math.floor(Math.random() * WORDS.length);
      const colorIndex = Math.floor(Math.random() * COLORS.length);
      setTrial({
        word: WORDS[wordIndex],
        color: COLORS[colorIndex],
        congruent: wordIndex === colorIndex
      });
      setStartTime(performance.now());
    } else if (phase === 'stroop' && currentTrial === TRIALS) {
      // Passer au RT test
      setCurrentTrial(0);
      setPhase('reaction-time');
    }
  }, [phase, currentTrial]);

  // Reaction Time Test
  useEffect(() => {
    if (phase === 'reaction-time' && currentTrial < TRIALS) {
      setRtState('waiting');
      const delay = 1000 + Math.random() * 2000;
      const timeout = setTimeout(() => {
        setRtState('ready');
        setStartTime(performance.now());
      }, delay);
      return () => clearTimeout(timeout);
    } else if (phase === 'reaction-time' && currentTrial === TRIALS) {
      // Générer baseline
      setPhase('generating');
      setTimeout(() => {
        const baseline = generateBaseline(results);
        onComplete(baseline);
      }, 1500);
    }
  }, [phase, currentTrial, results, onComplete]);

  const handleStroopResponse = (selectedColor: string) => {
    if (!trial) return;
    
    const responseTime = performance.now() - startTime;
    const correct = selectedColor === trial.color;

    setResults([...results, {
      type: 'stroop',
      congruent: trial.congruent,
      responseTime,
      correct
    }]);

    setCurrentTrial(currentTrial + 1);
  };

  const handleRtClick = () => {
    if (rtState === 'waiting') {
      setRtState('tooEarly');
      setTimeout(() => setCurrentTrial(currentTrial + 1), 500);
    } else if (rtState === 'ready') {
      const rt = performance.now() - startTime;
      setResults([...results, {
        type: 'rt',
        responseTime: rt
      }]);
      setCurrentTrial(currentTrial + 1);
    }
  };

  const generateBaseline = (data: any[]) => {
    const stroopData = data.filter(d => d.type === 'stroop');
    const rtData = data.filter(d => d.type === 'rt');

    const congruent = stroopData.filter(d => d.congruent);
    const incongruent = stroopData.filter(d => !d.congruent);

    const avgCongruent = congruent.reduce((sum, d) => sum + d.responseTime, 0) / congruent.length;
    const avgIncongruent = incongruent.reduce((sum, d) => sum + d.responseTime, 0) / incongruent.length;
    const stroopEffect = avgIncongruent - avgCongruent;

    const rts = rtData.map(d => d.responseTime);
    const avgRT = rts.reduce((sum, rt) => sum + rt, 0) / rts.length;
    const variance = rts.reduce((sum, rt) => sum + Math.pow(rt - avgRT, 2), 0) / rts.length;
    const rtSD = Math.sqrt(variance);

    const accuracy = stroopData.filter(d => d.correct).length / stroopData.length;

    return {
      avgRT,
      rtSD,
      stroopEffect,
      accuracy,
      timestamp: Date.now()
    };
  };

  const totalTrials = TRIALS * 2;
  const completedTrials = phase === 'stroop' ? currentTrial : TRIALS + currentTrial;
  const progress = (completedTrials / totalTrials) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">{isFr ? 'Étape 1 : Établissement du Baseline' : 'Step 1: Baseline Establishment'}</h2>
        <p className="text-lg text-foreground/70 mb-2">{isFr ? 'Création de Votre Profil de Référence' : 'Creating Your Reference Profile'}</p>
        <p className="text-sm text-foreground/70">
          {isFr
            ? 'Effectuez ces tests rapides pour établir votre signature cognitive'
            : 'Complete these quick tests to establish your cognitive signature'}
        </p>
      </div>

      {/* Progress */}
      <Card className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span className="font-medium">
              {phase === 'stroop' && (isFr ? 'Test de Stroop' : 'Stroop Test')}
              {phase === 'reaction-time' && (isFr ? 'Temps de Réaction' : 'Reaction Time')}
              {phase === 'generating' && (isFr ? 'Génération du Baseline' : 'Generating Baseline')}
            </span>
          </div>
          <span className="text-sm text-foreground/70">
            {completedTrials} / {totalTrials}
          </span>
        </div>
        <Progress value={progress} />
      </Card>

      {/* Stroop Test */}
      {phase === 'stroop' && trial && (
        <Card className="p-8">
          <div className="text-center mb-6">
            <p className="font-medium">{isFr ? 'Cliquez sur la COULEUR du texte (ignorez le mot)' : 'Click on the COLOR of the text (ignore the word)'}</p>
          </div>

          <div className="text-center py-12">
            <span 
              className="text-6xl font-bold"
              style={{ color: trial.color }}
            >
              {trial.word}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {COLORS.map(color => (
              <button
                key={color}
                onClick={() => handleStroopResponse(color)}
                className="h-16 text-lg font-bold rounded-lg transition-transform hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: color,
                  color: 'white'
                }}
              >
                {color === 'red' && (isFr ? 'ROUGE' : 'RED')}
                {color === 'blue' && (isFr ? 'BLEU' : 'BLUE')}
                {color === 'green' && (isFr ? 'VERT' : 'GREEN')}
                {color === 'yellow' && (isFr ? 'JAUNE' : 'YELLOW')}
              </button>
            ))}
          </div>
        </Card>
      )}

      {/* Reaction Time Test */}
      {phase === 'reaction-time' && (
        <Card className="p-8">
          <div className="text-center mb-6">
            <p className="font-medium">{isFr ? "Cliquez dès que l'écran devient VERT" : 'Click as soon as the screen turns GREEN'}</p>
          </div>

          <div 
            className={`h-96 rounded-lg flex items-center justify-center text-4xl font-bold cursor-pointer transition-all ${
              rtState === 'waiting' 
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                : rtState === 'ready'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
            onClick={handleRtClick}
          >
            {rtState === 'waiting' && (isFr ? 'Attendez...' : 'Wait...')}
            {rtState === 'ready' && (isFr ? 'CLIQUEZ !' : 'CLICK NOW!')}
            {rtState === 'tooEarly' && (isFr ? 'Trop tôt !' : 'Too early!')}
          </div>
        </Card>
      )}

      {/* Generating */}
      {phase === 'generating' && (
        <Card className="p-16 text-center">
          <Zap className="w-16 h-16 mx-auto mb-4 text-primary animate-pulse" />
          <h3 className="text-xl font-bold mb-2">{isFr ? 'Génération de Votre Baseline...' : 'Generating Your Baseline...'}</h3>
          <p className="text-sm text-foreground/70">
            {isFr
              ? 'Analyse des patterns cognitifs et création du profil de référence'
              : 'Analyzing cognitive patterns and creating reference profile'}
          </p>
        </Card>
      )}
    </div>
  );
}
