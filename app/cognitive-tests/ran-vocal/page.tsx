'use client';

import { useRouter } from 'next/navigation';
import RANTest from '@/components/tests/RANTest';
import type { VocalMetrics } from '@/lib/vocal-metrics';

export default function RANVocalTestPage() {
  const router = useRouter();

  const handleComplete = (result: VocalMetrics) => {
    // Sauvegarder le résultat vocal dans sessionStorage
    sessionStorage.setItem('ranVocalResult', JSON.stringify(result));
    // Retourner au hub des tests cognitifs
    router.push('/cognitive-tests');
  };

  const handleSkip = () => {
    // En cas de navigateur non compatible ou permission refusée,
    // revenir simplement au hub sans enregistrer de résultat.
    router.push('/cognitive-tests');
  };

  return (
    <div className="min-h-screen bg-background">
      <RANTest onComplete={handleComplete} onSkip={handleSkip} />
    </div>
  );
}
