'use client';

import { useRouter } from 'next/navigation';
import { NBackTest } from '@/components/tests/NBackTest';

export default function NBackTestPage() {
  const router = useRouter();

  const handleComplete = (result: any) => {
    // Sauvegarder le résultat dans sessionStorage
    sessionStorage.setItem('nbackResult', JSON.stringify(result));
    // Retourner à la suite de tests
    router.push('/cognitive-tests');
  };

  return (
    <div className="min-h-screen bg-background">
      <NBackTest onComplete={handleComplete} />
    </div>
  );
}
