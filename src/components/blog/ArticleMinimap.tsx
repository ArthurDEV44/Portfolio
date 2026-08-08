"use client";

import { useEffect, useRef, useState } from "react";

import type { TocEntry } from "@/lib/blog";

/* Where a heading counts as entered, measured from the top of the viewport. */
const READING_LINE = 140;

/* Vertical reach of the pointer, and how far to its left the effect still
   answers. Both in pixels. */
const PROXIMITY_RADIUS = 96;
const PROXIMITY_GATE = 220;

/* The stack has to stay inside the window whatever the article length, so the
   step between marks is derived from the count rather than fixed. */
const STEP_MIN = 4;
const STEP_MAX = 10;
const STACK_FRACTION = 0.62;

type Mark =
  | { kind: "section" | "subsection"; id: string; text: string }
  | { kind: "block" };

function marksFromToc(entries: TocEntry[]): Mark[] {
  return entries.map((entry) => ({
    kind: entry.depth === 2 ? "section" : "subsection",
    id: entry.id,
    text: entry.text,
  }));
}

/* One mark per top-level block, read from what the page actually rendered
   rather than re-parsed from the source: the minimap then cannot drift from
   the document it describes. */
function marksFromDom(): Mark[] | null {
  const blocks = document.querySelectorAll<HTMLElement>(".article-body > *");
  if (blocks.length === 0) return null;

  const marks: Mark[] = [];
  for (const block of blocks) {
    const heading = block.tagName === "H2" || block.tagName === "H3";
    if (heading && block.id) {
      marks.push({
        kind: block.tagName === "H2" ? "section" : "subsection",
        id: block.id,
        text: block.textContent ?? "",
      });
    } else {
      marks.push({ kind: "block" });
    }
  }
  return marks;
}

/* Long marks for sections, shorter for subsections, short for body blocks, so
   the stack reads as the rhythm of the document rather than as a list. Headings
   are anchors carrying their text and are server rendered, which keeps the
   structure navigable by keyboard and by screen reader with no script at all.
   Body marks are decoration and are hidden from assistive technology. */
export function ArticleMinimap({ entries }: { entries: TocEntry[] }) {
  const [marks, setMarks] = useState<Mark[]>(() => marksFromToc(entries));
  const [activeId, setActiveId] = useState<string | null>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const full = marksFromDom();
    if (full) setMarks(full);
  }, [entries]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    const fit = () => {
      const step = Math.min(
        STEP_MAX,
        Math.max(
          STEP_MIN,
          (window.innerHeight * STACK_FRACTION) / Math.max(1, marks.length),
        ),
      );
      list.style.setProperty("--minimap-step", `${step.toFixed(2)}px`);
    };

    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [marks.length]);

  useEffect(() => {
    const headings = entries
      .map((entry) => document.getElementById(entry.id))
      .filter((element): element is HTMLElement => element !== null);

    if (headings.length === 0) return;

    let frame = 0;

    /* The last heading above the reading line stays current until the next one
       reaches it, so the mark never blanks out in the middle of a section. */
    const measure = () => {
      frame = 0;
      let current = headings[0].id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top > READING_LINE) break;
        current = heading.id;
      }
      setActiveId(current);
    };

    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(measure);
    };

    measure();

    // The shell scrolls an inner container rather than the document, and those
    // scroll events only reach here during the capture phase.
    document.addEventListener("scroll", schedule, true);
    window.addEventListener("resize", schedule);

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      document.removeEventListener("scroll", schedule, true);
      window.removeEventListener("resize", schedule);
    };
  }, [entries]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    // A reader who asked for less motion gets the static stack and the current
    // mark, and no pointer response at all.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let pointerX = 0;
    let pointerY = 0;

    /* Written straight to a custom property rather than through state: this runs
       on pointer move, and a React render per frame would be the one thing that
       makes a decorative effect expensive. */
    const apply = () => {
      frame = 0;
      for (const dash of list.querySelectorAll<HTMLElement>(".dash")) {
        const box = dash.getBoundingClientRect();
        const gap = pointerX - box.right;
        let strength = 0;

        if (gap < 0 && gap > -PROXIMITY_GATE) {
          const distance = Math.abs(pointerY - (box.top + box.height / 2));
          strength = Math.max(0, 1 - distance / PROXIMITY_RADIUS) ** 2;
        }

        dash.style.setProperty("--proximity", strength.toFixed(3));
      }
    };

    const onMove = (event: PointerEvent) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      if (frame === 0) frame = requestAnimationFrame(apply);
    };

    const clear = () => {
      for (const dash of list.querySelectorAll<HTMLElement>(".dash")) {
        dash.style.setProperty("--proximity", "0");
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    // A pointer that leaves the window never sends another move, so without this
    // the nearest label would stay lit until the reader comes back.
    document.addEventListener("pointerleave", clear);

    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", clear);
      clear();
    };
  }, [marks]);

  return (
    <nav aria-label="Table of contents" className="article-minimap">
      <ol ref={listRef}>
        {marks.map((mark, index) =>
          mark.kind === "block" ? (
            <li
              // Body marks carry no identity of their own; position is all they
              // are.
              // oxlint-disable-next-line react/no-array-index-key -- decorative
              key={`block-${index}`}
              data-kind="block"
              aria-hidden="true"
            >
              <span className="dash" />
            </li>
          ) : (
            <li key={mark.id} data-kind={mark.kind}>
              <a
                className="dash"
                href={`#${mark.id}`}
                aria-current={activeId === mark.id ? "true" : undefined}
              >
                <span>{mark.text}</span>
              </a>
            </li>
          ),
        )}
      </ol>
    </nav>
  );
}
