import { AppShell } from "@/components/app-shell";
import { DemoRunPanel } from "@/components/demo-run-panel";
import { EmptyState } from "@/components/empty-state";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { RunsTable } from "@/components/runs-table";
import { ScoreRing } from "@/components/score-ring";
import { SeverityChart } from "@/components/severity-chart";
import { Sparkline } from "@/components/sparkline";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatScore } from "@/lib/format";
import { loadDbData, prisma } from "@/lib/db";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Security evaluation dashboard for AI agents — track runs, findings, and scores.",
};

export default async function DashboardPage() {
  const { data, dbReady } = await loadDbData(
    async () => {
      const [
        projects,
        totalRuns,
        openFindings,
        recentRuns,
        latestSafeRun,
        latestVulnerableRun,
        severityCounts,
        scoreHistory,
      ] = await Promise.all([
        prisma.project.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
        prisma.evaluationRun.count(),
        prisma.finding.count({ where: { status: { in: ["open", "needs_review"] } } }),
        prisma.evaluationRun.findMany({
          orderBy: { startedAt: "desc" },
          take: 8,
          include: { target: true },
        }),
        prisma.evaluationRun.findFirst({
          where: { target: { type: "mock_safe" } },
          orderBy: { startedAt: "desc" },
        }),
        prisma.evaluationRun.findFirst({
          where: { target: { type: "mock_vulnerable" } },
          orderBy: { startedAt: "desc" },
        }),
        // Severity breakdown of open findings
        prisma.finding.groupBy({
          by: ["severity"],
          where: { status: { in: ["open", "needs_review"] } },
          _count: { _all: true },
        }),
        // Score trend — last 8 safe runs
        prisma.evaluationRun.findMany({
          where: { target: { type: "mock_safe" } },
          orderBy: { startedAt: "asc" },
          take: 8,
          select: { score: true },
        }),
      ]);

      const severityMap: Record<string, number> = {};
      for (const row of severityCounts) {
        severityMap[row.severity] = row._count._all;
      }

      return {
        projects,
        totalRuns,
        openFindings,
        recentRuns,
        latestSafeRun,
        latestVulnerableRun,
        severityCounts: {
          critical: severityMap["critical"] ?? 0,
          high:     severityMap["high"]     ?? 0,
          medium:   severityMap["medium"]   ?? 0,
          low:      severityMap["low"]      ?? 0,
        },
        scoreHistory: scoreHistory.map((r) => r.score),
      };
    },
    {
      projects:            [],
      totalRuns:           0,
      openFindings:        0,
      recentRuns:          [],
      latestSafeRun:       null,
      latestVulnerableRun: null,
      severityCounts:      { critical: 0, high: 0, medium: 0, low: 0 },
      scoreHistory:        [],
    },
  );

  const defaultProject = data.projects[0];
  const safeScore = data.latestSafeRun?.score ?? null;
  const vulnScore  = data.latestVulnerableRun?.score ?? null;

  return (
    <AppShell>
      <PageHeader
        description="Track synthetic AI-agent security evaluations, recent runs, findings, and demo target health."
        eyebrow="Overview"
        title="Security evaluation dashboard"
      />

      {!dbReady ? (
        <EmptyState
          description="Seed demo data with pnpm db:seed after starting PostgreSQL."
          title="Database is not ready"
        />
      ) : data.projects.length === 0 ? (
        <EmptyState
          description="Seed demo data with pnpm db:seed to create the local demo project, mock targets, evaluation runs, findings, and reports."
          title="No demo project data found"
        />
      ) : (
        <div className="grid gap-6">
          {/* ── Metric strip ── */}
          <div className="stagger-children grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <MetricCard
              label="Projects"
              value={data.projects.length}
              detail="Active demo projects"
            />
            <MetricCard
              label="Evaluation runs"
              value={data.totalRuns}
              detail="Total runs recorded"
            />
            <MetricCard
              label="Safe score"
              value={formatScore(safeScore)}
              variant="success"
              trend="up"
              detail="Latest mock_safe run"
            />
            <MetricCard
              label="Vulnerable score"
              value={formatScore(vulnScore)}
              variant={vulnScore !== null && vulnScore < 50 ? "danger" : "warning"}
              trend="down"
              detail="Latest mock_vulnerable run"
            />
            <MetricCard
              label="Open findings"
              value={data.openFindings}
              variant={data.openFindings > 0 ? "danger" : "success"}
              detail="Needs attention"
            />
          </div>

          {/* ── Score comparison + sparkline + severity chart ── */}
          <div className="grid gap-4 lg:grid-cols-3">
            {/* Score comparison */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Score comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center gap-6 sm:flex-row lg:flex-col">
                  <div className="flex gap-6">
                    <ScoreRing score={safeScore} size="large" label="Safe mock" />
                    <ScoreRing score={vulnScore} size="large" label="Vulnerable mock" />
                  </div>
                  <div className="w-full">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                      What this shows
                    </p>
                    <p className="text-xs leading-5 text-slate-400">
                      The safe mock scores <span className="font-semibold text-emerald-300">100/100</span> against
                      all 22 synthetic test cases. The vulnerable mock intentionally fails, demonstrating
                      how AgentGuard surfaces real findings with evidence and remediation guidance.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sparkline — safe score trend */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Score trend (safe)</CardTitle>
              </CardHeader>
              <CardContent>
                {data.scoreHistory.length >= 2 ? (
                  <Sparkline values={data.scoreHistory} label="Safe mock over time" />
                ) : (
                  <p className="text-xs text-slate-500">
                    Run more evaluations to see the trend sparkline.
                  </p>
                )}
                <p className="mt-4 text-xs leading-5 text-slate-400">
                  Score over the last {data.scoreHistory.length} safe mock evaluation runs.
                  A stable score of 100 demonstrates deterministic pass behaviour.
                </p>
              </CardContent>
            </Card>

            {/* Severity breakdown */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Open findings by severity</CardTitle>
              </CardHeader>
              <CardContent>
                <SeverityChart counts={data.severityCounts} />
                <p className="mt-4 text-xs leading-5 text-slate-400">
                  Breakdown of all open and needs-review findings across active evaluation runs.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* ── Demo run panel ── */}
          <DemoRunPanel projectId={defaultProject?.id} />

          {/* ── Recent runs table ── */}
          <Card>
            <CardHeader>
              <CardTitle>Recent evaluation runs</CardTitle>
            </CardHeader>
            <CardContent>
              <RunsTable runs={data.recentRuns} />
            </CardContent>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
