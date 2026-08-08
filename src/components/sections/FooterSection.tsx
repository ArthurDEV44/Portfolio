import { siteConfig } from "@/lib/site.config";

export function FooterSection() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-grid-soft text-muted-foreground border-y border-dashed px-4 py-1 text-sm font-light">
      © {year} {siteConfig.company} · Built from France
    </footer>
  );
}
