import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { ReportPreview } from "@/components/report-preview";
import { Tabs } from "@/components/ui/tabs";
import { loadDbData, prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const { data: reports, dbReady } = await loadDbData(
    () =>
      prisma.report.findMany({
        orderBy: { createdAt: "desc" },
        take: 12,
      }),
    [],
  );

  const groupedReports = ["json", "markdown", "html"].map((format) => ({
    id: `reports-${format}`,
    label: format.toUpperCase(),
    content: (
      <div className="grid gap-4 p-4">
        {reports.filter((report) => report.format === format).length === 0 ? (
          <p className="text-sm text-slate-400">No {format} reports found.</p>
        ) : (
          reports
            .filter((report) => report.format === format)
            .map((report) => <ReportPreview key={report.id} report={report} />)
        )}
      </div>
    ),
  }));

  return (
    <AppShell>
      <PageHeader
        description="Latest generated JSON, Markdown, and HTML report records from persisted evaluation runs."
        eyebrow="Reports"
        title="Reports"
      />
      {!dbReady || reports.length === 0 ? (
        <EmptyState
          description="Run a demo evaluation or seed demo data with pnpm db:seed."
          title="No reports found"
        />
      ) : (
        <Tabs items={groupedReports} />
      )}
    </AppShell>
  );
}
