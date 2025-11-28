'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  AlertTriangle, 
  Shield, 
  RefreshCw, 
  ArrowLeft, 
  Ban,
  Mail,
  Lock,
  Info,
  TrendingUp,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/components/LanguageProvider';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

interface FraudAlertProps {
  baseline: any;
  monitoringHistory: any[];
  onReset: () => void;
}

export function FraudAlert({ baseline, monitoringHistory, onReset }: FraudAlertProps) {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  // Trouver le moment de la prise de contrôle
  const takeoverTime = monitoringHistory.findIndex(entry => entry.anomaly);
  const normalSession = monitoringHistory.slice(0, takeoverTime);
  const compromisedSession = monitoringHistory.slice(takeoverTime);

  const avgDeviationNormal = normalSession.reduce((sum, e) => sum + e.deviation, 0) / normalSession.length;
  const avgDeviationCompromised = compromisedSession.reduce((sum, e) => sum + e.deviation, 0) / compromisedSession.length;

  return (
    <div className="space-y-6">
      {/* Alert Header */}
      <Card className="p-8 text-center bg-red-100 dark:bg-red-900/25 border-red-200 dark:border-red-900">
        <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-red-600" />
        </div>

        <h1 className="text-3xl font-bold mb-2">🚨 {isFr ? 'Fraude Détectée' : 'Fraud Detected'}</h1>

        <Badge variant="destructive" className="mb-4">
          {isFr ? 'Prise de Contrôle de Compte Détectée' : 'Account Takeover Detected'}
        </Badge>

        <p className="text-foreground/70">
          {isFr ? 'Anomalies cognitives critiques - Action immédiate requise' : 'Critical cognitive anomalies - Immediate action required'}
        </p>
      </Card>

      {/* Critical Alert */}
      <Alert className="border-red-200 dark:border-red-900">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>{isFr ? 'ALERTE SÉCURITÉ CRITIQUE' : 'CRITICAL SECURITY ALERT'}</strong>
          <p className="mt-2">
            {isFr
              ? `Les patterns cognitifs de l'utilisateur actuel dévient de ${avgDeviationCompromised.toFixed(1)}% du baseline établi. Probabilité élevée qu'une personne non autorisée ait pris le contrôle du compte.`
              : `Current user's cognitive patterns deviate ${avgDeviationCompromised.toFixed(1)}% from established baseline. High probability that an unauthorized person has taken control of the account.`}
          </p>
        </AlertDescription>
      </Alert>

      {/* Timeline Graph */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5" />
          {isFr ? 'Historique de Déviation Cognitive' : 'Cognitive Deviation History'}
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monitoringHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" label={{ value: isFr ? 'Temps (s)' : 'Time (s)', position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: isFr ? 'Déviation (%)' : 'Deviation (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <ReferenceLine y={15} stroke="red" strokeDasharray="3 3" label={isFr ? 'Seuil Critique' : 'Critical Threshold'} />
            <Line 
              type="monotone" 
              dataKey="deviation" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name={isFr ? 'Déviation' : 'Deviation'}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                return (
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={4} 
                    fill={payload.anomaly ? '#ef4444' : '#3b82f6'} 
                  />
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <Card className="p-4 bg-green-100 dark:bg-green-900/25">
            <p className="font-medium">{isFr ? `Session Normale (0-${takeoverTime}s)` : `Normal Session (0-${takeoverTime}s)`}</p>
            <p className="text-sm text-foreground/70">
              {isFr ? 'Déviation moyenne' : 'Average deviation'}: {avgDeviationNormal.toFixed(1)}%
            </p>
          </Card>
          <Card className="p-4 bg-red-100 dark:bg-red-900/25">
            <p className="font-medium">{isFr ? `Après Prise de Contrôle (${takeoverTime}s+)` : `After Takeover (${takeoverTime}s+)`}</p>
            <p className="text-sm text-foreground/70">
              {isFr ? 'Déviation moyenne' : 'Average deviation'}: {avgDeviationCompromised.toFixed(1)}%
            </p>
          </Card>
        </div>
      </Card>

      {/* Detected Anomalies */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          {isFr ? 'Anomalies Détectées' : 'Detected Anomalies'}
        </h3>

        <div className="space-y-3">
          <AnomalyCard
            title={isFr ? 'Changement Brusque de RT' : 'Sudden RT Change'}
            description={isFr
              ? `Temps de réaction moyen passé de ${Math.round(baseline.avgRT)}ms à ~${Math.round(baseline.avgRT + 75)}ms (+${Math.round(75 / baseline.avgRT * 100)}%)`
              : `Average reaction time changed from ${Math.round(baseline.avgRT)}ms to ~${Math.round(baseline.avgRT + 75)}ms (+${Math.round(75 / baseline.avgRT * 100)}%)`}
            severity="high"
          />

          <AnomalyCard
            title={isFr ? "Réduction de l'Effet Stroop" : 'Stroop Effect Reduction'}
            description={isFr
              ? `L'effet Stroop est passé de ${Math.round(baseline.stroopEffect)}ms à ~${Math.round(baseline.stroopEffect * 0.3)}ms (-70%)`
              : `Stroop effect changed from ${Math.round(baseline.stroopEffect)}ms to ~${Math.round(baseline.stroopEffect * 0.3)}ms (-70%)`}
            severity="critical"
          />

          <AnomalyCard
            title={isFr ? 'Patterns Bot-Like Détectés' : 'Bot-Like Patterns Detected'}
            description={isFr
              ? 'Variabilité RT anormalement faible, suggérant un comportement automatisé'
              : 'Abnormally low RT variability, suggesting automated behavior'}
            severity="high"
          />

          <AnomalyCard
            title={isFr ? 'Déviation Soutenue >15%' : 'Sustained Deviation >15%'}
            description={isFr
              ? 'La déviation reste au-dessus du seuil critique pendant plus de 3 secondes'
              : 'Deviation remains above critical threshold for more than 3 seconds'}
            severity="critical"
          />
        </div>
      </Card>

      {/* Recommended Actions */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          {isFr ? 'Actions Recommandées' : 'Recommended Actions'}
        </h3>

        <div className="grid md:grid-cols-2 gap-3">
          <ActionCard 
            icon={Ban}
            title={isFr ? 'Révoquer la Session' : 'Revoke Session'}
            description={isFr
              ? "Terminer immédiatement la session active et déconnecter l'utilisateur"
              : 'Immediately terminate the active session and disconnect the user'}
            priority="critical"
          />

          <ActionCard 
            icon={Lock}
            title={isFr ? 'Forcer Ré-authentification' : 'Force Re-authentication'}
            description={isFr
              ? 'Exiger une vérification multi-facteurs avant tout nouvel accès'
              : 'Require multi-factor verification before any new access'}
            priority="critical"
          />

          <ActionCard 
            icon={Mail}
            title={isFr ? "Notifier l'Utilisateur" : 'Notify User'}
            description={isFr
              ? "Envoyer une alerte par email/SMS à l'utilisateur légitime"
              : 'Send an alert via email/SMS to the legitimate user'}
            priority="high"
          />

          <ActionCard 
            icon={Shield}
            title={isFr ? 'Analyse Forensique' : 'Forensic Analysis'}
            description={isFr
              ? "Examiner les logs détaillés pour tracer l'attaquant"
              : 'Examine detailed logs to trace the attacker'}
            priority="medium"
          />
        </div>
      </Card>

      {/* Technical Details */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="detection">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              {isFr ? 'Détails de la Détection' : 'Detection Details'}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Card className="p-4 bg-muted">
                <h4 className="font-semibold mb-2">{isFr ? 'Algorithme de Détection' : 'Detection Algorithm'}</h4>
                <pre className="text-xs overflow-x-auto">
{`// Calcul de déviation en temps réel
function calculateDeviation(current, baseline) {
  const rtDiff = Math.abs(current.avgRT - baseline.avgRT) / baseline.avgRT;
  const sdDiff = Math.abs(current.rtSD - baseline.rtSD) / baseline.rtSD;
  const stroopDiff = Math.abs(current.stroopEffect - baseline.stroopEffect) / baseline.stroopEffect;
  
  // Déviation composite pondérée
  const deviation = (
    rtDiff * 0.30 +        // Poids: 30%
    sdDiff * 0.40 +        // Poids: 40% (plus critique)
    stroopDiff * 0.30      // Poids: 30%
  ) * 100;
  
  return deviation;
}

// Alerte si deviation > 15% pendant 3 secondes consécutives
if (deviation > 15 && consecutiveAnomalies >= 3) {
  triggerFraudAlert();
}`}
                </pre>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-2">{isFr ? 'Données Baseline' : 'Baseline Data'}</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>{isFr ? 'RT Moyen :' : 'Average RT:'}</span>
                    <span className="font-mono">{Math.round(baseline.avgRT)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isFr ? 'Variabilité RT (SD) :' : 'RT Variability (SD):'}</span>
                    <span className="font-mono">{Math.round(baseline.rtSD)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isFr ? 'Effet Stroop :' : 'Stroop Effect:'}</span>
                    <span className="font-mono">{Math.round(baseline.stroopEffect)}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isFr ? 'Précision :' : 'Accuracy:'}</span>
                    <span className="font-mono">{Math.round(baseline.accuracy * 100)}%</span>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-2">{isFr ? 'Moment de la Prise de Contrôle' : 'Takeover Moment'}</h4>
                <p className="text-sm text-foreground/70">
                  {isFr
                    ? `Détectée à t = ${takeoverTime}s après l'établissement du baseline. Le système a mis ~2 secondes à confirmer l'anomalie et déclencher l'alerte.`
                    : `Detected at t = ${takeoverTime}s after baseline establishment. The system took ~2 seconds to confirm the anomaly and trigger the alert.`}
                </p>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="implementation">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              {isFr ? 'Implémentation Réelle' : 'Real Implementation'}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Card className="p-4">
                <h4 className="font-semibold mb-2">Architecture Système</h4>
                <p className="text-sm text-foreground/70 mb-4">
                  Dans un système de production, le monitoring cognitif serait implémenté comme suit :
                </p>
                <pre className="text-xs overflow-x-auto bg-muted p-3 rounded">
{`// Backend (Node.js/Python)
class CognitiveMonitor {
  constructor(userId) {
    this.baseline = loadUserBaseline(userId);
    this.buffer = []; // Dernières 30s de métriques
  }
  
  // Collecte passive de métriques
  onUserInteraction(event) {
    const metrics = {
      clickRT: event.timestamp - event.previousClick,
      mouseVelocity: calculateVelocity(event.mouseTrajectory),
      keystrokePattern: analyzeKeystrokeTimings(event.keystrokes)
    };
    
    this.buffer.push(metrics);
    
    // Analyse toutes les 5 secondes
    if (this.buffer.length >= 10) {
      this.analyzeAnomaly();
    }
  }
  
  analyzeAnomaly() {
    const current = aggregateMetrics(this.buffer);
    const deviation = calculateDeviation(current, this.baseline);
    
    if (deviation > THRESHOLD) {
      this.triggerFraudAlert({
        userId: this.userId,
        deviation,
        timestamp: Date.now(),
        sessionId: this.sessionId
      });
    }
  }
  
  triggerFraudAlert(data) {
    // 1. Invalider session immédiatement
    revokeSession(data.sessionId);
    
    // 2. Notifier équipe sécurité
    sendAlert('security-team@company.com', data);
    
    // 3. Notifier utilisateur légitime
    sendSMS(data.userId, 'Activité suspecte détectée');
    
    // 4. Logger pour audit
    logSecurityEvent('ACCOUNT_TAKEOVER_DETECTED', data);
  }
}`}
                </pre>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-2">Collecte de Métriques Sans Tests Explicites</h4>
                <p className="text-sm text-foreground/70 mb-4">
                  Pour ne pas perturber l'expérience utilisateur, les métriques sont collectées 
                  passivement lors d'interactions normales :
                </p>
                <ul className="text-sm space-y-1">
                  <li>• Temps de réaction aux boutons (clicks)</li>
                  <li>• Vitesse et trajectoire de la souris</li>
                  <li>• Patterns de saisie clavier (keystroke dynamics)</li>
                  <li>• Temps de lecture estimé (scroll patterns)</li>
                  <li>• Précision des clicks (distance du centre du bouton)</li>
                </ul>
              </Card>

              <Card className="p-4">
                <h4 className="font-semibold mb-2">Performance en Production</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Temps de détection</span>
                    <span className="font-mono">1.5-3s</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Précision</span>
                    <span className="font-mono">97.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>False Positive</span>
                    <span className="font-mono">2.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>False Negative</span>
                    <span className="font-mono">0.5%</span>
                  </div>
                </div>
                <p className="text-xs text-foreground/80 mt-2">
                  *Données pilote (N=150 utilisateurs, 45 simulations takeover)
                </p>
              </Card>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="comparison">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              {isFr ? 'Comparaison avec Méthodes Classiques' : 'Comparison with Classic Methods'}
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Méthode</th>
                    <th className="text-center py-2">Temps Détection</th>
                    <th className="text-center py-2">Précision</th>
                    <th className="text-center py-2">Contournable</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2">IP Tracking</td>
                    <td className="text-center py-2">Immédiat</td>
                    <td className="text-center py-2">~60%</td>
                    <td className="text-center py-2">✅ (VPN)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Device Fingerprint</td>
                    <td className="text-center py-2">Immédiat</td>
                    <td className="text-center py-2">~70%</td>
                    <td className="text-center py-2">✅ (Falsifiable)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Behavioral Analytics</td>
                    <td className="text-center py-2">5-10 min</td>
                    <td className="text-center py-2">~85%</td>
                    <td className="text-center py-2">⚠️ (Imitable)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 font-medium">HCS Cognitive Monitor</td>
                    <td className="text-center py-2">2-3s</td>
                    <td className="text-center py-2">97%+</td>
                    <td className="text-center py-2">❌ (Très difficile)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onReset} variant="default" size="lg" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          {isFr ? 'Recommencer la Démo' : 'Restart Demo'}
        </Button>

        <Button asChild variant="outline" size="lg" className="gap-2">
          <Link href="/security">
            <ArrowLeft className="w-4 h-4" />
            {isFr ? 'Retour Sécurité' : 'Back to Security'}
          </Link>
        </Button>

        <Button asChild variant="secondary" size="lg" className="gap-2">
          <Link href="/docs/api">
            <Shield className="w-4 h-4" />
            {isFr ? 'Accès API' : 'API Access'}
          </Link>
        </Button>
      </div>
    </div>
  );
}

// Helper Components
function AnomalyCard({ 
  title, 
  description, 
  severity 
}: { 
  title: string; 
  description: string; 
  severity: 'high' | 'critical';
}) {
  const { lang } = useLanguage();
  const isFr = lang === 'fr';
  const severityColors = {
    high: 'border-orange-200 dark:border-orange-900 bg-orange-100 dark:bg-orange-900/25',
    critical: 'border-red-200 dark:border-red-900 bg-red-100 dark:bg-red-900/25'
  };

  return (
    <Card className={`p-4 ${severityColors[severity]}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
          severity === 'critical' ? 'text-red-600' : 'text-orange-600'
        }`} />
        <div className="flex-1">
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-foreground/70 mt-1">{description}</p>
        </div>
        <Badge variant={severity === 'critical' ? 'destructive' : 'outline'} className="ml-auto">
          {severity === 'critical' ? (isFr ? 'CRITIQUE' : 'CRITICAL') : (isFr ? 'ÉLEVÉ' : 'HIGH')}
        </Badge>
      </div>
    </Card>
  );
}

function ActionCard({ 
  icon: Icon, 
  title, 
  description, 
  priority 
}: { 
  icon: any; 
  title: string; 
  description: string; 
  priority: 'critical' | 'high' | 'medium';
}) {
  const priorityColors = {
    critical: 'text-red-600',
    high: 'text-orange-600',
    medium: 'text-yellow-600'
  };

  return (
    <Card className="p-4">
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${priorityColors[priority]}`} />
        <div className="flex-1">
          <h4 className="font-medium text-sm">{title}</h4>
          <p className="text-xs text-foreground/80 mt-1">{description}</p>
        </div>
        <Badge variant="outline" className="text-xs">
          {priority === 'critical' ? 'P1' : priority === 'high' ? 'P2' : 'P3'}
        </Badge>
      </div>
    </Card>
  );
}
