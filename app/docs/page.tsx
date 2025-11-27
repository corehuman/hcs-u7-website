export default function DocsIndexPage() {
  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          What is HCS-U7?
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          HCS-U7 (Human Cognitive Signature) is an open system for representing
          a user&apos;s cognitive and interaction preferences. It produces a compact
          code that AI systems can interpret to adapt their behaviour.
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
            <strong>Explicit control</strong>: the HCS-U7 code is readable and
            editable by the user.
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
}
