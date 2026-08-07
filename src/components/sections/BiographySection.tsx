const para =
  "mt-6 border-y border-dashed border-grid-soft px-4 text-start font-sans text-base font-light leading-relaxed tracking-tight text-muted-foreground";

export function BiographySection() {
  return (
    <section id="about" className="pt-20" aria-labelledby="about-heading">
      <h2
        id="about-heading"
        className="border-y border-dashed border-grid-soft p-4 font-serif text-3xl leading-normal text-foreground"
      >
        About
      </h2>

      <p className={para}>
        I&apos;m a builder and software engineer based in France. I build tools
        for the people who build software, and the belief behind it is simple:
        the way we ship software has changed a lot in the past few years, and
        our working environment needs to catch up.
      </p>

      <p className={para}>
        I learned the craft as an application developer at{" "}
        <a
          href="https://www.avancial.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="copy-link"
        >
          Avancial
        </a>
        , the IT subsidiary of SNCF Group (France&apos;s national railway),
        working on data, testing, application monitoring, and user support. I
        was the only developer there for two years, and I owned every technical
        decision. I built an internal Gantt system used by several teams, and a
        platform that automated commits, pushes, and deployments to an Azure VM
        running Bonobo Git: basically Vercel, scoped to a locked-down enterprise
        network. I also learned to build for whoever came next: reusable
        back-end and UI components, a consistent design language, a boilerplate
        for spinning up new tools. When I left, I wanted the team to stay
        autonomous and keep a clear direction.
      </p>

      <p className={para}>
        I started working AI into my process with GPT-3, then Copilot, before
        gradually moving to Cursor, Claude Code, Codex, and more agentic
        workflows. I design systems, write specs, orchestrate agents, review,
        make the calls, and iterate from real usage.
      </p>

      <p className={para}>
        Since 2025, I&apos;ve focused my work on an ecosystem for developers in
        the age of agents. I think low-level languages are where a big part of
        software needs to go: control, performance, and shipping a single binary
        with no runtime to drag around. The web is maintained by the biggest
        tech companies in the world. Local and native, much less so. That&apos;s
        where I want to work.
      </p>
    </section>
  );
}
