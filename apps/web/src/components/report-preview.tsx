import { truncateMiddle } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export interface ReportPreviewData {
  readonly id: string;
  readonly runId: string;
  readonly format: string;
  readonly title: string;
  readonly content: string;
  readonly createdAt: Date | string;
}

export function ReportPreview({ report }: { readonly report: ReportPreviewData }) {
  const preview =
    report.format === "json" ? truncateMiddle(report.content, 1200) : report.content.slice(0, 1200);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{report.title}</CardTitle>
        <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
          {report.format} report for run {report.runId}
        </p>
      </CardHeader>
      <CardContent>
        <pre className="max-h-96 overflow-auto rounded-md border border-slate-800 bg-slate-950 p-4 text-xs leading-5 text-slate-300">
          {preview}
        </pre>
      </CardContent>
    </Card>
  );
}
