"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* ── Feature cards data ─────────────────────────── */
const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    title: "Prompt Injection Tests",
    description: "Exercise trusted-context boundaries with safe synthetic override attempts across 7 attack categories.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
      </svg>
    ),
    title: "Fake Canary Detection",
    description: "Detect whether synthetic canary tokens appear in model or agent responses — zero false negatives.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Unsafe Tool Calls",
    description: "Inspect dry-run tool call evidence for approval gaps, missing metadata, and risky autonomous actions.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    title: "Hallucinated Actions",
    description: "Flag claims that actions were completed without verifiable execution evidence or approval records.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    title: "Reports & Audit Trail",
    description: "JSON, Markdown, and HTML report generation with persisted findings, scores, and remediation guidance.",
  },
] as const;

/* ── Stats ──────────────────────────────────────── */
const stats = [
  { value: "22", label: "Test cases" },
  { value: "7", label: "Attack categories" },
  { value: "3", label: "Report formats" },
  { value: "100", label: "Safe mock score" },
] as const;

/* ── Terminal lines ─────────────────────────────── */
const TERMINAL_LINES = [
  { text: "$ agentguard init --force", type: "cmd" },
  { text: "Created agentguard.config.yaml", type: "ok" },
  { text: "$ agentguard run", type: "cmd" },
  { text: "Running 22 test cases against mock_safe...", type: "info" },
  { text: "  ✓  PI-001  Prompt injection resistance            passed", type: "pass" },
  { text: "  ✓  CS-001  Fake canary leakage detection          passed", type: "pass" },
  { text: "  ✓  TC-001  Unsafe dry-run tool call               passed", type: "pass" },
  { text: "  ✓  EA-001  Excessive autonomy check               passed", type: "pass" },
  { text: "  ✓  HA-001  Hallucinated action detection          passed", type: "pass" },
  { text: "  ✓  UO-001  Unsafe output handling                 passed", type: "pass" },
  { text: "", type: "spacer" },
  { text: "Score:        100/100", type: "score" },
  { text: "Passed:       22   Failed: 0   Needs review: 0", type: "score" },
  { text: "Artifacts written to .agentguard/", type: "ok" },
] as const;

/* ── Animated findings ticker ─────────────────── */
const FINDINGS = [
  { name: "Prompt injection", detail: "System override attempt blocked", badge: "passed", badgeClass: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" },
  { name: "Fake canary leakage", detail: "Synthetic canary token echoed", badge: "critical", badgeClass: "border-red-400/50 bg-red-400/10 text-red-200" },
  { name: "Dry-run tool call", detail: "Approval metadata missing", badge: "high", badgeClass: "border-orange-400/40 bg-orange-400/10 text-orange-200" },
  { name: "Hallucinated action", detail: "Claimed action completed", badge: "medium", badgeClass: "border-amber-400/40 bg-amber-400/10 text-amber-200" },
  { name: "System instruction", detail: "Instruction boundary respected", badge: "passed", badgeClass: "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" },
] as const;

/* ── Terminal component ─────────────────────────── */
function AnimatedTerminal() {
  const [lines, setLines] = useState<number>(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (lines >= TERMINAL_LINES.length) {
      setDone(true);
      return;
    }
    const delay = TERMINAL_LINES[lines]?.type === "cmd" ? 600 : 140;
    const t = setTimeout(() => setLines((l) => l + 1), delay);
    return () => clearTimeout(t);
  }, [lines]);

  const lineClass: Record<string, string> = {
    cmd:    "text-accent font-semibold",
    ok:     "text-emerald-300",
    info:   "text-slate-400",
    pass:   "text-emerald-400",
    score:  "text-slate-50 font-semibold",
    spacer: "h-3",
  };

  return (
    <div className="w-full rounded-xl border border-slate-700/60 bg-slate-950/80 shadow-2xl shadow-black/50 overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-slate-800 bg-slate-900/60 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-red-400/70" />
        <span className="h-3 w-3 rounded-full bg-amber-400/70" />
        <span className="h-3 w-3 rounded-full bg-emerald-400/70" />
        <span className="ml-3 text-xs text-slate-500 font-mono">agentguard — zsh</span>
      </div>
      {/* Output */}
      <div className="p-5 font-mono text-xs leading-6 min-h-[22rem] overflow-hidden">
        {TERMINAL_LINES.slice(0, lines).map((line, i) => (
          <div
            key={i}
            className={`animate-fade-slide-up ${lineClass[line.type] ?? "text-slate-300"}`}
            style={{ animationDuration: "0.25s" }}
          >
            {line.type === "spacer" ? <>&nbsp;</> : line.text}
          </div>
        ))}
        {!done && <span className="cursor-blink" />}
      </div>
    </div>
  );
}

