import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { LanguageProvider } from "@/components/LanguageProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://hcs-u7.vercel.app",
  ),
  title: "HCS-U7 | Cognitive Profiles for Personalized AI",
  description:
    "Generate your cognitive profile and optimize AI interactions. Open-source system for ChatGPT, Claude, and more.",
  keywords: [
    "AI personalization",
    "cognitive profile",
    "ChatGPT",
    "Claude AI",
    "HCS-U7",
  ],
  openGraph: {
    title: "HCS-U7 - Personalize Your AI Interactions",
    description:
      "10-minute questionnaire → Get your cognitive code → Better AI responses",
    images: ["/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HCS-U7",
    description: "Cognitive profiles for personalized AI",
    images: ["/twitter-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <LanguageProvider>
          <a
            href="#main"
            className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-50 focus-visible:rounded-full focus-visible:bg-primary focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-primary-foreground shadow"
          >
            Skip to main content
          </a>
          <Navigation />
          <main id="main" className="min-h-[calc(100vh-8rem)] bg-background">
            {children}
          </main>
          <Footer />
          <Analytics />
        </LanguageProvider>
      </body>
    </html>
  );
}
