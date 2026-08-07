import { GridShell } from "@/components";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GridShell>
      <main
        id="main-content"
        tabIndex={-1}
        className="border-y border-dashed border-grid-soft p-4 outline-none"
      >
        <article className="legal-article">{children}</article>
      </main>
    </GridShell>
  );
}
