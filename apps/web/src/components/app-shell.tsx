import Link from "next/link";
import type { ReactNode } from "react";
import { Navigation } from "./navigation";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function AppShell({ children }: { readonly children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3.5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <Link className="focus-ring flex items-center gap-3 rounded-md" href="/">
            <span
              className="grid h-9 w-9 place-items-center rounded-lg border border-accent/40 bg-accent/10 text-sm font-black text-accent transition-all hover:border-accent/60 hover:bg-accent/15"
              style={{ textShadow: "0 0 12px rgba(56,213,181,0.5)" }}
            >
              AG
            </span>
            <span>
              <span className="block text-sm font-bold tracking-wide text-slate-200">
                AgentGuard
              </span>
              <span className="block text-[11px] text-slate-500">Defensive AI evaluation</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Navigation />
            <a
              href="https://github.com/Sufyan11104/agentguard"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring ml-2 inline-flex h-8 w-8 items-center justify-center rounded-md border border-slate-700 bg-slate-900/60 text-slate-400 transition-all hover:border-slate-500 hover:bg-slate-800 hover:text-slate-200"
              aria-label="View source on GitHub"
            >
              <GitHubIcon />
            </a>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
