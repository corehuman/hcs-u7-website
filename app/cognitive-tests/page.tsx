'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  Clock, 
  AlertCircle, 
  ChevronRight,
  FlaskConical,
  Check,
  Zap,
  Hash,
  Timer,
  Workflow,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/components/LanguageProvider';

interface TestResult {
  score?: number;
  accuracy?: number;
  [key: string]: any;
}

interface Test {
  id: string;
  name: string;
  nameFr: string;
  icon: any;
  color: string;
  duration: string;
  measures: string;
  measuresFr: string;
  description: string;
  descriptionFr: string;
  status: 'available' | 'in-progress' | 'completed';
  href: string;
  result?: TestResult;
}

export default function CognitiveTestsPage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  
  const [tests, setTests] = useState<Test[]>([
    {
      id: 'stroop',
      name: 'Stroop Task',
      nameFr: 'Test de Stroop',
      icon: Brain,
      color: 'blue',
      duration: '3 min',
      measures: 'Inhibitory control',
      measuresFr: 'Contrôle inhibiteur',
      description: 'Test your ability to inhibit cognitive interference',
      descriptionFr: 'Testez votre capacité à inhiber les interférences cognitives',
      status: 'available',
      href: '/cognitive-tests/stroop'
    },
    {
      id: 'nback',
      name: 'N-Back Task',
      nameFr: 'Test N-Back',
      icon: Brain,
      color: 'purple',
      duration: '5 min',
      measures: 'Working memory',
      measuresFr: 'Mémoire de travail',
      description: 'Measure your working memory capacity',
      descriptionFr: 'Mesurez votre capacité de mémoire de travail',
      status: 'available',
      href: '/cognitive-tests/nback'
    },
    {
      id: 'trail',
      name: 'Trail Making',
      nameFr: 'Test du Tracé',
      icon: Workflow,
      color: 'green',
      duration: '4 min',
      measures: 'Cognitive flexibility',
      measuresFr: 'Flexibilité cognitive',
      description: 'Assess visual search and processing speed',
      descriptionFr: 'Évaluez la recherche visuelle et la vitesse de traitement',
      status: 'available',
      href: '/cognitive-tests/trail-making'
    },
    {
      id: 'digit',
      name: 'Digit Span',
      nameFr: 'Empan de chiffres',
      icon: Hash,
      color: 'yellow',
      duration: '3 min',
      measures: 'Short-term memory',
      measuresFr: 'Mémoire à court terme',
      description: 'Test your short-term and working memory',
      descriptionFr: 'Testez votre mémoire à court terme et de travail',
      status: 'available',
      href: '/cognitive-tests/digit-span'
    },
    {
      id: 'reaction',
      name: 'Reaction Time',
      nameFr: 'Temps de Réaction',
      icon: Zap,
      color: 'red',
      duration: '2 min',
      measures: 'Processing speed',
      measuresFr: 'Vitesse de traitement',
      description: 'Measure your simple and choice reaction time',
      descriptionFr: 'Mesurez vos temps de réaction simple et de choix',
      status: 'available',
      href: '/cognitive-tests/reaction-time'
    }
  ]);

  // Check for test results in sessionStorage
  useEffect(() => {
    const updateTestResults = () => {
      const updatedTests = tests.map(test => {
        const resultKey = `${test.id}Result`;
        const storedResult = sessionStorage.getItem(resultKey);
        
        // Check specific result keys based on test type
        let specificResultKey = '';
        switch(test.id) {
          case 'trail':
            specificResultKey = 'trailMakingResult';
            break;
          case 'digit':
            specificResultKey = 'digitSpanResult';
            break;
          case 'reaction':
            specificResultKey = 'reactionTimeResult';
            break;
          case 'stroop':
            specificResultKey = 'stroopResult';
            break;
          case 'nback':
            specificResultKey = 'nbackResult';
            break;
        }
        
        const specificResult = sessionStorage.getItem(specificResultKey);
        
        if (storedResult || specificResult) {
          const result = JSON.parse(storedResult || specificResult || '{}');
          return {
            ...test,
            status: 'completed' as const,
            result
          };
        }
        return test;
      });
      setTests(updatedTests);
    };

    // Check on mount
    updateTestResults();

    // Listen for storage events
    window.addEventListener('storage', updateTestResults);
    
    // Check when window gains focus (returning from test)
    const handleFocus = () => updateTestResults();
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', updateTestResults);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const completedCount = tests.filter(t => t.status === 'completed').length;
  const progress = (completedCount / tests.length) * 100;

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
      red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    };
    return colorMap[color] || colorMap.blue;
  };

  const clearAllResults = () => {
    // Clear all test results
    ['stroopResult', 'nbackResult', 'trailMakingResult', 'digitSpanResult', 'reactionTimeResult'].forEach(key => {
      sessionStorage.removeItem(key);
    });
    
    // Reset all tests to available
    setTests(tests.map(test => ({ ...test, status: 'available', result: undefined })));
  };

  return (
    <div className="container mx-auto max-w-6xl p-4 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {isFr ? 'Retour à l\'accueil' : 'Back to Home'}
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-3xl flex items-center gap-3">
                  <div className="rounded-xl bg-primary/10 p-3">
                    <FlaskConical className="h-8 w-8 text-primary" />
                  </div>
                  {isFr ? 'Suite de Tests Cognitifs' : 'Cognitive Tests Suite'}
                </CardTitle>
                <CardDescription className="text-lg">
                  {isFr 
                    ? 'Complétez des tests neurocognitifs validés pour mesurer objectivement vos capacités cognitives'
                    : 'Complete validated neurocognitive tests to objectively measure your cognitive abilities'}
                </CardDescription>
              </div>
              {completedCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllResults}
                  className="text-muted-foreground"
                >
                  {isFr ? 'Effacer les résultats' : 'Clear Results'}
                </Button>
              )}
            </div>
            
            {/* Progress */}
            {completedCount > 0 && (
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{isFr ? 'Progression' : 'Progress'}</span>
                  <span>{isFr ? `${completedCount} sur ${tests.length} complétés` : `${completedCount} of ${tests.length} completed`}</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Info Alert */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>{isFr ? 'Comment ça marche :' : 'How it works:'}</strong> {isFr 
                  ? 'Chaque test mesure différentes capacités cognitives. Complétez tous les tests pour obtenir un profil cognitif complet. Les tests sont adaptatifs et prennent généralement 2 à 5 minutes chacun. Vos résultats sont sauvegardés localement et peuvent être utilisés pour enrichir votre profil HCS-U7.'
                  : 'Each test measures different cognitive abilities. Complete all tests for a comprehensive cognitive profile. Tests are adaptive and typically take 2-5 minutes each. Your results are saved locally and can be used to enhance your HCS-U7 profile.'}
              </AlertDescription>
            </Alert>

            {/* Tests Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tests.map((test, index) => {
                const Icon = test.icon;
                const colorClasses = getColorClasses(test.color);
                
                return (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`relative overflow-hidden transition-all hover:shadow-lg ${
                      test.status === 'completed' ? 'border-green-500/50' : ''
                    }`}>
                      {test.status === 'completed' && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="outline" className="gap-1 bg-green-100 dark:bg-green-900/30">
                            <Check className="h-3 w-3" />
                            {isFr ? 'Complété' : 'Completed'}
                          </Badge>
                        </div>
                      )}
                      
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <div className={`rounded-lg p-2 ${colorClasses}`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg">{isFr ? test.nameFr : test.name}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                <Clock className="h-3 w-3 mr-1" />
                                {test.duration}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {isFr ? test.measuresFr : test.measures}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          {isFr ? test.descriptionFr : test.description}
                        </p>
                        
                        {test.result && (
                          <div className="bg-muted/50 rounded-lg p-3 space-y-1">
                            <p className="text-xs font-medium text-muted-foreground">{isFr ? 'Votre résultat :' : 'Your Result:'}</p>
                            {test.result.score !== undefined && (
                              <p className="text-sm font-semibold">
                                Score : {test.result.score}
                              </p>
                            )}
                            {test.result.accuracy !== undefined && (
                              <p className="text-sm">
                                {isFr ? 'Précision' : 'Accuracy'} : {test.result.accuracy}%
                              </p>
                            )}
                            {test.result.cognitiveFlexibility !== undefined && (
                              <p className="text-sm">
                                {isFr ? 'Flexibilité' : 'Flexibility'} : {test.result.cognitiveFlexibility}
                              </p>
                            )}
                            {test.result.workingMemory !== undefined && (
                              <p className="text-sm">
                                {isFr ? 'Score de mémoire' : 'Memory Score'} : {test.result.workingMemory}
                              </p>
                            )}
                            {test.result.processingSpeed !== undefined && (
                              <p className="text-sm">
                                {isFr ? 'Score de vitesse' : 'Speed Score'} : {test.result.processingSpeed}
                              </p>
                            )}
                          </div>
                        )}
                        
                        <Link href={test.href}>
                          <Button className="w-full" variant={test.status === 'completed' ? 'outline' : 'default'}>
                            {test.status === 'completed' 
                              ? (isFr ? 'Refaire le test' : 'Retake Test')
                              : (isFr ? 'Commencer le test' : 'Start Test')}
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Additional Info */}
            <Alert className="bg-primary/5">
              <Brain className="h-4 w-4" />
              <AlertDescription>
                <strong>{isFr ? 'Conseil :' : 'Pro tip:'}</strong> {isFr
                  ? 'Pour de meilleurs résultats, complétez les tests quand vous êtes bien reposé et dans un environnement calme. Évitez les distractions et utilisez un appareil avec une connexion internet stable. Les tests sauvegardent automatiquement votre progression.'
                  : 'For best results, complete tests when you\'re well-rested and in a quiet environment. Avoid distractions and use a device with a stable internet connection. Tests automatically save your progress.'}
              </AlertDescription>
            </Alert>

            {/* Navigation Buttons */}
            <div className="flex gap-4 justify-center pt-4">
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push('/')}
              >
                {isFr ? 'Retour à l\'accueil' : 'Return Home'}
              </Button>
              {completedCount === tests.length && (
                <Button
                  size="lg"
                  onClick={() => router.push('/generate')}
                  className="gap-2"
                >
                  {isFr ? 'Générer le profil HCS-U7' : 'Generate HCS-U7 Profile'}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
