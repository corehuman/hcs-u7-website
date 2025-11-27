import Link from "next/link";

interface DocsLayoutProps {
  children: React.ReactNode;
}

const sections = [
  {
    title: "📖 Introduction",
    items: [
      { href: "/docs", label: "What is HCS-U7?" },
      { href: "/docs/why", label: "Why use it?" },
      { href: "/docs/quick-start", label: "Quick Start" },
    ],
  },
  {
    title: "🧬 Specification",
    items: [
      { href: "/docs/spec/format", label: "Code format" },
      { href: "/docs/spec/element", label: "Element (E/F/W/A)" },
      { href: "/docs/spec/modal", label: "Modal (Cardinal/Fixed/Mutable)" },
      { href: "/docs/spec/cognition", label: "Cognition (F/C/V/S/Cr)" },
      { href: "/docs/spec/interaction", label: "Interaction (PB/SM/TN)" },
      { href: "/docs/spec/signatures", label: "Signatures (QSIG/B3)" },
    ],
  },
  {
    title: "🔧 Integrations",
    items: [
      { href: "/docs/integrations/openai", label: "OpenAI API" },
      { href: "/docs/integrations/anthropic", label: "Anthropic Claude" },
      { href: "/docs/integrations/langchain", label: "LangChain" },
      { href: "/docs/integrations/other", label: "Autres frameworks" },
    ],
  },
  {
    title: "🤖 Robotics (HCS-U7R)",
    items: [
      { href: "/docs/robotics/overview", label: "Extension v8.0" },
      { href: "/docs/robotics/proxemics", label: "Proxemics" },
      { href: "/docs/robotics/motion", label: "Adaptive motion" },
      { href: "/docs/robotics/ros2", label: "ROS2 integration" },
    ],
  },
  {
    title: "🔬 Validation",
    items: [
      { href: "/docs/validation/protocol", label: "Empirical protocol" },
      { href: "/docs/validation/metrics", label: "Metrics" },
      { href: "/docs/validation/results", label: "Study results" },
    ],
  },
  {
    title: "💻 Developers",
    items: [
      { href: "/docs/developers/parsers", label: "Parsers (Python/JS)" },
      { href: "/docs/developers/api", label: "API Reference" },
      { href: "/docs/developers/examples", label: "Exemples de code" },
    ],
  },
];

export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-64 shrink-0 overflow-y-auto border-r pr-4 text-sm text-muted-foreground md:block">
        <nav className="space-y-6">
          {sections.map((section) => (
            <div key={section.title} className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-foreground/80">
                {section.title}
              </p>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="inline-flex rounded px-1 py-0.5 text-xs hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1 space-y-8 text-sm leading-relaxed text-foreground">
        {children}
      </div>
    </div>
  );
}
