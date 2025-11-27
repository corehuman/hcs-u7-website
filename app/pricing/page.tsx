import { Button } from "@/components/ui/button";

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <div className="space-y-4 rounded-2xl border bg-white/70 p-6 text-sm shadow-sm dark:bg-neutral-950/70">
        <p className="text-xs font-medium uppercase tracking-wide text-primary">
          Pricing
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Free & Open Source
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          HCS-U7 is currently free for individual and research use. The code,
          parsers and documentation are available under the MIT license.
        </p>

        <section className="space-y-3 rounded-xl bg-primary/5 p-4">
          <h2 className="text-sm font-semibold text-foreground">
            🎁 Free Forever (Individual)
          </h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
            <li>Unlimited profile generation.</li>
            <li>Open-source parsers (Python, JavaScript, ROS2).</li>
            <li>Full documentation.</li>
            <li>Community support (Discord, GitHub Issues).</li>
          </ul>
          <Button asChild className="mt-2 rounded-full">
            <a href="/generate">Get started for free</a>
          </Button>
        </section>

        <section className="space-y-2 rounded-xl bg-muted p-4 text-sm text-muted-foreground">
          <h2 className="text-sm font-semibold text-foreground">
            💼 Enterprise (Coming soon)
          </h2>
          <ul className="list-disc space-y-1 pl-5">
            <li>On-premise & VPC deployment.</li>
            <li>Priority support & dedicated guidance.</li>
            <li>Team training & workshops.</li>
            <li>Custom role-based profiles & SLAs.</li>
          </ul>
          <p className="text-xs">
            For companies interested in a pilot, contact us at
            <a
              href="mailto:contact@hcs-u7.org"
              className="ml-1 underline hover:text-primary"
            >
              contact@hcs-u7.org
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
