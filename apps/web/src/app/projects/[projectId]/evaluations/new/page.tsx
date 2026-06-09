import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { runDemoEvaluationAction } from "@/lib/actions";
import { getDemoTargetDescription } from "@/lib/demo";
import { loadDbData, prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function NewEvaluationPage({
  params,
  searchParams,
}: {
  readonly params: Promise<{ projectId: string }>;
  readonly searchParams: Promise<{ targetType?: string }>;
}) {
  const { projectId } = await params;
  const { targetType = "mock_safe" } = await searchParams;
  const { data: project, dbReady } = await loadDbData(
    () =>
      prisma.project.findUnique({
        where: { id: projectId },
        include: {
          targets: {
            orderBy: { createdAt: "asc" },
          },
        },
      }),
    null,
  );

  if (!dbReady || project === null) {
    return (
      <AppShell>
        <EmptyState
          description="Seed demo data with pnpm db:seed before running dashboard evaluations."
          title="Project was not found"
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        description="Run all safe synthetic test packs against a local mock target and persist the result."
        eyebrow="New evaluation"
        title={`Run evaluation for ${project.name}`}
      />
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Demo evaluation</CardTitle>
          <CardDescription>
            Demo mode only uses local mock adapters. Tool calls stay dry-run and no external AI
            providers are called.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={runDemoEvaluationAction} className="grid gap-5">
            <input name="projectId" type="hidden" value={project.id} />
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-200">Target type</span>
              <Select defaultValue={targetType} name="targetType">
                <option value="mock_safe">Safe mock target</option>
                <option value="mock_vulnerable">Vulnerable mock target</option>
              </Select>
            </label>
            <div className="grid gap-3 rounded-lg border border-slate-800 bg-slate-950/45 p-4 text-sm leading-6 text-slate-400">
              <p>{getDemoTargetDescription("mock_safe")}</p>
              <p>{getDemoTargetDescription("mock_vulnerable")}</p>
              <p>All Stage 3 test packs are selected by default.</p>
            </div>
            <Button className="w-fit" type="submit">
              Run evaluation
            </Button>
          </form>
        </CardContent>
      </Card>
    </AppShell>
  );
}
