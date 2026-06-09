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

export function FindingsTable({ findings }: { readonly findings: readonly FindingTableRow[] }) {
  if (findings.length === 0) {
    return <p className="text-sm text-slate-400">No open or review findings.</p>;
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
        {findings.map((finding) => (
          <tr className="hover:bg-slate-900/45" key={finding.id}>
            <Td>
              <Link
                className="focus-ring rounded font-semibold text-accent hover:underline"
                href={`/findings/${finding.id}`}
              >
                {finding.title}
              </Link>
              <div className="mt-1 text-xs text-slate-500">Run {finding.runId}</div>
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
