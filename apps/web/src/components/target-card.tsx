import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import { StatusBadge } from "./status-badge";

export interface TargetCardData {
  readonly id: string;
  readonly projectId: string;
  readonly name: string;
  readonly type: string;
  readonly model?: string | null;
  readonly endpoint?: string | null;
  readonly evaluationRuns?: readonly {
    readonly status: string;
    readonly score: number;
  }[];
}

export function TargetCard({ target }: { readonly target: TargetCardData }) {
  const latestRun = target.evaluationRuns?.[0];

  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-semibold text-slate-50">{target.name}</h3>
            <p className="mt-1 text-sm text-slate-400">{target.type}</p>
          </div>
          {latestRun !== undefined ? <StatusBadge status={latestRun.status} /> : null}
        </div>
        <dl className="mt-5 grid gap-3 text-sm">
          <div>
            <dt className="text-slate-500">Model</dt>
            <dd className="mt-1 text-slate-200">{target.model ?? "Mock adapter"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Endpoint</dt>
            <dd className="mt-1 break-all text-slate-200">
              {target.endpoint ?? "Local synthetic target"}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Latest score</dt>
            <dd className="mt-1 text-slate-200">
              {latestRun !== undefined ? `${latestRun.score}/100` : "No runs yet"}
            </dd>
          </div>
        </dl>
        <Link
          className="focus-ring mt-5 inline-flex rounded-md border border-slate-700 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-900"
          href={`/projects/${target.projectId}/evaluations/new?targetType=${target.type}`}
        >
          Run evaluation
        </Link>
      </CardContent>
    </Card>
  );
}
