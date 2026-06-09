import Link from "next/link";
import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { SeverityBadge } from "@/components/severity-badge";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCategory, formatDateTime } from "@/lib/format";
import { loadDbData, prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function FindingDetailPage({
  params,
}: {
  readonly params: Promise<{ findingId: string }>;
}) {
  const { findingId } = await params;
  const { data: finding, dbReady } = await loadDbData(
    () =>
      prisma.finding.findUnique({
        where: { id: findingId },
        include: {
          run: {
            include: {
              project: true,
              target: true,
            },
          },
        },
      }),
    null,
  );

  if (!dbReady || finding === null) {
    return (
      <AppShell>
        <EmptyState
          description="Seed demo data with pnpm db:seed or run a vulnerable demo evaluation."
          title="Finding was not found"
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader
        description={`Related run ${finding.runId} for ${finding.run.target.name}.`}
        eyebrow="Finding"
        title={finding.title}
      />
      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <Card>
          <CardHeader>
            <CardTitle>Classification</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid gap-4 text-sm">
              <Detail label="Severity" value={<SeverityBadge severity={finding.severity} />} />
              <Detail label="Status" value={<StatusBadge status={finding.status} />} />
              <Detail label="Category" value={formatCategory(finding.category)} />
              <Detail label="Created" value={formatDateTime(finding.createdAt)} />
              <Detail
                label="Related run"
                value={
                  <Link
                    className="focus-ring rounded text-accent hover:underline"
                    href={`/evaluations/${finding.runId}`}
                  >
                    {finding.runId}
                  </Link>
                }
              />
              <Detail label="Project" value={finding.run.project.name} />
            </dl>
          </CardContent>
        </Card>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-slate-300">{finding.summary}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Evidence JSON</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="max-h-[34rem] overflow-auto rounded-md border border-slate-800 bg-slate-950 p-4 text-xs leading-5 text-slate-300">
                {JSON.stringify(finding.evidenceJson, null, 2)}
              </pre>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Remediation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-6 text-slate-300">{finding.remediation}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function Detail({ label, value }: { readonly label: string; readonly value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-2 text-slate-100">{value}</dd>
    </div>
  );
}
