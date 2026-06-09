import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { FindingsTable } from "@/components/findings-table";
import { PageHeader } from "@/components/page-header";
import { RunsTable } from "@/components/runs-table";
import { TargetCard } from "@/components/target-card";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { loadDbData, prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  readonly params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const { data, dbReady } = await loadDbData(
    async () => {
      const [project, findings] = await Promise.all([
        prisma.project.findUnique({
          where: { id: projectId },
          include: {
            owner: true,
            targets: {
              orderBy: { createdAt: "asc" },
              include: {
                evaluationRuns: {
                  orderBy: { startedAt: "desc" },
                  take: 1,
                },
              },
            },
            evaluationRuns: {
              orderBy: { startedAt: "desc" },
              take: 10,
              include: { target: true },
            },
          },
        }),
        prisma.finding.findMany({
          where: {
            run: {
              projectId,
            },
            status: {
              in: ["open", "needs_review"],
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),
      ]);

      return { project, findings };
    },
    { project: null, findings: [] },
  );

  if (!dbReady || data.project === null) {
    return (
      <AppShell>
        <EmptyState
          description="Seed demo data with pnpm db:seed, then return to this project."
          title="Project was not found"
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        actions={
          <ButtonLink href={`/projects/${data.project.id}/evaluations/new`}>
            New evaluation
          </ButtonLink>
        }
        description={data.project.description ?? "Synthetic local AgentGuard project."}
        eyebrow="Project"
        title={data.project.name}
      />
      <div className="grid gap-6">
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Owner</p>
              <p className="mt-3 text-lg font-semibold text-slate-50">
                {data.project.owner.name ?? data.project.owner.email}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Targets
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-50">
                {data.project.targets.length}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Recent runs
              </p>
              <p className="mt-3 text-lg font-semibold text-slate-50">
                {data.project.evaluationRuns.length}
              </p>
            </CardContent>
          </Card>
        </div>

        <section>
          <h2 className="mb-3 text-lg font-semibold text-slate-50">Targets</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {data.project.targets.map((target) => (
              <TargetCard key={target.id} target={target} />
            ))}
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle>Recent evaluation runs</CardTitle>
          </CardHeader>
          <CardContent>
            <RunsTable runs={data.project.evaluationRuns} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Findings summary</CardTitle>
          </CardHeader>
          <CardContent>
            <FindingsTable findings={data.findings} />
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
