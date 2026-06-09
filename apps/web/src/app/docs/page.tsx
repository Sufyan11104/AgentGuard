import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const sections = [
  {
    title: "What AgentGuard is",
    body: "AgentGuard is a defensive security and evaluation toolkit for AI agents and LLM applications. It runs synthetic test packs against owned or approved targets and records pass, review, and open finding evidence.",
  },
  {
    title: "Safety boundaries",
    body: "Built-in demo evaluations use fake canaries, mocked targets, and dry-run tool calls. Do not use AgentGuard for credential theft, malware, phishing, bypassing live systems, or attacking third-party services.",
  },
  {
    title: "How scoring works",
    body: "Each test result is scored from deterministic assertions, canary leakage checks, and dry-run tool policy validation. Run summaries aggregate pass, failure, review, severity, and overall score fields.",
  },
  {
    title: "CLI workflow",
    body: "Run pnpm --filter @agentguard/cli exec agentguard init --force, then list packs, validate config, run evaluations, and generate reports. The CLI remains independent from the web app and database.",
  },
  {
    title: "Database seed",
    body: "Start PostgreSQL with pnpm db:up, push the Prisma schema with pnpm db:push, then load deterministic synthetic demo data with pnpm db:seed.",
  },
  {
    title: "Demo mode",
    body: "Dashboard demo runs only call mock_safe and mock_vulnerable adapters. They run all safe synthetic test packs and persist results through @agentguard/db.",
  },
] as const;

export default function DocsPage() {
  return (
    <AppShell>
      <PageHeader
        description="Operational notes for defensive use, scoring, CLI setup, database seed, and local demo mode."
        eyebrow="Documentation"
        title="AgentGuard docs"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-slate-300">{section.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
