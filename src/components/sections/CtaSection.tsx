"use client";

import { ArrowRight, Check, Copy } from "lucide-react";
import { useState } from "react";

import { siteConfig } from "@/lib/site.config";

export function CtaSection() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(siteConfig.links.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable, silently ignore
    }
  };

  return (
    <section id="cta" className="pt-20" aria-labelledby="cta-heading">
      <p className="border-grid-soft text-muted-foreground flex items-center gap-2 border-y border-dashed px-4 py-1 text-sm font-light">
        <span
          aria-hidden="true"
          className="size-2 animate-pulse rounded-full bg-[color:var(--available)]"
        />
        Available · April 2026
      </p>

      <h2
        id="cta-heading"
        className="border-grid-soft text-foreground mt-1 border-y border-dashed p-4 font-serif text-3xl leading-normal"
      >
        Build <span className="text-muted-foreground italic">something</span>?
      </h2>

      <p className="border-grid-soft text-muted-foreground mt-6 border-y border-dashed px-4 font-sans text-base leading-relaxed font-light tracking-tight">
        30 minutes to frame the need. No sales pitch, just an honest technical
        conversation.
      </p>

      <div className="border-grid-soft mt-1 flex items-center gap-4 border-y border-dashed px-4 py-1">
        <a
          href={siteConfig.links.cal}
          target="_blank"
          rel="noopener noreferrer"
          className="border-grid-soft text-foreground flex items-center gap-2 border-x border-dashed text-sm transition-colors hover:text-[color:var(--brand)]"
        >
          Book a call
          <ArrowRight aria-hidden="true" size={14} strokeWidth={1.5} />
        </a>
        <button
          type="button"
          onClick={copy}
          className="border-grid-soft text-muted-foreground hover:text-foreground flex items-center gap-2 border-x border-dashed text-sm transition-colors"
        >
          {copied ? (
            <>
              <Check aria-hidden="true" size={13} strokeWidth={2} /> Copied
            </>
          ) : (
            <>
              <Copy aria-hidden="true" size={13} strokeWidth={1.5} />{" "}
              {siteConfig.links.email}
            </>
          )}
        </button>
      </div>
    </section>
  );
}
