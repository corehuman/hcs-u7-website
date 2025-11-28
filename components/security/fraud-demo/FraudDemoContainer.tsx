'use client';

import { useState } from 'react';
import { FraudIntro } from './FraudIntro';
import { BaselineEstablishment } from './BaselineEstablishment';
import { MonitoringDashboard } from './MonitoringDashboard';
import { FraudAlert } from './FraudAlert';

type Phase = 'intro' | 'baseline' | 'monitoring' | 'alert';

interface BaselineProfile {
  avgRT: number;
  rtSD: number;
  stroopEffect: number;
  accuracy: number;
  timestamp: number;
}

interface MonitoringData {
  time: number;
  avgRT: number;
  rtSD: number;
  stroopEffect: number;
  deviation: number;
  anomaly: boolean;
}

export function FraudDemoContainer() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [baseline, setBaseline] = useState<BaselineProfile | null>(null);
  const [monitoringHistory, setMonitoringHistory] = useState<MonitoringData[]>([]);
  const [fraudDetected, setFraudDetected] = useState(false);

  const handleBaselineComplete = (profile: BaselineProfile) => {
    setBaseline(profile);
    setPhase('monitoring');
  };

  const handleFraudDetected = (data: MonitoringData[]) => {
    setMonitoringHistory(data);
    setFraudDetected(true);
    setPhase('alert');
  };

  const handleReset = () => {
    setBaseline(null);
    setMonitoringHistory([]);
    setFraudDetected(false);
    setPhase('intro');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container max-w-5xl mx-auto py-16 px-4">
        {phase === 'intro' && (
          <FraudIntro onStart={() => setPhase('baseline')} />
        )}

        {phase === 'baseline' && (
          <BaselineEstablishment onComplete={handleBaselineComplete} />
        )}

        {phase === 'monitoring' && baseline && (
          <MonitoringDashboard 
            baseline={baseline} 
            onFraudDetected={handleFraudDetected} 
          />
        )}

        {phase === 'alert' && baseline && (
          <FraudAlert 
            baseline={baseline} 
            monitoringHistory={monitoringHistory}
            onReset={handleReset} 
          />
        )}
      </div>
    </div>
  );
}
