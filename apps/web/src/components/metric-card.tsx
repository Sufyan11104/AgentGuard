import type { ReactNode } from "react";
import { Card, CardContent } from "./ui/card";

export function MetricCard({
  label,
  value,
  detail,
}: {
  readonly label: string;
  readonly value: ReactNode;
  readonly detail?: string;
}) {
  return (
    <Card>
      <CardContent>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        <div className="mt-3 text-3xl font-semibold text-slate-50">{value}</div>
        {detail !== undefined ? <p className="mt-2 text-sm text-slate-400">{detail}</p> : null}
      </CardContent>
    </Card>
  );
}
