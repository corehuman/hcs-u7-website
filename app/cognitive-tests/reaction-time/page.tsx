'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Brain, Zap, Timer, AlertTriangle, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type TestPhase = 'instructions' | 'simple' | 'choice' | 'complete';
type TrialState = 'waiting' | 'ready' | 'stimulus' | 'tooEarly' | 'responded';

interface Trial {
  rt: number;
  valid: boolean;
  color?: 'red' | 'blue';
  response?: 'red' | 'blue';
}

export default function ReactionTimeTest() {
  const router = useRouter();
  const [phase, setPhase] = useState<TestPhase>('instructions');
  const [trialState, setTrialState] = useState<TrialState>('waiting');
  const [currentTrial, setCurrentTrial] = useState(0);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [stimulusTime, setStimulusTime] = useState(0);
  const [stimulusColor, setStimulusColor] = useState<'red' | 'blue' | null>(null);
  const [lastReactionTime, setLastReactionTime] = useState<number | null>(null);
  const [showTrialFeedback, setShowTrialFeedback] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const keyPressedRef = useRef(false);

  const TRIALS_PER_PHASE = 20;

  // Démarrer trial
  const startTrial = () => {
    setTrialState('ready');
    setShowTrialFeedback(false);
    setLastReactionTime(null);
    keyPressedRef.current = false;
    
    // Court délai avant de commencer
    setTimeout(() => {
      setTrialState('waiting');
      
      // Délai aléatoire 1-3s
      const delay = 1000 + Math.random() * 2000;
      
      timeoutRef.current = setTimeout(() => {
        setTrialState('stimulus');
        setStimulusTime(performance.now());
        
        if (phase === 'choice') {
          setStimulusColor(Math.random() < 0.5 ? 'red' : 'blue');
        }
      }, delay);
    }, 500);
  };

  useEffect(() => {
    if (phase === 'simple') {
      setCurrentTrial(0);
      setTrials([]); // Clear trials only at the start of simple phase
      startTrial();
    } else if (phase === 'choice') {
      setCurrentTrial(0);
      // Don't clear trials here - keep the simple RT trials
      startTrial();
    }
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [phase]);

  const handleResponse = (response?: 'red' | 'blue') => {
    // Éviter les réponses multiples
    if (keyPressedRef.current) return;
    keyPressedRef.current = true;

    if (trialState === 'waiting' || trialState === 'ready') {
      // Trop tôt
      setTrialState('tooEarly');
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      
      setTimeout(() => {
        moveToNextTrial();
      }, 2000);
      return;
    }

    if (trialState === 'stimulus') {
      const rt = performance.now() - stimulusTime;
      setLastReactionTime(rt);
      setTrialState('responded');
      setShowTrialFeedback(true);
      
      // Pour choice RT, vérifier si la réponse est correcte
      let valid = true;
      if (phase === 'choice') {
        valid = response === stimulusColor;
      }
      
      const trial: Trial = {
        rt,
        valid,
        color: stimulusColor || undefined,
        response
      };
      
      // Utiliser une fonction de mise à jour pour éviter les problèmes de closure
      setTrials(prevTrials => [...prevTrials, trial]);
      
      setTimeout(() => {
        moveToNextTrial();
      }, 1000);
    }
  };

  const moveToNextTrial = () => {
    const nextTrial = currentTrial + 1;
    
    if (nextTrial >= TRIALS_PER_PHASE) {
      // Phase terminée
      if (phase === 'simple') {
        setPhase('choice');
      } else {
        setPhase('complete');
      }
    } else {
      setCurrentTrial(nextTrial);
      startTrial();
    }
  };

  // Gestionnaire de touches clavier
  useEffect(() => {
    if (phase === 'simple' && (trialState === 'waiting' || trialState === 'stimulus')) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Space') {
          e.preventDefault();
          handleResponse();
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    } else if (phase === 'choice' && (trialState === 'waiting' || trialState === 'stimulus')) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key.toLowerCase() === 'r') {
          e.preventDefault();
          handleResponse('red');
        } else if (e.key.toLowerCase() === 'b') {
          e.preventDefault();
          handleResponse('blue');
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [phase, trialState, stimulusColor, trials]);

  const calculateResults = () => {
    // Les premiers TRIALS_PER_PHASE trials sont simple RT
    // Les suivants sont choice RT
    const simpleTrials = trials.slice(0, TRIALS_PER_PHASE).filter(t => t.valid);
    const choiceTrials = trials.slice(TRIALS_PER_PHASE).filter(t => t.valid);
    
    if (simpleTrials.length === 0 || choiceTrials.length === 0) {
      return {
        simpleRT: 0,
        choiceRT: 0,
        choiceMinusSimple: 0,
        processingSpeed: 0,
        consistency: 0,
        accuracy: 0,
        interpretation: "Insufficient data"
      };
    }
    
    const avgSimple = simpleTrials.reduce((sum, t) => sum + t.rt, 0) / simpleTrials.length;
    const avgChoice = choiceTrials.reduce((sum, t) => sum + t.rt, 0) / choiceTrials.length;
    const diff = avgChoice - avgSimple;
    
    // SD (consistency) 
    const sdSimple = Math.sqrt(
      simpleTrials.reduce((sum, t) => sum + Math.pow(t.rt - avgSimple, 2), 0) / simpleTrials.length
    );
    
    // Accuracy for choice trials
    const choiceAccuracy = (choiceTrials.length / TRIALS_PER_PHASE) * 100;
    
    // Normaliser
    const normalized = Math.max(0, Math.min(100, 
      100 - ((avgSimple - 200) + (avgChoice - 300)) / 5
    ));
    
    return {
      simpleRT: Math.round(avgSimple),
      choiceRT: Math.round(avgChoice),
      choiceMinusSimple: Math.round(diff),
      processingSpeed: Math.round(normalized),
      consistency: Math.round(sdSimple),
      accuracy: Math.round(choiceAccuracy),
      interpretation: interpretSpeed(normalized)
    };
  };

  const interpretSpeed = (score: number): string => {
    if (score >= 80) return "Excellent processing speed";
    if (score >= 60) return "Good processing speed";
    if (score >= 40) return "Average processing speed";
    return "Below average (fatigue may affect results)";
  };

  useEffect(() => {
    if (phase === 'complete') {
      const result = calculateResults();
      sessionStorage.setItem('reactionTimeResult', JSON.stringify(result));
      setTimeout(() => router.push('/cognitive-tests'), 3000);
    }
  }, [phase, trials]);

  // INSTRUCTIONS
  if (phase === 'instructions') {
    return (
      <div className="container mx-auto max-w-4xl p-4 min-h-screen flex items-center justify-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              Reaction Time Test
            </CardTitle>
            <CardDescription>
              Processing speed & motor response
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-primary/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Measures:</h3>
              <p className="text-sm text-muted-foreground">
                Simple & choice reaction time, processing speed
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  Part 1: Simple Reaction
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Wait for the screen to turn GREEN, then press SPACE as fast as possible.
                </p>
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-300 rounded flex items-center justify-center text-xs font-bold">
                      Wait...
                    </div>
                    <span>→</span>
                    <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center text-xs font-bold text-white">
                      GO!
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Timer className="h-4 w-4" />
                  Part 2: Choice Reaction
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Press R for RED or B for BLUE as quickly as possible.
                </p>
                <div className="bg-muted/50 rounded-lg p-3 space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-red-500 rounded flex items-center justify-center text-xs font-bold text-white">
                      RED
                    </div>
                    <span>→ Press R</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center text-xs font-bold text-white">
                      BLUE
                    </div>
                    <span>→ Press B</span>
                  </div>
                </div>
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Wait for the stimulus before responding. 
                Premature responses will be marked as errors. Each part has 20 trials (~1 minute each).
              </AlertDescription>
            </Alert>

            <Button 
              size="lg" 
              onClick={() => setPhase('simple')}
              className="w-full"
            >
              Start Test
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // TEST INTERFACE
  if (phase === 'simple' || phase === 'choice') {
    const isChoice = phase === 'choice';
    const progress = ((currentTrial + 1) / TRIALS_PER_PHASE) * 100;

    return (
      <div className="container mx-auto max-w-4xl p-4 min-h-screen flex items-center justify-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                {isChoice ? 'Part 2: Choice Reaction' : 'Part 1: Simple Reaction'}
              </span>
              <span className="text-sm text-muted-foreground">
                Trial {currentTrial + 1} / {TRIALS_PER_PHASE}
              </span>
            </CardTitle>
            <Progress value={progress} className="mt-2" />
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Stimulus display */}
            <div className="flex justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={trialState}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`w-80 h-80 rounded-2xl flex flex-col items-center justify-center text-4xl font-bold transition-all ${
                    trialState === 'ready' 
                      ? 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
                      : trialState === 'waiting' 
                      ? 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      : trialState === 'stimulus' && !isChoice
                      ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                      : trialState === 'stimulus' && isChoice && stimulusColor === 'red'
                      ? 'bg-red-500 text-white shadow-lg shadow-red-500/50'
                      : trialState === 'stimulus' && isChoice && stimulusColor === 'blue'
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                      : trialState === 'tooEarly'
                      ? 'bg-orange-500 text-white'
                      : trialState === 'responded'
                      ? 'bg-gray-200 dark:bg-gray-800 text-gray-500'
                      : ''
                  }`}
                >
                  {trialState === 'ready' && 'Get ready...'}
                  {trialState === 'waiting' && 'Wait...'}
                  {trialState === 'stimulus' && !isChoice && 'GO!'}
                  {trialState === 'stimulus' && isChoice && (
                    <>
                      <div className="text-5xl mb-4">
                        {stimulusColor === 'red' ? 'RED' : 'BLUE'}
                      </div>
                      <div className="text-xl opacity-80">
                        Press {stimulusColor === 'red' ? 'R' : 'B'}
                      </div>
                    </>
                  )}
                  {trialState === 'tooEarly' && (
                    <div className="text-center">
                      <div className="text-3xl mb-2">Too early!</div>
                      <div className="text-lg opacity-80">Wait for the signal</div>
                    </div>
                  )}
                  {trialState === 'responded' && showTrialFeedback && (
                    <div className="text-center">
                      <Check className="h-16 w-16 mx-auto mb-2 text-green-600" />
                      {lastReactionTime && (
                        <div className="text-2xl text-gray-700 dark:text-gray-300">
                          {Math.round(lastReactionTime)} ms
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Instructions */}
            <div className="text-center space-y-4">
              {!isChoice ? (
                <>
                  <p className="text-muted-foreground">
                    Press SPACE when you see GREEN
                  </p>
                  <Button
                    size="lg"
                    onClick={() => handleResponse()}
                    disabled={trialState !== 'stimulus'}
                    className="min-w-[200px]"
                  >
                    Press SPACE
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground">
                    Press R for RED | Press B for BLUE
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button
                      size="lg"
                      onClick={() => handleResponse('red')}
                      disabled={trialState !== 'stimulus'}
                      className="min-w-[120px] bg-red-500 hover:bg-red-600"
                    >
                      R - Red
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => handleResponse('blue')}
                      disabled={trialState !== 'stimulus'}
                      className="min-w-[120px] bg-blue-500 hover:bg-blue-600"
                    >
                      B - Blue
                    </Button>
                  </div>
                </>
              )}
            </div>

            {/* Quick stats */}
            {trials.length > 0 && (
              <div className="flex justify-center gap-8 text-sm text-muted-foreground">
                <div>
                  Valid: {trials.filter(t => t.valid).length}/{trials.length}
                </div>
                {trials.filter(t => t.valid).length > 0 && (
                  <div>
                    Avg: {Math.round(
                      trials.filter(t => t.valid).reduce((sum, t) => sum + t.rt, 0) / 
                      trials.filter(t => t.valid).length
                    )} ms
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // COMPLETE
  if (phase === 'complete') {
    const result = calculateResults();

    return (
      <div className="container mx-auto max-w-4xl p-4 min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-6 w-6 text-green-500" />
                Test Complete!
              </CardTitle>
              <CardDescription>
                Excellent work. Returning to test suite...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Timer className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm text-muted-foreground">Simple RT</p>
                  <p className="text-2xl font-bold">{result.simpleRT} ms</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Timer className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm text-muted-foreground">Choice RT</p>
                  <p className="text-2xl font-bold">{result.choiceRT} ms</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">Processing Speed</p>
                  <p className="text-2xl font-bold">{result.processingSpeed}</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-sm text-muted-foreground">Accuracy</p>
                  <p className="text-2xl font-bold">{result.accuracy}%</p>
                </div>
              </div>

              <Alert className="bg-primary/10">
                <Zap className="h-4 w-4" />
                <AlertDescription>
                  <strong>Performance:</strong> {result.interpretation}
                  <br />
                  <span className="text-sm">
                    Decision time: {result.choiceMinusSimple} ms | 
                    Consistency (SD): {result.consistency} ms
                  </span>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return null;
}
