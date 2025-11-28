"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { href: "/", key: "home" },
  { href: "/generate", key: "generator" },
  { href: "/cognitive-tests", key: "tests" },
  { href: "/security", key: "security", badge: "NEW" },
  { href: "/docs", key: "docs" },
  { href: "/examples", key: "examples" },
  { href: "/integrations", key: "integrations" },
  { href: "/research", key: "research" },
];

export function Navigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { lang, setLang } = useLanguage();

  const labels: Record<string, { en: string; fr: string }> = {
    home: { en: "Home", fr: "Accueil" },
    generator: { en: "Generator", fr: "Générateur" },
    tests: { en: "Tests", fr: "Tests" },
    security: { en: "Security", fr: "Sécurité" },
    docs: { en: "Docs", fr: "Documentation" },
    examples: { en: "Examples", fr: "Exemples" },
    integrations: { en: "Integrations", fr: "Intégrations" },
    research: { en: "Research", fr: "Recherche" },
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition group">
          <svg
            width="40"
            height="40"
            viewBox="0 0 32 32"
            fill="none"
            className="logo-glow"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="header-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgb(56, 189, 248)" />
                <stop offset="100%" stopColor="rgb(147, 51, 234)" />
              </linearGradient>
            </defs>
            
            <rect x="6" y="6" width="4" height="20" rx="2" fill="url(#header-grad)" />
            <rect x="6" y="14" width="12" height="4" rx="2" fill="url(#header-grad)" />
            <rect x="18" y="6" width="8" height="4" rx="2" fill="url(#header-grad)" />
            <rect
              x="19"
              y="10"
              width="4"
              height="16"
              rx="2"
              transform="rotate(15 21 18)"
              fill="url(#header-grad)"
            />
          </svg>

          <div className="flex flex-col">
            <span className="text-xl font-bold bg-linear-to-r from-sky-500 to-purple-600 bg-clip-text text-transparent">
              HCS-U7
            </span>
            <span className="text-[10px] text-muted-foreground hidden sm:block">
              Cognitive Profile
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            const label = labels[item.key][lang];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-primary flex items-center gap-1",
                  active ? "text-primary" : "text-foreground/85",
                )}
              >
                {label}
                {item.badge && (
                  <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full font-semibold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full border px-1 py-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setLang("en")}
                className={cn(
                  "rounded-full px-2 py-0.5 transition-colors",
                  lang === "en" ? "bg-primary text-primary-foreground" : "text-foreground/85",
                )}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLang("fr")}
                className={cn(
                  "rounded-full px-2 py-0.5 transition-colors",
                  lang === "fr" ? "bg-primary text-primary-foreground" : "text-foreground/85",
                )}
              >
                FR
              </button>
            </div>
            <ThemeToggle />
          </div>
          <Link href="/generate">
            <Button size="sm" className="ml-2 rounded-full">
              {lang === "fr" ? "Générer mon profil" : "Generate my profile"}
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-full"
            aria-label={open ? (lang === "fr" ? "Fermer la navigation" : "Close navigation") : lang === "fr" ? "Ouvrir la navigation" : "Open navigation"}
            onClick={() => setOpen((prev) => !prev)}
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="border-t bg-background/95 backdrop-blur md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 text-sm font-medium sm:px-6 lg:px-8">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              const label = labels[item.key][lang];
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 transition-colors flex items-center justify-between",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/85 hover:bg-muted hover:text-foreground",
                  )}
                  onClick={() => setOpen(false)}
                >
                  <span>{label}</span>
                  {item.badge && (
                    <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full font-semibold ml-2">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
            <Link href="/generate" onClick={() => setOpen(false)}>
              <Button className="mt-2 w-full rounded-full" size="sm">
                {lang === "fr" ? "Générer mon profil" : "Generate my profile"}
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
