import Link from "next/link";
import type { ReactNode } from "react";

export function Brand() {
  return (
    <Link href="/" className="brand">
      <span className="brand-mark" aria-hidden />
      MailTrack
    </Link>
  );
}

export function SiteNav({
  links,
  end,
}: {
  links?: { href: string; label: string }[];
  end?: ReactNode;
}) {
  const items = links ?? [
    { href: "/dashboard", label: "Activity" },
    { href: "/install", label: "Install" },
    { href: "/privacy", label: "Privacy" },
  ];

  return (
    <nav className="nav" aria-label="Primary">
      <Brand />
      {items.map((l) => (
        <Link key={l.href} href={l.href}>
          {l.label}
        </Link>
      ))}
      {end ? <div className="nav-actions">{end}</div> : null}
    </nav>
  );
}
