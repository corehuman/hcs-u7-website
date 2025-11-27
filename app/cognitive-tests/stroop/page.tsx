'use client';

import { useRouter } from 'next/navigation';
import { StroopTest } from '@/components/tests/StroopTest';

export default function StroopTestPage() {
  const router = useRouter();

  const handleComplete = (result: any) => {
    // Sauvegarder le résultat dans sessionStorage
    sessionStorage.setItem('stroopResult', JSON.stringify(result));
    // Retourner à la suite de tests
    router.push('/cognitive-tests');
  };

  return (
    <div className="min-h-screen bg-background">
      <StroopTest onComplete={handleComplete} />
    </div>
  );
}
