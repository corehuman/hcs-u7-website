'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Zap
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

interface MonitoringDashboardProps {
  baseline: any;
  onFraudDetected: (data: any[]) => void;
}

export function MonitoringDashboard({ baseline, onFraudDetected }: MonitoringDashboardProps) {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const [phase, setPhase] = useState<'normal' | 'takeover' | 'detecting'>('normal');
  const [sessionTime, setSessionTime] = useState(0);
  const [metrics, setMetrics] = useState({
    avgRT: baseline.avgRT,
    rtSD: baseline.rtSD,
    stroopEffect: baseline.stroopEffect,
    deviation: 0
  });
  const [history, setHistory] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<string[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Simulation de monitoring en temps réel
    const monitoringInterval = setInterval(() => {
      if (phase === 'normal') {
        // Session normale : petites variations autour du baseline
        const newMetrics = {
          avgRT: baseline.avgRT + (Math.random() - 0.5) * 20,
          rtSD: baseline.rtSD + (Math.random() - 0.5) * 5,
          stroopEffect: baseline.stroopEffect + (Math.random() - 0.5) * 10,
          deviation: Math.random() * 8 // < 15% normal
        };

        setMetrics(newMetrics);
        setHistory(prev => [...prev, {
          time: sessionTime,
          ...newMetrics,
          anomaly: false
        }]);

        // Après 10 secondes, simuler takeover
        if (sessionTime >= 10) {
          setPhase('takeover');
        }
      } else if (phase === 'takeover') {
        // Prise de contrôle : changements brusques
        const newMetrics = {
          avgRT: baseline.avgRT + (Math.random() * 100 + 50), // Plus lent
          rtSD: baseline.rtSD * 0.5, // Plus consistant (bot-like)
          stroopEffect: baseline.stroopEffect * 0.3, // Effet réduit
          deviation: 20 + Math.random() * 15 // > 15% anomalie !
        };

        setMetrics(newMetrics);
        
        const anomaly = newMetrics.deviation > 15;
        setHistory(prev => [...prev, {
          time: sessionTime,
          ...newMetrics,
          anomaly
        }]);

        if (anomaly && alerts.length === 0) {
          setAlerts(['RT_DEVIATION_HIGH', 'STROOP_ANOMALY', 'VARIANCE_DROP']);
        }

        // Après 3 secondes d'anomalie, déclencher alerte
        if (sessionTime >= 13) {
          setPhase('detecting');
          setTimeout(() => {
            onFraudDetected(history);
          }, 1500);
        }
      }
    }, 1000);

    return () => clearInterval(monitoringInterval);
  }, [phase, sessionTime, baseline, history, alerts.length, onFraudDetected]);

  const getDeviationColor = (deviation: number) => {
    if (deviation < 10) return 'text-green-600';
    if (deviation < 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getDeviationBg = (deviation: number) => {
    if (deviation < 10) return 'bg-green-50 dark:bg-green-950/30';
    if (deviation < 15) return 'bg-yellow-50 dark:bg-yellow-950/30';
    return 'bg-red-50 dark:bg-red-950/30';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <Badge className={`mb-4 ${
          phase === 'normal' ? 'bg-green-600' : 
          phase === 'takeover' ? 'bg-orange-600' : 
          'bg-red-600'
        }`}>
          {phase === 'normal' && (isFr ? 'Session Normale' : 'Normal Session')}
          {phase === 'takeover' && (isFr ? '⚠️ Prise de Contrôle en Cours' : '⚠️ Takeover in Progress')}
          {phase === 'detecting' && (isFr ? '🚨 Fraude Détectée !' : '🚨 Fraud Detected!')}
        </Badge>
        <h2 className="text-2xl font-bold mb-2">{isFr ? 'Tableau de Bord de Surveillance' : 'Monitoring Dashboard'}</h2>
        <p className="text-sm text-muted-foreground">
          {isFr ? 'Monitoring cognitif en temps réel' : 'Real-time cognitive monitoring'}
        </p>
      </div>

      {/* Session Timer */}
      <Card className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="font-medium">{isFr ? 'Durée de Session' : 'Session Duration'}</span>
          </div>
          <span className="text-2xl font-bold">
            {sessionTime}s
          </span>
        </div>
      </Card>

      {/* Scenario Indicator */}
      <Alert className={`mb-6 ${
        phase === 'normal' 
          ? 'border-green-200 dark:border-green-900' 
          : 'border-orange-200 dark:border-orange-900'
      }`}>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {phase === 'normal' && (
            <>
              ✅ <strong>{isFr ? 'Activité Normale' : 'Normal Activity'}</strong> - {isFr
                ? "L'utilisateur légitime navigue sur le site. Métriques cognitives stables."
                : 'The legitimate user is browsing the site. Cognitive metrics are stable.'}
            </>
          )}
          {phase === 'takeover' && (
            <>
              ⚠️ <strong>{isFr ? 'Simulation : Prise de Contrôle' : 'Simulation: Takeover'}</strong> - {isFr
                ? 'Un attaquant a obtenu les identifiants et accède au compte. Ses patterns cognitifs sont différents.'
                : 'An attacker has obtained the credentials and is accessing the account. Their cognitive patterns are different.'}
            </>
          )}
          {phase === 'detecting' && (
            <>
              🚨 <strong>{isFr ? 'Anomalie Détectée !' : 'Anomaly Detected!'}</strong> - {isFr
                ? 'Déviation significative du baseline. Alerte de fraude déclenchée.'
                : 'Significant deviation from baseline. Fraud alert triggered.'}
            </>
          )}
        </AlertDescription>
      </Alert>

      {/* Real-Time Metrics */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Deviation Score */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="font-medium">{isFr ? 'Score de Déviation' : 'Deviation Score'}</span>
            <Badge variant="outline">{phase}</Badge>
          </div>

          <div className="text-center mb-4">
            <span className={`text-5xl font-bold ${getDeviationColor(metrics.deviation)}`}>
              {metrics.deviation.toFixed(1)}%
            </span>
          </div>

          <Progress value={Math.min(metrics.deviation * 3.33, 100)} className="mb-4" />

          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{isFr ? '0% (Normal)' : '0% (Normal)'}</span>
            <span>{isFr ? '15% (Seuil)' : '15% (Threshold)'}</span>
            <span>30%+</span>
          </div>

          <div className={`mt-4 p-3 rounded-lg ${getDeviationBg(metrics.deviation)}`}>
            {metrics.deviation < 15 ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                <span className="text-sm">{isFr ? 'Patterns normaux' : 'Normal patterns'}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium">{isFr ? 'Anomalie détectée !' : 'Anomaly detected!'}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Live Metrics */}
        <Card className="p-6">
          <h3 className="font-medium mb-4">{isFr ? 'Métriques en Direct' : 'Live Metrics'}</h3>

          <div className="space-y-3">
            <MetricRow 
              label={isFr ? 'RT Moyen' : 'Average RT'}
              baseline={baseline.avgRT}
              current={metrics.avgRT}
              unit="ms"
            />
            <MetricRow 
              label={isFr ? 'Variabilité RT' : 'RT Variability'}
              baseline={baseline.rtSD}
              current={metrics.rtSD}
              unit="ms"
            />
            <MetricRow 
              label={isFr ? 'Effet Stroop' : 'Stroop Effect'}
              baseline={baseline.stroopEffect}
              current={metrics.stroopEffect}
              unit="ms"
            />
          </div>
        </Card>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="p-6 border-red-200 dark:border-red-900">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold">
              {isFr ? `Alertes de Sécurité (${alerts.length})` : `Security Alerts (${alerts.length})`}
            </h3>
          </div>

          <div className="space-y-2">
            {alerts.map((alert, idx) => (
              <Alert key={idx} className="border-red-200 dark:border-red-900">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>{formatAlertName(alert, lang)}</strong>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getAlertDescription(alert, lang)}
                  </p>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </Card>
      )}

      {/* History Timeline */}
      <Card className="p-6">
        <h3 className="font-medium mb-4">{isFr ? 'Historique de Session' : 'Session History'}</h3>
        
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {history.slice(-10).reverse().map((entry, idx) => (
            <div 
              key={idx} 
              className={`flex items-center justify-between p-3 rounded text-sm ${
                entry.anomaly 
                  ? 'bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900' 
                  : 'bg-gray-50 dark:bg-gray-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">{entry.time}s</span>
                {entry.anomaly ? (
                  <Badge variant="destructive" className="text-xs">{isFr ? 'Anomalie' : 'Anomaly'}</Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">{isFr ? 'Normal' : 'Normal'}</Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  RT: {Math.round(entry.avgRT)}ms
                </span>
              </div>
              <span className={`text-sm font-medium ${entry.anomaly ? 'text-red-600' : 'text-green-600'}`}>
                {isFr ? 'Déviation' : 'Deviation'}: {entry.deviation.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Detecting State */}
      {phase === 'detecting' && (
        <Card className="p-8 bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Shield className="w-12 h-12 text-red-600 animate-pulse" />
            </div>
            <h3 className="text-xl font-bold mb-2">{isFr ? 'Analyse de Fraude en Cours...' : 'Fraud Analysis in Progress...'}</h3>
            <p className="text-sm text-muted-foreground">
              {isFr ? 'Vérification des anomalies détectées' : 'Verifying detected anomalies'}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}

// Helper Component
function MetricRow({ 
  label, 
  baseline, 
  current, 
  unit 
}: { 
  label: string; 
  baseline: number; 
  current: number; 
  unit: string;
}) {
  const diff = current - baseline;
  const percentDiff = (Math.abs(diff) / baseline) * 100;
  
  return (
    <div className="flex justify-between items-center p-2 rounded hover:bg-muted/50">
      <span className="text-sm font-medium">{label}</span>
      <div className="text-right">
        <span className="font-bold">
          {Math.round(current)}{unit}
        </span>
        <span className={`text-xs ml-2 ${diff >= 0 ? 'text-red-600' : 'text-green-600'}`}>
          {diff >= 0 ? '+' : ''}{Math.round(diff)}{unit} ({percentDiff.toFixed(1)}%)
        </span>
      </div>
    </div>
  );
}

function formatAlertName(alert: string, lang = 'fr'): string {
  const isFr = lang === 'fr';
  const names: Record<string, string> = {
    'RT_DEVIATION_HIGH': isFr ? 'Déviation RT Élevée' : 'High RT Deviation',
    'STROOP_ANOMALY': isFr ? 'Anomalie Effet Stroop' : 'Stroop Effect Anomaly',
    'VARIANCE_DROP': isFr ? 'Chute de Variabilité' : 'Variability Drop'
  };
  return names[alert] || alert;
}

function getAlertDescription(alert: string, lang = 'fr'): string {
  const isFr = lang === 'fr';
  const descriptions: Record<string, string> = {
    'RT_DEVIATION_HIGH': isFr ? 'Temps de réaction significativement différent du baseline' : 'Reaction time significantly different from baseline',
    'STROOP_ANOMALY': isFr ? 'Effet Stroop réduit ou absent (pattern non-humain)' : 'Stroop effect reduced or absent (non-human pattern)',
    'VARIANCE_DROP': isFr ? 'Variabilité RT trop faible (comportement bot-like)' : 'RT variability too low (bot-like behavior)'
  };
  return descriptions[alert] || alert;
}
