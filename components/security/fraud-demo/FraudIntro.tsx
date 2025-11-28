'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Play, Info, TrendingUp, Clock } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

interface FraudIntroProps {
  onStart: () => void;
}

export function FraudIntro({ onStart }: FraudIntroProps) {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5" />
          <Badge variant="outline" className="text-xs">
            {isFr ? 'Démo Interactive' : 'Interactive Demo'}
          </Badge>
        </div>

        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          {isFr ? 'Détection de Fraude en Temps Réel' : 'Real-Time Fraud Detection'}
        </h1>

        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {isFr
            ? "Surveillez les sessions utilisateur et détectez les prises de contrôle de compte grâce à l'analyse cognitive continue"
            : 'Monitor user sessions and detect account takeovers through continuous cognitive analysis'}
        </p>
      </div>

      {/* Le Problème */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <div>
              <h3 className="font-semibold text-lg">{isFr ? 'Le Problème : Account Takeover' : 'The Problem: Account Takeover'}</h3>
              <p className="text-sm text-muted-foreground">
                {isFr
                  ? "Un attaquant obtient les identifiants d'un utilisateur légitime (phishing, data breach, malware) et accède à son compte."
                  : 'An attacker obtains legitimate user credentials (phishing, data breach, malware) and accesses their account.'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <div>
            <h4 className="font-medium mb-3">{isFr ? 'Méthodes classiques (insuffisantes) :' : 'Classic methods (insufficient):'}</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span className="text-red-500">✕</span>
                <span>{isFr ? 'IP tracking : Contournable (VPN, proxy)' : 'IP tracking: Bypassable (VPN, proxy)'}</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">✕</span>
                <span>{isFr ? 'Device fingerprinting : Falsifiable' : 'Device fingerprinting: Falsifiable'}</span>
              </li>
              <li className="flex gap-2">
                <span className="text-red-500">✕</span>
                <span>{isFr ? 'Comportement navigation : Imitable' : 'Navigation behavior: Imitable'}</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">{isFr ? 'Statistiques alarmantes :' : 'Alarming statistics:'}</h4>
            <div className="grid grid-cols-2 gap-3">
              <Card className="p-3 text-center">
                <p className="text-2xl font-bold text-red-600">$11B</p>
                <p className="text-xs text-muted-foreground">{isFr ? 'Pertes annuelles (account takeover, 2023)' : 'Annual losses (account takeover, 2023)'}</p>
              </Card>
              <Card className="p-3 text-center">
                <p className="text-2xl font-bold text-red-600">24%</p>
                <p className="text-xs text-muted-foreground">{isFr ? 'Augmentation en 2023 vs 2022' : 'Increase in 2023 vs 2022'}</p>
              </Card>
            </div>
          </div>
        </div>
      </Card>

      {/* La Solution */}
      <Card className="p-6 border-green-200 dark:border-green-900 bg-green-50 dark:bg-green-950/30">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-green-500" />
            <div>
              <h3 className="font-semibold text-lg">{isFr ? 'Solution HCS : Monitoring Cognitif' : 'HCS Solution: Cognitive Monitoring'}</h3>
              <p className="text-sm text-muted-foreground">
                {isFr
                  ? 'Détection en temps réel basée sur les patterns cognitifs impossibles à imiter'
                  : 'Real-time detection based on cognitive patterns impossible to imitate'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mt-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold text-sm">
              1
            </div>
            <div>
              <p className="font-medium">{isFr ? 'Baseline établi :' : 'Baseline established:'}</p>
              <p className="text-sm text-muted-foreground">{isFr
                ? "Lors de la première connexion réussie, le système capture le profil cognitif de l'utilisateur (RT, Stroop, etc.)"
                : 'During the first successful login, the system captures the user’s cognitive profile (RT, Stroop, etc.)'}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold text-sm">
              2
            </div>
            <div>
              <p className="font-medium">{isFr ? 'Surveillance continue :' : 'Continuous monitoring:'}</p>
              <p className="text-sm text-muted-foreground">{isFr
                ? 'Pendant la session, micro-tests invisibles (mesures de RT, patterns de clic) sont collectés en arrière-plan'
                : 'During the session, invisible micro-tests (RT measurements, click patterns) are collected in the background'}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold text-sm">
              3
            </div>
            <div>
              <p className="font-medium">{isFr ? 'Alerte anomalie :' : 'Anomaly alert:'}</p>
              <p className="text-sm text-muted-foreground">{isFr
                ? 'Si déviation >15% du baseline (RT change, Stroop effect disparaît), alerte de fraude déclenchée'
                : 'If deviation >15% from baseline (RT changes, Stroop effect disappears), fraud alert triggered'}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Comment ça marche */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">{isFr ? 'Déroulement de la Démo' : 'Demo Flow'}</h3>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              1
            </div>
            <div className="flex-1">
              <p className="font-medium">{isFr ? 'Établissement du Baseline (~1 min)' : 'Baseline Establishment (~1 min)'}</p>
              <p className="text-sm text-muted-foreground">
                {isFr
                  ? 'Tests rapides pour créer votre profil cognitif de référence'
                  : 'Quick tests to create your cognitive reference profile'}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              2
            </div>
            <div className="flex-1">
              <p className="font-medium">{isFr ? 'Session Normale (~30 secondes)' : 'Normal Session (~30 seconds)'}</p>
              <p className="text-sm text-muted-foreground">
                {isFr
                  ? "Simulation d'activité avec monitoring temps réel. Métriques stables."
                  : 'Activity simulation with real-time monitoring. Stable metrics.'}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              3
            </div>
            <div className="flex-1">
              <p className="font-medium">{isFr ? 'Prise de Contrôle Simulée' : 'Simulated Takeover'}</p>
              <p className="text-sm text-muted-foreground">
                {isFr
                  ? 'Une "autre personne" prend le contrôle. Patterns cognitifs changent brusquement.'
                  : 'Another "person" takes control. Cognitive patterns change abruptly.'}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-sm">
              4
            </div>
            <div className="flex-1">
              <p className="font-medium">{isFr ? 'Alerte Fraude Déclenchée' : 'Fraud Alert Triggered'}</p>
              <p className="text-sm text-muted-foreground">
                {isFr
                  ? "Système détecte l'anomalie et déclenche les protocoles de sécurité"
                  : 'System detects the anomaly and triggers security protocols'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">{isFr ? '~2 min' : '~2 min'}</p>
          <p className="text-sm text-muted-foreground">{isFr ? 'Durée totale' : 'Total duration'}</p>
        </Card>

        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">&lt;2s</p>
          <p className="text-sm text-muted-foreground">{isFr ? 'Temps de détection' : 'Detection time'}</p>
        </Card>

        <Card className="p-4 text-center">
          <p className="text-2xl font-bold">97%</p>
          <p className="text-sm text-muted-foreground">{isFr ? 'Précision détection' : 'Detection accuracy'}</p>
        </Card>
      </div>

      <Alert className="border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/30">
        <Info className="h-4 w-4" />
        <AlertDescription>
          <span className="font-medium">{isFr ? 'Note :' : 'Note:'}</span> {isFr
            ? "Cette démo est une simulation. Dans un système réel, les micro-tests seraient invisibles pour l'utilisateur (collecte passive de métriques d'interaction)."
            : 'This demo is a simulation. In a real system, micro-tests would be invisible to the user (passive collection of interaction metrics).'}
        </AlertDescription>
      </Alert>

      {/* CTA */}
      <div className="text-center">
        <Button onClick={onStart} size="lg" className="gap-2">
          <Play className="w-4 h-4" />
          {isFr ? 'Démarrer la Démo (~2 minutes)' : 'Start Demo (~2 minutes)'}
        </Button>
      </div>
    </div>
  );
}
