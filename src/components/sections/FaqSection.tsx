"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { faqItems, siteConfig } from "@/lib/site.config";

export function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="pt-20" aria-labelledby="faq-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-y border-dashed border-grid-soft p-4">
        <h2
          id="faq-heading"
          className="font-serif text-3xl leading-normal text-foreground"
        >
          Straight <span className="italic text-muted-foreground">answers</span>
          .
        </h2>
        <p className="text-sm font-light text-muted-foreground">
          {faqItems.length} questions
        </p>
      </div>

      <p className="mt-6 border-y border-dashed border-grid-soft px-4 py-1 text-sm font-light text-muted-foreground">
        Question not listed?{" "}
        <a
          href={siteConfig.links.cal}
          target="_blank"
          rel="noopener noreferrer"
          className="copy-link"
        >
          Book a slot
        </a>
        .
      </p>

      <ul>
        {faqItems.map((item, index) => {
          const isOpen = open === index;

          return (
            <li
              key={item.question}
              className="mt-1 border-y border-dashed border-grid-soft"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left"
              >
                <span className="font-sans text-base font-normal tracking-tight text-foreground">
                  {item.question}
                </span>
                <Plus
                  aria-hidden="true"
                  size={13}
                  strokeWidth={1.7}
                  className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <p className="px-4 pb-3 font-sans text-sm font-light leading-relaxed tracking-tight text-muted-foreground">
                  {item.answer}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
