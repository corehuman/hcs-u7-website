import { Metadata } from 'next';
import { FraudDemoContainer } from '@/components/security/fraud-demo/FraudDemoContainer';

export const metadata: Metadata = {
  title: 'Détection de Fraude en Temps Réel | HCS-U7',
  description: 'Surveillez les sessions utilisateur et détectez les prises de contrôle de compte grâce à l\'analyse cognitive.',
};

export default function FraudDemoPage() {
  return <FraudDemoContainer />;
}
