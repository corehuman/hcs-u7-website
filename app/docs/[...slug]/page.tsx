import { notFound } from "next/navigation";

import { CodeBlock } from "@/components/CodeBlock";

interface DocsPageProps {
  params: {
    slug?: string[];
  };
}

function getSlugKey(slug?: string[]): string {
  if (!slug || slug.length === 0) return "intro";
  return slug.join("/");
}

export default function DocsPage({ params }: DocsPageProps) {
  const key = getSlugKey(params.slug);

  switch (key) {
    case "intro":
      return (
        <article className="space-y-6">
          <header className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              What is HCS-U7?
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
              HCS-U7 (Human Cognitive Signature) is an open system for
              representing a user&apos;s cognitive and interaction preferences. It
              produces a compact code that AI systems can interpret to adapt
              their behaviour.
            </p>
          </header>

          <section className="space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Why use it?</h2>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                <strong>Persistent personalization</strong>: one profile for all
                your AIs (ChatGPT, Claude, internal tools).
              </li>
              <li>
                <strong>Explicit control</strong>: the HCS-U7 code is readable
                and editable by the user.
              </li>
              <li>
                <strong>Interoperable</strong>: official parsers in Python,
                JavaScript and ROS2.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-foreground">Quick Start</h2>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
              <li>Generate your profile via the /generate page.</li>
              <li>
                Copy the HCS-U7 code and the automatically generated prompt for
                ChatGPT or Claude.
              </li>
              <li>
                Paste the prompt at the beginning of your conversations. The
                assistant then adapts its style to your profile.
              </li>
            </ol>
          </section>
        </article>
      );
    case "why":
      return (
        <article className="space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Why HCS-U7?
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Large language models are powerful but often impersonal. HCS-U7
            provides a stable, explicit and portable personalization layer
            across different AIs.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <strong>Less friction</strong>: fewer repetitive clarifications.
            </li>
            <li>
              <strong>Time savings</strong>: reduced average time to solution
              (target: -23% in ongoing studies).
            </li>
            <li>
              <strong>Higher satisfaction</strong>: alignment with the user&apos;s
              preferred answer style.
            </li>
          </ul>
        </article>
      );
    case "quick-start":
      return (
        <article className="space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Quick Start
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Cette section montre un flux minimal de bout en bout, depuis le
            questionnaire jusqu&apos;à l&apos;intégration dans une API.
          </p>
          <CodeBlock
            language="bash"
            code={`# Installation côté backend Node.js
npm install hcs-u7

# Utilisation basique
override HCS_U7_CODE="HCS-U7|V:7.0|..."
`}
          />
        </article>
      );
    case "spec/format":
      return (
        <article className="space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            HCS-U7 code format
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            The HCS-U7 code is a compact string made of segments separated by
            vertical bars <code>|</code>. Each segment carries information about
            your profile.
          </p>
          <CodeBlock
            language="text"
            code={`HCS-U7|V:7.0|ALG:QS|E:E|MOD:c30f40m30|COG:F15C70V20S25Cr20|INT:PB=B,SM=M,TN=L|QSIG:abc123|B3:def456`}
          />
        </article>
      );
    case "spec/element":
      return (
        <article className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Element (E/F/W/A)
          </h1>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>
              <strong>E (Air)</strong>: analytical, focused on concepts and
              structures.
            </li>
            <li>
              <strong>F (Fire)</strong>: action-oriented, fast decisions.
            </li>
            <li>
              <strong>W (Water)</strong>: intuitive, sensitive to relational
              context.
            </li>
            <li>
              <strong>A (Earth)</strong>: pragmatic, stability and procedures.
            </li>
          </ul>
        </article>
      );
    case "spec/modal":
      return (
        <article className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Modal (Cardinal / Fixed / Mutable)
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            The modal describes how you move into action when facing change:
            initiation, stabilisation or adaptation.
          </p>
        </article>
      );
    case "spec/cognition":
      return (
        <article className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Cognition (F/C/V/S/Cr)
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Five axes model your way of processing information: form, logic,
            visual, synthesis, creativity.
          </p>
        </article>
      );
    case "spec/interaction":
      return (
        <article className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Interaction (PB / SM / TN)
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            These parameters control pace (PB), sensitivity to tone (SM) and
            tolerance to inaccuracies (TN).
          </p>
        </article>
      );
    case "spec/signatures":
      return (
        <article className="space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Signatures (QSIG / B3)
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Signatures condense your profile into short identifiers, enabling
            anonymised comparisons and statistical analyses.
          </p>
        </article>
      );
    case "integrations/openai":
      return (
        <article className="space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Intégration OpenAI API
          </h1>
          <CodeBlock
            language="ts"
            code={`import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

const systemPrompt = "# USER COGNITIVE PROFILE (HCS-U7) ..."; // généré par HCS-U7

const completion = await client.chat.completions.create({
  model: "gpt-4.1-mini",
  messages: [
    { role: "system", content: systemPrompt },
    { role: "user", content: "Explique-moi ce code." },
  ],
});
`}
          />
        </article>
      );
    case "validation/protocol":
      return (
        <article className="space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Empirical validation protocol
          </h1>
          <p className="text-sm text-muted-foreground sm:text-base">
            Randomized crossover study (N=50) comparing AI interactions with and
            without HCS-U7. Main metrics: time to solution, number of
            clarifications, subjective satisfaction.
          </p>
        </article>
      );
    case "developers/parsers":
      return (
        <article className="space-y-4">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Parsers HCS-U7 (Python / JavaScript)
          </h1>
          <CodeBlock
            language="python"
            code={`from hcs_u7 import parse_hcs_code

profile = parse_hcs_code("HCS-U7|V:7.0|...")
print(profile.dominant_element)
`}
          />
          <CodeBlock
            language="ts"
            code={`import { parseHCSCode } from "hcs-u7";

const profile = parseHCSCode("HCS-U7|V:7.0|...");
console.log(profile.element, profile.cognition.logic);
`}
          />
        </article>
      );
    default:
      notFound();
  }
}
