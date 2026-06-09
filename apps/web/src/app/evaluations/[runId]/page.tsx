import { AppShell } from "@/components/app-shell";
import { EmptyState } from "@/components/empty-state";
import { EvidencePanel } from "@/components/evidence-panel";
import { FindingsTable } from "@/components/findings-table";
import { PageHeader } from "@/components/page-header";
import { ReportPreview } from "@/components/report-preview";
import { ScoreRing } from "@/components/score-ring";
import { SeverityBadge } from "@/components/severity-badge";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, Td, Th } from "@/components/ui/table";
import { getEvaluationRunWithDetails } from "@agentguard/db";
import { formatCategory, formatDateTime, formatScore } from "@/lib/format";
import { loadDbData } from "@/lib/db";

export const dynamic = "force-dynamic";

interface RunSummary {
  readonly total: number;
  readonly passed: number;
  readonly failed: number;
  readonly needsReview: number;
  readonly score: number;
  readonly critical: number;
  readonly high: number;
  readonly medium: number;
  readonly low: number;
}

function summaryFromJson(value: unknown, fallbackScore: number): RunSummary {
  if (typeof value === "object" && value !== null) {
    const record = value as Record<string, unknown>;
    return {
      total: numberFromJson(record["total"]),
      passed: numberFromJson(record["passed"]),
      failed: numberFromJson(record["failed"]),
      needsReview: numberFromJson(record["needsReview"]),
      score: numberFromJson(record["score"], fallbackScore),
      critical: numberFromJson(record["critical"]),
      high: numberFromJson(record["high"]),
      medium: numberFromJson(record["medium"]),
      low: numberFromJson(record["low"]),
    };
  }

  return {
    total: 0,
    passed: 0,
    failed: 0,
    needsReview: 0,
    score: fallbackScore,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };
}

function numberFromJson(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export default async function EvaluationResultPage({
  params,
}: {
  readonly params: Promise<{ runId: string }>;
}) {
  const { runId } = await params;
  const { data: run, dbReady } = await loadDbData(() => getEvaluationRunWithDetails(runId), null);

  if (!dbReady || run === null) {
    return (
      <AppShell>
        <EmptyState
          description="Seed demo data with pnpm db:seed or run a demo evaluation from the dashboard."
          title="Evaluation run was not found"
        />
      </AppShell>
    );
  }

  const summary = summaryFromJson(run.summaryJson, run.score);

  return (
    <AppShell>
      <PageHeader
        description={`Target: ${run.target.name}. Project: ${run.project.name}. Started ${formatDateTime(run.startedAt)}.`}
        eyebrow="Evaluation"
        title={run.id}
      />
      <div className="grid gap-6">
        <Card>
          <CardContent className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-5">
              <ScoreRing score={run.score} />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={run.status} />
                  <span className="text-sm text-slate-500">{formatScore(run.score)}</span>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-8 gap-y-3 text-sm sm:grid-cols-4">
                  <SummaryItem label="Passed" value={summary.passed} />
                  <SummaryItem label="Failed" value={summary.failed} />
                  <SummaryItem label="Needs review" value={summary.needsReview} />
                  <SummaryItem label="Total" value={summary.total} />
                </dl>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <SeverityCount label="Critical" severity="critical" value={summary.critical} />
              <SeverityCount label="High" severity="high" value={summary.high} />
              <SeverityCount label="Medium" severity="medium" value={summary.medium} />
              <SeverityCount label="Low" severity="low" value={summary.low} />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <thead>
                <tr>
                  <Th>Test case</Th>
                  <Th>Category</Th>
                  <Th>Severity</Th>
                  <Th>Status</Th>
                  <Th>Score</Th>
                  <Th>Reason</Th>
                </tr>
              </thead>
              <tbody>
                {run.results.map((result) => (
                  <tr className="hover:bg-slate-900/45" key={result.id}>
                    <Td>
                      <a
                        className="focus-ring rounded font-semibold text-accent hover:underline"
                        href={`#${result.testCaseId}`}
                      >
                        {result.testCaseId}
                      </a>
                    </Td>
                    <Td>{formatCategory(result.category)}</Td>
                    <Td>
                      <SeverityBadge severity={result.severity} />
                    </Td>
                    <Td>
                      <StatusBadge status={result.status} />
                    </Td>
                    <Td>{result.score}/100</Td>
                    <Td className="max-w-lg text-slate-400">{result.reason}</Td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Findings</CardTitle>
          </CardHeader>
          <CardContent>
            <FindingsTable findings={run.findings} />
          </CardContent>
        </Card>

        <section className="grid gap-4">
          <h2 className="text-lg font-semibold text-slate-50">Evidence</h2>
          {run.results.map((result) => (
            <div id={result.testCaseId} key={result.id}>
              <EvidencePanel result={result} />
            </div>
          ))}
        </section>

        <section className="grid gap-4">
          <h2 className="text-lg font-semibold text-slate-50">Reports</h2>
          <div className="grid gap-4">
            {run.reports.map((report) => (
              <ReportPreview key={report.id} report={report} />
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function SummaryItem({ label, value }: { readonly label: string; readonly value: number }) {
  return (
    <div>
      <dt className="text-slate-500">{label}</dt>
      <dd className="mt-1 text-lg font-semibold text-slate-50">{value}</dd>
    </div>
  );
}

function SeverityCount({
  label,
  severity,
  value,
}: {
  readonly label: string;
  readonly severity: string;
  readonly value: number;
}) {
  return (
    <div className="rounded-md border border-slate-800 bg-slate-950/40 p-3">
      <dt className="mb-2">
        <SeverityBadge severity={severity} />
      </dt>
      <dd className="text-lg font-semibold text-slate-50">
        {value} <span className="text-xs font-normal text-slate-500">{label}</span>
      </dd>
    </div>
  );
}
