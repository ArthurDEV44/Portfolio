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
      <p className="flex items-center gap-2 border-y border-dashed border-grid-soft px-4 py-1 text-sm font-light text-muted-foreground">
        <span
          aria-hidden="true"
          className="size-2 animate-pulse rounded-full bg-[color:var(--available)]"
        />
        Available · April 2026
      </p>

      <h2
        id="cta-heading"
        className="mt-1 border-y border-dashed border-grid-soft p-4 font-serif text-3xl leading-normal text-foreground"
      >
        Build <span className="italic text-muted-foreground">something</span>?
      </h2>

      <p className="mt-6 border-y border-dashed border-grid-soft px-4 font-sans text-base font-light leading-relaxed tracking-tight text-muted-foreground">
        30 minutes to frame the need. No sales pitch, just an honest technical
        conversation.
      </p>

      <div className="mt-1 flex items-center gap-4 border-y border-dashed border-grid-soft px-4 py-1">
        <a
          href={siteConfig.links.cal}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border-x border-dashed border-grid-soft text-sm text-foreground transition-colors hover:text-[color:var(--brand)]"
        >
          Book a call
          <ArrowRight aria-hidden="true" size={14} strokeWidth={1.5} />
        </a>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-2 border-x border-dashed border-grid-soft text-sm text-muted-foreground transition-colors hover:text-foreground"
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
