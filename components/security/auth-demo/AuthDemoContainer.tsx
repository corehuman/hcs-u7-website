'use client';

import { useState } from 'react';
import { IntroScreen } from './IntroScreen';
import { EnrollmentFlow } from './EnrollmentFlow';
import { SignatureDisplay } from './SignatureDisplay';
import { VerificationFlow } from './VerificationFlow';
import { AuthenticationResult } from './AuthenticationResult';

type Phase = 'intro' | 'enrollment' | 'signature' | 'verification' | 'result';

export interface CognitiveSignature {
  // Stroop metrics
  stroopEffect: number;           // Interference effect (ms)
  stroopAccuracy: number;         // 0-100%
  stroopAvgCongruent: number;     // Avg RT congruent trials
  stroopAvgIncongruent: number;   // Avg RT incongruent trials
  
  // Reaction Time metrics
  avgRT: number;                  // Mean reaction time
  rtSD: number;                   // Standard deviation (variability)
  rtMin: number;                  // Fastest response
  rtMax: number;                  // Slowest response
  
  // Meta
  timestamp: number;
  sessionId: string;
}

export function AuthDemoContainer() {
  const [phase, setPhase] = useState<Phase>('intro');
  const [enrolledSignature, setEnrolledSignature] = useState<CognitiveSignature | null>(null);
  const [verifySignature, setVerifySignature] = useState<CognitiveSignature | null>(null);

  const handleEnrollmentComplete = (signature: CognitiveSignature) => {
    setEnrolledSignature(signature);
    setPhase('signature');
  };

  const handleProceedToVerification = () => {
    setPhase('verification');
  };

  const handleVerificationComplete = (signature: CognitiveSignature) => {
    setVerifySignature(signature);
    setPhase('result');
  };

  const handleReset = () => {
    setEnrolledSignature(null);
    setVerifySignature(null);
    setPhase('intro');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {phase === 'intro' && (
          <IntroScreen onStart={() => setPhase('enrollment')} />
        )}
        
        {phase === 'enrollment' && (
          <EnrollmentFlow onComplete={handleEnrollmentComplete} />
        )}
        
        {phase === 'signature' && enrolledSignature && (
          <SignatureDisplay 
            signature={enrolledSignature} 
            onProceed={handleProceedToVerification} 
          />
        )}
        
        {phase === 'verification' && enrolledSignature && (
          <VerificationFlow 
            enrolledSignature={enrolledSignature}
            onComplete={handleVerificationComplete} 
          />
        )}
        
        {phase === 'result' && enrolledSignature && verifySignature && (
          <AuthenticationResult 
            enrolled={enrolledSignature}
            verify={verifySignature}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
