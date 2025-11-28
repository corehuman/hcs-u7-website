'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Brain, Clock, Check, X, ArrowLeft, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';

type TestPhase = 'instructions' | 'partA' | 'partB' | 'complete';

interface Circle {
  id: string;
  value: string; // "1", "2", ... ou "A", "B", ...
  x: number; // Position X (%)
  y: number; // Position Y (%)
  isNumber: boolean;
}

interface Connection {
  from: Circle;
  to: Circle;
}

export default function TrailMakingTest() {
  const router = useRouter();
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  
  const [phase, setPhase] = useState<TestPhase>('instructions');
  const [circles, setCircles] = useState<Circle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [partATime, setPartATime] = useState(0);
  const [partBTime, setPartBTime] = useState(0);
  const [errors, setErrors] = useState({ partA: 0, partB: 0 });
  const [showError, setShowError] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Générer positions aléatoires pour les cercles
  const generateCircles = (isPartB: boolean) => {
    const items: Circle[] = [];
    const usedPositions: Set<string> = new Set();
    const minDistance = 15; // Distance minimale entre cercles
    
    if (isPartB) {
      // Part B: 13 nombres + 13 lettres
      const sequence: string[] = [];
      for (let i = 1; i <= 13; i++) {
        sequence.push(i.toString());
        sequence.push(String.fromCharCode(64 + i)); // A=65
      }
      
      for (let i = 0; i < sequence.length; i++) {
        let x, y;
        let attempts = 0;
        const maxAttempts = 100;
        
        do {
          x = Math.random() * 70 + 15; // 15-85%
          y = Math.random() * 70 + 15; // 15-85%
          attempts++;
        } while (isTooClose(x, y, usedPositions, minDistance) && attempts < maxAttempts);
        
        const posKey = `${x}-${y}`;
        usedPositions.add(posKey);
        
        items.push({
          id: `circle-${i}`,
          value: sequence[i],
          x,
          y,
          isNumber: !isNaN(Number(sequence[i]))
        });
      }
    } else {
      // Part A: 25 nombres
      for (let i = 1; i <= 25; i++) {
        let x, y;
        let attempts = 0;
        const maxAttempts = 100;
        
        do {
          x = Math.random() * 70 + 15; // 15-85%
          y = Math.random() * 70 + 15; // 15-85%
          attempts++;
        } while (isTooClose(x, y, usedPositions, minDistance) && attempts < maxAttempts);
        
        const posKey = `${x}-${y}`;
        usedPositions.add(posKey);
        
        items.push({
          id: `circle-${i}`,
          value: i.toString(),
          x,
          y,
          isNumber: true
        });
      }
    }
    
    return shuffleArray(items); // Mélanger pour que l'ordre spatial soit aléatoire
  };
  
  // Vérifier si une position est trop proche d'autres positions existantes
  const isTooClose = (x: number, y: number, usedPositions: Set<string>, minDistance: number): boolean => {
    for (const pos of usedPositions) {
      const [existingX, existingY] = pos.split('-').map(Number);
      const distance = Math.sqrt(Math.pow(x - existingX, 2) + Math.pow(y - existingY, 2));
      if (distance < minDistance) {
        return true;
      }
    }
    return false;
  };
  
  // Mélanger un tableau
  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Obtenir la séquence correcte
  const getExpectedValue = (index: number, isPartB: boolean): string => {
    if (isPartB) {
      // Part B: alternance nombres/lettres
      const num = Math.floor(index / 2) + 1;
      if (index % 2 === 0) {
        return num.toString();
      } else {
        return String.fromCharCode(64 + num);
      }
    } else {
      // Part A: nombres séquentiels
      return (index + 1).toString();
    }
  };

  useEffect(() => {
    if (phase === 'partA') {
      setCircles(generateCircles(false));
      setStartTime(performance.now());
      setCurrentIndex(0);
      setConnections([]);
    } else if (phase === 'partB') {
      setCircles(generateCircles(true));
      setStartTime(performance.now());
      setCurrentIndex(0);
      setConnections([]);
    }
  }, [phase]);

  const handleCircleClick = (circle: Circle) => {
    // Vérifier si c'est le bon cercle
    const expectedValue = getExpectedValue(currentIndex, phase === 'partB');
    
    if (circle.value !== expectedValue) {
      // Erreur
      setShowError(true);
      if (phase === 'partA') {
        setErrors(prev => ({ ...prev, partA: prev.partA + 1 }));
      } else {
        setErrors(prev => ({ ...prev, partB: prev.partB + 1 }));
      }
      setTimeout(() => setShowError(false), 800);
      return;
    }

    // Correct - trouver le cercle actuel pour la connexion
    const clickedCircle = circles.find(c => c.value === circle.value);
    if (currentIndex > 0 && clickedCircle) {
      const prevValue = getExpectedValue(currentIndex - 1, phase === 'partB');
      const prevCircle = circles.find(c => c.value === prevValue);
      if (prevCircle) {
        setConnections(prev => [...prev, { from: prevCircle, to: clickedCircle }]);
      }
    }
    
    setCurrentIndex(currentIndex + 1);

    // Test terminé ?
    const totalCircles = phase === 'partB' ? 26 : 25;
    if (currentIndex === totalCircles - 1) {
      const endTime = performance.now();
      const duration = (endTime - (startTime || 0)) / 1000; // secondes
      
      if (phase === 'partA') {
        setPartATime(duration);
        // Passer à Part B après un court délai
        setTimeout(() => setPhase('partB'), 1500);
      } else {
        setPartBTime(duration);
        // Terminé
        setTimeout(() => setPhase('complete'), 1500);
      }
    }
  };

  const calculateResults = () => {
    const bMinusA = partBTime - partATime;
    const flexibility = Math.max(0, Math.min(100, 100 - (bMinusA - 30) * 2));
    
    return {
      partATime: Math.round(partATime * 10) / 10,
      partBTime: Math.round(partBTime * 10) / 10,
      bMinusA: Math.round(bMinusA * 10) / 10,
      cognitiveFlexibility: Math.round(flexibility),
      partAErrors: errors.partA,
      partBErrors: errors.partB,
      interpretation: interpretScore(flexibility)
    };
  };

  const interpretScore = (score: number): string => {
    if (isFr) {
      if (score >= 80) return "Excellente flexibilité cognitive";
      if (score >= 60) return "Bonne flexibilité cognitive";
      if (score >= 40) return "Flexibilité cognitive moyenne";
      return "En dessous de la moyenne (la pratique peut améliorer)";
    } else {
      if (score >= 80) return "Excellent cognitive flexibility";
      if (score >= 60) return "Good cognitive flexibility";
      if (score >= 40) return "Average cognitive flexibility";
      return "Below average (practice may improve)";
    }
  };

  useEffect(() => {
    if (phase === 'complete') {
      const result = calculateResults();
      // Sauvegarder dans sessionStorage pour récupération
      sessionStorage.setItem('trailMakingResult', JSON.stringify(result));
      // Retour à la suite après 3s
      setTimeout(() => {
        router.push('/cognitive-tests');
      }, 3000);
    }
  }, [phase, partATime, partBTime, errors]);

  // INSTRUCTIONS
  if (phase === 'instructions') {
    return (
      <div className="container mx-auto max-w-4xl p-4 min-h-screen flex items-center justify-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              {isFr ? 'Test du Tracé' : 'Trail Making Test'}
            </CardTitle>
            <CardDescription>
              {isFr ? 'Flexibilité cognitive & vitesse de traitement' : 'Cognitive flexibility & processing speed'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-primary/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">{isFr ? 'Mesure :' : 'Measures:'}</h3>
              <p className="text-sm text-foreground/85">
                {isFr 
                  ? 'Recherche visuelle, vitesse de traitement, flexibilité cognitive'
                  : 'Visual search, processing speed, cognitive flexibility'}
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{isFr ? 'Partie A : Nombres' : 'Part A: Numbers'}</h3>
                <p className="text-sm text-foreground/85 mb-2">
                  {isFr
                    ? 'Connectez les cercles contenant des nombres dans l\'ordre croissant (1→ 2→ 3→...→ 25). Cliquez sur chaque cercle dans l\'ordre aussi vite que possible.'
                    : 'Connect circles containing numbers in ascending order (1→ 2→ 3→...→ 25). Click each circle in sequence as fast as possible.'}
                </p>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm font-mono">{isFr ? 'Exemple :' : 'Example:'} 1 → 2 → 3 → ...</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">{isFr ? 'Partie B : Nombres et Lettres' : 'Part B: Numbers & Letters'}</h3>
                <p className="text-sm text-foreground/85 mb-2">
                  {isFr
                    ? 'Alternez entre les nombres et les lettres (1→ A→ 2→ B→ 3→ C→...→ 13→ M).'
                    : 'Alternate between numbers and letters (1→A→2→B→3→C→...→13→M).'}
                  Alternate between numbers and letters (1→A→2→B→3→C→...→13→M).
                </p>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm font-mono">Example: 1 → A → 2 → B → ...</p>
                </div>
              </div>
            </div>

            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Important:</strong> Speed matters! Connect as fast as possible while maintaining accuracy.
                If you make a mistake, you'll see a red flash and must continue from where you left off.
              </AlertDescription>
            </Alert>

            <Button 
              size="lg" 
              onClick={() => setPhase('partA')}
              className="w-full"
            >
              Start Part A (Numbers)
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // TEST INTERFACE (Part A ou Part B)
  if (phase === 'partA' || phase === 'partB') {
    const isPartB = phase === 'partB';
    const totalCircles = isPartB ? 26 : 25;
    const progress = (currentIndex / totalCircles) * 100;
    const expectedValue = getExpectedValue(currentIndex, isPartB);

    return (
      <div className="container mx-auto max-w-6xl p-4 min-h-screen">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-primary" />
                {isPartB ? 'Part B: Numbers & Letters' : 'Part A: Numbers'}
              </span>
              <span className="text-sm text-foreground/85">
                Connect: {expectedValue}
              </span>
            </CardTitle>
            <CardDescription>
              <div className="flex justify-between items-center">
                <span>{currentIndex} / {totalCircles}</span>
                <span>Errors: {isPartB ? errors.partB : errors.partA}</span>
              </div>
            </CardDescription>
            <Progress value={progress} className="mt-2" />
          </CardHeader>
          
          <CardContent className="relative">
            {/* Canvas de jeu */}
            <div 
              ref={canvasRef}
              className={`relative w-full h-[600px] bg-gray-50 dark:bg-gray-900 rounded-lg border-2 ${
                showError ? 'border-red-500 bg-red-100 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'
              } transition-all duration-300`}
            >
              {/* SVG pour les connexions */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {connections.map((conn, idx) => (
                  <line
                    key={idx}
                    x1={`${conn.from.x}%`}
                    y1={`${conn.from.y}%`}
                    x2={`${conn.to.x}%`}
                    y2={`${conn.to.y}%`}
                    stroke="rgb(34 197 94)"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                    className="animate-pulse"
                  />
                ))}
              </svg>

              {/* Cercles */}
              {circles.map((circle) => {
                const isCompleted = circle.value === getExpectedValue(
                  Array.from({ length: currentIndex }, (_, i) => i)
                    .find(i => getExpectedValue(i, isPartB) === circle.value) ?? -1,
                  isPartB
                ) && Array.from({ length: currentIndex }, (_, i) => i)
                  .some(i => getExpectedValue(i, isPartB) === circle.value);
                
                const isCurrent = circle.value === expectedValue;

                return (
                  <motion.button
                    key={circle.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: Math.random() * 0.3 }}
                    onClick={() => handleCircleClick(circle)}
                    disabled={isCompleted}
                    className={`absolute w-14 h-14 rounded-full font-bold text-lg transition-all transform hover:scale-110 ${
                      isCompleted
                        ? 'bg-green-500 text-white cursor-default'
                        : isCurrent
                        ? 'bg-blue-500 text-white animate-pulse shadow-lg ring-4 ring-blue-300'
                        : circle.isNumber
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-800'
                        : 'bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-100 hover:bg-orange-200 dark:hover:bg-orange-800'
                    }`}
                    style={{
                      left: `${circle.x}%`,
                      top: `${circle.y}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    {isCompleted ? <Check className="h-6 w-6 mx-auto" /> : circle.value}
                  </motion.button>
                );
              })}
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
                Excellent work. Returning to test suite...
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm text-blue-800 dark:text-blue-200">Part A</p>
                  <p className="text-2xl font-bold">{result.partATime}s</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                  <p className="text-sm text-red-800 dark:text-red-200">Part B</p>
                  <p className="text-2xl font-bold">{result.partBTime}s</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Brain className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-sm text-orange-800 dark:text-orange-200">Flexibility</p>
                  <p className="text-2xl font-bold">{result.cognitiveFlexibility}</p>
                </div>
              </div>

              <Alert className="bg-primary/10">
                <Brain className="h-4 w-4" />
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
