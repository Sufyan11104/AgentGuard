import Link from "next/link";
import { formatCategory, formatDateTime } from "@/lib/format";
import { SeverityBadge } from "./severity-badge";
import { StatusBadge } from "./status-badge";
import { Table, Td, Th } from "./ui/table";

export interface FindingTableRow {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly severity: string;
  readonly status: string;
  readonly createdAt: Date | string;
  readonly runId: string;
}

const severityRowAccent: Record<string, string> = {
  critical: "border-l-2 border-l-red-400/60",
  high:     "border-l-2 border-l-orange-400/50",
  medium:   "border-l-2 border-l-amber-400/40",
  low:      "border-l-2 border-l-sky-400/40",
};

export function FindingsTable({ findings }: { readonly findings: readonly FindingTableRow[] }) {
  if (findings.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/20 bg-emerald-400/8 text-emerald-400">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 12 2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-slate-300">No open or review findings</p>
        <p className="text-xs text-slate-500">All checks passed or no evaluations have been run yet.</p>
      </div>
    );
  }

  return (
    <Table>
      <thead>
        <tr>
          <Th>Finding</Th>
          <Th>Category</Th>
          <Th>Severity</Th>
          <Th>Status</Th>
          <Th>Created</Th>
        </tr>
      </thead>
      <tbody>
        {findings.map((finding, i) => (
          <tr
            className={`group transition-colors hover:bg-slate-900/60 ${severityRowAccent[finding.severity] ?? ""}`}
            key={finding.id}
            style={{ animation: `slideInRow 0.3s ease both`, animationDelay: `${i * 40}ms` }}
          >
            <Td>
              <Link
                className="focus-ring rounded font-semibold text-accent transition-colors hover:text-accent/80 hover:underline"
                href={`/findings/${finding.id}`}
              >
                {finding.title}
              </Link>
              <div className="mt-1 text-xs text-slate-500">Run {finding.runId.slice(0, 12)}…</div>
              {/* Inline preview on hover */}
              <div className="mt-1 hidden text-xs text-slate-400 group-hover:block">
                {formatCategory(finding.category)} — {formatDateTime(finding.createdAt)}
              </div>
            </Td>
            <Td>{formatCategory(finding.category)}</Td>
            <Td>
              <SeverityBadge severity={finding.severity} />
            </Td>
            <Td>
              <StatusBadge status={finding.status} />
            </Td>
            <Td>{formatDateTime(finding.createdAt)}</Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
