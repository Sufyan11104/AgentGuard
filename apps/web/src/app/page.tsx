import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Prompt injection tests",
    description: "Exercise trusted-context boundaries with safe synthetic override attempts.",
  },
  {
    title: "Fake canary leakage",
    description: "Detect whether demo canary tokens appear in model or agent responses.",
  },
  {
    title: "Unsafe tool-call checks",
    description: "Inspect dry-run tool call evidence for approval gaps and risky actions.",
  },
  {
    title: "Hallucinated action detection",
    description: "Flag claims that actions were completed without verifiable execution evidence.",
  },
  {
    title: "Reports and audit trail",
    description: "Persist findings, reports, and run summaries for review and remediation.",
  },
] as const;

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto grid min-h-[86vh] max-w-7xl gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
        <div className="flex flex-col justify-center">
          <div className="mb-6 inline-flex w-fit rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
            Defensive evaluation for AI agents
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-normal text-slate-50 sm:text-6xl">
            AgentGuard
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            A CLI-first and dashboard-backed toolkit for testing AI agents against common defensive
            failure modes using synthetic prompts, mock targets, dry-run tools, and persisted
            evidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/dashboard">Open dashboard</ButtonLink>
            <ButtonLink href="/docs" variant="secondary">
              Read docs
            </ButtonLink>
          </div>
          <p className="mt-8 max-w-2xl rounded-lg border border-slate-800 bg-slate-950/50 p-4 text-sm leading-6 text-slate-400">
            Ethical-use boundary: only test AI applications you own or have permission to evaluate.
            Demo mode uses synthetic payloads, fake canaries, mocked adapters, and dry-run tool
            calls.
          </p>
        </div>

        <div className="flex items-center">
          <div className="w-full rounded-xl border border-slate-700 bg-slate-950/70 p-5 shadow-2xl shadow-black/30">
            <div className="mb-5 flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Live evaluation preview
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-50">Mock vulnerable target</h2>
              </div>
              <span className="rounded-full border border-red-400/40 bg-red-400/10 px-3 py-1 text-xs font-semibold text-red-200">
                Open findings
              </span>
            </div>
            <div className="grid gap-3">
              {[
                ["Prompt injection", "blocked system override", "passed"],
                ["Fake canary leakage", "synthetic canary echoed", "critical"],
                ["Dry-run tool call", "approval metadata missing", "high"],
                ["Hallucinated action", "claimed action completed", "medium"],
              ].map(([name, detail, status]) => (
                <div
                  className="grid gap-2 rounded-lg border border-slate-800 bg-slate-900/45 p-4 sm:grid-cols-[1fr_auto]"
                  key={name}
                >
                  <div>
                    <p className="font-semibold text-slate-100">{name}</p>
                    <p className="mt-1 text-sm text-slate-400">{detail}</p>
                  </div>
                  <span className="self-start rounded-full border border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-300">
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardContent>
                <h2 className="text-base font-semibold text-slate-50">{feature.title}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
