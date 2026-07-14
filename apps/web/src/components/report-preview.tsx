"use client";

import { useState } from "react";
import { formatDateTime, truncateMiddle } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export interface ReportPreviewData {
  readonly id: string;
  readonly runId: string;
  readonly format: string;
  readonly title: string;
  readonly content: string;
  readonly createdAt: Date | string;
}

const formatLabels: Record<string, string> = {
  json:     "JSON",
  markdown: "Markdown",
  html:     "HTML",
};

const formatColors: Record<string, string> = {
  json:     "border-sky-400/30 text-sky-300 bg-sky-400/8",
  markdown: "border-violet-400/30 text-violet-300 bg-violet-400/8",
  html:     "border-amber-400/30 text-amber-300 bg-amber-400/8",
};

export function ReportPreview({ report }: { readonly report: ReportPreviewData }) {
  const [expanded, setExpanded] = useState(false);

  const maxLen = 1200;
  const rawPreview =
    report.format === "json"
      ? truncateMiddle(report.content, maxLen)
      : report.content.slice(0, maxLen);
  const preview = expanded ? report.content : rawPreview;
  const isTruncated = report.content.length > maxLen;

  function handleDownload() {
    const ext = report.format === "markdown" ? "md" : report.format;
    const mime =
      report.format === "json"
        ? "application/json"
        : report.format === "html"
          ? "text/html"
          : "text/markdown";

    const blob = new Blob([report.content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agentguard-report-${report.runId.slice(0, 8)}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>{report.title}</CardTitle>
            <p className="mt-1 text-xs text-slate-500">
              Run {report.runId.slice(0, 12)}… · {formatDateTime(report.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${
                formatColors[report.format] ?? "border-slate-700 text-slate-300 bg-slate-800"
              }`}
            >
              {formatLabels[report.format] ?? report.format}
            </span>
            <button
              onClick={handleDownload}
              className="focus-ring inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:border-slate-500 hover:bg-slate-800 hover:text-slate-100"
              aria-label={`Download ${report.format} report`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3.5 w-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline strokeLinecap="round" strokeLinejoin="round" points="7 10 12 15 17 10" />
                <line strokeLinecap="round" x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <pre className="max-h-80 overflow-auto rounded-lg border border-slate-800 bg-slate-950 p-4 text-xs leading-5 text-slate-300 font-mono">
          {preview}
          {isTruncated && !expanded && (
            <span className="text-slate-600">{"\n"}… (truncated)</span>
          )}
        </pre>
        {isTruncated && (
          <button
            onClick={() => setExpanded((e) => !e)}
            className="focus-ring mt-2 text-xs text-accent hover:underline"
          >
            {expanded ? "Show less ↑" : "Show full report ↓"}
          </button>
        )}
      </CardContent>
    </Card>
  );
}
