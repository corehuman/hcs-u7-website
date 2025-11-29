import { Metadata } from 'next';
import { AuthDemoContainer } from '@/components/security/auth-demo/AuthDemoContainer';
import { SecuritySubnav } from '@/components/security/SecuritySubnav';

export const metadata: Metadata = {
  title: 'Cognitive Authentication Demo | HCS-U7',
  description: 'Experience passwordless authentication using cognitive biometrics. Test enrollment and verification in 4 minutes.',
  keywords: 'cognitive authentication, passwordless, biometric, security demo, HCS-U7',
  openGraph: {
    title: 'Cognitive Authentication Demo | HCS-U7',
    description: 'Experience passwordless authentication using cognitive biometrics',
    type: 'website',
  },
};

export default function AuthDemoPage() {
  return (
    <main className="flex flex-col">
      <SecuritySubnav />
      <AuthDemoContainer />
    </main>
  );
}
