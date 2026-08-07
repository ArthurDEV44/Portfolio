import { journey } from "@/lib/site.config";

export function JourneySection() {
  return (
    <section id="journey" className="pt-20" aria-labelledby="journey-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-y border-dashed border-grid-soft p-4">
        <h2
          id="journey-heading"
          className="font-serif text-3xl leading-normal text-foreground"
        >
          From apprentice to{" "}
          <span className="italic text-muted-foreground">solo builder</span>.
        </h2>
        <p className="text-sm font-light text-muted-foreground">2021 → 2026</p>
      </div>

      <ol>
        {journey.map((step, index) => (
          <li
            key={step.title}
            className={`border-y border-dashed border-grid-soft p-4 ${
              index === 0 ? "mt-6" : "mt-1"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-sans text-base font-normal tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="inline-flex items-center gap-2 text-sm font-light text-muted-foreground">
                {step.period}
                {step.current && (
                  <span className="text-[color:var(--available)]">Now</span>
                )}
              </p>
            </div>
            <p className="mt-2 font-sans text-sm font-light leading-relaxed tracking-tight text-muted-foreground">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
