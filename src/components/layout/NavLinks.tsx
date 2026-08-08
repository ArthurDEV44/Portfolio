"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItem {
  href: string;
  label: string;
}

/* Anchor entries all resolve to the homepage, so marking them current would
   flag three links at once: only plain routes can be the current page. */
function isCurrentPage(href: string, pathname: string): boolean {
  if (href.includes("#")) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({
  items,
  className,
}: {
  items: readonly NavItem[];
  className?: string;
}) {
  const pathname = usePathname();

  return (
    <>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={isCurrentPage(item.href, pathname) ? "page" : undefined}
          className={className}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}
