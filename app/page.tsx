"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Github,
  Sparkles,
  Workflow,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-neutral-50 via-background to-background">
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8">
        {/* Hero */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="grid gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:items-center"
        >
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Cognitive personalization for AI interactions</span>
            </div>
            <div className="space-y-4">
              <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Personalize your AI interactions to your cognitive profile
              </h1>
              <p className="max-w-xl text-pretty text-sm text-muted-foreground sm:text-base">
                HCS-U7 encodes your communication preferences into a compact
                code that AIs can interpret to adapt their responses. One
                profile, reusable across ChatGPT, Claude, APIs and your own
                applications.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link href="/generate" aria-label="Generate my HCS-U7 profile">
                  Generate my profile
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full border-dashed px-5"
              >
                <a href="#how-it-works">How does it work?</a>
              </Button>
              <p className="w-full text-xs text-muted-foreground sm:w-auto sm:text-sm">
                10-minute questionnaire → one HCS-U7 code you can use everywhere.
              </p>
            </div>
            <dl className="grid gap-4 text-xs text-muted-foreground sm:grid-cols-3 sm:text-sm">
              <div>
                <dt className="font-medium text-foreground">Audience</dt>
                <dd>AI developers, product teams, researchers, power users.</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Stack</dt>
                <dd>Open source, parsers for Python / JS / ROS2.</dd>
              </div>
              <div>
                <dt className="font-medium text-foreground">Usage</dt>
                <dd>One profile for all your AI conversations.</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-3xl border bg-white/70 p-5 shadow-sm backdrop-blur dark:bg-neutral-950/70">
            <div className="space-y-4">
              <p className="text-xs font-medium uppercase tracking-wide text-primary">
                Example HCS-U7 profile
              </p>
              <div className="rounded-2xl bg-neutral-950 p-4 text-xs text-neutral-50">
                <p className="font-mono text-[11px] leading-relaxed">
                  HCS-U7|V:7.0|ALG:QS|E:E|MOD:c30f40m30|
                  <br />
                  COG:F15C70V20S25Cr20|INT:PB=B,SM=M,TN=L|
                  <br />
                  QSIG:abc123ef90|B3:def456gh
                </p>
              </div>
              <ul className="space-y-2 text-xs text-muted-foreground sm:text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                  <span>
                    <span className="font-medium text-foreground">
                      Dominant cognitive style: Analytical (Air).
                    </span>{" "}
                    Prefers structured explanations, few visuals.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                  <span>
                    <span className="font-medium text-foreground">
                      Pace: balanced.
                    </span>{" "}
                    Neither too slow nor too fast, with a controlled level of
                    detail.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                  <span>
                    Recommended responses: direct, technical, decision-oriented.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* Le problème */}
        <motion.section
          id="problem"
          className="mt-16 grid gap-8 md:grid-cols-2"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Before HCS-U7
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              Every new AI conversation feels like starting over: you must
              explain, reconfigure and refine your style again. Result: friction,
              wasted time and frustration.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="mt-1 text-destructive">✕</span>
                <span>The AI gives too many details… or not enough.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 text-destructive">✕</span>
                <span>The pace does not match your cognitive style.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 text-destructive">✕</span>
                <span>
                  You must repeat your preferences in every new session.
                </span>
              </li>
            </ul>
          </div>

          <div className="space-y-4 rounded-2xl border bg-white/70 p-6 shadow-sm dark:bg-neutral-950/70">
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              With HCS-U7
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              A single compact code describes how you learn, reason and
              interact. AIs can then automatically adapt their behaviour.
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="mt-1 text-emerald-600">✔</span>
                <span>
                  The AI adapts its response style to your cognitive profile.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 text-emerald-600">✔</span>
                <span>
                  Responses are aligned with your need for structure, visuals,
                  synthesis or creativity.
                </span>
              </li>
              <li className="flex gap-2">
                <span className="mt-1 text-emerald-600">✔</span>
                <span>
                  Configure once, reuse across ChatGPT, Claude, LangChain,
                  physical robots, etc.
                </span>
              </li>
            </ul>
          </div>
        </motion.section>

        {/* How it works */}
        <motion.section
          id="how-it-works"
          className="mt-20 space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="space-y-3">
            <h2 className="text-center text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              How does it work?
            </h2>
            <p className="mx-auto max-w-2xl text-center text-sm text-muted-foreground sm:text-base">
              Three simple steps: a 24-question survey, an automatically
              generated HCS-U7 code, then direct integration into your AI tools.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="flex flex-col gap-3 rounded-2xl border bg-white/70 p-5 shadow-sm dark:bg-neutral-950/70">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                1
              </div>
              <h3 className="text-sm font-semibold text-foreground sm:text-base">
                Questionnaire (10 min)
              </h3>
              <p className="text-sm text-muted-foreground">
                Answer 24 questions about your cognitive style, preferred pace,
                tone sensitivity and tolerance to inaccuracies.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border bg-white/70 p-5 shadow-sm dark:bg-neutral-950/70">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-secondary/10 text-xs font-semibold text-secondary">
                2
              </div>
              <h3 className="text-sm font-semibold text-foreground sm:text-base">
                Code generation
              </h3>
              <p className="text-sm text-muted-foreground">
                Get a unique HCS-U7 code such as:
              </p>
              <p className="rounded-xl bg-neutral-950 px-3 py-2 font-mono text-[11px] text-neutral-50">
                HCS-U7|V:7.0|ALG:QS|E:E|MOD:c30f40m30|COG:F15C70V20S25Cr20|INT:PB=B,SM=M,TN=L|QSIG:...
              </p>
              <p className="text-xs text-muted-foreground">
                This code encodes your dominant element, modality, cognitive
                profile and interaction preferences.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border bg-white/70 p-5 shadow-sm dark:bg-neutral-950/70">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                3
              </div>
              <h3 className="text-sm font-semibold text-foreground sm:text-base">
                Immediate use
              </h3>
              <p className="text-sm text-muted-foreground">
                Inject your HCS-U7 code into your system prompts (ChatGPT,
                Claude, API) or applications. Responses are automatically
                adapted.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Use cases */}
        <motion.section
          className="mt-20 space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Use cases
              </h2>
              <p className="mt-1 max-w-xl text-sm text-muted-foreground sm:text-base">
                HCS-U7 is designed to cover the full spectrum: from R&D to
                consumer apps, including education and robotics.
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/examples">
                Browse example profiles
                <Workflow className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-2 rounded-2xl border bg-white/70 p-4 text-sm shadow-sm dark:bg-neutral-950/70">
              <h3 className="font-semibold text-foreground">🧑‍💻 AI developers</h3>
              <p className="text-muted-foreground">
                Integrate HCS-U7 into your agents, assistants and copilots to
                dynamically adapt the response style to each user.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl border bg-white/70 p-4 text-sm shadow-sm dark:bg-neutral-950/70">
              <h3 className="font-semibold text-foreground">📚 Students & mentors</h3>
              <p className="text-muted-foreground">
                Adjust the level of detail, pace and supports (text, diagrams,
                examples) to each learning style.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl border bg-white/70 p-4 text-sm shadow-sm dark:bg-neutral-950/70">
              <h3 className="font-semibold text-foreground">💼 Professionals</h3>
              <p className="text-muted-foreground">
                Optimize code reviews, meeting notes, analyses and summaries to
                your way of deciding and prioritizing.
              </p>
            </div>
            <div className="flex flex-col gap-2 rounded-2xl border bg-white/70 p-4 text-sm shadow-sm dark:bg-neutral-950/70">
              <h3 className="font-semibold text-foreground">🤖 Robotics & HRI</h3>
              <p className="text-muted-foreground">
                Coupled with HCS-U7R (v8.0), adapt proxemics, motion and
                feedback of robots to the human cognitive signature.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Open source & validated */}
        <motion.section
          className="mt-20 rounded-3xl border bg-white/80 p-6 shadow-sm dark:bg-neutral-950/80 sm:p-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Open source & empirically validated
              </h2>
              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                HCS-U7 is distributed under the MIT license with official
                parsers (Python, JavaScript, ROS2) and an experimental
                validation protocol focused on human–AI interaction quality.
              </p>
            </div>
            <Button asChild variant="outline" size="sm" className="gap-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
              >
                <Github className="h-4 w-4" />
                View repository
              </a>
            </Button>
          </div>
          <div className="mt-6 grid gap-4 text-sm text-muted-foreground sm:grid-cols-4">
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/80">
                License
              </p>
              <p>100% Open source (MIT)</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/80">
                Official parsers
              </p>
              <p>Python, JavaScript, ROS2 (HCS-U7R)</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/80">
                Validation
              </p>
              <p>Empirical protocol N=50 (randomized crossover)</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium uppercase tracking-wide text-foreground/80">
                Social signal
              </p>
              <p>GitHub ~1.2k⭐ · preprint available on arXiv</p>
            </div>
          </div>
        </motion.section>

        {/* Final call-to-action banner */}
        <motion.section
          className="mt-16 rounded-2xl border border-dashed bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 p-5 sm:p-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionVariants}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                <Zap className="h-4 w-4" />
                Ready to personalize your AI interactions?
              </p>
              <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
                Start the HCS-U7 generator, get your cognitive code in a few
                minutes and begin tailoring your prompts right away.
              </p>
            </div>
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href="/generate">
                Start questionnaire
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
