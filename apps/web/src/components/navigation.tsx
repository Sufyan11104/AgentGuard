import Link from "next/link";
import { primaryNavigation } from "@/lib/navigation";

export function Navigation() {
  return (
    <nav aria-label="Primary navigation" className="flex flex-wrap items-center gap-1">
      {primaryNavigation.map((item) => (
        <Link
          className="focus-ring rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800/80 hover:text-slate-50"
          href={item.href}
          key={item.href}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
