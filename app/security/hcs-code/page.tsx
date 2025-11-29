import { Metadata } from "next";
import { TechnicalSection } from "@/components/security/TechnicalSection";
import { SecurityAdvantages } from "@/components/security/SecurityAdvantages";
import { SecurityFeatures } from "@/components/security/SecurityFeatures";
import { BotAttackSimulator } from "@/components/security/BotAttackSimulator";
import { ProtectionTester } from "@/components/security/ProtectionTester";
import { SecurityRoadmap } from "@/components/security/SecurityRoadmap";
import { SecurityCTA } from "@/components/security/SecurityCTA";
import { SecuritySubnav } from "@/components/security/SecuritySubnav";

export const metadata: Metadata = {
  title: "HCS-U7 Code & Anti-Bot Security | HCS-U7",
  description:
    "Deep dive into the HCS-U7 cognitive code, its anti-bot properties and security architecture.",
};

export default function SecurityHcsCodePage() {
  return (
    <main className="flex flex-col">
      <SecuritySubnav />
      <TechnicalSection />
      <SecurityAdvantages />
      <SecurityFeatures />
      <BotAttackSimulator />
      <ProtectionTester />
      <SecurityRoadmap />
      <SecurityCTA />
    </main>
  );
}
