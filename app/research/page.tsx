import { Button } from "@/components/ui/button";

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="mb-8 space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          Research
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Scientific validation of HCS-U7
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          This page describes the empirical validation protocol, tracked
          metrics and planned studies around HCS-U7.
        </p>
      </div>

      <section className="space-y-3 rounded-2xl border bg-white/70 p-5 text-sm shadow-sm dark:bg-neutral-950/70">
        <h2 className="text-lg font-semibold text-foreground">
          Empirical validation protocol
        </h2>
        <p className="text-muted-foreground">
          Goal: demonstrate that HCS-U7 significantly improves human–AI
          interaction.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
          <li>Randomized crossover study (N=50).</li>
          <li>Conditions: AI with HCS-U7 vs AI without explicit personalization.</li>
          <li>
            Context: problem solving, learning tasks and decision making.
          </li>
        </ul>
        <p className="text-xs text-muted-foreground">
          Main metrics: time to solution, number of clarifications, subjective
          satisfaction.
        </p>
        <Button type="button" variant="outline" size="sm" className="mt-2">
          Download full protocol (PDF)
        </Button>
      </section>

      <section className="mt-10 space-y-4 rounded-2xl border bg-white/70 p-5 text-sm shadow-sm dark:bg-neutral-950/70">
        <h2 className="text-lg font-semibold text-foreground">
          Study results (timeline)
        </h2>
        <div className="space-y-3 text-muted-foreground">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/80">
              Pilot study (2025) – N=50
            </p>
            <p>Status: ongoing. Preliminary results expected Q2 2025.</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-foreground/80">
              Large-scale study (2025) – N=200
            </p>
            <p>Planned to start in Q3 2025.</p>
          </div>
        </div>
      </section>

      <section className="mt-10 space-y-4 rounded-2xl border bg-white/70 p-5 text-sm shadow-sm dark:bg-neutral-950/70">
        <h2 className="text-lg font-semibold text-foreground">Publications</h2>
        <ul className="list-disc space-y-1 pl-5 text-muted-foreground">
          <li>HCS-U7 Technical Specification (arXiv, 2025).</li>
          <li>Empirical validation (preprint in preparation).</li>
          <li>
            Blog posts: Introduction to Cognitive Profiles for AI, How to
            integrate HCS-U7 in production.
          </li>
        </ul>
      </section>

      <section className="mt-10 space-y-4 rounded-2xl border bg-white/70 p-5 text-sm shadow-sm dark:bg-neutral-950/70">
        <h2 className="text-lg font-semibold text-foreground">
          Participate in a study
        </h2>
        <p className="text-sm text-muted-foreground">
          We are looking for volunteers to participate in the validation
          studies.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Regular AI user (≥ 3 times / week).</li>
          <li>Age between 18 and 65 years.</li>
          <li>Available for 10×30-minute sessions over 4 weeks.</li>
        </ul>
        <p className="text-xs text-muted-foreground">
          Indicative compensation: 20€ gift card (depending on study and local
          regulations).
        </p>
        <Button type="button" size="sm" className="mt-2">
          I want to join (form coming soon)
        </Button>
      </section>
    </div>
  );
}
