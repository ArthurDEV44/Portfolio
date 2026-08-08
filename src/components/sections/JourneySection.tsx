import { journey } from "@/lib/site.config";

export function JourneySection() {
  return (
    <section id="journey" className="pt-20" aria-labelledby="journey-heading">
      <div className="border-grid-soft flex flex-wrap items-baseline justify-between gap-3 border-y border-dashed p-4">
        <h2
          id="journey-heading"
          className="text-foreground font-serif text-3xl leading-normal"
        >
          From apprentice to{" "}
          <span className="text-muted-foreground italic">solo builder</span>.
        </h2>
        <p className="text-muted-foreground text-sm font-light">2021 → 2026</p>
      </div>

      <ol>
        {journey.map((step, index) => (
          <li
            key={step.title}
            className={`border-grid-soft border-y border-dashed p-4 ${
              index === 0 ? "mt-6" : "mt-1"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-foreground font-sans text-base font-normal tracking-tight">
                {step.title}
              </h3>
              <p className="text-muted-foreground inline-flex items-center gap-2 text-sm font-light">
                {step.period}
                {step.current && (
                  <span className="text-[color:var(--available)]">Now</span>
                )}
              </p>
            </div>
            <p className="text-muted-foreground mt-2 font-sans text-sm leading-relaxed font-light tracking-tight">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
