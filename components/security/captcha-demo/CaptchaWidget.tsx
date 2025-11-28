'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Shield, Loader2 } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

const COLORS = ['red', 'blue', 'green', 'yellow'];
const WORDS = ['RED', 'BLUE', 'GREEN', 'YELLOW'];
const TRIALS = 10;

interface Trial {
  word: string;
  color: string;
  congruent: boolean;
  responseTime: number;
  correct: boolean;
  timestamp: number;
}

interface CaptchaWidgetProps {
  onComplete: (results: any) => void;
}

export function CaptchaWidget({ onComplete }: CaptchaWidgetProps) {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const [currentTrial, setCurrentTrial] = useState(0);
  const [trial, setTrial] = useState<{ word: string; color: string; congruent: boolean } | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [testStartTime] = useState(Date.now());
  const [results, setResults] = useState<Trial[]>([]);
  const [showError, setShowError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (currentTrial < TRIALS) {
      const newTrial = generateTrial();
      setTrial(newTrial);
      setStartTime(performance.now());
    } else if (currentTrial === TRIALS && !analyzing) {
      // Test terminé - analyse
      setAnalyzing(true);
      
      // Artificial delay pour UX (montrer qu'on analyse)
      setTimeout(() => {
        const analysisResults = {
          trials: results,
          totalTime: Date.now() - testStartTime
        };
        onComplete(analysisResults);
      }, 1500);
    }
  }, [currentTrial, analyzing, results, testStartTime, onComplete]);

  const generateTrial = () => {
    const wordIndex = Math.floor(Math.random() * WORDS.length);
    const colorIndex = Math.floor(Math.random() * COLORS.length);
    return {
      word: WORDS[wordIndex],
      color: COLORS[colorIndex],
      congruent: wordIndex === colorIndex
    };
  };

  const handleResponse = (selectedColor: string) => {
    if (!trial || isProcessing) return;
    
    setIsProcessing(true);
    const responseTime = performance.now() - startTime;
    const correct = selectedColor === trial.color;

    if (!correct) {
      setShowError(true);
      
      // Clear any existing error timeout
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
      
      errorTimeoutRef.current = setTimeout(() => {
        setShowError(false);
        errorTimeoutRef.current = null;
      }, 300);
    }

    const trialResult: Trial = {
      ...trial,
      responseTime,
      correct,
      timestamp: Date.now()
    };

    setResults(prev => [...prev, trialResult]);
    
    // Small delay to prevent rapid clicks
    setTimeout(() => {
      setCurrentTrial(currentTrial + 1);
      setIsProcessing(false);
    }, 150);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  if (analyzing) {
    return (
      <Card className="max-w-2xl mx-auto p-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-4">{isFr ? 'Analyse de vos Réponses' : 'Analyzing Your Responses'}</h2>
          <p className="text-muted-foreground mb-6">
            {isFr
              ? 'Évaluation de la variabilité du temps de réaction, modèles d’interférence et courbe d’apprentissage...'
              : 'Evaluating reaction time variability, interference patterns, and learning curve...'}
          </p>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="w-2 h-2 rounded-full bg-primary mx-auto mb-2 animate-pulse" />
              {isFr ? 'Analyse TR' : 'RT Analysis'}
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="w-2 h-2 rounded-full bg-primary mx-auto mb-2 animate-pulse delay-100" />
              {isFr ? 'Effet Stroop' : 'Stroop Effect'}
            </div>
            <div className="p-3 rounded-lg bg-secondary/50">
              <div className="w-2 h-2 rounded-full bg-primary mx-auto mb-2 animate-pulse delay-200" />
              {isFr ? 'Correspondance Modèles' : 'Pattern Match'}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (!trial) return null;

  return (
    <Card className="max-w-2xl mx-auto p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold">HCS-Captcha</h2>
              <p className="text-sm text-muted-foreground">{isFr ? 'Vérifiez que vous êtes humain' : 'Verify you’re human'}</p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold">{currentTrial + 1} / {TRIALS}</p>
            <p className="text-sm text-muted-foreground">{isFr ? 'essais' : 'trials'}</p>
          </div>
        </div>

        {/* Progress */}
        <Progress value={((currentTrial + 1) / TRIALS) * 100} className="mb-6" />

        {/* Instruction */}
        <div className="text-center py-4 px-6 bg-secondary/50 rounded-lg">
          <p className="font-medium">{isFr ? 'Cliquez sur la COULEUR du texte' : 'Click the COLOR of the text'}</p>
          <p className="text-sm text-muted-foreground">{isFr ? '(ignorez ce que le mot dit)' : '(ignore what the word says)'}</p>
        </div>

        {/* Stimulus */}
        <div className={`text-center py-12 ${showError ? 'animate-shake' : ''}`}>
          <span 
            className="text-6xl font-bold"
            style={{ color: trial.color }}
          >
            {trial.word}
          </span>
        </div>

        {/* Response Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {COLORS.map(color => (
            <Button
              key={color}
              onClick={() => handleResponse(color)}
              disabled={isProcessing}
              className="h-16 text-lg font-bold transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: color,
                color: 'white'
              }}
            >
              {color.toUpperCase()}
            </Button>
          ))}
        </div>

        {/* Hint */}
        <p className="text-sm text-center text-muted-foreground mt-4">
          {isFr
            ? 'Conseil : Répondez naturellement. N’essayez pas d’être trop rapide ou trop parfait.'
            : 'Tip: Respond naturally. Don’t try to be too fast or too perfect.'}
        </p>
      </div>
    </Card>
  );
}
