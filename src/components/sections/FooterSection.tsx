import { siteConfig } from "@/lib/site.config";

export function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-y border-dashed border-grid-soft px-4 py-1 text-sm font-light text-muted-foreground">
      © {year} {siteConfig.company} · Built from France
    </footer>
  );
}
