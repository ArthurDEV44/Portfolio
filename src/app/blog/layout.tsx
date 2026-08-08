import { GridShell } from "@/components";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GridShell>
      <main id="main-content" tabIndex={-1} className="outline-none">
        {children}
      </main>
    </GridShell>
  );
}
