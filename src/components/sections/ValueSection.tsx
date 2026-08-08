import { valuePillars } from "@/lib/site.config";

export function ValueSection() {
  return (
    <section id="value" className="pt-20" aria-labelledby="value-heading">
      <div className="border-grid-soft flex flex-wrap items-baseline justify-between gap-3 border-y border-dashed p-4">
        <h2
          id="value-heading"
          className="text-foreground font-serif text-3xl leading-normal"
        >
          What I bring,{" "}
          <span className="text-muted-foreground italic">in practice</span>.
        </h2>
        <p className="text-muted-foreground text-sm font-light">04 pillars</p>
      </div>

      <ul>
        {valuePillars.map((pillar, index) => (
          <li
            key={pillar.title}
            className={`border-grid-soft border-y border-dashed p-4 ${
              index === 0 ? "mt-6" : "mt-1"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-foreground font-sans text-base font-normal tracking-tight">
                {pillar.title}
              </h3>
              <p className="text-muted-foreground text-sm font-light">
                {pillar.num}
              </p>
            </div>
            <p className="text-muted-foreground mt-2 font-sans text-sm leading-relaxed font-light tracking-tight">
              {pillar.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
