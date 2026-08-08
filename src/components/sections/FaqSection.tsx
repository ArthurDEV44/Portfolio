"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { faqItems, siteConfig } from "@/lib/site.config";

export function FaqSection() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="pt-20" aria-labelledby="faq-heading">
      <div className="border-grid-soft flex flex-wrap items-baseline justify-between gap-3 border-y border-dashed p-4">
        <h2
          id="faq-heading"
          className="text-foreground font-serif text-3xl leading-normal"
        >
          Straight <span className="text-muted-foreground italic">answers</span>
          .
        </h2>
        <p className="text-muted-foreground text-sm font-light">
          {faqItems.length} questions
        </p>
      </div>

      <p className="border-grid-soft text-muted-foreground mt-6 border-y border-dashed px-4 py-1 text-sm font-light">
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
              className="border-grid-soft mt-1 border-y border-dashed"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : index)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left"
              >
                <span className="text-foreground font-sans text-base font-normal tracking-tight">
                  {item.question}
                </span>
                <Plus
                  aria-hidden="true"
                  size={13}
                  strokeWidth={1.7}
                  className={`text-muted-foreground shrink-0 transition-transform duration-200 ${
                    isOpen ? "rotate-45" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <p className="text-muted-foreground px-4 pb-3 font-sans text-sm leading-relaxed font-light tracking-tight">
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
