'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/components/LanguageProvider';

const TRIALS = 20;

interface MiniReactionTimeTestProps {
  onComplete: (results: any) => void;
}

export function MiniReactionTimeTest({ onComplete }: MiniReactionTimeTestProps) {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const [currentTrial, setCurrentTrial] = useState(0);
  const [state, setState] = useState<'waiting' | 'ready' | 'tooEarly'>('waiting');
  const [startTime, setStartTime] = useState(0);
  const [results, setResults] = useState<number[]>([]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentTrial < TRIALS) {
      startNewTrial();
    } else if (currentTrial === TRIALS && results.length > 0) {
      // Test terminé
      const calculated = calculateResults(results);
      onComplete(calculated);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentTrial]);

  const startNewTrial = () => {
    setState('waiting');
    
    // Random delay 1-3s
    const delay = 1000 + Math.random() * 2000;
    
    timeoutRef.current = setTimeout(() => {
      setState('ready');
      setStartTime(performance.now());
    }, delay);
  };

  const handleClick = () => {
    if (state === 'waiting') {
      // Too early
      setState('tooEarly');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setTimeout(() => {
        setCurrentTrial(prev => prev + 1);
      }, 1000);
    } else if (state === 'ready') {
      // Correct response
      const rt = performance.now() - startTime;
      setResults(prev => [...prev, rt]);
      setCurrentTrial(prev => prev + 1);
    }
  };

  const calculateResults = (rts: number[]) => {
    const avg = rts.reduce((sum, rt) => sum + rt, 0) / rts.length;
    const variance = rts.reduce((sum, rt) => sum + Math.pow(rt - avg, 2), 0) / rts.length;
    const sd = Math.sqrt(variance);

    return {
      avgRT: avg,
      rtSD: sd,
      rtMin: Math.min(...rts),
      rtMax: Math.max(...rts),
      trials: rts.length
    };
  };

  const bgColorClass = 
    state === 'waiting' 
      ? 'bg-gray-300 dark:bg-gray-700'
      : state === 'ready'
      ? 'bg-green-500'
      : 'bg-red-500';

  const textColorClass =
    state === 'waiting'
      ? 'text-gray-600 dark:text-foreground/70'
      : 'text-white';

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="font-medium">
              {isFr ? 'Test de Temps de Réaction' : 'Reaction Time Test'}
            </span>
            <span className="text-foreground/85">{currentTrial + 1} / {TRIALS}</span>
          </div>
          <Progress value={((currentTrial + 1) / TRIALS) * 100} className="h-2" />
        </div>

        {/* Instruction */}
        <div className="text-center text-sm text-foreground/85">
          {isFr
            ? 'Cliquez dès que l\'écran devient VERT'
            : 'Click as soon as the screen turns GREEN'}
        </div>

        {/* Stimulus area */}
        <div 
          className={`h-64 rounded-lg flex items-center justify-center text-3xl font-bold cursor-pointer transition-all ${bgColorClass} ${textColorClass}`}
          onClick={handleClick}
        >
          {state === 'waiting' && (isFr ? 'Attendez...' : 'Wait...')}
          {state === 'ready' && (isFr ? 'CLIQUEZ MAINTENANT !' : 'CLICK NOW!')}
          {state === 'tooEarly' && (isFr ? 'Trop tôt !' : 'Too Early!')}
        </div>

        {/* Mobile alternative */}
        <div className="md:hidden">
          <Button 
            onClick={handleClick}
            disabled={state !== 'ready'}
            className="w-full"
            size="lg"
          >
            {isFr ? 'Appuyez ici (Mobile)' : 'Tap Here (Mobile)'}
          </Button>
        </div>

        {/* Current stats */}
        {results.length > 0 && (
          <div className="text-center text-xs text-foreground/85">
            {isFr ? 'Moyenne actuelle' : 'Current average'}: {Math.round(
              results.reduce((sum, rt) => sum + rt, 0) / results.length
            )}ms
          </div>
        )}
      </CardContent>
    </Card>
  );
}