/* ── Findings ticker ────────────────────────────── */
function FindingsTicker() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setVisible((v) => (v + 1) % FINDINGS.length);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="grid gap-2.5">
      {FINDINGS.map((finding, i) => (
        <div
          key={finding.name}
          className={`grid gap-2 rounded-lg border bg-slate-900/50 p-3.5 sm:grid-cols-[1fr_auto] transition-all duration-500 ${
            i === visible
              ? "border-accent/30 shadow-sm shadow-accent/10 opacity-100"
              : "border-slate-800 opacity-60"
          }`}
        >
          <div>
            <p className="text-sm font-semibold text-slate-100">{finding.name}</p>
            <p className="mt-0.5 text-xs text-slate-400">{finding.detail}</p>
          </div>
          <span className={`self-start rounded-full border px-2.5 py-0.5 text-xs font-semibold ${finding.badgeClass}`}>
            {finding.badge}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── Main page ──────────────────────────────────── */
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* ── Hero ───────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative mx-auto grid min-h-[92vh] max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_1fr] lg:items-center lg:px-8"
      >
        {/* Left column */}
        <div className="flex flex-col justify-center">
          <div
            className="mb-5 inline-flex w-fit animate-fade-slide-up rounded-full border border-accent/35 bg-accent/8 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent"
            style={{ animationDelay: "0ms" }}
          >
            Defensive evaluation for AI agents
          </div>

          <h1
            className="animate-fade-slide-up max-w-xl text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl"
            style={{ animationDelay: "80ms" }}
          >
            <span className="animate-shimmer">AgentGuard</span>
          </h1>

          <p
            className="animate-fade-slide-up mt-5 max-w-lg text-base leading-8 text-slate-300 sm:text-lg"
            style={{ animationDelay: "160ms" }}
          >
            A CLI-first and dashboard-backed toolkit for testing AI agents against common
            defensive failure modes — synthetic prompts, mock targets, dry-run tools, and
            persisted evidence.
          </p>

          <div
            className="animate-fade-slide-up mt-8 flex flex-wrap gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <Link
              href="/dashboard"
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-lg border border-accent/60 bg-accent px-5 py-2.5 text-sm font-bold text-slate-950 shadow-lg shadow-accent/20 transition-all hover:scale-[1.03] hover:shadow-accent/35 active:scale-[0.98]"
            >
              Open dashboard →
            </Link>
            <Link
              href="/docs"
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-600 bg-slate-900/80 px-5 py-2.5 text-sm font-semibold text-slate-100 transition-all hover:border-slate-500 hover:bg-slate-800"
            >
              Read docs
            </Link>
          </div>

          {/* Stats row */}
          <div
            className="animate-fade-slide-up mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4"
            style={{ animationDelay: "320ms" }}
          >
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="rounded-lg border border-slate-800 bg-slate-950/50 p-3 text-center"
              >
                <div className="text-2xl font-black text-accent">{value}</div>
                <div className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</div>
              </div>
            ))}
          </div>

          <p
            className="animate-fade-slide-up mt-6 max-w-lg rounded-lg border border-slate-800/80 bg-slate-950/40 px-4 py-3 text-xs leading-6 text-slate-500"
            style={{ animationDelay: "400ms" }}
          >
            <span className="font-semibold text-slate-400">Ethical use:</span> only test AI
            applications you own or have permission to evaluate. Demo mode uses synthetic payloads,
            fake canaries, mocked adapters, and dry-run tool calls.
          </p>
        </div>

        {/* Right column — tabbed preview */}
        <div className="animate-fade-slide-up flex flex-col gap-4" style={{ animationDelay: "200ms" }}>
          <RightPreview />
        </div>
      </section>

      {/* ── Features ───────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">Capabilities</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-50">What AgentGuard tests</h2>
        </div>
        <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="animate-fade-slide-up group relative overflow-hidden rounded-xl border border-slate-700/60 bg-slate-950/50 p-5 transition-all duration-300 hover:border-accent/30 hover:shadow-lg hover:shadow-accent/8"
            >
              {/* Hover glow accent */}
              <div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(56,213,181,0.06), transparent 60%)" }}
              />
              <div className="relative">
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-accent/25 bg-accent/8 text-accent">
                  {feature.icon}
                </div>
                <h3 className="text-sm font-semibold text-slate-50">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Architecture highlight ──────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-b from-slate-900/60 to-slate-950/40 p-8 lg:p-12">
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-accent">Architecture</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-50">Built as a real monorepo</h2>
              <p className="mt-4 text-base leading-8 text-slate-400">
                AgentGuard is a production-grade TypeScript monorepo managed by Turborepo and pnpm
                workspaces. The web dashboard and CLI share the same core packages — evaluation
                logic is never duplicated.
              </p>
              <ul className="mt-6 grid gap-2.5">
                {[
                  ["@agentguard/core", "Schemas, runner, scoring, reports"],
                  ["@agentguard/adapters", "Mock, HTTP, OpenAI-compatible"],
                  ["@agentguard/test-packs", "Safe synthetic defensive cases"],
                  ["@agentguard/db", "Prisma client + persistence helpers"],
                ].map(([name, desc]) => (
                  <li key={name} className="flex items-start gap-3 text-sm">
                    <span className="mt-0.5 shrink-0 rounded border border-accent/25 bg-accent/8 px-1.5 py-0.5 font-mono text-[11px] text-accent">{name}</span>
                    <span className="text-slate-400">{desc}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "apps/cli", sub: "Commander CLI", icon: ">" },
                { label: "apps/web", sub: "Next.js dashboard", icon: "◈" },
                { label: "packages/core", sub: "Runner & scoring", icon: "⬡" },
                { label: "prisma/", sub: "PostgreSQL schema", icon: "⛁" },
              ].map(({ label, sub, icon }) => (
                <div
                  key={label}
                  className="rounded-xl border border-slate-700/50 bg-slate-900/60 p-4 transition-all hover:border-accent/20 hover:bg-slate-900/80"
                >
                  <div className="mb-2 text-lg font-bold text-accent">{icon}</div>
                  <div className="font-mono text-xs font-semibold text-slate-200">{label}</div>
                  <div className="mt-0.5 text-xs text-slate-500">{sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="animate-pulse-glow relative overflow-hidden rounded-2xl border border-accent/20 bg-gradient-to-b from-accent/8 to-transparent p-12 text-center">
          <h2 className="text-3xl font-bold text-slate-50 sm:text-4xl">Ready to evaluate?</h2>
          <p className="mx-auto mt-4 max-w-md text-slate-400">
            No API key required. Run a safe evaluation in under a minute with a single CLI command.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/dashboard"
              className="focus-ring inline-flex min-h-11 items-center justify-center rounded-lg border border-accent/60 bg-accent px-6 py-2.5 text-sm font-bold text-slate-950 transition-all hover:scale-[1.03] hover:shadow-lg hover:shadow-accent/25"
            >
              Open dashboard
            </Link>
            <code className="inline-flex min-h-11 items-center rounded-lg border border-slate-700 bg-slate-950 px-5 text-sm font-mono text-accent">
              pnpm --filter @agentguard/cli exec agentguard run
            </code>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ── Right preview — tabs between terminal & findings ── */
function RightPreview() {
  const [tab, setTab] = useState<"terminal" | "findings">("terminal");

  return (
    <div>
      {/* Tab switcher */}
      <div className="mb-3 flex gap-1 rounded-lg border border-slate-800 bg-slate-950/50 p-1 w-fit">
        {(["terminal", "findings"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all ${
              tab === t
                ? "bg-slate-800 text-slate-50 shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {t === "terminal" ? "CLI output" : "Live findings"}
          </button>
        ))}
      </div>

      {tab === "terminal" ? (
        <AnimatedTerminal />
      ) : (
        <div className="w-full rounded-xl border border-slate-700/60 bg-slate-950/80 shadow-2xl shadow-black/50 overflow-hidden">
          <div className="border-b border-slate-800 bg-slate-900/60 px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Live evaluation preview</p>
            <h2 className="mt-1 text-base font-semibold text-slate-50">Mock vulnerable target · 4 findings</h2>
          </div>
          <div className="p-4">
            <FindingsTicker />
          </div>
        </div>
      )}
    </div>
  );
}
