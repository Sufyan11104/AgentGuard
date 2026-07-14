"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { primaryNavigation } from "@/lib/navigation";

function NavLink({ href, children }: LinkProps & { readonly children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`focus-ring relative rounded-md px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "text-slate-50"
          : "text-slate-400 hover:bg-slate-800/70 hover:text-slate-200"
      }`}
    >
      {children}
      {isActive && (
        <span
          className="absolute bottom-0 left-1/2 h-0.5 w-3/4 -translate-x-1/2 rounded-full bg-accent"
          style={{ boxShadow: "0 0 6px rgba(56,213,181,0.6)" }}
        />
      )}
    </Link>
  );
}

export function Navigation() {
  return (
    <nav aria-label="Primary navigation" className="flex flex-wrap items-center gap-0.5">
      {primaryNavigation.map((item) => (
        <NavLink href={item.href} key={item.href}>
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
