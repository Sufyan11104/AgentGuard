import { AppShell } from "@/components/app-shell";
import { DemoRunPanel } from "@/components/demo-run-panel";
import { EmptyState } from "@/components/empty-state";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { RunsTable } from "@/components/runs-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatScore } from "@/lib/format";
import { loadDbData, prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const { data, dbReady } = await loadDbData(
    async () => {
      const [projects, totalRuns, openFindings, recentRuns, latestSafeRun, latestVulnerableRun] =
        await Promise.all([
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
        ]);

      return {
        projects,
        totalRuns,
        openFindings,
        recentRuns,
        latestSafeRun,
        latestVulnerableRun,
      };
    },
    {
      projects: [],
      totalRuns: 0,
      openFindings: 0,
      recentRuns: [],
      latestSafeRun: null,
      latestVulnerableRun: null,
    },
  );

  const defaultProject = data.projects[0];

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
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <MetricCard label="Projects" value={data.projects.length} />
            <MetricCard label="Evaluation runs" value={data.totalRuns} />
            <MetricCard label="Latest safe score" value={formatScore(data.latestSafeRun?.score)} />
            <MetricCard
              label="Latest vulnerable score"
              value={formatScore(data.latestVulnerableRun?.score)}
            />
            <MetricCard label="Open findings" value={data.openFindings} />
          </div>
          <DemoRunPanel projectId={defaultProject?.id} />
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
