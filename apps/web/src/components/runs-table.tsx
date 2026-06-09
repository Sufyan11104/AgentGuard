import Link from "next/link";
import { formatDateTime, formatDuration, formatScore } from "@/lib/format";
import { ScoreRing } from "./score-ring";
import { StatusBadge } from "./status-badge";
import { Table, Td, Th } from "./ui/table";

export interface RunTableRow {
  readonly id: string;
  readonly status: string;
  readonly score: number;
  readonly startedAt: Date | string;
  readonly completedAt: Date | string;
  readonly target?: {
    readonly name: string;
    readonly type: string;
  } | null;
}

export function RunsTable({ runs }: { readonly runs: readonly RunTableRow[] }) {
  if (runs.length === 0) {
    return <p className="text-sm text-slate-400">No evaluation runs yet.</p>;
  }

  return (
    <Table>
      <thead>
        <tr>
          <Th>Run</Th>
          <Th>Target</Th>
          <Th>Status</Th>
          <Th>Score</Th>
          <Th>Started</Th>
          <Th>Duration</Th>
        </tr>
      </thead>
      <tbody>
        {runs.map((run) => (
          <tr className="hover:bg-slate-900/45" key={run.id}>
            <Td>
              <Link
                className="focus-ring rounded text-sm font-semibold text-accent hover:underline"
                href={`/evaluations/${run.id}`}
              >
                {run.id}
              </Link>
            </Td>
            <Td>
              <div className="font-medium text-slate-100">
                {run.target?.name ?? "Unknown target"}
              </div>
              <div className="mt-1 text-xs text-slate-500">{run.target?.type ?? "unknown"}</div>
            </Td>
            <Td>
              <StatusBadge status={run.status} />
            </Td>
            <Td>
              <div className="flex items-center gap-3">
                <ScoreRing score={run.score} size="small" />
                <span className="font-semibold text-slate-50">{formatScore(run.score)}</span>
              </div>
            </Td>
            <Td>{formatDateTime(run.startedAt)}</Td>
            <Td>{formatDuration(run.startedAt, run.completedAt)}</Td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
