import { GridShell } from "@/components";

/* Articles are the one route that needs a measure and a rail side by side, so
   they take the wide frame. Every other page keeps the default one. */
export default function PostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <GridShell variant="wide">
      <main id="main-content" tabIndex={-1} className="outline-none">
        {children}
      </main>
    </GridShell>
  );
}
