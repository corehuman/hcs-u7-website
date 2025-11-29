'use client';

import { useEffect, useRef, useState } from 'react';
import type { VocalMetrics } from '@/lib/vocal-metrics';
import { analyzeVocalPatterns } from '@/lib/vocal-metrics';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Mic, Info } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

/**
 * RAN TEST - Rapid Automatized Naming
 *
 * Test vocal de dénomination rapide de couleurs.
 * Mesure patterns vocaux humains (timings, hésitations, fatigue).
 *
 * Durée: ~20-30 secondes
 * Support: Chrome, Edge, Safari 14.5+ (pas Firefox)
 */

interface RANTestProps {
  onComplete: (results: VocalMetrics) => void;
  onSkip?: () => void;
}

// Configuration
const COLORS_EMOJI = ['🔴', '🟢', '🔵', '🟡', '🟠', '🟣'];
const COLORS_FR = ['rouge', 'vert', 'bleu', 'jaune', 'orange', 'violet'];
const TOTAL_ITEMS = 20;
const HESITATION_MARKERS = ['euh', 'hmm', 'heu', 'ah', 'ben'];

interface SpeechRecognitionResultLike {
  0: { transcript: string };
  length: number;
  // Indique si le segment est final (Web Speech API)
  isFinal?: boolean;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

export default function RANTest({ onComplete, onSkip }: RANTestProps) {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  // État support vocal / progression
  const [hasSupport, setHasSupport] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sequence] = useState<number[]>(() =>
    Array.from({ length: TOTAL_ITEMS }, () =>
      Math.floor(Math.random() * COLORS_EMOJI.length)
    )
  );

  // Données collectées
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const timingsRef = useRef<number[]>([]);
  const correctCountRef = useRef(0);
  const hesitationCountRef = useRef(0);
  const breathingPausesRef = useRef<number[]>([]);
  const lastWordTimeRef = useRef(0);

  // Ref pour suivre l'état courant dans les callbacks
  const isRecordingRef = useRef(false);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  // Détection support navigateur (côté client uniquement)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const win = window as WindowWithSpeechRecognition;
    const SpeechRecognitionCtor =
      win.SpeechRecognition || win.webkitSpeechRecognition;

    const hasSpeech = !!SpeechRecognitionCtor;
    const hasMedia =
      typeof navigator !== 'undefined' &&
      !!navigator.mediaDevices?.getUserMedia;

