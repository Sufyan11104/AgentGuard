import Link from "next/link";
import type { ReactNode } from "react";
import { Navigation } from "./navigation";

export function AppShell({ children }: { readonly children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link className="focus-ring flex items-center gap-3 rounded-md" href="/dashboard">
            <span className="grid h-9 w-9 place-items-center rounded-md border border-accent/50 bg-accent/10 text-sm font-black text-accent">
              AG
            </span>
            <span>
              <span className="block text-sm font-semibold uppercase tracking-wide text-slate-400">
                AgentGuard
              </span>
              <span className="block text-xs text-slate-500">Defensive AI evaluation</span>
            </span>
          </Link>
          <Navigation />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
