"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/LanguageProvider";

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
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <span className="text-sm font-bold">H7</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-tight">HCS-U7</span>
            <span className="text-xs text-muted-foreground">
              Human Cognitive Signature
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
                  active ? "text-primary" : "text-muted-foreground",
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
          <div className="flex items-center gap-1 rounded-full border px-1 py-0.5 text-[11px]">
            <button
              type="button"
              onClick={() => setLang("en")}
              className={cn(
                "rounded-full px-2 py-0.5 transition-colors",
                lang === "en" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang("fr")}
              className={cn(
                "rounded-full px-2 py-0.5 transition-colors",
                lang === "fr" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
            >
              FR
            </button>
          </div>
          <Link href="/generate">
            <Button size="sm" className="ml-2 rounded-full">
              {lang === "fr" ? "Générer mon profil" : "Generate my profile"}
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
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
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
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