    // Ici on synchronise simplement l'environnement navigateur avec l'état local.
    // react-hooks/set-state-in-effect est désactivé au profit d'une détection
    // ponctuelle au montage, ce qui reste sûr et borné.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasSupport(hasSpeech && hasMedia);
  }, []);

  /**
   * Démarrage test vocal
   */
  const startTest = async () => {
    if (!hasSupport) {
      return;
    }

    try {
      // Demander permission microphone
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const win = window as WindowWithSpeechRecognition;
      const SpeechRecognitionCtor =
        win.SpeechRecognition || win.webkitSpeechRecognition;

      if (!SpeechRecognitionCtor) {
        setHasSupport(false);
        return;
      }

      const recognition = new SpeechRecognitionCtor();

      // Configuration reconnaissance vocale
      recognition.lang = 'fr-FR';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      // Handler: Démarrage
      recognition.onstart = () => {
        console.log('[RAN] Test démarré');
        const now = performance.now();
        lastWordTimeRef.current = now;
        setIsRecording(true);
      };

      // Handler: Résultats reconnaissance
      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        const result = event.results[event.results.length - 1];

        // Ignorer les résultats intermédiaires pour ne compter qu'un item
        // par segment final, sinon le test s'accélère artificiellement.
        if (result && result.isFinal === false) {
          return;
        }

        const now = performance.now();
        const transcript: string = result[0].transcript.toLowerCase().trim();

        console.log('[RAN] Transcription:', transcript);

        // Détecter hésitations
        const hasHesitation = HESITATION_MARKERS.some((marker) =>
          transcript.includes(marker)
        );
        if (hasHesitation) {
          hesitationCountRef.current += 1;
          console.log('[RAN] Hésitation détectée:', transcript);
        }

        // Détecter couleurs prononcées (en français)
        COLORS_FR.forEach((colorName, colorIdx) => {
          if (!transcript.includes(colorName)) return;

          setCurrentIndex((prev) => {
            const expectedColorIdx = sequence[prev];

            if (colorIdx === expectedColorIdx) {
              correctCountRef.current += 1;
              console.log(
                `[RAN] Correct! ${colorName} (${prev + 1}/${TOTAL_ITEMS})`
              );
            } else {
              console.log(
                `[RAN] Erreur: dit "${colorName}", attendu "${COLORS_FR[expectedColorIdx]}"`
              );
            }

            // Calculer timing inter-item
            const interItemPause = now - lastWordTimeRef.current;
            timingsRef.current.push(interItemPause);

            // Détecter pauses respiratoires (>500ms)
            if (interItemPause > 500) {
              breathingPausesRef.current.push(interItemPause);
              console.log(
                `[RAN] Pause respiratoire détectée: ${interItemPause}ms`
              );
            }

            lastWordTimeRef.current = now;

            const nextIndex = prev + 1;
            if (nextIndex >= TOTAL_ITEMS) {
              setTimeout(() => stopTest(), 500);
            }

            return nextIndex;
          });
        });
      };

      // Handler: Erreurs
      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        console.error('[RAN] Erreur reconnaissance:', event.error);

        if (event.error === 'not-allowed') {
          setHasSupport(false);
        }
      };

      // Handler: Fin reconnaissance (ex: timeout)
      recognition.onend = () => {
        // Si on n'a pas explicitement arrêté et que le test n'est pas terminé,
        // on peut relancer une fois pour capturer la fin.
        if (isRecordingRef.current && currentIndex < TOTAL_ITEMS) {
          recognition.start();
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (error) {
      console.error('[RAN] Erreur démarrage:', error);
      setHasSupport(false);
    }
  };

  /**
   * Arrêt test et analyse résultats
   */
  const stopTest = () => {
    console.log('[RAN] Arrêt du test');

    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.onend = null;
      recognition.stop();
      recognitionRef.current = null;
    }

    setIsRecording(false);

    const results = analyzeResults();
    console.log('[RAN] Résultats:', results);

    onComplete(results);
  };

  /**
   * Analyse des patterns vocaux
   */
  const analyzeResults = (): VocalMetrics => {
    const timings = timingsRef.current;

    // Si pas assez de données, retourner résultats par défaut
    if (timings.length < 5) {
      console.warn('[RAN] Pas assez de données, résultats par défaut');
      return {
        test: 'ran',
        totalItems: TOTAL_ITEMS,
        correctItems: correctCountRef.current,
        meanInterItemPause: 0,
        varianceInterItemPause: 0,
        hesitationRate: 0,
        fatigueEffect: 0,
        breathingPauses: 0,
        prosodyScore: 0,
        isLikelyBot: true,
        confidence: 0.5,
        flags: ['insufficient-data'],
      };
    }

    const mean =
      timings.reduce((sum, t) => sum + t, 0) / (timings.length || 1);

    const analysis = analyzeVocalPatterns(
      timings,
      hesitationCountRef.current,
      TOTAL_ITEMS
    );

    const variance = Math.sqrt(
      timings
        .map((t) => Math.pow(t - mean, 2))
        .reduce((sum, v) => sum + v, 0) / timings.length
    );

    return {
      test: 'ran',
      totalItems: TOTAL_ITEMS,
      correctItems: correctCountRef.current,
      meanInterItemPause: mean,
      varianceInterItemPause: variance,
      hesitationRate: hesitationCountRef.current / TOTAL_ITEMS,
      fatigueEffect: analysis.fatigueEffect,
      breathingPauses: breathingPausesRef.current.length,
      prosodyScore: analysis.prosodyScore,
      isLikelyBot: analysis.isLikelyBot,
      confidence: analysis.confidence,
      flags: analysis.flags,
    };
  };

  // Cleanup reconnaissance à l'unmount
  useEffect(() => {
    return () => {
      const recognition = recognitionRef.current;
      if (recognition) {
        recognition.onend = null;
        recognition.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  // Render: Pas de support ou permission refusée
  if (hasSupport === false) {
    return (
      <Card className="mx-auto max-w-2xl p-8">
        <div className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">
              {isFr
                ? '🎤 Test Vocal Non Disponible'
                : '🎤 Vocal Test Not Available'}
            </h2>
            <p className="text-sm text-foreground/85">
              {isFr
                ? "Votre navigateur ne supporte pas la reconnaissance vocale ou l'accès au microphone a été refusé."
                : 'Your browser does not support speech recognition or microphone access was denied.'}
            </p>
          </div>

          <Alert>
            <AlertDescription className="text-sm">
              {isFr
                ? 'Vous pouvez continuer la batterie de tests sans ce module vocal. La sécurité globale sera légèrement réduite (~10%).'
                : 'You can continue the test battery without this vocal module. Overall security will be slightly reduced (~10%).'}
            </AlertDescription>
          </Alert>

          {onSkip && (
            <Button onClick={onSkip} className="w-full">
              {isFr
                ? 'Continuer sans test vocal'
                : 'Continue without vocal test'}
            </Button>
          )}
        </div>
      </Card>
    );
  }

  // Render: Chargement compatibilité
  if (hasSupport === null) {
    return (
      <Card className="mx-auto max-w-md p-8">
        <div className="flex flex-col items-center gap-4">
          <Mic className="h-8 w-8 text-primary" />
          <p className="text-sm text-foreground/85">
            {isFr
              ? 'Vérification de la compatibilité vocale du navigateur...'
              : 'Checking browser vocal compatibility...'}
          </p>
        </div>
      </Card>
    );
  }

  // Render: Test principal
  const progress = (currentIndex / TOTAL_ITEMS) * 100;

  return (
    <Card className="mx-auto max-w-3xl p-8">
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-2">
            <Mic className="h-5 w-5 text-primary" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">
              {isFr
                ? 'Test de Dénomination Rapide (RAN)'
                : 'Rapid Automatized Naming (RAN) Test'}
            </h2>
            <p className="text-sm text-foreground/85">
              {isFr
                ? 'Nommez à voix haute les couleurs affichées, le plus vite possible, tout en restant naturel.'
                : 'Name the displayed colors out loud, as fast as possible while remaining natural.'}
            </p>
          </div>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            {isFr
              ? "Votre voix n'est pas enregistrée. Seuls les timings entre les mots, les hésitations et les pauses sont analysés."
              : 'Your voice is not recorded. Only timing between words, hesitations, and pauses are analyzed.'}
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-foreground/85">
            <span>
              {isFr ? 'Éléments' : 'Items'} {currentIndex} / {TOTAL_ITEMS}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} />
        </div>

        <div className="rounded-lg bg-muted p-4">
          <div className="flex flex-wrap justify-center gap-3">
            {sequence.map((colorIdx, itemIdx) => (
              <span
                key={`${itemIdx}-${colorIdx}`}
                className="transition-all text-3xl sm:text-4xl"
                style={{
                  opacity: itemIdx < currentIndex ? 0.4 : 1,
                  transform:
                    itemIdx === currentIndex ? 'scale(1.2)' : 'scale(1.0)',
                }}
              >
                {COLORS_EMOJI[colorIdx]}
              </span>
            ))}
          </div>
        </div>

        {!isRecording ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">
                {isFr ? 'Instructions' : 'Instructions'}
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-foreground/85">
                <li>
                  {isFr
                    ? 'Nommez chaque couleur à voix haute en français (rouge, vert, bleu...).'
                    : 'Name each color out loud in French (rouge, vert, bleu...).'}
                </li>
                <li>
                  {isFr
                    ? "Allez le plus vite possible tout en restant naturel. Les hésitations sont normales."
                    : 'Go as fast as possible while staying natural. Hesitations are normal.'}
                </li>
                <li>
                  {isFr
                    ? 'Durée approximative : 20 à 30 secondes.'
                    : 'Approximate duration: 20 to 30 seconds.'}
                </li>
              </ul>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button onClick={startTest} className="flex-1" size="lg">
                <Mic className="mr-2 h-4 w-4" />
                {isFr ? 'Démarrer le test vocal' : 'Start vocal test'}
              </Button>
              {onSkip && (
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={onSkip}
                >
                  {isFr
                    ? 'Passer le test vocal'
                    : 'Skip vocal test'}
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-foreground/85">
              <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
              <span>
                {isFr
                  ? 'Enregistrement en cours... Parlez normalement.'
                  : 'Recording in progress... Speak normally.'}
              </span>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={stopTest}
            >
              {isFr ? 'Terminer le test' : 'End test'}
            </Button>
          </div>
        )}

        <div className="rounded-lg bg-muted/60 p-4 text-xs text-foreground/80">
          <p className="font-medium">
            {isFr ? '🔒 Confidentialité' : '🔒 Privacy'}
          </p>
          <p className="mt-2">
            {isFr
              ? "L'audio brût n'est jamais enregistré ni envoyé. Seuls les timings extraits (par exemple 250ms, 320ms, 410ms) et quelques marqueurs d'hésitation sont utilisés pour détecter les bots."
              : 'Raw audio is never stored or sent. Only extracted timings (e.g. 250ms, 320ms, 410ms) and a few hesitation markers are used to detect bots.'}
          </p>
        </div>
      </div>
    </Card>
  );
}
