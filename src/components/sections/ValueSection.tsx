import { valuePillars } from "@/lib/site.config";

export function ValueSection() {
  return (
    <section id="value" className="pt-20" aria-labelledby="value-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-y border-dashed border-grid-soft p-4">
        <h2
          id="value-heading"
          className="font-serif text-3xl leading-normal text-foreground"
        >
          What I bring,{" "}
          <span className="italic text-muted-foreground">in practice</span>.
        </h2>
        <p className="text-sm font-light text-muted-foreground">04 pillars</p>
      </div>

      <ul>
        {valuePillars.map((pillar, index) => (
          <li
            key={pillar.title}
            className={`border-y border-dashed border-grid-soft p-4 ${
              index === 0 ? "mt-6" : "mt-1"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-sans text-base font-normal tracking-tight text-foreground">
                {pillar.title}
              </h3>
              <p className="text-sm font-light text-muted-foreground">
                {pillar.num}
              </p>
            </div>
            <p className="mt-2 font-sans text-sm font-light leading-relaxed tracking-tight text-muted-foreground">
              {pillar.description}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
