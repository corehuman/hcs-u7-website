'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/components/LanguageProvider';

const items = [
  { href: '/security', key: 'overview' },
  { href: '/security/hcs-code', key: 'code' },
  { href: '/security/auth-demo', key: 'demo' },
  { href: '/secure-login-demo', key: 'secureLogin' },
  { href: '/security/faq', key: 'faq' },
];

export function SecuritySubnav() {
  const pathname = usePathname();
  const { lang } = useLanguage();
  const isFr = lang === 'fr';

  const labels: Record<string, string> = isFr
    ? {
        overview: "Vue d'ensemble",
        code: 'Code HCS-U7 & Sécurité',
        demo: "Démo d'authentification",
        secureLogin: 'Login bancaire protégé',
        faq: 'FAQ',
      }
    : {
        overview: 'Overview',
        code: 'HCS-U7 Code & Security',
        demo: 'Auth Demo',
        secureLogin: 'Bank login demo',
        faq: 'FAQ',
      };

  return (
    <nav className="border-b border-border/60 bg-background/90 backdrop-blur-sm">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap gap-2 py-3 text-xs sm:text-sm">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  'inline-flex items-center rounded-full border px-3 py-1 transition-colors ' +
                  (active
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted/60 text-foreground/80 hover:bg-muted border-border/70')
                }
              >
                {labels[item.key]}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
