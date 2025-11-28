'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Clock, CheckCircle2, Play, Info } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

interface IntroScreenProps {
  onStart: () => void;
}

export function IntroScreen({ onStart }: IntroScreenProps) {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 rounded-full bg-primary/10 p-3 w-fit">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <div className="mb-2">
            <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/25 text-blue-900 dark:text-blue-100 text-sm font-medium border border-blue-200 dark:border-blue-800/50">
              {isFr ? 'Démo Interactive' : 'Interactive Demo'}
            </span>
          </div>
          <CardTitle className="text-3xl font-bold">
            {isFr ? 'Démo d\'Authentification Cognitive' : 'Cognitive Authentication Demo'}
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            {isFr 
              ? 'Expérimentez l\'authentification sans mot de passe en utilisant votre signature cognitive unique. Complétez en ~4 minutes.'
              : 'Experience passwordless authentication using your unique cognitive signature. Complete in ~4 minutes.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{isFr ? 'Comment ça marche' : 'How It Works'}</h3>
            
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  1
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">
                  {isFr ? 'Enrollment (~2 minutes)' : 'Enrollment (~2 minutes)'}
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {isFr ? 'Passez deux tests cognitifs rapides :' : 'Take two quick cognitive tests:'}
                </p>
                <ul className="space-y-1 text-sm text-foreground/85 ml-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>
                      {isFr 
                        ? 'Test Stroop (20 essais) : Mesure le contrôle inhibiteur'
                        : 'Stroop Test (20 trials): Measures inhibitory control'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>
                      {isFr
                        ? 'Temps de Réaction (20 essais) : Mesure la vitesse de traitement & variabilité'
                        : 'Reaction Time (20 trials): Measures processing speed & variability'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  2
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">
                  {isFr ? 'Génération de Signature' : 'Signature Generation'}
                </h4>
                <p className="text-sm text-foreground/85">
                  {isFr 
                    ? 'Le système crée votre signature cognitive unique basée sur :'
                    : 'System creates your unique cognitive signature based on:'}
                </p>
                <ul className="space-y-1 text-sm text-foreground/85 ml-4">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>
                      {isFr
                        ? 'Variabilité du temps de réaction (unicité biologique)'
                        : 'Reaction time variability (biological uniqueness)'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>
                      {isFr
                        ? 'Patterns d\'interférence Stroop'
                        : 'Stroop interference patterns'}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>
                      {isFr
                        ? 'Distribution des erreurs & consistance temporelle'
                        : 'Error distribution & timing consistency'}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  3
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">
                  {isFr ? 'Vérification (~2 minutes)' : 'Verification (~2 minutes)'}
                </h4>
                <p className="text-sm text-foreground/85">
                  {isFr
                    ? 'Répétez les mêmes tests. Le système compare votre performance en temps réel avec la signature enrollée. 85%+ de similarité = authentifié.'
                    : 'Repeat the same tests. System compares your live performance with the enrolled signature. 85%+ similarity = authenticated.'}
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  4
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">
                  {isFr ? 'Résultat' : 'Result'}
                </h4>
                <p className="text-sm text-foreground/85">
                  {isFr
                    ? 'Voir la comparaison détaillée des signatures enrollées vs. vérification avec score de similarité et analyse dimension par dimension.'
                    : 'See detailed comparison of enrolled vs. verification signatures with similarity score and dimension-by-dimension analysis.'}
                </p>
              </div>
            </div>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              {isFr
                ? 'Notice de confidentialité : Cette démo fonctionne entièrement dans votre navigateur. Aucune donnée n\'est envoyée aux serveurs ou stockée. Votre signature cognitive est conservée uniquement dans le stockage de session de votre navigateur.'
                : 'Privacy Notice: This demo runs entirely in your browser. No data is sent to servers or stored. Your cognitive signature is kept only in your browser\'s session storage.'}
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="space-y-1">
              <Clock className="h-6 w-6 mx-auto text-foreground/85" />
              <div className="text-2xl font-bold">~4 min</div>
              <div className="text-xs text-foreground/85">
                {isFr ? 'Durée totale' : 'Total time'}
              </div>
            </div>
            <div className="space-y-1">
              <Shield className="h-6 w-6 mx-auto text-foreground/85" />
              <div className="text-2xl font-bold">100%</div>
              <div className="text-xs text-foreground/85">
                {isFr ? 'Local' : 'Local'}
              </div>
            </div>
            <div className="space-y-1">
              <CheckCircle2 className="h-6 w-6 mx-auto text-foreground/85" />
              <div className="text-2xl font-bold">{isFr ? 'Temps réel' : 'Real-time'}</div>
              <div className="text-xs text-foreground/85">
                {isFr ? 'Résultats instantanés' : 'Instant results'}
              </div>
            </div>
          </div>

          <Button onClick={onStart} size="lg" className="w-full gap-2">
            <Play className="h-5 w-5" />
            {isFr ? 'Démarrer la Démo (4 minutes)' : 'Start Demo (4 minutes)'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
