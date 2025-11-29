import { Metadata } from 'next';
import { VerifyContainer } from '@/components/security/verify/VerifyContainer';

export const metadata: Metadata = {
  title: 'Profile Verification Tool | HCS-U7',
  description: 'Compare two HCS-U7 cognitive profiles to verify identity, detect duplicates, or measure similarity.',
};

export default function VerifyPage() {
  return <VerifyContainer />;
}
