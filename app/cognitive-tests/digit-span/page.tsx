'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Brain, ArrowRight, ArrowLeft, Hash, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

type TestPhase = 'instructions' | 'forward' | 'backward' | 'complete';
type TrialPhase = 'display' | 'input' | 'feedback';

interface TrialResult {
  span: number;
  correct: boolean;
  sequence: number[];
  userInput: number[];
}

export default function DigitSpanTest() {
  const router = useRouter();
  const [phase, setPhase] = useState<TestPhase>('instructions');
  const [trialPhase, setTrialPhase] = useState<TrialPhase>('display');
  const [currentSpan, setCurrentSpan] = useState(3); // Commence à 3 pour forward
  const [sequence, setSequence] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [currentDigitIndex, setCurrentDigitIndex] = useState(0);
  const [forwardSpan, setForwardSpan] = useState(0);
  const [backwardSpan, setBackwardSpan] = useState(0);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const [trialHistory, setTrialHistory] = useState<TrialResult[]>([]);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const displayTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Générer séquence aléatoire
  const generateSequence = (length: number): number[] => {
    return Array.from({ length }, () => Math.floor(Math.random() * 9) + 1);
  };

  // Démarrer nouveau trial
  const startTrial = () => {
    setSequence(generateSequence(currentSpan));
    setUserInput([]);
    setTrialPhase('display');
    setCurrentDigitIndex(0);
    setShowFeedback(false);
  };

  useEffect(() => {
    if (phase === 'forward') {
      setCurrentSpan(3);
      setConsecutiveFailures(0);
      setTrialHistory([]);
      startTrial();
    } else if (phase === 'backward') {
      setCurrentSpan(2);
      setConsecutiveFailures(0);
      setTrialHistory([]);
      startTrial();
    }
  }, [phase]);

  // Affichage séquence (1 chiffre par seconde)
  useEffect(() => {
    if (trialPhase === 'display' && currentDigitIndex <= sequence.length) {
      if (currentDigitIndex === sequence.length) {
        // Affichage terminé → input
        displayTimeoutRef.current = setTimeout(() => {
          setTrialPhase('input');
        }, 800);
      } else {
        // Afficher le prochain chiffre
        displayTimeoutRef.current = setTimeout(() => {
          setCurrentDigitIndex(currentDigitIndex + 1);
        }, 1200);
      }
    }
    
    return () => {
      if (displayTimeoutRef.current) {
        clearTimeout(displayTimeoutRef.current);
      }
    };
  }, [trialPhase, currentDigitIndex, sequence.length]);

  const handleDigitInput = (digit: number) => {
    if (userInput.length < currentSpan) {
      setUserInput([...userInput, digit]);
    }
  };

  const handleClear = () => {
    setUserInput([]);
  };

  const handleBackspace = () => {
    setUserInput(userInput.slice(0, -1));
  };

  const handleSubmit = () => {
    // Vérifier réponse
    const correctSequence = phase === 'forward' ? sequence : [...sequence].reverse();
    const isCorrectAnswer = userInput.length === correctSequence.length &&
      userInput.every((digit, idx) => digit === correctSequence[idx]);

    setIsCorrect(isCorrectAnswer);
    setShowFeedback(true);
    setTrialPhase('feedback');

    // Ajouter à l'historique
    const result: TrialResult = {
      span: currentSpan,
      correct: isCorrectAnswer,
      sequence: sequence,
      userInput: userInput
    };
    setTrialHistory([...trialHistory, result]);

    // Gérer la suite après un délai
    setTimeout(() => {
      if (isCorrectAnswer) {
        // Succès
        if (phase === 'forward') {
          setForwardSpan(Math.max(forwardSpan, currentSpan));
        } else {
          setBackwardSpan(Math.max(backwardSpan, currentSpan));
        }
        setConsecutiveFailures(0);
        
        // Augmenter la longueur
        const newSpan = currentSpan + 1;
        
        // Vérifier si on continue
        if ((phase === 'forward' && newSpan > 9) || 
            (phase === 'backward' && newSpan > 8)) {
          // Max atteint
          if (phase === 'forward') {
            setTimeout(() => setPhase('backward'), 1000);
          } else {
            setPhase('complete');
          }
        } else {
          setCurrentSpan(newSpan);
          startTrial();
        }
      } else {
        // Échec
        const failures = consecutiveFailures + 1;
        setConsecutiveFailures(failures);
        
        if (failures >= 2) {
          // 2 échecs consécutifs → arrêt
          if (phase === 'forward') {
            setTimeout(() => setPhase('backward'), 1000);
          } else {
            setPhase('complete');
          }
        } else {
          // Réessayer même longueur
          startTrial();
        }
      }
    }, 1500);
  };

  const calculateResults = () => {
    const totalSpan = forwardSpan + backwardSpan;
    const normalized = Math.min(100, (forwardSpan * 10 + backwardSpan * 15));
    
    return {
      forwardSpan,
      backwardSpan,
      totalSpan,
      workingMemory: Math.round(normalized),
      interpretation: interpretScore(totalSpan)
    };
  };

  const interpretScore = (total: number): string => {
    if (total >= 14) return "Excellent working memory";
    if (total >= 11) return "Good working memory";
    if (total >= 8) return "Average working memory";
    return "Below average (practice may improve)";
  };

  useEffect(() => {
    if (phase === 'complete') {
      const result = calculateResults();
      sessionStorage.setItem('digitSpanResult', JSON.stringify(result));
      setTimeout(() => router.push('/cognitive-tests'), 3000);
    }
  }, [phase, forwardSpan, backwardSpan]);

  // INSTRUCTIONS
  if (phase === 'instructions') {
    return (
      <div className="container mx-auto max-w-4xl p-4 min-h-screen flex items-center justify-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hash className="h-6 w-6 text-primary" />
              Digit Span Test
            </CardTitle>
            <CardDescription>
              Short-term & working memory
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-primary/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">Measures:</h3>
              <p className="text-sm text-foreground/85">
                Short-term memory capacity, working memory
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Part 1: Forward
                </h3>
                <p className="text-sm text-foreground/85 mb-2">
                  Digits will appear one at a time. After the sequence, 
                  repeat them in the SAME order.
                </p>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm">
                    <span className="font-mono">Display: 3 → 7 → 4</span><br />
                    <span className="font-mono">You enter: 3 → 7 → 4 ✓</span>
                  </p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Part 2: Backward
                </h3>
                <p className="text-sm text-foreground/85 mb-2">
                  After the sequence, repeat in REVERSE order.
                </p>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm">
                    <span className="font-mono">Display: 5 → 2 → 9</span><br />
                    <span className="font-mono">You enter: 9 → 2 → 5 ✓</span>
                  </p>
                </div>
              </div>
            </div>

            <Alert>
              <Brain className="h-4 w-4" />
              <AlertDescription>
                Sequences start short and get longer. The test ends after 2 consecutive 
                failures at the same length. Focus and take your time!
              </AlertDescription>
            </Alert>

            <Button 
              size="lg" 
              onClick={() => setPhase('forward')}
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
  if (phase === 'forward' || phase === 'backward') {
    const isBackward = phase === 'backward';
    const attemptNumber = trialHistory.filter(t => t.span === currentSpan).length + 1;

    return (
      <div className="container mx-auto max-w-4xl p-4 min-h-screen flex items-center justify-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                {isBackward ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
                {isBackward ? 'Part 2: Backward Span' : 'Part 1: Forward Span'}
              </span>
              <span className="text-sm text-foreground/85">
                Length: {currentSpan} | Attempt: {attemptNumber}/2
              </span>
            </CardTitle>
            <CardDescription>
              {isBackward ? 'Remember and repeat in REVERSE order' : 'Remember and repeat in the same order'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Display Phase */}
            {trialPhase === 'display' && (
              <div className="h-48 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {currentDigitIndex < sequence.length ? (
                    <motion.div
                      key={currentDigitIndex}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-8xl font-bold text-primary"
                    >
                      {sequence[currentDigitIndex]}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-2xl text-foreground/85"
                    >
                      Get ready...
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Input Phase */}
            {(trialPhase === 'input' || trialPhase === 'feedback') && (
              <>
                <div className="space-y-4">
                  <p className="text-center text-lg font-medium">
                    {isBackward ? 'Enter digits in REVERSE order:' : 'Enter digits in order:'}
                  </p>
                  
                  {/* Display user input */}
                  <div className="flex justify-center gap-2 min-h-[60px]">
                    {Array.from({ length: currentSpan }).map((_, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center font-bold text-xl
                          ${userInput[idx] !== undefined 
                            ? showFeedback 
                              ? (isBackward ? [...sequence].reverse() : sequence)[idx] === userInput[idx]
                                ? 'bg-green-100 dark:bg-green-900 border-green-500 text-green-700 dark:text-green-300'
                                : 'bg-red-100 dark:bg-red-900 border-red-500 text-red-700 dark:text-red-300'
                              : 'bg-primary/10 border-primary text-primary'
                            : 'border-gray-300 dark:border-gray-600'
                          }`}
                      >
                        {userInput[idx] || ''}
                      </motion.div>
                    ))}
                  </div>

                  {/* Show correct answer if wrong */}
                  {showFeedback && !isCorrect && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-center text-sm text-foreground/85"
                    >
                      Correct answer: {(isBackward ? [...sequence].reverse() : sequence).join(' → ')}
                    </motion.div>
                  )}

                  {/* Feedback message */}
                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center"
                    >
                      {isCorrect ? (
                        <span className="text-green-600 dark:text-green-400 font-semibold flex items-center justify-center gap-2">
                          <Check className="h-5 w-5" />
                          Correct!
                        </span>
                      ) : (
                        <span className="text-red-600 dark:text-red-400 font-semibold flex items-center justify-center gap-2">
                          <X className="h-5 w-5" />
                          Incorrect
                        </span>
                      )}
                    </motion.div>
                  )}
                </div>

                {/* Numeric keypad */}
                {!showFeedback && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
                        <Button
                          key={digit}
                          onClick={() => handleDigitInput(digit)}
                          disabled={userInput.length >= currentSpan}
                          className="h-14 text-xl font-semibold"
                          variant="outline"
                        >
                          {digit}
                        </Button>
                      ))}
                    </div>

                    <div className="flex gap-2 max-w-xs mx-auto">
                      <Button
                        onClick={handleBackspace}
                        disabled={userInput.length === 0}
                        variant="outline"
                        className="flex-1"
                      >
                        ← Backspace
                      </Button>
                      <Button
                        onClick={handleClear}
                        disabled={userInput.length === 0}
                        variant="outline"
                        className="flex-1"
                      >
                        Clear
                      </Button>
                    </div>

                    <Button
                      onClick={handleSubmit}
                      disabled={userInput.length !== currentSpan}
                      className="w-full max-w-xs mx-auto block"
                      size="lg"
                    >
                      Submit
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Progress indicator */}
            <div className="flex justify-center gap-1">
              {Array.from({ length: 7 }, (_, i) => i + 3).map(span => (
                <div
                  key={span}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    span < currentSpan
                      ? 'bg-green-500'
                      : span === currentSpan
                      ? 'bg-blue-500'
                      : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                  title={`Span ${span}`}
                />
              ))}
            </div>
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
                Great job! Returning to test suite...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <ArrowRight className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm text-foreground/85">Forward</p>
                  <p className="text-2xl font-bold">{result.forwardSpan}</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <ArrowLeft className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-sm text-foreground/85">Backward</p>
                  <p className="text-2xl font-bold">{result.backwardSpan}</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-foreground/85">Memory Score</p>
                  <p className="text-2xl font-bold">{result.workingMemory}</p>
                </div>
              </div>

              <Alert className="bg-primary/10">
                <Hash className="h-4 w-4" />
                <AlertDescription>
                  <strong>Performance:</strong> {result.interpretation}
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
