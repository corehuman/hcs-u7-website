import { Metadata } from 'next';
import { CaptchaDemoContainer } from '@/components/security/captcha-demo/CaptchaDemoContainer';

export const metadata: Metadata = {
  title: 'AI-Resistant CAPTCHA Demo | HCS-U7',
  description: 'Experience next-generation bot detection using cognitive patterns. GPT-4V and automation resistant.',
};

export default function CaptchaDemoPage() {
  return <CaptchaDemoContainer />;
}
