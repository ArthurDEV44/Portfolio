import { ArrowUpRight } from "lucide-react";

import { clients } from "@/lib/site.config";

export function ClientsSection() {
  return (
    <section id="clients" className="pt-20" aria-labelledby="clients-heading">
      <div className="border-grid-soft flex flex-wrap items-baseline justify-between gap-3 border-y border-dashed p-4">
        <h2
          id="clients-heading"
          className="text-foreground font-serif text-3xl leading-normal"
        >
          Client <span className="text-muted-foreground italic">work</span>.
        </h2>
        <p className="text-muted-foreground text-sm font-light">
          {String(clients.length).padStart(2, "0")} sites
        </p>
      </div>

      <ul>
        {clients.map((client, index) => {
          const content = (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-foreground inline-flex items-center gap-1.5 font-sans text-base font-normal tracking-tight">
                  {client.title}
                  {client.url && (
                    <ArrowUpRight
                      aria-hidden="true"
                      size={13}
                      strokeWidth={1.7}
                      className="text-[color:var(--brand)] opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  )}
                </h3>
                <p className="text-muted-foreground text-sm font-light">
                  {client.year}
                </p>
              </div>

              <p className="text-muted-foreground mt-2 font-sans text-sm leading-relaxed font-light tracking-tight">
                {client.description}
              </p>
            </>
          );

          return (
            <li
              key={client.title}
              className={`border-grid-soft border-y border-dashed ${
                index === 0 ? "mt-6" : "mt-1"
              }`}
            >
              {client.url ? (
                <a
                  href={client.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-4"
                >
                  {content}
                </a>
              ) : (
                <div className="p-4">{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
