'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useLanguage } from '@/components/LanguageProvider';

const COLORS = ['red', 'blue', 'green', 'yellow'];
const WORDS = ['RED', 'BLUE', 'GREEN', 'YELLOW'];
const TRIALS = 20;

interface StroopTrial {
  word: string;
  color: string;
  congruent: boolean;
  responseTime: number;
  correct: boolean;
}

interface MiniStroopTestProps {
  onComplete: (results: any) => void;
}

export function MiniStroopTest({ onComplete }: MiniStroopTestProps) {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const [currentTrial, setCurrentTrial] = useState(0);
  const [trial, setTrial] = useState<{ word: string; color: string; congruent: boolean } | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [results, setResults] = useState<StroopTrial[]>([]);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (currentTrial < TRIALS) {
      const newTrial = generateTrial();
      setTrial(newTrial);
      setStartTime(performance.now());
    } else if (currentTrial === TRIALS && results.length === TRIALS) {
      // Test terminé
      const calculated = calculateResults(results);
      onComplete(calculated);
    }
  }, [currentTrial, results]);

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
    if (!trial) return;
    
    const responseTime = performance.now() - startTime;
    const correct = selectedColor === trial.color;

    if (!correct) {
      setShowError(true);
      setTimeout(() => setShowError(false), 300);
    }

    const newResult: StroopTrial = {
      ...trial,
      responseTime,
      correct
    };

    setResults(prev => [...prev, newResult]);
    setCurrentTrial(currentTrial + 1);
  };

  const calculateResults = (trials: StroopTrial[]) => {
    const congruent = trials.filter(t => t.congruent);
    const incongruent = trials.filter(t => !t.congruent);

    const avgCongruent = congruent.length > 0
      ? congruent.reduce((sum, t) => sum + t.responseTime, 0) / congruent.length
      : 0;
    const avgIncongruent = incongruent.length > 0
      ? incongruent.reduce((sum, t) => sum + t.responseTime, 0) / incongruent.length
      : 0;

    return {
      stroopEffect: avgIncongruent - avgCongruent,
      accuracy: (trials.filter(t => t.correct).length / trials.length) * 100,
      avgCongruent,
      avgIncongruent,
      trials: trials.length
    };
  };

  if (!trial) return null;

  const colorMap: Record<string, string> = {
    red: 'bg-red-500 hover:bg-red-600',
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    yellow: 'bg-yellow-500 hover:bg-yellow-600'
  };

  const textColorMap: Record<string, string> = {
    red: 'text-red-600',
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-600'
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">{isFr ? 'Test Stroop' : 'Stroop Test'}</span>
            <span className="text-muted-foreground">{currentTrial + 1} / {TRIALS}</span>
          </div>
          <Progress value={((currentTrial + 1) / TRIALS) * 100} className="h-2" />
        </div>

        {/* Instruction */}
        <div className="text-center text-sm text-muted-foreground">
          {isFr 
            ? 'Cliquez sur la COULEUR de l\'encre (ignorez le mot)'
            : 'Click the COLOR of the ink (ignore the word)'}
        </div>

        {/* Stimulus */}
        <div className={`text-center py-8 ${showError ? 'animate-pulse' : ''}`}>
          <span className={`text-6xl font-bold ${textColorMap[trial.color]}`}>
            {trial.word}
          </span>
        </div>

        {/* Response buttons */}
        <div className="grid grid-cols-2 gap-3">
          {COLORS.map(color => (
            <Button
              key={color}
              onClick={() => handleResponse(color)}
              className={`h-16 text-lg font-bold text-white ${colorMap[color]}`}
              variant="default"
            >
              {color.toUpperCase()}
            </Button>
          ))}
        </div>

        {showError && (
          <div className="text-center text-red-600 text-sm animate-pulse">
            {isFr ? 'Incorrect - essayez encore' : 'Incorrect - try again'}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
