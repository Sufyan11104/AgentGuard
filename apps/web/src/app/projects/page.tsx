import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import { loadDbData, prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const { data: projects, dbReady } = await loadDbData(
    () =>
      prisma.project.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          owner: true,
          targets: true,
          evaluationRuns: {
            orderBy: { startedAt: "desc" },
            take: 3,
          },
        },
      }),
    [],
  );

  return (
    <AppShell>
      <PageHeader
        actions={<ButtonLink href="/dashboard">Run demo evaluation</ButtonLink>}
        description="Local demo projects and targets backed by PostgreSQL persistence."
        eyebrow="Projects"
        title="Projects"
      />
      {!dbReady || projects.length === 0 ? (
        <EmptyState description="Seed demo data with pnpm db:seed." title="No projects found" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardContent>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <Link
                      className="focus-ring rounded text-xl font-semibold text-slate-50 hover:text-accent"
                      href={`/projects/${project.id}`}
                    >
                      {project.name}
                    </Link>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {project.description ?? "Synthetic local evaluation project."}
                    </p>
                  </div>
                  <span className="rounded-full border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-300">
                    {project.targets.length} targets
                  </span>
                </div>
                <dl className="mt-6 grid gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <dt className="text-slate-500">Owner</dt>
                    <dd className="mt-1 text-slate-200">
                      {project.owner.name ?? project.owner.email}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Runs</dt>
                    <dd className="mt-1 text-slate-200">{project.evaluationRuns.length}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Created</dt>
                    <dd className="mt-1 text-slate-200">{formatDateTime(project.createdAt)}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}
