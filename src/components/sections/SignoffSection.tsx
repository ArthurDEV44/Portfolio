import { siteConfig } from "@/lib/site.config";

export function SignoffSection() {
  return (
    <section className="pt-20" aria-label="Sign-off">
      <p className="border-grid-soft font-signature text-foreground border-t border-dashed px-4 py-6 text-5xl leading-none select-none sm:text-6xl">
        {siteConfig.name}
      </p>
    </section>
  );
}
