"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = "", className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border bg-neutral-900/95 text-xs text-neutral-50",
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/80 px-3 py-2">
        <span className="font-mono text-[11px] uppercase tracking-wide text-neutral-400">
          {language || "code"}
        </span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7 border-neutral-700 bg-neutral-900/80 text-neutral-200 hover:bg-neutral-800"
          onClick={handleCopy}
          aria-label="Copier le code"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
        </Button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[11px] leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
