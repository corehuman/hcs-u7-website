import { Metadata } from 'next';
import { SecurityHero } from '@/components/security/SecurityHero';
import { ProblemSolution } from '@/components/security/ProblemSolution';
import { UseCasesGrid } from '@/components/security/UseCasesGrid';
import { TechnicalSection } from '@/components/security/TechnicalSection';
import { SecurityAdvantages } from '@/components/security/SecurityAdvantages';
import { SecurityFeatures } from '@/components/security/SecurityFeatures';
import { SecurityFAQ } from '@/components/security/SecurityFAQ';
import { SecurityCTA } from '@/components/security/SecurityCTA';

export const metadata: Metadata = {
  title: 'Cognitive Security Solutions | HCS-U7',
  description: 'Next-generation authentication and fraud detection using cognitive biometrics. Replace passwords with cognitive signatures. AI-resistant, privacy-first.',
  keywords: 'cognitive authentication, biometric security, passwordless, fraud detection, bot prevention, HCS-U7',
  openGraph: {
    title: 'Cognitive Security Solutions | HCS-U7',
    description: 'Next-generation authentication using cognitive biometrics',
    type: 'website',
    images: [
      {
        url: '/og-security.png',
        width: 1200,
        height: 630,
        alt: 'HCS-U7 Cognitive Security'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cognitive Security Solutions | HCS-U7',
    description: 'Replace passwords with cognitive biometrics',
    images: ['/og-security.png']
  }
};

export default function SecurityPage() {
  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <SecurityHero />
      
      {/* Problem/Solution */}
      <ProblemSolution />
      
      {/* Use Cases Grid */}
      <UseCasesGrid />
      
      {/* Technical Explanation */}
      <TechnicalSection />
      
      {/* Advantages vs Competitors */}
      <SecurityAdvantages />
      
      {/* Features Highlights */}
      <SecurityFeatures />
      
      {/* FAQ */}
      <SecurityFAQ />
      
      {/* Final CTA */}
      <SecurityCTA />
    </main>
  );
}
