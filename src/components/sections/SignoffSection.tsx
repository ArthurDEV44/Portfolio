import { siteConfig } from "@/lib/site.config";

export function SignoffSection() {
  return (
    <section className="pt-20" aria-label="Sign-off">
      <p className="select-none border-t border-dashed border-grid-soft px-4 py-6 font-signature text-5xl leading-none text-foreground sm:text-6xl">
        {siteConfig.name}
      </p>
    </section>
  );
}
