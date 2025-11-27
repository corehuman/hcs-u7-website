import { CodeBlock } from "@/components/CodeBlock";

export default function IntegrationsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          Integrations
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Integrate HCS-U7 into your systems
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          HCS-U7 is designed to be easily integrated into your APIs, agents and
          higher-level frameworks.
        </p>
      </div>

      <section className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2 rounded-2xl border bg-white/70 p-4 text-sm shadow-sm dark:bg-neutral-950/70">
          <h2 className="font-semibold text-foreground">OpenAI / ChatGPT</h2>
          <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
            <li>Use as a system prompt.</li>
            <li>Simple TypeScript / Python wrapper.</li>
            <li>Compatible with GPT assistants.</li>
          </ul>
        </div>
        <div className="space-y-2 rounded-2xl border bg-white/70 p-4 text-sm shadow-sm dark:bg-neutral-950/70">
          <h2 className="font-semibold text-foreground">Anthropic / Claude</h2>
          <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
            <li>Persistent system instruction.</li>
            <li>Adaptation of tone and pace.</li>
            <li>Support via Python / JS SDKs.</li>
          </ul>
        </div>
        <div className="space-y-2 rounded-2xl border bg-white/70 p-4 text-sm shadow-sm dark:bg-neutral-950/70">
          <h2 className="font-semibold text-foreground">LangChain</h2>
          <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
            <li>Custom prompt templates.</li>
            <li>Agents with profile-aware memory.</li>
            <li>Composable with multi-AI toolchains.</li>
          </ul>
        </div>
        <div className="space-y-2 rounded-2xl border bg-white/70 p-4 text-sm shadow-sm dark:bg-neutral-950/70">
          <h2 className="font-semibold text-foreground">Robotics</h2>
          <ul className="list-disc space-y-1 pl-4 text-xs text-muted-foreground">
            <li>HCS-U7R extension (v8.0).</li>
            <li>ROS2 nodes for proxemics/motion.</li>
            <li>Adaptation to human preferences.</li>
          </ul>
        </div>
      </section>

      <section className="mt-12 space-y-6">
        <h2 className="text-lg font-semibold tracking-tight text-foreground">
          Parsers & SDKs
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Python</h3>
            <CodeBlock
              language="bash"
              code={`pip install hcs-u7`}
            />
            <CodeBlock
              language="python"
              code={`from hcs_u7 import parse_hcs_code

code = "HCS-U7|V:7.0|..."
profile = parse_hcs_code(code)
print(profile.element, profile.cognition.logic)`}
            />
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">JavaScript / TypeScript</h3>
            <CodeBlock
              language="bash"
              code={`npm install hcs-u7`}
            />
            <CodeBlock
              language="ts"
              code={`import { parseHCSCode } from "hcs-u7";

const profile = parseHCSCode("HCS-U7|V:7.0|...");
console.log(profile.element, profile.cognition.logic);`}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
