import { Metadata } from "next";
import { SecurityFAQ } from "@/components/security/SecurityFAQ";
import { SecurityCTA } from "@/components/security/SecurityCTA";
import { SecuritySubnav } from "@/components/security/SecuritySubnav";

export const metadata: Metadata = {
  title: "Security FAQ | HCS-U7",
  description:
    "Frequently asked questions about HCS-U7 cognitive security, privacy and integration.",
};

export default function SecurityFaqPage() {
  return (
    <main className="flex flex-col">
      <SecuritySubnav />
      <SecurityFAQ />
      <SecurityCTA />
    </main>
  );
}
