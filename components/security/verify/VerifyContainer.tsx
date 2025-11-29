'use client';

import { useState } from 'react';
import { CodeInputs } from './CodeInputs';
import { ComparisonResult } from './ComparisonResult';
import { parseHCS, compareProfiles } from '@/lib/hcs-parser';
import type { HCSProfile, ComparisonResult as ComparisonResultType } from '@/lib/hcs-parser';

type Phase = 'input' | 'result';

export function VerifyContainer() {
  const [phase, setPhase] = useState<Phase>('input');
  const [profile1, setProfile1] = useState<HCSProfile | null>(null);
  const [profile2, setProfile2] = useState<HCSProfile | null>(null);
  const [comparison, setComparison] = useState<ComparisonResultType | null>(null);

  const handleCompare = (code1: string, code2: string) => {
    const p1 = parseHCS(code1);
    const p2 = parseHCS(code2);

    if (!p1 || !p2) {
      alert('Invalid HCS-U7 code format. Please check your codes.');
      return;
    }

    setProfile1(p1);
    setProfile2(p2);

    const result = compareProfiles(p1, p2);
    setComparison(result);
    setPhase('result');
  };

  const handleReset = () => {
    setProfile1(null);
    setProfile2(null);
    setComparison(null);
    setPhase('input');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {phase === 'input' && (
          <CodeInputs onCompare={handleCompare} />
        )}

        {phase === 'result' && profile1 && profile2 && comparison && (
          <ComparisonResult
            profile1={profile1}
            profile2={profile2}
            comparison={comparison}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
