"use client";

import { CalendarClock, ChevronDown } from "lucide-react";
import Image from "next/image";
import { useId, useState } from "react";

import { StrivexIcon } from "@/components/ui/brand-icons";
import type { Experience, ExperienceRole } from "@/lib/site.config";
import { experiences } from "@/lib/site.config";

function CompanyMark({ logo }: { logo: Experience["logo"] }) {
  if (logo === "strivex") {
    return (
      <StrivexIcon size={16} className="text-foreground size-4 shrink-0" />
    );
  }

  return (
    <Image
      src="/images/avancial-logo.png"
      alt=""
      width={16}
      height={16}
      aria-hidden="true"
      className="size-4 shrink-0 object-contain"
    />
  );
}

function RoleItem({ role, isLast }: { role: ExperienceRole; isLast: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const panelId = useId();

  return (
    <li className="relative flex items-start gap-2.5 pt-6">
      <span
        aria-hidden="true"
        className={`absolute top-0 left-0 w-px bg-[color:var(--line)]/45 ${
          isLast ? "h-8" : "bottom-0"
        }`}
      />
      <span
        aria-hidden="true"
        className="absolute top-8 left-0 h-px w-4 bg-[color:var(--line)]/45"
      />

      <div className="ml-4 flex h-4 shrink-0 items-center">
        <div className="relative z-10 flex size-5 shrink-0 items-center justify-center">
          <CalendarClock
            aria-hidden="true"
            size={14}
            strokeWidth={1.7}
            className="text-foreground"
          />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-foreground font-sans text-base leading-4 font-normal tracking-tight">
              {role.title}
            </h4>
          </div>
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={panelId}
            aria-label={`${expanded ? "Collapse" : "Expand"} ${role.title}`}
            onClick={() => setExpanded((open) => !open)}
            className="text-muted-foreground hover:text-foreground inline-flex size-4 shrink-0 cursor-pointer items-center justify-center transition-colors"
          >
            <ChevronDown
              aria-hidden="true"
              size={14}
              strokeWidth={1.7}
              className={`transition-transform duration-300 ease-out ${
                expanded ? "-rotate-180" : ""
              }`}
            />
          </button>
        </div>

        <p className="text-muted-foreground mt-2 text-sm font-light">
          {role.contract} <span className="text-[color:var(--line)]">|</span>{" "}
          {role.period} <span className="text-[color:var(--line)]">|</span>{" "}
          {role.duration}
          <span className="text-[color:var(--line)]"> · </span>({role.setup})
        </p>

        <div
          id={panelId}
          inert={!expanded}
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <ul className="mt-4 space-y-2.5">
              {role.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="text-foreground relative pl-4 text-sm leading-relaxed font-light"
                >
                  <span
                    aria-hidden="true"
                    className="bg-muted-foreground absolute top-[0.55em] left-0 size-1 rounded-full"
                  />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </li>
  );
}

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="pt-20"
      aria-labelledby="experience-heading"
    >
      <h2
        id="experience-heading"
        className="border-grid-soft text-foreground border-y border-dashed p-4 font-serif text-3xl leading-normal"
      >
        Experience
      </h2>

      {experiences.map((experience, index) => (
        <div
          key={experience.company}
          className={`border-grid-soft border-y border-dashed p-4 ${
            index === 0 ? "mt-6" : "mt-1"
          }`}
        >
          <article className="w-full">
            <div className="flex items-center gap-3">
              <div className="relative z-10 flex size-5 shrink-0 items-center justify-center">
                <CompanyMark logo={experience.logo} />
              </div>
              <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-3">
                <h3 className="text-foreground font-sans text-base font-normal tracking-tight">
                  {experience.company}
                </h3>
                <p className="text-muted-foreground inline-flex items-center gap-2 text-sm font-light">
                  {experience.location}
                </p>
              </div>
            </div>

            <ul className="ml-2">
              {experience.roles.map((role, roleIndex) => (
                <RoleItem
                  key={role.title}
                  role={role}
                  isLast={roleIndex === experience.roles.length - 1}
                />
              ))}
            </ul>
          </article>
        </div>
      ))}
    </section>
  );
}
