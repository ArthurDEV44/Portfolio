import { ArrowUpRight } from "lucide-react";

import { projects } from "@/lib/site.config";

export function ProjectsSection() {
  return (
    <section id="projects" className="pt-20" aria-labelledby="projects-heading">
      <h2
        id="projects-heading"
        className="border-grid-soft text-foreground border-y border-dashed p-4 font-serif text-3xl leading-normal"
      >
        Things I&apos;ve built
      </h2>

      <ul>
        {projects.map((project, index) => {
          const content = (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-foreground inline-flex items-center gap-1.5 font-sans text-base font-normal tracking-tight">
                  {project.rainbow ? (
                    <span className="rainbow-text">{project.title}</span>
                  ) : (
                    project.title
                  )}
                  {project.url && (
                    <ArrowUpRight
                      aria-hidden="true"
                      size={13}
                      strokeWidth={1.7}
                      className="text-[color:var(--brand)] opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  )}
                </h3>
                <p className="text-muted-foreground text-sm font-light">
                  {project.meta}
                </p>
              </div>

              <p className="text-muted-foreground mt-2 font-sans text-sm leading-relaxed font-light tracking-tight">
                {project.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-muted-foreground inline-flex items-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface-elevated)]/50 px-2.5 py-1 text-xs font-light"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </>
          );

          return (
            <li
              key={project.title}
              className={`border-grid-soft border-y border-dashed ${
                index === 0 ? "mt-6" : "mt-1"
              }`}
            >
              {project.url ? (
                <a
                  href={project.url}
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
