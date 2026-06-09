import type { ReactNode } from "react";
import { Card, CardContent } from "./ui/card";

export function EmptyState({
  title,
  description,
  action,
}: {
  readonly title: string;
  readonly description: string;
  readonly action?: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="py-10 text-center">
        <div className="mx-auto mb-4 h-10 w-10 rounded-md border border-slate-700 bg-slate-900" />
        <h2 className="text-lg font-semibold text-slate-50">{title}</h2>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">{description}</p>
        {action !== undefined ? <div className="mt-5 flex justify-center">{action}</div> : null}
      </CardContent>
    </Card>
  );
}
